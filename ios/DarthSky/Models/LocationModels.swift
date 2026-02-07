import Foundation
import CoreLocation

struct Coordinates: Codable, Equatable, Sendable {
    let latitude: Double
    let longitude: Double

    var clLocation: CLLocationCoordinate2D {
        CLLocationCoordinate2D(latitude: latitude, longitude: longitude)
    }
}

struct SavedLocation: Identifiable, Codable, Equatable, Sendable {
    let id: String
    let name: String
    let displayName: String
    let coordinates: Coordinates
    var isCurrentLocation: Bool
    let country: String?
    let state: String?
    let timezone: String?

    static let defaultLocation = SavedLocation(
        id: "default",
        name: "New York",
        displayName: "New York, NY",
        coordinates: Coordinates(latitude: 40.7128, longitude: -74.006),
        isCurrentLocation: false,
        country: "United States",
        state: "New York",
        timezone: "America/New_York"
    )
}
