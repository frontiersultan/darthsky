import type {
  TemperatureUnit,
  WindSpeedUnit,
  PressureUnit,
  VisibilityUnit,
  PrecipitationUnit,
} from '../types';

export function convertTemperature(
  celsius: number,
  to: TemperatureUnit
): number {
  if (to === 'celsius') return celsius;
  return (celsius * 9) / 5 + 32;
}

export function convertWindSpeed(kmh: number, to: WindSpeedUnit): number {
  switch (to) {
    case 'kmh':
      return kmh;
    case 'mph':
      return kmh * 0.621371;
    case 'ms':
      return kmh / 3.6;
    case 'knots':
      return kmh * 0.539957;
    default:
      return kmh;
  }
}

export function convertPressure(hpa: number, to: PressureUnit): number {
  switch (to) {
    case 'hpa':
      return hpa;
    case 'inhg':
      return hpa * 0.02953;
    case 'mmhg':
      return hpa * 0.75006;
    default:
      return hpa;
  }
}

export function convertVisibility(km: number, to: VisibilityUnit): number {
  if (to === 'km') return km;
  return km * 0.621371;
}

export function convertPrecipitation(mm: number, to: PrecipitationUnit): number {
  if (to === 'mm') return mm;
  return mm * 0.0393701;
}

export function getTemperatureLabel(unit: TemperatureUnit): string {
  return unit === 'celsius' ? '°C' : '°F';
}

export function getWindSpeedLabel(unit: WindSpeedUnit): string {
  switch (unit) {
    case 'kmh':
      return 'km/h';
    case 'mph':
      return 'mph';
    case 'ms':
      return 'm/s';
    case 'knots':
      return 'kn';
    default:
      return 'km/h';
  }
}

export function getPressureLabel(unit: PressureUnit): string {
  switch (unit) {
    case 'hpa':
      return 'hPa';
    case 'inhg':
      return 'inHg';
    case 'mmhg':
      return 'mmHg';
    default:
      return 'hPa';
  }
}

export function getVisibilityLabel(unit: VisibilityUnit): string {
  return unit === 'km' ? 'km' : 'mi';
}

export function getPrecipitationLabel(unit: PrecipitationUnit): string {
  return unit === 'mm' ? 'mm' : 'in';
}
