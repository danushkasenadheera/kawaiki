import { cacheLife, cacheTag } from "next/cache";
import fallbackData from "@/data/tours.json";
import { hasSupabase } from "./supabase/env";
import type { Locale } from "./i18n/config";
import type { Img } from "./site";

export type TourDay = {
  title: string;
  distance: string | null;
  items: string[];
  images: Img[];
};

export type Tour = {
  id?: string;
  slug: string;
  title: string;
  image: string;
  imageAlt: string;
  duration: string;
  summary: string;
  hero: Img;
  itineraryTitle: string;
  price: string;
  days: TourDay[];
  includes: string[];
  excludes: string[];
  notes: string[];
  highlights: string[];
  categories: string[];
  seoTitle?: string;
  seoDescription?: string;
  published?: boolean;
  sortOrder?: number;
  /** False when shown in Japanese but no Japanese translation exists yet (English fallback). */
  translated?: boolean;
  /** Raw Japanese translation (used by the admin). */
  ja?: TourTranslation;
};

/** Japanese translation of a tour. Any missing field falls back to English. */
export type TourTranslation = Partial<{
  title: string;
  summary: string;
  duration: string;
  price: string;
  itineraryTitle: string;
  imageAlt: string;
  heroAlt: string;
  days: { title?: string; distance?: string; items?: string[] }[];
  includes: string[];
  excludes: string[];
  notes: string[];
  highlights: string[];
  seoTitle: string;
  seoDescription: string;
}>;

/** Database row shape (snake_case), as stored in public.tours. */
export type TourRow = {
  id: string;
  slug: string;
  title: string;
  duration: string;
  summary: string;
  price: string;
  itinerary_title: string;
  image: string;
  image_alt: string;
  hero_image: string;
  hero_alt: string;
  days: TourDay[];
  includes: string[];
  excludes: string[];
  notes: string[];
  highlights: string[];
  categories: string[];
  seo_title: string;
  seo_description: string;
  ja?: TourTranslation | null;
  published: boolean;
  sort_order: number;
  updated_at?: string;
};

export const TOURS_TAG = "tours";

export function rowToTour(r: TourRow, locale: Locale = "en"): Tour {
  // Keep the raw translation on the English version too (the admin list shows its status).
  const base = { ...baseTour(r), ja: r.ja ?? undefined };
  return locale === "ja" ? translateTour(base, r.ja ?? undefined) : base;
}

const has = (v?: string) => Boolean(v && v.trim());
const hasList = (v?: string[]) => Boolean(v && v.some((x) => x.trim()));

/** Overlays the Japanese translation field by field; anything missing stays English. */
export function translateTour(t: Tour, ja?: TourTranslation): Tour {
  if (!ja || !has(ja.title)) return { ...t, translated: false, ja };
  return {
    ...t,
    title: ja.title!,
    summary: has(ja.summary) ? ja.summary! : t.summary,
    duration: has(ja.duration) ? ja.duration! : t.duration,
    price: has(ja.price) ? ja.price! : t.price,
    itineraryTitle: has(ja.itineraryTitle) ? ja.itineraryTitle! : t.itineraryTitle,
    imageAlt: has(ja.imageAlt) ? ja.imageAlt! : t.imageAlt,
    hero: { ...t.hero, alt: has(ja.heroAlt) ? ja.heroAlt! : t.hero.alt },
    days: t.days.map((d, i) => {
      const jd = ja.days?.[i];
      return {
        ...d,
        title: has(jd?.title) ? jd!.title! : d.title,
        distance: has(jd?.distance) ? jd!.distance! : d.distance,
        items: hasList(jd?.items) ? jd!.items!.filter((x) => x.trim()) : d.items,
      };
    }),
    includes: hasList(ja.includes) ? ja.includes! : t.includes,
    excludes: hasList(ja.excludes) ? ja.excludes! : t.excludes,
    notes: hasList(ja.notes) ? ja.notes! : t.notes,
    highlights: hasList(ja.highlights) ? ja.highlights! : t.highlights,
    seoTitle: has(ja.seoTitle) ? ja.seoTitle : t.seoTitle,
    seoDescription: has(ja.seoDescription) ? ja.seoDescription : t.seoDescription,
    translated: true,
    ja,
  };
}

function baseTour(r: TourRow): Tour {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    duration: r.duration,
    summary: r.summary,
    price: r.price,
    itineraryTitle: r.itinerary_title,
    image: r.image,
    imageAlt: r.image_alt,
    hero: { src: r.hero_image || r.image, alt: r.hero_alt || r.image_alt },
    days: Array.isArray(r.days) ? r.days : [],
    includes: r.includes ?? [],
    excludes: r.excludes ?? [],
    notes: r.notes ?? [],
    highlights: r.highlights ?? [],
    categories: r.categories ?? [],
    seoTitle: r.seo_title ?? "",
    seoDescription: r.seo_description ?? "",
    published: r.published,
    sortOrder: r.sort_order,
  };
}

type FallbackTour = Tour & { ja?: TourTranslation };

/** Published tours in display order, in the given language. Cached until an admin change calls updateTag("tours"). */
export async function getTours(locale: Locale = "en"): Promise<Tour[]> {
  "use cache";
  cacheTag(TOURS_TAG);
  cacheLife("max");

  if (!hasSupabase) {
    return (fallbackData as FallbackTour[]).map((t) => (locale === "ja" ? translateTour(t, t.ja) : { ...t, translated: true }));
  }

  const { createPublicClient } = await import("./supabase/public");
  const { data, error } = await createPublicClient()
    .from("tours")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw new Error(`Could not load tours: ${error.message}`);
  return (data as TourRow[]).map((r) => rowToTour(r, locale));
}

export async function getTour(slug: string, locale: Locale = "en"): Promise<Tour | undefined> {
  return (await getTours(locale)).find((t) => t.slug === slug);
}

export async function getPackageNames(locale: Locale = "en"): Promise<string[]> {
  return (await getTours(locale)).map((t) => t.title);
}

export { dayCount, metaDescription, priceAmount, routeStops, splitDayTitle, startsAndEndsAtAirport, totalKm } from "./tour-utils";
