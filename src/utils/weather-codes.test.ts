import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getWeatherSummary,
  getWeatherIcon,
  isPrecipitation,
  isSnow,
  isRain,
  isThunderstorm,
  getPrecipitationType,
  getPrecipitationIntensity,
  generatePrecipitationSummary,
} from './weather-codes';
import type { WeatherCode } from '../types';

describe('getWeatherSummary', () => {
  it('should return correct summary for clear conditions', () => {
    expect(getWeatherSummary(0)).toBe('Clear sky');
    expect(getWeatherSummary(1)).toBe('Mainly clear');
    expect(getWeatherSummary(2)).toBe('Partly cloudy');
    expect(getWeatherSummary(3)).toBe('Overcast');
  });

  it('should return correct summary for fog conditions', () => {
    expect(getWeatherSummary(45)).toBe('Fog');
    expect(getWeatherSummary(48)).toBe('Depositing rime fog');
  });

  it('should return correct summary for drizzle conditions', () => {
    expect(getWeatherSummary(51)).toBe('Light drizzle');
    expect(getWeatherSummary(53)).toBe('Moderate drizzle');
    expect(getWeatherSummary(55)).toBe('Dense drizzle');
  });

  it('should return correct summary for rain conditions', () => {
    expect(getWeatherSummary(61)).toBe('Slight rain');
    expect(getWeatherSummary(63)).toBe('Moderate rain');
    expect(getWeatherSummary(65)).toBe('Heavy rain');
  });

  it('should return correct summary for snow conditions', () => {
    expect(getWeatherSummary(71)).toBe('Slight snow');
    expect(getWeatherSummary(73)).toBe('Moderate snow');
    expect(getWeatherSummary(75)).toBe('Heavy snow');
    expect(getWeatherSummary(77)).toBe('Snow grains');
  });

  it('should return correct summary for thunderstorms', () => {
    expect(getWeatherSummary(95)).toBe('Thunderstorm');
    expect(getWeatherSummary(96)).toBe('Thunderstorm with slight hail');
    expect(getWeatherSummary(99)).toBe('Thunderstorm with heavy hail');
  });

  it('should return Unknown for invalid codes', () => {
    expect(getWeatherSummary(999 as WeatherCode)).toBe('Unknown');
  });
});

describe('getWeatherIcon', () => {
  it('should return day icons during day', () => {
    expect(getWeatherIcon(0, true)).toBe('clear-day');
    expect(getWeatherIcon(1, true)).toBe('clear-day');
    expect(getWeatherIcon(2, true)).toBe('partly-cloudy-day');
  });

  it('should return night icons during night', () => {
    expect(getWeatherIcon(0, false)).toBe('clear-night');
    expect(getWeatherIcon(1, false)).toBe('clear-night');
    expect(getWeatherIcon(2, false)).toBe('partly-cloudy-night');
  });

  it('should return same icon for conditions without night variant', () => {
    expect(getWeatherIcon(3, true)).toBe('cloudy');
    expect(getWeatherIcon(3, false)).toBe('cloudy');
    expect(getWeatherIcon(45, true)).toBe('fog');
    expect(getWeatherIcon(45, false)).toBe('fog');
  });

  it('should return precipitation icons', () => {
    expect(getWeatherIcon(51, true)).toBe('drizzle');
    expect(getWeatherIcon(61, true)).toBe('rain');
    expect(getWeatherIcon(71, true)).toBe('snow');
    expect(getWeatherIcon(56, true)).toBe('sleet');
    expect(getWeatherIcon(95, true)).toBe('thunderstorm');
  });

  it('should return cloudy for unknown codes', () => {
    expect(getWeatherIcon(999 as WeatherCode, true)).toBe('cloudy');
  });
});

describe('isPrecipitation', () => {
  it('should return false for clear conditions', () => {
    expect(isPrecipitation(0)).toBe(false);
    expect(isPrecipitation(1)).toBe(false);
    expect(isPrecipitation(2)).toBe(false);
    expect(isPrecipitation(3)).toBe(false);
    expect(isPrecipitation(45)).toBe(false);
    expect(isPrecipitation(48)).toBe(false);
  });

  it('should return true for precipitation conditions', () => {
    expect(isPrecipitation(51)).toBe(true);
    expect(isPrecipitation(61)).toBe(true);
    expect(isPrecipitation(71)).toBe(true);
    expect(isPrecipitation(95)).toBe(true);
  });
});

describe('isSnow', () => {
  it('should return true for snow conditions', () => {
    expect(isSnow(71)).toBe(true);
    expect(isSnow(73)).toBe(true);
    expect(isSnow(75)).toBe(true);
    expect(isSnow(77)).toBe(true);
    expect(isSnow(85)).toBe(true);
    expect(isSnow(86)).toBe(true);
  });

  it('should return false for non-snow conditions', () => {
    expect(isSnow(0)).toBe(false);
    expect(isSnow(61)).toBe(false);
    expect(isSnow(95)).toBe(false);
  });
});

