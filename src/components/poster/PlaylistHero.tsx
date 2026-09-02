import avatar from "@/assets/avatar.jpg.asset.json";
import { Play, Shuffle, ExternalLink } from "lucide-react";
import type { Playlist } from "@/data/playlist";
import { site } from "@/data/site";

export function PlaylistHero({
  playlist,
  onPlayAll,
  onShuffle,
}: {
  playlist?: Playlist;
  onPlayAll: () => void;
  onShuffle: () => void;
}) {
  if (!playlist) return null;

  return (
    <section className="mt-7">
      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-yt-red">
        My Playlist
      </p>
      <h1 className="mt-2 font-serif text-[2.9rem] leading-[0.98] tracking-[-0.01em] text-poster-fg">
        {playlist.title}
        <span className="block text-yt-red">{playlist.accentLine}</span>
      </h1>
      <p className="mt-3 max-w-[19rem] text-[0.82rem] leading-relaxed text-poster-fg/65">
        {playlist.tagline}
      </p>

      <div className="mt-5 flex min-w-0 items-center gap-3">
        <img
          src={avatar.url}
          alt={site.owner.name}
          className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-poster-fg/25"
        />
        <span className="min-w-0">
          <span className="block truncate text-[0.9rem] text-poster-fg">{site.owner.name}</span>
          <span className="block truncate text-[0.68rem] text-poster-fg/55">
            {playlist.songs.length} songs • {site.owner.subtitleSuffix}
          </span>
        </span>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onPlayAll}
          className="inline-flex items-center gap-2 rounded-full bg-poster-fg/92 px-6 py-2.5 text-[0.9rem] font-medium text-poster-shade shadow-glass backdrop-blur-md transition-transform duration-300 hover:scale-[1.03]"
        >
          <Play className="h-4 w-4 fill-current" /> Play all
        </button>
        <button
          type="button"
          onClick={onShuffle}
          className="inline-flex items-center gap-2 rounded-full border border-poster-fg/20 bg-poster-shade/45 px-6 py-2.5 text-[0.9rem] font-medium text-poster-fg shadow-glass backdrop-blur-md transition-transform duration-300 hover:scale-[1.03]"
        >
          <Shuffle className="h-4 w-4" /> Shuffle
        </button>
        <a
          href={playlist.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-yt-red/50 bg-yt-red/15 px-5 py-2.5 text-[0.82rem] font-medium text-poster-fg shadow-glass backdrop-blur-md transition-transform duration-300 hover:scale-[1.03]"
        >
          <ExternalLink className="h-3.5 w-3.5" /> YouTube
        </a>
      </div>
    </section>
  );
}
