import SwiftUI
import WidgetKit

struct PrecipitationWidgetView: View {
    let entry: WeatherEntry

    var body: some View {
        if let snapshot = entry.snapshot {
            VStack(alignment: .leading, spacing: 0) {
                // Header
                HStack(spacing: 4) {
                    Image(systemName: "drop.fill")
                        .font(.system(size: 9))
                    Text("PRECIPITATION")
                        .font(.system(size: 9, weight: .medium))
                }
                .foregroundStyle(.white.opacity(0.6))

                Spacer()

                // Precipitation amount or probability
                if snapshot.precipitation > 0 {
                    Text(precipText)
                        .font(.title2)
                        .fontWeight(.medium)
                        .foregroundStyle(.white)
                } else {
                    Text("\(Int(maxPrecipProb))%")
                        .font(.system(size: 34, weight: .medium, design: .rounded))
                        .foregroundStyle(.white)
                }

                Text(precipDescription)
                    .font(.caption2)
                    .foregroundStyle(.white.opacity(0.7))

                Spacer()

                // Next hours precipitation bars
                HStack(spacing: 3) {
                    ForEach(Array(snapshot.hourly.prefix(8).enumerated()), id: \.offset) { _, hour in
                        VStack(spacing: 2) {
                            RoundedRectangle(cornerRadius: 2)
                                .fill(barColor(probability: hour.precipitationProbability))
                                .frame(
                                    width: nil,
                                    height: max(2, 24 * (hour.precipitationProbability / 100.0))
                                )
                                .frame(height: 24, alignment: .bottom)
                        }
                        .frame(maxWidth: .infinity)
                    }
                }
                .padding(.top, 4)

                // Time labels for bars
                HStack(spacing: 0) {
                    if let first = snapshot.hourly.first {
                        Text("Now")
                            .font(.system(size: 7))
                            .foregroundStyle(.white.opacity(0.5))
                    }
                    Spacer()
                    if snapshot.hourly.count >= 8 {
                        Text(entry.formatHour(snapshot.hourly[7].time))
                            .font(.system(size: 7))
                            .foregroundStyle(.white.opacity(0.5))
                    }
                }
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(14)
            .widgetBackground(snapshot: snapshot)
        } else {
            placeholderView
        }
    }

    private var maxPrecipProb: Double {
        guard let snapshot = entry.snapshot else { return 0 }
        return snapshot.hourly.prefix(12).map(\.precipitationProbability).max() ?? 0
    }

    private var precipText: String {
        guard let snapshot = entry.snapshot else { return "--" }
        switch entry.units.precipitation {
        case .mm: return String(format: "%.1f mm", snapshot.precipitation)
        case .inches: return String(format: "%.2f in", snapshot.precipitation * 0.0393701)
        }
    }

    private var precipDescription: String {
        guard let snapshot = entry.snapshot else { return "" }
        if snapshot.precipitation > 0 {
            return "in the last hour"
        }
        let upcoming = snapshot.hourly.prefix(6)
        if let next = upcoming.first(where: { $0.precipitationProbability > 30 }) {
            let mins = Int(next.time.timeIntervalSince(Date()) / 60)
            if mins > 0 {
                return "expected in \(mins) min"
            }
        }
        if maxPrecipProb > 0 {
            return "chance next 8 hours"
        }
        return "None expected"
    }

    private func barColor(probability: Double) -> Color {
        if probability > 60 { return .cyan }
        if probability > 30 { return .cyan.opacity(0.6) }
        if probability > 0 { return .cyan.opacity(0.3) }
        return .white.opacity(0.1)
    }

    private var placeholderView: some View {
        VStack(alignment: .leading) {
            HStack(spacing: 4) {
                Image(systemName: "drop.fill")
                    .font(.system(size: 9))
                Text("PRECIPITATION")
                    .font(.system(size: 9, weight: .medium))
            }
            Spacer()
            Text("--%")
                .font(.system(size: 34, weight: .medium, design: .rounded))
            Spacer()
        }
        .foregroundStyle(.white.opacity(0.5))
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(14)
        .background(
            LinearGradient(
                colors: [Color(red: 0.2, green: 0.4, blue: 0.7), Color(red: 0.3, green: 0.5, blue: 0.8)],
                startPoint: .top, endPoint: .bottom
            )
        )
    }
}
