import SwiftUI
import WidgetKit

struct VisibilityWidgetView: View {
    let entry: WeatherEntry

    var body: some View {
        if let snapshot = entry.snapshot {
            VStack(alignment: .leading, spacing: 0) {
                // Header
                HStack(spacing: 4) {
                    Image(systemName: "eye.fill")
                        .font(.system(size: 9))
                    Text("VISIBILITY")
                        .font(.system(size: 9, weight: .medium))
                }
                .foregroundStyle(.white.opacity(0.6))

                Spacer()

                // Visibility value
                Text(entry.formatVisibility(snapshot.visibility))
                    .font(.title2)
                    .fontWeight(.medium)
                    .foregroundStyle(.white)

                Spacer()

                // Description
                Text(visibilityDescription(km: snapshot.visibility))
                    .font(.system(size: 10))
                    .foregroundStyle(.white.opacity(0.7))
                    .lineLimit(2)
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(14)
            .widgetBackground(snapshot: snapshot)
        } else {
            placeholderView
        }
    }

    private func visibilityDescription(km: Double) -> String {
        switch km {
        case 10...: return "It's perfectly clear right now."
        case 5..<10: return "Good visibility with some haze."
        case 2..<5: return "Moderate visibility."
        case 1..<2: return "Low visibility. Drive carefully."
        default: return "Very poor visibility conditions."
        }
    }

    private var placeholderView: some View {
        VStack(alignment: .leading) {
            HStack(spacing: 4) {
                Image(systemName: "eye.fill")
                    .font(.system(size: 9))
                Text("VISIBILITY")
                    .font(.system(size: 9, weight: .medium))
            }
            Spacer()
            Text("-- mi")
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
