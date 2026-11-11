import type { Metadata } from "next";
import { PageBanner } from "@/components/page-banner";
import { PackagesGrid } from "@/components/packages-grid";
import { CustomTourSection } from "@/components/sections";
import { pageMeta } from "@/lib/i18n/meta";
import { getDict, getLocale } from "@/lib/i18n/server";
import { getTours } from "@/lib/tours";

export async function generateMetadata(): Promise<Metadata> {
  const [d, locale] = await Promise.all([getDict(), getLocale()]);
  return pageMeta(locale, "/packages/", { title: d.packagesPage.metaTitle, description: d.packagesPage.metaDescription, absolute: true });
}

export default async function PackagesPage() {
  const [d, locale] = await Promise.all([getDict(), getLocale()]);
  const t = d.packagesPage;
  const tours = await getTours(locale);
  const cards = tours.map(({ slug, title, image, imageAlt, summary, price, itineraryTitle, days, categories }) => ({
    slug,
    title,
    image,
    imageAlt,
    summary,
    price,
    itineraryTitle,
    // The card only needs the day count, so don't send whole itineraries to the browser.
    days: days.map((x) => ({ ...x, items: [], images: [] })),
    categories,
  }));

  return (
    <>
      <PageBanner title={t.banner} />
      <section className="py-14">
        <div className="container-x max-w-6xl!">
          <div className="mx-auto mb-8 max-w-2xl text-center">
            <h2 className="text-3xl text-ink md:text-4xl">{t.title}</h2>
            <p className="mt-3 text-sm leading-relaxed">{t.intro}</p>
          </div>
          <PackagesGrid tours={cards} />
        </div>
      </section>
      <CustomTourSection />
    </>
  );
}
