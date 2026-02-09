import SwiftUI

struct WeatherIconView: View {
    let icon: WeatherIconType
    var size: CGFloat = 32

    var body: some View {
        Image(systemName: icon.sfSymbolName)
            .symbolRenderingMode(.multicolor)
            .font(.system(size: size))
            .foregroundStyle(WeatherColors.iconColor(for: icon))
    }
}

struct LargeWeatherIconView: View {
    let icon: WeatherIconType
    let isDay: Bool

    var body: some View {
        Image(systemName: icon.sfSymbolName)
            .symbolRenderingMode(.multicolor)
            .font(.system(size: 64, weight: .medium))
            .foregroundStyle(WeatherColors.iconColor(for: icon))
            .shadow(color: WeatherColors.iconColor(for: icon).opacity(0.4), radius: 12)
    }
}

#Preview {
    VStack(spacing: 20) {
        ForEach([WeatherIconType.clearDay, .clearNight, .rain, .snow, .thunderstorm, .cloudy], id: \.self) { icon in
            HStack {
                WeatherIconView(icon: icon)
                Text(icon.rawValue)
                Spacer()
                LargeWeatherIconView(icon: icon, isDay: true)
            }
            .padding(.horizontal)
        }
    }
    .padding()
    .background(Color(.systemBackground))
}
