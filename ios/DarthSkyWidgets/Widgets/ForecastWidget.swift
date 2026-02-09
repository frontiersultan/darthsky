import SwiftUI
import WidgetKit

struct ForecastWidget: Widget {
    let kind = "ForecastWidget"

    var body: some WidgetConfiguration {
        AppIntentConfiguration(kind: kind, intent: WeatherWidgetIntent.self, provider: ConfigurableWeatherProvider()) { entry in
            ForecastWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("Forecast")
        .description("Shows the daily weather forecast with temperature ranges.")
        .supportedFamilies([.systemMedium, .systemLarge])
        .contentMarginsDisabled()
    }
}

private struct ForecastWidgetEntryView: View {
    let entry: WeatherEntry
    @Environment(\.widgetFamily) var family

    var body: some View {
        switch family {
        case .systemLarge:
            DailyForecastLargeView(entry: entry)
        default:
            DailyForecastMediumView(entry: entry)
        }
    }
}
