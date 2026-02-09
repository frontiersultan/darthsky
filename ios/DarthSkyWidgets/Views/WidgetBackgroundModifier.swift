import SwiftUI
import WidgetKit

// MARK: - Widget Background Extension

extension View {
    func widgetBackground(snapshot: SharedWeatherSnapshot) -> some View {
        self.background(WidgetBackgroundGradient(snapshot: snapshot))
    }
}

struct WidgetBackgroundGradient: View {
    let snapshot: SharedWeatherSnapshot

    var body: some View {
        let weatherCode = snapshot.weatherCode
        let isDay = snapshot.isDay

        if !isDay {
            LinearGradient(
                colors: [
                    Color(red: 0.05, green: 0.07, blue: 0.18),
                    Color(red: 0.1, green: 0.12, blue: 0.28)
                ],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
        } else if weatherCode.isPrecipitation {
            LinearGradient(
                colors: [
                    Color(red: 0.25, green: 0.32, blue: 0.45),
                    Color(red: 0.35, green: 0.42, blue: 0.55)
                ],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
        } else if weatherCode == .overcast || weatherCode == .fog || weatherCode == .rimeFog {
            LinearGradient(
                colors: [
                    Color(red: 0.4, green: 0.45, blue: 0.55),
                    Color(red: 0.5, green: 0.55, blue: 0.65)
                ],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
        } else if weatherCode == .partlyCloudy {
            LinearGradient(
                colors: [
                    Color(red: 0.2, green: 0.42, blue: 0.72),
                    Color(red: 0.35, green: 0.58, blue: 0.85)
                ],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
        } else {
            // Clear / mainly clear
            LinearGradient(
                colors: [
                    Color(red: 0.15, green: 0.38, blue: 0.7),
                    Color(red: 0.3, green: 0.58, blue: 0.9)
                ],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
        }
    }
}
