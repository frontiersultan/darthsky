# Radar Service API

The radar service handles fetching precipitation radar data from the RainViewer API.

## Location

`src/services/radar.ts`

## Functions

### `fetchRadarData`

Fetches available radar timestamps and tile URLs.

```typescript
async function fetchRadarData(): Promise<RadarData>
```

**Returns**: `Promise<RadarData>`

**Example**:
```typescript
const radar = await fetchRadarData();
console.log(radar.past); // Past radar frames
console.log(radar.nowcast); // Forecast frames
```

### `getRadarTileUrl`

Constructs a tile URL for a specific timestamp.

```typescript
function getRadarTileUrl(
  timestamp: number,
  z: number,
  x: number,
  y: number
): string
```

**Parameters**:
| Name | Type | Description |
|------|------|-------------|
| `timestamp` | `number` | Unix timestamp from radar data |
| `z` | `number` | Zoom level |
| `x` | `number` | Tile X coordinate |
| `y` | `number` | Tile Y coordinate |

**Returns**: Tile URL string

## Types

### `RadarData`

```typescript
interface RadarData {
  generated: number;       // When data was generated
  host: string;            // Tile server host
  past: RadarFrame[];      // Past radar frames (~2 hours)
  nowcast: RadarFrame[];   // Forecast frames (~30 min)
}
```

### `RadarFrame`

```typescript
interface RadarFrame {
  time: number;    // Unix timestamp
  path: string;    // Tile path
}
```

## Tile URL Format

```
https://tilecache.rainviewer.com/v2/radar/{timestamp}/256/{z}/{x}/{y}/2/1_1.png
```

- `{timestamp}`: Unix timestamp from frame data
- `{z}`: Zoom level (0-20)
- `{x}`, `{y}`: Tile coordinates
- `2`: Color scheme (precipitation)
- `1_1`: Options (smooth, original colors)

## MapLibre Integration

Radar tiles are added as a raster source:

```typescript
map.addSource('radar', {
  type: 'raster',
  tiles: [getRadarTileUrl(timestamp, '{z}', '{x}', '{y}')],
  tileSize: 256,
});

map.addLayer({
  id: 'radar-layer',
  type: 'raster',
  source: 'radar',
  paint: {
    'raster-opacity': 0.7,
  },
});
```

## Animation

To animate radar:

1. Fetch all frame timestamps
2. Preload tiles for each timestamp
3. Cycle through frames on interval
4. Update tile source URL for each frame

## Caching

Radar data is cached by React Query with:
- **Stale time**: 2 minutes
- **Cache time**: 10 minutes
- **Refetch on window focus**: Yes

## Rate Limits

RainViewer has no published rate limits, but tiles are cached globally. Reasonable usage is expected.
