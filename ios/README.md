# Darth Sky Weather - iOS App

A native iOS weather app built with SwiftUI, the iOS companion to the Darth Sky Weather web app.

## Requirements

- Xcode 15.0+
- iOS 17.0+
- [XcodeGen](https://github.com/yonaskolb/XcodeGen) (for generating the Xcode project)

## Setup

1. Install XcodeGen if you haven't already:
   ```bash
   brew install xcodegen
   ```

2. Generate the Xcode project:
   ```bash
   cd ios
   xcodegen generate
   ```

3. Open the generated project:
   ```bash
   open DarthSky.xcodeproj
   ```

4. Set your development team in Xcode's Signing & Capabilities.

5. Build and run on a simulator or device.

## App Store Submission Checklist

- [ ] Set your Apple Developer Team ID in `project.yml` (`DEVELOPMENT_TEAM`)
- [ ] Add a 1024x1024 app icon to `Assets.xcassets/AppIcon.appiconset/`
- [ ] Update the bundle identifier if needed
- [ ] Configure signing certificates and provisioning profiles
- [ ] Fill in App Store Connect metadata (description, screenshots, etc.)
- [ ] Submit for review

## Architecture

```
DarthSky/
├── App/               # App entry point and root ContentView
├── Models/            # Data models (Weather, Location, Settings, API responses)
├── Services/          # Network services (Weather, Geocoding, Radar)
├── ViewModels/        # Observable state management
├── Views/             # SwiftUI views
│   ├── Weather/       # Weather page and components
│   ├── Map/           # Interactive radar map
│   ├── Settings/      # Settings page
│   ├── Location/      # Location search and management
│   └── Components/    # Shared UI components
├── Utilities/         # Formatting, colors, helpers
├── Extensions/        # Swift/SwiftUI extensions
└── Resources/         # Assets, Info.plist, PrivacyInfo
```

## Features

- Real-time weather conditions with dynamic backgrounds
- 48-hour scrollable hourly forecast
- 7-day daily forecast with temperature range bars
- Interactive precipitation chart (Swift Charts)
- Weather radar map with animated playback
- Multi-location support with search
- Customizable units (temperature, wind, pressure, etc.)
- Light/Dark/Auto theme support
- Pull-to-refresh with auto-refresh every 5 minutes
- Weather alerts display
- iOS accessibility support

## APIs Used (Free, No Keys Required)

- **Open-Meteo**: Weather forecasts
- **RainViewer**: Precipitation radar
- **OpenStreetMap Nominatim**: Geocoding/location search

## Privacy

- Location data is only used locally for weather lookups
- No analytics or tracking
- Settings stored locally via UserDefaults
- See `PrivacyInfo.xcprivacy` for Apple's required privacy manifest
