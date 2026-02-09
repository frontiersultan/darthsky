import SwiftUI
import WidgetKit

// MARK: - Small Current Weather

struct CurrentWeatherSmallView: View {
    let entry: WeatherEntry

    var body: some View {
        if let snapshot = entry.snapshot {
            VStack(alignment: .leading, spacing: 0) {
                // Location
                Text(snapshot.locationName)
                    .font(.caption2)
                    .fontWeight(.medium)
                    .foregroundStyle(.white.opacity(0.9))
                    .lineLimit(1)

                Spacer()

                // Temperature
                Text(entry.formatTemp(snapshot.temperature))
                    .font(.system(size: 44, weight: .thin, design: .rounded))
                    .foregroundStyle(.white)

                Spacer()

                // Weather icon + summary
                HStack(spacing: 4) {
                    Image(systemName: snapshot.icon.sfSymbolName)
                        .symbolRenderingMode(.multicolor)
                        .font(.body)
                    Text(snapshot.summary)
                        .font(.caption2)
                        .foregroundStyle(.white.opacity(0.8))
                        .lineLimit(1)
                }

                // High / Low
                if let today = snapshot.todayForecast {
                    Text("H:\(entry.formatTemp(today.temperatureMax))  L:\(entry.formatTemp(today.temperatureMin))")
                        .font(.caption2)
                        .foregroundStyle(.white.opacity(0.7))
                }
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
            .padding(14)
            .widgetBackground(snapshot: snapshot)
        } else {
            placeholderSmall
        }
    }

    private var placeholderSmall: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text("--")
                .font(.caption2)
            Spacer()
            Text("--°")
                .font(.system(size: 44, weight: .thin, design: .rounded))
            Spacer()
            Text("Open app to load")
                .font(.caption2)
        }
        .foregroundStyle(.white.opacity(0.5))
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
        .padding(14)
        .background(
            LinearGradient(
                colors: [Color(red: 0.2, green: 0.4, blue: 0.7), Color(red: 0.3, green: 0.5, blue: 0.8)],
                startPoint: .top, endPoint: .bottom
            )
        )
    }
}

// MARK: - Medium Current Weather (Current + Hourly)

struct CurrentWeatherMediumView: View {
    let entry: WeatherEntry

    var body: some View {
        if let snapshot = entry.snapshot {
            HStack(spacing: 0) {
                // Left: Current conditions
                VStack(alignment: .leading, spacing: 2) {
                    Text(snapshot.locationName)
                        .font(.caption)
                        .fontWeight(.medium)
                        .foregroundStyle(.white.opacity(0.9))
                        .lineLimit(1)

                    Text(entry.formatTemp(snapshot.temperature))
                        .font(.system(size: 38, weight: .thin, design: .rounded))
                        .foregroundStyle(.white)

                    HStack(spacing: 4) {
                        Image(systemName: snapshot.icon.sfSymbolName)
                            .symbolRenderingMode(.multicolor)
                            .font(.caption)
                        Text(snapshot.summary)
                            .font(.caption2)
                            .foregroundStyle(.white.opacity(0.8))
                            .lineLimit(1)
                    }

                    if let today = snapshot.todayForecast {
                        Text("H:\(entry.formatTemp(today.temperatureMax))  L:\(entry.formatTemp(today.temperatureMin))")
                            .font(.caption2)
                            .foregroundStyle(.white.opacity(0.7))
                    }
                }
                .frame(maxHeight: .infinity, alignment: .top)
                .padding(.trailing, 8)

                Divider()
                    .background(.white.opacity(0.3))
                    .padding(.vertical, 4)

                // Right: Hourly forecast
                HStack(spacing: 10) {
                    ForEach(Array(snapshot.hourly.prefix(5).enumerated()), id: \.offset) { index, hour in
                        VStack(spacing: 4) {
                            Text(index == 0 ? "Now" : entry.formatHour(hour.time))
                                .font(.system(size: 9))
                                .foregroundStyle(.white.opacity(0.7))

                            Image(systemName: hour.icon.sfSymbolName)
                                .symbolRenderingMode(.multicolor)
                                .font(.caption2)

                            Text(entry.formatTemp(hour.temperature))
                                .font(.caption2)
                                .fontWeight(.medium)
                                .foregroundStyle(.white)
                        }
                    }
                }
                .frame(maxHeight: .infinity)
                .padding(.leading, 8)
            }
            .padding(14)
            .widgetBackground(snapshot: snapshot)
        } else {
            placeholderMedium
        }
    }

    private var placeholderMedium: some View {
        HStack {
            VStack(alignment: .leading) {
                Text("--")
                    .font(.caption)
                Text("--°")
                    .font(.system(size: 38, weight: .thin, design: .rounded))
            }
            Spacer()
            Text("Open app to load weather")
                .font(.caption)
        }
        .foregroundStyle(.white.opacity(0.5))
        .padding(14)
        .background(
            LinearGradient(
                colors: [Color(red: 0.2, green: 0.4, blue: 0.7), Color(red: 0.3, green: 0.5, blue: 0.8)],
                startPoint: .top, endPoint: .bottom
            )
        )
    }
}
