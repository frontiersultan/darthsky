import { describe, it, expect, beforeEach } from 'vitest';
import { useLocationStore } from './locationStore';
import type { Location } from '../types';

const createMockLocation = (id: string, name: string): Location => ({
  id,
  name,
  displayName: `${name}, US`,
  coordinates: { latitude: 40.7128, longitude: -74.006 },
  country: 'US',
});

describe('locationStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useLocationStore.setState({
      locations: [],
      activeLocationId: null,
    });
  });

  describe('addLocation', () => {
    it('should add a location to empty store', () => {
      const location = createMockLocation('1', 'New York');
      useLocationStore.getState().addLocation(location);

      const state = useLocationStore.getState();
      expect(state.locations).toHaveLength(1);
      expect(state.locations[0]).toEqual(location);
    });

    it('should set first location as active', () => {
      const location = createMockLocation('1', 'New York');
      useLocationStore.getState().addLocation(location);

      const state = useLocationStore.getState();
      expect(state.activeLocationId).toBe('1');
    });

    it('should not change active location when adding subsequent locations', () => {
      const loc1 = createMockLocation('1', 'New York');
      const loc2 = createMockLocation('2', 'Los Angeles');

      useLocationStore.getState().addLocation(loc1);
      useLocationStore.getState().addLocation(loc2);

      const state = useLocationStore.getState();
      expect(state.activeLocationId).toBe('1');
      expect(state.locations).toHaveLength(2);
    });

    it('should not add duplicate locations', () => {
      const location = createMockLocation('1', 'New York');

      useLocationStore.getState().addLocation(location);
      useLocationStore.getState().addLocation(location);

      const state = useLocationStore.getState();
      expect(state.locations).toHaveLength(1);
    });
  });

  describe('removeLocation', () => {
    it('should remove a location', () => {
      const loc1 = createMockLocation('1', 'New York');
      const loc2 = createMockLocation('2', 'Los Angeles');

      useLocationStore.getState().addLocation(loc1);
      useLocationStore.getState().addLocation(loc2);
      useLocationStore.getState().removeLocation('1');

      const state = useLocationStore.getState();
      expect(state.locations).toHaveLength(1);
      expect(state.locations[0].id).toBe('2');
    });

    it('should update active location when removing active location', () => {
      const loc1 = createMockLocation('1', 'New York');
      const loc2 = createMockLocation('2', 'Los Angeles');

      useLocationStore.getState().addLocation(loc1);
      useLocationStore.getState().addLocation(loc2);
      useLocationStore.getState().removeLocation('1');

      const state = useLocationStore.getState();
      expect(state.activeLocationId).toBe('2');
    });

    it('should set activeLocationId to null when removing last location', () => {
      const location = createMockLocation('1', 'New York');

      useLocationStore.getState().addLocation(location);
      useLocationStore.getState().removeLocation('1');

      const state = useLocationStore.getState();
      expect(state.locations).toHaveLength(0);
      expect(state.activeLocationId).toBeNull();
    });

    it('should not change active location when removing non-active location', () => {
      const loc1 = createMockLocation('1', 'New York');
      const loc2 = createMockLocation('2', 'Los Angeles');

      useLocationStore.getState().addLocation(loc1);
      useLocationStore.getState().addLocation(loc2);
      useLocationStore.getState().removeLocation('2');

      const state = useLocationStore.getState();
      expect(state.activeLocationId).toBe('1');
    });
  });

  describe('setActiveLocation', () => {
    it('should set active location', () => {
      const loc1 = createMockLocation('1', 'New York');
      const loc2 = createMockLocation('2', 'Los Angeles');

      useLocationStore.getState().addLocation(loc1);
      useLocationStore.getState().addLocation(loc2);
      useLocationStore.getState().setActiveLocation('2');

      const state = useLocationStore.getState();
      expect(state.activeLocationId).toBe('2');
    });
  });

  describe('updateLocation', () => {
    it('should update location properties', () => {
      const location = createMockLocation('1', 'New York');

      useLocationStore.getState().addLocation(location);
      useLocationStore.getState().updateLocation('1', { name: 'NYC' });

      const state = useLocationStore.getState();
      expect(state.locations[0].name).toBe('NYC');
      expect(state.locations[0].id).toBe('1');
    });

    it('should not affect other locations', () => {
      const loc1 = createMockLocation('1', 'New York');
      const loc2 = createMockLocation('2', 'Los Angeles');

      useLocationStore.getState().addLocation(loc1);
      useLocationStore.getState().addLocation(loc2);
      useLocationStore.getState().updateLocation('1', { name: 'NYC' });

      const state = useLocationStore.getState();
      expect(state.locations[1].name).toBe('Los Angeles');
    });
  });

  describe('reorderLocations', () => {
    it('should reorder locations', () => {
      const loc1 = createMockLocation('1', 'New York');
      const loc2 = createMockLocation('2', 'Los Angeles');
      const loc3 = createMockLocation('3', 'Chicago');

      useLocationStore.getState().addLocation(loc1);
      useLocationStore.getState().addLocation(loc2);
      useLocationStore.getState().addLocation(loc3);
      useLocationStore.getState().reorderLocations(0, 2);

      const state = useLocationStore.getState();
      expect(state.locations[0].id).toBe('2');
      expect(state.locations[1].id).toBe('3');
      expect(state.locations[2].id).toBe('1');
    });
  });

  describe('getActiveLocation', () => {
    it('should return active location', () => {
      const location = createMockLocation('1', 'New York');

      useLocationStore.getState().addLocation(location);

      const activeLocation = useLocationStore.getState().getActiveLocation();
      expect(activeLocation).toEqual(location);
    });

    it('should return null when no active location', () => {
      const activeLocation = useLocationStore.getState().getActiveLocation();
      expect(activeLocation).toBeNull();
    });

    it('should return null when active location id does not exist', () => {
      useLocationStore.setState({ activeLocationId: 'nonexistent' });

      const activeLocation = useLocationStore.getState().getActiveLocation();
      expect(activeLocation).toBeNull();
    });
  });
});
