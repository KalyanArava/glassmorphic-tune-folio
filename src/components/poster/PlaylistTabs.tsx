import type { Playlist } from "@/data/playlist";

type Props = {
  playlists: Playlist[];
  activeKey: Playlist["key"];
  onSelect: (key: Playlist["key"]) => void;
};

export function PlaylistTabs({ playlists, activeKey, onSelect }: Props) {
  return (
    <div
      role="tablist"
      aria-label="Playlists"
      className="mt-6 inline-flex gap-1 rounded-full border border-poster-fg/20 bg-poster-shade/45 p-1 shadow-glass backdrop-blur-2xl"
    >
      {playlists.map((p) => (
        <button
          key={p.key}
          type="button"
          role="tab"
          aria-selected={p.key === activeKey}
          onClick={() => onSelect(p.key)}
          className={`rounded-full px-4 py-1.5 text-[0.72rem] font-medium tracking-wide transition-colors duration-300 ${
            p.key === activeKey
              ? "bg-poster-fg/92 text-poster-shade"
              : "text-poster-fg/70 hover:text-poster-fg"
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
