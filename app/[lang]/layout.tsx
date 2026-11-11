import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "../globals.css";
import { I18nProvider } from "@/components/i18n-provider";
import { cabin } from "@/lib/fonts";
import { htmlLang, isLocale, locales, ogLocale } from "@/lib/i18n/config";
import { dictFor } from "@/lib/i18n/server";
import { images, site } from "@/lib/site";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = dictFor(lang);
  return {
    metadataBase: new URL(site.url),
    title: { default: t.meta.defaultTitle, template: t.meta.titleTemplate },
    description: t.meta.description,
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: ogLocale[lang],
      images: [{ url: images.homeHero.src, width: 2560, height: 1707, alt: images.homeHero.alt }],
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function LangLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <html lang={htmlLang[lang]} className={`${cabin.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <I18nProvider locale={lang} dict={dictFor(lang).ui}>
          {children}
        </I18nProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
