import type { MetadataRoute } from "next";
import { localePath } from "@/lib/i18n/config";
import { site } from "@/lib/site";
import { getTours } from "@/lib/tours";

// Every page in English (default URLs) and Japanese (/ja/), each listing its translation for Google.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const tours = await getTours();
  const pages: [string, number][] = [
    ["/", 1],
    ["/packages/", 0.9],
    ["/sri-lanka-wildlife-tours/", 0.9],
    ["/sri-lanka-gem-mining-tours/", 0.85],
    ["/sri-lanka-golf-tours/", 0.85],
    ["/services/", 0.8],
    ["/about-us/", 0.8],
    ["/contact/", 0.8],
    ["/faq/", 0.6],
    ["/terms/", 0.3],
    ["/privacy/", 0.3],
    ...tours.map((t) => [`/${t.slug}/`, 0.9] as [string, number]),
  ];
  const abs = (p: string) => `${site.url}${p}`;
  return pages.flatMap(([path, priority]) => {
    const languages = { en: abs(localePath("en", path)), ja: abs(localePath("ja", path)) };
    return [
      { url: languages.en, priority, alternates: { languages } },
      { url: languages.ja, priority: Math.round(priority * 0.9 * 100) / 100, alternates: { languages } },
    ];
  });
}
