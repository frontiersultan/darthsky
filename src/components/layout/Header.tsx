import { MapPin, ChevronDown, RefreshCw } from 'lucide-react';
import { useLocationStore, useUIStore } from '../../stores';

interface HeaderProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function Header({ onRefresh, isRefreshing }: HeaderProps) {
  const activeLocation = useLocationStore((s) => s.getActiveLocation());
  const openLocationSearch = useUIStore((s) => s.openLocationSearch);

  return (
    <header className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between px-4 py-3 pt-safe-top">
        <button
          onClick={openLocationSearch}
          className="flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg px-2 py-1 -ml-2 transition-colors"
        >
          <MapPin size={18} className="text-sky-500" />
          <span className="font-medium text-slate-900 dark:text-slate-100">
            {activeLocation?.name || 'Select Location'}
          </span>
          <ChevronDown size={16} className="text-slate-400" />
        </button>

        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50"
            aria-label="Refresh weather data"
          >
            <RefreshCw
              size={20}
              className={`text-slate-500 ${isRefreshing ? 'animate-spin' : ''}`}
            />
          </button>
        )}
      </div>
    </header>
  );
}
