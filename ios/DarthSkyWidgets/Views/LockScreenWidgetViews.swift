import SwiftUI
import WidgetKit

// MARK: - Accessory Circular (Lock Screen)

struct AccessoryCircularView: View {
    let entry: WeatherEntry

    var body: some View {
        if let snapshot = entry.snapshot {
            ZStack {
                AccessoryWidgetBackground()

                VStack(spacing: 1) {
                    Image(systemName: snapshot.icon.sfSymbolName)
                        .font(.system(size: 14))
                        .symbolRenderingMode(.hierarchical)

                    Text(entry.formatTemp(snapshot.temperature))
                        .font(.system(size: 14, weight: .semibold, design: .rounded))
                        .minimumScaleFactor(0.6)
                }
            }
        } else {
            ZStack {
                AccessoryWidgetBackground()
                Image(systemName: "cloud.sun.fill")
                    .font(.title3)
            }
        }
    }
}

// MARK: - Accessory Rectangular (Lock Screen)

struct AccessoryRectangularView: View {
    let entry: WeatherEntry

    var body: some View {
        if let snapshot = entry.snapshot {
            HStack(spacing: 6) {
                VStack(alignment: .leading, spacing: 2) {
                    // Location
                    Text(snapshot.locationName)
                        .font(.caption)
                        .fontWeight(.medium)
                        .lineLimit(1)

                    // Temperature and conditions
                    HStack(spacing: 4) {
                        Text(entry.formatTemp(snapshot.temperature))
                            .font(.system(size: 20, weight: .medium, design: .rounded))

                        Image(systemName: snapshot.icon.sfSymbolName)
                            .font(.caption)
                            .symbolRenderingMode(.hierarchical)
                    }

                    // High/Low
                    if let today = snapshot.todayForecast {
                        Text("H:\(entry.formatTemp(today.temperatureMax)) L:\(entry.formatTemp(today.temperatureMin))")
                            .font(.caption2)
                            .foregroundStyle(.secondary)
                    }
                }

                Spacer()
            }
        } else {
            VStack(alignment: .leading, spacing: 2) {
                Text("Darth Sky")
                    .font(.caption)
                    .fontWeight(.medium)
                Text("--°")
                    .font(.system(size: 20, weight: .medium, design: .rounded))
                Text("Open app to load")
                    .font(.caption2)
                    .foregroundStyle(.secondary)
            }
            .frame(maxWidth: .infinity, alignment: .leading)
        }
    }
}

// MARK: - Accessory Rectangular Forecast

struct AccessoryRectangularForecastView: View {
    let entry: WeatherEntry

    var body: some View {
        if let snapshot = entry.snapshot {
            VStack(alignment: .leading, spacing: 2) {
                Text(snapshot.locationName)
                    .font(.caption2)
                    .fontWeight(.medium)
                    .lineLimit(1)

                HStack(spacing: 6) {
                    ForEach(Array(snapshot.hourly.prefix(5).enumerated()), id: \.offset) { index, hour in
                        VStack(spacing: 2) {
                            Text(index == 0 ? "Now" : entry.formatHour(hour.time))
                                .font(.system(size: 7))
                                .foregroundStyle(.secondary)

                            Image(systemName: hour.icon.sfSymbolName)
                                .symbolRenderingMode(.hierarchical)
                                .font(.system(size: 9))

                            Text(entry.formatTemp(hour.temperature))
                                .font(.system(size: 9, weight: .medium))
                        }
                        .frame(maxWidth: .infinity)
                    }
                }
            }
        } else {
            Text("Open app to load weather")
                .font(.caption2)
                .foregroundStyle(.secondary)
        }
    }
}

// MARK: - Accessory Inline (Lock Screen)

struct AccessoryInlineView: View {
    let entry: WeatherEntry

    var body: some View {
        if let snapshot = entry.snapshot {
            HStack(spacing: 4) {
                Image(systemName: snapshot.icon.sfSymbolName)
                Text("\(snapshot.locationName) \(entry.formatTemp(snapshot.temperature))")
            }
        } else {
            Text("Darth Sky --°")
        }
    }
}

// MARK: - Accessory Circular UV

struct AccessoryCircularUVView: View {
    let entry: WeatherEntry

    var body: some View {
        if let snapshot = entry.snapshot {
            Gauge(value: min(snapshot.uvIndex, 11), in: 0...11) {
                Image(systemName: "sun.max.fill")
                    .font(.system(size: 10))
            } currentValueLabel: {
                Text("\(Int(snapshot.uvIndex))")
                    .font(.system(size: 14, weight: .semibold))
            }
            .gaugeStyle(.accessoryCircular)
        } else {
            Gauge(value: 0, in: 0...11) {
                Image(systemName: "sun.max.fill")
            } currentValueLabel: {
                Text("--")
            }
            .gaugeStyle(.accessoryCircular)
        }
    }
}

// MARK: - Accessory Circular Wind

struct AccessoryCircularWindView: View {
    let entry: WeatherEntry

    var body: some View {
        if let snapshot = entry.snapshot {
            ZStack {
                AccessoryWidgetBackground()

                VStack(spacing: 1) {
                    Image(systemName: "wind")
                        .font(.system(size: 12))

                    let speed: Double
                    switch entry.units.windSpeed {
                    case .kmh: speed = snapshot.windSpeed
                    case .mph: speed = snapshot.windSpeed * 0.621371
                    case .ms: speed = snapshot.windSpeed / 3.6
                    case .knots: speed = snapshot.windSpeed * 0.539957
                    }

                    Text("\(Int(speed.rounded()))")
                        .font(.system(size: 14, weight: .semibold, design: .rounded))

                    Text(entry.units.windSpeed.label)
                        .font(.system(size: 7))
                        .foregroundStyle(.secondary)
                }
            }
        } else {
            ZStack {
                AccessoryWidgetBackground()
                Image(systemName: "wind")
                    .font(.title3)
            }
        }
    }
}
