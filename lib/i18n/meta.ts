import type { Metadata } from "next";
import { localePath, ogLocale, type Locale } from "./config";

/**
 * Page metadata with the right canonical URL for the current language and
 * hreflang links so Google knows /x/ and /ja/x/ are translations of each other.
 */
export function pageMeta(
  locale: Locale,
  path: string,
  { title, description, absolute = false, image }: { title: string; description: string; absolute?: boolean; image?: string },
): Metadata {
  return {
    title: absolute ? { absolute: title } : title,
    description,
    alternates: {
      canonical: localePath(locale, path),
      languages: { en: localePath("en", path), ja: localePath("ja", path), "x-default": localePath("en", path) },
    },
    openGraph: { locale: ogLocale[locale], ...(image ? { images: [image] } : {}) },
  };
}
