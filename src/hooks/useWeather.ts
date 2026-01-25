import { useQuery } from '@tanstack/react-query';
import { getWeatherData } from '../services/weather';
import { useLocationStore } from '../stores';
import { CACHE_TIMES, QUERY_KEYS } from '../constants';
import type { WeatherData, Location } from '../types';

export function useWeather(location?: Location | null) {
  const activeLocation = useLocationStore((state) => state.getActiveLocation());
  const targetLocation = location ?? activeLocation;

  return useQuery<WeatherData>({
    queryKey: targetLocation
      ? QUERY_KEYS.weather(
          targetLocation.coordinates.latitude,
          targetLocation.coordinates.longitude
        )
      : ['weather', 'none'],
    queryFn: () => getWeatherData(targetLocation!),
    enabled: !!targetLocation,
    staleTime: CACHE_TIMES.CURRENT_CONDITIONS.staleTime,
    gcTime: CACHE_TIMES.CURRENT_CONDITIONS.gcTime,
    refetchOnWindowFocus: true,
    retry: 3,
  });
}
