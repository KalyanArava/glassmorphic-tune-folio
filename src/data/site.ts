/**
 * ─────────────────────────────────────────────────────────────
 *  SITE SETTINGS — edit anything here, nothing else required.
 * ─────────────────────────────────────────────────────────────
 *  owner.name        → name shown under the title + in the tab title
 *  owner.subtitle    → small line under the name
 *  owner.photoAlt    → description of the big background photo
 *  ui.visibleSongs   → how many songs are visible before the list scrolls
 *  seo               → browser tab title + share description
 *
 *  To change the photos: replace src/assets/person.jpg.asset.json
 *  (big photo) and src/assets/avatar.jpg.asset.json (small circle).
 *  To add / remove songs: edit src/data/playlist.ts.
 */
export const site = {
  owner: {
    name: "Kalyan Arava",
    subtitleSuffix: "Updated today",
    photoAlt: "Kalyan Arava standing on a street at dusk",
    curatedBy: "Kalyan",
  },
  ui: {
    /** Rows visible before the playlist starts scrolling (7–10 looks best). */
    visibleSongs: 8,
  },
  seo: {
    title: "Nadaanian Vibes Only — Kalyan Arava's Playlist",
    description:
      "A cinematic personal YouTube Music playlist — Telugu, Hindi and 60s classics, all in one glass player.",
  },
} as const;
