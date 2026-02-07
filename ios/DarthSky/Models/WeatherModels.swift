import Foundation

// MARK: - Weather Data

struct WeatherData: Sendable {
    let location: SavedLocation
    let current: CurrentConditions
    let hourly: [HourlyForecast]
    let daily: [DailyForecast]
    let minutely: [PrecipitationMinute]?
    let alerts: [WeatherAlert]
    let lastUpdated: Date
}

struct CurrentConditions: Sendable {
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
    let weatherCode: WeatherCode
    let summary: String
    let icon: WeatherIconType
    let isDay: Bool
    let precipitationProbability: Double
    let precipitation: Double
}

struct HourlyForecast: Identifiable, Sendable {
    var id: Date { time }
    let time: Date
    let temperature: Double
    let feelsLike: Double
    let humidity: Double
    let precipitationProbability: Double
    let precipitation: Double
    let weatherCode: WeatherCode
    let icon: WeatherIconType
    let windSpeed: Double
    let windDirection: Double
    let isDay: Bool
}

struct DailyForecast: Identifiable, Sendable {
    var id: Date { date }
    let date: Date
    let temperatureMax: Double
    let temperatureMin: Double
    let sunrise: Date
    let sunset: Date
    let precipitationProbability: Double
    let precipitationSum: Double
    let weatherCode: WeatherCode
    let icon: WeatherIconType
    let summary: String
    let uvIndexMax: Double
    let windSpeedMax: Double
    let windDirection: Double
}

struct PrecipitationMinute: Identifiable, Sendable {
    var id: Date { time }
    let time: Date
    let intensity: Double
    let probability: Double
}

struct WeatherAlert: Identifiable, Sendable {
    let id: String
    let event: String
    let headline: String
    let description: String
    let severity: AlertSeverity
    let urgency: AlertUrgency
    let start: Date
    let end: Date
    let areas: [String]
}

enum AlertSeverity: String, Sendable {
    case minor, moderate, severe, extreme
}

enum AlertUrgency: String, Sendable {
    case immediate, expected, future, past, unknown
}

// MARK: - Weather Codes

enum WeatherCode: Int, Sendable, CaseIterable {
    case clearSky = 0
    case mainlyClear = 1
    case partlyCloudy = 2
    case overcast = 3
    case fog = 45
    case rimeFog = 48
    case lightDrizzle = 51
    case moderateDrizzle = 53
    case denseDrizzle = 55
    case lightFreezingDrizzle = 56
    case denseFreezingDrizzle = 57
    case slightRain = 61
    case moderateRain = 63
    case heavyRain = 65
    case lightFreezingRain = 66
    case heavyFreezingRain = 67
    case slightSnow = 71
    case moderateSnow = 73
    case heavySnow = 75
    case snowGrains = 77
    case slightRainShowers = 80
    case moderateRainShowers = 81
    case violentRainShowers = 82
    case slightSnowShowers = 85
    case heavySnowShowers = 86
    case thunderstorm = 95
    case thunderstormSlightHail = 96
    case thunderstormHeavyHail = 99

    var summary: String {
        switch self {
        case .clearSky: return "Clear sky"
        case .mainlyClear: return "Mainly clear"
        case .partlyCloudy: return "Partly cloudy"
        case .overcast: return "Overcast"
        case .fog: return "Fog"
        case .rimeFog: return "Depositing rime fog"
        case .lightDrizzle: return "Light drizzle"
        case .moderateDrizzle: return "Moderate drizzle"
        case .denseDrizzle: return "Dense drizzle"
        case .lightFreezingDrizzle: return "Light freezing drizzle"
        case .denseFreezingDrizzle: return "Dense freezing drizzle"
        case .slightRain: return "Slight rain"
        case .moderateRain: return "Moderate rain"
        case .heavyRain: return "Heavy rain"
        case .lightFreezingRain: return "Light freezing rain"
        case .heavyFreezingRain: return "Heavy freezing rain"
        case .slightSnow: return "Slight snow"
        case .moderateSnow: return "Moderate snow"
        case .heavySnow: return "Heavy snow"
        case .snowGrains: return "Snow grains"
        case .slightRainShowers: return "Slight rain showers"
        case .moderateRainShowers: return "Moderate rain showers"
        case .violentRainShowers: return "Violent rain showers"
        case .slightSnowShowers: return "Slight snow showers"
        case .heavySnowShowers: return "Heavy snow showers"
        case .thunderstorm: return "Thunderstorm"
        case .thunderstormSlightHail: return "Thunderstorm with slight hail"
        case .thunderstormHeavyHail: return "Thunderstorm with heavy hail"
        }
    }

