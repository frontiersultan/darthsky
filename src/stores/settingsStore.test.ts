import { describe, it, expect, beforeEach } from 'vitest';
import { useSettingsStore } from './settingsStore';

describe('settingsStore', () => {
  beforeEach(() => {
    // Reset store to defaults before each test
    useSettingsStore.getState().resetToDefaults();
  });

  describe('default values', () => {
    it('should have correct default unit preferences', () => {
      const state = useSettingsStore.getState();
      expect(state.units.temperature).toBe('fahrenheit');
      expect(state.units.windSpeed).toBe('mph');
      expect(state.units.pressure).toBe('inhg');
      expect(state.units.visibility).toBe('mi');
      expect(state.units.precipitation).toBe('in');
      expect(state.units.timeFormat).toBe('12h');
    });

    it('should have correct default settings', () => {
      const state = useSettingsStore.getState();
      expect(state.theme).toBe('auto');
      expect(state.notificationsEnabled).toBe(false);
      expect(state.alertsEnabled).toBe(true);
      expect(state.reducedMotion).toBe(false);
    });
  });

  describe('setTemperatureUnit', () => {
    it('should update temperature unit', () => {
      useSettingsStore.getState().setTemperatureUnit('celsius');
      expect(useSettingsStore.getState().units.temperature).toBe('celsius');

      useSettingsStore.getState().setTemperatureUnit('fahrenheit');
      expect(useSettingsStore.getState().units.temperature).toBe('fahrenheit');
    });
  });

  describe('setWindSpeedUnit', () => {
    it('should update wind speed unit', () => {
      useSettingsStore.getState().setWindSpeedUnit('kmh');
      expect(useSettingsStore.getState().units.windSpeed).toBe('kmh');

      useSettingsStore.getState().setWindSpeedUnit('ms');
      expect(useSettingsStore.getState().units.windSpeed).toBe('ms');

      useSettingsStore.getState().setWindSpeedUnit('knots');
      expect(useSettingsStore.getState().units.windSpeed).toBe('knots');
    });
  });

  describe('setPressureUnit', () => {
    it('should update pressure unit', () => {
      useSettingsStore.getState().setPressureUnit('hpa');
      expect(useSettingsStore.getState().units.pressure).toBe('hpa');

      useSettingsStore.getState().setPressureUnit('mmhg');
      expect(useSettingsStore.getState().units.pressure).toBe('mmhg');
    });
  });

  describe('setVisibilityUnit', () => {
    it('should update visibility unit', () => {
      useSettingsStore.getState().setVisibilityUnit('km');
      expect(useSettingsStore.getState().units.visibility).toBe('km');

      useSettingsStore.getState().setVisibilityUnit('mi');
      expect(useSettingsStore.getState().units.visibility).toBe('mi');
    });
  });

  describe('setPrecipitationUnit', () => {
    it('should update precipitation unit', () => {
      useSettingsStore.getState().setPrecipitationUnit('mm');
      expect(useSettingsStore.getState().units.precipitation).toBe('mm');

      useSettingsStore.getState().setPrecipitationUnit('in');
      expect(useSettingsStore.getState().units.precipitation).toBe('in');
    });
  });

  describe('setTimeFormat', () => {
    it('should update time format', () => {
      useSettingsStore.getState().setTimeFormat('24h');
      expect(useSettingsStore.getState().units.timeFormat).toBe('24h');

      useSettingsStore.getState().setTimeFormat('12h');
      expect(useSettingsStore.getState().units.timeFormat).toBe('12h');
    });
  });

  describe('setTheme', () => {
    it('should update theme', () => {
      useSettingsStore.getState().setTheme('dark');
      expect(useSettingsStore.getState().theme).toBe('dark');

      useSettingsStore.getState().setTheme('light');
      expect(useSettingsStore.getState().theme).toBe('light');

      useSettingsStore.getState().setTheme('auto');
      expect(useSettingsStore.getState().theme).toBe('auto');
    });
  });

  describe('setNotificationsEnabled', () => {
    it('should update notifications enabled', () => {
      useSettingsStore.getState().setNotificationsEnabled(true);
      expect(useSettingsStore.getState().notificationsEnabled).toBe(true);

      useSettingsStore.getState().setNotificationsEnabled(false);
      expect(useSettingsStore.getState().notificationsEnabled).toBe(false);
    });
  });

  describe('setAlertsEnabled', () => {
    it('should update alerts enabled', () => {
      useSettingsStore.getState().setAlertsEnabled(false);
      expect(useSettingsStore.getState().alertsEnabled).toBe(false);

      useSettingsStore.getState().setAlertsEnabled(true);
      expect(useSettingsStore.getState().alertsEnabled).toBe(true);
    });
  });

  describe('setReducedMotion', () => {
    it('should update reduced motion', () => {
      useSettingsStore.getState().setReducedMotion(true);
      expect(useSettingsStore.getState().reducedMotion).toBe(true);

      useSettingsStore.getState().setReducedMotion(false);
      expect(useSettingsStore.getState().reducedMotion).toBe(false);
    });
  });

  describe('resetToDefaults', () => {
    it('should reset all settings to defaults', () => {
      // Change all settings
      useSettingsStore.getState().setTemperatureUnit('celsius');
      useSettingsStore.getState().setWindSpeedUnit('kmh');
      useSettingsStore.getState().setPressureUnit('hpa');
      useSettingsStore.getState().setVisibilityUnit('km');
      useSettingsStore.getState().setPrecipitationUnit('mm');
      useSettingsStore.getState().setTimeFormat('24h');
      useSettingsStore.getState().setTheme('dark');
      useSettingsStore.getState().setNotificationsEnabled(true);
      useSettingsStore.getState().setAlertsEnabled(false);
      useSettingsStore.getState().setReducedMotion(true);

      // Reset
      useSettingsStore.getState().resetToDefaults();

      // Verify defaults
      const state = useSettingsStore.getState();
      expect(state.units.temperature).toBe('fahrenheit');
      expect(state.units.windSpeed).toBe('mph');
      expect(state.units.pressure).toBe('inhg');
      expect(state.units.visibility).toBe('mi');
      expect(state.units.precipitation).toBe('in');
      expect(state.units.timeFormat).toBe('12h');
      expect(state.theme).toBe('auto');
      expect(state.notificationsEnabled).toBe(false);
      expect(state.alertsEnabled).toBe(true);
      expect(state.reducedMotion).toBe(false);
    });
  });

  describe('unit setting isolation', () => {
    it('should not affect other unit settings when changing one', () => {
      const initialState = useSettingsStore.getState().units;

      useSettingsStore.getState().setTemperatureUnit('celsius');

      const newState = useSettingsStore.getState().units;
      expect(newState.temperature).toBe('celsius');
      expect(newState.windSpeed).toBe(initialState.windSpeed);
      expect(newState.pressure).toBe(initialState.pressure);
      expect(newState.visibility).toBe(initialState.visibility);
      expect(newState.precipitation).toBe(initialState.precipitation);
      expect(newState.timeFormat).toBe(initialState.timeFormat);
    });
  });
});
