/** Plain-text lyrics use proportional timing, matching their existing scroll. */
export function lyricSeekTime(lineIndex: number, lineCount: number, duration: number): number {
  if (!Number.isFinite(duration) || duration <= 0 || lineCount <= 0) return 0;
  return (Math.max(0, Math.min(lineCount - 1, lineIndex)) / lineCount) * duration;
}