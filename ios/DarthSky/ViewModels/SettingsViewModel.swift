import Foundation
import Observation

@Observable
final class SettingsViewModel {
    var units: UnitPreferences
    var theme: ThemeMode
    var alertsEnabled: Bool
    var reducedMotion: Bool

    private let storageKey = "darthsky-settings"

    init() {
        if let data = UserDefaults.standard.data(forKey: storageKey),
           let settings = try? JSONDecoder().decode(StoredSettings.self, from: data) {
            self.units = settings.units
            self.theme = settings.theme
            self.alertsEnabled = settings.alertsEnabled
            self.reducedMotion = settings.reducedMotion
        } else {
            self.units = .defaults
            self.theme = .auto
            self.alertsEnabled = true
            self.reducedMotion = false
        }
    }

    func save() {
        let settings = StoredSettings(
            units: units,
            theme: theme,
            alertsEnabled: alertsEnabled,
            reducedMotion: reducedMotion
        )
        if let data = try? JSONEncoder().encode(settings) {
            UserDefaults.standard.set(data, forKey: storageKey)
        }
    }

    func resetToDefaults() {
        units = .defaults
        theme = .auto
        alertsEnabled = true
        reducedMotion = false
        save()
    }

    // MARK: - Unit Conversion

    func convertTemp(_ celsius: Double) -> Double {
        switch units.temperature {
        case .celsius: return celsius
        case .fahrenheit: return (celsius * 9.0) / 5.0 + 32.0
        }
    }

    func convertWind(_ kmh: Double) -> Double {
        switch units.windSpeed {
        case .kmh: return kmh
        case .mph: return kmh * 0.621371
        case .ms: return kmh / 3.6
        case .knots: return kmh * 0.539957
        }
    }

    func convertPressure(_ hpa: Double) -> Double {
        switch units.pressure {
        case .hpa: return hpa
        case .inhg: return hpa * 0.02953
        case .mmhg: return hpa * 0.75006
        }
    }

    func convertVisibility(_ km: Double) -> Double {
        switch units.visibility {
        case .km: return km
        case .mi: return km * 0.621371
        }
    }

    func convertPrecip(_ mm: Double) -> Double {
        switch units.precipitation {
        case .mm: return mm
        case .inches: return mm * 0.0393701
        }
    }

    // MARK: - Formatted Strings

    func formatTemp(_ celsius: Double, showUnit: Bool = true) -> String {
        let value = convertTemp(celsius)
        let rounded = Int(value.rounded())
        return showUnit ? "\(rounded)°" : "\(rounded)"
    }

    func formatWind(_ kmh: Double) -> String {
        let value = convertWind(kmh)
        return "\(Int(value.rounded())) \(units.windSpeed.label)"
    }

    func formatPressure(_ hpa: Double) -> String {
        let value = convertPressure(hpa)
        switch units.pressure {
        case .hpa: return "\(Int(value.rounded())) \(units.pressure.label)"
        case .inhg: return String(format: "%.2f \(units.pressure.label)", value)
        case .mmhg: return "\(Int(value.rounded())) \(units.pressure.label)"
        }
    }

    func formatVisibility(_ km: Double) -> String {
        let value = convertVisibility(km)
        return String(format: "%.1f \(units.visibility.label)", value)
    }

    func formatPrecip(_ mm: Double) -> String {
        if mm == 0 { return "0 \(units.precipitation.label)" }
        let value = convertPrecip(mm)
        return String(format: "%.2f \(units.precipitation.label)", value)
    }

    func formatTime(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.locale = Locale.current
        switch units.timeFormat {
        case .twelve:
            formatter.dateFormat = "h:mm a"
        case .twentyFour:
            formatter.dateFormat = "HH:mm"
        }
        return formatter.string(from: date)
    }

    func formatHour(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.locale = Locale.current
        switch units.timeFormat {
        case .twelve:
            formatter.dateFormat = "ha"
        case .twentyFour:
            formatter.dateFormat = "HH:00"
        }
        return formatter.string(from: date)
    }
}

// MARK: - Stored Settings

private struct StoredSettings: Codable {
    let units: UnitPreferences
    let theme: ThemeMode
    let alertsEnabled: Bool
    let reducedMotion: Bool
}
