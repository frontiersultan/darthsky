export const CACHE_TIMES = {
  // Weather data cache times (in milliseconds)
  CURRENT_CONDITIONS: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  },
  HOURLY_FORECAST: {
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 60 minutes
  },
  DAILY_FORECAST: {
    staleTime: 60 * 60 * 1000, // 60 minutes
    gcTime: 120 * 60 * 1000, // 120 minutes
  },
  RADAR_TILES: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  },
  GEOCODING: {
    staleTime: 7 * 24 * 60 * 60 * 1000, // 7 days
    gcTime: 14 * 24 * 60 * 60 * 1000, // 14 days
  },
} as const;

export const QUERY_KEYS = {
  weather: (lat: number, lon: number) => ['weather', lat, lon] as const,
  geocode: (query: string) => ['geocode', query] as const,
  reverseGeocode: (lat: number, lon: number) => ['reverseGeocode', lat, lon] as const,
  radarTimestamps: () => ['radar', 'timestamps'] as const,
} as const;
