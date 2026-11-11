import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { JsonLd } from "./json-ld";
import { SectionHeading } from "./page-banner";
import { ServiceEnquiryForm } from "./service-enquiry-form";
import { TourCard } from "./tour-card";
import type { LandingPageContent } from "@/lib/landing";
import { fmt } from "@/lib/i18n/dict/en";
import { getDict, getLp } from "@/lib/i18n/server";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { site } from "@/lib/site";
import type { Tour } from "@/lib/tours";

/** Shared layout for the Wildlife / Gem mining / Golf landing pages. */
export async function LandingPage({ c, tours, packages }: { c: LandingPageContent; tours: Tour[]; packages: string[] }) {
  const [d, lp] = await Promise.all([getDict(), getLp()]);
  const L = d.landing;
  const matching = tours.filter((t) => t.categories.includes(c.category));
  const wa = `${site.whatsapp}?text=${encodeURIComponent(c.whatsapp)}`;

  return (
    <>
      <JsonLd
        data={[
          faqSchema(c.faqs),
          breadcrumbSchema([
            { name: d.common.home, path: lp("/") },
            { name: c.h1, path: lp(`/${c.slug}/`) },
          ]),
        ]}
      />

      {/* Hero */}
      <section className="relative isolate flex min-h-[560px] items-end overflow-hidden md:min-h-[660px]">
        <Image src={c.hero.src} alt={c.hero.alt} fill loading="eager" fetchPriority="high" sizes="100vw" className="-z-20 object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/85 via-ink/40 to-ink/40" />
        <div className="container-x max-w-6xl! pt-52 pb-14 text-white">
          <nav aria-label="Breadcrumb" className="mb-4 text-sm text-white/80">
            <Link href={lp("/")} className="hover:text-teal">{d.common.home}</Link> <span aria-hidden="true">»</span> <span aria-current="page">{c.h1}</span>
          </nav>
          <p className="text-sm tracking-[0.2em] text-teal uppercase">{c.eyebrow}</p>
          <h1 className="mt-3 max-w-3xl text-4xl leading-tight md:text-6xl">{c.h1}</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/90">{c.lead}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            {matching.length > 0 && <a href="#tours" className="btn btn-teal">{L.seeTours}</a>}
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-outline">{d.common.askWhatsApp}</a>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16">
        <div className="container-x max-w-3xl space-y-4 text-lg leading-relaxed">
          {c.intro.map((p) => <p key={p}>{p}</p>)}
        </div>
      </section>

      {/* Cards: parks / process / courses */}
      <section className="bg-sand py-16">
        <div className="container-x max-w-6xl!">
          <SectionHeading title={c.cardsTitle} className="mb-10" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {c.cards.map((card) => (
              <article key={card.title} className="flex flex-col bg-white ring-1 ring-black/5">
                {card.image && (
                  <div className="relative aspect-[3/2] overflow-hidden">
                    <Image src={card.image.src} alt={card.image.alt} fill sizes="(min-width: 1024px) 360px, (min-width: 768px) 50vw, 100vw" className="object-cover" />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-xl text-ink">{card.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed">{card.text}</p>
                  {card.note && <p className="mt-4 border-t border-black/10 pt-3 text-xs text-ink/70">{card.note}</p>}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Tours */}
      {matching.length > 0 && (
        <section id="tours" className="scroll-mt-4 py-16">
          <div className="container-x max-w-6xl!">
            <SectionHeading title={fmt(L.toursTitle, { category: L.category[c.category] ?? c.category })} className="mb-10" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {matching.map((t) => <TourCard key={t.slug} tour={t} />)}
            </div>
            <p className="mt-8 text-center text-sm">
              {L.tailor} <a href="#enquire" className="underline">{L.tellUs}</a>
            </p>
          </div>
        </section>
      )}

      {/* Extra info */}
      {c.extra && (
        <section className={matching.length > 0 ? "bg-sand py-16" : "py-16"}>
          <div className="container-x max-w-3xl">
            <h2 className="text-3xl text-ink">{c.extraTitle}</h2>
            <span className="mt-3 mb-6 block h-0.5 w-20 bg-teal" />
            <div className="space-y-4 leading-relaxed">
              {c.extra.map((p) => <p key={p}>{p}</p>)}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="py-16">
        <div className="container-x max-w-3xl">
          <SectionHeading title={d.common.questions} className="mb-8" />
          <div className="divide-y divide-teal/40 border-y border-teal/40">
            {c.faqs.map((f) => (
              <details key={f.q} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-ink [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <ChevronDown className="size-5 shrink-0 text-teal-dark transition-transform group-open:rotate-180" aria-hidden="true" />
                </summary>
                <p className="mt-3 text-sm leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Enquiry */}
      <section id="enquire" className="scroll-mt-4 bg-sand py-16">
        <div className="container-x max-w-3xl">
          <SectionHeading title={L.planTitle} className="mb-4" />
          <p className="mb-8 text-center text-sm leading-relaxed">{L.planText}</p>
          <ServiceEnquiryForm packages={packages} />
        </div>
      </section>
    </>
  );
}
