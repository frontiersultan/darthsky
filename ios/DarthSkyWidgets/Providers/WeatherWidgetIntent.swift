import AppIntents
import WidgetKit

struct WeatherWidgetIntent: WidgetConfigurationIntent {
    static var title: LocalizedStringResource = "Weather Location"
    static var description = IntentDescription("Select which location to show weather for.")

    @Parameter(title: "Location", default: .current)
    var locationChoice: WidgetLocationChoice
}

enum WidgetLocationChoice: String, AppEnum {
    case current = "current"
    case saved = "saved"

    static var typeDisplayRepresentation: TypeDisplayRepresentation = "Location"

    static var caseDisplayRepresentations: [WidgetLocationChoice: DisplayRepresentation] = [
        .current: "Current Location",
        .saved: "Saved Location",
    ]
}
