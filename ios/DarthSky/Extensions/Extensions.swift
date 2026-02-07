import SwiftUI

// MARK: - View Extensions

extension View {
    func weatherCard() -> some View {
        self
            .padding()
            .background(.ultraThinMaterial)
            .clipShape(RoundedRectangle(cornerRadius: 16))
    }

    func weatherCardBackground() -> some View {
        self
            .background(
                RoundedRectangle(cornerRadius: 16)
                    .fill(.ultraThinMaterial)
            )
    }
}

// MARK: - Color Extensions

extension Color {
    static let weatherPrimary = Color("AccentColor")
    static let cardBackground = Color(.systemBackground).opacity(0.15)
}

// MARK: - Date Extensions

extension Date {
    var isCurrentHour: Bool {
        Calendar.current.isDate(self, equalTo: Date(), toGranularity: .hour)
    }
}