    func icon(isDay: Bool) -> WeatherIconType {
        switch self {
        case .clearSky, .mainlyClear:
            return isDay ? .clearDay : .clearNight
        case .partlyCloudy:
            return isDay ? .partlyCloudyDay : .partlyCloudyNight
        case .overcast:
            return .cloudy
        case .fog, .rimeFog:
            return .fog
        case .lightDrizzle, .moderateDrizzle, .denseDrizzle:
            return .drizzle
        case .lightFreezingDrizzle, .denseFreezingDrizzle, .lightFreezingRain, .heavyFreezingRain:
            return .sleet
        case .slightRain, .moderateRain, .heavyRain, .slightRainShowers, .moderateRainShowers, .violentRainShowers:
            return .rain
        case .slightSnow, .moderateSnow, .heavySnow, .snowGrains, .slightSnowShowers, .heavySnowShowers:
            return .snow
        case .thunderstorm, .thunderstormSlightHail, .thunderstormHeavyHail:
            return .thunderstorm
        }
    }

    var isPrecipitation: Bool { rawValue >= 51 }

    var isSnow: Bool {
        (rawValue >= 71 && rawValue <= 77) || rawValue == 85 || rawValue == 86
    }

    var isRain: Bool {
        (rawValue >= 51 && rawValue <= 67) || (rawValue >= 80 && rawValue <= 82)
    }

    var isThunderstorm: Bool { rawValue >= 95 }

    var precipitationType: PrecipitationType {
        if !isPrecipitation { return .none }
        if rawValue == 56 || rawValue == 57 || rawValue == 66 || rawValue == 67 { return .sleet }
        if isSnow { return .snow }
        if isRain || isThunderstorm { return .rain }
        return .mixed
    }
}

enum PrecipitationType: String, Sendable {
    case none, rain, snow, sleet, mixed
}

enum PrecipitationIntensity: String, Sendable {
    case none, light, medium, heavy

    init(mm: Double) {
        if mm == 0 { self = .none }
        else if mm < 2.5 { self = .light }
        else if mm < 7.6 { self = .medium }
        else { self = .heavy }
    }
}

// MARK: - Weather Icon

enum WeatherIconType: String, Sendable {
    case clearDay = "clear-day"
    case clearNight = "clear-night"
    case partlyCloudyDay = "partly-cloudy-day"
    case partlyCloudyNight = "partly-cloudy-night"
    case cloudy
    case fog
    case drizzle
    case rain
    case sleet
    case snow
    case thunderstorm
    case wind

    var sfSymbolName: String {
        switch self {
        case .clearDay: return "sun.max.fill"
        case .clearNight: return "moon.stars.fill"
        case .partlyCloudyDay: return "cloud.sun.fill"
        case .partlyCloudyNight: return "cloud.moon.fill"
        case .cloudy: return "cloud.fill"
        case .fog: return "cloud.fog.fill"
        case .drizzle: return "cloud.drizzle.fill"
        case .rain: return "cloud.rain.fill"
        case .sleet: return "cloud.sleet.fill"
        case .snow: return "cloud.snow.fill"
        case .thunderstorm: return "cloud.bolt.rain.fill"
        case .wind: return "wind"
        }
    }
}
