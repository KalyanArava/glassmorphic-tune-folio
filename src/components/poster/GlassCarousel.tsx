import { useEffect, useRef, useState } from "react";
import type { Song } from "@/data/playlist";

type Props = {
  songs: Song[];
  activeId: string | null;
  playing: boolean;
  onPlay: (id: string) => void;
};

const mod = (n: number, m: number) => ((n % m) + m) % m;

/** Cinematic 3D glass carousel of the tracks in the displayed playlist. */
export function GlassCarousel({ songs, activeId, playing, onPlay }: Props) {
  const len = songs.length;
  const [center, setCenter] = useState(0);
  const [drag, setDrag] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [range, setRange] = useState(3);
  const [reduced, setReduced] = useState(false);
  const start = useRef<{ x: number; moved: boolean } | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sm = window.matchMedia("(max-width: 639px)");
    const upd = () => {
      setReduced(mq.matches);
      setRange(sm.matches ? 1 : 3);
    };
    upd();
    mq.addEventListener("change", upd);
    sm.addEventListener("change", upd);
    return () => {
      mq.removeEventListener("change", upd);
      sm.removeEventListener("change", upd);
    };
  }, []);

  // Follow the playing song when it belongs to this playlist; reset on playlist change.
  useEffect(() => {
    const i = songs.findIndex((s) => s.id === activeId);
    setCenter(i >= 0 ? i : 0);
  }, [songs, activeId]);

  if (!len) {
    return (
      <p className="mt-6 text-center text-xs text-poster-fg/50">No tracks in this playlist yet.</p>
    );
  }

  const go = (d: number) => setCenter((c) => mod(c + d, len));
  const spacing = range === 1 ? 150 : 175;

  const onDown = (e: React.PointerEvent) => {
    start.current = { x: e.clientX, moved: false };
  };
  const onMove = (e: React.PointerEvent) => {
    if (start.current) {
      const dx = e.clientX - start.current.x;
      if (Math.abs(dx) > 6 && !start.current.moved) {
        start.current.moved = true;
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      }
      setDrag(dx);
    } else if (e.pointerType === "mouse" && !reduced && rootRef.current) {
      const r = rootRef.current.getBoundingClientRect();
      setTilt({
        x: ((e.clientX - r.left) / r.width - 0.5) * 2,
        y: ((e.clientY - r.top) / r.height - 0.5) * 2,
      });
    }
  };
  const onUp = () => {
    if (!start.current) return;
    const steps = Math.round(-drag / spacing);
    if (steps) go(steps);
    setDrag(0);
    setTimeout(() => (start.current = null), 0);
  };

  const offsetFloat = drag / spacing;
  const cards: { song: Song; idx: number; off: number }[] = [];
  const shown = Math.min(range, Math.floor((len - 1) / 2));
  for (let o = -shown; o <= shown; o++) {
    const idx = mod(center + o, len);
    cards.push({ song: songs[idx]!, idx, off: o });
  }
  const current = songs[center]!;

  return (
    <section
      ref={rootRef}
      aria-roledescription="carousel"
      aria-label="Tracks carousel"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
        if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPlay(current.id); }
      }}
      onPointerLeave={() => setTilt({ x: 0, y: 0 })}
      className="relative mt-6 overflow-hidden rounded-[20px] outline-none focus-visible:ring-2 focus-visible:ring-poster-fg/40"
    >
      <div
        className="relative h-[275px] touch-pan-y select-none sm:h-[290px]"
        style={{ perspective: "1100px" }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateX(${-tilt.y * 3}deg) rotateY(${tilt.x * 4}deg)`,
            transition: reduced ? "none" : "transform 400ms cubic-bezier(.2,.8,.2,1)",
          }}
        >
          {cards.map(({ song, idx, off }) => {
            const p = off + offsetFloat;
            const a = Math.abs(p);
            const scale = Math.max(0.55, 1 - a * 0.14);
            const isCenter = off === 0;
            const isPlaying = song.id === activeId;
            return (
              <button
                key={song.id}
                type="button"
                tabIndex={-1}
                aria-label={`${isCenter ? "Play" : "Show"} ${song.title} by ${song.artist}`}
                aria-current={isCenter ? "true" : undefined}
                onClick={() => {
                  if (start.current?.moved) return;
                  if (isCenter) onPlay(song.id);
                  else setCenter(idx);
                }}
                className="pointer-events-auto absolute left-1/2 top-1/2 w-[168px] -ml-[84px] -mt-[112px] overflow-hidden rounded-[18px] border border-poster-fg/20 bg-poster-shade/40 p-2 text-left shadow-glass backdrop-blur-xl sm:w-[180px] sm:-ml-[90px]"
                style={{
                  transform: `translateX(${p * spacing}px) translateZ(${-a * 120}px) rotateY(${-Math.max(-1, Math.min(1, p)) * 28}deg) scale(${scale})`,
                  zIndex: 10 - Math.round(a),
                  opacity: Math.max(0, 1 - a * 0.28),
                  filter: isCenter ? "none" : `blur(${Math.min(a, 3) * 0.8}px) brightness(${1 - a * 0.12})`,
                  transition: drag || reduced ? "none" : "transform 550ms cubic-bezier(.2,.9,.25,1.05), opacity 400ms, filter 400ms",
                  willChange: "transform",
                }}
              >
                <div className="relative aspect-square w-full overflow-hidden rounded-[12px] bg-poster-shade">
                  <img
                    src={song.thumbnail}
                    alt=""
                    loading={a > 1 ? "lazy" : "eager"}
                    draggable={false}
                    className="h-full w-full object-cover"
                  />
                  {isCenter && (
                    <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-poster-fg/25 via-transparent to-transparent" />
                  )}
                  {isPlaying && (
                    <span className="absolute right-1.5 top-1.5 rounded-full bg-poster-shade/70 px-2 py-0.5 text-[0.55rem] uppercase tracking-[0.18em] text-poster-fg backdrop-blur-md">
                      {playing ? "Playing" : "Paused"}
                    </span>
                  )}
                </div>
                <div className="px-1 pb-0.5 pt-2" style={{ opacity: isCenter ? 1 : 0.6 }}>
                  <p className="truncate text-[0.78rem] font-semibold text-poster-fg">{song.title}</p>
                  <p className="truncate text-[0.62rem] text-poster-fg/60">
                    {song.artist} • {song.duration}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between px-2 pb-1">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous track in carousel"
          className="grid h-8 w-8 place-items-center rounded-full border border-poster-fg/20 bg-poster-shade/40 text-poster-fg backdrop-blur-md transition hover:bg-poster-shade/60"
        >
          ‹
        </button>
        <p className="text-[0.56rem] uppercase tracking-[0.24em] text-poster-fg/45" aria-live="polite">
          <span className="sr-only">{current.title}. </span>
          Swipe / Drag • Tap center to play
        </p>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next track in carousel"
          className="grid h-8 w-8 place-items-center rounded-full border border-poster-fg/20 bg-poster-shade/40 text-poster-fg backdrop-blur-md transition hover:bg-poster-shade/60"
        >
          ›
        </button>
      </div>
    </section>
  );
}
