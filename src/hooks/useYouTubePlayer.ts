import { useCallback, useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<any> | null = null;

function loadApi(): Promise<any> {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve(window.YT);
    };
    const s = document.createElement("script");
    s.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(s);
  });
  return apiPromise;
}

export type YtState = {
  ready: boolean;
  playing: boolean;
  current: number;
  duration: number;
  /** The video the player is actually holding right now. */
  videoId: string | null;
  videoTitle: string;
  unavailable: boolean;
};

type Options = {
  /** Fired when the *expected* video finishes. */
  onEnded?: () => void;
  /** Fired when the *expected* video cannot be played (embed blocked / removed). */
  onUnavailable?: (videoId: string) => void;
};

const initial: YtState = {
  ready: false,
  playing: false,
  current: 0,
  duration: 0,
  videoId: null,
  videoTitle: "",
  unavailable: false,
};

/**
 * Single-video YouTube player. It never loads a YouTube *playlist*, so the
 * player can never wander into a video that the app did not ask for.
 * Every event is validated against `expectedRef` (the active song's video id);
 * stale callbacks from a previous song/playlist are dropped.
 */
export function useYouTubePlayer(hostId: string, opts: Options = {}) {
  const playerRef = useRef<any>(null);
  const expectedRef = useRef<string | null>(null);
  const optsRef = useRef(opts);
  optsRef.current = opts;

  const [state, setState] = useState<YtState>(initial);

  const currentVideoId = () => {
    try {
      const url: string | undefined = playerRef.current?.getVideoData?.()?.video_id;
      return url ?? null;
    } catch {
      return null;
    }
  };

  /** true when the player is holding the video the app currently expects */
  const inSync = () => {
    const expected = expectedRef.current;
    const actual = currentVideoId();
    return !expected || !actual || expected === actual;
  };

  useEffect(() => {
    let cancelled = false;
    loadApi().then((YT) => {
      if (cancelled || !document.getElementById(hostId)) return;
      playerRef.current = new YT.Player(hostId, {
        height: "180",
        width: "320",
        playerVars: { playsinline: 1, rel: 0, modestbranding: 1 },
        events: {
          onReady: () => setState((s) => ({ ...s, ready: true })),
          onError: () => {
            const id = currentVideoId() ?? expectedRef.current;
            if (!inSync()) return; // stale error from a previous song
            setState((s) => ({ ...s, unavailable: true, playing: false }));
            if (id) optsRef.current.onUnavailable?.(id);
          },
          onStateChange: (e: any) => {
            const p = playerRef.current;
            const actual = currentVideoId();
            if (!inSync()) return; // event belongs to a previous song/playlist
            if (e.data === YT.PlayerState.ENDED) {
              setState((s) => ({ ...s, playing: false }));
              optsRef.current.onEnded?.();
              return;
            }
            setState((s) => ({
              ...s,
              playing: e.data === YT.PlayerState.PLAYING,
              videoId: actual ?? s.videoId,
              duration: p?.getDuration?.() || s.duration,
              videoTitle: p?.getVideoData?.()?.title ?? s.videoTitle,
              unavailable: false,
            }));
          },
        },
      });
    });
    return () => {
      cancelled = true;
      try {
        playerRef.current?.destroy?.();
      } catch {
        /* noop */
      }
      playerRef.current = null;
    };
  }, [hostId]);

  // Progress ticker — also guarded so it never reports another video's time.
  useEffect(() => {
    const t = setInterval(() => {
      const p = playerRef.current;
      if (!p?.getCurrentTime) return;
      const actual = currentVideoId();
      if (expectedRef.current && actual && actual !== expectedRef.current) return;
      setState((s) => ({
        ...s,
        current: p.getCurrentTime() ?? 0,
        duration: p.getDuration?.() || s.duration,
        videoId: actual ?? s.videoId,
        videoTitle: p.getVideoData?.()?.title ?? s.videoTitle,
      }));
    }, 500);
    return () => clearInterval(t);
  }, []);

  /** Load one explicit video id. This is the only way audio ever starts. */
  const loadVideo = useCallback((videoId: string, autoplay: boolean) => {
    expectedRef.current = videoId;
    setState((s) => ({
      ...s,
      videoId,
      videoTitle: "",
      current: 0,
      duration: 0,
      playing: false,
      unavailable: false,
    }));
    const p = playerRef.current;
    if (!p?.cueVideoById) return;
    if (autoplay) p.loadVideoById({ videoId, suggestedQuality: "small" });
    else p.cueVideoById({ videoId, suggestedQuality: "small" });
  }, []);

  /** Stop playback and forget everything about the previous song. */
  const reset = useCallback(() => {
    expectedRef.current = null;
    try {
      playerRef.current?.stopVideo?.();
    } catch {
      /* noop */
    }
    setState((s) => ({ ...initial, ready: s.ready }));
  }, []);

  const play = useCallback(() => playerRef.current?.playVideo?.(), []);
  const pause = useCallback(() => playerRef.current?.pauseVideo?.(), []);
  const toggle = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    if (state.playing) p.pauseVideo?.();
    else p.playVideo?.();
  }, [state.playing]);
  const setVolume = useCallback((v: number) => playerRef.current?.setVolume?.(v), []);
  const seek = useCallback((sec: number) => playerRef.current?.seekTo?.(sec, true), []);

  return { state, loadVideo, reset, play, pause, toggle, setVolume, seek };
}
