import SwiftUI

struct CurrentConditionsView: View {
    let conditions: CurrentConditions
    let precipSummary: String?
    @Environment(SettingsViewModel.self) private var settings

    var body: some View {
        VStack(spacing: 4) {
            // Weather icon
            LargeWeatherIconView(icon: conditions.icon, isDay: conditions.isDay)
                .padding(.bottom, 4)

            // Temperature
            Text(settings.formatTemp(conditions.temperature))
                .font(.system(size: 72, weight: .thin, design: .rounded))

            // Feels like
            Text("Feels like \(settings.formatTemp(conditions.feelsLike))")
                .font(.subheadline)
                .foregroundStyle(.secondary)

            // Summary
            Text(conditions.summary)
                .font(.title3)
                .fontWeight(.medium)

            // Precipitation summary
            if let precipSummary {
                HStack(spacing: 4) {
                    Image(systemName: "drop.fill")
                        .font(.caption)
                        .foregroundStyle(.cyan)
                    Text(precipSummary)
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                }
                .padding(.top, 2)
            }

            // Quick stats row
            HStack(spacing: 20) {
                QuickStat(
                    icon: "drop.fill",
                    value: Formatting.percentage(conditions.humidity),
                    color: .cyan
                )

                QuickStat(
                    icon: "wind",
                    value: settings.formatWind(conditions.windSpeed),
                    color: .teal
                )

                QuickStat(
                    icon: "eye.fill",
                    value: settings.formatVisibility(conditions.visibility),
                    color: .gray
                )
            }
            .padding(.top, 12)
        }
        .padding(.vertical, 20)
        .frame(maxWidth: .infinity)
        .weatherCard()
    }
}

private struct QuickStat: View {
    let icon: String
    let value: String
    let color: Color

    var body: some View {
        HStack(spacing: 4) {
            Image(systemName: icon)
                .font(.caption)
                .foregroundStyle(color)
            Text(value)
                .font(.caption)
                .foregroundStyle(.secondary)
        }
    }
}
