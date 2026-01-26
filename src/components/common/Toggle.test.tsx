import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../test/test-utils';
import { Toggle } from './Toggle';

describe('Toggle', () => {
  describe('rendering', () => {
    it('should render checkbox input', () => {
      render(<Toggle />);
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('should render with label when provided', () => {
      render(<Toggle label="Enable notifications" />);
      expect(screen.getByText('Enable notifications')).toBeInTheDocument();
    });

    it('should not render label when not provided', () => {
      const { container } = render(<Toggle />);
      expect(container.querySelector('span')).not.toBeInTheDocument();
    });
  });

  describe('checked state', () => {
    it('should be unchecked by default', () => {
      render(<Toggle />);
      expect(screen.getByRole('checkbox')).not.toBeChecked();
    });

    it('should be checked when checked prop is true', () => {
      render(<Toggle checked onChange={() => {}} />);
      expect(screen.getByRole('checkbox')).toBeChecked();
    });

    it('should be unchecked when checked prop is false', () => {
      render(<Toggle checked={false} onChange={() => {}} />);
      expect(screen.getByRole('checkbox')).not.toBeChecked();
    });
  });

  describe('interactions', () => {
    it('should call onChange when clicked', () => {
      const handleChange = vi.fn();
      render(<Toggle onChange={handleChange} />);

      fireEvent.click(screen.getByRole('checkbox'));
      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('should call onChange with event when toggled', () => {
      const handleChange = vi.fn();
      render(<Toggle onChange={handleChange} />);

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);
      expect(handleChange).toHaveBeenCalled();
    });

    it('should pass event to onChange handler', () => {
      const handleChange = vi.fn();
      render(<Toggle onChange={handleChange} />);

      fireEvent.click(screen.getByRole('checkbox'));
      expect(handleChange.mock.calls[0][0]).toBeDefined();
      expect(handleChange.mock.calls[0][0].target).toBeDefined();
    });
  });

  describe('label click', () => {
    it('should toggle when label is clicked', () => {
      const handleChange = vi.fn();
      render(<Toggle label="Dark mode" onChange={handleChange} />);

      fireEvent.click(screen.getByText('Dark mode'));
      expect(handleChange).toHaveBeenCalled();
    });
  });

  describe('disabled state', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<Toggle disabled />);
      expect(screen.getByRole('checkbox')).toBeDisabled();
    });

    it('should have disabled attribute', () => {
      render(<Toggle disabled />);
      expect(screen.getByRole('checkbox')).toHaveAttribute('disabled');
    });

    it('should prevent pointer events when disabled', () => {
      render(<Toggle disabled />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeDisabled();
      // Native disabled attribute prevents user interaction
    });
  });

  describe('id handling', () => {
    it('should use provided id', () => {
      render(<Toggle id="custom-toggle" label="Custom" />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('id', 'custom-toggle');
    });

    it('should generate unique id when not provided', () => {
      render(<Toggle label="Auto ID" />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('id');
      expect(checkbox.id).toMatch(/^toggle-/);
    });

    it('should associate label with checkbox via htmlFor', () => {
      render(<Toggle id="test-toggle" label="Test" />);
      const label = screen.getByText('Test').closest('label');
      expect(label).toHaveAttribute('for', 'test-toggle');
    });
  });

  describe('styling', () => {
    it('should apply custom className', () => {
      const { container } = render(<Toggle className="custom-class" />);
      const label = container.querySelector('label');
      expect(label).toHaveClass('custom-class');
    });

    it('should have cursor pointer style', () => {
      const { container } = render(<Toggle />);
      const label = container.querySelector('label');
      expect(label).toHaveClass('cursor-pointer');
    });

    it('should have screen reader only input', () => {
      render(<Toggle />);
      expect(screen.getByRole('checkbox')).toHaveClass('sr-only');
    });
  });

  describe('forwarded ref', () => {
    it('should forward ref to input element', () => {
      const ref = vi.fn();
      render(<Toggle ref={ref} />);
      expect(ref).toHaveBeenCalled();
      expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLInputElement);
    });
  });

  describe('additional props', () => {
    it('should pass through name prop', () => {
      render(<Toggle name="settings" />);
      expect(screen.getByRole('checkbox')).toHaveAttribute('name', 'settings');
    });

    it('should pass through aria attributes', () => {
      render(<Toggle aria-describedby="help-text" />);
      expect(screen.getByRole('checkbox')).toHaveAttribute('aria-describedby', 'help-text');
    });
  });
});
