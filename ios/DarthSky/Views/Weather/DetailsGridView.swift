import SwiftUI

struct DetailsGridView: View {
    let conditions: CurrentConditions
    @Environment(SettingsViewModel.self) private var settings

    private let columns = [
        GridItem(.flexible(), spacing: 1),
        GridItem(.flexible(), spacing: 1),
        GridItem(.flexible(), spacing: 1),
    ]

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            SectionHeader(title: "Details", icon: "info.circle")
                .padding(.horizontal, 4)

            LazyVGrid(columns: columns, spacing: 1) {
                DetailItem(
                    title: "Humidity",
                    value: Formatting.percentage(conditions.humidity),
                    icon: "humidity.fill"
                )

                DetailItem(
                    title: "Dew Point",
                    value: settings.formatTemp(conditions.dewPoint),
                    icon: "drop.degreesign"
                )

                DetailItem(
                    title: "Pressure",
                    value: settings.formatPressure(conditions.pressure),
                    icon: "gauge.with.dots.needle.33percent"
                )

                DetailItem(
                    title: "Wind",
                    value: windValue,
                    icon: "wind"
                )

                DetailItem(
                    title: "UV Index",
                    value: uvValue,
                    icon: "sun.max.fill"
                )

                DetailItem(
                    title: "Cloud Cover",
                    value: Formatting.percentage(conditions.cloudCover),
                    icon: "cloud.fill"
                )

                DetailItem(
                    title: "Visibility",
                    value: settings.formatVisibility(conditions.visibility),
                    icon: "eye.fill"
                )

                DetailItem(
                    title: "Precipitation",
                    value: settings.formatPrecip(conditions.precipitation),
                    icon: "cloud.rain.fill"
                )

                if let gust = conditions.windGust {
                    DetailItem(
                        title: "Wind Gust",
                        value: settings.formatWind(gust),
                        icon: "wind"
                    )
                } else {
                    DetailItem(
                        title: "Rain Chance",
                        value: Formatting.percentage(conditions.precipitationProbability),
                        icon: "cloud.rain"
                    )
                }
            }
            .weatherCard()
        }
    }

    private var windValue: String {
        let speed = settings.formatWind(conditions.windSpeed)
        let dir = Formatting.windDirection(conditions.windDirection)
        return "\(speed) \(dir)"
    }

    private var uvValue: String {
        let level = Formatting.uvIndexLevel(conditions.uvIndex)
        return "\(Int(conditions.uvIndex)) (\(level))"
    }
}
