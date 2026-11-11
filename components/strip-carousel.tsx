"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Img } from "@/lib/site";
import { useDict } from "./i18n-provider";

/** Row of images showing several at once, with arrows and autoplay. */
export function StripCarousel({
  slides,
  itemClass = "basis-full sm:basis-1/2 lg:basis-1/3",
  aspect = "aspect-[3/4]",
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  interval = 4000,
}: {
  slides: Img[];
  itemClass?: string;
  aspect?: string;
  sizes?: string;
  interval?: number;
}) {
  const t = useDict().carousel;
  const track = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  const step = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const item = el.firstElementChild as HTMLElement | null;
    const w = item ? item.offsetWidth + 12 : el.clientWidth;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    if (dir === 1 && atEnd) el.scrollTo({ left: 0, behavior: "smooth" });
    else if (dir === -1 && el.scrollLeft <= 4) el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
    else el.scrollBy({ left: dir * w, behavior: "smooth" });
  };

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => step(1), interval);
    return () => clearInterval(id);
  }, [paused, interval]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      <div ref={track} className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto">
        {slides.map((s) => (
          <div key={s.src} className={`relative shrink-0 snap-start overflow-hidden border border-teal ${aspect} ${itemClass}`}>
            <Image src={s.src} alt={s.alt} fill sizes={sizes} className="object-cover" />
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => step(-1)}
        aria-label={t.prev}
        className="absolute top-1/2 left-1 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-teal text-ink shadow"
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        type="button"
        onClick={() => step(1)}
        aria-label={t.next}
        className="absolute top-1/2 right-1 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-teal text-ink shadow"
      >
        <ChevronRight className="size-5" />
      </button>
    </div>
  );
}
