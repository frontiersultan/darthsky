import SwiftUI
import WidgetKit

struct PressureWidgetView: View {
    let entry: WeatherEntry

    var body: some View {
        if let snapshot = entry.snapshot {
            VStack(alignment: .leading, spacing: 0) {
                // Header
                HStack(spacing: 4) {
                    Image(systemName: "gauge.with.dots.needle.33percent")
                        .font(.system(size: 9))
                    Text("PRESSURE")
                        .font(.system(size: 9, weight: .medium))
                }
                .foregroundStyle(.white.opacity(0.6))

                Spacer()

                // Pressure value
                Text(entry.formatPressure(snapshot.pressure))
                    .font(.title3)
                    .fontWeight(.medium)
                    .foregroundStyle(.white)
                    .minimumScaleFactor(0.7)

                Spacer()

                // Pressure gauge
                PressureGaugeView(hpa: snapshot.pressure)
                    .frame(height: 6)

                Spacer()

                // Description
                Text(pressureDescription(hpa: snapshot.pressure))
                    .font(.system(size: 10))
                    .foregroundStyle(.white.opacity(0.7))
                    .lineLimit(1)
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(14)
            .widgetBackground(snapshot: snapshot)
        } else {
            placeholderView
        }
    }

    private func pressureDescription(hpa: Double) -> String {
        switch hpa {
        case ..<1000: return "Low pressure"
        case 1000..<1013: return "Below average"
        case 1013..<1025: return "Normal"
        case 1025..<1040: return "Above average"
        default: return "High pressure"
        }
    }

    private var placeholderView: some View {
        VStack(alignment: .leading) {
            HStack(spacing: 4) {
                Image(systemName: "gauge.with.dots.needle.33percent")
                    .font(.system(size: 9))
                Text("PRESSURE")
                    .font(.system(size: 9, weight: .medium))
            }
            Spacer()
            Text("-- hPa")
                .font(.title3)
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

struct PressureGaugeView: View {
    let hpa: Double

    // Normal range: 980 - 1050 hPa
    private var fraction: Double {
        let clamped = max(980, min(1050, hpa))
        return (clamped - 980) / 70.0
    }

    var body: some View {
        GeometryReader { geo in
            ZStack(alignment: .leading) {
                Capsule()
                    .fill(.white.opacity(0.15))

                // Indicator
                Circle()
                    .fill(.white)
                    .frame(width: 8, height: 8)
                    .shadow(color: .black.opacity(0.3), radius: 1)
                    .offset(x: max(0, geo.size.width * fraction - 4))
            }
        }
    }
}
