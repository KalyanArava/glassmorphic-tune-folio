import type { Song } from "@/data/playlist";

export function AlbumArt({ song, className = "" }: { song: Song; className?: string }) {
  return (
    <span
      className={`relative grid shrink-0 place-items-center overflow-hidden rounded-[5px] ring-1 ring-poster-fg/15 ${className}`}
      style={{
        backgroundImage: `linear-gradient(140deg, oklch(0.42 0.11 ${song.hue}), oklch(0.18 0.05 ${song.hue + 30}))`,
      }}
      aria-hidden
    >
      <img
        key={song.id}
        src={song.thumbnail}
        alt=""
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-poster-shade/40 to-poster-fg/10" />
    </span>
  );
}
