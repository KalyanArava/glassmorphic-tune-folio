import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import person from "@/assets/person.jpg.asset.json";
import { playlists, type Playlist } from "@/data/playlist";
import { YouTubeHeader } from "@/components/poster/YouTubeHeader";
import { PlaylistHero } from "@/components/poster/PlaylistHero";
import { PlaylistTabs } from "@/components/poster/PlaylistTabs";
import { PlaylistGlassPanel } from "@/components/poster/PlaylistGlassPanel";
import { MusicPlayer } from "@/components/poster/MusicPlayer";
import { useYouTubePlayer } from "@/hooks/useYouTubePlayer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nadaanian Vibes Only — Kalyan Arava's Playlist" },
      {
        name: "description",
        content:
          "A cinematic music playlist poster: Telugu, Hindi and 60s classics that play straight from YouTube.",
      },
      { property: "og:title", content: "Nadaanian Vibes Only — Kalyan Arava's Playlist" },
      {
        property: "og:description",
        content: "Telugu, Hindi and 60s golden-era playlists, playable right on the page.",
      },
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
  

  const activeIdRef = useRef<string | null>(activeId);
  activeIdRef.current = activeId;
  const orderRef = useRef(order);
  orderRef.current = order;

  const stepRef = useRef<(dir: 1 | -1, autoplay: boolean) => void>(() => {});

  const yt = useYouTubePlayer("yt-audio-host", {
    onEnded: () => stepRef.current(1, true),
    onUnavailable: () => stepRef.current(1, true),
  });
  const { state, loadVideo, toggle, setVolume: setYtVolume } = yt;

  const active = useMemo(() => order.find((s) => s.id === activeId) ?? null, [order, activeId]);

  // Tracks the song id already handed to the player, so a user-initiated play
  // isn't immediately re-cued (paused) by the mount/tab-change effect below.
  const loadedIdRef = useRef<string | null>(null);

  // Cue the active song (never autoplay on mount / tab change).
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
      {/* Photograph */}
      <div className="pointer-events-none fixed inset-0">
        {/* Blurred full-bleed backdrop so the left side feels natural, not a black block */}
        <img
          src={person.url}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full scale-110 object-cover object-center opacity-90 blur-[70px] saturate-125"
        />
        <img
          src={person.url}
          alt="Kalyan Arava standing on a street at dusk"
          className="absolute inset-y-0 right-0 h-full w-[72%] object-cover object-center [mask-image:linear-gradient(to_right,transparent_0%,black_18%)] sm:w-[66%] lg:w-[58%]"
        />
        {/* Soft, natural fade so the photo stays visible and the text stays readable */}
        <div className="absolute inset-0 bg-[linear-gradient(100deg,oklch(0.11_0.01_260/0.66)_0%,oklch(0.11_0.01_260/0.58)_30%,oklch(0.11_0.01_260/0.46)_52%,oklch(0.11_0.01_260/0.16)_74%,transparent_95%)]" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-[linear-gradient(to_top,oklch(0.11_0.01_260/0.75),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(130%_90%_at_55%_45%,transparent_55%,oklch(0_0_0/0.42)_100%)]" />
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
          <div className="mx-auto w-full max-w-[380px] sm:max-w-[430px] lg:mx-0 lg:ml-10 lg:max-w-[620px] xl:ml-16">
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
