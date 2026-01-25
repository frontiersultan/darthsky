import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UnitPreferences, ThemeMode } from '../types';

interface SettingsState {
  units: UnitPreferences;
  theme: ThemeMode;
  notificationsEnabled: boolean;
  alertsEnabled: boolean;
  reducedMotion: boolean;

  // Actions
  setTemperatureUnit: (unit: UnitPreferences['temperature']) => void;
  setWindSpeedUnit: (unit: UnitPreferences['windSpeed']) => void;
  setPressureUnit: (unit: UnitPreferences['pressure']) => void;
  setVisibilityUnit: (unit: UnitPreferences['visibility']) => void;
  setPrecipitationUnit: (unit: UnitPreferences['precipitation']) => void;
  setTimeFormat: (format: UnitPreferences['timeFormat']) => void;
  setTheme: (theme: ThemeMode) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setAlertsEnabled: (enabled: boolean) => void;
  setReducedMotion: (enabled: boolean) => void;
  resetToDefaults: () => void;
}

const defaultUnits: UnitPreferences = {
  temperature: 'fahrenheit',
  windSpeed: 'mph',
  pressure: 'inhg',
  visibility: 'mi',
  precipitation: 'in',
  timeFormat: '12h',
};

const defaultSettings = {
  units: defaultUnits,
  theme: 'auto' as ThemeMode,
  notificationsEnabled: false,
  alertsEnabled: true,
  reducedMotion: false,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,

      setTemperatureUnit: (unit) =>
        set((state) => ({
          units: { ...state.units, temperature: unit },
        })),

      setWindSpeedUnit: (unit) =>
        set((state) => ({
          units: { ...state.units, windSpeed: unit },
        })),

      setPressureUnit: (unit) =>
        set((state) => ({
          units: { ...state.units, pressure: unit },
        })),

      setVisibilityUnit: (unit) =>
        set((state) => ({
          units: { ...state.units, visibility: unit },
        })),

      setPrecipitationUnit: (unit) =>
        set((state) => ({
          units: { ...state.units, precipitation: unit },
        })),

      setTimeFormat: (format) =>
        set((state) => ({
          units: { ...state.units, timeFormat: format },
        })),

      setTheme: (theme) => set({ theme }),

      setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),

      setAlertsEnabled: (enabled) => set({ alertsEnabled: enabled }),

      setReducedMotion: (enabled) => set({ reducedMotion: enabled }),

      resetToDefaults: () => set(defaultSettings),
    }),
    {
      name: 'darthsky-settings',
      version: 1,
    }
  )
);
