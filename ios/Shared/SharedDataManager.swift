import Foundation

/// Manages shared data between the main app and widget extension via App Group UserDefaults.
final class SharedDataManager {
    static let shared = SharedDataManager()

    private let suiteName = "group.com.darthsky.weather"
    private let weatherDataKey = "shared_weather_data"
    private let settingsKey = "shared_settings"
    private let locationKey = "shared_location"
    private let lastUpdateKey = "shared_last_update"

    private var defaults: UserDefaults? {
        UserDefaults(suiteName: suiteName)
    }

    private init() {}

    // MARK: - Write (from main app)

    func saveWeatherData(_ data: WeatherData) {
        let shared = SharedWeatherSnapshot(
            locationName: data.location.name,
            locationDisplayName: data.location.displayName,
            latitude: data.location.coordinates.latitude,
            longitude: data.location.coordinates.longitude,
            temperature: data.current.temperature,
            feelsLike: data.current.feelsLike,
            humidity: data.current.humidity,
            dewPoint: data.current.dewPoint,
            pressure: data.current.pressure,
            windSpeed: data.current.windSpeed,
            windDirection: data.current.windDirection,
            windGust: data.current.windGust,
            visibility: data.current.visibility,
            uvIndex: data.current.uvIndex,
            cloudCover: data.current.cloudCover,
            weatherCodeRaw: data.current.weatherCode.rawValue,
            summary: data.current.summary,
            isDay: data.current.isDay,
            precipitationProbability: data.current.precipitationProbability,
            precipitation: data.current.precipitation,
            hourly: data.hourly.prefix(24).map { h in
                SharedHourlyEntry(
                    timestamp: h.time.timeIntervalSince1970,
                    temperature: h.temperature,
                    precipitationProbability: h.precipitationProbability,
                    precipitation: h.precipitation,
                    weatherCodeRaw: h.weatherCode.rawValue,
                    windSpeed: h.windSpeed,
                    windDirection: h.windDirection,
                    isDay: h.isDay
                )
            },
            daily: data.daily.map { d in
                SharedDailyEntry(
                    timestamp: d.date.timeIntervalSince1970,
                    temperatureMax: d.temperatureMax,
                    temperatureMin: d.temperatureMin,
                    sunriseTimestamp: d.sunrise.timeIntervalSince1970,
                    sunsetTimestamp: d.sunset.timeIntervalSince1970,
                    precipitationProbability: d.precipitationProbability,
                    precipitationSum: d.precipitationSum,
                    weatherCodeRaw: d.weatherCode.rawValue,
                    uvIndexMax: d.uvIndexMax,
                    windSpeedMax: d.windSpeedMax,
                    windDirection: d.windDirection
                )
            },
            lastUpdated: data.lastUpdated.timeIntervalSince1970
        )

        if let encoded = try? JSONEncoder().encode(shared) {
            defaults?.set(encoded, forKey: weatherDataKey)
        }
    }

    func saveSettings(_ units: UnitPreferences) {
        if let encoded = try? JSONEncoder().encode(units) {
            defaults?.set(encoded, forKey: settingsKey)
        }
    }

    // MARK: - Read (from widget)

    func loadWeatherSnapshot() -> SharedWeatherSnapshot? {
        guard let data = defaults?.data(forKey: weatherDataKey) else { return nil }
        return try? JSONDecoder().decode(SharedWeatherSnapshot.self, from: data)
    }

    func loadSettings() -> UnitPreferences {
        guard let data = defaults?.data(forKey: settingsKey),
              let units = try? JSONDecoder().decode(UnitPreferences.self, from: data) else {
            return .defaults
        }
        return units
    }

    var lastUpdate: Date? {
        guard let snapshot = loadWeatherSnapshot() else { return nil }
        return Date(timeIntervalSince1970: snapshot.lastUpdated)
    }
}

// MARK: - Shared Data Structures (Codable for serialization)

struct SharedWeatherSnapshot: Codable {
    let locationName: String
    let locationDisplayName: String
    let latitude: Double
    let longitude: Double

    // Current conditions
    let temperature: Double
    let feelsLike: Double
    let humidity: Double
    let dewPoint: Double
    let pressure: Double
    let windSpeed: Double
    let windDirection: Double
    let windGust: Double?
    let visibility: Double
    let uvIndex: Double
    let cloudCover: Double
    let weatherCodeRaw: Int
    let summary: String
    let isDay: Bool
    let precipitationProbability: Double
    let precipitation: Double

    // Forecasts
    let hourly: [SharedHourlyEntry]
    let daily: [SharedDailyEntry]

    let lastUpdated: Double

    // Computed helpers
    var weatherCode: WeatherCode {
        WeatherCode(rawValue: weatherCodeRaw) ?? .clearSky
    }

    var icon: WeatherIconType {
        weatherCode.icon(isDay: isDay)
    }

    var todayForecast: SharedDailyEntry? {
        daily.first
    }

    var sunrise: Date? {
        daily.first.map { Date(timeIntervalSince1970: $0.sunriseTimestamp) }
    }

    var sunset: Date? {
        daily.first.map { Date(timeIntervalSince1970: $0.sunsetTimestamp) }
    }
}

struct SharedHourlyEntry: Codable {
    let timestamp: Double
    let temperature: Double
    let precipitationProbability: Double
    let precipitation: Double
    let weatherCodeRaw: Int
    let windSpeed: Double
    let windDirection: Double
    let isDay: Bool

    var time: Date { Date(timeIntervalSince1970: timestamp) }

    var weatherCode: WeatherCode {
        WeatherCode(rawValue: weatherCodeRaw) ?? .clearSky
    }

    var icon: WeatherIconType {
        weatherCode.icon(isDay: isDay)
    }
}

struct SharedDailyEntry: Codable {
    let timestamp: Double
    let temperatureMax: Double
    let temperatureMin: Double
    let sunriseTimestamp: Double
    let sunsetTimestamp: Double
    let precipitationProbability: Double
    let precipitationSum: Double
    let weatherCodeRaw: Int
    let uvIndexMax: Double
    let windSpeedMax: Double
    let windDirection: Double

    var date: Date { Date(timeIntervalSince1970: timestamp) }
    var sunrise: Date { Date(timeIntervalSince1970: sunriseTimestamp) }
    var sunset: Date { Date(timeIntervalSince1970: sunsetTimestamp) }

    var weatherCode: WeatherCode {
        WeatherCode(rawValue: weatherCodeRaw) ?? .clearSky
    }

    var icon: WeatherIconType {
        weatherCode.icon(isDay: true)
    }

    var summary: String {
        weatherCode.summary
    }
}
