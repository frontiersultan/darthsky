import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  formatTemperature,
  formatTime,
  formatHour,
  formatDay,
  formatDayFull,
  formatDate,
  formatWindDirection,
  formatPressure,
  formatPercentage,
  formatVisibility,
  formatPrecipitation,
  formatRelativeTime,
  isToday,
  isTomorrow,
} from './formatting';

describe('formatTemperature', () => {
  it('should round and add degree symbol by default', () => {
    expect(formatTemperature(20.4)).toBe('20°');
    expect(formatTemperature(20.5)).toBe('21°');
    expect(formatTemperature(-5.3)).toBe('-5°');
  });

  it('should omit unit when showUnit is false', () => {
    expect(formatTemperature(20.4, false)).toBe('20');
    expect(formatTemperature(-5.7, false)).toBe('-6');
  });

  it('should handle zero', () => {
    expect(formatTemperature(0)).toBe('0°');
    expect(formatTemperature(0.4)).toBe('0°');
  });
});

describe('formatTime', () => {
  it('should format in 24h format', () => {
    expect(formatTime(new Date('2024-01-15T14:30:00'), '24h')).toBe('14:30');
    expect(formatTime(new Date('2024-01-15T09:05:00'), '24h')).toBe('09:05');
    expect(formatTime(new Date('2024-01-15T00:00:00'), '24h')).toBe('00:00');
  });

  it('should format in 12h format', () => {
    expect(formatTime(new Date('2024-01-15T14:30:00'), '12h')).toBe('2:30 PM');
    expect(formatTime(new Date('2024-01-15T09:05:00'), '12h')).toBe('9:05 AM');
    expect(formatTime(new Date('2024-01-15T00:00:00'), '12h')).toBe('12:00 AM');
    expect(formatTime(new Date('2024-01-15T12:00:00'), '12h')).toBe('12:00 PM');
  });
});

describe('formatHour', () => {
  it('should format in 24h format', () => {
    expect(formatHour(new Date('2024-01-15T14:30:00'), '24h')).toBe('14:00');
    expect(formatHour(new Date('2024-01-15T09:05:00'), '24h')).toBe('09:00');
    expect(formatHour(new Date('2024-01-15T00:00:00'), '24h')).toBe('00:00');
  });

  it('should format in 12h format', () => {
    expect(formatHour(new Date('2024-01-15T14:30:00'), '12h')).toBe('2PM');
    expect(formatHour(new Date('2024-01-15T09:05:00'), '12h')).toBe('9AM');
    expect(formatHour(new Date('2024-01-15T00:00:00'), '12h')).toBe('12AM');
    expect(formatHour(new Date('2024-01-15T12:00:00'), '12h')).toBe('12PM');
  });
});

describe('formatDay', () => {
  it('should return abbreviated day names', () => {
    // Use noon times to avoid timezone issues
    expect(formatDay(new Date('2024-01-14T12:00:00'))).toBe('Sun'); // Sunday
    expect(formatDay(new Date('2024-01-15T12:00:00'))).toBe('Mon'); // Monday
    expect(formatDay(new Date('2024-01-16T12:00:00'))).toBe('Tue'); // Tuesday
    expect(formatDay(new Date('2024-01-17T12:00:00'))).toBe('Wed'); // Wednesday
    expect(formatDay(new Date('2024-01-18T12:00:00'))).toBe('Thu'); // Thursday
    expect(formatDay(new Date('2024-01-19T12:00:00'))).toBe('Fri'); // Friday
    expect(formatDay(new Date('2024-01-20T12:00:00'))).toBe('Sat'); // Saturday
  });
});

describe('formatDayFull', () => {
  it('should return full day names', () => {
    // Use noon times to avoid timezone issues
    expect(formatDayFull(new Date('2024-01-14T12:00:00'))).toBe('Sunday');
    expect(formatDayFull(new Date('2024-01-15T12:00:00'))).toBe('Monday');
    expect(formatDayFull(new Date('2024-01-16T12:00:00'))).toBe('Tuesday');
    expect(formatDayFull(new Date('2024-01-17T12:00:00'))).toBe('Wednesday');
    expect(formatDayFull(new Date('2024-01-18T12:00:00'))).toBe('Thursday');
    expect(formatDayFull(new Date('2024-01-19T12:00:00'))).toBe('Friday');
    expect(formatDayFull(new Date('2024-01-20T12:00:00'))).toBe('Saturday');
  });
});

describe('formatDate', () => {
  it('should format date with abbreviated month', () => {
    // Use noon times to avoid timezone issues
    expect(formatDate(new Date('2024-01-15T12:00:00'))).toBe('Jan 15');
    expect(formatDate(new Date('2024-06-01T12:00:00'))).toBe('Jun 1');
    expect(formatDate(new Date('2024-12-25T12:00:00'))).toBe('Dec 25');
  });
});

