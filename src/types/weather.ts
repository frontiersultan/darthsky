export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Location {
  id: string;
  name: string;
  displayName: string;
  coordinates: Coordinates;
  isCurrentLocation?: boolean;
  country?: string;
  state?: string;
  timezone?: string;
}

export interface CurrentConditions {
  temperature: number;
  feelsLike: number;
  humidity: number;
  dewPoint: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  windGust?: number;
  visibility: number;
  uvIndex: number;
  cloudCover: number;
  weatherCode: WeatherCode;
  summary: string;
  icon: WeatherIcon;
  isDay: boolean;
  precipitationProbability: number;
  precipitation: number;
}

export interface HourlyForecast {
  time: Date;
  temperature: number;
  feelsLike: number;
  humidity: number;
  precipitationProbability: number;
  precipitation: number;
  weatherCode: WeatherCode;
  icon: WeatherIcon;
  windSpeed: number;
  windDirection: number;
  isDay: boolean;
}

export interface DailyForecast {
  date: Date;
  temperatureMax: number;
  temperatureMin: number;
  sunrise: Date;
  sunset: Date;
  precipitationProbability: number;
  precipitationSum: number;
  weatherCode: WeatherCode;
  icon: WeatherIcon;
  summary: string;
  uvIndexMax: number;
  windSpeedMax: number;
  windDirection: number;
}

export interface PrecipitationMinute {
  time: Date;
  intensity: number;
  probability: number;
}

export interface WeatherAlert {
  id: string;
  event: string;
  headline: string;
  description: string;
  severity: 'minor' | 'moderate' | 'severe' | 'extreme';
  urgency: 'immediate' | 'expected' | 'future' | 'past' | 'unknown';
  start: Date;
  end: Date;
  areas: string[];
}

export interface WeatherData {
  location: Location;
  current: CurrentConditions;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  minutely?: PrecipitationMinute[];
  alerts: WeatherAlert[];
  lastUpdated: Date;
}

export type WeatherCode =
  | 0   // Clear sky
  | 1   // Mainly clear
  | 2   // Partly cloudy
  | 3   // Overcast
  | 45  // Fog
  | 48  // Depositing rime fog
  | 51  // Light drizzle
  | 53  // Moderate drizzle
  | 55  // Dense drizzle
  | 56  // Light freezing drizzle
  | 57  // Dense freezing drizzle
  | 61  // Slight rain
  | 63  // Moderate rain
  | 65  // Heavy rain
  | 66  // Light freezing rain
  | 67  // Heavy freezing rain
  | 71  // Slight snow
  | 73  // Moderate snow
  | 75  // Heavy snow
  | 77  // Snow grains
  | 80  // Slight rain showers
  | 81  // Moderate rain showers
  | 82  // Violent rain showers
  | 85  // Slight snow showers
  | 86  // Heavy snow showers
  | 95  // Thunderstorm
  | 96  // Thunderstorm with slight hail
  | 99; // Thunderstorm with heavy hail

export type WeatherIcon =
  | 'clear-day'
  | 'clear-night'
  | 'partly-cloudy-day'
  | 'partly-cloudy-night'
  | 'cloudy'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'sleet'
  | 'snow'
  | 'thunderstorm'
  | 'wind';

export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type WindSpeedUnit = 'kmh' | 'mph' | 'ms' | 'knots';
export type PressureUnit = 'hpa' | 'inhg' | 'mmhg';
export type VisibilityUnit = 'km' | 'mi';
export type PrecipitationUnit = 'mm' | 'in';
export type TimeFormat = '12h' | '24h';

export interface UnitPreferences {
  temperature: TemperatureUnit;
  windSpeed: WindSpeedUnit;
  pressure: PressureUnit;
  visibility: VisibilityUnit;
  precipitation: PrecipitationUnit;
  timeFormat: TimeFormat;
}

export type ThemeMode = 'light' | 'dark' | 'auto';
