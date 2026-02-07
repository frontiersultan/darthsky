import SwiftUI

struct ContentView: View {
    @State private var selectedTab: AppTab = .weather
    @Environment(LocationViewModel.self) private var locationVM

    var body: some View {
        TabView(selection: $selectedTab) {
            Tab("Weather", systemImage: "cloud.sun.fill", value: .weather) {
                WeatherPage()
            }

            Tab("Map", systemImage: "map.fill", value: .map) {
                if let location = locationVM.activeLocation {
                    MapPage(location: location)
                } else {
                    Text("Select a location first")
                        .foregroundStyle(.secondary)
                }
            }

            Tab("Settings", systemImage: "gearshape.fill", value: .settings) {
                SettingsPage()
            }
        }
    }
}

enum AppTab: Hashable {
    case weather, map, settings
}

#Preview {
    ContentView()
        .environment(WeatherViewModel())
        .environment(LocationViewModel())
        .environment(SettingsViewModel())
}
