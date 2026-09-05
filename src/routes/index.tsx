import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import personMobile from "@/assets/person-mobile-2.png.asset.json";
import personDesktop from "@/assets/person-desktop.png.asset.json";
import { playlists, type Playlist } from "@/data/playlist";
import { site } from "@/data/site";
import { YouTubeHeader } from "@/components/poster/YouTubeHeader";
import { PlaylistHero } from "@/components/poster/PlaylistHero";
import { PlaylistTabs } from "@/components/poster/PlaylistTabs";
import { PlaylistGlassPanel } from "@/components/poster/PlaylistGlassPanel";
import { MusicPlayer } from "@/components/poster/MusicPlayer";
import { useYouTubePlayer } from "@/hooks/useYouTubePlayer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: site.seo.title },
      { name: "description", content: site.seo.description },
      { property: "og:title", content: site.seo.title },
      { property: "og:description", content: site.seo.description },
      { property: "og:type", content: "music.playlist" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [tab, setTab] = useState<Playlist["key"]>("telugu");
  const current = playlists.find((p) => p.key === tab) ?? playlists[0]!;
  const order = current.songs;
  const [activeId, setActiveId] = useState<string | null>(order[0]?.id ?? null);
  const [volume, setVolume] = useState(70);

  // The song that is actually loaded/playing — it can belong to any playlist,
  // so browsing another language never interrupts playback.
  const active = useMemo(
    () => playlists.flatMap((p) => p.songs).find((s) => s.id === activeId) ?? null,
    [activeId],
  );
  // Songs of the playlist the *playing* song belongs to (used by next/prev).
  const activeList = useMemo(
    () => (active ? (playlists.find((p) => p.id === active.playlistId)?.songs ?? order) : order),
    [active, order],
  );

  const activeIdRef = useRef<string | null>(activeId);
  activeIdRef.current = activeId;
  const orderRef = useRef(activeList);
  orderRef.current = activeList;

  const stepRef = useRef<(dir: 1 | -1, autoplay: boolean) => void>(() => {});

  const yt = useYouTubePlayer("yt-audio-host", {
    onEnded: () => stepRef.current(1, true),
    onUnavailable: () => stepRef.current(1, true),
  });
  const { state, loadVideo, toggle, setVolume: setYtVolume } = yt;

  // Tracks the song id already handed to the player, so a user-initiated play
  // isn't immediately re-cued (paused) by the mount effect below.
  const loadedIdRef = useRef<string | null>(null);

  // Cue the active song on first load only (never autoplay, never on tab change).
  useEffect(() => {
    if (!state.ready || !active) return;
    if (loadedIdRef.current === active.id) return;
    loadedIdRef.current = active.id;
    loadVideo(active.youtubeVideoId, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.ready, active?.id]);

  useEffect(() => {
    if (state.ready) setYtVolume(volume);
  }, [state.ready, volume, setYtVolume]);

  const playSong = (song: (typeof order)[number]) => {
    loadedIdRef.current = song.id;
    setActiveId(song.id);
    loadVideo(song.youtubeVideoId, true);
  };

  const step = (dir: 1 | -1, autoplay: boolean) => {
    const list = orderRef.current;
    const from = list.findIndex((s) => s.id === activeIdRef.current);
    for (let n = 1; n <= list.length; n++) {
      const song = list[(((from + dir * n) % list.length) + list.length) % list.length];
      if (!song) continue;
      loadedIdRef.current = song.id;
      setActiveId(song.id);
      loadVideo(song.youtubeVideoId, autoplay);
      return;
    }
  };
  stepRef.current = step;

  const select = (id: string) => {
    const song = order.find((s) => s.id === id);
    if (song) playSong(song);
  };


  return (
    <main className="relative min-h-screen overflow-hidden bg-poster-shade font-sans text-poster-fg">
      {/* Photograph — portrait shot on mobile, wide shot on desktop; both fully visible, no dark wash */}
      <div className="pointer-events-none fixed inset-0">
        <img
          src={personMobile.url}
          alt={site.owner.photoAlt}
          className="absolute inset-0 h-full w-full object-cover object-[center_20%] md:hidden"
        />
        <img
          src={personDesktop.url}
          alt={site.owner.photoAlt}
          className="absolute inset-0 hidden h-full w-full object-cover object-center md:block"
        />
        {/* Very light tint behind the text column only, so the whole photo stays visible */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,oklch(0.35_0.05_265/0.28)_0%,oklch(0.4_0.05_265/0.12)_32%,transparent_55%)]" />
      </div>

      <div className="relative mx-0 flex min-h-screen w-full max-w-none flex-col px-5 pb-40 pt-6 sm:px-8 lg:px-10 xl:px-16">
        <div className="w-full min-w-0 sm:w-[72%] sm:max-w-[560px] lg:w-[52%] lg:max-w-[620px] lg:min-w-[460px]">
          <YouTubeHeader />
          <PlaylistTabs
            playlists={playlists}
            activeKey={tab}
            onSelect={(key) => {
              const nextList = playlists.find((p) => p.key === key);
              if (!nextList) return;
              loadedIdRef.current = null;
              yt.reset();
              setTab(key);
              setActiveId(nextList.songs[0]?.id ?? null);
            }}
          />
          <PlaylistHero
            playlist={current}
            onPlayAll={() => {
              const first = order[0];
              if (first) playSong(first);
            }}
            onShuffle={() => {
              const song = order[Math.floor(Math.random() * order.length)];
              if (song) playSong(song);
            }}
          />

          <PlaylistGlassPanel
            order={order}
            activeId={activeId}
            playing={state.playing}
            onSelect={select}
          />
        </div>
      </div>

      {/* Live YouTube video — small glass card, this is what produces the sound */}
      <div className="fixed bottom-[7.5rem] right-4 z-20 w-[168px] overflow-hidden rounded-[16px] border border-poster-fg/20 bg-poster-shade/50 p-1 shadow-glass backdrop-blur-2xl sm:w-[200px] lg:bottom-4 lg:right-6 lg:w-[240px]">
        <div className="aspect-video w-full overflow-hidden rounded-[12px] bg-black">
          <div id="yt-audio-host" className="h-full w-full" />
        </div>
      </div>

      {active && (
        <div className="fixed inset-x-0 bottom-0 z-10 px-4 pb-4">
          <div className="mx-0 w-full max-w-[430px] sm:ml-4 sm:max-w-[520px] lg:ml-6 lg:max-w-[620px] xl:ml-12">
            <MusicPlayer
              song={active}
              nowPlaying={state.videoTitle}
              playing={state.playing}
              progress={state.current}
              durationSec={state.duration}
              volume={volume}
              onToggle={toggle}
              onNext={() => step(1, true)}
              onPrev={() => step(-1, true)}

              onVolume={(v) => {
                setVolume(v);
                setYtVolume(v);
              }}
            />
          </div>
        </div>
      )}
    </main>
  );
}
