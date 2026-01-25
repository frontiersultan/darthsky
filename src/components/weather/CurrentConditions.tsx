import { WeatherIcon } from '../common';
import { useUnits } from '../../hooks';
import type { CurrentConditions as CurrentConditionsType, Location } from '../../types';

interface CurrentConditionsProps {
  conditions: CurrentConditionsType;
  location: Location;
}

export function CurrentConditions({ conditions, location }: CurrentConditionsProps) {
  const { formatTemp } = useUnits();

  return (
    <div className="text-center py-8 px-4">
      <h1 className="text-lg font-medium text-slate-600 dark:text-slate-400 mb-1">
        {location.name}
      </h1>

      <div className="flex items-center justify-center gap-4 mb-2">
        <WeatherIcon icon={conditions.icon} size={64} />
        <span className="text-7xl font-light tracking-tight text-slate-900 dark:text-slate-100">
          {formatTemp(conditions.temperature)}
        </span>
      </div>

      <p className="text-xl text-slate-600 dark:text-slate-400 mb-1">
        {conditions.summary}
      </p>

      <p className="text-sm text-slate-500 dark:text-slate-500">
        Feels like {formatTemp(conditions.feelsLike)}
      </p>

      <div className="flex items-center justify-center gap-6 mt-4 text-sm text-slate-500 dark:text-slate-400">
        <div>
          <span className="text-blue-500">L: </span>
          <span className="text-slate-700 dark:text-slate-300">
            {formatTemp(conditions.temperature - 5)}
          </span>
        </div>
        <div>
          <span className="text-red-500">H: </span>
          <span className="text-slate-700 dark:text-slate-300">
            {formatTemp(conditions.temperature + 5)}
          </span>
        </div>
      </div>
    </div>
  );
}
