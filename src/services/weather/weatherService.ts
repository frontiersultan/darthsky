import type { WeatherData, Location } from '../../types';
import { fetchOpenMeteoData } from './openMeteoProvider';
import { transformWeatherData } from './transformers';

export async function getWeatherData(location: Location): Promise<WeatherData> {
  const { latitude, longitude } = location.coordinates;

  const data = await fetchOpenMeteoData(latitude, longitude);

  return transformWeatherData(data, location);
}

export { fetchOpenMeteoData } from './openMeteoProvider';
export { transformWeatherData } from './transformers';
