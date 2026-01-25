import type {
  CurrentConditions,
  HourlyForecast,
  DailyForecast,
  WeatherData,
  Location,
  WeatherCode,
} from '../../types';
import type { OpenMeteoResponse } from '../../types/api';
import { getWeatherSummary, getWeatherIcon } from '../../utils/weather-codes';

export function transformCurrentConditions(
  data: OpenMeteoResponse
): CurrentConditions {
  const current = data.current!;
  const hourly = data.hourly!;
  const code = current.weather_code as WeatherCode;
  const isDay = current.is_day === 1;

  return {
    temperature: current.temperature_2m,
    feelsLike: current.apparent_temperature,
    humidity: current.relative_humidity_2m,
    dewPoint: hourly.dew_point_2m[0],
    pressure: current.pressure_msl,
    windSpeed: current.wind_speed_10m,
    windDirection: current.wind_direction_10m,
    windGust: current.wind_gusts_10m,
    visibility: hourly.visibility[0] / 1000, // Convert to km
    uvIndex: hourly.uv_index[0],
    cloudCover: current.cloud_cover,
    weatherCode: code,
    summary: getWeatherSummary(code),
    icon: getWeatherIcon(code, isDay),
    isDay,
    precipitationProbability: hourly.precipitation_probability[0],
    precipitation: current.precipitation,
  };
}

export function transformHourlyForecast(
  data: OpenMeteoResponse
): HourlyForecast[] {
  const hourly = data.hourly!;

  return hourly.time.map((time, index) => {
    const code = hourly.weather_code[index] as WeatherCode;
    const isDay = hourly.is_day[index] === 1;

    return {
      time: new Date(time),
      temperature: hourly.temperature_2m[index],
      feelsLike: hourly.apparent_temperature[index],
      humidity: hourly.relative_humidity_2m[index],
      precipitationProbability: hourly.precipitation_probability[index],
      precipitation: hourly.precipitation[index],
      weatherCode: code,
      icon: getWeatherIcon(code, isDay),
      windSpeed: hourly.wind_speed_10m[index],
      windDirection: hourly.wind_direction_10m[index],
      isDay,
    };
  });
}

export function transformDailyForecast(
  data: OpenMeteoResponse
): DailyForecast[] {
  const daily = data.daily!;

  return daily.time.map((time, index) => {
    const code = daily.weather_code[index] as WeatherCode;

    return {
      date: new Date(time),
      temperatureMax: daily.temperature_2m_max[index],
      temperatureMin: daily.temperature_2m_min[index],
      sunrise: new Date(daily.sunrise[index]),
      sunset: new Date(daily.sunset[index]),
      precipitationProbability: daily.precipitation_probability_max[index],
      precipitationSum: daily.precipitation_sum[index],
      weatherCode: code,
      icon: getWeatherIcon(code, true),
      summary: getWeatherSummary(code),
      uvIndexMax: daily.uv_index_max[index],
      windSpeedMax: daily.wind_speed_10m_max[index],
      windDirection: daily.wind_direction_10m_dominant[index],
    };
  });
}

export function transformWeatherData(
  data: OpenMeteoResponse,
  location: Location
): WeatherData {
  return {
    location,
    current: transformCurrentConditions(data),
    hourly: transformHourlyForecast(data),
    daily: transformDailyForecast(data),
    minutely: undefined, // Open-Meteo doesn't provide minutely data
    alerts: [], // Would need NWS API for alerts
    lastUpdated: new Date(),
  };
}
