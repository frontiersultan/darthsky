import SwiftUI

struct HourlyForecastView: View {
    let forecasts: [HourlyForecast]
    @Environment(SettingsViewModel.self) private var settings

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            SectionHeader(title: "Hourly Forecast", icon: "clock")
                .padding(.horizontal, 4)

            ScrollView(.horizontal, showsIndicators: false) {
                LazyHStack(spacing: 0) {
                    ForEach(forecasts) { hour in
                        HourlyCell(hour: hour, settings: settings)
                    }
                }
                .padding(.horizontal, 4)
            }
            .weatherCard()
        }
    }
}

private struct HourlyCell: View {
    let hour: HourlyForecast
    let settings: SettingsViewModel

    private var isNow: Bool {
        hour.time.isCurrentHour
    }

    var body: some View {
        VStack(spacing: 8) {
            // Time
            Text(isNow ? "Now" : settings.formatHour(hour.time))
                .font(.caption)
                .fontWeight(isNow ? .bold : .regular)
                .foregroundStyle(isNow ? .primary : .secondary)

            // Icon
            WeatherIconView(icon: hour.icon, size: 22)

            // Temperature
            Text(settings.formatTemp(hour.temperature))
                .font(.callout)
                .fontWeight(.medium)

            // Precipitation probability
            if hour.precipitationProbability > 0 {
                Text(Formatting.percentage(hour.precipitationProbability))
                    .font(.caption2)
                    .foregroundStyle(.cyan)
            } else {
                Text(" ")
                    .font(.caption2)
            }

            // Wind
            HStack(spacing: 2) {
                Image(systemName: "wind")
                    .font(.system(size: 8))
                Text("\(Int(settings.convertWind(hour.windSpeed).rounded()))")
                    .font(.caption2)
            }
            .foregroundStyle(.secondary)
        }
        .frame(width: 64)
        .padding(.vertical, 8)
        .background(
            isNow
                ? RoundedRectangle(cornerRadius: 12).fill(.white.opacity(0.1))
                : nil
        )
    }
}
