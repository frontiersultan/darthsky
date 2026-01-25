import { useRef, useEffect, useState, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useQuery } from '@tanstack/react-query';
import { TimeControls } from './TimeControls';
import { fetchRadarData, getAllFrames } from '../../services/radar';
import { useLocationStore } from '../../stores';
import { API_ENDPOINTS, MAP_CONFIG, CACHE_TIMES, QUERY_KEYS } from '../../constants';

export function WeatherMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const radarLayerId = 'radar-layer';
  const radarSourceId = 'radar-source';

  const activeLocation = useLocationStore((s) => s.getActiveLocation());

  const { data: radarData, isLoading: isRadarLoading } = useQuery({
    queryKey: QUERY_KEYS.radarTimestamps(),
    queryFn: fetchRadarData,
    staleTime: CACHE_TIMES.RADAR_TILES.staleTime,
    gcTime: CACHE_TIMES.RADAR_TILES.gcTime,
    refetchInterval: CACHE_TIMES.RADAR_TILES.staleTime,
  });

  const frames = radarData ? getAllFrames(radarData) : [];
  const totalFrames = frames.length;
  const currentFrame = frames[currentFrameIndex];

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          carto: {
            type: 'raster',
            tiles: [API_ENDPOINTS.CARTO_TILES],
            tileSize: 256,
            attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
          },
        },
        layers: [
          {
            id: 'carto-tiles',
            type: 'raster',
            source: 'carto',
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      },
      center: [
        activeLocation?.coordinates.longitude ?? MAP_CONFIG.defaultCenter.longitude,
        activeLocation?.coordinates.latitude ?? MAP_CONFIG.defaultCenter.latitude,
      ],
      zoom: MAP_CONFIG.defaultZoom,
      minZoom: MAP_CONFIG.minZoom,
      maxZoom: MAP_CONFIG.maxZoom,
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    if (activeLocation) {
      new maplibregl.Marker({ color: '#0ea5e9' })
        .setLngLat([
          activeLocation.coordinates.longitude,
          activeLocation.coordinates.latitude,
        ])
        .addTo(map.current);
    }

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    if (!map.current || !activeLocation) return;

    map.current.flyTo({
      center: [
        activeLocation.coordinates.longitude,
        activeLocation.coordinates.latitude,
      ],
      zoom: MAP_CONFIG.defaultZoom,
    });
  }, [activeLocation]);

  useEffect(() => {
    if (!map.current || !currentFrame) return;

    const mapInstance = map.current;

    if (mapInstance.getLayer(radarLayerId)) {
      mapInstance.removeLayer(radarLayerId);
    }
    if (mapInstance.getSource(radarSourceId)) {
      mapInstance.removeSource(radarSourceId);
    }

    mapInstance.addSource(radarSourceId, {
      type: 'raster',
      tiles: [currentFrame.tileUrl],
      tileSize: 256,
    });

    mapInstance.addLayer({
      id: radarLayerId,
      type: 'raster',
      source: radarSourceId,
      paint: {
        'raster-opacity': 0.7,
      },
    });
  }, [currentFrame]);

  useEffect(() => {
    if (!isPlaying || totalFrames === 0) return;

    const interval = setInterval(() => {
      setCurrentFrameIndex((prev) => (prev + 1) % totalFrames);
    }, 500);

    return () => clearInterval(interval);
  }, [isPlaying, totalFrames]);

  const handlePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const handleFrameChange = useCallback((index: number) => {
    setCurrentFrameIndex(index);
    setIsPlaying(false);
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div ref={mapContainer} className="flex-1 rounded-xl overflow-hidden" />

      {frames.length > 0 && (
        <TimeControls
          frames={frames}
          currentIndex={currentFrameIndex}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onFrameChange={handleFrameChange}
        />
      )}

      {isRadarLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl">
          <div className="bg-white dark:bg-slate-800 px-4 py-2 rounded-lg shadow-lg">
            Loading radar data...
          </div>
        </div>
      )}
    </div>
  );
}
