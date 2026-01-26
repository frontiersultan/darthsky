import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Header } from '../components/layout';
import {
  CurrentConditions,
  HourlyTimeline,
  DailyForecast,
  DetailsGrid,
  PrecipitationGraph,
  AlertsBanner,
} from '../components/weather';
import { SkeletonWeatherCard } from '../components/common';
import { useWeather } from '../hooks';
import { useLocationStore, useUIStore } from '../stores';
import { generatePrecipitationSummary } from '../utils/weather-codes';
import { QUERY_KEYS } from '../constants';

export function WeatherPage() {
  const queryClient = useQueryClient();
  const activeLocation = useLocationStore((s) => s.getActiveLocation());
  const isRefreshing = useUIStore((s) => s.isRefreshing);
  const setRefreshing = useUIStore((s) => s.setRefreshing);

  const { data: weather, isLoading, error, refetch } = useWeather();

  const handleRefresh = useCallback(async () => {
    if (!activeLocation) return;

    setRefreshing(true);
    try {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.weather(
          activeLocation.coordinates.latitude,
          activeLocation.coordinates.longitude
        ),
      });
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [activeLocation, queryClient, refetch, setRefreshing]);

  if (!activeLocation) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-4">
              No location selected
            </p>
            <p className="text-sm text-slate-500">
              Tap the location button above to add a location
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading && !weather) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 p-4 space-y-4 pb-24">
          <SkeletonWeatherCard />
          <SkeletonWeatherCard />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header onRefresh={handleRefresh} isRefreshing={isRefreshing} />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <p className="text-lg text-red-500 mb-2">Failed to load weather</p>
            <p className="text-sm text-slate-500 mb-4">
              {error instanceof Error ? error.message : 'Unknown error'}
            </p>
            <button
              onClick={handleRefresh}
              className="btn btn-primary btn-md"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!weather) return null;

  const precipSummary = generatePrecipitationSummary(weather.minutely);
  const today = weather.daily[0];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
      <Header onRefresh={handleRefresh} isRefreshing={isRefreshing} />

      <main className="flex-1 overflow-y-auto pb-24">
        <AlertsBanner alerts={weather.alerts} />

        <CurrentConditions
          conditions={weather.current}
          location={weather.location}
          today={today}
        />

        <div className="px-4 space-y-4">
          <PrecipitationGraph
            hourly={weather.hourly}
            minutely={weather.minutely}
            summary={precipSummary}
          />

          <HourlyTimeline hourly={weather.hourly} />

          <DailyForecast daily={weather.daily} />

          <DetailsGrid current={weather.current} today={today} />

          <p className="text-xs text-center text-slate-400 dark:text-slate-500 py-4">
            Last updated: {weather.lastUpdated.toLocaleTimeString()}
          </p>
        </div>
      </main>
    </div>
  );
}
