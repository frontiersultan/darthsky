import { describe, it, expect } from 'vitest';
import {
  transformCurrentConditions,
  transformHourlyForecast,
  transformDailyForecast,
  transformWeatherData,
} from './transformers';
import type { OpenMeteoResponse } from '../../types/api';
import type { Location } from '../../types';

const createMockOpenMeteoResponse = (): OpenMeteoResponse => ({
  latitude: 40.7128,
  longitude: -74.006,
  generationtime_ms: 0.5,
  utc_offset_seconds: -18000,
  timezone: 'America/New_York',
  timezone_abbreviation: 'EST',
  elevation: 10,
  current: {
    time: '2024-01-15T12:00',
    interval: 900,
    temperature_2m: 5.2,
    relative_humidity_2m: 65,
    apparent_temperature: 2.1,
    is_day: 1,
    precipitation: 0,
    rain: 0,
    showers: 0,
    snowfall: 0,
    weather_code: 2,
    cloud_cover: 45,
    pressure_msl: 1015.5,
    surface_pressure: 1013.2,
    wind_speed_10m: 15.5,
    wind_direction_10m: 225,
    wind_gusts_10m: 25.3,
  },
  hourly: {
    time: ['2024-01-15T12:00', '2024-01-15T13:00', '2024-01-15T14:00'],
    temperature_2m: [5.2, 6.1, 7.0],
    relative_humidity_2m: [65, 62, 58],
    dew_point_2m: [-1.2, -0.5, 0.2],
    apparent_temperature: [2.1, 3.0, 4.2],
    precipitation_probability: [10, 20, 30],
    precipitation: [0, 0, 0.5],
    rain: [0, 0, 0.5],
    showers: [0, 0, 0],
    snowfall: [0, 0, 0],
    weather_code: [2, 2, 61],
    cloud_cover: [45, 50, 70],
    visibility: [10000, 10000, 8000],
    wind_speed_10m: [15.5, 16.2, 18.0],
    wind_direction_10m: [225, 230, 235],
    wind_gusts_10m: [25.3, 26.1, 28.5],
    uv_index: [2.5, 3.0, 2.8],
    is_day: [1, 1, 1],
  },
  daily: {
    time: ['2024-01-15', '2024-01-16', '2024-01-17'],
    weather_code: [2, 61, 3],
    temperature_2m_max: [8.5, 10.2, 7.8],
    temperature_2m_min: [2.1, 4.5, 1.2],
    apparent_temperature_max: [5.5, 7.2, 4.8],
    apparent_temperature_min: [-1.1, 1.5, -2.2],
    sunrise: ['2024-01-15T07:15', '2024-01-16T07:14', '2024-01-17T07:13'],
    sunset: ['2024-01-15T17:00', '2024-01-16T17:01', '2024-01-17T17:03'],
    uv_index_max: [3.5, 2.8, 4.0],
    precipitation_sum: [0, 5.2, 0],
    rain_sum: [0, 5.2, 0],
    showers_sum: [0, 0, 0],
    snowfall_sum: [0, 0, 0],
    precipitation_hours: [0, 6, 0],
    precipitation_probability_max: [20, 80, 10],
    wind_speed_10m_max: [25.3, 32.1, 18.5],
    wind_gusts_10m_max: [40.5, 50.2, 28.3],
    wind_direction_10m_dominant: [225, 270, 180],
  },
});

const createMockLocation = (): Location => ({
  id: '1',
  name: 'New York',
  displayName: 'New York, NY, US',
  coordinates: { latitude: 40.7128, longitude: -74.006 },
  country: 'US',
  state: 'NY',
});

describe('transformCurrentConditions', () => {
  it('should transform current conditions correctly', () => {
    const response = createMockOpenMeteoResponse();
    const result = transformCurrentConditions(response);

    expect(result.temperature).toBe(5.2);
    expect(result.feelsLike).toBe(2.1);
    expect(result.humidity).toBe(65);
    expect(result.dewPoint).toBe(-1.2);
    expect(result.pressure).toBe(1015.5);
    expect(result.windSpeed).toBe(15.5);
    expect(result.windDirection).toBe(225);
    expect(result.windGust).toBe(25.3);
    expect(result.cloudCover).toBe(45);
    expect(result.weatherCode).toBe(2);
    expect(result.isDay).toBe(true);
    expect(result.precipitation).toBe(0);
  });

  it('should convert visibility from meters to km', () => {
    const response = createMockOpenMeteoResponse();
    const result = transformCurrentConditions(response);

    expect(result.visibility).toBe(10); // 10000m / 1000 = 10km
  });

  it('should get UV index from hourly data', () => {
    const response = createMockOpenMeteoResponse();
    const result = transformCurrentConditions(response);

    expect(result.uvIndex).toBe(2.5);
  });

  it('should get precipitation probability from hourly data', () => {
    const response = createMockOpenMeteoResponse();
    const result = transformCurrentConditions(response);

    expect(result.precipitationProbability).toBe(10);
  });

  it('should set correct summary and icon', () => {
    const response = createMockOpenMeteoResponse();
    const result = transformCurrentConditions(response);

    expect(result.summary).toBe('Partly cloudy');
    expect(result.icon).toBe('partly-cloudy-day');
  });

  it('should use night icon when is_day is 0', () => {
    const response = createMockOpenMeteoResponse();
    response.current!.is_day = 0;
    const result = transformCurrentConditions(response);

    expect(result.isDay).toBe(false);
    expect(result.icon).toBe('partly-cloudy-night');
  });
});

