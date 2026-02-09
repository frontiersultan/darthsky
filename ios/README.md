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
- [ ] Create App Group `group.com.darthsky.weather` in Apple Developer Portal
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

DarthSkyWidgets/       # Widget extension
├── Providers/         # Timeline providers for widget data
├── Views/             # Widget UI views for all sizes
├── Widgets/           # Widget definitions and configurations
└── Resources/         # Widget assets and Info.plist

Shared/                # Code shared between app and widgets
└── SharedDataManager  # App Group data sync
```

## Features

### Main App
- Real-time weather conditions with dynamic gradient backgrounds
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

### Widgets (14 total, matching iOS Weather app)

**Home Screen Widgets:**
| Widget | Sizes | Description |
|--------|-------|-------------|
| Current Weather | Small, Medium | Temperature, conditions, location, hourly forecast |
| Forecast | Medium, Large | 5-day / 7-day forecast with temperature range bars |
| UV Index | Small | UV gauge with level and protection advice |
| Sunrise & Sunset | Small | Times with animated sun arc visualization |
| Wind | Small | Speed, compass direction, and gusts |
| Precipitation | Small | Probability with 8-hour bar chart |
| Feels Like | Small | Apparent temperature vs actual |
| Humidity | Small | Current humidity and dew point |
| Visibility | Small | Visibility distance and conditions |
| Pressure | Small | Atmospheric pressure with gauge |

**Lock Screen Widgets:**
| Widget | Sizes | Description |
|--------|-------|-------------|
| Conditions | Circular, Rectangular, Inline | Temperature and icon |
| Hourly Forecast | Rectangular | Next 5 hours with icons |
| UV Index | Circular | UV gauge |
| Wind | Circular | Wind speed |

All widgets feature:
- Dynamic weather-themed gradient backgrounds
- Auto-refresh every 15 minutes
- Data sync via App Group from the main app
- SF Symbols for weather condition icons

## APIs Used (Free, No Keys Required)

- **Open-Meteo**: Weather forecasts
- **RainViewer**: Precipitation radar
- **OpenStreetMap Nominatim**: Geocoding/location search

## Privacy

- Location data is only used locally for weather lookups
- No analytics or tracking
- Settings stored locally via UserDefaults
- Widget data shared via App Group (`group.com.darthsky.weather`)
- See `PrivacyInfo.xcprivacy` for Apple's required privacy manifest
