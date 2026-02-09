import SwiftUI
import WidgetKit

// MARK: - UV Index Widget

struct UVIndexWidget: Widget {
    let kind = "UVIndexWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: WeatherTimelineProvider()) { entry in
            UVIndexWidgetView(entry: entry)
        }
        .configurationDisplayName("UV Index")
        .description("Shows the current UV index level with protection advice.")
        .supportedFamilies([.systemSmall])
        .contentMarginsDisabled()
    }
}

// MARK: - Sunrise/Sunset Widget

struct SunriseSunsetWidget: Widget {
    let kind = "SunriseSunsetWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: WeatherTimelineProvider()) { entry in
            SunriseSunsetWidgetView(entry: entry)
        }
        .configurationDisplayName("Sunrise & Sunset")
        .description("Shows sunrise and sunset times with a sun arc visualization.")
        .supportedFamilies([.systemSmall])
        .contentMarginsDisabled()
    }
}

// MARK: - Wind Widget

struct WindWidget: Widget {
    let kind = "WindWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: WeatherTimelineProvider()) { entry in
            WindWidgetView(entry: entry)
        }
        .configurationDisplayName("Wind")
        .description("Shows current wind speed, direction, and gusts.")
        .supportedFamilies([.systemSmall])
        .contentMarginsDisabled()
    }
}

// MARK: - Precipitation Widget

struct PrecipitationWidget: Widget {
    let kind = "PrecipitationWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: WeatherTimelineProvider()) { entry in
            PrecipitationWidgetView(entry: entry)
        }
        .configurationDisplayName("Precipitation")
        .description("Shows precipitation probability and upcoming rain.")
        .supportedFamilies([.systemSmall])
        .contentMarginsDisabled()
    }
}

// MARK: - Feels Like Widget

struct FeelsLikeWidget: Widget {
    let kind = "FeelsLikeWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: WeatherTimelineProvider()) { entry in
            FeelsLikeWidgetView(entry: entry)
        }
        .configurationDisplayName("Feels Like")
        .description("Shows the apparent temperature compared to actual.")
        .supportedFamilies([.systemSmall])
        .contentMarginsDisabled()
    }
}

// MARK: - Humidity Widget

struct HumidityWidget: Widget {
    let kind = "HumidityWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: WeatherTimelineProvider()) { entry in
            HumidityWidgetView(entry: entry)
        }
        .configurationDisplayName("Humidity")
        .description("Shows current humidity and dew point.")
        .supportedFamilies([.systemSmall])
        .contentMarginsDisabled()
    }
}

// MARK: - Visibility Widget

struct VisibilityWidget: Widget {
    let kind = "VisibilityWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: WeatherTimelineProvider()) { entry in
            VisibilityWidgetView(entry: entry)
        }
        .configurationDisplayName("Visibility")
        .description("Shows current visibility conditions.")
        .supportedFamilies([.systemSmall])
        .contentMarginsDisabled()
    }
}

// MARK: - Pressure Widget

struct PressureWidget: Widget {
    let kind = "PressureWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: WeatherTimelineProvider()) { entry in
            PressureWidgetView(entry: entry)
        }
        .configurationDisplayName("Pressure")
        .description("Shows current atmospheric pressure.")
        .supportedFamilies([.systemSmall])
        .contentMarginsDisabled()
    }
}
