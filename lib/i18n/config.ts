// Languages: English is the default and lives at the normal URLs (/packages/);
// Japanese lives under /ja/ (/ja/packages/). next.config rewrites "/x" to "/en/x" internally.
export const locales = ["en", "ja"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const isLocale = (v: string): v is Locale => (locales as readonly string[]).includes(v);

/** Public path for a page in a language: localePath("ja", "/packages/") -> "/ja/packages/". */
export function localePath(locale: Locale, path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  if (locale === defaultLocale) return p;
  return p === "/" ? `/${locale}/` : `/${locale}${p}`;
}

/** Strips a language prefix: "/ja/packages/" -> "/packages/". */
export function stripLocale(path: string): string {
  const m = path.match(/^\/(ja)(\/.*|$)/);
  return m ? m[2] || "/" : path;
}

export const htmlLang: Record<Locale, string> = { en: "en", ja: "ja" };
export const ogLocale: Record<Locale, string> = { en: "en_US", ja: "ja_JP" };
