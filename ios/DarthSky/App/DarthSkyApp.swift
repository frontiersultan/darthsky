import SwiftUI

@main
struct DarthSkyApp: App {
    @State private var weatherVM = WeatherViewModel()
    @State private var locationVM = LocationViewModel()
    @State private var settingsVM = SettingsViewModel()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(weatherVM)
                .environment(locationVM)
                .environment(settingsVM)
                .preferredColorScheme(colorScheme)
                .tint(.cyan)
        }
    }

    private var colorScheme: ColorScheme? {
        switch settingsVM.theme {
        case .auto: return nil
        case .light: return .light
        case .dark: return .dark
        }
    }
}
