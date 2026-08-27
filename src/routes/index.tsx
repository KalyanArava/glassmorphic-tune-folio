import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import person from "@/assets/person.jpg.asset.json";
import { songs as baseSongs } from "@/data/playlist";
import { YouTubeHeader } from "@/components/poster/YouTubeHeader";
import { PlaylistHero } from "@/components/poster/PlaylistHero";
import { PlaylistGlassPanel } from "@/components/poster/PlaylistGlassPanel";
import { MusicPlayer } from "@/components/poster/MusicPlayer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nadaanian Vibes Only — Kalyan Arava's Playlist" },
      {
        name: "description",
        content:
          "A cinematic Telugu music playlist poster: 15 songs full of feelings, memories and the songs that stay.",
      },
      { property: "og:title", content: "Nadaanian Vibes Only — Kalyan Arava's Playlist" },
      {
        property: "og:description",
        content: "A cinematic Telugu playlist of 15 songs full of feelings and memories.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [order, setOrder] = useState(baseSongs);
  const [activeId, setActiveId] = useState<number | null>(1);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(70);

  const active = useMemo(() => order.find((s) => s.id === activeId) ?? null, [order, activeId]);

  const step = (dir: 1 | -1) => {
    if (!active) return;
    const i = order.findIndex((s) => s.id === active.id);
    const next = order[(i + dir + order.length) % order.length];
    if (next) {
      setActiveId(next.id);
      setProgress(0);
      setPlaying(true);
    }
  };

  useEffect(() => {
    if (!playing || !active) return;
    const t = setInterval(() => {
      setProgress((p) => {
        if (p + 1 >= active.seconds) {
          step(1);
          return 0;
        }
        return p + 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [playing, active, order]);

  const select = (id: number) => {
    setActiveId(id);
    setProgress(0);
    setPlaying(true);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-poster-shade font-sans text-poster-fg">
      {/* Photograph */}
      <div className="pointer-events-none fixed inset-0">
        <img
          src={person.url}
          alt="Kalyan Arava standing on a street at dusk"
          className="absolute inset-y-0 right-0 h-full w-[66%] object-cover object-center sm:w-[60%] lg:w-[50%]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,oklch(0.11_0.01_260)_0%,oklch(0.11_0.01_260)_30%,oklch(0.11_0.01_260/0.72)_48%,oklch(0.11_0.01_260/0.25)_70%,transparent_92%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_85%_at_50%_50%,transparent_45%,oklch(0_0_0/0.6)_100%)]" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-[430px] flex-col px-5 pb-28 pt-6 sm:max-w-[560px] lg:max-w-[1100px] lg:px-14">
        <div className="w-[84%] min-w-[290px] sm:w-[70%] lg:w-full lg:max-w-[520px]">
          <YouTubeHeader />
          <PlaylistHero
            onPlayAll={() => {
              const first = order[0];
              if (first) select(first.id);
            }}
            onShuffle={() => {
              const shuffled = [...order].sort(() => Math.random() - 0.5);
              setOrder(shuffled);
              const first = shuffled[0];
              if (first) select(first.id);
            }}
          />
          <PlaylistGlassPanel
            order={order}
            activeId={activeId}
            playing={playing}
            onSelect={select}
          />
        </div>
      </div>

      {active && (
        <div className="fixed inset-x-0 bottom-0 z-10 px-4 pb-4">
          <div className="mx-auto w-full max-w-[380px] sm:max-w-[430px] lg:mx-0 lg:ml-14 lg:max-w-[520px]">
            <MusicPlayer
              song={active}
              playing={playing}
              progress={progress}
              volume={volume}
              onToggle={() => setPlaying((p) => !p)}
              onNext={() => step(1)}
              onPrev={() => step(-1)}
              onVolume={setVolume}
            />
          </div>
        </div>
      )}
    </main>
  );
}
