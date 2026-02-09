import Foundation
import CoreLocation
import Observation

@Observable
final class LocationViewModel: NSObject, CLLocationManagerDelegate {
    var locations: [SavedLocation] = []
    var activeLocationId: String = "default"
    var isSearching = false
    var searchResults: [SavedLocation] = []
    var searchError: String?
    var locationPermissionDenied = false

    private let clManager = CLLocationManager()
    private let storageKey = "darthsky-locations"
    private let activeIdKey = "darthsky-active-location"
    private var searchTask: Task<Void, Never>?

    var activeLocation: SavedLocation? {
        locations.first(where: { $0.id == activeLocationId }) ?? locations.first
    }

    override init() {
        super.init()
        clManager.delegate = self
        clManager.desiredAccuracy = kCLLocationAccuracyKilometer
        loadLocations()
    }

    // MARK: - Persistence

    private func loadLocations() {
        if let data = UserDefaults.standard.data(forKey: storageKey),
           let saved = try? JSONDecoder().decode([SavedLocation].self, from: data) {
            locations = saved
        }

        if locations.isEmpty {
            locations = [SavedLocation.defaultLocation]
        }

        activeLocationId = UserDefaults.standard.string(forKey: activeIdKey) ?? locations.first?.id ?? "default"
    }

    private func saveLocations() {
        if let data = try? JSONEncoder().encode(locations) {
            UserDefaults.standard.set(data, forKey: storageKey)
        }
        UserDefaults.standard.set(activeLocationId, forKey: activeIdKey)
    }

    // MARK: - Location Management

    func addLocation(_ location: SavedLocation) {
        guard !locations.contains(where: { $0.id == location.id }) else { return }
        locations.append(location)
        activeLocationId = location.id
        saveLocations()
    }

    func removeLocation(_ location: SavedLocation) {
        locations.removeAll(where: { $0.id == location.id })
        if activeLocationId == location.id {
            activeLocationId = locations.first?.id ?? "default"
        }
        if locations.isEmpty {
            locations = [SavedLocation.defaultLocation]
            activeLocationId = "default"
        }
        saveLocations()
    }

    func setActiveLocation(_ location: SavedLocation) {
        activeLocationId = location.id
        saveLocations()
    }

    func moveLocation(from source: IndexSet, to destination: Int) {
        locations.move(fromOffsets: source, toOffset: destination)
        saveLocations()
    }

    // MARK: - Search

    func search(query: String) {
        searchTask?.cancel()

        guard !query.trimmingCharacters(in: .whitespaces).isEmpty else {
            searchResults = []
            isSearching = false
            return
        }

        isSearching = true
        searchError = nil

        searchTask = Task {
            do {
                // Debounce
                try await Task.sleep(for: .milliseconds(300))
                guard !Task.isCancelled else { return }

                let results = try await GeocodingService.shared.searchLocations(query: query)
                guard !Task.isCancelled else { return }

                await MainActor.run {
                    self.searchResults = results
                    self.isSearching = false
                }
            } catch {
                guard !Task.isCancelled else { return }
                await MainActor.run {
                    self.searchError = error.localizedDescription
                    self.isSearching = false
                }
            }
        }
    }

    func clearSearch() {
        searchTask?.cancel()
        searchResults = []
        searchError = nil
        isSearching = false
    }

    // MARK: - Current Location

    func requestCurrentLocation() {
        let status = clManager.authorizationStatus
        switch status {
        case .notDetermined:
            clManager.requestWhenInUseAuthorization()
        case .authorizedWhenInUse, .authorizedAlways:
            clManager.requestLocation()
        case .denied, .restricted:
            locationPermissionDenied = true
        @unknown default:
            break
        }
    }

    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        guard let clLocation = locations.first else { return }

        Task {
            if let location = try? await GeocodingService.shared.reverseGeocode(
                latitude: clLocation.coordinate.latitude,
                longitude: clLocation.coordinate.longitude
            ) {
                await MainActor.run {
                    // Remove any existing current-location entries
                    self.locations.removeAll(where: { $0.isCurrentLocation })

                    var currentLoc = location
                    currentLoc.isCurrentLocation = true
                    self.locations.insert(currentLoc, at: 0)
                    self.activeLocationId = currentLoc.id
                    self.saveLocations()
                }
            }
        }
    }

    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        // Silently handle location errors
    }

    func locationManagerDidChangeAuthorization(_ manager: CLLocationManager) {
        switch manager.authorizationStatus {
        case .authorizedWhenInUse, .authorizedAlways:
            locationPermissionDenied = false
            manager.requestLocation()
        case .denied, .restricted:
            locationPermissionDenied = true
        default:
            break
        }
    }
}
