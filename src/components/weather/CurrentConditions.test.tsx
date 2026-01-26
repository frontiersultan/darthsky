import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '../../test/test-utils';
import { CurrentConditions } from './CurrentConditions';
import { useSettingsStore } from '../../stores';
import type { CurrentConditions as CurrentConditionsType, DailyForecast, Location } from '../../types';

const createMockConditions = (overrides: Partial<CurrentConditionsType> = {}): CurrentConditionsType => ({
  temperature: 20,
  feelsLike: 18,
  humidity: 65,
  dewPoint: 13,
  pressure: 1015,
  windSpeed: 15,
  windDirection: 180,
  windGust: 25,
  visibility: 10,
  uvIndex: 5,
  cloudCover: 40,
  weatherCode: 2,
  summary: 'Partly cloudy',
  icon: 'partly-cloudy-day',
  isDay: true,
  precipitationProbability: 20,
  precipitation: 0,
  ...overrides,
});

const createMockLocation = (overrides: Partial<Location> = {}): Location => ({
  id: '1',
  name: 'New York',
  displayName: 'New York, NY, US',
  coordinates: { latitude: 40.7128, longitude: -74.006 },
  ...overrides,
});

const createMockTodayForecast = (overrides: Partial<DailyForecast> = {}): DailyForecast => ({
  date: new Date('2024-01-15'),
  temperatureMax: 25,
  temperatureMin: 15,
  sunrise: new Date('2024-01-15T07:00:00'),
  sunset: new Date('2024-01-15T17:00:00'),
  precipitationProbability: 20,
  precipitationSum: 0,
  weatherCode: 2,
  icon: 'partly-cloudy-day',
  summary: 'Partly cloudy',
  uvIndexMax: 5,
  windSpeedMax: 20,
  windDirection: 180,
  ...overrides,
});

