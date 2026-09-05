import { useEffect, useMemo, useRef } from "react";
import { MicVocal } from "lucide-react";
import type { Song } from "@/data/playlist";
import { lyrics } from "@/data/lyrics";

type Props = {
  song: Song;
  /** Current playback position in seconds. */
  progress: number;
  /** Real duration from the player when known (falls back to song.seconds). */
  durationSec?: number;
};

/**
 * Lyrics card that scrolls in time with the music.
 * The scroll position is simply progress ÷ duration mapped onto the full
 * text height, so any pasted lyrics stay in rough sync without timestamps.
 */
export function LyricsPanel({ song, progress, durationSec }: Props) {
  const text = lyrics[song.youtubeVideoId];
  const lines = useMemo(() => (text ? text.split("\n") : []), [text]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const total = durationSec && durationSec > 0 ? durationSec : song.seconds;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const ratio = Math.min(1, Math.max(0, progress / total));
    const max = el.scrollHeight - el.clientHeight;
    el.scrollTo({ top: max * ratio, behavior: "smooth" });
  }, [progress, total]);

  if (!text) return null;

  // Rough "current line" highlight: line index follows the same ratio.
  const activeLine = Math.min(lines.length - 1, Math.floor((progress / total) * lines.length));

  return (
    <section className="mt-4 rounded-[20px] border border-poster-fg/20 bg-poster-shade/35 p-4 shadow-glass backdrop-blur-2xl">
      <div className="flex items-center gap-2 text-poster-fg/60">
        <MicVocal className="h-3.5 w-3.5" />
        <span className="text-[0.56rem] uppercase tracking-[0.22em]">Lyrics</span>
      </div>
      <div
        ref={scrollRef}
        className="mt-2 max-h-32 overflow-y-auto pr-1 [scrollbar-color:oklch(1_0_0/0.25)_transparent] [scrollbar-width:thin]"
      >
        {lines.map((line, i) => (
          <p
            key={i}
            className={`py-0.5 font-serif text-[0.85rem] leading-relaxed transition-colors duration-500 ${
              line.trim() === ""
                ? "h-3"
                : i === activeLine
                  ? "text-poster-fg"
                  : "text-poster-fg/50"
            }`}
          >
            {line}
          </p>
        ))}
      </div>
    </section>
  );
}
