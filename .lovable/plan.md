# Home and About pages

## Summary
Keep the existing playlist experience as the Home page and add a separate About page that uses the same portrait backgrounds, typography, colors, and glass treatment. Add simple Home/About navigation without changing playlist behavior or visual identity.

## What will change
- Extend the existing editable site settings with About-page text, highlights, and page-specific SEO copy.
- Add a reusable shared background/page frame so Home and About remain visually consistent across phone and desktop sizes.
- Add Home and About links to the existing top header, using the current compact visual style.
- Keep the full playlist, playback controls, lyrics, tabs, and song behavior on Home.
- Create `/about` with the owner portrait, short editable introduction, music interests, and a link back to the playlists, presented in restrained glass panels.
- Update the editing guide so the About text can be changed from the same settings file.

## Content assumption
Because no biography was supplied, the About page will start with concise, neutral copy based only on the existing music-curation theme. Every line will be grouped in the editable site settings for easy replacement.

## Technical details
- Use TanStack Router links and create `src/routes/about.tsx` with unique title, description, Open Graph, and Twitter metadata.
- Reuse the existing semantic design tokens and responsive portrait/landscape assets; do not add a new visual theme.
- Extract only the shared visual shell needed by both routes, avoiding changes to the working YouTube playback logic.
- Verify Home and About at mobile and desktop sizes, including navigation, text fit, and unchanged Home playback controls.
