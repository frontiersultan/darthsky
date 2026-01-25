import type { WeatherCode, WeatherIcon } from '../types';

interface WeatherCodeInfo {
  summary: string;
  icon: WeatherIcon;
  iconNight?: WeatherIcon;
}

const weatherCodeMap: Record<number, WeatherCodeInfo> = {
  0: { summary: 'Clear sky', icon: 'clear-day', iconNight: 'clear-night' },
  1: { summary: 'Mainly clear', icon: 'clear-day', iconNight: 'clear-night' },
  2: { summary: 'Partly cloudy', icon: 'partly-cloudy-day', iconNight: 'partly-cloudy-night' },
  3: { summary: 'Overcast', icon: 'cloudy' },
  45: { summary: 'Fog', icon: 'fog' },
  48: { summary: 'Depositing rime fog', icon: 'fog' },
  51: { summary: 'Light drizzle', icon: 'drizzle' },
  53: { summary: 'Moderate drizzle', icon: 'drizzle' },
  55: { summary: 'Dense drizzle', icon: 'drizzle' },
  56: { summary: 'Light freezing drizzle', icon: 'sleet' },
  57: { summary: 'Dense freezing drizzle', icon: 'sleet' },
  61: { summary: 'Slight rain', icon: 'rain' },
  63: { summary: 'Moderate rain', icon: 'rain' },
  65: { summary: 'Heavy rain', icon: 'rain' },
  66: { summary: 'Light freezing rain', icon: 'sleet' },
  67: { summary: 'Heavy freezing rain', icon: 'sleet' },
  71: { summary: 'Slight snow', icon: 'snow' },
  73: { summary: 'Moderate snow', icon: 'snow' },
  75: { summary: 'Heavy snow', icon: 'snow' },
  77: { summary: 'Snow grains', icon: 'snow' },
  80: { summary: 'Slight rain showers', icon: 'rain' },
  81: { summary: 'Moderate rain showers', icon: 'rain' },
  82: { summary: 'Violent rain showers', icon: 'rain' },
  85: { summary: 'Slight snow showers', icon: 'snow' },
  86: { summary: 'Heavy snow showers', icon: 'snow' },
  95: { summary: 'Thunderstorm', icon: 'thunderstorm' },
  96: { summary: 'Thunderstorm with slight hail', icon: 'thunderstorm' },
  99: { summary: 'Thunderstorm with heavy hail', icon: 'thunderstorm' },
};

export function getWeatherSummary(code: WeatherCode): string {
  return weatherCodeMap[code]?.summary ?? 'Unknown';
}

export function getWeatherIcon(code: WeatherCode, isDay: boolean): WeatherIcon {
  const info = weatherCodeMap[code];
  if (!info) return 'cloudy';

  if (!isDay && info.iconNight) {
    return info.iconNight;
  }
  return info.icon;
}

export function isPrecipitation(code: WeatherCode): boolean {
  return code >= 51;
}

export function isSnow(code: WeatherCode): boolean {
  return (code >= 71 && code <= 77) || code === 85 || code === 86;
}

export function isRain(code: WeatherCode): boolean {
  return (
    (code >= 51 && code <= 67) ||
    (code >= 80 && code <= 82)
  );
}

export function isThunderstorm(code: WeatherCode): boolean {
  return code >= 95;
}

export function getPrecipitationType(code: WeatherCode): 'none' | 'rain' | 'snow' | 'sleet' | 'mixed' {
  if (!isPrecipitation(code)) return 'none';
  if (code === 56 || code === 57 || code === 66 || code === 67) return 'sleet';
  if (isSnow(code)) return 'snow';
  if (isRain(code) || isThunderstorm(code)) return 'rain';
  return 'mixed';
}

export function getPrecipitationIntensity(precipMm: number): 'none' | 'light' | 'medium' | 'heavy' {
  if (precipMm === 0) return 'none';
  if (precipMm < 2.5) return 'light';
  if (precipMm < 7.6) return 'medium';
  return 'heavy';
}

export function generatePrecipitationSummary(
  minutely: Array<{ time: Date; intensity: number; probability: number }> | undefined
): string | null {
  if (!minutely || minutely.length === 0) return null;

  const now = new Date();
  const currentlyRaining = minutely[0]?.intensity > 0;

  if (currentlyRaining) {
    const stopIndex = minutely.findIndex((m) => m.intensity === 0);
    if (stopIndex === -1) {
      return 'Rain continuing for the next hour';
    }
    const stopTime = minutely[stopIndex].time;
    const minsUntilStop = Math.round((stopTime.getTime() - now.getTime()) / 60000);
    return `Rain stopping in ${minsUntilStop} min`;
  } else {
    const startIndex = minutely.findIndex((m) => m.intensity > 0);
    if (startIndex === -1) {
      return 'No rain expected in the next hour';
    }
    const startTime = minutely[startIndex].time;
    const minsUntilStart = Math.round((startTime.getTime() - now.getTime()) / 60000);
    return `Rain starting in ${minsUntilStart} min`;
  }
}
