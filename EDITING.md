# How to edit this site

Everything you'd normally want to change lives in two files.

## 1. Songs & playlists — `src/data/playlist.ts`

Each playlist has a simple list. One line = one song:

```ts
["YOUTUBE_VIDEO_ID", "Song title", "Artist or movie", "4:15"],
```

- **Add a song** → add a new line anywhere in the list.
- **Remove a song** → delete its line.
- **Reorder** → move the line up or down.
- **Video ID** → the part after `v=` in a YouTube link
  (`youtube.com/watch?v=gB_dBDdKRBc` → `gB_dBDdKRBc`).
  Thumbnails, ids and durations are generated automatically from it.

Playlist headings (`title`, `accentLine`, `tagline`, `url`, `label`) sit just
below the song lists in the same file.

### Add a whole new playlist (e.g. Tamil)

1. Add the key to `PlaylistId` at the top of the file.
2. Add a `const tamilRaw: Raw[] = [ ... ]` list.
3. Add a new entry to the exported `playlists` array using the same shape as
   the existing ones. Tabs update automatically.

## 2. Name, photo text, SEO — `src/data/site.ts`

Owner name, the caption under it, the "curated by" line, how many songs are
visible before scrolling, and the browser tab title / share description.

## 2b. Lyrics — `src/data/lyrics.ts`

One entry per song, keyed by its YouTube video id (same id as in
`src/data/playlist.ts`). Paste the words, one line per row; blank line = a
pause. The lyrics card under the list scrolls in time with the music
automatically — no timestamps needed. Songs without an entry simply don't
show a lyrics card.

## 3. Photos

- Big background photo: `src/assets/person.jpg.asset.json`
- Small round avatar: `src/assets/avatar.jpg.asset.json`

Replace those files (same names) and the site picks them up.

## 4. Colours, fonts, glass effect — `src/styles.css`

All colours are design tokens (`--poster-fg`, `--poster-shade`, `--yt-red`, …).
Change them in one place and the whole page follows.

## Where things live

```
src/data/playlist.ts              songs + playlist metadata
src/data/site.ts                  name, SEO, list height
src/routes/index.tsx              page layout + playback wiring
src/components/poster/            header, hero, tabs, song rows, player
src/hooks/useYouTubePlayer.ts     YouTube audio playback
src/styles.css                    colours, fonts, animations
```
