# State Management

Darth Sky Weather uses [Zustand](https://github.com/pmndrs/zustand) for state management. Zustand provides a simple, lightweight alternative to Redux with minimal boilerplate.

## Stores

### Location Store

Manages user locations and the currently selected location.

**File**: `src/stores/locationStore.ts`

**State**:
```typescript
interface LocationState {
  locations: Location[];
  selectedLocation: Location | null;
}
```

**Actions**:
- `addLocation(location)` - Add a new saved location
- `removeLocation(id)` - Remove a location by ID
- `setSelectedLocation(location)` - Set the active location
- `updateLocation(id, updates)` - Update location details

**Persistence**: Locations are persisted to localStorage.

### Settings Store

Manages user preferences for units and display options.

**File**: `src/stores/settingsStore.ts`

**State**:
```typescript
interface SettingsState {
  temperatureUnit: 'fahrenheit' | 'celsius';
  windSpeedUnit: 'mph' | 'kmh' | 'ms' | 'knots';
  pressureUnit: 'inhg' | 'hpa' | 'mmhg';
  visibilityUnit: 'miles' | 'km';
  precipitationUnit: 'inches' | 'mm';
  timeFormat: '12h' | '24h';
}
```

**Actions**:
- `setTemperatureUnit(unit)` - Set temperature display unit
- `setWindSpeedUnit(unit)` - Set wind speed display unit
- `setPressureUnit(unit)` - Set pressure display unit
- `setVisibilityUnit(unit)` - Set visibility display unit
- `setPrecipitationUnit(unit)` - Set precipitation display unit
- `setTimeFormat(format)` - Set 12h or 24h time format

**Persistence**: Settings are persisted to localStorage.

## Usage Pattern

```tsx
import { useLocationStore } from '@/stores/locationStore';
import { useSettingsStore } from '@/stores/settingsStore';

function MyComponent() {
  // Subscribe to specific state
  const selectedLocation = useLocationStore((state) => state.selectedLocation);
  const temperatureUnit = useSettingsStore((state) => state.temperatureUnit);

  // Get actions
  const setSelectedLocation = useLocationStore((state) => state.setSelectedLocation);

  // Use in component...
}
```

## Persistence

Both stores use Zustand's `persist` middleware to save state to localStorage:

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      // state and actions
    }),
    {
      name: 'store-name', // localStorage key
    }
  )
);
```

## Data Fetching

For server state (weather data, radar data), we use TanStack React Query instead of Zustand. This provides:

- Automatic caching
- Background refetching
- Stale-while-revalidate
- Request deduplication

See [API Integration](./api-integration.md) for details.
