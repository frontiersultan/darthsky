import { useCallback } from 'react';
import { useSettingsStore } from '../stores';
import {
  convertTemperature,
  convertWindSpeed,
  convertPressure,
  convertVisibility,
  convertPrecipitation,
  getTemperatureLabel,
  getWindSpeedLabel,
  getPressureLabel,
  getVisibilityLabel,
  getPrecipitationLabel,
} from '../utils/units';
import { formatTemperature } from '../utils/formatting';

export function useUnits() {
  const units = useSettingsStore((state) => state.units);

  const formatTemp = useCallback(
    (celsius: number, showUnit = true) => {
      const converted = convertTemperature(celsius, units.temperature);
      return formatTemperature(converted, showUnit);
    },
    [units.temperature]
  );

  const formatWind = useCallback(
    (kmh: number) => {
      const converted = convertWindSpeed(kmh, units.windSpeed);
      return `${Math.round(converted)} ${getWindSpeedLabel(units.windSpeed)}`;
    },
    [units.windSpeed]
  );

  const formatPres = useCallback(
    (hpa: number) => {
      const converted = convertPressure(hpa, units.pressure);
      const decimals = units.pressure === 'hpa' ? 0 : 2;
      return `${converted.toFixed(decimals)} ${getPressureLabel(units.pressure)}`;
    },
    [units.pressure]
  );

  const formatVis = useCallback(
    (km: number) => {
      const converted = convertVisibility(km, units.visibility);
      return `${converted.toFixed(1)} ${getVisibilityLabel(units.visibility)}`;
    },
    [units.visibility]
  );

  const formatPrecip = useCallback(
    (mm: number) => {
      const converted = convertPrecipitation(mm, units.precipitation);
      const decimals = units.precipitation === 'mm' ? 1 : 2;
      return `${converted.toFixed(decimals)} ${getPrecipitationLabel(units.precipitation)}`;
    },
    [units.precipitation]
  );

  return {
    units,
    formatTemp,
    formatWind,
    formatPressure: formatPres,
    formatVisibility: formatVis,
    formatPrecipitation: formatPrecip,
    temperatureLabel: getTemperatureLabel(units.temperature),
    windSpeedLabel: getWindSpeedLabel(units.windSpeed),
    pressureLabel: getPressureLabel(units.pressure),
    visibilityLabel: getVisibilityLabel(units.visibility),
    precipitationLabel: getPrecipitationLabel(units.precipitation),
  };
}
