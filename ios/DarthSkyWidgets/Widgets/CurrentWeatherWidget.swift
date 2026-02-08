import SwiftUI
import WidgetKit

struct CurrentWeatherWidget: Widget {
    let kind = "CurrentWeatherWidget"

    var body: some WidgetConfiguration {
        AppIntentConfiguration(kind: kind, intent: WeatherWidgetIntent.self, provider: ConfigurableWeatherProvider()) { entry in
            CurrentWeatherWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("Current Weather")
        .description("Shows current temperature, conditions, and location.")
        .supportedFamilies([.systemSmall, .systemMedium])
        .contentMarginsDisabled()
    }
}

private struct CurrentWeatherWidgetEntryView: View {
    let entry: WeatherEntry
    @Environment(\.widgetFamily) var family

    var body: some View {
        switch family {
        case .systemMedium:
            CurrentWeatherMediumView(entry: entry)
        default:
            CurrentWeatherSmallView(entry: entry)
        }
    }
}
