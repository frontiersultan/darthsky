import SwiftUI
import WidgetKit

struct UVIndexWidgetView: View {
    let entry: WeatherEntry

    var body: some View {
        if let snapshot = entry.snapshot {
            VStack(alignment: .leading, spacing: 0) {
                // Header
                HStack(spacing: 4) {
                    Image(systemName: "sun.max.fill")
                        .font(.system(size: 9))
                    Text("UV INDEX")
                        .font(.system(size: 9, weight: .medium))
                }
                .foregroundStyle(.white.opacity(0.6))

                Spacer()

                // UV Value
                Text("\(Int(snapshot.uvIndex))")
                    .font(.system(size: 34, weight: .medium, design: .rounded))
                    .foregroundStyle(.white)

                Text(uvLevel)
                    .font(.subheadline)
                    .fontWeight(.semibold)
                    .foregroundStyle(.white)

                Spacer()

                // UV Gauge
                UVGaugeView(value: snapshot.uvIndex)
                    .frame(height: 6)

                Spacer()

                // Advice
                Text(uvAdvice)
                    .font(.system(size: 10))
                    .foregroundStyle(.white.opacity(0.7))
                    .lineLimit(2)
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(14)
            .widgetBackground(snapshot: snapshot)
        } else {
            placeholderView
        }
    }

    private var uvLevel: String {
        guard let snapshot = entry.snapshot else { return "--" }
        switch snapshot.uvIndex {
        case 0..<3: return "Low"
        case 3..<6: return "Moderate"
        case 6..<8: return "High"
        case 8..<11: return "Very High"
        default: return "Extreme"
        }
    }

    private var uvAdvice: String {
        guard let snapshot = entry.snapshot else { return "" }
        switch snapshot.uvIndex {
        case 0..<3: return "No protection needed."
        case 3..<6: return "Wear sunscreen outdoors."
        case 6..<8: return "Reduce time in the sun."
        case 8..<11: return "Avoid being outside during midday hours."
        default: return "Take all precautions. Avoid sun exposure."
        }
    }

    private var placeholderView: some View {
        VStack(alignment: .leading) {
            HStack(spacing: 4) {
                Image(systemName: "sun.max.fill")
                    .font(.system(size: 9))
                Text("UV INDEX")
                    .font(.system(size: 9, weight: .medium))
            }
            Spacer()
            Text("--")
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

// MARK: - UV Gauge

struct UVGaugeView: View {
    let value: Double

    private var fraction: Double {
        min(value / 11.0, 1.0)
    }

    var body: some View {
        GeometryReader { geo in
            ZStack(alignment: .leading) {
                // Background gradient bar
                Capsule()
                    .fill(
                        LinearGradient(
                            colors: [.green, .yellow, .orange, .red, .purple],
                            startPoint: .leading,
                            endPoint: .trailing
                        )
                    )

                // Indicator dot
                Circle()
                    .fill(.white)
                    .frame(width: 8, height: 8)
                    .shadow(color: .black.opacity(0.3), radius: 1)
                    .offset(x: max(0, geo.size.width * fraction - 4))
            }
        }
    }
}
