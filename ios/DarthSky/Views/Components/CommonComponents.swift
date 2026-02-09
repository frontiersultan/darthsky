import SwiftUI

// MARK: - Section Header

struct SectionHeader: View {
    let title: String
    var icon: String?

    var body: some View {
        HStack(spacing: 6) {
            if let icon {
                Image(systemName: icon)
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }
            Text(title)
                .font(.subheadline)
                .fontWeight(.semibold)
                .foregroundStyle(.secondary)
                .textCase(.uppercase)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }
}

// MARK: - Loading Skeleton

struct SkeletonView: View {
    var height: CGFloat = 120

    @State private var shimmer = false

    var body: some View {
        RoundedRectangle(cornerRadius: 16)
            .fill(.ultraThinMaterial)
            .frame(height: height)
            .overlay(
                RoundedRectangle(cornerRadius: 16)
                    .fill(
                        LinearGradient(
                            colors: [.clear, .white.opacity(0.1), .clear],
                            startPoint: .leading,
                            endPoint: .trailing
                        )
                    )
                    .offset(x: shimmer ? 300 : -300)
            )
            .clipShape(RoundedRectangle(cornerRadius: 16))
            .onAppear {
                withAnimation(.linear(duration: 1.5).repeatForever(autoreverses: false)) {
                    shimmer = true
                }
            }
    }
}

// MARK: - Error View

struct WeatherErrorView: View {
    let message: String
    let onRetry: () -> Void

    var body: some View {
        VStack(spacing: 16) {
            Image(systemName: "exclamationmark.triangle.fill")
                .font(.system(size: 48))
                .foregroundStyle(.orange)

            Text("Something went wrong")
                .font(.headline)

            Text(message)
                .font(.subheadline)
                .foregroundStyle(.secondary)
                .multilineTextAlignment(.center)

            Button(action: onRetry) {
                Label("Try Again", systemImage: "arrow.clockwise")
                    .font(.body.weight(.medium))
                    .padding(.horizontal, 24)
                    .padding(.vertical, 12)
                    .background(.tint)
                    .foregroundStyle(.white)
                    .clipShape(Capsule())
            }
        }
        .padding()
    }
}

// MARK: - Detail Item

struct DetailItem: View {
    let title: String
    let value: String
    let icon: String

    var body: some View {
        VStack(spacing: 8) {
            Image(systemName: icon)
                .font(.title3)
                .foregroundStyle(.secondary)

            Text(value)
                .font(.callout)
                .fontWeight(.semibold)

            Text(title)
                .font(.caption)
                .foregroundStyle(.secondary)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 12)
    }
}

// MARK: - Pill Button

struct PillButton: View {
    let title: String
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.subheadline)
                .fontWeight(isSelected ? .semibold : .regular)
                .padding(.horizontal, 16)
                .padding(.vertical, 8)
                .background(isSelected ? Color.accentColor : Color(.systemGray5))
                .foregroundStyle(isSelected ? .white : .primary)
                .clipShape(Capsule())
        }
        .buttonStyle(.plain)
    }
}

// MARK: - Last Updated

struct LastUpdatedView: View {
    let date: Date?

    var body: some View {
        if let date {
            Text("Updated \(Formatting.relativeTime(date))")
                .font(.caption2)
                .foregroundStyle(.tertiary)
        }
    }
}
