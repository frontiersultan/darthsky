import Foundation
import Observation

@Observable
final class RadarViewModel {
    var radarData: RadarData?
    var currentFrameIndex: Int = 0
    var isPlaying = false
    var isLoading = false
    var error: String?

    private var playbackTask: Task<Void, Never>?

    var allFrames: [RadarFrame] {
        guard let data = radarData else { return [] }
        return RadarService.allFrames(from: data)
    }

    var currentFrame: RadarFrame? {
        let frames = allFrames
        guard currentFrameIndex >= 0, currentFrameIndex < frames.count else { return nil }
        return frames[currentFrameIndex]
    }

    var currentTimeLabel: String {
        guard let frame = currentFrame else { return "--" }
        return RadarService.formatRadarTime(timestamp: frame.timestamp)
    }

    var frameCount: Int {
        allFrames.count
    }

    func fetchRadar() async {
        isLoading = true
        error = nil

        do {
            let data = try await RadarService.shared.fetchRadarData()
            radarData = data
            // Start at latest past frame
            let pastCount = data.past.count
            currentFrameIndex = max(0, pastCount - 1)
        } catch {
            self.error = error.localizedDescription
        }

        isLoading = false
    }

    // MARK: - Playback Controls

    func togglePlayback() {
        if isPlaying {
            stopPlayback()
        } else {
            startPlayback()
        }
    }

    func startPlayback() {
        isPlaying = true
        playbackTask = Task { [weak self] in
            while !Task.isCancelled {
                try? await Task.sleep(for: .milliseconds(500))
                guard !Task.isCancelled, let self = self else { break }
                await MainActor.run {
                    self.advanceFrame()
                }
            }
        }
    }

    func stopPlayback() {
        isPlaying = false
        playbackTask?.cancel()
        playbackTask = nil
    }

    func advanceFrame() {
        let total = frameCount
        guard total > 0 else { return }
        currentFrameIndex = (currentFrameIndex + 1) % total
    }

    func setFrame(_ index: Int) {
        currentFrameIndex = max(0, min(index, frameCount - 1))
    }
}
