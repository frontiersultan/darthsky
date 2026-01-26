import { WeatherMap } from '../components/map';

export function MapPage() {
  return (
    <div className="h-screen-safe flex flex-col bg-slate-900">
      <div className="flex-1 pt-safe pb-tab-bar overflow-hidden">
        <WeatherMap />
      </div>
    </div>
  );
}
