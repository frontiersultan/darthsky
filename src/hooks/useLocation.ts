import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchLocations } from '../services/geocoding';
import { useLocationStore } from '../stores';
import { CACHE_TIMES, QUERY_KEYS } from '../constants';
import type { Location } from '../types';

export function useLocationSearch(query: string) {
  return useQuery({
    queryKey: QUERY_KEYS.geocode(query),
    queryFn: () => searchLocations(query),
    enabled: query.length >= 2,
    staleTime: CACHE_TIMES.GEOCODING.staleTime,
    gcTime: CACHE_TIMES.GEOCODING.gcTime,
  });
}

export function useLocationManager() {
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const locations = useLocationStore((s) => s.locations);
  const activeLocationId = useLocationStore((s) => s.activeLocationId);
  const addLocation = useLocationStore((s) => s.addLocation);
  const removeLocation = useLocationStore((s) => s.removeLocation);
  const setActiveLocation = useLocationStore((s) => s.setActiveLocation);
  const reorderLocations = useLocationStore((s) => s.reorderLocations);
  const getActiveLocation = useLocationStore((s) => s.getActiveLocation);

  const activeLocation = getActiveLocation();

  const handleSelectLocation = useCallback(
    (location: Location) => {
      addLocation(location);
      setActiveLocation(location.id);
      setIsSearching(false);
      setSearchQuery('');
    },
    [addLocation, setActiveLocation]
  );

  const handleRemoveLocation = useCallback(
    (id: string) => {
      removeLocation(id);
    },
    [removeLocation]
  );

  const handleSwitchLocation = useCallback(
    (id: string) => {
      setActiveLocation(id);
    },
    [setActiveLocation]
  );

  return {
    locations,
    activeLocation,
    activeLocationId,
    isSearching,
    searchQuery,
    setIsSearching,
    setSearchQuery,
    handleSelectLocation,
    handleRemoveLocation,
    handleSwitchLocation,
    reorderLocations,
  };
}
