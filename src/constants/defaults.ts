import type { Coordinates, Location } from '../types';

export const DEFAULT_COORDINATES: Coordinates = {
  latitude: 40.7128,
  longitude: -74.006,
};

export const DEFAULT_LOCATION: Location = {
  id: 'default',
  name: 'New York',
  displayName: 'New York, NY',
  coordinates: DEFAULT_COORDINATES,
  country: 'United States',
  state: 'New York',
  timezone: 'America/New_York',
};

export const API_ENDPOINTS = {
  OPEN_METEO: 'https://api.open-meteo.com/v1/forecast',
  NOMINATIM_SEARCH: 'https://nominatim.openstreetmap.org/search',
  NOMINATIM_REVERSE: 'https://nominatim.openstreetmap.org/reverse',
  RAINVIEWER_MAPS: 'https://api.rainviewer.com/public/weather-maps.json',
  RAINVIEWER_TILES: 'https://tilecache.rainviewer.com/v2/radar',
  CARTO_TILES: 'https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
} as const;

export const MAP_CONFIG = {
  defaultCenter: DEFAULT_COORDINATES,
  defaultZoom: 8,
  minZoom: 3,
  maxZoom: 12,
  tileSize: 256,
} as const;

export const HOURLY_FORECAST_HOURS = 48;
export const DAILY_FORECAST_DAYS = 7;
export const MINUTELY_FORECAST_MINUTES = 60;

export const REFRESH_INTERVALS = {
  WEATHER: 5 * 60 * 1000, // 5 minutes
  RADAR: 5 * 60 * 1000, // 5 minutes
  LOCATION: 15 * 60 * 1000, // 15 minutes
} as const;
