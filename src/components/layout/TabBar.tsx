import { Cloud, Map, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const tabs = [
  { id: 'weather', path: '/', icon: Cloud, label: 'Weather' },
  { id: 'map', path: '/map', icon: Map, label: 'Map' },
  { id: 'settings', path: '/settings', icon: Settings, label: 'Settings' },
] as const;

export function TabBar() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-t border-slate-200 dark:border-slate-700 pb-safe">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive =
            tab.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(tab.path);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.id}
              to={tab.path}
              className={`
                flex flex-col items-center justify-center py-3 px-6 min-w-[80px] min-h-[56px]
                transition-colors duration-150 active:opacity-70
                ${
                  isActive
                    ? 'text-sky-500'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                }
              `}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon size={24} strokeWidth={isActive ? 2 : 1.5} />
              <span className="text-xs mt-1.5 font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
