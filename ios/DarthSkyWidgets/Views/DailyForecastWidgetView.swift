import SwiftUI
import WidgetKit

// MARK: - Medium Forecast (5 days)

struct DailyForecastMediumView: View {
    let entry: WeatherEntry

    var body: some View {
        if let snapshot = entry.snapshot {
            VStack(alignment: .leading, spacing: 0) {
                // Header
                HStack(spacing: 4) {
                    Image(systemName: "calendar")
                        .font(.system(size: 9))
                    Text("5-DAY FORECAST")
                        .font(.system(size: 9, weight: .medium))
                }
                .foregroundStyle(.white.opacity(0.6))

                Divider()
                    .background(.white.opacity(0.2))
                    .padding(.vertical, 4)

                let days = Array(snapshot.daily.prefix(5))
                let range = tempRange(for: days)

                ForEach(Array(days.enumerated()), id: \.offset) { index, day in
                    HStack(spacing: 6) {
                        Text(dayLabel(day.date))
                            .font(.caption2)
                            .frame(width: 36, alignment: .leading)

                        Image(systemName: day.icon.sfSymbolName)
                            .symbolRenderingMode(.multicolor)
                            .font(.system(size: 11))
                            .frame(width: 16)

                        Text(entry.formatTemp(day.temperatureMin))
                            .font(.system(size: 10))
                            .foregroundStyle(.white.opacity(0.6))
                            .frame(width: 24, alignment: .trailing)

                        // Temperature bar
                        GeometryReader { geo in
                            temperatureBar(day: day, range: range, width: geo.size.width)
                        }
                        .frame(height: 4)

                        Text(entry.formatTemp(day.temperatureMax))
                            .font(.system(size: 10))
                            .foregroundStyle(.white)
                            .frame(width: 24, alignment: .trailing)
                    }
                    .foregroundStyle(.white)

                    if index < days.count - 1 {
                        Divider()
                            .background(.white.opacity(0.1))
                            .padding(.vertical, 1)
                    }
                }
            }
            .padding(14)
            .widgetBackground(snapshot: snapshot)
        } else {
            placeholderView
        }
    }

    private var placeholderView: some View {
        Text("Open app to load forecast")
            .font(.caption)
            .foregroundStyle(.white.opacity(0.5))
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(
                LinearGradient(
                    colors: [Color(red: 0.2, green: 0.4, blue: 0.7), Color(red: 0.3, green: 0.5, blue: 0.8)],
                    startPoint: .top, endPoint: .bottom
                )
            )
    }

    private func tempRange(for days: [SharedDailyEntry]) -> ClosedRange<Double> {
        let mins = days.map(\.temperatureMin)
        let maxs = days.map(\.temperatureMax)
        let lo = mins.min() ?? 0
        let hi = maxs.max() ?? 30
        return lo...hi
    }

    private func temperatureBar(day: SharedDailyEntry, range: ClosedRange<Double>, width: CGFloat) -> some View {
        let span = max(range.upperBound - range.lowerBound, 1)
        let startFrac = (day.temperatureMin - range.lowerBound) / span
        let endFrac = (day.temperatureMax - range.lowerBound) / span
        let barWidth = max(4, width * (endFrac - startFrac))
        let offset = width * startFrac

        return ZStack(alignment: .leading) {
            Capsule()
                .fill(.white.opacity(0.15))
                .frame(height: 4)

            Capsule()
                .fill(
                    LinearGradient(
                        colors: [tempColor(day.temperatureMin), tempColor(day.temperatureMax)],
                        startPoint: .leading,
                        endPoint: .trailing
                    )
                )
                .frame(width: barWidth, height: 4)
                .offset(x: offset)
        }
    }

    private func tempColor(_ celsius: Double) -> Color {
        switch celsius {
        case ..<0: return .blue
        case 0..<10: return .cyan
        case 10..<20: return .green
        case 20..<30: return .yellow
        case 30..<40: return .orange
        default: return .red
        }
    }

    private func dayLabel(_ date: Date) -> String {
        if Calendar.current.isDateInToday(date) { return "Today" }
        let formatter = DateFormatter()
        formatter.dateFormat = "EEE"
        return formatter.string(from: date)
    }
}

// MARK: - Large Forecast (Current + 7 days)

struct DailyForecastLargeView: View {
    let entry: WeatherEntry

