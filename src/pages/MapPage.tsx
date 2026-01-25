import { WeatherMap } from '../components/map';

export function MapPage() {
  return (
    <div className="h-screen flex flex-col bg-slate-900 pb-20">
      <div className="flex-1 p-4 pt-safe-top">
        <WeatherMap />
      </div>
    </div>
  );
}
