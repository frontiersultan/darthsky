import SwiftUI
import WidgetKit

struct HumidityWidgetView: View {
    let entry: WeatherEntry

    var body: some View {
        if let snapshot = entry.snapshot {
            VStack(alignment: .leading, spacing: 0) {
                // Header
                HStack(spacing: 4) {
                    Image(systemName: "humidity.fill")
                        .font(.system(size: 9))
                    Text("HUMIDITY")
                        .font(.system(size: 9, weight: .medium))
                }
                .foregroundStyle(.white.opacity(0.6))

                Spacer()

                // Humidity percentage
                Text("\(Int(snapshot.humidity))%")
                    .font(.system(size: 34, weight: .medium, design: .rounded))
                    .foregroundStyle(.white)

                Spacer()

                // Dew point
                Text("The dew point is \(entry.formatTemp(snapshot.dewPoint)) right now.")
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

    private var placeholderView: some View {
        VStack(alignment: .leading) {
            HStack(spacing: 4) {
                Image(systemName: "humidity.fill")
                    .font(.system(size: 9))
                Text("HUMIDITY")
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
