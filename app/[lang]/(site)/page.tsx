import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Camera, ChevronsDown, Clock, Headset, Wallet } from "lucide-react";
import { SocialLinks } from "@/components/icons";
import { LocalTime } from "@/components/local-time";
import { SectionHeading } from "@/components/page-banner";
import { ContactSection } from "@/components/sections";
import { HowItWorks } from "@/components/shared-sections";
import { StripCarousel } from "@/components/strip-carousel";
import { TourCard } from "@/components/tour-card";
import { TripBuilder } from "@/components/trip-builder";
import { fmt, type Dict } from "@/lib/i18n/dict/en";
import { pageMeta } from "@/lib/i18n/meta";
import { getDict, getLocale, getLp } from "@/lib/i18n/server";
import { experienceSlides, images, memories } from "@/lib/site";
import { dayCount, getTours, priceAmount, type Tour } from "@/lib/tours";

export async function generateMetadata(): Promise<Metadata> {
  const [d, locale] = await Promise.all([getDict(), getLocale()]);
  return pageMeta(locale, "/", { title: d.home.metaTitle, description: d.home.metaDescription, absolute: true });
}

// Wildlife mosaic: photos supplied by the client. Text comes from the dictionary (same order).
const wild = [
  { href: "/sri-lanka-wildlife-tours/", src: "/images/wild-yala-leopard-tree.jpg", cls: "md:col-span-2 md:row-span-2" },
  { href: "#plan", src: "/images/wild-kumana-leopard.jpg", cls: "" },
  { href: "/sri-lanka-wildlife-tours/", src: "/images/wild-tusker.jpg", cls: "" },
  { href: "#plan", src: "/images/wild-sloth-bear.jpg", cls: "" },
  { href: "#plan", src: "/images/wild-bee-eaters.jpg", cls: "" },
];

const classics = [
  { src: "/images/2025-06-thushal-madhushankha-sigiriya-unsplash.webp", type: "Culture" },
  { src: "/images/2025-06-temple-of-tooth.jpg", type: "Culture" },
  { src: "/images/2025-06-lucija-ros-VC7P8p6dFIc-unsplash-scaled.jpg", type: "Nature" },
  { src: "/images/2025-06-hector-john-periquin-c0xnToEoL34-unsplash-scaled.jpg", type: "Culture" },
  { src: "/images/2025-06-amal-prasad-sri-lanka-beach-unsplash.webp", type: "Beach" },
];

