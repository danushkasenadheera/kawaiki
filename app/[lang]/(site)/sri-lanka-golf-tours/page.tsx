import type { Metadata } from "next";
import { LandingPage } from "@/components/landing-page";
import { pageMeta } from "@/lib/i18n/meta";
import { getLocale } from "@/lib/i18n/server";
import { landingFor } from "@/lib/landing-ja";
import { getTours } from "@/lib/tours";

const SLUG = "sri-lanka-golf-tours";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const c = landingFor(SLUG, locale);
  return pageMeta(locale, `/${SLUG}/`, { title: c.seoTitle, description: c.seoDescription, absolute: true, image: c.hero.src });
}

export default async function Page() {
  const locale = await getLocale();
  const tours = await getTours(locale);
  return <LandingPage c={landingFor(SLUG, locale)} tours={tours} packages={tours.map((t) => t.title)} />;
}
