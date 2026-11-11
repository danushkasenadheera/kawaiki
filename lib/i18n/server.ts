import { lang } from "next/root-params";
import { defaultLocale, isLocale, localePath, type Locale } from "./config";
import { en } from "./dict/en";
import { ja } from "./dict/ja";

const dictionaries = { en, ja };

/** Current language, from the /[lang]/ root segment (Server Components only). */
export async function getLocale(): Promise<Locale> {
  try {
    const l = await lang();
    return l && isLocale(l) ? l : defaultLocale;
  } catch {
    return defaultLocale;
  }
}

export async function getDict() {
  return dictionaries[await getLocale()];
}

export function dictFor(locale: Locale) {
  return dictionaries[locale];
}

/** Localised path helper for Server Components: (await getLp())("/packages/"). */
export async function getLp() {
  const locale = await getLocale();
  return (path: string) => localePath(locale, path);
}
