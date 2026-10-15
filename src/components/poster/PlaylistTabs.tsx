import type { Playlist } from "@/data/playlist";
import { Button } from "@/components/ui/button";

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
        <Button
          key={p.key}
          type="button"
          role="tab"
          aria-selected={p.key === activeKey}
          data-selected={p.key === activeKey}
          variant="playlistTab"
          onClick={() => onSelect(p.key)}
          className="h-8 rounded-full px-4 py-1.5 text-[0.72rem] font-medium transition-[background-color,color,box-shadow] duration-300 motion-reduce:transition-none"
        >
          {p.label}
        </Button>
      ))}
    </div>
  );
}
