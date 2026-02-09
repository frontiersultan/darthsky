import WidgetKit
import Foundation

// MARK: - Widget Entry

struct WeatherEntry: TimelineEntry {
    let date: Date
    let snapshot: SharedWeatherSnapshot?
    let units: UnitPreferences
    let isPlaceholder: Bool

    static var placeholder: WeatherEntry {
        WeatherEntry(
            date: Date(),
            snapshot: nil,
            units: .defaults,
            isPlaceholder: true
        )
    }

    // MARK: - Formatted Helpers

    func formatTemp(_ celsius: Double) -> String {
        let value: Double
        switch units.temperature {
        case .celsius: value = celsius
        case .fahrenheit: value = (celsius * 9.0) / 5.0 + 32.0
        }
        return "\(Int(value.rounded()))°"
    }

    func formatWind(_ kmh: Double) -> String {
        let value: Double
        switch units.windSpeed {
        case .kmh: value = kmh
        case .mph: value = kmh * 0.621371
        case .ms: value = kmh / 3.6
        case .knots: value = kmh * 0.539957
        }
        return "\(Int(value.rounded())) \(units.windSpeed.label)"
    }

    func formatPressure(_ hpa: Double) -> String {
        switch units.pressure {
        case .hpa: return "\(Int(hpa.rounded())) \(units.pressure.label)"
        case .inhg: return String(format: "%.2f \(units.pressure.label)", hpa * 0.02953)
        case .mmhg: return "\(Int((hpa * 0.75006).rounded())) \(units.pressure.label)"
        }
    }

    func formatVisibility(_ km: Double) -> String {
        switch units.visibility {
        case .km: return String(format: "%.1f \(units.visibility.label)", km)
        case .mi: return String(format: "%.1f \(units.visibility.label)", km * 0.621371)
        }
    }

    func formatHour(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.locale = Locale.current
        switch units.timeFormat {
        case .twelve: formatter.dateFormat = "ha"
        case .twentyFour: formatter.dateFormat = "HH"
        }
        return formatter.string(from: date)
    }

    func formatTime(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.locale = Locale.current
        switch units.timeFormat {
        case .twelve: formatter.dateFormat = "h:mm a"
        case .twentyFour: formatter.dateFormat = "HH:mm"
        }
        return formatter.string(from: date)
    }

    func windDirection(_ degrees: Double) -> String {
        let directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
        let index = Int((degrees / 45.0).rounded()) % 8
        return directions[index]
    }
}

// MARK: - Timeline Provider

struct WeatherTimelineProvider: TimelineProvider {
    typealias Entry = WeatherEntry

    func placeholder(in context: Context) -> WeatherEntry {
        .placeholder
    }

    func getSnapshot(in context: Context, completion: @escaping (WeatherEntry) -> Void) {
        let entry = makeEntry()
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<WeatherEntry>) -> Void) {
        let currentEntry = makeEntry()

        // Try to fetch fresh data
        Task {
            if let snapshot = SharedDataManager.shared.loadWeatherSnapshot() {
                let freshEntry = WeatherEntry(
                    date: Date(),
                    snapshot: snapshot,
                    units: SharedDataManager.shared.loadSettings(),
                    isPlaceholder: false
                )

                // Refresh every 15 minutes
                let nextUpdate = Calendar.current.date(byAdding: .minute, value: 15, to: Date())!
                let timeline = Timeline(entries: [freshEntry], policy: .after(nextUpdate))
                completion(timeline)
            } else {
                // Try to fetch from network
                await fetchAndUpdate { entry in
                    let nextUpdate = Calendar.current.date(byAdding: .minute, value: 15, to: Date())!
                    let timeline = Timeline(entries: [entry ?? currentEntry], policy: .after(nextUpdate))
                    completion(timeline)
                }
            }
        }
    }

    private func makeEntry() -> WeatherEntry {
        let snapshot = SharedDataManager.shared.loadWeatherSnapshot()
        let units = SharedDataManager.shared.loadSettings()
        return WeatherEntry(
            date: Date(),
            snapshot: snapshot,
            units: units,
            isPlaceholder: snapshot == nil
        )
    }

    private func fetchAndUpdate(completion: @escaping (WeatherEntry?) async -> Void) async {
        // Read the saved location from App Group
        let snapshot = SharedDataManager.shared.loadWeatherSnapshot()
        guard let snapshot = snapshot else {
            await completion(nil)
            return
        }

        do {
            let data = try await WeatherService.shared.fetchWeather(
                latitude: snapshot.latitude,
                longitude: snapshot.longitude
            )
            // Save refreshed data
            let updatedData = WeatherData(
                location: SavedLocation(
                    id: "widget",
                    name: snapshot.locationName,
                    displayName: snapshot.locationDisplayName,
                    coordinates: Coordinates(latitude: snapshot.latitude, longitude: snapshot.longitude),
                    isCurrentLocation: false,
                    country: nil,
                    state: nil,
                    timezone: nil
                ),
                current: data.current,
                hourly: data.hourly,
                daily: data.daily,
                minutely: data.minutely,
                alerts: data.alerts,
                lastUpdated: data.lastUpdated
            )
            SharedDataManager.shared.saveWeatherData(updatedData)

            let newSnapshot = SharedDataManager.shared.loadWeatherSnapshot()
            let entry = WeatherEntry(
                date: Date(),
                snapshot: newSnapshot,
                units: SharedDataManager.shared.loadSettings(),
                isPlaceholder: false
            )
            await completion(entry)
        } catch {
            await completion(nil)
        }
    }
}

// MARK: - Intent-Based Provider (for configurable widgets)

struct ConfigurableWeatherProvider: AppIntentTimelineProvider {
    typealias Entry = WeatherEntry
    typealias Intent = WeatherWidgetIntent

    func placeholder(in context: Context) -> WeatherEntry {
        .placeholder
    }

    func snapshot(for configuration: WeatherWidgetIntent, in context: Context) async -> WeatherEntry {
        let snapshot = SharedDataManager.shared.loadWeatherSnapshot()
        return WeatherEntry(
            date: Date(),
            snapshot: snapshot,
            units: SharedDataManager.shared.loadSettings(),
            isPlaceholder: snapshot == nil
        )
    }

    func timeline(for configuration: WeatherWidgetIntent, in context: Context) async -> Timeline<WeatherEntry> {
        let snapshot = SharedDataManager.shared.loadWeatherSnapshot()
        let entry = WeatherEntry(
            date: Date(),
            snapshot: snapshot,
            units: SharedDataManager.shared.loadSettings(),
            isPlaceholder: snapshot == nil
        )
        let nextUpdate = Calendar.current.date(byAdding: .minute, value: 15, to: Date())!
        return Timeline(entries: [entry], policy: .after(nextUpdate))
    }
}
