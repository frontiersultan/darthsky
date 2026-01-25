import { describe, it, expect } from 'vitest';
import {
  convertTemperature,
  convertWindSpeed,
  convertPressure,
  convertVisibility,
  convertPrecipitation,
} from './units';

describe('Temperature conversion', () => {
  it('should return celsius when unit is celsius', () => {
    expect(convertTemperature(20, 'celsius')).toBe(20);
    expect(convertTemperature(0, 'celsius')).toBe(0);
    expect(convertTemperature(-10, 'celsius')).toBe(-10);
  });

  it('should convert celsius to fahrenheit', () => {
    expect(convertTemperature(0, 'fahrenheit')).toBe(32);
    expect(convertTemperature(100, 'fahrenheit')).toBe(212);
    expect(convertTemperature(-40, 'fahrenheit')).toBe(-40);
  });
});

describe('Wind speed conversion', () => {
  it('should return km/h when unit is kmh', () => {
    expect(convertWindSpeed(100, 'kmh')).toBe(100);
  });

  it('should convert km/h to mph', () => {
    expect(convertWindSpeed(100, 'mph')).toBeCloseTo(62.14, 1);
  });

  it('should convert km/h to m/s', () => {
    expect(convertWindSpeed(36, 'ms')).toBe(10);
  });

  it('should convert km/h to knots', () => {
    expect(convertWindSpeed(100, 'knots')).toBeCloseTo(54, 0);
  });
});

describe('Pressure conversion', () => {
  it('should return hPa when unit is hpa', () => {
    expect(convertPressure(1013.25, 'hpa')).toBe(1013.25);
  });

  it('should convert hPa to inHg', () => {
    expect(convertPressure(1013.25, 'inhg')).toBeCloseTo(29.92, 1);
  });

  it('should convert hPa to mmHg', () => {
    expect(convertPressure(1013.25, 'mmhg')).toBeCloseTo(760, 0);
  });
});

describe('Visibility conversion', () => {
  it('should return km when unit is km', () => {
    expect(convertVisibility(10, 'km')).toBe(10);
  });

  it('should convert km to miles', () => {
    expect(convertVisibility(10, 'mi')).toBeCloseTo(6.21, 1);
  });
});

describe('Precipitation conversion', () => {
  it('should return mm when unit is mm', () => {
    expect(convertPrecipitation(25, 'mm')).toBe(25);
  });

  it('should convert mm to inches', () => {
    expect(convertPrecipitation(25.4, 'in')).toBeCloseTo(1, 1);
  });
});
