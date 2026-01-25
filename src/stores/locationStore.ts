import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Location } from '../types';

interface LocationState {
  locations: Location[];
  activeLocationId: string | null;

  // Actions
  addLocation: (location: Location) => void;
  removeLocation: (id: string) => void;
  setActiveLocation: (id: string) => void;
  updateLocation: (id: string, updates: Partial<Location>) => void;
  reorderLocations: (fromIndex: number, toIndex: number) => void;

  // Getters
  getActiveLocation: () => Location | null;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set, get) => ({
      locations: [],
      activeLocationId: null,

      addLocation: (location) => {
        set((state) => {
          const exists = state.locations.some((l) => l.id === location.id);
          if (exists) return state;

          const newLocations = [...state.locations, location];
          return {
            locations: newLocations,
            activeLocationId: state.activeLocationId ?? location.id,
          };
        });
      },

      removeLocation: (id) => {
        set((state) => {
          const newLocations = state.locations.filter((l) => l.id !== id);
          let newActiveId = state.activeLocationId;

          if (state.activeLocationId === id) {
            newActiveId = newLocations[0]?.id ?? null;
          }

          return {
            locations: newLocations,
            activeLocationId: newActiveId,
          };
        });
      },

      setActiveLocation: (id) => {
        set({ activeLocationId: id });
      },

      updateLocation: (id, updates) => {
        set((state) => ({
          locations: state.locations.map((l) =>
            l.id === id ? { ...l, ...updates } : l
          ),
        }));
      },

      reorderLocations: (fromIndex, toIndex) => {
        set((state) => {
          const newLocations = [...state.locations];
          const [removed] = newLocations.splice(fromIndex, 1);
          newLocations.splice(toIndex, 0, removed);
          return { locations: newLocations };
        });
      },

      getActiveLocation: () => {
        const state = get();
        return state.locations.find((l) => l.id === state.activeLocationId) ?? null;
      },
    }),
    {
      name: 'darthsky-locations',
      version: 1,
    }
  )
);
