import { useState, useCallback } from 'react';
import { reverseGeocode } from '../services/geocoding';
import { useLocationStore } from '../stores';
import type { Location } from '../types';

interface GeolocationState {
  isLoading: boolean;
  error: string | null;
  location: Location | null;
}

interface UseGeolocationReturn extends GeolocationState {
  requestLocation: () => Promise<Location | null>;
  clearError: () => void;
}

export function useGeolocation(): UseGeolocationReturn {
  const [state, setState] = useState<GeolocationState>({
    isLoading: false,
    error: null,
    location: null,
  });

  const addLocation = useLocationStore((s) => s.addLocation);
  const setActiveLocation = useLocationStore((s) => s.setActiveLocation);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const requestLocation = useCallback(async (): Promise<Location | null> => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: 'Geolocation is not supported by your browser',
      }));
      return null;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const location = await reverseGeocode(latitude, longitude);

            if (location) {
              const currentLocation: Location = {
                ...location,
                id: 'current-location',
                isCurrentLocation: true,
              };

              setState({
                isLoading: false,
                error: null,
                location: currentLocation,
              });

              addLocation(currentLocation);
              setActiveLocation(currentLocation.id);
              resolve(currentLocation);
            } else {
              const fallbackLocation: Location = {
                id: 'current-location',
                name: 'Current Location',
                displayName: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
                coordinates: { latitude, longitude },
                isCurrentLocation: true,
              };

              setState({
                isLoading: false,
                error: null,
                location: fallbackLocation,
              });

              addLocation(fallbackLocation);
              setActiveLocation(fallbackLocation.id);
              resolve(fallbackLocation);
            }
          } catch (err) {
            setState({
              isLoading: false,
              error: 'Failed to get location details',
              location: null,
            });
            resolve(null);
          }
        },
        (error) => {
          let errorMessage = 'Failed to get your location';

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out';
              break;
          }

          setState({
            isLoading: false,
            error: errorMessage,
            location: null,
          });
          resolve(null);
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    });
  }, [addLocation, setActiveLocation]);

  return {
    ...state,
    requestLocation,
    clearError,
  };
}
