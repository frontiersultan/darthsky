import { describe, it, expect } from 'vitest';
import {
  getTemperatureColor,
  getTemperatureGradient,
  getPrecipitationColor,
  getUVIndexColor,
  getUVIndexLevel,
  getAQIColor,
  getAlertSeverityColor,
  getWindSpeedColor,
  getHumidityColor,
} from './colors';

describe('getTemperatureColor', () => {
  it('should return indigo for freezing temperatures', () => {
    expect(getTemperatureColor(-10)).toBe('#818cf8');
    expect(getTemperatureColor(0)).toBe('#818cf8');
  });

  it('should return blue for cold temperatures', () => {
    expect(getTemperatureColor(1)).toBe('#60a5fa');
    expect(getTemperatureColor(10)).toBe('#60a5fa');
  });

  it('should return emerald for cool temperatures', () => {
    expect(getTemperatureColor(11)).toBe('#34d399');
    expect(getTemperatureColor(18)).toBe('#34d399');
  });

  it('should return amber for mild temperatures', () => {
    expect(getTemperatureColor(19)).toBe('#fbbf24');
    expect(getTemperatureColor(25)).toBe('#fbbf24');
  });

  it('should return orange for warm temperatures', () => {
    expect(getTemperatureColor(26)).toBe('#fb923c');
    expect(getTemperatureColor(32)).toBe('#fb923c');
  });

  it('should return red for hot temperatures', () => {
    expect(getTemperatureColor(33)).toBe('#ef4444');
    expect(getTemperatureColor(45)).toBe('#ef4444');
  });
});

describe('getTemperatureGradient', () => {
  it('should return gradient from min to max temperature colors', () => {
    const gradient = getTemperatureGradient(0, 30);
    expect(gradient).toContain('linear-gradient');
    expect(gradient).toContain('#818cf8'); // freezing color
    expect(gradient).toContain('#fb923c'); // warm color
  });

  it('should handle same min and max', () => {
    const gradient = getTemperatureGradient(20, 20);
    expect(gradient).toContain('linear-gradient');
  });
});

describe('getPrecipitationColor', () => {
  it('should return transparent for zero probability', () => {
    expect(getPrecipitationColor(0)).toBe('transparent');
  });

  it('should return light blue for low probability', () => {
    expect(getPrecipitationColor(10)).toBe('rgba(59, 130, 246, 0.3)');
    expect(getPrecipitationColor(29)).toBe('rgba(59, 130, 246, 0.3)');
  });

  it('should return medium blue for moderate probability', () => {
    expect(getPrecipitationColor(30)).toBe('rgba(59, 130, 246, 0.6)');
    expect(getPrecipitationColor(59)).toBe('rgba(59, 130, 246, 0.6)');
  });

  it('should return dark blue for high probability', () => {
    expect(getPrecipitationColor(60)).toBe('rgba(59, 130, 246, 0.9)');
    expect(getPrecipitationColor(100)).toBe('rgba(59, 130, 246, 0.9)');
  });
});

describe('getUVIndexColor', () => {
  it('should return green for low UV', () => {
    expect(getUVIndexColor(0)).toBe('#22c55e');
    expect(getUVIndexColor(2)).toBe('#22c55e');
  });

  it('should return yellow for moderate UV', () => {
    expect(getUVIndexColor(3)).toBe('#eab308');
    expect(getUVIndexColor(5)).toBe('#eab308');
  });

  it('should return orange for high UV', () => {
    expect(getUVIndexColor(6)).toBe('#f97316');
    expect(getUVIndexColor(7)).toBe('#f97316');
  });

  it('should return red for very high UV', () => {
    expect(getUVIndexColor(8)).toBe('#ef4444');
    expect(getUVIndexColor(10)).toBe('#ef4444');
  });

  it('should return purple for extreme UV', () => {
    expect(getUVIndexColor(11)).toBe('#9333ea');
    expect(getUVIndexColor(15)).toBe('#9333ea');
  });
});