function Rare({ tour, eyebrow, src, alt, href, d }: { tour?: Tour; eyebrow: string; src: string; alt: string; href: string; d: Dict }) {
  if (!tour) return null;
  const price = priceAmount(tour);
  return (
    <Link href={href} className="group relative isolate flex min-h-[420px] items-end overflow-hidden text-white">
      <Image src={src} alt={alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="-z-20 object-cover transition-transform duration-700 group-hover:scale-105" />
      <span className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" />
      <span className="block p-6 md:p-8">
        <span className="text-sm tracking-[0.2em] text-teal uppercase">{eyebrow}</span>
        <span className="mt-2 block text-3xl md:text-4xl">{tour.title}</span>
        <span className="mt-2 block max-w-md text-sm text-white/85">{tour.highlights.slice(0, 2).join(" · ")}</span>
        <span className="mt-4 inline-flex items-center gap-2 text-sm">
          {fmt(d.common.days, { n: dayCount(tour) })}
          {price ? ` · ${fmt(d.tour.priceFrom, { price: price.toLocaleString("en-US") })}` : ""}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </span>
      </span>
    </Link>
  );
}

export default async function Home() {
  const [d, locale, lp] = await Promise.all([getDict(), getLocale(), getLp()]);
  const t = d.home;
  const tours = await getTours(locale);
  const builderTours = tours.map((x) => ({
    slug: x.slug,
    title: x.title,
    image: x.image,
    categories: x.categories,
    days: dayCount(x),
    price: priceAmount(x),
  }));
  const wildlifeTours = tours.filter((x) => x.categories.includes("Wildlife")).slice(0, 3);
  const gemTour = tours.find((x) => x.categories.includes("Gems"));
  const golfTour = tours.find((x) => x.categories.includes("Golf"));
  const waterfall = experienceSlides[3];
  const trust = [
    { icon: Clock, text: d.trust.since },
    { icon: BadgeCheck, text: d.trust.approved },
    { icon: Wallet, text: d.trust.payOnArrival },
    { icon: Headset, text: d.trust.support },
  ];
  const href = (h: string) => (h.startsWith("#") ? h : lp(h));

  return (
    <>
      {/* Hero: Kawaiki's Sigiriya sunrise, with the trip planner beside the headline */}
      <section className="relative isolate overflow-hidden">
        <Image src={images.homeHero.src} alt="" fill loading="eager" fetchPriority="high" sizes="100vw" className="-z-20 object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/50 via-ink/35 to-ink/70" />
        <div className="container-x grid max-w-6xl! min-h-svh items-end gap-10 pt-56 pb-14 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:pt-64">
          <div className="text-white">
            <LocalTime className="mb-5 inline-block bg-ink/40 px-3 py-1 text-sm backdrop-blur" />
            <h1 className="text-4xl leading-tight uppercase md:text-6xl md:leading-[1.25]">{t.h1}</h1>
            <p className="mt-5 max-w-xl text-lg text-white/90">{t.lead}</p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link href={lp("/packages/")} className="btn btn-outline">{d.common.exploreTours}</Link>
              <SocialLinks variant="plain" className="ml-2 text-white" />
            </div>
          </div>
          <TripBuilder tours={builderTours} />
        </div>
        <a href="#wild" aria-label={t.scrollDown} className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 animate-bounce text-white/80 lg:block">
          <ChevronsDown className="size-7" />
        </a>
      </section>

      {/* Trust strip */}
      <section aria-label={t.trustAria} className="bg-teal text-ink">
        <ul className="container-x grid max-w-6xl! gap-x-6 gap-y-3 py-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
          {trust.map((x) => (
            <li key={x.text} className="flex items-center gap-2">
              <x.icon className="size-5 shrink-0" aria-hidden="true" /> {x.text}
            </li>
          ))}
        </ul>
      </section>

      {/* Wildlife first */}
      <section id="wild" className="py-16 md:py-20">
        <div className="container-x max-w-6xl!">
          <SectionHeading title={t.wildTitle} className="mb-4" />
          <p className="mx-auto mb-10 max-w-2xl text-center leading-relaxed text-ink/80">{t.wildLead}</p>

          <div className="grid auto-rows-[240px] gap-3 md:grid-cols-4">
            {wild.map((w, i) => {
              const text = t.wildTiles[i];
              return (
                <Link key={w.src} href={href(w.href)} className={`group relative isolate overflow-hidden ${w.cls}`}>
                  <Image src={w.src} alt={text.alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="-z-20 object-cover transition-transform duration-700 group-hover:scale-105" />
                  <span className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
                  <span className="absolute inset-x-0 bottom-0 p-4 text-white">
                    <span className="flex items-center justify-between gap-2 text-xl">
                      {text.title} <ArrowRight className="size-5 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </span>
                    <span className="text-sm text-white/80">{text.sub}</span>
                  </span>
                </Link>
              );
            })}
          </div>

          {wildlifeTours.length > 0 && (
            <>
              <h3 className="mt-14 mb-6 text-2xl text-ink">{t.wildlifeTours}</h3>
              <div className="grid gap-6 text-ink md:grid-cols-3">
                {wildlifeTours.map((x) => <TourCard key={x.slug} tour={x} />)}
              </div>
            </>
          )}

          <div className="mt-12 flex flex-col items-start justify-between gap-6 border-l-4 border-teal bg-teal/10 p-6 md:flex-row md:items-center md:p-8">
            <div className="flex gap-4">
              <Camera className="mt-1 size-8 shrink-0 text-teal-dark" aria-hidden="true" />
              <div>
                <p className="text-xl text-ink">{t.photoTitle}</p>
                <p className="mt-1 max-w-xl text-sm text-ink/80">{t.photoText}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href="#plan" className="btn btn-teal">{t.planSafari}</a>
              <Link href={lp("/sri-lanka-wildlife-tours/")} className="btn border border-ink/30 bg-white">{t.wildlifeLanding}</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Gems & golf */}
      <section className="bg-sand py-16">
        <div className="container-x max-w-6xl!">
          <SectionHeading title={t.beyondTitle} className="mb-4" />
          <p className="mx-auto mb-10 max-w-2xl text-center text-sm leading-relaxed">{t.beyondLead}</p>
          <div className="grid gap-4 md:grid-cols-2">
            <Rare d={d} tour={gemTour} href={lp(`/${gemTour?.slug ?? ""}/`)} eyebrow={t.gemEyebrow} src="/images/2025-06-gem-1024.jpg" alt={t.gemAlt} />
            <Rare d={d} tour={golfTour} href={lp(`/${golfTour?.slug ?? ""}/`)} eyebrow={t.golfEyebrow} src="/images/2025-06-Golf.webp" alt={t.golfAlt} />
          </div>
          <p className="mt-6 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm">
            <Link href={lp("/sri-lanka-gem-mining-tours/")} className="inline-flex items-center gap-1.5 font-semibold hover:text-teal-dark">
              {t.allAboutGems} <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link href={lp("/sri-lanka-golf-tours/")} className="inline-flex items-center gap-1.5 font-semibold hover:text-teal-dark">
              {t.allAboutGolf} <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </p>
        </div>
      </section>

      {/* Classics */}
      <section className="py-16">
        <div className="container-x max-w-6xl!">
          <SectionHeading title={t.classicsTitle} className="mb-4" />
          <p className="mx-auto mb-10 max-w-2xl text-center text-sm leading-relaxed">{t.classicsLead}</p>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            {classics.map((c, i) => {
              const text = t.classics[i];
              return (
                <Link
                  key={c.src}
                  href={lp(`/packages/?type=${c.type}`)}
                  className={`group relative aspect-[3/4] overflow-hidden ${i === 4 ? "col-span-2 aspect-[3/2] md:col-span-1 md:aspect-[3/4]" : ""}`}
                >
                  <Image src={c.src} alt={text.alt} fill sizes="(min-width: 768px) 20vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <span className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
                  <span className="absolute inset-x-0 bottom-0 p-3 text-sm leading-tight text-white md:text-base">{text.title}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* The Experience */}
      <section className="bg-sand py-16">
        <div className="container-x grid gap-6 lg:grid-cols-[1.25fr_1fr]">
          <div>
            <SectionHeading title={t.experienceTitle} center={false} className="mb-8" />
            <div className="space-y-3 leading-relaxed">
              <p>{t.experience1}</p>
              <p>{t.experience2}</p>
            </div>
            <Link href={lp("/about-us/")} className="mt-4 inline-flex items-center gap-1.5 font-semibold hover:text-teal-dark">
              {d.common.ourStory} <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <div className="mt-5">
              <StripCarousel slides={experienceSlides.slice(0, 3)} itemClass="basis-[calc((100%-24px)/3)]" sizes="(min-width: 1024px) 200px, 33vw" />
            </div>
          </div>
          <div className="relative min-h-[420px] overflow-hidden">
            <Image src={waterfall.src} alt={waterfall.alt} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
          </div>
        </div>
      </section>

      {/* Memories */}
      <section className="py-16">
        <div className="container-x max-w-5xl">
          <SectionHeading title={t.memoriesTitle} className="mb-10" />
          <StripCarousel slides={memories} aspect="aspect-[4/5]" itemClass="basis-full sm:basis-[calc((100%-12px)/2)] lg:basis-[calc((100%-24px)/3)]" />
          <p className="mt-8 text-center">
            <a href="#plan" className="btn btn-teal">{t.planMemories}</a>
          </p>
        </div>
      </section>

      <div className="bg-sand">
        <HowItWorks ctaHref="#plan" />
      </div>

      <ContactSection />
    </>
  );
}
