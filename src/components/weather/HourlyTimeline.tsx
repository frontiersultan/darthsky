import { useRef } from 'react';
import { WeatherIcon } from '../common';
import { useUnits } from '../../hooks';
import { useSettingsStore } from '../../stores';
import { formatHour } from '../../utils/formatting';
import { getTemperatureColor } from '../../utils/colors';
import type { HourlyForecast } from '../../types';

interface HourlyTimelineProps {
  hourly: HourlyForecast[];
}

export function HourlyTimeline({ hourly }: HourlyTimelineProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { formatTemp } = useUnits();
  const timeFormat = useSettingsStore((s) => s.units.timeFormat);

  const displayHours = hourly.slice(0, 24);

  const temps = displayHours.map((h) => h.temperature);
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);
  const tempRange = maxTemp - minTemp || 1;

  return (
    <div className="card overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Hourly Forecast
        </h2>
      </div>

      <div
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hide py-4 px-2 gap-1"
      >
        {displayHours.map((hour, index) => {
          const isNow = index === 0;
          const barHeight = ((hour.temperature - minTemp) / tempRange) * 40 + 20;
          const tempColor = getTemperatureColor(hour.temperature);

          return (
            <div
              key={hour.time.toISOString()}
              className="flex flex-col items-center min-w-[60px] px-2"
            >
              <span className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                {isNow ? 'Now' : formatHour(hour.time, timeFormat)}
              </span>

              <WeatherIcon icon={hour.icon} size={24} className="mb-2" />

              {hour.precipitationProbability > 0 && (
                <span className="text-xs text-blue-500 mb-1">
                  {Math.round(hour.precipitationProbability)}%
                </span>
              )}

              <div className="flex-1 flex items-end mb-2" style={{ height: '60px' }}>
                <div
                  className="w-8 rounded-full transition-all duration-300"
                  style={{
                    height: `${barHeight}px`,
                    backgroundColor: tempColor,
                    opacity: 0.8,
                  }}
                />
              </div>

              <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {formatTemp(hour.temperature)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
