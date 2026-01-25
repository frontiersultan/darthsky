import { WeatherIcon } from '../common';
import { useUnits } from '../../hooks';
import { formatDay, isToday, isTomorrow } from '../../utils/formatting';
import { getTemperatureGradient } from '../../utils/colors';
import type { DailyForecast as DailyForecastType } from '../../types';

interface DailyForecastProps {
  daily: DailyForecastType[];
}

export function DailyForecast({ daily }: DailyForecastProps) {
  const { formatTemp } = useUnits();

  const allMinTemps = daily.map((d) => d.temperatureMin);
  const allMaxTemps = daily.map((d) => d.temperatureMax);
  const weekMin = Math.min(...allMinTemps);
  const weekMax = Math.max(...allMaxTemps);
  const tempRange = weekMax - weekMin || 1;

  return (
    <div className="card overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          7-Day Forecast
        </h2>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-700">
        {daily.map((day) => {
          const dayLabel = isToday(day.date)
            ? 'Today'
            : isTomorrow(day.date)
              ? 'Tomorrow'
              : formatDay(day.date);

          const leftPercent = ((day.temperatureMin - weekMin) / tempRange) * 100;
          const widthPercent =
            ((day.temperatureMax - day.temperatureMin) / tempRange) * 100;

          return (
            <div
              key={day.date.toISOString()}
              className="flex items-center px-4 py-3 gap-3"
            >
              <span className="w-20 text-sm font-medium text-slate-900 dark:text-slate-100">
                {dayLabel}
              </span>

              <WeatherIcon icon={day.icon} size={24} className="shrink-0" />

              {day.precipitationProbability > 0 ? (
                <span className="w-10 text-xs text-blue-500 text-right">
                  {Math.round(day.precipitationProbability)}%
                </span>
              ) : (
                <span className="w-10" />
              )}

              <span className="w-10 text-sm text-slate-500 dark:text-slate-400 text-right">
                {formatTemp(day.temperatureMin, false)}
              </span>

              <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full relative mx-2">
                <div
                  className="absolute h-full rounded-full"
                  style={{
                    left: `${leftPercent}%`,
                    width: `${Math.max(widthPercent, 5)}%`,
                    background: getTemperatureGradient(
                      day.temperatureMin,
                      day.temperatureMax
                    ),
                  }}
                />
              </div>

              <span className="w-10 text-sm font-medium text-slate-900 dark:text-slate-100 text-right">
                {formatTemp(day.temperatureMax, false)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
