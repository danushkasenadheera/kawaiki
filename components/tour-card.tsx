"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { dayCount, priceAmount } from "@/lib/tour-utils";
import type { Tour } from "@/lib/tours";
import { fmt } from "@/lib/i18n/dict/en";
import { useDict, useLp } from "./i18n-provider";

export type TourCardData = Pick<Tour, "slug" | "title" | "image" | "imageAlt" | "summary" | "price" | "itineraryTitle" | "days" | "categories">;

export function TourCard({ tour }: { tour: TourCardData }) {
  const t = useDict();
  const lp = useLp();
  const price = priceAmount(tour);
  const days = dayCount(tour);
  const href = lp(`/${tour.slug}/`);

  return (
    <article className="group flex flex-col bg-white shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-lg">
      <Link href={href} className="relative block aspect-[3/2] overflow-hidden" tabIndex={-1} aria-hidden="true">
        <Image
          src={tour.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 360px, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 flex items-center gap-1 bg-white/95 px-2 py-1 text-xs font-semibold text-ink">
          <Clock className="size-3.5" /> {fmt(t.card.days, { n: days })}
        </span>
        {price && (
          <span className="absolute right-0 bottom-0 bg-ink/85 px-3 py-1.5 text-sm text-white">
            <b className="text-base">{fmt(t.card.price, { price: price.toLocaleString("en-US") })}</b>
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        {tour.categories.length > 0 && (
          <p className="mb-2 text-xs tracking-wide text-sky uppercase">{tour.categories.slice(0, 3).map((c) => t.categories[c] ?? c).join(" · ")}</p>
        )}
        <h3 className="text-2xl leading-tight text-ink">
          <Link href={href} className="hover:text-teal-dark">{tour.title}</Link>
        </h3>
        {/* flex-1 sits on the wrapper: a stretched line-clamp box would show a 4th, cut-off line. */}
        <div className="mt-3 flex-1">
          <p className="line-clamp-3 text-sm leading-relaxed text-ink/80">{tour.summary}</p>
        </div>
        <Link href={href} className="mt-4 inline-flex items-center gap-1.5 self-start font-semibold text-ink hover:text-teal-dark">
          {t.card.viewTour} <ArrowRight className="size-4" aria-hidden="true" />
          <span className="sr-only">: {tour.title}</span>
        </Link>
      </div>
    </article>
  );
}
