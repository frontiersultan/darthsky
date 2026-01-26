# Testing Guide

Darth Sky Weather uses [Vitest](https://vitest.dev/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) for testing.

## Running Tests

```bash
# Watch mode (re-runs on file changes)
npm run test

# Single run
npm run test -- --run

# With coverage
npm run test -- --coverage

# Run specific test file
npm run test -- src/utils/formatting.test.ts

# Run tests matching pattern
npm run test -- -t "temperature"
```

## Test Structure

Tests are co-located with source files:

```
src/
├── utils/
│   ├── formatting.ts
│   └── formatting.test.ts
├── stores/
│   ├── locationStore.ts
│   └── locationStore.test.ts
└── components/
    └── common/
        ├── Button.tsx
        └── Button.test.tsx
```

## Writing Tests

### Unit Tests (Utilities)

```typescript
import { describe, it, expect } from 'vitest';
import { formatTemperature } from './formatting';

describe('formatTemperature', () => {
  it('formats fahrenheit correctly', () => {
    expect(formatTemperature(72, 'fahrenheit')).toBe('72°F');
  });

  it('converts to celsius', () => {
    expect(formatTemperature(72, 'celsius')).toBe('22°C');
  });
});
```

### Component Tests

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);

    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Store Tests

```typescript
import { renderHook, act } from '@testing-library/react';
import { useLocationStore } from './locationStore';

describe('locationStore', () => {
  beforeEach(() => {
    // Reset store between tests
    useLocationStore.setState({ locations: [], selectedLocation: null });
  });

  it('adds location', () => {
    const { result } = renderHook(() => useLocationStore());

    act(() => {
      result.current.addLocation({ id: '1', name: 'NYC', lat: 40.7, lon: -74 });
    });

    expect(result.current.locations).toHaveLength(1);
  });
});
```

### Hook Tests

```typescript
import { renderHook } from '@testing-library/react';
import { useUnits } from './useUnits';

describe('useUnits', () => {
  it('formats temperature', () => {
    const { result } = renderHook(() => useUnits());
    expect(result.current.formatTemp(72)).toBe('72°F');
  });
});
```

## Mocking

### Mocking Modules

```typescript
import { vi } from 'vitest';

vi.mock('./api', () => ({
  fetchWeather: vi.fn().mockResolvedValue({ temp: 72 }),
}));
```

### Mocking Zustand Stores

```typescript
vi.mock('@/stores/settingsStore', () => ({
  useSettingsStore: () => ({
    temperatureUnit: 'fahrenheit',
  }),
}));
```

## Test Coverage

Current coverage targets:

| Category | Target |
|----------|--------|
| Utilities | 90%+ |
| Stores | 80%+ |
| Hooks | 80%+ |
| Components | 70%+ |

View coverage report:

```bash
npm run test -- --coverage
open coverage/index.html
```

## Best Practices

1. **Test behavior, not implementation** - Focus on what the component does, not how
2. **Use accessible queries** - Prefer `getByRole`, `getByLabelText` over `getByTestId`
3. **Keep tests focused** - One concept per test
4. **Avoid testing implementation details** - Don't test internal state directly
5. **Write descriptive test names** - Should read like documentation
