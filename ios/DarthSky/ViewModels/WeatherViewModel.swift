import Foundation
import Observation
import WidgetKit

@Observable
final class WeatherViewModel {
    var weatherData: WeatherData?
    var isLoading = false
    var error: String?
    var lastRefresh: Date?

    private var autoRefreshTask: Task<Void, Never>?

    func fetchWeather(for location: SavedLocation) async {
        isLoading = true
        error = nil

        do {
            let data = try await WeatherService.shared.fetchWeather(
                latitude: location.coordinates.latitude,
                longitude: location.coordinates.longitude
            )
            // Merge the saved location info into the weather data
            let mergedData = WeatherData(
                location: location,
                current: data.current,
                hourly: data.hourly,
                daily: data.daily,
                minutely: data.minutely,
                alerts: data.alerts,
                lastUpdated: data.lastUpdated
            )
            weatherData = mergedData
            lastRefresh = Date()
            error = nil

            // Sync to App Group for widgets
            SharedDataManager.shared.saveWeatherData(mergedData)
            WidgetCenter.shared.reloadAllTimelines()
        } catch {
            self.error = error.localizedDescription
        }

        isLoading = false
    }

    func refresh(for location: SavedLocation) async {
        await fetchWeather(for: location)
    }

    func startAutoRefresh(for location: SavedLocation, interval: TimeInterval = 300) {
        stopAutoRefresh()
        autoRefreshTask = Task { [weak self] in
            while !Task.isCancelled {
                try? await Task.sleep(for: .seconds(interval))
                guard !Task.isCancelled else { break }
                await self?.fetchWeather(for: location)
            }
        }
    }

    func stopAutoRefresh() {
        autoRefreshTask?.cancel()
        autoRefreshTask = nil
    }

    // MARK: - Precipitation Summary

    var precipitationSummary: String? {
        guard let minutely = weatherData?.minutely, !minutely.isEmpty else {
            // Fallback to hourly
            return hourlyPrecipitationSummary
        }

        let now = Date()
        let currentlyRaining = minutely[0].intensity > 0

        if currentlyRaining {
            if let stopIndex = minutely.firstIndex(where: { $0.intensity == 0 }) {
                let minsUntilStop = Int(minutely[stopIndex].time.timeIntervalSince(now) / 60)
                return "Rain stopping in \(minsUntilStop) min"
            }
            return "Rain continuing for the next hour"
        } else {
            if let startIndex = minutely.firstIndex(where: { $0.intensity > 0 }) {
                let minsUntilStart = Int(minutely[startIndex].time.timeIntervalSince(now) / 60)
                return "Rain starting in \(minsUntilStart) min"
            }
            return "No rain expected in the next hour"
        }
    }

    private var hourlyPrecipitationSummary: String? {
        guard let hourly = weatherData?.hourly else { return nil }

        let upcoming = hourly.prefix(6)
        let hasRain = upcoming.contains { $0.precipitation > 0 }

        if hasRain {
            if let first = upcoming.first(where: { $0.precipitation > 0 }) {
                let mins = Int(first.time.timeIntervalSince(Date()) / 60)
                if mins <= 5 {
                    return "Rain expected now"
                }
                return "Rain expected in \(mins) min"
            }
        }

        return nil
    }
}
