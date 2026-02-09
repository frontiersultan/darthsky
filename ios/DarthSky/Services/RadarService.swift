import Foundation

actor RadarService {
    static let shared = RadarService()

    private let session: URLSession
    private let mapsURL = "https://api.rainviewer.com/public/weather-maps.json"

    private init() {
        let config = URLSessionConfiguration.default
        config.timeoutIntervalForRequest = 15
        self.session = URLSession(configuration: config)
    }

    func fetchRadarData() async throws -> RadarData {
        guard let url = URL(string: mapsURL) else {
            throw RadarError.invalidURL
        }

        let (data, response) = try await session.data(from: url)

        guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 else {
            throw RadarError.serverError
        }

        let maps = try JSONDecoder().decode(RainViewerMapsResponse.self, from: data)

        let past = maps.radar.past.map { frame in
            RadarFrame(
                timestamp: frame.time,
                path: frame.path,
                tileUrl: "\(maps.host)\(frame.path)/256/{z}/{x}/{y}/2/1_1.png"
            )
        }

        let nowcast = maps.radar.nowcast.map { frame in
            RadarFrame(
                timestamp: frame.time,
                path: frame.path,
                tileUrl: "\(maps.host)\(frame.path)/256/{z}/{x}/{y}/2/1_1.png"
            )
        }

        return RadarData(
            generated: maps.generated,
            host: maps.host,
            past: past,
            nowcast: nowcast
        )
    }

    static func allFrames(from data: RadarData) -> [RadarFrame] {
        data.past + data.nowcast
    }

    static func formatRadarTime(timestamp: Int) -> String {
        let now = Date()
        let frameDate = Date(timeIntervalSince1970: TimeInterval(timestamp))
        let diffMinutes = Int(frameDate.timeIntervalSince(now) / 60)

        if abs(diffMinutes) <= 2 { return "Now" }
        if diffMinutes > 0 { return "+\(diffMinutes)m" }
        return "\(diffMinutes)m"
    }

    static func tileURL(from template: String, z: Int, x: Int, y: Int) -> URL? {
        let urlString = template
            .replacingOccurrences(of: "{z}", with: String(z))
            .replacingOccurrences(of: "{x}", with: String(x))
            .replacingOccurrences(of: "{y}", with: String(y))
        return URL(string: urlString)
    }
}

enum RadarError: LocalizedError {
    case invalidURL
    case serverError

    var errorDescription: String? {
        switch self {
        case .invalidURL: return "Invalid radar request"
        case .serverError: return "Radar data is unavailable"
        }
    }
}
