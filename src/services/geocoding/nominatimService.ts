import type { Location } from '../../types';
import type { NominatimResult } from '../../types/api';
import { API_ENDPOINTS } from '../../constants';

function generateLocationId(result: NominatimResult): string {
  return `${result.osm_type}-${result.osm_id}`;
}

function extractLocationName(result: NominatimResult): string {
  const address = result.address;
  if (!address) return result.name || result.display_name.split(',')[0];

  return (
    address.city ||
    address.town ||
    address.village ||
    address.municipality ||
    result.name ||
    result.display_name.split(',')[0]
  );
}

function extractDisplayName(result: NominatimResult): string {
  const address = result.address;
  if (!address) return result.display_name;

  const parts: string[] = [];

  const name = extractLocationName(result);
  parts.push(name);

  if (address.state && address.state !== name) {
    parts.push(address.state);
  }

  if (address.country) {
    parts.push(address.country);
  }

  return parts.join(', ');
}

function transformNominatimResult(result: NominatimResult): Location {
  return {
    id: generateLocationId(result),
    name: extractLocationName(result),
    displayName: extractDisplayName(result),
    coordinates: {
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
    },
    country: result.address?.country,
    state: result.address?.state,
  };
}

export async function searchLocations(query: string): Promise<Location[]> {
  if (!query.trim()) return [];

  const params = new URLSearchParams({
    q: query,
    format: 'json',
    addressdetails: '1',
    limit: '10',
  });

  const response = await fetch(`${API_ENDPOINTS.NOMINATIM_SEARCH}?${params}`, {
    headers: {
      'User-Agent': 'DarthSky Weather App (https://github.com/darthsky)',
    },
  });

  if (!response.ok) {
    throw new Error(`Nominatim API error: ${response.status}`);
  }

  const results: NominatimResult[] = await response.json();

  return results.map(transformNominatimResult);
}

export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<Location | null> {
  const params = new URLSearchParams({
    lat: latitude.toString(),
    lon: longitude.toString(),
    format: 'json',
    addressdetails: '1',
  });

  const response = await fetch(`${API_ENDPOINTS.NOMINATIM_REVERSE}?${params}`, {
    headers: {
      'User-Agent': 'DarthSky Weather App (https://github.com/darthsky)',
    },
  });

  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error(`Nominatim API error: ${response.status}`);
  }

  const result: NominatimResult = await response.json();

  if (!result || !result.lat) return null;

  return {
    ...transformNominatimResult(result),
    isCurrentLocation: true,
  };
}
