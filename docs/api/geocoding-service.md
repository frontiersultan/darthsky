# Geocoding Service API

The geocoding service handles location search and reverse geocoding using the Nominatim API.

## Location

`src/services/geocoding.ts`

## Functions

### `searchLocations`

Search for locations by name.

```typescript
async function searchLocations(query: string): Promise<SearchResult[]>
```

**Parameters**:
| Name | Type | Description |
|------|------|-------------|
| `query` | `string` | Search query (city name, address, etc.) |

**Returns**: `Promise<SearchResult[]>`

**Example**:
```typescript
const results = await searchLocations('New York');
// [{ name: 'New York', lat: 40.7128, lon: -74.0060, ... }, ...]
```

### `reverseGeocode`

Get location name from coordinates.

```typescript
async function reverseGeocode(
  lat: number,
  lon: number
): Promise<LocationInfo>
```

**Parameters**:
| Name | Type | Description |
|------|------|-------------|
| `lat` | `number` | Latitude |
| `lon` | `number` | Longitude |

**Returns**: `Promise<LocationInfo>`

**Example**:
```typescript
const location = await reverseGeocode(40.7128, -74.0060);
// { name: 'New York', state: 'New York', country: 'United States', ... }
```

## Types

### `SearchResult`

```typescript
interface SearchResult {
  placeId: string;
  name: string;
  displayName: string;
  lat: number;
  lon: number;
  type: string;
  importance: number;
}
```

### `LocationInfo`

```typescript
interface LocationInfo {
  name: string;
  state?: string;
  country: string;
  lat: number;
  lon: number;
}
```

## API Details

### Base URL
`https://nominatim.openstreetmap.org`

### Endpoints Used

**Search**:
```
GET /search?q={query}&format=json&limit=5&addressdetails=1
```

**Reverse**:
```
GET /reverse?lat={lat}&lon={lon}&format=json
```

### Required Headers

```typescript
headers: {
  'User-Agent': 'DarthSkyWeather/1.0',
}
```

## Rate Limits

Nominatim has strict usage policies:
- **Maximum 1 request per second**
- Must include User-Agent header
- No bulk geocoding
- See [Usage Policy](https://operations.osmfoundation.org/policies/nominatim/)

### Implementing Rate Limiting

```typescript
let lastRequestTime = 0;

async function rateLimitedFetch(url: string) {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;

  if (timeSinceLastRequest < 1000) {
    await new Promise(r => setTimeout(r, 1000 - timeSinceLastRequest));
  }

  lastRequestTime = Date.now();
  return fetch(url, { headers: { 'User-Agent': 'DarthSkyWeather/1.0' } });
}
```

## Caching

Location search results are cached by React Query with:
- **Stale time**: 1 hour
- **Cache time**: 24 hours

This helps reduce API calls for repeated searches.

## Error Handling

Handle these error cases:
- Network failures
- Rate limit exceeded (429 status)
- No results found
- Invalid coordinates

```typescript
try {
  const results = await searchLocations(query);
  if (results.length === 0) {
    // Show "No results found" message
  }
} catch (error) {
  // Show error message to user
}
```
