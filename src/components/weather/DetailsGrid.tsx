import {
  Droplets,
  Wind,
  Gauge,
  Sun,
  Eye,
  Thermometer,
  Sunrise,
  Sunset,
  Navigation,
} from 'lucide-react';
import { Card } from '../common';
import { useUnits } from '../../hooks';
import { useSettingsStore } from '../../stores';
import { formatTime, formatPercentage, formatWindDirection } from '../../utils/formatting';
import { getUVIndexColor, getUVIndexLevel } from '../../utils/colors';
import type { CurrentConditions, DailyForecast } from '../../types';

interface DetailsGridProps {
  current: CurrentConditions;
  today?: DailyForecast;
}

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subValue?: React.ReactNode;
  color?: string;
}

function DetailItem({ icon, label, value, subValue, color }: DetailItemProps) {
  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <div className="text-slate-400 dark:text-slate-500">{icon}</div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
            {label}
          </p>
          <p
            className="text-lg font-medium text-slate-900 dark:text-slate-100 truncate"
            style={color ? { color } : undefined}
          >
            {value}
          </p>
          {subValue && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {subValue}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}

export function DetailsGrid({ current, today }: DetailsGridProps) {
  const { formatTemp, formatWind, formatPressure, formatVisibility } = useUnits();
  const timeFormat = useSettingsStore((s) => s.units.timeFormat);

  const uvColor = getUVIndexColor(current.uvIndex);
  const uvLevel = getUVIndexLevel(current.uvIndex);

  return (
    <div className="grid grid-cols-2 gap-3">
      <DetailItem
        icon={<Droplets size={20} />}
        label="Humidity"
        value={formatPercentage(current.humidity)}
        subValue={`Dew point: ${formatTemp(current.dewPoint)}`}
      />

      <DetailItem
        icon={<Wind size={20} />}
        label="Wind"
        value={formatWind(current.windSpeed)}
        subValue={
          <>
            <Navigation
              size={12}
              className="inline mr-1"
              style={{
                transform: `rotate(${current.windDirection + 180}deg)`,
              }}
            />
            {formatWindDirection(current.windDirection)}
            {current.windGust && `, gusts ${formatWind(current.windGust)}`}
          </>
        }
      />

      <DetailItem
        icon={<Gauge size={20} />}
        label="Pressure"
        value={formatPressure(current.pressure)}
      />

      <DetailItem
        icon={<Sun size={20} />}
        label="UV Index"
        value={`${Math.round(current.uvIndex)} ${uvLevel}`}
        color={uvColor}
      />

      <DetailItem
        icon={<Eye size={20} />}
        label="Visibility"
        value={formatVisibility(current.visibility)}
      />

      <DetailItem
        icon={<Thermometer size={20} />}
        label="Feels Like"
        value={formatTemp(current.feelsLike)}
      />

      {today && (
        <>
          <DetailItem
            icon={<Sunrise size={20} />}
            label="Sunrise"
            value={formatTime(today.sunrise, timeFormat)}
          />

          <DetailItem
            icon={<Sunset size={20} />}
            label="Sunset"
            value={formatTime(today.sunset, timeFormat)}
          />
        </>
      )}
    </div>
  );
}
