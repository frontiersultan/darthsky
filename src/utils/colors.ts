export function getTemperatureColor(tempCelsius: number): string {
  if (tempCelsius <= 0) return '#818cf8'; // freezing - indigo
  if (tempCelsius <= 10) return '#60a5fa'; // cold - blue
  if (tempCelsius <= 18) return '#34d399'; // cool - emerald
  if (tempCelsius <= 25) return '#fbbf24'; // mild - amber
  if (tempCelsius <= 32) return '#fb923c'; // warm - orange
  return '#ef4444'; // hot - red
}

export function getTemperatureGradient(
  minTemp: number,
  maxTemp: number
): string {
  const minColor = getTemperatureColor(minTemp);
  const maxColor = getTemperatureColor(maxTemp);
  return `linear-gradient(to right, ${minColor}, ${maxColor})`;
}

export function getPrecipitationColor(probability: number): string {
  if (probability === 0) return 'transparent';
  if (probability < 30) return 'rgba(59, 130, 246, 0.3)';
  if (probability < 60) return 'rgba(59, 130, 246, 0.6)';
  return 'rgba(59, 130, 246, 0.9)';
}

export function getUVIndexColor(uvIndex: number): string {
  if (uvIndex <= 2) return '#22c55e'; // low - green
  if (uvIndex <= 5) return '#eab308'; // moderate - yellow
  if (uvIndex <= 7) return '#f97316'; // high - orange
  if (uvIndex <= 10) return '#ef4444'; // very high - red
  return '#9333ea'; // extreme - purple
}

export function getUVIndexLevel(uvIndex: number): string {
  if (uvIndex <= 2) return 'Low';
  if (uvIndex <= 5) return 'Moderate';
  if (uvIndex <= 7) return 'High';
  if (uvIndex <= 10) return 'Very High';
  return 'Extreme';
}

export function getAQIColor(aqi: number): string {
  if (aqi <= 50) return '#22c55e'; // good - green
  if (aqi <= 100) return '#eab308'; // moderate - yellow
  if (aqi <= 150) return '#f97316'; // unhealthy sensitive - orange
  if (aqi <= 200) return '#ef4444'; // unhealthy - red
  if (aqi <= 300) return '#9333ea'; // very unhealthy - purple
  return '#7f1d1d'; // hazardous - dark red
}

export function getAlertSeverityColor(
  severity: 'minor' | 'moderate' | 'severe' | 'extreme'
): string {
  switch (severity) {
    case 'minor':
      return '#3b82f6'; // blue
    case 'moderate':
      return '#eab308'; // yellow
    case 'severe':
      return '#f97316'; // orange
    case 'extreme':
      return '#ef4444'; // red
    default:
      return '#6b7280'; // gray
  }
}

export function getWindSpeedColor(speedKmh: number): string {
  if (speedKmh < 12) return '#22c55e'; // calm - green
  if (speedKmh < 30) return '#3b82f6'; // light - blue
  if (speedKmh < 50) return '#eab308'; // moderate - yellow
  if (speedKmh < 75) return '#f97316'; // strong - orange
  return '#ef4444'; // severe - red
}

export function getHumidityColor(humidity: number): string {
  if (humidity < 30) return '#f97316'; // dry - orange
  if (humidity < 60) return '#22c55e'; // comfortable - green
  if (humidity < 80) return '#3b82f6'; // humid - blue
  return '#6366f1'; // very humid - indigo
}
