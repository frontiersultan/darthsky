import { create } from 'zustand';

type TabId = 'weather' | 'map' | 'settings';

interface UIState {
  activeTab: TabId;
  isLocationSearchOpen: boolean;
  isRefreshing: boolean;
  selectedAlertId: string | null;
  mapTimeIndex: number;
  isMapPlaying: boolean;

  // Actions
  setActiveTab: (tab: TabId) => void;
  openLocationSearch: () => void;
  closeLocationSearch: () => void;
  setRefreshing: (refreshing: boolean) => void;
  setSelectedAlert: (alertId: string | null) => void;
  setMapTimeIndex: (index: number) => void;
  setMapPlaying: (playing: boolean) => void;
  incrementMapTime: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  activeTab: 'weather',
  isLocationSearchOpen: false,
  isRefreshing: false,
  selectedAlertId: null,
  mapTimeIndex: 0,
  isMapPlaying: false,

  setActiveTab: (tab) => set({ activeTab: tab }),

  openLocationSearch: () => set({ isLocationSearchOpen: true }),

  closeLocationSearch: () => set({ isLocationSearchOpen: false }),

  setRefreshing: (refreshing) => set({ isRefreshing: refreshing }),

  setSelectedAlert: (alertId) => set({ selectedAlertId: alertId }),

  setMapTimeIndex: (index) => set({ mapTimeIndex: index }),

  setMapPlaying: (playing) => set({ isMapPlaying: playing }),

  incrementMapTime: () =>
    set((state) => ({ mapTimeIndex: state.mapTimeIndex + 1 })),
}));
