import SwiftUI

struct AlertsBannerView: View {
    let alerts: [WeatherAlert]
    @State private var expandedAlertId: String?

    var body: some View {
        if !alerts.isEmpty {
            VStack(spacing: 8) {
                ForEach(alerts) { alert in
                    AlertCard(
                        alert: alert,
                        isExpanded: expandedAlertId == alert.id,
                        onTap: {
                            withAnimation(.easeInOut(duration: 0.25)) {
                                expandedAlertId = expandedAlertId == alert.id ? nil : alert.id
                            }
                        }
                    )
                }
            }
        }
    }
}

private struct AlertCard: View {
    let alert: WeatherAlert
    let isExpanded: Bool
    let onTap: () -> Void

    var body: some View {
        Button(action: onTap) {
            VStack(alignment: .leading, spacing: 8) {
                HStack {
                    Image(systemName: alertIcon)
                        .foregroundStyle(WeatherColors.alertColor(severity: alert.severity))

                    Text(alert.event)
                        .font(.subheadline)
                        .fontWeight(.semibold)

                    Spacer()

                    Image(systemName: "chevron.down")
                        .font(.caption)
                        .rotationEffect(.degrees(isExpanded ? 180 : 0))
                        .foregroundStyle(.secondary)
                }

                if !isExpanded {
                    Text(alert.headline)
                        .font(.caption)
                        .foregroundStyle(.secondary)
                        .lineLimit(1)
                }

                if isExpanded {
                    Text(alert.headline)
                        .font(.caption)
                        .foregroundStyle(.secondary)

                    Text(alert.description)
                        .font(.caption2)
                        .foregroundStyle(.secondary)
                        .lineLimit(nil)

                    HStack {
                        Label(formatAlertDate(alert.start), systemImage: "clock")
                        Text("—")
                        Text(formatAlertDate(alert.end))
                    }
                    .font(.caption2)
                    .foregroundStyle(.tertiary)
                }
            }
            .padding(12)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(
                WeatherColors.alertColor(severity: alert.severity).opacity(0.15)
            )
            .clipShape(RoundedRectangle(cornerRadius: 12))
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(WeatherColors.alertColor(severity: alert.severity).opacity(0.3), lineWidth: 1)
            )
        }
        .buttonStyle(.plain)
    }

    private var alertIcon: String {
        switch alert.severity {
        case .minor: return "exclamationmark.circle.fill"
        case .moderate: return "exclamationmark.triangle.fill"
        case .severe: return "exclamationmark.octagon.fill"
        case .extreme: return "xmark.octagon.fill"
        }
    }

    private func formatAlertDate(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "MMM d, h:mm a"
        return formatter.string(from: date)
    }
}
