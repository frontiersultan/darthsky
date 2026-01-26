# Adding Features Guide

This guide walks through the process of adding new features to Darth Sky Weather.

## General Process

1. **Understand the architecture** - Read the [Architecture Overview](../architecture/overview.md)
2. **Create a branch** - `git checkout -b feature/your-feature`
3. **Implement the feature** - Follow patterns below
4. **Write tests** - See [Testing Guide](./testing.md)
5. **Update documentation** - If adding public APIs or changing behavior
6. **Submit PR** - Follow the [PR template](../../.github/pull_request_template.md)

## Adding a New Component

### 1. Create the Component

```typescript
// src/components/weather/NewComponent.tsx
import { FC } from 'react';

interface NewComponentProps {
  data: SomeType;
}

export const NewComponent: FC<NewComponentProps> = ({ data }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      {/* Component content */}
    </div>
  );
};
```

### 2. Export from Index

```typescript
// src/components/weather/index.ts
export { NewComponent } from './NewComponent';
```

### 3. Write Tests

```typescript
// src/components/weather/NewComponent.test.tsx
import { render, screen } from '@testing-library/react';
import { NewComponent } from './NewComponent';

describe('NewComponent', () => {
  it('renders correctly', () => {
    render(<NewComponent data={mockData} />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

## Adding a New API Integration

### 1. Create Service

```typescript
// src/services/newapi.ts
const BASE_URL = 'https://api.example.com';

export interface ApiResponse {
  // Define response type
}

export async function fetchFromNewApi(params: Params): Promise<ApiResponse> {
  const response = await fetch(`${BASE_URL}/endpoint?${new URLSearchParams(params)}`);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
}
```

### 2. Create React Query Hook

```typescript
// src/hooks/useNewData.ts
import { useQuery } from '@tanstack/react-query';
import { fetchFromNewApi } from '@/services/newapi';

export function useNewData(params: Params) {
  return useQuery({
    queryKey: ['newdata', params],
    queryFn: () => fetchFromNewApi(params),
    staleTime: 5 * 60 * 1000,
  });
}
```

### 3. Use in Component

```typescript
function MyComponent() {
  const { data, isLoading, error } = useNewData(params);

  if (isLoading) return <Loading />;
  if (error) return <Error message={error.message} />;

  return <Display data={data} />;
}
```

## Adding a New Setting

### 1. Update Store Type

```typescript
// src/stores/settingsStore.ts
interface SettingsState {
  // ... existing settings
  newSetting: 'option1' | 'option2';
}
```

### 2. Add Action

```typescript
setNewSetting: (value) => set({ newSetting: value }),
```

### 3. Add Default Value

```typescript
const initialState: SettingsState = {
  // ... existing defaults
  newSetting: 'option1',
};
```

### 4. Add UI Control

```typescript
// src/pages/SettingsPage.tsx
const newSetting = useSettingsStore((s) => s.newSetting);
const setNewSetting = useSettingsStore((s) => s.setNewSetting);

<SettingRow label="New Setting">
  <Toggle
    options={[
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
    ]}
    value={newSetting}
    onChange={setNewSetting}
  />
</SettingRow>
```

## Adding a New Page

### 1. Create Page Component

```typescript
// src/pages/NewPage.tsx
export function NewPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Page content */}
    </div>
  );
}
```

### 2. Add Route (if using router)

Update your routing configuration to include the new page.

### 3. Add Navigation

Update `TabBar` or navigation component to include link to new page.

## Code Style Guidelines

- Use functional components with TypeScript
- Prefer named exports over default exports
- Use Tailwind CSS for styling
- Follow existing patterns in the codebase
- Keep components focused and small
- Extract reusable logic into hooks
