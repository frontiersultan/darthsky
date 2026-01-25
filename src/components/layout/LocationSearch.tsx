import { useState, useEffect, useRef } from 'react';
import { Search, X, MapPin, Navigation, Trash2, Star } from 'lucide-react';
import { Button } from '../common';
import { useLocationSearch, useLocationManager, useGeolocation } from '../../hooks';
import { useUIStore } from '../../stores';
import type { Location } from '../../types';

export function LocationSearch() {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const isOpen = useUIStore((s) => s.isLocationSearchOpen);
  const closeLocationSearch = useUIStore((s) => s.closeLocationSearch);

  const {
    locations,
    activeLocationId,
    handleSelectLocation,
    handleRemoveLocation,
    handleSwitchLocation,
  } = useLocationManager();

  const { data: searchResults, isLoading: isSearching } = useLocationSearch(query);
  const { requestLocation, isLoading: isGeolocating } = useGeolocation();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeLocationSearch();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeLocationSearch]);

  if (!isOpen) return null;

  const handleSelect = (location: Location) => {
    handleSelectLocation(location);
    closeLocationSearch();
  };

  const handleCurrentLocation = async () => {
    const location = await requestLocation();
    if (location) {
      closeLocationSearch();
    }
  };

  const handleSwitch = (id: string) => {
    handleSwitchLocation(id);
    closeLocationSearch();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="fixed inset-x-0 top-0 bg-white dark:bg-slate-900 rounded-b-2xl shadow-xl max-h-[80vh] overflow-hidden animate-slide-down">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for a city..."
                className="input pl-10 pr-10"
                autoComplete="off"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <Button variant="ghost" size="md" onClick={closeLocationSearch}>
              Cancel
            </Button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[60vh]">
          {!query && (
            <>
              <button
                onClick={handleCurrentLocation}
                disabled={isGeolocating}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-900 flex items-center justify-center">
                  <Navigation
                    size={20}
                    className={`text-sky-500 ${isGeolocating ? 'animate-pulse' : ''}`}
                  />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    Current Location
                  </p>
                  <p className="text-sm text-slate-500">Use GPS</p>
                </div>
              </button>

              {locations.length > 0 && (
                <div className="border-t border-slate-200 dark:border-slate-700">
                  <p className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Saved Locations
                  </p>
                  {locations.map((location) => (
                    <div
                      key={location.id}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <button
                        onClick={() => handleSwitch(location.id)}
                        className="flex-1 flex items-center gap-3 text-left"
                      >
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                          {location.isCurrentLocation ? (
                            <Navigation size={20} className="text-sky-500" />
                          ) : (
                            <MapPin size={20} className="text-slate-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 dark:text-slate-100 truncate">
                            {location.name}
                          </p>
                          <p className="text-sm text-slate-500 truncate">
                            {location.displayName}
                          </p>
                        </div>
                        {location.id === activeLocationId && (
                          <Star
                            size={16}
                            className="text-amber-500 fill-amber-500"
                          />
                        )}
                      </button>

                      {!location.isCurrentLocation && (
                        <button
                          onClick={() => handleRemoveLocation(location.id)}
                          className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                          aria-label={`Remove ${location.name}`}
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {query && (
            <div>
              {isSearching ? (
                <div className="p-8 text-center text-slate-500">
                  Searching...
                </div>
              ) : searchResults && searchResults.length > 0 ? (
                searchResults.map((location) => (
                  <button
                    key={location.id}
                    onClick={() => handleSelect(location)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <MapPin size={20} className="text-slate-400" />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p className="font-medium text-slate-900 dark:text-slate-100 truncate">
                        {location.name}
                      </p>
                      <p className="text-sm text-slate-500 truncate">
                        {location.displayName}
                      </p>
                    </div>
                  </button>
                ))
              ) : query.length >= 2 ? (
                <div className="p-8 text-center text-slate-500">
                  No locations found
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={closeLocationSearch}
        className="absolute inset-0 -z-10"
        aria-label="Close location search"
      />
    </div>
  );
}
