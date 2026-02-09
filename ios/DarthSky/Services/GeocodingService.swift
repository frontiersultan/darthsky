import Foundation

actor GeocodingService {
    static let shared = GeocodingService()

    private let session: URLSession
    private let searchURL = "https://nominatim.openstreetmap.org/search"
    private let reverseURL = "https://nominatim.openstreetmap.org/reverse"
    private let userAgent = "DarthSky Weather iOS App"

    private init() {
        let config = URLSessionConfiguration.default
        config.timeoutIntervalForRequest = 15
        self.session = URLSession(configuration: config)
    }

    // MARK: - Search Locations

    func searchLocations(query: String) async throws -> [SavedLocation] {
        guard !query.trimmingCharacters(in: .whitespaces).isEmpty else { return [] }

        var components = URLComponents(string: searchURL)!
        components.queryItems = [
            URLQueryItem(name: "q", value: query),
            URLQueryItem(name: "format", value: "json"),
            URLQueryItem(name: "addressdetails", value: "1"),
            URLQueryItem(name: "limit", value: "10"),
        ]

        guard let url = components.url else {
            throw GeocodingError.invalidURL
        }

        var request = URLRequest(url: url)
        request.setValue(userAgent, forHTTPHeaderField: "User-Agent")

        let (data, response) = try await session.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 else {
            throw GeocodingError.serverError
        }

        let results = try JSONDecoder().decode([NominatimResult].self, from: data)
        return results.map { transformNominatimResult($0) }
    }

    // MARK: - Reverse Geocode

    func reverseGeocode(latitude: Double, longitude: Double) async throws -> SavedLocation? {
        var components = URLComponents(string: reverseURL)!
        components.queryItems = [
            URLQueryItem(name: "lat", value: String(latitude)),
            URLQueryItem(name: "lon", value: String(longitude)),
            URLQueryItem(name: "format", value: "json"),
            URLQueryItem(name: "addressdetails", value: "1"),
        ]

        guard let url = components.url else {
            throw GeocodingError.invalidURL
        }

        var request = URLRequest(url: url)
        request.setValue(userAgent, forHTTPHeaderField: "User-Agent")

        let (data, response) = try await session.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw GeocodingError.serverError
        }

        if httpResponse.statusCode == 404 { return nil }

        guard httpResponse.statusCode == 200 else {
            throw GeocodingError.serverError
        }

        let result = try JSONDecoder().decode(NominatimResult.self, from: data)
        var location = transformNominatimResult(result)
        location.isCurrentLocation = true
        return location
    }

    // MARK: - Transform

    private func transformNominatimResult(_ result: NominatimResult) -> SavedLocation {
        let name = extractLocationName(from: result)
        let displayName = extractDisplayName(from: result)
        let lat = Double(result.lat) ?? 0
        let lon = Double(result.lon) ?? 0

        return SavedLocation(
            id: "\(result.osmType)\(result.osmId)",
            name: name,
            displayName: displayName,
            coordinates: Coordinates(latitude: lat, longitude: lon),
            isCurrentLocation: false,
            country: result.address?.country,
            state: result.address?.state,
            timezone: nil
        )
    }

    private func extractLocationName(from result: NominatimResult) -> String {
        if let address = result.address {
            return address.city ?? address.town ?? address.village ?? address.municipality ?? result.name
        }
        return result.name
    }

    private func extractDisplayName(from result: NominatimResult) -> String {
        var parts: [String] = []

        if let address = result.address {
            let city = address.city ?? address.town ?? address.village ?? address.municipality ?? result.name
            parts.append(city)

            if let state = address.state {
                parts.append(state)
            }
            if let country = address.country {
                parts.append(country)
            }
        } else {
            parts.append(result.name)
        }

        return parts.joined(separator: ", ")
    }
}

enum GeocodingError: LocalizedError {
    case invalidURL
    case serverError

    var errorDescription: String? {
        switch self {
        case .invalidURL: return "Invalid geocoding request"
        case .serverError: return "Location search is unavailable"
        }
    }
}
