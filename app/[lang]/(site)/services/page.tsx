import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, ChevronDown } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { SectionHeading } from "@/components/page-banner";
import { ServiceEnquiryForm } from "@/components/service-enquiry-form";
import { HowItWorks, SpecialInterestTiles, TourOperatorsSection } from "@/components/shared-sections";
import { pageMeta } from "@/lib/i18n/meta";
import { getDict, getLocale, getLp } from "@/lib/i18n/server";
import { faqSchema } from "@/lib/schema";
import { serviceBlocks } from "@/lib/services";
import { images, site } from "@/lib/site";
import { getPackageNames } from "@/lib/tours";

export async function generateMetadata(): Promise<Metadata> {
  const [d, locale] = await Promise.all([getDict(), getLocale()]);
  return pageMeta(locale, "/services/", { title: d.servicesPage.metaTitle, description: d.servicesPage.metaDescription, absolute: true });
}

const jumpIds = ["#tours", "#transfers", "#car-hire", "#hotels", "#flights", "#operators"];

export default async function ServicesPage() {
  const [d, locale, lp] = await Promise.all([getDict(), getLocale(), getLp()]);
  const t = d.servicesPage;
  const packages = await getPackageNames(locale);
  const wa = `${site.whatsapp}?text=${encodeURIComponent(t.whatsapp)}`;

  return (
    <>
      <JsonLd data={faqSchema(t.faqs)} />

      {/* Hero */}
      <section className="relative isolate flex min-h-[600px] items-end overflow-hidden md:min-h-[740px]">
        <Image src={images.pageBanner.src} alt={images.pageBanner.alt} fill loading="eager" fetchPriority="high" sizes="100vw" className="-z-20 object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/85 via-ink/40 to-ink/40" />
        <div className="container-x max-w-6xl! pt-52 pb-14 text-white">
          <nav aria-label="Breadcrumb" className="mb-4 text-sm text-white/80">
            <Link href={lp("/")} className="hover:text-teal">{d.common.home}</Link> <span aria-hidden="true">»</span> <span aria-current="page">{t.crumb}</span>
          </nav>
          <h1 className="max-w-3xl text-4xl leading-tight md:text-6xl">{t.h1}</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/90">{t.lead}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#enquire" className="btn btn-teal">{t.sendEnquiry}</a>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-outline">{d.common.askWhatsApp}</a>
          </div>
        </div>
      </section>

      {/* Jump links */}
      <nav aria-label={t.jumpAria} className="sticky top-0 z-30 border-b border-black/10 bg-white/95 backdrop-blur">
        <ul className="no-scrollbar container-x flex max-w-6xl! gap-1 overflow-x-auto py-2 text-sm">
          {jumpIds.map((id, i) => (
            <li key={id} className="shrink-0">
              <a href={id} className="block rounded-full px-3 py-1.5 hover:bg-sand">{t.jump[i]}</a>
            </li>
          ))}
        </ul>
      </nav>

      {/* One block per service, alternating sides */}
      <div className="py-6">
        {serviceBlocks.map((s, i) => {
          const text = t.blocks[i];
          const ctaHref = s.cta.href.startsWith("#") ? s.cta.href : lp(s.cta.href);
          return (
            <section key={s.id} id={s.id} className="scroll-mt-16 py-12">
              <div className="container-x grid max-w-6xl! items-center gap-10 md:grid-cols-2">
                <div className={`relative aspect-[4/3] overflow-hidden ${i % 2 ? "md:order-last" : ""}`}>
                  <Image src={s.image.src} alt={text.alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
                </div>
                <div>
                  <h2 className="text-3xl text-ink md:text-4xl">{text.title}</h2>
                  <span className="mt-3 mb-5 block h-0.5 w-20 bg-teal" />
                  <p className="leading-relaxed">{text.intro}</p>
                  <ul className="mt-5 space-y-2.5">
                    {text.points.map((p) => (
                      <li key={p} className="flex gap-2.5 text-sm">
                        <Check className="mt-0.5 size-4 shrink-0 text-teal-dark" aria-hidden="true" /> {p}
                      </li>
                    ))}
                  </ul>
                  {s.cta.href.startsWith("#") ? (
                    <a href={ctaHref} className="btn btn-teal mt-7">{text.cta}</a>
                  ) : (
                    <Link href={ctaHref} className="btn btn-teal mt-7">
                      {text.cta} <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                  )}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* Special interest */}
      <section className="bg-sand py-16">
        <div className="container-x max-w-6xl!">
          <SectionHeading title={d.about.specialTitle} className="mb-4" />
          <p className="mx-auto mb-10 max-w-2xl text-center text-sm leading-relaxed">{t.specialLead}</p>
          <SpecialInterestTiles />
        </div>
      </section>

      <div id="operators" className="scroll-mt-16">
        <TourOperatorsSection />
      </div>

      <HowItWorks ctaHref="#enquire" />

      {/* FAQ */}
      <section className="bg-sand py-16">
        <div className="container-x max-w-3xl">
          <SectionHeading title={d.common.questions} className="mb-8" />
          <div className="divide-y divide-teal/40 border-y border-teal/40 bg-white px-5">
            {t.faqs.map((f) => (
              <details key={f.q} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-ink [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <ChevronDown className="size-5 shrink-0 text-teal-dark transition-transform group-open:rotate-180" aria-hidden="true" />
                </summary>
                <p className="mt-3 text-sm leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
          <p className="mt-6 text-center text-sm">
            {d.common.moreInFaq} <Link href={lp("/faq/")} className="underline">{d.common.faq}</Link>.
          </p>
        </div>
      </section>

      {/* Enquiry */}
      <section id="enquire" className="scroll-mt-16 py-16">
        <div className="container-x max-w-3xl">
          <SectionHeading title={t.sendEnquiry} className="mb-4" />
          <p className="mb-8 text-center text-sm leading-relaxed">{t.enquiryText}</p>
          <ServiceEnquiryForm packages={packages} />
        </div>
      </section>
    </>
  );
}
