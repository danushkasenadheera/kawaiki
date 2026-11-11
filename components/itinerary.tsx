"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronDown, ChevronsRight, MapPin } from "lucide-react";
import { splitDayTitle } from "@/lib/tour-utils";
import type { TourDay } from "@/lib/tours";
import { useDict, useLocale } from "./i18n-provider";

/** Day-by-day itinerary. Day 1 starts open; each day expands on tap, or all at once. */
export function Itinerary({ days }: { days: TourDay[] }) {
  const t = useDict();
  const locale = useLocale();
  const [open, setOpen] = useState<boolean[]>(() => days.map((_, i) => i === 0));
  const allOpen = open.every(Boolean);

  return (
    <div>
      <div className="mb-3 flex justify-end">
        <button type="button" className="text-sm text-sky underline underline-offset-2" onClick={() => setOpen(days.map(() => !allOpen))}>
          {allOpen ? t.itinerary.collapseAll : t.itinerary.expandAll}
        </button>
      </div>
      <ol className="relative space-y-3 before:absolute before:top-4 before:bottom-4 before:left-[19px] before:w-0.5 before:bg-teal/40">
        {days.map((d, i) => {
          const { label, heading } = splitDayTitle(d.title);
          // Japanese titles may not start with "Day N", so fall back to the position.
          const dayLabel = label.replace(/^Day\s*/i, "") || String(i + 1);
          return (
            <li key={`${d.title}-${i}`} className="relative">
              <details
                open={open[i]}
                onToggle={(e) => {
                  const isOpen = (e.currentTarget as HTMLDetailsElement).open;
                  setOpen((o) => (o[i] === isOpen ? o : o.map((v, k) => (k === i ? isOpen : v))));
                }}
                className="group"
              >
                <summary className="flex cursor-pointer list-none items-center gap-4 [&::-webkit-details-marker]:hidden">
                  <span className="relative z-10 flex size-10 shrink-0 flex-col items-center justify-center rounded-full border-2 border-teal bg-white text-[10px] leading-none font-bold text-ink uppercase">
                    {locale === "ja" ? (
                      <>
                        <span className="text-xs">{dayLabel}</span>
                        <span>{t.itinerary.day}</span>
                      </>
                    ) : (
                      <>
                        <span>{t.itinerary.day}</span>
                        <span className="text-xs">{dayLabel}</span>
                      </>
                    )}
                  </span>
                  <span className="flex flex-1 flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-black/10 py-3">
                    <span className="text-lg text-ink">{heading}</span>
                    {d.distance && (
                      <span className="flex items-center gap-1 text-xs text-ink/60">
                        <MapPin className="size-3.5" /> {d.distance}
                      </span>
                    )}
                  </span>
                  <ChevronDown className="size-5 shrink-0 text-teal-dark transition-transform group-open:rotate-180" />
                </summary>
                <div className="pt-3 pb-4 pl-14">
                  <ul className="space-y-2 text-sm">
                    {d.items.map((it, k) => (
                      <li key={k} className="flex gap-2.5">
                        <ChevronsRight className="mt-0.5 size-4 shrink-0 text-teal" /> <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                  {d.images.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {d.images.map((img) => (
                        <div key={img.src} className="relative aspect-[4/3] overflow-hidden">
                          <Image src={img.src} alt={img.alt} fill sizes="(min-width: 1024px) 240px, 45vw" className="object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </details>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
