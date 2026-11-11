"use client";

import { useState, useSyncExternalStore } from "react";
import { CATEGORIES } from "@/lib/tour-utils";
import { TourCard, type TourCardData } from "./tour-card";
import { fmt } from "@/lib/i18n/dict/en";
import { useDict } from "./i18n-provider";

/** Packages with filter chips. Only categories that have at least one package are shown. */
const noSubscribe = () => () => {};
const typeFromUrl = () => new URLSearchParams(window.location.search).get("type");

export function PackagesGrid({ tours }: { tours: TourCardData[] }) {
  const t = useDict();
  // Links like /packages/?type=Wildlife (from the home page) open with that filter on.
  const urlType = useSyncExternalStore(noSubscribe, typeFromUrl, () => null);
  const [picked, setPicked] = useState<string | null | undefined>(undefined);
  const active = picked !== undefined ? picked : urlType && (CATEGORIES as readonly string[]).includes(urlType) ? urlType : null;
  const setActive = (v: string | null) => setPicked(v);
  const available = CATEGORIES.filter((c) => tours.some((t) => t.categories.includes(c)));
  const shown = active ? tours.filter((t) => t.categories.includes(active)) : tours;

  const chip = (on: boolean) =>
    `rounded-full border px-4 py-1.5 text-sm transition-colors ${on ? "border-ink bg-ink text-white" : "border-ink/20 bg-white hover:border-teal"}`;

  return (
    <>
      {available.length > 1 && (
        <div role="group" aria-label={t.packagesGrid.filterAria} className="mb-8 flex flex-wrap justify-center gap-2">
          <button type="button" aria-pressed={active === null} className={chip(active === null)} onClick={() => setActive(null)}>
            {t.packagesGrid.all}
          </button>
          {available.map((c) => (
            <button key={c} type="button" aria-pressed={active === c} className={chip(active === c)} onClick={() => setActive(c)}>
              {t.categories[c] ?? c}
            </button>
          ))}
        </div>
      )}
      <p className="sr-only" aria-live="polite">
        {shown.length === 1 ? t.packagesGrid.shownOne : fmt(t.packagesGrid.shown, { n: shown.length })}
      </p>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {shown.map((t) => (
          <TourCard key={t.slug} tour={t} />
        ))}
      </div>
    </>
  );
}
