import Foundation

// MARK: - Unit Types

enum TemperatureUnit: String, Codable, CaseIterable, Sendable {
    case celsius, fahrenheit

    var label: String {
        switch self {
        case .celsius: return "°C"
        case .fahrenheit: return "°F"
        }
    }

    var displayName: String {
        switch self {
        case .celsius: return "Celsius"
        case .fahrenheit: return "Fahrenheit"
        }
    }
}

enum WindSpeedUnit: String, Codable, CaseIterable, Sendable {
    case kmh, mph, ms, knots

    var label: String {
        switch self {
        case .kmh: return "km/h"
        case .mph: return "mph"
        case .ms: return "m/s"
        case .knots: return "kn"
        }
    }

    var displayName: String { label }
}

enum PressureUnit: String, Codable, CaseIterable, Sendable {
    case hpa, inhg, mmhg

    var label: String {
        switch self {
        case .hpa: return "hPa"
        case .inhg: return "inHg"
        case .mmhg: return "mmHg"
        }
    }

    var displayName: String { label }
}

enum VisibilityUnit: String, Codable, CaseIterable, Sendable {
    case km, mi

    var label: String {
        switch self {
        case .km: return "km"
        case .mi: return "mi"
        }
    }

    var displayName: String { label }
}

enum PrecipitationUnit: String, Codable, CaseIterable, Sendable {
    case mm, inches

    var label: String {
        switch self {
        case .mm: return "mm"
        case .inches: return "in"
        }
    }

    var displayName: String { label }
}

enum TimeFormatOption: String, Codable, CaseIterable, Sendable {
    case twelve = "12h"
    case twentyFour = "24h"

    var displayName: String {
        switch self {
        case .twelve: return "12-hour"
        case .twentyFour: return "24-hour"
        }
    }
}

enum ThemeMode: String, Codable, CaseIterable, Sendable {
    case auto, light, dark

    var displayName: String {
        switch self {
        case .auto: return "Auto"
        case .light: return "Light"
        case .dark: return "Dark"
        }
    }
}

// MARK: - Unit Preferences

struct UnitPreferences: Codable, Equatable, Sendable {
    var temperature: TemperatureUnit
    var windSpeed: WindSpeedUnit
    var pressure: PressureUnit
    var visibility: VisibilityUnit
    var precipitation: PrecipitationUnit
    var timeFormat: TimeFormatOption

    static let defaults = UnitPreferences(
        temperature: .fahrenheit,
        windSpeed: .mph,
        pressure: .inhg,
        visibility: .mi,
        precipitation: .inches,
        timeFormat: .twelve
    )
}
