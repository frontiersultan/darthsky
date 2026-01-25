# Darth Sky Weather

A modern, open-source Progressive Web App for weather forecasting, inspired by the beloved Dark Sky app. Built with React, TypeScript, and free weather APIs.

## Features

### Current Conditions
- Real-time temperature with "feels like" indicator
- Comprehensive weather metrics: humidity, dewpoint, pressure, wind (speed, direction, gusts), visibility, UV index, and cloud cover
- Dynamic weather icons for 12+ weather conditions

### Precipitation Visualization
- Interactive D3-powered precipitation graph
- 60-minute precipitation timeline with intensity gradients
- Smart summaries ("Rain starting in 12 min", "Rain stopping in 45 min")

### Forecasts
- **Hourly**: 24-hour scrollable timeline with temperature bars, precipitation probability, and wind data
- **Daily**: 7-day outlook with high/low temps, UV index, precipitation, and sunrise/sunset times

### Interactive Weather Map
- MapLibre GL integration with dark theme tiles
- Real-time precipitation radar from RainViewer
- Animated radar playback with time controls
- Past and nowcast (forecast) radar frames

### Multi-Location Support
- Save and switch between multiple locations
- Search by place name (OpenStreetMap/Nominatim)
- Current location detection with geolocation

### Customizable Units
- Temperature: °F / °C
- Wind Speed: mph / km/h / m/s / knots
- Pressure: inHg / hPa / mmHg
- Visibility: miles / km
- Precipitation: inches / mm
- Time Format: 12h / 24h

### Progressive Web App
- Installable on mobile and desktop
- Offline support with smart caching
- Fast, app-like experience

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 18 + TypeScript |
| Build Tool | Vite |
| State Management | Zustand |
| Data Fetching | TanStack React Query |
| Styling | Tailwind CSS |
| Maps | MapLibre GL |
| Visualization | D3.js |
| Icons | Lucide React |
| PWA | Vite PWA Plugin + Workbox |
| Testing | Vitest + Testing Library |

## APIs Used

All APIs are free and require no authentication:

- **[Open-Meteo](https://open-meteo.com/)** - Weather forecasts and current conditions
- **[RainViewer](https://www.rainviewer.com/api.html)** - Precipitation radar tiles
- **[Nominatim](https://nominatim.org/)** - Geocoding and location search
- **[CartoDB](https://carto.com/basemaps/)** - Map tiles

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/darthsky.git
cd darthsky

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:9050`

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests |

## Project Structure

```
src/
├── components/
│   ├── common/        # Reusable UI (Button, Card, Toggle, etc.)
│   ├── layout/        # App structure (Header, TabBar, LocationSearch)
│   ├── weather/       # Weather displays (CurrentConditions, Forecasts, etc.)
│   └── map/           # Map components (WeatherMap, TimeControls)
├── pages/             # Page views (WeatherPage, MapPage, SettingsPage)
├── services/          # API integrations (weather, radar, geocoding)
├── hooks/             # Custom React hooks
├── stores/            # Zustand state stores
├── types/             # TypeScript interfaces
├── utils/             # Utility functions
└── constants/         # Configuration and constants
```

## Development Roadmap

### Phase 1: Core Completions
- [ ] Integrate minute-by-minute precipitation data source
- [ ] Add weather alerts via NWS API (or alternative)
- [ ] Use actual daily high/low from forecast data
- [ ] Expand test coverage for utilities and hooks
- [ ] Implement push notifications

### Phase 2: Enhancements
- [ ] Wind direction roses and pressure trend charts
- [ ] Detailed alert filtering and management
- [ ] Historical weather data display
- [ ] Side-by-side location comparison
- [ ] Favorites and smart location suggestions

### Phase 3: Polish
- [ ] Comprehensive accessibility audit (ARIA, keyboard nav)
- [ ] Code splitting and lazy loading
- [ ] Privacy-respecting analytics
- [ ] Multi-language support (i18n)
- [ ] Additional theme options

### Phase 4: Extended Features
- [ ] Weather trends and anomaly detection
- [ ] Air quality and pollen data
- [ ] Calendar integration and data export
- [ ] Offline map tile caching
- [ ] Home screen widgets

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by [Dark Sky](https://darksky.net/), the gold standard in weather apps
- Weather data provided by [Open-Meteo](https://open-meteo.com/)
- Radar data from [RainViewer](https://www.rainviewer.com/)
- Maps powered by [MapLibre GL](https://maplibre.org/)