describe('transformHourlyForecast', () => {
  it('should transform hourly forecast correctly', () => {
    const response = createMockOpenMeteoResponse();
    const result = transformHourlyForecast(response);

    expect(result).toHaveLength(3);
  });

  it('should transform first hour correctly', () => {
    const response = createMockOpenMeteoResponse();
    const result = transformHourlyForecast(response);

    expect(result[0].temperature).toBe(5.2);
    expect(result[0].feelsLike).toBe(2.1);
    expect(result[0].humidity).toBe(65);
    expect(result[0].precipitationProbability).toBe(10);
    expect(result[0].precipitation).toBe(0);
    expect(result[0].weatherCode).toBe(2);
    expect(result[0].windSpeed).toBe(15.5);
    expect(result[0].windDirection).toBe(225);
    expect(result[0].isDay).toBe(true);
    expect(result[0].icon).toBe('partly-cloudy-day');
  });

  it('should transform hour with rain correctly', () => {
    const response = createMockOpenMeteoResponse();
    const result = transformHourlyForecast(response);

    expect(result[2].weatherCode).toBe(61);
    expect(result[2].precipitation).toBe(0.5);
    expect(result[2].precipitationProbability).toBe(30);
    expect(result[2].icon).toBe('rain');
  });

  it('should parse time strings to Date objects', () => {
    const response = createMockOpenMeteoResponse();
    const result = transformHourlyForecast(response);

    expect(result[0].time).toBeInstanceOf(Date);
    expect(result[0].time.getHours()).toBe(12);
  });
});

describe('transformDailyForecast', () => {
  it('should transform daily forecast correctly', () => {
    const response = createMockOpenMeteoResponse();
    const result = transformDailyForecast(response);

    expect(result).toHaveLength(3);
  });

  it('should transform first day correctly', () => {
    const response = createMockOpenMeteoResponse();
    const result = transformDailyForecast(response);

    expect(result[0].temperatureMax).toBe(8.5);
    expect(result[0].temperatureMin).toBe(2.1);
    expect(result[0].precipitationProbability).toBe(20);
    expect(result[0].precipitationSum).toBe(0);
    expect(result[0].weatherCode).toBe(2);
    expect(result[0].uvIndexMax).toBe(3.5);
    expect(result[0].windSpeedMax).toBe(25.3);
    expect(result[0].windDirection).toBe(225);
    expect(result[0].summary).toBe('Partly cloudy');
    expect(result[0].icon).toBe('partly-cloudy-day');
  });

  it('should transform rainy day correctly', () => {
    const response = createMockOpenMeteoResponse();
    const result = transformDailyForecast(response);

    expect(result[1].weatherCode).toBe(61);
    expect(result[1].precipitationSum).toBe(5.2);
    expect(result[1].precipitationProbability).toBe(80);
    expect(result[1].icon).toBe('rain');
  });

  it('should parse date and time strings to Date objects', () => {
    const response = createMockOpenMeteoResponse();
    const result = transformDailyForecast(response);

    expect(result[0].date).toBeInstanceOf(Date);
    expect(result[0].sunrise).toBeInstanceOf(Date);
    expect(result[0].sunset).toBeInstanceOf(Date);
  });

  it('should always use day icon for daily forecast', () => {
    const response = createMockOpenMeteoResponse();
    const result = transformDailyForecast(response);

    // Daily icons should always be day variants
    expect(result[0].icon).toBe('partly-cloudy-day');
  });
});

describe('transformWeatherData', () => {
  it('should transform complete weather data', () => {
    const response = createMockOpenMeteoResponse();
    const location = createMockLocation();
    const result = transformWeatherData(response, location);

    expect(result.location).toEqual(location);
    expect(result.current).toBeDefined();
    expect(result.hourly).toHaveLength(3);
    expect(result.daily).toHaveLength(3);
    expect(result.lastUpdated).toBeInstanceOf(Date);
  });

  it('should set minutely to undefined', () => {
    const response = createMockOpenMeteoResponse();
    const location = createMockLocation();
    const result = transformWeatherData(response, location);

    expect(result.minutely).toBeUndefined();
  });

  it('should set alerts to empty array', () => {
    const response = createMockOpenMeteoResponse();
    const location = createMockLocation();
    const result = transformWeatherData(response, location);

    expect(result.alerts).toEqual([]);
  });

  it('should set lastUpdated to current time', () => {
    const response = createMockOpenMeteoResponse();
    const location = createMockLocation();
    const before = new Date();
    const result = transformWeatherData(response, location);
    const after = new Date();

    expect(result.lastUpdated.getTime()).toBeGreaterThanOrEqual(before.getTime());
    expect(result.lastUpdated.getTime()).toBeLessThanOrEqual(after.getTime());
  });
});
