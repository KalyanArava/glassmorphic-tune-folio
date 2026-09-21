/**
 * ─────────────────────────────────────────────────────────────
 *  SITE SETTINGS — edit anything here, nothing else required.
 * ─────────────────────────────────────────────────────────────
 *  owner.name        → name shown under the title + in the tab title
 *  owner.subtitle    → small line under the name
 *  owner.photoAlt    → description of the big background photo
 *  ui.visibleSongs   → how many songs are visible before the list scrolls
 *  about             → text shown on the About page
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
  about: {
    eyebrow: "Behind the playlist",
    title: "Music, memories, and the moments between.",
    introduction:
      "I’m Kalyan, and this is my personal collection of songs that stay with me—across Telugu melodies, Hindi favourites, and timeless classics.",
    story:
      "Every playlist here is hand-picked for a mood, a memory, or a quiet moment. This space brings those songs together in one place, with the artwork and lyrics close by.",
    highlights: ["Telugu melodies", "Hindi favourites", "60s classics"],
    closing: "Press play, explore a language, and stay for the song that finds you.",
  },
  seo: {
    title: "Nadaanian Vibes Only — Kalyan Arava's Playlist",
    description:
      "A cinematic personal YouTube Music playlist — Telugu, Hindi and 60s classics, all in one glass player.",
    aboutTitle: "About Kalyan Arava — Nadaanian Vibes Only",
    aboutDescription:
      "Meet Kalyan Arava and discover the memories, moods, and musical favourites behind Nadaanian Vibes Only.",
  },
} as const;
