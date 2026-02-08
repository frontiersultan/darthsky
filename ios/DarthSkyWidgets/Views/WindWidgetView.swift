import SwiftUI
import WidgetKit

struct WindWidgetView: View {
    let entry: WeatherEntry

    var body: some View {
        if let snapshot = entry.snapshot {
            VStack(alignment: .leading, spacing: 0) {
                // Header
                HStack(spacing: 4) {
                    Image(systemName: "wind")
                        .font(.system(size: 9))
                    Text("WIND")
                        .font(.system(size: 9, weight: .medium))
                }
                .foregroundStyle(.white.opacity(0.6))

                Spacer()

                // Compass and wind info
                HStack(spacing: 12) {
                    // Mini compass
                    WindCompassView(direction: snapshot.windDirection)
                        .frame(width: 50, height: 50)

                    VStack(alignment: .leading, spacing: 4) {
                        // Wind speed
                        Text(entry.formatWind(snapshot.windSpeed))
                            .font(.callout)
                            .fontWeight(.semibold)
                            .foregroundStyle(.white)

                        // Direction
                        Text(entry.windDirection(snapshot.windDirection))
                            .font(.caption2)
                            .foregroundStyle(.white.opacity(0.7))

                        // Gusts
                        if let gust = snapshot.windGust, gust > snapshot.windSpeed {
                            Text("Gusts \(entry.formatWind(gust))")
                                .font(.system(size: 10))
                                .foregroundStyle(.white.opacity(0.6))
                        }
                    }
                }

                Spacer()
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(14)
            .widgetBackground(snapshot: snapshot)
        } else {
            placeholderView
        }
    }

    private var placeholderView: some View {
        VStack(alignment: .leading) {
            HStack(spacing: 4) {
                Image(systemName: "wind")
                    .font(.system(size: 9))
                Text("WIND")
                    .font(.system(size: 9, weight: .medium))
            }
            Spacer()
            Text("-- mph")
                .font(.callout)
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

// MARK: - Wind Compass

struct WindCompassView: View {
    let direction: Double

    var body: some View {
        ZStack {
            // Compass circle
            Circle()
                .stroke(.white.opacity(0.2), lineWidth: 1)

            // Cardinal directions
            ForEach(["N", "E", "S", "W"], id: \.self) { dir in
                let angle = cardinalAngle(for: dir)
                Text(dir)
                    .font(.system(size: 7, weight: .medium))
                    .foregroundStyle(dir == "N" ? .white : .white.opacity(0.4))
                    .offset(compassOffset(angle: angle, radius: 20))
            }

            // Tick marks
            ForEach(0..<8, id: \.self) { i in
                let angle = Double(i) * 45.0
                Rectangle()
                    .fill(.white.opacity(0.3))
                    .frame(width: 1, height: 3)
                    .offset(y: -18)
                    .rotationEffect(.degrees(angle))
            }

            // Wind direction arrow
            Image(systemName: "location.north.fill")
                .font(.system(size: 14))
                .foregroundStyle(.white)
                .rotationEffect(.degrees(direction))
        }
    }

    private func cardinalAngle(for dir: String) -> Double {
        switch dir {
        case "N": return 270
        case "E": return 0
        case "S": return 90
        case "W": return 180
        default: return 0
        }
    }

    private func compassOffset(angle: Double, radius: CGFloat) -> CGSize {
        let radians = angle * .pi / 180
        return CGSize(
            width: CGFloat(cos(radians)) * radius,
            height: CGFloat(sin(radians)) * radius
        )
    }
}
