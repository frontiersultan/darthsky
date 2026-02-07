import SwiftUI

struct SettingsPage: View {
    @Environment(SettingsViewModel.self) private var settings

    var body: some View {
        @Bindable var settings = settings

        NavigationStack {
            List {
                // Units Section
                Section("Units") {
                    // Temperature
                    UnitPicker(
                        title: "Temperature",
                        icon: "thermometer.medium",
                        selection: $settings.units.temperature
                    )

                    // Wind Speed
                    UnitPicker(
                        title: "Wind Speed",
                        icon: "wind",
                        selection: $settings.units.windSpeed
                    )

                    // Pressure
                    UnitPicker(
                        title: "Pressure",
                        icon: "gauge.with.dots.needle.33percent",
                        selection: $settings.units.pressure
                    )

                    // Visibility
                    UnitPicker(
                        title: "Visibility",
                        icon: "eye",
                        selection: $settings.units.visibility
                    )

                    // Precipitation
                    UnitPicker(
                        title: "Precipitation",
                        icon: "cloud.rain",
                        selection: $settings.units.precipitation
                    )

                    // Time Format
                    UnitPicker(
                        title: "Time Format",
                        icon: "clock",
                        selection: $settings.units.timeFormat
                    )
                }

                // Appearance Section
                Section("Appearance") {
                    UnitPicker(
                        title: "Theme",
                        icon: "paintbrush",
                        selection: $settings.theme
                    )

                    Toggle(isOn: $settings.reducedMotion) {
                        Label("Reduce Motion", systemImage: "figure.walk")
                    }
                }

                // Notifications Section
                Section("Notifications") {
                    Toggle(isOn: $settings.alertsEnabled) {
                        Label("Weather Alerts", systemImage: "bell")
                    }
                }

                // Data Section
                Section("Data") {
                    Button(role: .destructive) {
                        settings.resetToDefaults()
                    } label: {
                        Label("Reset to Defaults", systemImage: "arrow.counterclockwise")
                    }
                }

                // About Section
                Section("About") {
                    HStack {
                        Text("Version")
                        Spacer()
                        Text("1.0.0")
                            .foregroundStyle(.secondary)
                    }

                    VStack(alignment: .leading, spacing: 4) {
                        Text("Data Sources")
                            .font(.subheadline)
                        Text("Weather: Open-Meteo")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                        Text("Radar: RainViewer")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                        Text("Geocoding: OpenStreetMap Nominatim")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                }
            }
            .navigationTitle("Settings")
            .onChange(of: settings.units) { _, _ in settings.save() }
            .onChange(of: settings.theme) { _, _ in settings.save() }
            .onChange(of: settings.alertsEnabled) { _, _ in settings.save() }
            .onChange(of: settings.reducedMotion) { _, _ in settings.save() }
        }
    }
}

// MARK: - Unit Picker

struct UnitPicker<T: Hashable & CaseIterable & RawRepresentable>: View where T.AllCases: RandomAccessCollection, T.RawValue == String {
    let title: String
    let icon: String
    @Binding var selection: T

    var body: some View {
        HStack {
            Label(title, systemImage: icon)
            Spacer()
            Menu {
                ForEach(T.allCases, id: \.self) { option in
                    Button {
                        selection = option
                    } label: {
                        HStack {
                            Text(displayName(for: option))
                            if option == selection {
                                Image(systemName: "checkmark")
                            }
                        }
                    }
                }
            } label: {
                HStack(spacing: 4) {
                    Text(displayName(for: selection))
                        .foregroundStyle(.secondary)
                    Image(systemName: "chevron.up.chevron.down")
                        .font(.caption2)
                        .foregroundStyle(.tertiary)
                }
            }
        }
    }

    private func displayName(for value: T) -> String {
        if let temp = value as? TemperatureUnit { return temp.displayName }
        if let wind = value as? WindSpeedUnit { return wind.displayName }
        if let pressure = value as? PressureUnit { return pressure.displayName }
        if let vis = value as? VisibilityUnit { return vis.displayName }
        if let precip = value as? PrecipitationUnit { return precip.displayName }
        if let time = value as? TimeFormatOption { return time.displayName }
        if let theme = value as? ThemeMode { return theme.displayName }
        return value.rawValue
    }
}
