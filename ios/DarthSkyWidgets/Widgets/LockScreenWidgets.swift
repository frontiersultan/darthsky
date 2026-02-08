import SwiftUI
import WidgetKit

// MARK: - Lock Screen: Weather Conditions

struct LockScreenConditionsWidget: Widget {
    let kind = "LockScreenConditionsWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: WeatherTimelineProvider()) { entry in
            LockScreenConditionsEntryView(entry: entry)
        }
        .configurationDisplayName("Weather Conditions")
        .description("Shows current temperature and conditions.")
        .supportedFamilies([.accessoryCircular, .accessoryRectangular, .accessoryInline])
    }
}

private struct LockScreenConditionsEntryView: View {
    let entry: WeatherEntry
    @Environment(\.widgetFamily) var family

    var body: some View {
        switch family {
        case .accessoryRectangular:
            AccessoryRectangularView(entry: entry)
        case .accessoryInline:
            AccessoryInlineView(entry: entry)
        default:
            AccessoryCircularView(entry: entry)
        }
    }
}

// MARK: - Lock Screen: Forecast

struct LockScreenForecastWidget: Widget {
    let kind = "LockScreenForecastWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: WeatherTimelineProvider()) { entry in
            AccessoryRectangularForecastView(entry: entry)
        }
        .configurationDisplayName("Hourly Forecast")
        .description("Shows the next few hours of weather.")
        .supportedFamilies([.accessoryRectangular])
    }
}

// MARK: - Lock Screen: UV Index

struct LockScreenUVWidget: Widget {
    let kind = "LockScreenUVWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: WeatherTimelineProvider()) { entry in
            AccessoryCircularUVView(entry: entry)
        }
        .configurationDisplayName("UV Index")
        .description("Shows the current UV index level.")
        .supportedFamilies([.accessoryCircular])
    }
}

// MARK: - Lock Screen: Wind

struct LockScreenWindWidget: Widget {
    let kind = "LockScreenWindWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: WeatherTimelineProvider()) { entry in
            AccessoryCircularWindView(entry: entry)
        }
        .configurationDisplayName("Wind")
        .description("Shows current wind speed.")
        .supportedFamilies([.accessoryCircular])
    }
}
