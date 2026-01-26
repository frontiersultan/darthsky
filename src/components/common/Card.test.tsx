import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../test/test-utils';
import { Card, CardHeader, CardBody } from './Card';

describe('Card', () => {
  describe('rendering', () => {
    it('should render children', () => {
      render(<Card>Card content</Card>);
      expect(screen.getByText('Card content')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(<Card data-testid="card" className="custom-class">Content</Card>);
      expect(screen.getByTestId('card')).toHaveClass('custom-class');
    });
  });

  describe('variants', () => {
    it('should render default variant', () => {
      render(<Card data-testid="card">Default Card</Card>);
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('bg-white');
    });

    it('should render glass variant', () => {
      render(<Card data-testid="card" variant="glass">Glass Card</Card>);
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('glass');
    });
  });

  describe('base styles', () => {
    it('should have rounded corners', () => {
      render(<Card data-testid="card">Content</Card>);
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('rounded-2xl');
    });
  });

  describe('forwarded ref', () => {
    it('should forward ref to div element', () => {
      const ref = vi.fn();
      render(<Card ref={ref}>Content</Card>);
      expect(ref).toHaveBeenCalled();
      expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('additional props', () => {
    it('should pass through data attributes', () => {
      render(<Card data-testid="card">Content</Card>);
      expect(screen.getByTestId('card')).toBeInTheDocument();
    });
  });
});

describe('CardHeader', () => {
  describe('rendering', () => {
    it('should render children', () => {
      render(<CardHeader>Header content</CardHeader>);
      expect(screen.getByText('Header content')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(<CardHeader className="custom-header">Header</CardHeader>);
      expect(screen.getByText('Header')).toHaveClass('custom-header');
    });
  });

  describe('styles', () => {
    it('should have padding', () => {
      render(<CardHeader>Header</CardHeader>);
      expect(screen.getByText('Header')).toHaveClass('px-4', 'py-3');
    });

    it('should have bottom border', () => {
      render(<CardHeader>Header</CardHeader>);
      expect(screen.getByText('Header')).toHaveClass('border-b');
    });
  });

  describe('forwarded ref', () => {
    it('should forward ref to div element', () => {
      const ref = vi.fn();
      render(<CardHeader ref={ref}>Header</CardHeader>);
      expect(ref).toHaveBeenCalled();
      expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLDivElement);
    });
  });
});

describe('CardBody', () => {
  describe('rendering', () => {
    it('should render children', () => {
      render(<CardBody>Body content</CardBody>);
      expect(screen.getByText('Body content')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(<CardBody className="custom-body">Body</CardBody>);
      expect(screen.getByText('Body')).toHaveClass('custom-body');
    });
  });

  describe('styles', () => {
    it('should have padding', () => {
      render(<CardBody>Body</CardBody>);
      expect(screen.getByText('Body')).toHaveClass('p-4');
    });
  });

  describe('forwarded ref', () => {
    it('should forward ref to div element', () => {
      const ref = vi.fn();
      render(<CardBody ref={ref}>Body</CardBody>);
      expect(ref).toHaveBeenCalled();
      expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLDivElement);
    });
  });
});

describe('Card composition', () => {
  it('should render Card with CardHeader and CardBody', () => {
    render(
      <Card>
        <CardHeader>Card Title</CardHeader>
        <CardBody>Card content goes here</CardBody>
      </Card>
    );

    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card content goes here')).toBeInTheDocument();
  });
});
