import { useEffect, useState } from "react";

/** The artwork itself supplies the palette, without canvas/CORS sampling. */
export function AmbientArtwork({ artwork, playing }: { artwork: string | undefined; playing: boolean }) {
  const [layers, setLayers] = useState<{ current: string | undefined; previous: string | undefined }>({ current: undefined, previous: undefined });

  useEffect(() => {
    if (!artwork) return;
    let cancelled = false;
    const image = new Image();
    image.onload = () => {
      if (cancelled) return;
      setLayers((old) => old.current === artwork ? old : { current: artwork, previous: old.current });
    };
    image.src = artwork;
    return () => { cancelled = true; image.onload = null; };
  }, [artwork]);

  return (
    <div className="artwork-ambient" data-playing={playing} aria-hidden="true">
      {[layers.previous, layers.current].filter((src): src is string => Boolean(src)).map((src) => (
        <img key={src} src={src} alt="" draggable={false} className="artwork-ambient-layer" />
      ))}
    </div>
  );
}