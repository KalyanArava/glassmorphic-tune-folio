import type { ReactNode } from "react";
import personMobile from "@/assets/person-mobile-2.png.asset.json";
import personDesktop from "@/assets/person-desktop.png.asset.json";
import { site } from "@/data/site";

type Props = {
  children: ReactNode;
  reservePlayerSpace?: boolean;
};

export function PosterPage({ children, reservePlayerSpace = false }: Props) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-poster-shade font-sans text-poster-fg">
      <div className="pointer-events-none fixed inset-0">
        <img
          src={personMobile.url}
          alt={site.owner.photoAlt}
          className="absolute inset-0 h-full w-full object-cover object-[center_20%] md:hidden"
        />
        <img
          src={personDesktop.url}
          alt={site.owner.photoAlt}
          className="absolute inset-0 hidden h-full w-full object-cover object-center md:block"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,oklch(0.35_0.05_265/0.28)_0%,oklch(0.4_0.05_265/0.12)_32%,transparent_55%)]" />
      </div>

      <div
        className={`relative mx-0 flex min-h-screen w-full max-w-none flex-col px-5 pt-6 sm:px-8 lg:px-10 xl:px-16 ${reservePlayerSpace ? "pb-40" : "pb-12"}`}
      >
        <div className="w-full min-w-0 sm:w-[72%] sm:max-w-[560px] lg:w-[52%] lg:max-w-[620px] lg:min-w-[460px]">
          {children}
        </div>
      </div>
    </main>
  );
}