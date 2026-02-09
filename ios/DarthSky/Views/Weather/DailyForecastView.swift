import SwiftUI

struct DailyForecastView: View {
    let forecasts: [DailyForecast]
    @Environment(SettingsViewModel.self) private var settings

    private var tempRange: ClosedRange<Double> {
        let allMin = forecasts.map(\.temperatureMin).min() ?? 0
        let allMax = forecasts.map(\.temperatureMax).max() ?? 30
        return allMin...allMax
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            SectionHeader(title: "7-Day Forecast", icon: "calendar")
                .padding(.horizontal, 4)

            VStack(spacing: 0) {
                ForEach(Array(forecasts.enumerated()), id: \.element.id) { index, day in
                    DailyRow(
                        day: day,
                        settings: settings,
                        tempRange: tempRange,
                        isLast: index == forecasts.count - 1
                    )
                }
            }
            .weatherCard()
        }
    }
}

private struct DailyRow: View {
    let day: DailyForecast
    let settings: SettingsViewModel
    let tempRange: ClosedRange<Double>
    let isLast: Bool

    private var dayLabel: String {
        if Formatting.isToday(day.date) { return "Today" }
        if Formatting.isTomorrow(day.date) { return "Tomorrow" }
        return Formatting.dayShort(day.date)
    }

    var body: some View {
        VStack(spacing: 0) {
            HStack(spacing: 8) {
                // Day name
                Text(dayLabel)
                    .font(.subheadline)
                    .frame(width: 80, alignment: .leading)

                // Icon
                WeatherIconView(icon: day.icon, size: 18)

                // Precipitation probability
                if day.precipitationProbability > 0 {
                    Text(Formatting.percentage(day.precipitationProbability))
                        .font(.caption2)
                        .foregroundStyle(.cyan)
                        .frame(width: 32)
                } else {
                    Text("")
                        .frame(width: 32)
                }

                // Low temperature
                Text(settings.formatTemp(day.temperatureMin))
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
                    .frame(width: 36, alignment: .trailing)

                // Temperature bar
                TemperatureBar(
                    low: day.temperatureMin,
                    high: day.temperatureMax,
                    range: tempRange
                )
                .frame(height: 4)

                // High temperature
                Text(settings.formatTemp(day.temperatureMax))
                    .font(.subheadline)
                    .fontWeight(.medium)
                    .frame(width: 36, alignment: .trailing)
            }
            .padding(.vertical, 10)
            .padding(.horizontal, 4)

            if !isLast {
                Divider()
                    .opacity(0.3)
            }
        }
    }
}

private struct TemperatureBar: View {
    let low: Double
    let high: Double
    let range: ClosedRange<Double>

    private var totalSpan: Double {
        max(range.upperBound - range.lowerBound, 1)
    }

    private var startFraction: Double {
        (low - range.lowerBound) / totalSpan
    }

    private var endFraction: Double {
        (high - range.lowerBound) / totalSpan
    }

    var body: some View {
        GeometryReader { geometry in
            ZStack(alignment: .leading) {
                // Background track
                Capsule()
                    .fill(.white.opacity(0.1))

                // Colored bar
                Capsule()
                    .fill(
                        LinearGradient(
                            colors: [
                                WeatherColors.temperatureColor(celsius: low),
                                WeatherColors.temperatureColor(celsius: high)
                            ],
                            startPoint: .leading,
                            endPoint: .trailing
                        )
                    )
                    .frame(width: max(4, geometry.size.width * (endFraction - startFraction)))
                    .offset(x: geometry.size.width * startFraction)
            }
        }
    }
}
