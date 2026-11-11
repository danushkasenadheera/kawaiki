"use client";

import { createContext, useContext } from "react";
import { localePath, type Locale } from "@/lib/i18n/config";
import type { UiDict } from "@/lib/i18n/dict/en";

const I18nContext = createContext<{ locale: Locale; dict: UiDict } | null>(null);

export function I18nProvider({ locale, dict, children }: { locale: Locale; dict: UiDict; children: React.ReactNode }) {
  return <I18nContext.Provider value={{ locale, dict }}>{children}</I18nContext.Provider>;
}

function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}

export const useLocale = () => useI18n().locale;
export const useDict = () => useI18n().dict;

/** Localised path helper for Client Components. */
export function useLp() {
  const locale = useLocale();
  return (path: string) => localePath(locale, path);
}