describe('formatWindDirection', () => {
  it('should convert degrees to cardinal directions', () => {
    expect(formatWindDirection(0)).toBe('N');
    expect(formatWindDirection(45)).toBe('NE');
    expect(formatWindDirection(90)).toBe('E');
    expect(formatWindDirection(135)).toBe('SE');
    expect(formatWindDirection(180)).toBe('S');
    expect(formatWindDirection(225)).toBe('SW');
    expect(formatWindDirection(270)).toBe('W');
    expect(formatWindDirection(315)).toBe('NW');
    expect(formatWindDirection(360)).toBe('N');
  });

  it('should handle intermediate values', () => {
    expect(formatWindDirection(22)).toBe('N');
    expect(formatWindDirection(23)).toBe('NE');
    expect(formatWindDirection(67)).toBe('NE');
    expect(formatWindDirection(68)).toBe('E');
  });
});

describe('formatPressure', () => {
  it('should format with default 2 decimals', () => {
    expect(formatPressure(1013.25)).toBe('1013.25');
    expect(formatPressure(29.92)).toBe('29.92');
  });

  it('should format with custom decimals', () => {
    expect(formatPressure(1013.25, 0)).toBe('1013');
    expect(formatPressure(1013.25, 1)).toBe('1013.3');
  });
});

describe('formatPercentage', () => {
  it('should format as percentage', () => {
    expect(formatPercentage(50)).toBe('50%');
    expect(formatPercentage(0)).toBe('0%');
    expect(formatPercentage(100)).toBe('100%');
    expect(formatPercentage(33.7)).toBe('34%');
  });
});

describe('formatVisibility', () => {
  it('should format with default 1 decimal', () => {
    expect(formatVisibility(10)).toBe('10.0');
    expect(formatVisibility(6.21371)).toBe('6.2');
  });

  it('should format with custom decimals', () => {
    expect(formatVisibility(10, 0)).toBe('10');
    expect(formatVisibility(6.21371, 2)).toBe('6.21');
  });
});

describe('formatPrecipitation', () => {
  it('should return 0 for zero value', () => {
    expect(formatPrecipitation(0)).toBe('0');
  });

  it('should format with default 2 decimals', () => {
    expect(formatPrecipitation(25.4)).toBe('25.40');
    expect(formatPrecipitation(1)).toBe('1.00');
  });

  it('should format with custom decimals', () => {
    expect(formatPrecipitation(25.4, 1)).toBe('25.4');
    expect(formatPrecipitation(1, 0)).toBe('1');
  });
});

describe('formatRelativeTime', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-15T12:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return "now" for times within 30 seconds', () => {
    const now = new Date();
    expect(formatRelativeTime(now)).toBe('now');
    // Note: function uses Math.round, so 30s rounds to 1 min, 29s rounds to 0
    expect(formatRelativeTime(new Date(now.getTime() + 29000))).toBe('now'); // 29 seconds later
    expect(formatRelativeTime(new Date(now.getTime() - 29000))).toBe('now'); // 29 seconds ago
  });

  it('should format future minutes', () => {
    const now = new Date();
    expect(formatRelativeTime(new Date(now.getTime() + 5 * 60000))).toBe('in 5 min');
    expect(formatRelativeTime(new Date(now.getTime() + 30 * 60000))).toBe('in 30 min');
  });

  it('should format future hours', () => {
    const now = new Date();
    expect(formatRelativeTime(new Date(now.getTime() + 2 * 60 * 60000))).toBe('in 2h');
    expect(formatRelativeTime(new Date(now.getTime() + 6 * 60 * 60000))).toBe('in 6h');
  });

  it('should format future days', () => {
    const now = new Date();
    expect(formatRelativeTime(new Date(now.getTime() + 2 * 24 * 60 * 60000))).toBe('in 2d');
  });

  it('should format past minutes', () => {
    const now = new Date();
    expect(formatRelativeTime(new Date(now.getTime() - 5 * 60000))).toBe('5 min ago');
    expect(formatRelativeTime(new Date(now.getTime() - 30 * 60000))).toBe('30 min ago');
  });

  it('should format past hours', () => {
    const now = new Date();
    expect(formatRelativeTime(new Date(now.getTime() - 2 * 60 * 60000))).toBe('2h ago');
  });

  it('should format past days', () => {
    const now = new Date();
    expect(formatRelativeTime(new Date(now.getTime() - 2 * 24 * 60 * 60000))).toBe('2d ago');
  });
});

describe('isToday', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-15T12:00:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return true for today', () => {
    expect(isToday(new Date('2024-01-15T00:00:00'))).toBe(true);
    expect(isToday(new Date('2024-01-15T23:59:59'))).toBe(true);
  });

  it('should return false for other days', () => {
    expect(isToday(new Date('2024-01-14T12:00:00'))).toBe(false);
    expect(isToday(new Date('2024-01-16T12:00:00'))).toBe(false);
  });
});

describe('isTomorrow', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-15T12:00:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return true for tomorrow', () => {
    expect(isTomorrow(new Date('2024-01-16T00:00:00'))).toBe(true);
    expect(isTomorrow(new Date('2024-01-16T23:59:59'))).toBe(true);
  });

  it('should return false for other days', () => {
    expect(isTomorrow(new Date('2024-01-15T12:00:00'))).toBe(false);
    expect(isTomorrow(new Date('2024-01-17T12:00:00'))).toBe(false);
  });
});
