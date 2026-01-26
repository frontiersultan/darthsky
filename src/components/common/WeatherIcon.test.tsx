import { describe, it, expect } from 'vitest';
import { render } from '../../test/test-utils';
import { WeatherIcon } from './WeatherIcon';
import type { WeatherIcon as WeatherIconType } from '../../types';

describe('WeatherIcon', () => {
  describe('rendering', () => {
    it('should render an SVG element', () => {
      const { container } = render(<WeatherIcon icon="clear-day" />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('should apply default size', () => {
      const { container } = render(<WeatherIcon icon="clear-day" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '24');
      expect(svg).toHaveAttribute('height', '24');
    });

    it('should apply custom size', () => {
      const { container } = render(<WeatherIcon icon="clear-day" size={48} />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '48');
      expect(svg).toHaveAttribute('height', '48');
    });

    it('should apply custom className', () => {
      const { container } = render(<WeatherIcon icon="clear-day" className="custom-class" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('custom-class');
    });
  });

  describe('icon mapping', () => {
    const iconTests: Array<{ icon: WeatherIconType; expectedColor: string }> = [
      { icon: 'clear-day', expectedColor: 'text-amber-400' },
      { icon: 'clear-night', expectedColor: 'text-indigo-400' },
      { icon: 'partly-cloudy-day', expectedColor: 'text-amber-400' },
      { icon: 'partly-cloudy-night', expectedColor: 'text-indigo-300' },
      { icon: 'cloudy', expectedColor: 'text-slate-400' },
      { icon: 'fog', expectedColor: 'text-slate-400' },
      { icon: 'drizzle', expectedColor: 'text-sky-400' },
      { icon: 'rain', expectedColor: 'text-blue-500' },
      { icon: 'sleet', expectedColor: 'text-cyan-400' },
      { icon: 'snow', expectedColor: 'text-cyan-200' },
      { icon: 'thunderstorm', expectedColor: 'text-indigo-500' },
      { icon: 'wind', expectedColor: 'text-slate-400' },
    ];

    iconTests.forEach(({ icon, expectedColor }) => {
      it(`should render ${icon} with correct color class`, () => {
        const { container } = render(<WeatherIcon icon={icon} />);
        const svg = container.querySelector('svg');
        expect(svg).toHaveClass(expectedColor);
      });
    });
  });

  describe('clear conditions', () => {
    it('should render Sun icon for clear-day', () => {
      const { container } = render(<WeatherIcon icon="clear-day" />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveClass('text-amber-400');
    });

    it('should render Moon icon for clear-night', () => {
      const { container } = render(<WeatherIcon icon="clear-night" />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveClass('text-indigo-400');
    });
  });

  describe('precipitation conditions', () => {
    it('should render rain icon', () => {
      const { container } = render(<WeatherIcon icon="rain" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('text-blue-500');
    });

    it('should render snow icon', () => {
      const { container } = render(<WeatherIcon icon="snow" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('text-cyan-200');
    });

    it('should render thunderstorm icon', () => {
      const { container } = render(<WeatherIcon icon="thunderstorm" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('text-indigo-500');
    });
  });

  describe('additional props', () => {
    it('should pass through stroke-width', () => {
      const { container } = render(<WeatherIcon icon="clear-day" strokeWidth={3} />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('stroke-width', '3');
    });

    it('should pass through data attributes', () => {
      const { container } = render(<WeatherIcon icon="clear-day" data-testid="weather-icon" />);
      expect(container.querySelector('[data-testid="weather-icon"]')).toBeInTheDocument();
    });
  });

  describe('fallback behavior', () => {
    it('should render Cloud icon for unknown icon type', () => {
      // TypeScript would normally prevent this, but testing runtime fallback
      const { container } = render(<WeatherIcon icon={'unknown' as WeatherIconType} />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveClass('text-slate-400');
    });
  });
});