describe('isRain', () => {
  it('should return true for rain conditions', () => {
    expect(isRain(51)).toBe(true);
    expect(isRain(53)).toBe(true);
    expect(isRain(55)).toBe(true);
    expect(isRain(61)).toBe(true);
    expect(isRain(63)).toBe(true);
    expect(isRain(65)).toBe(true);
    expect(isRain(80)).toBe(true);
    expect(isRain(81)).toBe(true);
    expect(isRain(82)).toBe(true);
  });

  it('should return false for non-rain conditions', () => {
    expect(isRain(0)).toBe(false);
    expect(isRain(71)).toBe(false);
    expect(isRain(95)).toBe(false);
  });
});

describe('isThunderstorm', () => {
  it('should return true for thunderstorm conditions', () => {
    expect(isThunderstorm(95)).toBe(true);
    expect(isThunderstorm(96)).toBe(true);
    expect(isThunderstorm(99)).toBe(true);
  });

  it('should return false for non-thunderstorm conditions', () => {
    expect(isThunderstorm(0)).toBe(false);
    expect(isThunderstorm(61)).toBe(false);
    expect(isThunderstorm(71)).toBe(false);
  });
});

describe('getPrecipitationType', () => {
  it('should return none for clear conditions', () => {
    expect(getPrecipitationType(0)).toBe('none');
    expect(getPrecipitationType(3)).toBe('none');
    expect(getPrecipitationType(45)).toBe('none');
  });

  it('should return sleet for freezing conditions', () => {
    expect(getPrecipitationType(56)).toBe('sleet');
    expect(getPrecipitationType(57)).toBe('sleet');
    expect(getPrecipitationType(66)).toBe('sleet');
    expect(getPrecipitationType(67)).toBe('sleet');
  });

  it('should return snow for snow conditions', () => {
    expect(getPrecipitationType(71)).toBe('snow');
    expect(getPrecipitationType(73)).toBe('snow');
    expect(getPrecipitationType(85)).toBe('snow');
  });

  it('should return rain for rain and thunderstorm conditions', () => {
    expect(getPrecipitationType(51)).toBe('rain');
    expect(getPrecipitationType(61)).toBe('rain');
    expect(getPrecipitationType(80)).toBe('rain');
    expect(getPrecipitationType(95)).toBe('rain');
  });
});

describe('getPrecipitationIntensity', () => {
  it('should return none for zero precipitation', () => {
    expect(getPrecipitationIntensity(0)).toBe('none');
  });

  it('should return light for low precipitation', () => {
    expect(getPrecipitationIntensity(0.5)).toBe('light');
    expect(getPrecipitationIntensity(2.4)).toBe('light');
  });

  it('should return medium for moderate precipitation', () => {
    expect(getPrecipitationIntensity(2.5)).toBe('medium');
    expect(getPrecipitationIntensity(7.5)).toBe('medium');
  });

  it('should return heavy for heavy precipitation', () => {
    expect(getPrecipitationIntensity(7.6)).toBe('heavy');
    expect(getPrecipitationIntensity(20)).toBe('heavy');
  });
});

describe('generatePrecipitationSummary', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-15T12:00:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return null for undefined or empty minutely data', () => {
    expect(generatePrecipitationSummary(undefined)).toBeNull();
    expect(generatePrecipitationSummary([])).toBeNull();
  });

  it('should indicate rain continuing when raining with no stop in sight', () => {
    const minutely = Array.from({ length: 60 }, (_, i) => ({
      time: new Date(Date.now() + i * 60000),
      intensity: 5,
      probability: 80,
    }));
    expect(generatePrecipitationSummary(minutely)).toBe('Rain continuing for the next hour');
  });

  it('should indicate when rain is stopping', () => {
    const minutely = [
      { time: new Date('2024-01-15T12:00:00'), intensity: 5, probability: 80 },
      { time: new Date('2024-01-15T12:05:00'), intensity: 5, probability: 80 },
      { time: new Date('2024-01-15T12:10:00'), intensity: 5, probability: 80 },
      { time: new Date('2024-01-15T12:15:00'), intensity: 0, probability: 20 },
      { time: new Date('2024-01-15T12:20:00'), intensity: 0, probability: 10 },
    ];
    expect(generatePrecipitationSummary(minutely)).toBe('Rain stopping in 15 min');
  });

  it('should indicate when rain is starting', () => {
    const minutely = [
      { time: new Date('2024-01-15T12:00:00'), intensity: 0, probability: 20 },
      { time: new Date('2024-01-15T12:05:00'), intensity: 0, probability: 30 },
      { time: new Date('2024-01-15T12:10:00'), intensity: 0, probability: 50 },
      { time: new Date('2024-01-15T12:15:00'), intensity: 3, probability: 80 },
      { time: new Date('2024-01-15T12:20:00'), intensity: 5, probability: 90 },
    ];
    expect(generatePrecipitationSummary(minutely)).toBe('Rain starting in 15 min');
  });

  it('should indicate no rain expected when clear', () => {
    const minutely = Array.from({ length: 60 }, (_, i) => ({
      time: new Date(Date.now() + i * 60000),
      intensity: 0,
      probability: 10,
    }));
    expect(generatePrecipitationSummary(minutely)).toBe('No rain expected in the next hour');
  });
});
