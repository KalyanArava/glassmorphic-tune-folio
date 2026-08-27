import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";
import type { Song } from "@/data/playlist";
import { AlbumArt } from "./AlbumArt";

type Props = {
  song: Song;
  nowPlaying?: string;
  playing: boolean;
  progress: number;
  durationSec?: number;
  volume: number;
  onToggle: () => void;
  onNext: () => void;
  onPrev: () => void;
  onVolume: (v: number) => void;
};

function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function MusicPlayer({
  song,
  nowPlaying,
  playing,
  durationSec,
  progress,
  volume,
  onToggle,
  onNext,
  onPrev,
  onVolume,
}: Props) {
  const total = durationSec && durationSec > 0 ? durationSec : song.seconds;
  const pct = Math.min(100, (progress / total) * 100);
  return (
    <div className="animate-rise rounded-[18px] border border-poster-fg/20 bg-poster-shade/45 p-3 shadow-glass backdrop-blur-2xl">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <AlbumArt song={song} className="h-10 w-10" />
          <div className="min-w-0">
            <p className="truncate font-serif text-[0.88rem] text-poster-fg">{nowPlaying || song.title}</p>
            <p className="truncate text-[0.66rem] text-poster-fg/55">{song.artist}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3 text-poster-fg">
          <button type="button" onClick={onPrev} aria-label="Previous">
            <SkipBack className="h-4 w-4 fill-current" />
          </button>
          <button
            type="button"
            onClick={onToggle}
            aria-label={playing ? "Pause" : "Play"}
            className="grid h-9 w-9 place-items-center rounded-full bg-poster-fg/92 text-poster-shade transition-transform duration-300 hover:scale-105"
          >
            {playing ? (
              <Pause className="h-4 w-4 fill-current" />
            ) : (
              <Play className="h-4 w-4 fill-current" />
            )}
          </button>
          <button type="button" onClick={onNext} aria-label="Next">
            <SkipForward className="h-4 w-4 fill-current" />
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <span className="text-[0.6rem] tabular-nums text-poster-fg/55">{fmt(progress)}</span>
        <span className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-poster-fg/20">
          <span
            className="absolute inset-y-0 left-0 rounded-full bg-yt-red transition-[width] duration-500 ease-linear"
            style={{ width: `${pct}%` }}
          />
        </span>
        <span className="text-[0.6rem] tabular-nums text-poster-fg/55">{fmt(total)}</span>
        <Volume2 className="ml-1 h-3.5 w-3.5 shrink-0 text-poster-fg/70" />
        <input
          type="range"
          min={0}
          max={100}
          value={volume}
          aria-label="Volume"
          onChange={(e) => onVolume(Number(e.target.value))}
          className="h-[3px] w-14 shrink-0 cursor-pointer appearance-none rounded-full bg-poster-fg/20 accent-poster-fg"
        />
      </div>
    </div>
  );
}
