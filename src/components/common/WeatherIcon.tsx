import {
  Sun,
  Moon,
  Cloud,
  CloudSun,
  CloudMoon,
  CloudRain,
  CloudDrizzle,
  CloudSnow,
  CloudLightning,
  CloudFog,
  Wind,
  type LucideProps,
} from 'lucide-react';
import type { WeatherIcon as WeatherIconType } from '../../types';

interface WeatherIconProps extends LucideProps {
  icon: WeatherIconType;
}

const iconMap: Record<WeatherIconType, React.ComponentType<LucideProps>> = {
  'clear-day': Sun,
  'clear-night': Moon,
  'partly-cloudy-day': CloudSun,
  'partly-cloudy-night': CloudMoon,
  cloudy: Cloud,
  fog: CloudFog,
  drizzle: CloudDrizzle,
  rain: CloudRain,
  sleet: CloudSnow,
  snow: CloudSnow,
  thunderstorm: CloudLightning,
  wind: Wind,
};

const iconColors: Record<WeatherIconType, string> = {
  'clear-day': 'text-amber-400',
  'clear-night': 'text-indigo-400',
  'partly-cloudy-day': 'text-amber-400',
  'partly-cloudy-night': 'text-indigo-300',
  cloudy: 'text-slate-400',
  fog: 'text-slate-400',
  drizzle: 'text-sky-400',
  rain: 'text-blue-500',
  sleet: 'text-cyan-400',
  snow: 'text-cyan-200',
  thunderstorm: 'text-indigo-500',
  wind: 'text-slate-400',
};

export function WeatherIcon({
  icon,
  className = '',
  size = 24,
  ...props
}: WeatherIconProps) {
  const IconComponent = iconMap[icon] || Cloud;
  const colorClass = iconColors[icon] || 'text-slate-400';

  return (
    <IconComponent
      className={`${colorClass} ${className}`}
      size={size}
      {...props}
    />
  );
}
