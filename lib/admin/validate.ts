import { SUPABASE_URL } from "@/lib/supabase/env";
import type { TourDay, TourRow, TourTranslation } from "@/lib/tours";
import { CATEGORIES } from "@/lib/tour-utils";

/** What the editor sends to the save action. */
export type TourInput = {
  id?: string;
  slug: string;
  title: string;
  duration: string;
  summary: string;
  price: string;
  itineraryTitle: string;
  image: string;
  imageAlt: string;
  heroImage: string;
  heroAlt: string;
  days: TourDay[];
  includes: string[];
  excludes: string[];
  notes: string[];
  highlights: string[];
  categories: string[];
  seoTitle: string;
  seoDescription: string;
  ja: TourTranslation;
  published: boolean;
};

/** Keeps only known Japanese fields, trimmed and length-limited. Empty fields are dropped. */
function parseJa(raw: unknown, dayCount: number): TourTranslation {
  if (!raw || typeof raw !== "object") return {};
  const r = raw as Record<string, unknown>;
  const out: TourTranslation = {};
  const textKeys = ["title", "summary", "duration", "price", "itineraryTitle", "imageAlt", "heroAlt", "seoTitle", "seoDescription"] as const;
  const max: Record<string, number> = { summary: 3000, seoTitle: 70, seoDescription: 170 };
  for (const k of textKeys) {
    const v = str(r[k], max[k] ?? 300);
    if (v) out[k] = v;
  }
  for (const k of ["includes", "excludes", "notes", "highlights"] as const) {
    const v = list(r[k], k === "highlights" ? 10 : 60);
    if (v.length) out[k] = v;
  }
  if (Array.isArray(r.days)) {
    out.days = r.days.slice(0, dayCount).map((d) => {
      const o = (d ?? {}) as Record<string, unknown>;
      const day: { title?: string; distance?: string; items?: string[] } = {};
      const title = str(o.title, 200);
      const distance = str(o.distance, 100);
      const items = list(o.items, 40);
      if (title) day.title = title;
      if (distance) day.distance = distance;
      if (items.length) day.items = items;
      return day;
    });
  }
  return out;
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip accents left by NFKD (é -> e)
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const RESERVED = new Set([
  "admin", "packages", "services", "about-us", "contact", "faq", "terms", "privacy", "images", "api", "ja", "en",
  "sri-lanka-wildlife-tours", "sri-lanka-gem-mining-tours", "sri-lanka-golf-tours",
]);

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const list = (v: unknown, max = 60) =>
  Array.isArray(v) ? v.map((x) => str(x, 500)).filter(Boolean).slice(0, max) : [];

/** Only allow images we host: bundled /images/... or our own Supabase bucket. */
function imageUrl(v: unknown) {
  const s = str(v, 1000);
  if (!s) return "";
  if (s.startsWith("/images/") && !s.includes("..")) return s;
  if (SUPABASE_URL && s.startsWith(`${SUPABASE_URL}/storage/v1/object/public/`)) return s;
  return "";
}

export function parseTourInput(raw: unknown): { data: Omit<TourRow, "id" | "sort_order">; id?: string } | { error: string } {
  if (!raw || typeof raw !== "object") return { error: "Invalid data." };
  const r = raw as Record<string, unknown>;

  const title = str(r.title, 200);
  if (!title) return { error: "Title is required." };

  const slug = slugify(str(r.slug, 100) || title);
  if (!slug) return { error: "The URL slug must contain letters or numbers." };
  if (RESERVED.has(slug)) return { error: `"${slug}" is reserved for another page. Choose a different URL slug.` };

  const image = imageUrl(r.image);
  if (!image) return { error: "Add a card image." };

  const days: TourDay[] = (Array.isArray(r.days) ? r.days : []).slice(0, 40).map((d) => {
    const o = (d ?? {}) as Record<string, unknown>;
    return {
      title: str(o.title, 200),
      distance: str(o.distance, 100) || null,
      items: list(o.items, 40),
      images: (Array.isArray(o.images) ? o.images : [])
        .slice(0, 8)
        .map((im) => {
          const x = (im ?? {}) as Record<string, unknown>;
          return { src: imageUrl(x.src), alt: str(x.alt, 300) };
        })
        .filter((im) => im.src),
    };
  });
  if (days.some((d) => !d.title)) return { error: "Every day needs a title (e.g. “Day 1 - Arrival in Colombo”)." };

  const id = typeof r.id === "string" && /^[0-9a-f-]{36}$/i.test(r.id) ? r.id : undefined;

  return {
    id,
    data: {
      slug,
      title,
      duration: str(r.duration, 200),
      summary: str(r.summary, 3000),
      price: str(r.price, 200),
      itinerary_title: str(r.itineraryTitle, 300),
      image,
      image_alt: str(r.imageAlt, 300) || title,
      hero_image: imageUrl(r.heroImage),
      hero_alt: str(r.heroAlt, 300),
      days,
      includes: list(r.includes),
      excludes: list(r.excludes),
      notes: list(r.notes),
      highlights: list(r.highlights, 10),
      categories: (Array.isArray(r.categories) ? r.categories : []).filter((c): c is string =>
        (CATEGORIES as readonly string[]).includes(c as string),
      ),
      seo_title: str(r.seoTitle, 70),
      seo_description: str(r.seoDescription, 170),
      ja: parseJa(r.ja, days.length),
      published: r.published === true,
    },
  };
}