describe('CurrentConditions', () => {
  beforeEach(() => {
    useSettingsStore.getState().resetToDefaults();
  });

  describe('rendering', () => {
    it('should render location name', () => {
      render(
        <CurrentConditions
          conditions={createMockConditions()}
          location={createMockLocation({ name: 'San Francisco' })}
        />
      );

      expect(screen.getByText('San Francisco')).toBeInTheDocument();
    });

    it('should render temperature', () => {
      // Default is Fahrenheit (20°C = 68°F)
      render(
        <CurrentConditions
          conditions={createMockConditions({ temperature: 20 })}
          location={createMockLocation()}
        />
      );

      expect(screen.getByText('68°')).toBeInTheDocument();
    });

    it('should render weather summary', () => {
      render(
        <CurrentConditions
          conditions={createMockConditions({ summary: 'Sunny' })}
          location={createMockLocation()}
        />
      );

      expect(screen.getByText('Sunny')).toBeInTheDocument();
    });

    it('should render feels like temperature', () => {
      render(
        <CurrentConditions
          conditions={createMockConditions({ feelsLike: 15 })}
          location={createMockLocation()}
        />
      );

      // 15°C = 59°F
      expect(screen.getByText(/Feels like 59°/)).toBeInTheDocument();
    });

    it('should render weather icon', () => {
      const { container } = render(
        <CurrentConditions
          conditions={createMockConditions({ icon: 'clear-day' })}
          location={createMockLocation()}
        />
      );

      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('high/low temperatures', () => {
    it('should display actual high/low when today forecast is provided', () => {
      render(
        <CurrentConditions
          conditions={createMockConditions({ temperature: 20 })}
          location={createMockLocation()}
          today={createMockTodayForecast({ temperatureMax: 25, temperatureMin: 15 })}
        />
      );

      // 25°C = 77°F, 15°C = 59°F
      expect(screen.getByText('77°')).toBeInTheDocument(); // High
      expect(screen.getByText('59°')).toBeInTheDocument(); // Low
    });

    it('should fallback to estimated high/low when today is not provided', () => {
      render(
        <CurrentConditions
          conditions={createMockConditions({ temperature: 20 })}
          location={createMockLocation()}
        />
      );

      // Fallback: current ± 5°C -> 15°C = 59°F, 25°C = 77°F
      expect(screen.getByText('77°')).toBeInTheDocument(); // High (20+5)
      expect(screen.getByText('59°')).toBeInTheDocument(); // Low (20-5)
    });

    it('should display L: and H: labels', () => {
      render(
        <CurrentConditions
          conditions={createMockConditions()}
          location={createMockLocation()}
        />
      );

      expect(screen.getByText('L:')).toBeInTheDocument();
      expect(screen.getByText('H:')).toBeInTheDocument();
    });
  });

  describe('unit conversion', () => {
    it('should display temperature in Fahrenheit by default', () => {
      render(
        <CurrentConditions
          conditions={createMockConditions({ temperature: 0 })}
          location={createMockLocation()}
        />
      );

      expect(screen.getByText('32°')).toBeInTheDocument(); // 0°C = 32°F
    });

    it('should display temperature in Celsius when setting is changed', () => {
      useSettingsStore.getState().setTemperatureUnit('celsius');

      render(
        <CurrentConditions
          conditions={createMockConditions({ temperature: 20 })}
          location={createMockLocation()}
        />
      );

      expect(screen.getByText('20°')).toBeInTheDocument();
    });

    it('should convert feels like temperature', () => {
      useSettingsStore.getState().setTemperatureUnit('celsius');

      render(
        <CurrentConditions
          conditions={createMockConditions({ feelsLike: 18 })}
          location={createMockLocation()}
        />
      );

      expect(screen.getByText(/Feels like 18°/)).toBeInTheDocument();
    });

    it('should convert high/low temperatures', () => {
      useSettingsStore.getState().setTemperatureUnit('celsius');

      render(
        <CurrentConditions
          conditions={createMockConditions()}
          location={createMockLocation()}
          today={createMockTodayForecast({ temperatureMax: 30, temperatureMin: 10 })}
        />
      );

      expect(screen.getByText('30°')).toBeInTheDocument(); // High
      expect(screen.getByText('10°')).toBeInTheDocument(); // Low
    });
  });

  describe('negative temperatures', () => {
    it('should display negative temperatures correctly', () => {
      useSettingsStore.getState().setTemperatureUnit('celsius');

      render(
        <CurrentConditions
          conditions={createMockConditions({ temperature: -5 })}
          location={createMockLocation()}
        />
      );

      expect(screen.getByText('-5°')).toBeInTheDocument();
    });

    it('should display negative feels like correctly', () => {
      useSettingsStore.getState().setTemperatureUnit('celsius');

      render(
        <CurrentConditions
          conditions={createMockConditions({ feelsLike: -10 })}
          location={createMockLocation()}
        />
      );

      expect(screen.getByText(/Feels like -10°/)).toBeInTheDocument();
    });
  });

  describe('various weather conditions', () => {
    const weatherConditions: Array<{ summary: string; icon: CurrentConditionsType['icon'] }> = [
      { summary: 'Clear sky', icon: 'clear-day' },
      { summary: 'Overcast', icon: 'cloudy' },
      { summary: 'Heavy rain', icon: 'rain' },
      { summary: 'Heavy snow', icon: 'snow' },
      { summary: 'Thunderstorm', icon: 'thunderstorm' },
      { summary: 'Fog', icon: 'fog' },
    ];

    weatherConditions.forEach(({ summary, icon }) => {
      it(`should render ${summary} condition`, () => {
        render(
          <CurrentConditions
            conditions={createMockConditions({ summary, icon })}
            location={createMockLocation()}
          />
        );

        expect(screen.getByText(summary)).toBeInTheDocument();
      });
    });
  });

  describe('styling', () => {
    it('should have centered text alignment', () => {
      const { container } = render(
        <CurrentConditions
          conditions={createMockConditions()}
          location={createMockLocation()}
        />
      );

      expect(container.firstChild).toHaveClass('text-center');
    });

    it('should have correct padding', () => {
      const { container } = render(
        <CurrentConditions
          conditions={createMockConditions()}
          location={createMockLocation()}
        />
      );

      expect(container.firstChild).toHaveClass('py-8', 'px-4');
    });
  });
});
