import type { RainViewerMapsResponse } from '../../types/api';
import { API_ENDPOINTS } from '../../constants';

export interface RadarFrame {
  timestamp: number;
  path: string;
  tileUrl: string;
}

export interface RadarData {
  generated: number;
  host: string;
  past: RadarFrame[];
  nowcast: RadarFrame[];
}

function createTileUrl(host: string, path: string): string {
  return `${host}${path}/256/{z}/{x}/{y}/2/1_1.png`;
}

export async function fetchRadarData(): Promise<RadarData> {
  const response = await fetch(API_ENDPOINTS.RAINVIEWER_MAPS);

  if (!response.ok) {
    throw new Error(`RainViewer API error: ${response.status}`);
  }

  const data: RainViewerMapsResponse = await response.json();

  const past = data.radar.past.map((frame) => ({
    timestamp: frame.time,
    path: frame.path,
    tileUrl: createTileUrl(data.host, frame.path),
  }));

  const nowcast = data.radar.nowcast.map((frame) => ({
    timestamp: frame.time,
    path: frame.path,
    tileUrl: createTileUrl(data.host, frame.path),
  }));

  return {
    generated: data.generated,
    host: data.host,
    past,
    nowcast,
  };
}

export function getAllFrames(data: RadarData): RadarFrame[] {
  return [...data.past, ...data.nowcast];
}

export function formatRadarTime(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffMins = Math.round(diffMs / 60000);

  if (diffMins === 0) return 'Now';
  if (diffMins > 0) return `+${diffMins}m`;
  return `${diffMins}m`;
}

export function getRadarTileUrl(
  frame: RadarFrame,
  z: number,
  x: number,
  y: number
): string {
  return frame.tileUrl
    .replace('{z}', z.toString())
    .replace('{x}', x.toString())
    .replace('{y}', y.toString());
}
