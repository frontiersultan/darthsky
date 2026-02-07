import SwiftUI

enum WeatherColors {
    // MARK: - Temperature Colors

    static func temperatureColor(celsius: Double) -> Color {
        switch celsius {
        case ..<(-10): return .indigo       // Freezing
        case (-10)..<0: return .blue        // Cold
        case 0..<10: return .cyan           // Cool
        case 10..<20: return .green         // Mild
        case 20..<30: return .yellow        // Warm
        case 30..<40: return .orange        // Hot
        default: return .red                // Extreme heat
        }
    }

    // MARK: - UV Index Colors

    static func uvColor(_ index: Double) -> Color {
        switch index {
        case 0..<3: return .green
        case 3..<6: return .yellow
        case 6..<8: return .orange
        case 8..<11: return .red
        default: return .purple
        }
    }

    // MARK: - Weather Icon Colors

    static func iconColor(for icon: WeatherIconType) -> Color {
        switch icon {
        case .clearDay: return .yellow
        case .clearNight: return .indigo
        case .partlyCloudyDay: return .orange
        case .partlyCloudyNight: return .indigo
        case .cloudy: return .gray
        case .fog: return Color(.systemGray3)
        case .drizzle: return .cyan
        case .rain: return .blue
        case .sleet: return Color(red: 0.5, green: 0.7, blue: 0.9)
        case .snow: return Color(red: 0.7, green: 0.85, blue: 1.0)
        case .thunderstorm: return .purple
        case .wind: return .teal
        }
    }

    // MARK: - Precipitation Intensity

    static func precipitationColor(intensity: PrecipitationIntensity) -> Color {
        switch intensity {
        case .none: return .clear
        case .light: return .blue.opacity(0.3)
        case .medium: return .blue.opacity(0.6)
        case .heavy: return .blue.opacity(0.9)
        }
    }

    // MARK: - Alert Severity

    static func alertColor(severity: AlertSeverity) -> Color {
        switch severity {
        case .minor: return .yellow
        case .moderate: return .orange
        case .severe: return .red
        case .extreme: return .purple
        }
    }

    // MARK: - Background Gradients

    static func backgroundGradient(isDay: Bool, weatherCode: WeatherCode) -> LinearGradient {
        let colors: [Color]

        if !isDay {
            colors = [
                Color(red: 0.05, green: 0.07, blue: 0.15),
                Color(red: 0.1, green: 0.12, blue: 0.25)
            ]
        } else if weatherCode.isPrecipitation {
            colors = [
                Color(red: 0.25, green: 0.3, blue: 0.4),
                Color(red: 0.35, green: 0.4, blue: 0.5)
            ]
        } else if weatherCode == .overcast || weatherCode == .fog || weatherCode == .rimeFog {
            colors = [
                Color(red: 0.4, green: 0.45, blue: 0.55),
                Color(red: 0.5, green: 0.55, blue: 0.65)
            ]
        } else {
            colors = [
                Color(red: 0.15, green: 0.35, blue: 0.65),
                Color(red: 0.3, green: 0.55, blue: 0.85)
            ]
        }

        return LinearGradient(colors: colors, startPoint: .top, endPoint: .bottom)
    }
}
