import SwiftUI
import WidgetKit

struct FeelsLikeWidgetView: View {
    let entry: WeatherEntry

    var body: some View {
        if let snapshot = entry.snapshot {
            VStack(alignment: .leading, spacing: 0) {
                // Header
                HStack(spacing: 4) {
                    Image(systemName: "thermometer.medium")
                        .font(.system(size: 9))
                    Text("FEELS LIKE")
                        .font(.system(size: 9, weight: .medium))
                }
                .foregroundStyle(.white.opacity(0.6))

                Spacer()

                // Feels like temperature
                Text(entry.formatTemp(snapshot.feelsLike))
                    .font(.system(size: 34, weight: .thin, design: .rounded))
                    .foregroundStyle(.white)

                Spacer()

                // Description
                Text(feelsLikeDescription(actual: snapshot.temperature, feelsLike: snapshot.feelsLike))
                    .font(.system(size: 10))
                    .foregroundStyle(.white.opacity(0.7))
                    .lineLimit(2)

                // Actual temp comparison
                Text("Actual: \(entry.formatTemp(snapshot.temperature))")
                    .font(.caption2)
                    .foregroundStyle(.white.opacity(0.5))
                    .padding(.top, 2)
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(14)
            .widgetBackground(snapshot: snapshot)
        } else {
            placeholderView
        }
    }

    private func feelsLikeDescription(actual: Double, feelsLike: Double) -> String {
        let diff = feelsLike - actual
        if abs(diff) < 2 {
            return "Similar to the actual temperature."
        } else if diff > 0 {
            return "Humidity is making it feel warmer."
        } else {
            return "Wind is making it feel cooler."
        }
    }

    private var placeholderView: some View {
        VStack(alignment: .leading) {
            HStack(spacing: 4) {
                Image(systemName: "thermometer.medium")
                    .font(.system(size: 9))
                Text("FEELS LIKE")
                    .font(.system(size: 9, weight: .medium))
            }
            Spacer()
            Text("--°")
                .font(.system(size: 34, weight: .thin, design: .rounded))
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
