import Foundation

// MARK: - Open-Meteo API Response

struct OpenMeteoResponse: Decodable {
    let latitude: Double
    let longitude: Double
    let generationtimeMs: Double
    let utcOffsetSeconds: Int
    let timezone: String
    let timezoneAbbreviation: String
    let elevation: Double
    let current: OpenMeteoCurrent?
    let hourly: OpenMeteoHourly?
    let daily: OpenMeteoDaily?

    enum CodingKeys: String, CodingKey {
        case latitude, longitude, elevation, timezone, current, hourly, daily
        case generationtimeMs = "generationtime_ms"
        case utcOffsetSeconds = "utc_offset_seconds"
        case timezoneAbbreviation = "timezone_abbreviation"
    }
}

struct OpenMeteoCurrent: Decodable {
    let time: String
    let interval: Int
    let temperature2m: Double
    let relativeHumidity2m: Double
    let apparentTemperature: Double
    let isDay: Int
    let precipitation: Double
    let rain: Double
    let showers: Double
    let snowfall: Double
    let weatherCode: Int
    let cloudCover: Double
    let pressureMsl: Double
    let surfacePressure: Double
    let windSpeed10m: Double
    let windDirection10m: Double
    let windGusts10m: Double

    enum CodingKeys: String, CodingKey {
        case time, interval, precipitation, rain, showers, snowfall
        case temperature2m = "temperature_2m"
        case relativeHumidity2m = "relative_humidity_2m"
        case apparentTemperature = "apparent_temperature"
        case isDay = "is_day"
        case weatherCode = "weather_code"
        case cloudCover = "cloud_cover"
        case pressureMsl = "pressure_msl"
        case surfacePressure = "surface_pressure"
        case windSpeed10m = "wind_speed_10m"
        case windDirection10m = "wind_direction_10m"
        case windGusts10m = "wind_gusts_10m"
    }
}

struct OpenMeteoHourly: Decodable {
    let time: [String]
    let temperature2m: [Double]
    let relativeHumidity2m: [Double]
    let dewPoint2m: [Double]
    let apparentTemperature: [Double]
    let precipitationProbability: [Double]
    let precipitation: [Double]
    let rain: [Double]
    let showers: [Double]
    let snowfall: [Double]
    let weatherCode: [Int]
    let cloudCover: [Double]
    let visibility: [Double]
    let windSpeed10m: [Double]
    let windDirection10m: [Double]
    let windGusts10m: [Double]
    let uvIndex: [Double]
    let isDay: [Int]

    enum CodingKeys: String, CodingKey {
        case time, precipitation, rain, showers, snowfall, visibility
        case temperature2m = "temperature_2m"
        case relativeHumidity2m = "relative_humidity_2m"
        case dewPoint2m = "dew_point_2m"
        case apparentTemperature = "apparent_temperature"
        case precipitationProbability = "precipitation_probability"
        case weatherCode = "weather_code"
        case cloudCover = "cloud_cover"
        case windSpeed10m = "wind_speed_10m"
        case windDirection10m = "wind_direction_10m"
        case windGusts10m = "wind_gusts_10m"
        case uvIndex = "uv_index"
        case isDay = "is_day"
    }
}

struct OpenMeteoDaily: Decodable {
    let time: [String]
    let weatherCode: [Int]
    let temperature2mMax: [Double]
    let temperature2mMin: [Double]
    let apparentTemperatureMax: [Double]
    let apparentTemperatureMin: [Double]
    let sunrise: [String]
    let sunset: [String]
    let uvIndexMax: [Double]
    let precipitationSum: [Double]
    let rainSum: [Double]
    let showersSum: [Double]
    let snowfallSum: [Double]
    let precipitationHours: [Double]
    let precipitationProbabilityMax: [Double]
    let windSpeed10mMax: [Double]
    let windGusts10mMax: [Double]
    let windDirection10mDominant: [Double]

    enum CodingKeys: String, CodingKey {
        case time, sunrise, sunset
        case weatherCode = "weather_code"
        case temperature2mMax = "temperature_2m_max"
        case temperature2mMin = "temperature_2m_min"
        case apparentTemperatureMax = "apparent_temperature_max"
        case apparentTemperatureMin = "apparent_temperature_min"
        case uvIndexMax = "uv_index_max"
        case precipitationSum = "precipitation_sum"
        case rainSum = "rain_sum"
        case showersSum = "showers_sum"
        case snowfallSum = "snowfall_sum"
        case precipitationHours = "precipitation_hours"
        case precipitationProbabilityMax = "precipitation_probability_max"
        case windSpeed10mMax = "wind_speed_10m_max"
        case windGusts10mMax = "wind_gusts_10m_max"
        case windDirection10mDominant = "wind_direction_10m_dominant"
    }
}

// MARK: - Nominatim API Response

struct NominatimResult: Decodable {
    let placeId: Int
    let licence: String
    let osmType: String
    let osmId: Int
    let lat: String
    let lon: String
    let type: String
    let placeRank: Int
    let importance: Double
    let addresstype: String
    let name: String
    let displayName: String
    let address: NominatimAddress?
    let boundingbox: [String]

    enum CodingKeys: String, CodingKey {
        case licence, type, importance, addresstype, name, address, boundingbox
        case placeId = "place_id"
        case osmType = "osm_type"
        case osmId = "osm_id"
        case lat, lon
        case placeRank = "place_rank"
        case displayName = "display_name"
    }
}

struct NominatimAddress: Decodable {
    let city: String?
    let town: String?
    let village: String?
    let municipality: String?
    let county: String?
    let state: String?
    let country: String?
    let countryCode: String?

    enum CodingKeys: String, CodingKey {
        case city, town, village, municipality, county, state, country
        case countryCode = "country_code"
    }
}

// MARK: - RainViewer API Response

struct RainViewerMapsResponse: Decodable {
    let version: String
    let generated: Int
    let host: String
    let radar: RadarFrames

    struct RadarFrames: Decodable {
        let past: [RadarFrame]
        let nowcast: [RadarFrame]
    }

    struct RadarFrame: Decodable {
        let time: Int
        let path: String
    }
}

// MARK: - Transformed Radar Data

struct RadarData: Sendable {
    let generated: Int
    let host: String
    let past: [RadarFrame]
    let nowcast: [RadarFrame]
}

struct RadarFrame: Identifiable, Sendable {
    var id: Int { timestamp }
    let timestamp: Int
    let path: String
    let tileUrl: String
}
