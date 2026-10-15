<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Playlist presentation controls use the shared Button glass variants so interactive states remain consistent with the poster theme.
- Carousel gestures batch visual updates through animation frames and keep browsing separate from the existing audio state to preserve continuous playback.
- Lyric seeking shares the proportional plain-text timeline in src/lib/lyric-timing.ts and calls the existing player's seek API, avoiding a second playback system.
- AmbientArtwork crossfades preloaded artwork behind carousel cards using CSS blur rather than canvas sampling, avoiding cross-origin palette failures and following the global active track.
