"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { Clock, Headset, Menu, MessageSquare, X } from "lucide-react";
import { useDict, useLocale, useLp } from "./i18n-provider";
import { localePath, stripLocale } from "@/lib/i18n/config";
import { images, site } from "@/lib/site";

const strip = (p: string) => (p.length > 1 ? p.replace(/\/$/, "") : p);

const NAV = [
  { path: "/", key: "home" },
  { path: "/services/", key: "services" },
  { path: "/packages/", key: "packages" },
  { path: "/about-us/", key: "about" },
  { path: "/contact/", key: "contact" },
] as const;

/** EN / 日本語 switch, linking to the same page in the other language. */
function LanguageSwitch({ className = "" }: { className?: string }) {
  const locale = useLocale();
  const t = useDict();
  const base = stripLocale(usePathname() || "/");
  const item = (active: boolean) => `px-1.5 py-0.5 ${active ? "border-b-2 border-teal" : "opacity-80 hover:opacity-100"}`;
  return (
    <nav aria-label={t.header.language} className={`flex items-center gap-1 text-xs ${className}`}>
      <Link href={localePath("en", base)} hrefLang="en" lang="en" className={item(locale === "en")} aria-current={locale === "en" ? "true" : undefined}>
        EN
      </Link>
      <span aria-hidden="true">/</span>
      <Link href={localePath("ja", base)} hrefLang="ja" lang="ja" className={item(locale === "ja")} aria-current={locale === "ja" ? "true" : undefined}>
        日本語
      </Link>
    </nav>
  );
}

const DISMISS_KEY = "kawaiki-ja-suggest-dismissed";
const noSubscribe = () => () => {};
function readSuggest() {
  try {
    return navigator.language.toLowerCase().startsWith("ja") && localStorage.getItem(DISMISS_KEY) !== "1";
  } catch {
    return false;
  }
}

/** For visitors whose browser is in Japanese: a gentle suggestion, never an automatic redirect. */
function JapaneseSuggestion() {
  const locale = useLocale();
  const base = stripLocale(usePathname() || "/");
  const wanted = useSyncExternalStore(noSubscribe, readSuggest, () => false);
  const [hidden, setHidden] = useState(false);
  if (locale !== "en" || !wanted || hidden) return null;
  return (
    <div lang="ja" className="flex items-center justify-center gap-4 bg-teal px-4 py-2 text-sm text-ink">
      <Link href={localePath("ja", base)} hrefLang="ja" className="font-semibold underline">
        日本語で見る →
      </Link>
      <button
        type="button"
        aria-label="閉じる"
        onClick={() => {
          setHidden(true);
          try {
            localStorage.setItem(DISMISS_KEY, "1");
          } catch {}
        }}
        className="rounded p-1 hover:bg-black/10"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}

/** Transparent header that sits on top of each page's banner image. */
export function Header() {
  const t = useDict();
  const lp = useLp();
  const pathname = usePathname() || "/";
  const isActive = (path: string) => strip(pathname) === strip(lp(path));
  const [open, setOpen] = useState(false);

  return (
      <header className="absolute inset-x-0 top-0 z-40 text-white">
        <JapaneseSuggestion />
        {/* Desktop */}
        <div className="container-x hidden md:block">
          <div className="grid grid-cols-[1fr_auto_1fr] items-start pt-3 text-xs">
            <div className="flex items-center gap-8 pt-1">
              <a href={`tel:${site.phone}`} className="flex items-center gap-2 hover:text-teal">
                <Headset className="size-4" /> {site.phone}
              </a>
              <a href={`mailto:${site.email}`} className="flex items-center gap-2 hover:text-teal">
                <MessageSquare className="size-4" /> {site.email}
              </a>
            </div>
            <Link href={lp("/")} aria-label={t.header.homeAria}>
              <Image src={images.logo.src} alt={images.logo.alt} width={210} height={210} preload className="size-40 object-contain lg:size-48" />
            </Link>
            <div className="flex flex-col items-end gap-2 pt-1">
              <p className="flex items-center gap-2">
                <Clock className="size-4" /> {t.header.hours}
              </p>
              <LanguageSwitch />
            </div>
          </div>
          <nav aria-label="Main" className="-mt-1 flex justify-center">
            <ul className="flex items-center gap-6 text-sm">
              {NAV.map((item) => {
                const active = isActive(item.path);
                return (
                  <li key={item.path}>
                    <Link
                      href={lp(item.path)}
                      aria-current={active ? "page" : undefined}
                      className={`block border-b-2 pb-1 transition-colors ${active ? "border-teal text-base" : "border-transparent hover:border-teal"}`}
                    >
                      {t.nav[item.key]}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Mobile */}
        <div className="container-x flex items-center justify-between py-3 md:hidden">
          <Link href={lp("/")} onClick={() => setOpen(false)} aria-label={t.header.homeAria}>
            <Image src={images.logo.src} alt={images.logo.alt} width={96} height={96} preload className="size-20 object-contain" />
          </Link>
          <div className="flex items-center gap-3">
            <LanguageSwitch />
            <button
              type="button"
              className="rounded-md p-2"
              aria-label={open ? t.header.closeMenu : t.header.openMenu}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="size-7" /> : <Menu className="size-7" />}
            </button>
          </div>
        </div>
        {open && (
          <nav aria-label="Mobile" className="bg-ink/95 md:hidden">
            <ul className="container-x flex flex-col py-2">
              {NAV.map((item) => (
                <li key={item.path}>
                  <Link href={lp(item.path)} onClick={() => setOpen(false)} className={`block py-3 ${isActive(item.path) ? "text-teal" : ""}`}>
                    {t.nav[item.key]}
                  </Link>
                </li>
              ))}
              <li className="flex flex-col gap-2 border-t border-white/10 py-3 text-sm text-white/80">
                <a href={`tel:${site.phone}`} className="flex items-center gap-2"><Headset className="size-4" /> {site.phone}</a>
                <a href={`mailto:${site.email}`} className="flex items-center gap-2"><MessageSquare className="size-4" /> {site.email}</a>
                <span className="flex items-center gap-2"><Clock className="size-4" /> {t.header.hours}</span>
              </li>
            </ul>
          </nav>
        )}
      </header>
  );
}
