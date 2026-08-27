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
  index: number;
  videoTitle: string;
};

export function useYouTubePlayer(hostId: string) {
  const playerRef = useRef<any>(null);
  const [state, setState] = useState<YtState>({
    ready: false,
    playing: false,
    current: 0,
    duration: 0,
    index: 0,
    videoTitle: "",
  });

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
          onStateChange: (e: any) => {
            const p = playerRef.current;
            setState((s) => ({
              ...s,
              playing: e.data === YT.PlayerState.PLAYING,
              index: p?.getPlaylistIndex?.() ?? s.index,
              duration: p?.getDuration?.() ?? s.duration,
              videoTitle: p?.getVideoData?.()?.title ?? s.videoTitle,
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

  useEffect(() => {
    const t = setInterval(() => {
      const p = playerRef.current;
      if (!p?.getCurrentTime) return;
      setState((s) => ({
        ...s,
        current: p.getCurrentTime() ?? 0,
        duration: p.getDuration?.() ?? s.duration,
        index: p.getPlaylistIndex?.() ?? s.index,
        videoTitle: p.getVideoData?.()?.title ?? s.videoTitle,
      }));
    }, 500);
    return () => clearInterval(t);
  }, []);

  const loadPlaylist = useCallback((listId: string, index = 0, autoplay = false) => {
    const p = playerRef.current;
    if (!p?.cuePlaylist) return;
    const args = { list: listId, listType: "playlist", index, suggestedQuality: "small" };
    if (autoplay) p.loadPlaylist(args);
    else p.cuePlaylist(args);
  }, []);

  const playAt = useCallback((index: number) => {
    const p = playerRef.current;
    if (!p) return;
    p.playVideoAt?.(index);
    p.playVideo?.();
  }, []);

  const toggle = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    if (state.playing) p.pauseVideo?.();
    else p.playVideo?.();
  }, [state.playing]);

  const next = useCallback(() => playerRef.current?.nextVideo?.(), []);
  const prev = useCallback(() => playerRef.current?.previousVideo?.(), []);
  const setVolume = useCallback((v: number) => playerRef.current?.setVolume?.(v), []);
  const seek = useCallback((sec: number) => playerRef.current?.seekTo?.(sec, true), []);

  return { state, loadPlaylist, playAt, toggle, next, prev, setVolume, seek };
}
