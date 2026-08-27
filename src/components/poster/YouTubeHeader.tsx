import { Cast, Search, MoreVertical } from "lucide-react";

export function YouTubeHeader() {
  return (
    <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
      <div className="flex min-w-0 items-center gap-2">
        <span className="grid h-6 w-9 shrink-0 place-items-center rounded-[6px] bg-yt-red">
          <svg viewBox="0 0 24 24" className="h-3 w-3 fill-white" aria-hidden>
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
        <span className="truncate text-[1.35rem] font-semibold tracking-[-0.04em] text-poster-fg">
          YouTube
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-5 text-poster-fg/85">
        <Cast className="h-[18px] w-[18px]" />
        <Search className="h-[18px] w-[18px]" />
        <MoreVertical className="h-[18px] w-[18px]" />
      </div>
    </header>
  );
}
