import Foundation

enum Formatting {
    static func windDirection(_ degrees: Double) -> String {
        let directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
        let index = Int((degrees / 45.0).rounded()) % 8
        return directions[index]
    }

    static func percentage(_ value: Double) -> String {
        "\(Int(value.rounded()))%"
    }

    static func dayShort(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "EEE"
        return formatter.string(from: date)
    }

    static func dayFull(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "EEEE"
        return formatter.string(from: date)
    }

    static func dateShort(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "MMM d"
        return formatter.string(from: date)
    }

    static func isToday(_ date: Date) -> Bool {
        Calendar.current.isDateInToday(date)
    }

    static func isTomorrow(_ date: Date) -> Bool {
        Calendar.current.isDateInTomorrow(date)
    }

    static func relativeTime(_ date: Date) -> String {
        let now = Date()
        let diffSeconds = date.timeIntervalSince(now)
        let diffMinutes = Int(diffSeconds / 60)

        if abs(diffMinutes) < 1 { return "now" }

        if diffMinutes > 0 {
            if diffMinutes < 60 { return "in \(diffMinutes) min" }
            let hours = diffMinutes / 60
            if hours < 24 { return "in \(hours)h" }
            let days = hours / 24
            return "in \(days)d"
        } else {
            let mins = abs(diffMinutes)
            if mins < 60 { return "\(mins) min ago" }
            let hours = mins / 60
            if hours < 24 { return "\(hours)h ago" }
            let days = hours / 24
            return "\(days)d ago"
        }
    }

    static func uvIndexLevel(_ index: Double) -> String {
        switch index {
        case 0..<3: return "Low"
        case 3..<6: return "Moderate"
        case 6..<8: return "High"
        case 8..<11: return "Very High"
        default: return "Extreme"
        }
    }
}
