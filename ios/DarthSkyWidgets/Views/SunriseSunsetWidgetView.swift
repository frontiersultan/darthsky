import SwiftUI
import WidgetKit

struct SunriseSunsetWidgetView: View {
    let entry: WeatherEntry

    var body: some View {
        if let snapshot = entry.snapshot,
           let sunrise = snapshot.sunrise,
           let sunset = snapshot.sunset {
            VStack(alignment: .leading, spacing: 0) {
                // Header - show next event
                let isBeforeSunrise = Date() < sunrise
                let isAfterSunset = Date() > sunset

                HStack(spacing: 4) {
                    Image(systemName: nextEventIcon(isBeforeSunrise: isBeforeSunrise, isAfterSunset: isAfterSunset))
                        .font(.system(size: 9))
                    Text(nextEventLabel(isBeforeSunrise: isBeforeSunrise, isAfterSunset: isAfterSunset))
                        .font(.system(size: 9, weight: .medium))
                }
                .foregroundStyle(.white.opacity(0.6))

                // Next event time
                Text(nextEventTime(isBeforeSunrise: isBeforeSunrise, isAfterSunset: isAfterSunset, sunrise: sunrise, sunset: sunset))
                    .font(.title2)
                    .fontWeight(.medium)
                    .foregroundStyle(.white)
                    .padding(.top, 2)

                Spacer()

                // Sun arc visualization
                SunArcView(sunrise: sunrise, sunset: sunset, currentTime: Date())
                    .frame(height: 40)

                Spacer()

                // Bottom: other event
                HStack {
                    VStack(alignment: .leading, spacing: 1) {
                        Text("Sunrise")
                            .font(.system(size: 9))
                            .foregroundStyle(.white.opacity(0.6))
                        Text(entry.formatTime(sunrise))
                            .font(.caption2)
                            .fontWeight(.medium)
                            .foregroundStyle(.white)
                    }
                    Spacer()
                    VStack(alignment: .trailing, spacing: 1) {
                        Text("Sunset")
                            .font(.system(size: 9))
                            .foregroundStyle(.white.opacity(0.6))
                        Text(entry.formatTime(sunset))
                            .font(.caption2)
                            .fontWeight(.medium)
                            .foregroundStyle(.white)
                    }
                }
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(14)
            .widgetBackground(snapshot: snapshot)
        } else {
            placeholderView
        }
    }

    private func nextEventIcon(isBeforeSunrise: Bool, isAfterSunset: Bool) -> String {
        if isBeforeSunrise { return "sunrise.fill" }
        if isAfterSunset { return "sunrise.fill" }
        return "sunset.fill"
    }

    private func nextEventLabel(isBeforeSunrise: Bool, isAfterSunset: Bool) -> String {
        if isBeforeSunrise { return "SUNRISE" }
        if isAfterSunset { return "SUNRISE" }
        return "SUNSET"
    }

    private func nextEventTime(isBeforeSunrise: Bool, isAfterSunset: Bool, sunrise: Date, sunset: Date) -> String {
        if isBeforeSunrise { return entry.formatTime(sunrise) }
        if isAfterSunset { return entry.formatTime(sunrise) } // tomorrow's sunrise
        return entry.formatTime(sunset)
    }

    private var placeholderView: some View {
        VStack(alignment: .leading) {
            HStack(spacing: 4) {
                Image(systemName: "sunset.fill")
                    .font(.system(size: 9))
                Text("SUNSET")
                    .font(.system(size: 9, weight: .medium))
            }
            Text("--:--")
                .font(.title2)
            Spacer()
        }
        .foregroundStyle(.white.opacity(0.5))
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(14)
        .background(
            LinearGradient(
                colors: [Color(red: 0.2, green: 0.4, blue: 0.7), Color(red: 0.3, green: 0.5, blue: 0.8)],
                startPoint: .top, endPoint: .bottom
            )
        )
    }
}

// MARK: - Sun Arc Visualization

struct SunArcView: View {
    let sunrise: Date
    let sunset: Date
    let currentTime: Date

    private var dayProgress: Double {
        let totalDay = sunset.timeIntervalSince(sunrise)
        guard totalDay > 0 else { return 0 }
        let elapsed = currentTime.timeIntervalSince(sunrise)
        return max(0, min(1, elapsed / totalDay))
    }

    private var isDaytime: Bool {
        currentTime >= sunrise && currentTime <= sunset
    }

    var body: some View {
        GeometryReader { geo in
            let width = geo.size.width
            let height = geo.size.height

            ZStack {
                // Horizon line
                Path { path in
                    path.move(to: CGPoint(x: 0, y: height * 0.8))
                    path.addLine(to: CGPoint(x: width, y: height * 0.8))
                }
                .stroke(.white.opacity(0.2), lineWidth: 1)

                // Sun arc (semicircle)
                Path { path in
                    path.addArc(
                        center: CGPoint(x: width / 2, y: height * 0.8),
                        radius: width * 0.4,
                        startAngle: .degrees(180),
                        endAngle: .degrees(0),
                        clockwise: false
                    )
                }
                .stroke(
                    isDaytime ? Color.yellow.opacity(0.5) : Color.white.opacity(0.15),
                    style: StrokeStyle(lineWidth: 2, dash: isDaytime ? [] : [3, 3])
                )

                // Sun position indicator
                if isDaytime {
                    let angle = Double.pi * (1 - dayProgress)
                    let sunX = width / 2 + width * 0.4 * cos(angle)
                    let sunY = height * 0.8 - width * 0.4 * sin(angle)

                    Circle()
                        .fill(.yellow)
                        .frame(width: 10, height: 10)
                        .shadow(color: .yellow.opacity(0.6), radius: 4)
                        .position(x: sunX, y: sunY)
                }
            }
        }
    }
}
