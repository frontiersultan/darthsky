# API Integration

Darth Sky Weather integrates with several free, public APIs for weather data, radar imagery, and geocoding.

## APIs Overview

| API | Purpose | Rate Limits | Authentication |
|-----|---------|-------------|----------------|
| Open-Meteo | Weather data | 10,000/day | None |
| RainViewer | Radar imagery | Unlimited | None |
| Nominatim | Geocoding | 1 req/sec | None |
| CartoDB | Map tiles | Fair use | None |

## Open-Meteo Weather API

**Base URL**: `https://api.open-meteo.com/v1/forecast`

**Used For**:
- Current weather conditions
- Hourly forecast (48 hours)
- Daily forecast (7 days)

**Example Request**:
```
GET /v1/forecast?latitude=40.7128&longitude=-74.0060
  &current=temperature_2m,relative_humidity_2m,weather_code,...
  &hourly=temperature_2m,precipitation_probability,...
  &daily=weather_code,temperature_2m_max,temperature_2m_min,...
  &temperature_unit=fahrenheit
  &timezone=auto
```

**Data Transformation**:
Raw API response is transformed in `src/services/transformers.ts` to match our internal types.

## RainViewer Radar API

**Base URL**: `https://api.rainviewer.com/public/weather-maps.json`

**Used For**:
- Precipitation radar tiles
- Past radar frames (2 hours)
- Forecast/nowcast frames (30 min)

**Tile URL Pattern**:
```
https://tilecache.rainviewer.com/v2/radar/{timestamp}/256/{z}/{x}/{y}/2/1_1.png
```

**Integration**:
Radar tiles are added as a MapLibre raster layer and animated using time controls.

## Nominatim Geocoding API

**Base URL**: `https://nominatim.openstreetmap.org`

**Used For**:
- Location search by name
- Reverse geocoding (coordinates to name)

**Usage Policy**:
- Maximum 1 request per second
- Must include User-Agent header
- See [Nominatim Usage Policy](https://operations.osmfoundation.org/policies/nominatim/)

**Example**:
```
GET /search?q=New%20York&format=json&limit=5
```

## Request Handling

### React Query Integration

All API calls use TanStack React Query for:
- Automatic caching (5 minute stale time)
- Background refetching
- Error handling and retries
- Loading states

```tsx
const { data, isLoading, error } = useQuery({
  queryKey: ['weather', lat, lon],
  queryFn: () => fetchWeather(lat, lon),
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

### Error Handling

API errors are caught and displayed to users via error boundaries and toast notifications.

### Caching Strategy

| Data Type | Stale Time | Cache Time |
|-----------|------------|------------|
| Weather | 5 minutes | 30 minutes |
| Radar | 2 minutes | 10 minutes |
| Geocoding | 1 hour | 24 hours |

## Service Files

- `src/services/weather.ts` - Open-Meteo integration
- `src/services/radar.ts` - RainViewer integration
- `src/services/geocoding.ts` - Nominatim integration
- `src/services/transformers.ts` - Data transformation utilities
