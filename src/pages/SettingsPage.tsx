import { ChevronRight } from 'lucide-react';
import { Card, Toggle } from '../components/common';
import { useSettingsStore } from '../stores';
import type {
  TemperatureUnit,
  WindSpeedUnit,
  PressureUnit,
  VisibilityUnit,
  PrecipitationUnit,
  TimeFormat,
  ThemeMode,
} from '../types';

interface SettingRowProps {
  label: string;
  value?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

function SettingRow({ label, value, children, onClick }: SettingRowProps) {
  const content = (
    <div className="flex items-center justify-between py-3 px-4 min-h-[56px]">
      <span className="text-slate-900 dark:text-slate-100">{label}</span>
      {children || (
        <div className="flex items-center gap-2 text-slate-500">
          {value && <span>{value}</span>}
          {onClick && <ChevronRight size={18} />}
        </div>
      )}
    </div>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className="w-full text-left hover:bg-slate-50 dark:hover:bg-slate-800 active:bg-slate-100 dark:active:bg-slate-700 transition-colors">
        {content}
      </button>
    );
  }

  return content;
}

interface SelectGroupProps<T extends string> {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}

function SelectGroup<T extends string>({
  label,
  value,
  options,
  onChange,
}: SelectGroupProps<T>) {
  return (
    <div className="py-3 px-4">
      <span className="text-slate-900 dark:text-slate-100 block mb-3">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`
              px-4 py-2.5 rounded-lg text-sm font-medium transition-colors min-h-[44px] active:scale-95
              ${
                value === option.value
                  ? 'bg-sky-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }
            `}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function SettingsPage() {
  const {
    units,
    theme,
    alertsEnabled,
    reducedMotion,
    setTemperatureUnit,
    setWindSpeedUnit,
    setPressureUnit,
    setVisibilityUnit,
    setPrecipitationUnit,
    setTimeFormat,
    setTheme,
    setAlertsEnabled,
    setReducedMotion,
    resetToDefaults,
  } = useSettingsStore();

  return (
    <div className="min-h-screen-safe bg-slate-50 dark:bg-slate-900 pb-tab-bar">
      <div className="pt-safe px-4 py-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
          Settings
        </h1>

        <div className="space-y-6">
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 px-1">
              Units
            </h2>
            <Card className="overflow-hidden divide-y divide-slate-100 dark:divide-slate-700">
              <SelectGroup<TemperatureUnit>
                label="Temperature"
                value={units.temperature}
                options={[
                  { value: 'fahrenheit', label: '°F' },
                  { value: 'celsius', label: '°C' },
                ]}
                onChange={setTemperatureUnit}
              />

              <SelectGroup<WindSpeedUnit>
                label="Wind Speed"
                value={units.windSpeed}
                options={[
                  { value: 'mph', label: 'mph' },
                  { value: 'kmh', label: 'km/h' },
                  { value: 'ms', label: 'm/s' },
                  { value: 'knots', label: 'knots' },
                ]}
                onChange={setWindSpeedUnit}
              />

              <SelectGroup<PressureUnit>
                label="Pressure"
                value={units.pressure}
                options={[
                  { value: 'inhg', label: 'inHg' },
                  { value: 'hpa', label: 'hPa' },
                  { value: 'mmhg', label: 'mmHg' },
                ]}
                onChange={setPressureUnit}
              />

              <SelectGroup<VisibilityUnit>
                label="Visibility"
                value={units.visibility}
                options={[
                  { value: 'mi', label: 'miles' },
                  { value: 'km', label: 'km' },
                ]}
                onChange={setVisibilityUnit}
              />

              <SelectGroup<PrecipitationUnit>
                label="Precipitation"
                value={units.precipitation}
                options={[
                  { value: 'in', label: 'inches' },
                  { value: 'mm', label: 'mm' },
                ]}
                onChange={setPrecipitationUnit}
              />

              <SelectGroup<TimeFormat>
                label="Time Format"
                value={units.timeFormat}
                options={[
                  { value: '12h', label: '12-hour' },
                  { value: '24h', label: '24-hour' },
                ]}
                onChange={setTimeFormat}
              />
            </Card>
          </section>

          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 px-1">
              Appearance
            </h2>
            <Card className="overflow-hidden divide-y divide-slate-100 dark:divide-slate-700">
              <SelectGroup<ThemeMode>
                label="Theme"
                value={theme}
                options={[
                  { value: 'auto', label: 'Auto' },
                  { value: 'light', label: 'Light' },
                  { value: 'dark', label: 'Dark' },
                ]}
                onChange={setTheme}
              />

              <SettingRow label="Reduced Motion">
                <Toggle
                  checked={reducedMotion}
                  onChange={(e) => setReducedMotion(e.target.checked)}
                />
              </SettingRow>
            </Card>
          </section>

          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 px-1">
              Notifications
            </h2>
            <Card className="overflow-hidden divide-y divide-slate-100 dark:divide-slate-700">
              <SettingRow label="Weather Alerts">
                <Toggle
                  checked={alertsEnabled}
                  onChange={(e) => setAlertsEnabled(e.target.checked)}
                />
              </SettingRow>
            </Card>
          </section>

          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 px-1">
              Data
            </h2>
            <Card className="overflow-hidden">
              <SettingRow
                label="Reset to Defaults"
                onClick={resetToDefaults}
              />
            </Card>
          </section>

          <p className="text-xs text-center text-slate-400 dark:text-slate-500 py-4">
            Darth Sky v0.1.0
            <br />
            Weather data from Open-Meteo
            <br />
            Radar data from RainViewer
          </p>
        </div>
      </div>
    </div>
  );
}
