import Foundation

actor WeatherService {
    static let shared = WeatherService()

    private let session: URLSession
    private let baseURL = "https://api.open-meteo.com/v1/forecast"

    private init() {
        let config = URLSessionConfiguration.default
        config.timeoutIntervalForRequest = 30
        config.waitsForConnectivity = true
        self.session = URLSession(configuration: config)
    }

    func fetchWeather(latitude: Double, longitude: Double) async throws -> WeatherData {
        let response = try await fetchOpenMeteoData(latitude: latitude, longitude: longitude)
        return transformWeatherData(response: response, latitude: latitude, longitude: longitude)
    }

    // MARK: - API Call

    private func fetchOpenMeteoData(latitude: Double, longitude: Double) async throws -> OpenMeteoResponse {
        var components = URLComponents(string: baseURL)!
        components.queryItems = [
            URLQueryItem(name: "latitude", value: String(latitude)),
            URLQueryItem(name: "longitude", value: String(longitude)),
            URLQueryItem(name: "current", value: [
                "temperature_2m", "relative_humidity_2m", "apparent_temperature",
                "is_day", "precipitation", "rain", "showers", "snowfall",
                "weather_code", "cloud_cover", "pressure_msl", "surface_pressure",
                "wind_speed_10m", "wind_direction_10m", "wind_gusts_10m"
            ].joined(separator: ",")),
            URLQueryItem(name: "hourly", value: [
                "temperature_2m", "relative_humidity_2m", "dew_point_2m",
                "apparent_temperature", "precipitation_probability", "precipitation",
                "rain", "showers", "snowfall", "weather_code", "cloud_cover",
                "visibility", "wind_speed_10m", "wind_direction_10m", "wind_gusts_10m",
                "uv_index", "is_day"
            ].joined(separator: ",")),
            URLQueryItem(name: "daily", value: [
                "weather_code", "temperature_2m_max", "temperature_2m_min",
                "apparent_temperature_max", "apparent_temperature_min",
                "sunrise", "sunset", "uv_index_max", "precipitation_sum",
                "rain_sum", "showers_sum", "snowfall_sum", "precipitation_hours",
                "precipitation_probability_max", "wind_speed_10m_max",
                "wind_gusts_10m_max", "wind_direction_10m_dominant"
            ].joined(separator: ",")),
            URLQueryItem(name: "timezone", value: "auto"),
            URLQueryItem(name: "forecast_days", value: "7"),
            URLQueryItem(name: "forecast_hours", value: "48"),
        ]

        guard let url = components.url else {
            throw WeatherError.invalidURL
        }

        let (data, response) = try await session.data(from: url)

        guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 else {
            throw WeatherError.serverError
        }

        let decoder = JSONDecoder()
        return try decoder.decode(OpenMeteoResponse.self, from: data)
    }

    // MARK: - Data Transformation

    private func transformWeatherData(response: OpenMeteoResponse, latitude: Double, longitude: Double) -> WeatherData {
        let location = SavedLocation(
            id: "fetched",
            name: "",
            displayName: "",
            coordinates: Coordinates(latitude: latitude, longitude: longitude),
            isCurrentLocation: false,
            country: nil,
            state: nil,
            timezone: response.timezone
        )

        let current = transformCurrentConditions(response: response)
        let hourly = transformHourlyForecast(response: response)
        let daily = transformDailyForecast(response: response)

        return WeatherData(
            location: location,
            current: current,
            hourly: hourly,
            daily: daily,
            minutely: nil,
            alerts: [],
            lastUpdated: Date()
        )
    }

    private func transformCurrentConditions(response: OpenMeteoResponse) -> CurrentConditions {
        guard let current = response.current else {
            return defaultCurrentConditions()
        }

        let code = WeatherCode(rawValue: current.weatherCode) ?? .clearSky
        let isDay = current.isDay == 1

        // Find UV index and dew point from hourly data (current hour)
        var uvIndex: Double = 0
        var dewPoint: Double = 0
        var visibility: Double = 10

        if let hourly = response.hourly, !hourly.time.isEmpty {
            let formatter = ISO8601DateFormatter()
            formatter.formatOptions = [.withFullDate, .withTime, .withDashSeparatorInDate, .withColonSeparatorInTime]
            let now = Date()

            // Find the closest hourly index
            var closestIndex = 0
            var closestDiff = Double.infinity
            for (i, timeStr) in hourly.time.enumerated() {
                if let date = parseOpenMeteoDate(timeStr) {
                    let diff = abs(date.timeIntervalSince(now))
                    if diff < closestDiff {
                        closestDiff = diff
                        closestIndex = i
                    }
                }
            }

            if closestIndex < hourly.uvIndex.count {
                uvIndex = hourly.uvIndex[closestIndex]
            }
            if closestIndex < hourly.dewPoint2m.count {
                dewPoint = hourly.dewPoint2m[closestIndex]
            }
            if closestIndex < hourly.visibility.count {
                visibility = hourly.visibility[closestIndex] / 1000.0 // meters to km
            }
        }

        return CurrentConditions(
            temperature: current.temperature2m,
            feelsLike: current.apparentTemperature,
            humidity: current.relativeHumidity2m,
            dewPoint: dewPoint,
            pressure: current.pressureMsl,
            windSpeed: current.windSpeed10m,
            windDirection: current.windDirection10m,
            windGust: current.windGusts10m,
            visibility: visibility,
            uvIndex: uvIndex,
            cloudCover: current.cloudCover,
            weatherCode: code,
            summary: code.summary,
            icon: code.icon(isDay: isDay),
            isDay: isDay,
            precipitationProbability: 0,
            precipitation: current.precipitation
        )
    }

    private func transformHourlyForecast(response: OpenMeteoResponse) -> [HourlyForecast] {
        guard let hourly = response.hourly else { return [] }

        var forecasts: [HourlyForecast] = []
        let count = min(48, hourly.time.count)

        for i in 0..<count {
            guard let time = parseOpenMeteoDate(hourly.time[i]) else { continue }
            let code = WeatherCode(rawValue: hourly.weatherCode[i]) ?? .clearSky
            let isDay = hourly.isDay[i] == 1

            forecasts.append(HourlyForecast(
                time: time,
                temperature: hourly.temperature2m[i],
                feelsLike: hourly.apparentTemperature[i],
                humidity: hourly.relativeHumidity2m[i],
                precipitationProbability: hourly.precipitationProbability[i],
                precipitation: hourly.precipitation[i],
                weatherCode: code,
                icon: code.icon(isDay: isDay),
                windSpeed: hourly.windSpeed10m[i],
                windDirection: hourly.windDirection10m[i],
                isDay: isDay
            ))
        }

        return forecasts
    }

    private func transformDailyForecast(response: OpenMeteoResponse) -> [DailyForecast] {
        guard let daily = response.daily else { return [] }

        var forecasts: [DailyForecast] = []
        let count = min(7, daily.time.count)

        for i in 0..<count {
            guard let date = parseOpenMeteoDate(daily.time[i]),
                  let sunrise = parseOpenMeteoDate(daily.sunrise[i]),
                  let sunset = parseOpenMeteoDate(daily.sunset[i]) else { continue }

            let code = WeatherCode(rawValue: daily.weatherCode[i]) ?? .clearSky

            forecasts.append(DailyForecast(
                date: date,
                temperatureMax: daily.temperature2mMax[i],
                temperatureMin: daily.temperature2mMin[i],
                sunrise: sunrise,
                sunset: sunset,
                precipitationProbability: daily.precipitationProbabilityMax[i],
                precipitationSum: daily.precipitationSum[i],
                weatherCode: code,
                icon: code.icon(isDay: true),
                summary: code.summary,
                uvIndexMax: daily.uvIndexMax[i],
                windSpeedMax: daily.windSpeed10mMax[i],
                windDirection: daily.windDirection10mDominant[i]
            ))
        }

        return forecasts
    }

    private func defaultCurrentConditions() -> CurrentConditions {
        CurrentConditions(
            temperature: 0, feelsLike: 0, humidity: 0, dewPoint: 0,
            pressure: 1013, windSpeed: 0, windDirection: 0, windGust: nil,
            visibility: 10, uvIndex: 0, cloudCover: 0,
            weatherCode: .clearSky, summary: "Unknown", icon: .cloudy,
            isDay: true, precipitationProbability: 0, precipitation: 0
        )
    }

    private func parseOpenMeteoDate(_ string: String) -> Date? {
        let formatter = DateFormatter()
        formatter.locale = Locale(identifier: "en_US_POSIX")

        // Try ISO format with time
        formatter.dateFormat = "yyyy-MM-dd'T'HH:mm"
        if let date = formatter.date(from: string) { return date }

        // Try date-only format
        formatter.dateFormat = "yyyy-MM-dd"
        return formatter.date(from: string)
    }
}

// MARK: - Errors

enum WeatherError: LocalizedError {
    case invalidURL
    case serverError
    case decodingError
    case noData

    var errorDescription: String? {
        switch self {
        case .invalidURL: return "Invalid request URL"
        case .serverError: return "Weather server is unavailable"
        case .decodingError: return "Failed to process weather data"
        case .noData: return "No weather data available"
        }
    }
}
