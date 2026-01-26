import { Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../common';
import { formatRadarTime, type RadarFrame } from '../../services/radar';

interface TimeControlsProps {
  frames: RadarFrame[];
  currentIndex: number;
  isPlaying: boolean;
  onPlayPause: () => void;
  onFrameChange: (index: number) => void;
}

export function TimeControls({
  frames,
  currentIndex,
  isPlaying,
  onPlayPause,
  onFrameChange,
}: TimeControlsProps) {
  const currentFrame = frames[currentIndex];
  const timeLabel = currentFrame ? formatRadarTime(currentFrame.timestamp) : '';

  const handlePrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : frames.length - 1;
    onFrameChange(newIndex);
  };

  const handleNext = () => {
    const newIndex = currentIndex < frames.length - 1 ? currentIndex + 1 : 0;
    onFrameChange(newIndex);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 mt-3">
      <div className="flex items-center gap-2 sm:gap-3">
        <Button
          variant="ghost"
          size="md"
          onClick={handlePrevious}
          aria-label="Previous frame"
          className="min-touch shrink-0"
        >
          <ChevronLeft size={22} />
        </Button>

        <Button
          variant="primary"
          size="md"
          onClick={onPlayPause}
          className="px-5 min-touch shrink-0"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </Button>

        <Button
          variant="ghost"
          size="md"
          onClick={handleNext}
          aria-label="Next frame"
          className="min-touch shrink-0"
        >
          <ChevronRight size={22} />
        </Button>

        <div className="flex-1 mx-2 sm:mx-3">
          <input
            type="range"
            min={0}
            max={frames.length - 1}
            value={currentIndex}
            onChange={(e) => onFrameChange(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer touch-pan-x
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-6
              [&::-webkit-slider-thumb]:h-6
              [&::-webkit-slider-thumb]:bg-sky-500
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:cursor-pointer
              [&::-webkit-slider-thumb]:shadow-md
              [&::-webkit-slider-thumb]:active:scale-110
              [&::-moz-range-thumb]:w-6
              [&::-moz-range-thumb]:h-6
              [&::-moz-range-thumb]:bg-sky-500
              [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:cursor-pointer
              [&::-moz-range-thumb]:border-none"
          />
        </div>

        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 min-w-[60px] text-right shrink-0">
          {timeLabel}
        </span>
      </div>

      <div className="flex justify-between mt-3 px-1">
        <span className="text-xs text-slate-500">Past</span>
        <span className="text-xs text-slate-500">Now</span>
        <span className="text-xs text-slate-500">Forecast</span>
      </div>
    </div>
  );
}
