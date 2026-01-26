import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '../../test/test-utils';
import { AlertsBanner } from './AlertsBanner';
import type { WeatherAlert } from '../../types';

const createMockAlert = (overrides: Partial<WeatherAlert> = {}): WeatherAlert => ({
  id: '1',
  event: 'Winter Storm Warning',
  headline: 'Heavy snow expected',
  description: 'Snowfall of 6-10 inches expected with gusty winds up to 45 mph.',
  severity: 'moderate',
  urgency: 'expected',
  start: new Date('2024-01-15T12:00:00'),
  end: new Date('2024-01-16T12:00:00'),
  areas: ['New York', 'New Jersey'],
  ...overrides,
});

describe('AlertsBanner', () => {
  describe('rendering', () => {
    it('should render nothing when no alerts', () => {
      const { container } = render(<AlertsBanner alerts={[]} />);
      expect(container.firstChild).toBeNull();
    });

    it('should render alert when alerts exist', () => {
      const alerts = [createMockAlert()];
      render(<AlertsBanner alerts={alerts} />);

      expect(screen.getByText('Heavy snow expected')).toBeInTheDocument();
    });

    it('should render multiple alerts', () => {
      const alerts = [
        createMockAlert({ id: '1', headline: 'Alert One' }),
        createMockAlert({ id: '2', headline: 'Alert Two' }),
      ];
      render(<AlertsBanner alerts={alerts} />);

      expect(screen.getByText('Alert One')).toBeInTheDocument();
      expect(screen.getByText('Alert Two')).toBeInTheDocument();
    });

    it('should display event type', () => {
      const alerts = [createMockAlert({ event: 'Tornado Watch' })];
      render(<AlertsBanner alerts={alerts} />);

      expect(screen.getByText('Tornado Watch')).toBeInTheDocument();
    });

    it('should display severity level', () => {
      const alerts = [createMockAlert({ severity: 'severe' })];
      render(<AlertsBanner alerts={alerts} />);

      expect(screen.getByText('severe')).toBeInTheDocument();
    });
  });

  describe('severity styling', () => {
    it('should style minor severity correctly', () => {
      const alerts = [createMockAlert({ severity: 'minor' })];
      render(<AlertsBanner alerts={alerts} />);

      expect(screen.getByText('minor')).toBeInTheDocument();
    });

    it('should style moderate severity correctly', () => {
      const alerts = [createMockAlert({ severity: 'moderate' })];
      render(<AlertsBanner alerts={alerts} />);

      expect(screen.getByText('moderate')).toBeInTheDocument();
    });

    it('should style severe severity correctly', () => {
      const alerts = [createMockAlert({ severity: 'severe' })];
      render(<AlertsBanner alerts={alerts} />);

      expect(screen.getByText('severe')).toBeInTheDocument();
    });

    it('should style extreme severity correctly', () => {
      const alerts = [createMockAlert({ severity: 'extreme' })];
      render(<AlertsBanner alerts={alerts} />);

      expect(screen.getByText('extreme')).toBeInTheDocument();
    });
  });

  describe('expand/collapse', () => {
    it('should not show description by default', () => {
      const alerts = [createMockAlert({ description: 'Detailed description here' })];
      render(<AlertsBanner alerts={alerts} />);

      expect(screen.queryByText('Detailed description here')).not.toBeInTheDocument();
    });

    it('should show description when expanded', () => {
      const alerts = [createMockAlert({ description: 'Detailed description here' })];
      render(<AlertsBanner alerts={alerts} />);

      const expandButton = screen.getByRole('button', { name: 'Expand alert' });
      fireEvent.click(expandButton);

      expect(screen.getByText('Detailed description here')).toBeInTheDocument();
    });

    it('should hide description when collapsed', () => {
      const alerts = [createMockAlert({ description: 'Detailed description here' })];
      render(<AlertsBanner alerts={alerts} />);

      const expandButton = screen.getByRole('button', { name: 'Expand alert' });
      fireEvent.click(expandButton);
      expect(screen.getByText('Detailed description here')).toBeInTheDocument();

      const collapseButton = screen.getByRole('button', { name: 'Collapse alert' });
      fireEvent.click(collapseButton);
      expect(screen.queryByText('Detailed description here')).not.toBeInTheDocument();
    });

    it('should toggle expand state when headline is clicked', () => {
      const alerts = [createMockAlert({ description: 'Click headline to expand' })];
      render(<AlertsBanner alerts={alerts} />);

      fireEvent.click(screen.getByText('Heavy snow expected'));
      expect(screen.getByText('Click headline to expand')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Heavy snow expected'));
      expect(screen.queryByText('Click headline to expand')).not.toBeInTheDocument();
    });

    it('should only expand one alert at a time', () => {
      const alerts = [
        createMockAlert({ id: '1', headline: 'Alert One', description: 'Description One' }),
        createMockAlert({ id: '2', headline: 'Alert Two', description: 'Description Two' }),
      ];
      render(<AlertsBanner alerts={alerts} />);

      fireEvent.click(screen.getByText('Alert One'));
      expect(screen.getByText('Description One')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Alert Two'));
      expect(screen.queryByText('Description One')).not.toBeInTheDocument();
      expect(screen.getByText('Description Two')).toBeInTheDocument();
    });
  });

  describe('dismiss', () => {
    it('should have dismiss button', () => {
      const alerts = [createMockAlert()];
      render(<AlertsBanner alerts={alerts} />);

      expect(screen.getByRole('button', { name: 'Dismiss alert' })).toBeInTheDocument();
    });

    it('should remove alert when dismissed', () => {
      const alerts = [createMockAlert()];
      render(<AlertsBanner alerts={alerts} />);

      fireEvent.click(screen.getByRole('button', { name: 'Dismiss alert' }));

      expect(screen.queryByText('Heavy snow expected')).not.toBeInTheDocument();
    });

    it('should only dismiss clicked alert', () => {
      const alerts = [
        createMockAlert({ id: '1', headline: 'Alert One' }),
        createMockAlert({ id: '2', headline: 'Alert Two' }),
      ];
      render(<AlertsBanner alerts={alerts} />);

      const dismissButtons = screen.getAllByRole('button', { name: 'Dismiss alert' });
      fireEvent.click(dismissButtons[0]);

      expect(screen.queryByText('Alert One')).not.toBeInTheDocument();
      expect(screen.getByText('Alert Two')).toBeInTheDocument();
    });

    it('should render nothing when all alerts are dismissed', () => {
      const alerts = [createMockAlert()];
      const { container } = render(<AlertsBanner alerts={alerts} />);

      fireEvent.click(screen.getByRole('button', { name: 'Dismiss alert' }));

      expect(container.firstChild).toBeNull();
    });
  });

  describe('accessibility', () => {
    it('should have accessible expand/collapse buttons', () => {
      const alerts = [createMockAlert()];
      render(<AlertsBanner alerts={alerts} />);

      expect(screen.getByRole('button', { name: 'Expand alert' })).toBeInTheDocument();
    });

    it('should have accessible dismiss button', () => {
      const alerts = [createMockAlert()];
      render(<AlertsBanner alerts={alerts} />);

      expect(screen.getByRole('button', { name: 'Dismiss alert' })).toBeInTheDocument();
    });

    it('should update aria-label when expanded', () => {
      const alerts = [createMockAlert()];
      render(<AlertsBanner alerts={alerts} />);

      fireEvent.click(screen.getByRole('button', { name: 'Expand alert' }));

      expect(screen.getByRole('button', { name: 'Collapse alert' })).toBeInTheDocument();
    });
  });
});
