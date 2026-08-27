import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
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
  const [order, setOrder] = useState(current.songs);
  const [activeId, setActiveId] = useState<number | null>(1);
  const [volume, setVolume] = useState(70);

  const yt = useYouTubePlayer("yt-audio-host");
  const { state, loadPlaylist, playAt, toggle, next, prev, setVolume: setYtVolume } = yt;

  // Load the active playlist into the YouTube player.
  useEffect(() => {
    if (!state.ready) return;
    loadPlaylist(current.listId, 0, false);
  }, [state.ready, current.listId, loadPlaylist]);

  useEffect(() => {
    if (state.ready) setYtVolume(volume);
  }, [state.ready, volume, setYtVolume]);

  // Keep the highlighted row in sync with whatever YouTube is playing.
  useEffect(() => {
    const song = order[state.index];
    if (song) setActiveId(song.id);
  }, [state.index, order]);

  const active = useMemo(() => order.find((s) => s.id === activeId) ?? null, [order, activeId]);

  const select = (id: number) => {
    const idx = order.findIndex((s) => s.id === id);
    if (idx < 0) return;
    setActiveId(id);
    playAt(idx);
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

      <div className="relative mx-auto flex min-h-screen w-full max-w-[430px] flex-col px-5 pb-40 pt-6 sm:max-w-[560px] lg:max-w-[1100px] lg:px-14">
        <div className="w-[84%] min-w-[290px] sm:w-[70%] lg:w-full lg:max-w-[520px]">
          <YouTubeHeader />
          <PlaylistTabs
            playlists={playlists}
            activeKey={tab}
            onSelect={(key) => {
              const nextList = playlists.find((p) => p.key === key);
              if (!nextList) return;
              setTab(key);
              setOrder(nextList.songs);
              setActiveId(nextList.songs[0]?.id ?? null);
              loadPlaylist(nextList.listId, 0, false);
            }}
          />
          <PlaylistHero
            playlist={current}
            onPlayAll={() => {
              loadPlaylist(current.listId, 0, true);
            }}
            onShuffle={() => {
              const i = Math.floor(Math.random() * order.length);
              loadPlaylist(current.listId, i, true);
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
          <div className="mx-auto w-full max-w-[380px] sm:max-w-[430px] lg:mx-0 lg:ml-14 lg:max-w-[520px]">
            <MusicPlayer
              song={active}
              nowPlaying={state.videoTitle}
              playing={state.playing}
              progress={state.current}
              durationSec={state.duration}
              volume={volume}
              onToggle={toggle}
              onNext={next}
              onPrev={prev}
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
