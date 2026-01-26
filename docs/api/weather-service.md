# Weather Service API

The weather service handles fetching and transforming data from the Open-Meteo API.

## Location

`src/services/weather.ts`

## Functions

### `fetchWeatherData`

Fetches complete weather data for a location.

```typescript
async function fetchWeatherData(
  lat: number,
  lon: number,
  units: UnitSettings
): Promise<WeatherData>
```

**Parameters**:
| Name | Type | Description |
|------|------|-------------|
| `lat` | `number` | Latitude (-90 to 90) |
| `lon` | `number` | Longitude (-180 to 180) |
| `units` | `UnitSettings` | User's unit preferences |

**Returns**: `Promise<WeatherData>`

**Example**:
```typescript
const weather = await fetchWeatherData(40.7128, -74.0060, {
  temperatureUnit: 'fahrenheit',
  windSpeedUnit: 'mph',
  // ...
});
```

## Types

### `WeatherData`

```typescript
interface WeatherData {
  current: CurrentConditions;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  location: LocationInfo;
}
```

### `CurrentConditions`

```typescript
interface CurrentConditions {
  temperature: number;
  feelsLike: number;
  humidity: number;
  dewpoint: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  visibility: number;
  uvIndex: number;
  cloudCover: number;
  weatherCode: number;
  isDay: boolean;
}
```

### `HourlyForecast`

```typescript
interface HourlyForecast {
  time: Date;
  temperature: number;
  precipitationProbability: number;
  precipitation: number;
  weatherCode: number;
  windSpeed: number;
  windDirection: number;
}
```

### `DailyForecast`

```typescript
interface DailyForecast {
  date: Date;
  temperatureMax: number;
  temperatureMin: number;
  precipitationProbability: number;
  precipitationSum: number;
  weatherCode: number;
  uvIndexMax: number;
  sunrise: Date;
  sunset: Date;
}
```

## Data Transformation

Raw API responses are transformed in `src/services/transformers.ts`:

- Timestamps converted to Date objects
- Weather codes mapped to conditions
- Units applied based on user settings

## Caching

Weather data is cached by React Query with:
- **Stale time**: 5 minutes
- **Cache time**: 30 minutes
- **Refetch on window focus**: Yes

## Error Handling

The service throws errors for:
- Network failures
- API errors (non-2xx responses)
- Invalid coordinates

Errors should be caught and displayed to users via React Query's error state.
