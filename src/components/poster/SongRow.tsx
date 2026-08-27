import { MoreVertical } from "lucide-react";
import type { Song } from "@/data/playlist";
import { AlbumArt } from "./AlbumArt";

type Props = {
  song: Song;
  index: number;
  active: boolean;
  playing: boolean;
  onSelect: () => void;
};

export function SongRow({ song, index, active, playing, onSelect }: Props) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group grid w-full grid-cols-[1.6rem_2.1rem_minmax(0,1fr)_auto_1rem] items-center gap-2 rounded-[10px] px-1.5 py-[7px] text-left transition-colors duration-300 ${
        active ? "bg-poster-fg/12" : "hover:bg-poster-fg/7"
      }`}
    >
      <span className="text-[0.68rem] tabular-nums text-poster-fg/55">
        {String(index + 1).padStart(2, "0")}
      </span>
      <AlbumArt song={song} className="h-[2.1rem] w-[2.1rem]" />
      <span className="min-w-0">
        <span className="flex min-w-0 items-center gap-1.5">
          <span className="truncate font-serif text-[0.9rem] leading-tight text-poster-fg">
            {song.title}
          </span>
          {active && (
            <span className="flex shrink-0 items-end gap-[2px]" aria-hidden>
              {[0, 1, 2].map((b) => (
                <span
                  key={b}
                  className={`w-[2px] rounded-full bg-yt-red ${playing ? "animate-eq" : ""}`}
                  style={{ height: `${5 + b * 2}px`, animationDelay: `${b * 0.15}s` }}
                />
              ))}
            </span>
          )}
        </span>
        <span className="block truncate text-[0.68rem] text-poster-fg/55">{song.artist}</span>
      </span>
      <span className="text-[0.72rem] tabular-nums text-poster-fg/70">{song.duration}</span>
      <MoreVertical className="h-3.5 w-3.5 text-poster-fg/45" />
    </button>
  );
}
