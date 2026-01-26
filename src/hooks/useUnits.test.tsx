import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useUnits } from './useUnits';
import { useSettingsStore } from '../stores';

describe('useUnits', () => {
  beforeEach(() => {
    useSettingsStore.getState().resetToDefaults();
  });

  describe('formatTemp', () => {
    it('should format temperature in Fahrenheit by default', () => {
      const { result } = renderHook(() => useUnits());
      expect(result.current.formatTemp(0)).toBe('32°'); // 0°C = 32°F
      expect(result.current.formatTemp(100)).toBe('212°'); // 100°C = 212°F
    });

    it('should format temperature in Celsius when set', () => {
      useSettingsStore.getState().setTemperatureUnit('celsius');
      const { result } = renderHook(() => useUnits());
      expect(result.current.formatTemp(20)).toBe('20°');
      expect(result.current.formatTemp(-5)).toBe('-5°');
    });

    it('should round temperature values', () => {
      useSettingsStore.getState().setTemperatureUnit('celsius');
      const { result } = renderHook(() => useUnits());
      expect(result.current.formatTemp(20.4)).toBe('20°');
      expect(result.current.formatTemp(20.6)).toBe('21°');
    });

    it('should omit unit when showUnit is false', () => {
      useSettingsStore.getState().setTemperatureUnit('celsius');
      const { result } = renderHook(() => useUnits());
      expect(result.current.formatTemp(20, false)).toBe('20');
    });
  });

  describe('formatWind', () => {
    it('should format wind speed in mph by default', () => {
      const { result } = renderHook(() => useUnits());
      expect(result.current.formatWind(100)).toBe('62 mph'); // 100 km/h ≈ 62 mph
    });

    it('should format wind speed in km/h when set', () => {
      useSettingsStore.getState().setWindSpeedUnit('kmh');
      const { result } = renderHook(() => useUnits());
      expect(result.current.formatWind(100)).toBe('100 km/h');
    });

    it('should format wind speed in m/s when set', () => {
      useSettingsStore.getState().setWindSpeedUnit('ms');
      const { result } = renderHook(() => useUnits());
      expect(result.current.formatWind(36)).toBe('10 m/s'); // 36 km/h = 10 m/s
    });

    it('should format wind speed in knots when set', () => {
      useSettingsStore.getState().setWindSpeedUnit('knots');
      const { result } = renderHook(() => useUnits());
      expect(result.current.formatWind(100)).toBe('54 kn'); // 100 km/h ≈ 54 knots
    });

    it('should round wind speed values', () => {
      useSettingsStore.getState().setWindSpeedUnit('kmh');
      const { result } = renderHook(() => useUnits());
      expect(result.current.formatWind(15.7)).toBe('16 km/h');
    });
  });

  describe('formatPressure', () => {
    it('should format pressure in inHg by default', () => {
      const { result } = renderHook(() => useUnits());
      expect(result.current.formatPressure(1013.25)).toBe('29.92 inHg');
    });

    it('should format pressure in hPa when set', () => {
      useSettingsStore.getState().setPressureUnit('hpa');
      const { result } = renderHook(() => useUnits());
      expect(result.current.formatPressure(1013)).toBe('1013 hPa');
    });

    it('should format pressure in mmHg when set', () => {
      useSettingsStore.getState().setPressureUnit('mmhg');
      const { result } = renderHook(() => useUnits());
      // 1013.25 * 0.75006 = 759.99... rounds to 760.00
      expect(result.current.formatPressure(1013.25)).toBe('760.00 mmHg');
    });

    it('should use 0 decimals for hPa', () => {
      useSettingsStore.getState().setPressureUnit('hpa');
      const { result } = renderHook(() => useUnits());
      expect(result.current.formatPressure(1013.7)).toBe('1014 hPa');
    });

    it('should use 2 decimals for inHg', () => {
      const { result } = renderHook(() => useUnits());
      const formatted = result.current.formatPressure(1000);
      expect(formatted).toMatch(/^\d+\.\d{2} inHg$/);
    });
  });

  describe('formatVisibility', () => {
    it('should format visibility in miles by default', () => {
      const { result } = renderHook(() => useUnits());
      expect(result.current.formatVisibility(10)).toBe('6.2 mi'); // 10 km ≈ 6.2 mi
    });

    it('should format visibility in km when set', () => {
      useSettingsStore.getState().setVisibilityUnit('km');
      const { result } = renderHook(() => useUnits());
      expect(result.current.formatVisibility(10)).toBe('10.0 km');
    });

    it('should use 1 decimal place', () => {
      useSettingsStore.getState().setVisibilityUnit('km');
      const { result } = renderHook(() => useUnits());
      expect(result.current.formatVisibility(10.567)).toBe('10.6 km');
    });
  });

  describe('formatPrecipitation', () => {
    it('should format precipitation in inches by default', () => {
      const { result } = renderHook(() => useUnits());
      expect(result.current.formatPrecipitation(25.4)).toBe('1.00 in'); // 25.4 mm = 1 in
    });

    it('should format precipitation in mm when set', () => {
      useSettingsStore.getState().setPrecipitationUnit('mm');
      const { result } = renderHook(() => useUnits());
      expect(result.current.formatPrecipitation(25)).toBe('25.0 mm');
    });

    it('should use 2 decimals for inches', () => {
      const { result } = renderHook(() => useUnits());
      const formatted = result.current.formatPrecipitation(10);
      expect(formatted).toMatch(/^\d+\.\d{2} in$/);
    });

    it('should use 1 decimal for mm', () => {
      useSettingsStore.getState().setPrecipitationUnit('mm');
      const { result } = renderHook(() => useUnits());
      const formatted = result.current.formatPrecipitation(10);
      expect(formatted).toMatch(/^\d+\.\d mm$/);
    });
  });

  describe('unit labels', () => {
    it('should return correct temperature label', () => {
      const { result: fahrenheit } = renderHook(() => useUnits());
      expect(fahrenheit.current.temperatureLabel).toBe('°F');

      useSettingsStore.getState().setTemperatureUnit('celsius');
      const { result: celsius } = renderHook(() => useUnits());
      expect(celsius.current.temperatureLabel).toBe('°C');
    });

    it('should return correct wind speed label', () => {
      const testCases = [
        { unit: 'mph' as const, label: 'mph' },
        { unit: 'kmh' as const, label: 'km/h' },
        { unit: 'ms' as const, label: 'm/s' },
        { unit: 'knots' as const, label: 'kn' },
      ];

      testCases.forEach(({ unit, label }) => {
        useSettingsStore.getState().setWindSpeedUnit(unit);
        const { result } = renderHook(() => useUnits());
        expect(result.current.windSpeedLabel).toBe(label);
      });
    });

    it('should return correct pressure label', () => {
      const testCases = [
        { unit: 'inhg' as const, label: 'inHg' },
        { unit: 'hpa' as const, label: 'hPa' },
        { unit: 'mmhg' as const, label: 'mmHg' },
      ];

      testCases.forEach(({ unit, label }) => {
        useSettingsStore.getState().setPressureUnit(unit);
        const { result } = renderHook(() => useUnits());
        expect(result.current.pressureLabel).toBe(label);
      });
    });

    it('should return correct visibility label', () => {
      const { result: miles } = renderHook(() => useUnits());
      expect(miles.current.visibilityLabel).toBe('mi');

      useSettingsStore.getState().setVisibilityUnit('km');
      const { result: km } = renderHook(() => useUnits());
      expect(km.current.visibilityLabel).toBe('km');
    });

    it('should return correct precipitation label', () => {
      const { result: inches } = renderHook(() => useUnits());
      expect(inches.current.precipitationLabel).toBe('in');

      useSettingsStore.getState().setPrecipitationUnit('mm');
      const { result: mm } = renderHook(() => useUnits());
      expect(mm.current.precipitationLabel).toBe('mm');
    });
  });

  describe('units object', () => {
    it('should return current units from settings', () => {
      const { result } = renderHook(() => useUnits());

      expect(result.current.units.temperature).toBe('fahrenheit');
      expect(result.current.units.windSpeed).toBe('mph');
      expect(result.current.units.pressure).toBe('inhg');
      expect(result.current.units.visibility).toBe('mi');
      expect(result.current.units.precipitation).toBe('in');
      expect(result.current.units.timeFormat).toBe('12h');
    });

    it('should reflect settings changes', () => {
      useSettingsStore.getState().setTemperatureUnit('celsius');
      useSettingsStore.getState().setWindSpeedUnit('kmh');

      const { result } = renderHook(() => useUnits());

      expect(result.current.units.temperature).toBe('celsius');
      expect(result.current.units.windSpeed).toBe('kmh');
    });
  });

  describe('memoization', () => {
    it('should return same function reference when units do not change', () => {
      const { result, rerender } = renderHook(() => useUnits());
      const formatTemp1 = result.current.formatTemp;

      rerender();
      const formatTemp2 = result.current.formatTemp;

      expect(formatTemp1).toBe(formatTemp2);
    });
  });
});
