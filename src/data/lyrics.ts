/**
 * ─────────────────────────────────────────────────────────────
 *  LYRICS — one entry per song. Easy to edit in any code editor.
 * ─────────────────────────────────────────────────────────────
 *  Key   → the song's YouTube video id (the part after v= in the link).
 *          This is the same id already used in src/data/playlist.ts,
 *          so lyrics automatically attach to the right song.
 *  Value → the lyrics, one line per row. Blank line = a pause.
 *
 *  The panel under the player scrolls these lines in time with the
 *  music automatically — just paste the words, nothing else needed.
 *
 *  Example:
 *    "gB_dBDdKRBc": `పాట మొదటి లైను
 *  రెండో లైను
 *
 *  (ఖాళీ లైను = విరామం)`,
 */
export const lyrics: Record<string, string> = {
  // ── Hindi ────────────────────────────────────────────────
  // "VIDEO_ID": `पहली पंक्ति
  // दूसरी पंक्ति`,

  // ── Telugu ───────────────────────────────────────────────
  // "VIDEO_ID": `మొదటి లైను
  // రెండో లైను`,
};
