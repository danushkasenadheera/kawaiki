import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Car, Clock, Globe, Headset, Plane, PlaneLanding, Sparkles, Users, Wallet } from "lucide-react";
import { SectionHeading } from "@/components/page-banner";
import { BookNowSection, ImageGrid } from "@/components/sections";
import { HowItWorks, SpecialInterestTiles, TourOperatorsSection } from "@/components/shared-sections";
import { pageMeta } from "@/lib/i18n/meta";
import { getDict, getLocale, getLp } from "@/lib/i18n/server";
import { aboutGallery, images } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const [d, locale] = await Promise.all([getDict(), getLocale()]);
  return pageMeta(locale, "/about-us/", { title: d.about.metaTitle, description: d.about.metaDescription, absolute: true });
}

const statIcons = [Clock, BadgeCheck, Headset];
const serviceIcons = [Plane, PlaneLanding, Globe, Car];
const reasonIcons = [BadgeCheck, Users, Sparkles, Wallet];

export default async function AboutPage() {
  const [d, lp] = await Promise.all([getDict(), getLp()]);
  const t = d.about;

  return (
    <>
      {/* Hero */}
      <section className="relative isolate flex min-h-[560px] items-end overflow-hidden md:min-h-[660px]">
        <Image src={images.pageBanner.src} alt={images.pageBanner.alt} fill loading="eager" fetchPriority="high" sizes="100vw" className="-z-20 object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/85 via-ink/40 to-ink/40" />
        <div className="container-x max-w-6xl! pt-52 pb-14 text-white">
          <p className="text-sm tracking-[0.2em] text-teal uppercase">{t.eyebrow}</p>
          <h1 className="mt-3 max-w-3xl text-4xl leading-tight md:text-6xl">{t.h1}</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/90">{t.lead}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href={lp("/contact/")} className="btn btn-teal">{t.planTrip}</Link>
            <Link href={lp("/packages/")} className="btn btn-outline">{t.seeSample}</Link>
          </div>
        </div>
      </section>

      {/* Trust stats */}
      <section aria-label={t.statsAria} className="border-b border-black/10 bg-sand">
        <dl className="container-x grid max-w-6xl! gap-6 py-8 sm:grid-cols-3">
          {t.stats.map((s, i) => {
            const Icon = statIcons[i];
            return (
              <div key={s.value} className="relative pl-12">
                <dt className="text-2xl text-ink">
                  <Icon className="absolute top-1 left-0 size-8 text-teal-dark" aria-hidden="true" />
                  {s.value}
                </dt>
                <dd className="text-sm text-ink/75">{s.label}</dd>
              </div>
            );
          })}
        </dl>
      </section>

      {/* Story */}
      <section className="py-16">
        <div className="container-x grid max-w-6xl! items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading title={t.whoTitle} center={false} className="mb-8" />
            <div className="space-y-4 leading-relaxed">
              {t.who.map((p) => <p key={p}>{p}</p>)}
            </div>
          </div>
          <div className="relative aspect-[4/5] w-full max-w-md justify-self-center">
            <Image src={images.aboutTea.src} alt={images.aboutTea.alt} fill sizes="(min-width: 1024px) 450px, 100vw" className="object-cover" />
            <div className="absolute -bottom-6 -left-4 bg-teal px-5 py-4 text-ink shadow-lg sm:-left-8">
              <p className="text-3xl leading-none">{t.years}</p>
              <p className="text-sm">{t.yearsLabel}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-sand py-16">
        <div className="container-x max-w-6xl!">
          <SectionHeading title={t.whatTitle} className="mb-10" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {t.services.map((s, i) => {
              const Icon = serviceIcons[i];
              return (
                <div key={s.title} className="bg-white p-6 ring-1 ring-black/5">
                  <Icon className="size-9 text-teal-dark" aria-hidden="true" />
                  <h3 className="mt-4 text-xl text-ink">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed">{s.text}</p>
                </div>
              );
            })}
          </div>
          <p className="mt-8 text-center">
            <Link href={lp("/services/")} className="inline-flex items-center gap-1.5 font-semibold hover:text-teal-dark">
              {d.common.allServices} <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </p>
        </div>
      </section>

      {/* Special interest */}
      <section className="py-16">
        <div className="container-x max-w-6xl!">
          <SectionHeading title={t.specialTitle} className="mb-4" />
          <p className="mx-auto mb-10 max-w-2xl text-center text-sm leading-relaxed">{t.specialText}</p>
          <SpecialInterestTiles />
        </div>
      </section>

      {/* Why choose */}
      <section className="bg-sand py-16">
        <div className="container-x max-w-6xl!">
          <SectionHeading title={t.whyTitle} className="mb-10" />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {t.reasons.map((r, i) => {
              const Icon = reasonIcons[i];
              return (
                <div key={r.title}>
                  <Icon className="size-9 text-teal-dark" aria-hidden="true" />
                  <h3 className="mt-4 text-xl text-ink">{r.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed">{r.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <HowItWorks ctaHref="#book" />

      <TourOperatorsSection />

      <div id="book" className="scroll-mt-4">
        <BookNowSection title={t.planTitle} />
      </div>

      <section className="pb-16">
        <div className="container-x">
          <SectionHeading title={t.galleryTitle} className="mb-8" />
          <ImageGrid items={aboutGallery} />
        </div>
      </section>
    </>
  );
}