    var body: some View {
        if let snapshot = entry.snapshot {
            VStack(alignment: .leading, spacing: 0) {
                // Current conditions header
                HStack {
                    VStack(alignment: .leading, spacing: 2) {
                        Text(snapshot.locationName)
                            .font(.subheadline)
                            .fontWeight(.medium)

                        Text(entry.formatTemp(snapshot.temperature))
                            .font(.system(size: 42, weight: .thin, design: .rounded))
                    }
                    .foregroundStyle(.white)

                    Spacer()

                    VStack(alignment: .trailing, spacing: 2) {
                        Image(systemName: snapshot.icon.sfSymbolName)
                            .symbolRenderingMode(.multicolor)
                            .font(.title2)

                        Text(snapshot.summary)
                            .font(.caption)
                            .foregroundStyle(.white.opacity(0.8))

                        if let today = snapshot.todayForecast {
                            Text("H:\(entry.formatTemp(today.temperatureMax))  L:\(entry.formatTemp(today.temperatureMin))")
                                .font(.caption2)
                                .foregroundStyle(.white.opacity(0.7))
                        }
                    }
                }

                Divider()
                    .background(.white.opacity(0.2))
                    .padding(.vertical, 6)

                // Forecast header
                HStack(spacing: 4) {
                    Image(systemName: "calendar")
                        .font(.system(size: 9))
                    Text("7-DAY FORECAST")
                        .font(.system(size: 9, weight: .medium))
                }
                .foregroundStyle(.white.opacity(0.6))
                .padding(.bottom, 4)

                // Daily forecast rows
                let days = Array(snapshot.daily.prefix(7))
                let range = tempRange(for: days)

                ForEach(Array(days.enumerated()), id: \.offset) { index, day in
                    HStack(spacing: 6) {
                        Text(dayLabel(day.date))
                            .font(.caption)
                            .frame(width: 56, alignment: .leading)

                        Image(systemName: day.icon.sfSymbolName)
                            .symbolRenderingMode(.multicolor)
                            .font(.caption)
                            .frame(width: 18)

                        if day.precipitationProbability > 0 {
                            Text("\(Int(day.precipitationProbability))%")
                                .font(.system(size: 9))
                                .foregroundStyle(.cyan)
                                .frame(width: 26)
                        } else {
                            Text("")
                                .frame(width: 26)
                        }

                        Text(entry.formatTemp(day.temperatureMin))
                            .font(.caption)
                            .foregroundStyle(.white.opacity(0.6))
                            .frame(width: 28, alignment: .trailing)

                        GeometryReader { geo in
                            ZStack(alignment: .leading) {
                                Capsule()
                                    .fill(.white.opacity(0.15))
                                    .frame(height: 4)

                                let span = max(range.upperBound - range.lowerBound, 1)
                                let startFrac = (day.temperatureMin - range.lowerBound) / span
                                let endFrac = (day.temperatureMax - range.lowerBound) / span
                                let barWidth = max(4, geo.size.width * (endFrac - startFrac))

                                Capsule()
                                    .fill(
                                        LinearGradient(
                                            colors: [tempColor(day.temperatureMin), tempColor(day.temperatureMax)],
                                            startPoint: .leading,
                                            endPoint: .trailing
                                        )
                                    )
                                    .frame(width: barWidth, height: 4)
                                    .offset(x: geo.size.width * startFrac)
                            }
                        }
                        .frame(height: 4)

                        Text(entry.formatTemp(day.temperatureMax))
                            .font(.caption)
                            .foregroundStyle(.white)
                            .frame(width: 28, alignment: .trailing)
                    }

                    if index < days.count - 1 {
                        Divider()
                            .background(.white.opacity(0.1))
                            .padding(.vertical, 2)
                    }
                }
            }
            .padding(16)
            .widgetBackground(snapshot: snapshot)
        } else {
            Text("Open app to load forecast")
                .font(.caption)
                .foregroundStyle(.secondary)
                .frame(maxWidth: .infinity, maxHeight: .infinity)
        }
    }

    private func tempRange(for days: [SharedDailyEntry]) -> ClosedRange<Double> {
        let lo = days.map(\.temperatureMin).min() ?? 0
        let hi = days.map(\.temperatureMax).max() ?? 30
        return lo...hi
    }

    private func tempColor(_ celsius: Double) -> Color {
        switch celsius {
        case ..<0: return .blue
        case 0..<10: return .cyan
        case 10..<20: return .green
        case 20..<30: return .yellow
        case 30..<40: return .orange
        default: return .red
        }
    }

    private func dayLabel(_ date: Date) -> String {
        if Calendar.current.isDateInToday(date) { return "Today" }
        if Calendar.current.isDateInTomorrow(date) { return "Tomorrow" }
        let formatter = DateFormatter()
        formatter.dateFormat = "EEE"
        return formatter.string(from: date)
    }
}