describe('getUVIndexLevel', () => {
  it('should return correct level descriptions', () => {
    expect(getUVIndexLevel(0)).toBe('Low');
    expect(getUVIndexLevel(2)).toBe('Low');
    expect(getUVIndexLevel(3)).toBe('Moderate');
    expect(getUVIndexLevel(5)).toBe('Moderate');
    expect(getUVIndexLevel(6)).toBe('High');
    expect(getUVIndexLevel(7)).toBe('High');
    expect(getUVIndexLevel(8)).toBe('Very High');
    expect(getUVIndexLevel(10)).toBe('Very High');
    expect(getUVIndexLevel(11)).toBe('Extreme');
  });
});

describe('getAQIColor', () => {
  it('should return green for good AQI', () => {
    expect(getAQIColor(25)).toBe('#22c55e');
    expect(getAQIColor(50)).toBe('#22c55e');
  });

  it('should return yellow for moderate AQI', () => {
    expect(getAQIColor(51)).toBe('#eab308');
    expect(getAQIColor(100)).toBe('#eab308');
  });

  it('should return orange for unhealthy sensitive AQI', () => {
    expect(getAQIColor(101)).toBe('#f97316');
    expect(getAQIColor(150)).toBe('#f97316');
  });

  it('should return red for unhealthy AQI', () => {
    expect(getAQIColor(151)).toBe('#ef4444');
    expect(getAQIColor(200)).toBe('#ef4444');
  });

  it('should return purple for very unhealthy AQI', () => {
    expect(getAQIColor(201)).toBe('#9333ea');
    expect(getAQIColor(300)).toBe('#9333ea');
  });

  it('should return dark red for hazardous AQI', () => {
    expect(getAQIColor(301)).toBe('#7f1d1d');
    expect(getAQIColor(500)).toBe('#7f1d1d');
  });
});

describe('getAlertSeverityColor', () => {
  it('should return correct colors for severity levels', () => {
    expect(getAlertSeverityColor('minor')).toBe('#3b82f6');
    expect(getAlertSeverityColor('moderate')).toBe('#eab308');
    expect(getAlertSeverityColor('severe')).toBe('#f97316');
    expect(getAlertSeverityColor('extreme')).toBe('#ef4444');
  });

  it('should return gray for unknown severity', () => {
    expect(getAlertSeverityColor('unknown' as 'minor')).toBe('#6b7280');
  });
});

describe('getWindSpeedColor', () => {
  it('should return green for calm winds', () => {
    expect(getWindSpeedColor(0)).toBe('#22c55e');
    expect(getWindSpeedColor(11)).toBe('#22c55e');
  });

  it('should return blue for light winds', () => {
    expect(getWindSpeedColor(12)).toBe('#3b82f6');
    expect(getWindSpeedColor(29)).toBe('#3b82f6');
  });

  it('should return yellow for moderate winds', () => {
    expect(getWindSpeedColor(30)).toBe('#eab308');
    expect(getWindSpeedColor(49)).toBe('#eab308');
  });

  it('should return orange for strong winds', () => {
    expect(getWindSpeedColor(50)).toBe('#f97316');
    expect(getWindSpeedColor(74)).toBe('#f97316');
  });

  it('should return red for severe winds', () => {
    expect(getWindSpeedColor(75)).toBe('#ef4444');
    expect(getWindSpeedColor(100)).toBe('#ef4444');
  });
});

describe('getHumidityColor', () => {
  it('should return orange for dry conditions', () => {
    expect(getHumidityColor(10)).toBe('#f97316');
    expect(getHumidityColor(29)).toBe('#f97316');
  });

  it('should return green for comfortable conditions', () => {
    expect(getHumidityColor(30)).toBe('#22c55e');
    expect(getHumidityColor(59)).toBe('#22c55e');
  });

  it('should return blue for humid conditions', () => {
    expect(getHumidityColor(60)).toBe('#3b82f6');
    expect(getHumidityColor(79)).toBe('#3b82f6');
  });

  it('should return indigo for very humid conditions', () => {
    expect(getHumidityColor(80)).toBe('#6366f1');
    expect(getHumidityColor(100)).toBe('#6366f1');
  });
});
