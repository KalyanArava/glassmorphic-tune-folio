import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Song } from "@/data/playlist";
import { AmbientArtwork } from "@/components/poster/AmbientArtwork";

type Props = {
  songs: Song[];
  activeId: string | null;
  playing: boolean;
  activeArtwork: string | undefined;
  onPlay: (id: string) => void;
};

const mod = (n: number, m: number) => ((n % m) + m) % m;

/** Cinematic 3D glass carousel of the tracks in the displayed playlist. */
export function GlassCarousel({ songs, activeId, activeArtwork, playing, onPlay }: Props) {
  const len = songs.length;
  const [center, setCenter] = useState(0);
  const [drag, setDrag] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [range, setRange] = useState(3);
  const [reduced, setReduced] = useState(false);
  const start = useRef<{ x: number; y: number; time: number; moved: boolean; dx: number } | null>(null);
  const frame = useRef<number | null>(null);
  const suppressClick = useRef(false);
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
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      mq.removeEventListener("change", upd);
      sm.removeEventListener("change", upd);
    };
  }, []);

  // Follow the playing song when it belongs to this playlist; reset on playlist change.
  useEffect(() => {
    const i = songs.findIndex((s) => s.id === activeId);
    setCenter(i >= 0 ? i : 0);
    setDrag(0);
    start.current = null;
  }, [songs, activeId]);

  if (!len) {
    return (
      <p className="mt-6 text-center text-xs text-poster-fg/50">No tracks in this playlist yet.</p>
    );
  }

  const go = (d: number) => setCenter((c) => mod(c + d, len));
  const spacing = range === 1 ? 150 : 175;

  const onDown = (e: React.PointerEvent) => {
    if (!e.isPrimary || e.button !== 0) return;
    suppressClick.current = false;
    start.current = { x: e.clientX, y: e.clientY, time: performance.now(), moved: false, dx: 0 };
  };
  const onMove = (e: React.PointerEvent) => {
    if (start.current) {
      const dx = e.clientX - start.current.x;
      if (!start.current.moved && Math.abs(e.clientY - start.current.y) > Math.abs(dx) + 6) {
        start.current = null;
        return;
      }
      if (Math.abs(dx) > 6 && !start.current.moved) {
        start.current.moved = true;
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      }
      start.current.dx = dx;
      if (frame.current === null) frame.current = requestAnimationFrame(() => {
        frame.current = null;
        setDrag(start.current?.dx ?? 0);
      });
    } else if (e.pointerType === "mouse" && !reduced && rootRef.current) {
      const r = rootRef.current.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      const y = ((e.clientY - r.top) / r.height - 0.5) * 2;
      if (frame.current === null) frame.current = requestAnimationFrame(() => {
        frame.current = null;
        setTilt({ x, y });
      });
    }
  };
  const onUp = (e: React.PointerEvent) => {
    if (!start.current) return;
    const gesture = start.current;
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
    suppressClick.current = gesture.moved;
    const velocity = gesture.dx / Math.max(1, performance.now() - gesture.time);
    const projected = gesture.dx + velocity * 100;
    const steps = Math.max(-2, Math.min(2, Math.round(-projected / spacing)));
    if (e.type !== "pointercancel" && steps) go(steps);
    setDrag(0);
    start.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const offsetFloat = drag / spacing;
  const cards: { song: Song; idx: number; off: number }[] = [];
  const shown = Math.min(range + 1, Math.floor((len - 1) / 2));
  for (let o = -shown; o <= (len === 2 ? 1 : shown); o++) {
    const idx = mod(center + o, len);
    const song = songs[idx];
    if (song) cards.push({ song, idx, off: o });
  }
  const current = songs[mod(center, len)];
  if (!current) return null;

  return (
    <section
      ref={rootRef}
      aria-roledescription="carousel"
      aria-label="Tracks carousel"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return;
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
        <AmbientArtwork artwork={activeArtwork} playing={playing} />
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
              <Button
                key={song.id}
                variant="glassCard"
                type="button"
                tabIndex={-1}
                aria-label={`${isCenter ? "Play" : "Show"} ${song.title} by ${song.artist}`}
                aria-current={isCenter ? "true" : undefined}
                onClick={() => {
                  if (suppressClick.current) { suppressClick.current = false; return; }
                  if (isCenter) onPlay(song.id);
                  else setCenter(idx);
                }}
                className="group pointer-events-auto absolute left-1/2 top-1/2 -ml-[84px] -mt-[112px] block h-auto w-[168px] overflow-hidden whitespace-normal rounded-[18px] p-2 text-left sm:-ml-[90px] sm:w-[180px]"
                style={{
                  transform: `translateX(${p * spacing}px) translateZ(${-a * 120}px) rotateY(${-Math.max(-1, Math.min(1, p)) * 28}deg) scale(${scale})`,
                  zIndex: 10 - Math.round(a),
                  opacity: Math.max(0, 1 - a / (range + 1)),
                  pointerEvents: a > range + 0.5 ? "none" : "auto",
                  transition: drag || reduced ? "none" : "transform 650ms cubic-bezier(.22,1,.36,1), opacity 450ms ease, border-color 250ms ease",
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
                    <span className="pointer-events-none absolute inset-0 grid place-items-center bg-gradient-to-br from-poster-fg/15 via-transparent to-transparent">
                      <span className="grid h-10 w-10 place-items-center rounded-full border border-poster-fg/40 bg-poster-shade/45 text-poster-fg opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none"><Play aria-hidden className="ml-0.5 h-4 w-4" /></span>
                    </span>
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
              </Button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between px-2 pb-1">
        <Button
          variant="glass"
          size="icon"
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous track in carousel"
          title="Previous track"
          className="h-9 w-9 rounded-full transition-[background-color,border-color,transform] duration-200 active:scale-95 motion-reduce:transition-none"
        >
          <ChevronLeft aria-hidden />
        </Button>
        <p className="text-[0.56rem] uppercase tracking-[0.24em] text-poster-fg/45" aria-live="polite">
          <span className="sr-only">{current.title}. </span>
          {mod(center, len) + 1} / {len}
        </p>
        <Button
          variant="glass"
          size="icon"
          type="button"
          onClick={() => go(1)}
          aria-label="Next track in carousel"
          title="Next track"
          className="h-9 w-9 rounded-full transition-[background-color,border-color,transform] duration-200 active:scale-95 motion-reduce:transition-none"
        >
          <ChevronRight aria-hidden />
        </Button>
      </div>
    </section>
  );
}
