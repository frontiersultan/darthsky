import SwiftUI
import WidgetKit

@main
struct DarthSkyWidgetBundle: WidgetBundle {
    var body: some Widget {
        // Home Screen Widgets
        CurrentWeatherWidget()
        ForecastWidget()
        UVIndexWidget()
        SunriseSunsetWidget()
        WindWidget()
        PrecipitationWidget()
        FeelsLikeWidget()
        HumidityWidget()
        VisibilityWidget()
        PressureWidget()

        // Lock Screen Widgets
        LockScreenConditionsWidget()
        LockScreenForecastWidget()
        LockScreenUVWidget()
        LockScreenWindWidget()
    }
}
