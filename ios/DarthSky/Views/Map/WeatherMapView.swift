import SwiftUI
import MapKit

struct WeatherMapView: View {
    let location: SavedLocation
    @State private var radarVM = RadarViewModel()
    @State private var mapPosition: MapCameraPosition

    init(location: SavedLocation) {
        self.location = location
        self._mapPosition = State(initialValue: .region(
            MKCoordinateRegion(
                center: location.coordinates.clLocation,
                span: MKCoordinateSpan(latitudeDelta: 4, longitudeDelta: 4)
            )
        ))
    }

    var body: some View {
        ZStack {
            // Map
            Map(position: $mapPosition) {
                // Location marker
                Annotation("", coordinate: location.coordinates.clLocation) {
                    Circle()
                        .fill(.blue)
                        .frame(width: 12, height: 12)
                        .overlay(
                            Circle()
                                .stroke(.white, lineWidth: 2)
                        )
                        .shadow(radius: 3)
                }
            }
            .mapStyle(.imagery(elevation: .flat))
            .mapControlVisibility(.hidden)

            // Radar overlay
            if let frame = radarVM.currentFrame {
                RadarOverlayView(tileUrl: frame.tileUrl, mapPosition: $mapPosition)
                    .allowsHitTesting(false)
                    .opacity(0.6)
            }

            // Controls overlay
            VStack {
                Spacer()

                // Time indicator
                if radarVM.radarData != nil {
                    RadarControlsView(radarVM: radarVM)
                        .padding(.horizontal)
                        .padding(.bottom, 8)
                }
            }

            // Loading indicator
            if radarVM.isLoading {
                ProgressView()
                    .scaleEffect(1.2)
                    .tint(.white)
            }
        }
        .task {
            await radarVM.fetchRadar()
        }
        .onDisappear {
            radarVM.stopPlayback()
        }
    }
}

// MARK: - Radar Controls

struct RadarControlsView: View {
    @Bindable var radarVM: RadarViewModel

    var body: some View {
        VStack(spacing: 8) {
            // Time label
            Text(radarVM.currentTimeLabel)
                .font(.caption)
                .fontWeight(.medium)
                .foregroundStyle(.white)
                .padding(.horizontal, 12)
                .padding(.vertical, 4)
                .background(.black.opacity(0.6))
                .clipShape(Capsule())

            // Controls bar
            HStack(spacing: 16) {
                // Play/Pause
                Button {
                    radarVM.togglePlayback()
                } label: {
                    Image(systemName: radarVM.isPlaying ? "pause.fill" : "play.fill")
                        .font(.title3)
                        .foregroundStyle(.white)
                        .frame(width: 44, height: 44)
                }

                // Timeline slider
                if radarVM.frameCount > 0 {
                    Slider(
                        value: Binding(
                            get: { Double(radarVM.currentFrameIndex) },
                            set: { radarVM.setFrame(Int($0)) }
                        ),
                        in: 0...Double(max(0, radarVM.frameCount - 1)),
                        step: 1
                    )
                    .tint(.cyan)
                }

                // Refresh
                Button {
                    Task { await radarVM.fetchRadar() }
                } label: {
                    Image(systemName: "arrow.clockwise")
                        .font(.body)
                        .foregroundStyle(.white)
                        .frame(width: 44, height: 44)
                }
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 8)
            .background(.ultraThinMaterial)
            .clipShape(RoundedRectangle(cornerRadius: 16))
        }
    }
}

// MARK: - Radar Tile Overlay

struct RadarOverlayView: View {
    let tileUrl: String
    @Binding var mapPosition: MapCameraPosition

    var body: some View {
        // The radar tiles are displayed as a semi-transparent overlay
        // In a production app, this would use MKTileOverlay
        // For SwiftUI Map, we use a simplified approach
        Color.clear
    }
}

// MARK: - Full Map Page

struct MapPage: View {
    let location: SavedLocation

    var body: some View {
        WeatherMapView(location: location)
            .ignoresSafeArea(edges: .all)
    }
}
