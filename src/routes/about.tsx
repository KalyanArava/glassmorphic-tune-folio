import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Headphones, Music2 } from "lucide-react";
import avatar from "@/assets/avatar.jpg.asset.json";
import { PosterPage } from "@/components/poster/PosterPage";
import { YouTubeHeader } from "@/components/poster/YouTubeHeader";
import { Button } from "@/components/ui/button";
import { site } from "@/data/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: site.seo.aboutTitle },
      { name: "description", content: site.seo.aboutDescription },
      { property: "og:title", content: site.seo.aboutTitle },
      { property: "og:description", content: site.seo.aboutDescription },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <PosterPage>
      <YouTubeHeader />

      <section className="mt-10 animate-rise">
        <p className="text-[0.62rem] font-semibold uppercase text-yt-red">
          {site.about.eyebrow}
        </p>
        <div className="mt-4 flex items-center gap-4">
          <img
            src={avatar.url}
            alt={site.owner.name}
            className="h-14 w-14 shrink-0 rounded-full object-cover ring-1 ring-poster-fg/25"
          />
          <div>
            <p className="font-serif text-xl text-poster-fg">{site.owner.name}</p>
            <p className="mt-1 text-[0.68rem] uppercase text-poster-fg/55">Personal curator</p>
          </div>
        </div>

        <h1 className="mt-7 max-w-[34rem] font-serif text-[2.65rem] leading-[1.03] text-poster-fg sm:text-[3.25rem]">
          {site.about.title}
        </h1>
        <p className="mt-5 max-w-[32rem] text-[0.9rem] leading-7 text-poster-fg/75">
          {site.about.introduction}
        </p>
      </section>

      <section className="mt-7 rounded-[20px] border border-poster-fg/20 bg-poster-shade/35 p-5 shadow-glass backdrop-blur-2xl">
        <div className="flex items-center gap-2 text-poster-fg/60">
          <Headphones className="h-4 w-4" aria-hidden />
          <span className="text-[0.58rem] font-semibold uppercase">The collection</span>
        </div>
        <p className="mt-4 text-[0.84rem] leading-7 text-poster-fg/70">{site.about.story}</p>
        <div className="mt-5 grid gap-2 sm:grid-cols-3">
          {site.about.highlights.map((highlight) => (
            <div
              key={highlight}
              className="flex min-h-16 items-center gap-2 rounded-[8px] border border-poster-fg/15 bg-poster-fg/8 px-3 text-[0.72rem] font-medium text-poster-fg/80"
            >
              <Music2 className="h-3.5 w-3.5 shrink-0 text-yt-red" aria-hidden />
              {highlight}
            </div>
          ))}
        </div>
      </section>

      <p className="mt-6 max-w-[30rem] font-serif text-lg leading-7 text-poster-fg/80">
        {site.about.closing}
      </p>
      <Button asChild className="mt-6 rounded-full bg-poster-fg/92 px-6 text-poster-shade hover:bg-poster-fg">
        <Link to="/">
          Explore the playlists <ArrowRight />
        </Link>
      </Button>
    </PosterPage>
  );
}