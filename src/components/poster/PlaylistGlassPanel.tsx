import type { Song } from "@/data/playlist";
import { site } from "@/data/site";
import { SongRow } from "./SongRow";

/** Row height (rem) used to turn `site.ui.visibleSongs` into a max height. */
const ROW_REM = 3.25;

type Props = {
  order: Song[];
  activeId: string | null;
  playing: boolean;
  onSelect: (id: string) => void;
};

export function PlaylistGlassPanel({ order, activeId, playing, onSelect }: Props) {
  return (
    <section className="mt-6 rounded-[20px] border border-poster-fg/20 bg-poster-shade/35 p-3 shadow-glass backdrop-blur-2xl">
      <div className="grid grid-cols-[1.6rem_2.1rem_minmax(0,1fr)_auto_1rem] items-center gap-2 border-b border-poster-fg/15 px-1.5 pb-2 text-[0.56rem] uppercase tracking-[0.22em] text-poster-fg/50">
        <span>#</span>
        <span />
        <span>Title</span>
        <span>Duration</span>
        <span />
      </div>
      <div
        style={{ maxHeight: `${site.ui.visibleSongs * ROW_REM}rem` }}
        className="mt-1 divide-y divide-poster-fg/8 overflow-y-auto pr-1 [scrollbar-color:oklch(1_0_0/0.25)_transparent] [scrollbar-width:thin]"
      >
        {order.map((song, i) => (
          <SongRow
            key={song.id}
            song={song}
            index={i}
            active={song.id === activeId}
            playing={playing}
            onSelect={() => onSelect(song.id)}
          />
        ))}
      </div>
      <p className="px-1.5 pb-1 pt-3 text-[0.62rem] text-poster-fg/45">
        {order.length} songs • curated by {site.owner.curatedBy}
      </p>
    </section>
  );
}
