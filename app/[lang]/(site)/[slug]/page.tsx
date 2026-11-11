import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, CalendarDays, Check, Clock, Headset, Info, Languages, MapPin, Pencil, Plane, Route as RouteIcon, Wallet, X } from "lucide-react";
import { BookingForm } from "@/components/forms";
import { Gallery } from "@/components/gallery";
import { Itinerary } from "@/components/itinerary";
import { JsonLd } from "@/components/json-ld";
import { RouteMap } from "@/components/route-map";
import { TourCard } from "@/components/tour-card";
import { fmt } from "@/lib/i18n/dict/en";
import { pageMeta } from "@/lib/i18n/meta";
import { getDict, getLocale, getLp } from "@/lib/i18n/server";
import { placeName } from "@/lib/places";
import { breadcrumbSchema, tourSchema } from "@/lib/schema";
import { site, type Img } from "@/lib/site";
import { dayCount, getTour, getTours, metaDescription, priceAmount, routeStops, startsAndEndsAtAirport, totalKm } from "@/lib/tours";

// Every real tour is prerendered below, so links to them are already instant.
// Only unknown slugs render on request, and those should block so they return a real 404.
export const instant = false;

export async function generateStaticParams() {
  return (await getTours()).map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const tour = await getTour(slug, locale);
  if (!tour) return {};
  return pageMeta(locale, `/${tour.slug}/`, {
    // A custom search title is used as-is; otherwise "<Title> - Kawaiki Tours & Travels".
    title: tour.seoTitle || tour.title,
    absolute: Boolean(tour.seoTitle),
    description: tour.seoDescription || metaDescription(tour.summary, locale === "ja" ? 110 : 155),
    image: tour.hero.src || tour.image,
  });
}

function WhatsAppIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 0C5.4 0 0 5.4 0 12c0 2.1.6 4.2 1.6 6L0 24l6.2-1.6c1.8 1 3.8 1.5 5.8 1.5 6.6 0 12-5.4 12-12S18.6 0 12 0zm0 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4C2.7 15.6 2.2 13.8 2.2 12 2.2 6.6 6.6 2.2 12 2.2S21.8 6.6 21.8 12 17.4 21.8 12 21.8zm5.5-7.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5 1.9.8 2.6.9 3.6.7.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3z" />
    </svg>
  );
}

export default async function TourPage({ params }: PageProps<"/[lang]/[slug]">) {
  const { slug } = await params;
  const [d, locale, lp] = await Promise.all([getDict(), getLocale(), getLp()]);
  const [tour, english, all] = await Promise.all([getTour(slug, locale), getTour(slug, "en"), getTours(locale)]);
  if (!tour || !english) notFound();
  const t = d.tour;

  const price = priceAmount(english);
  const days = dayCount(english);
  // Route facts come from the English itinerary ("Overnight: Kandy"); names are shown in the page language.
  const km = totalKm(english);
  const stops = routeStops(english);
  const placesOnly = stops.filter((p) => p.key !== "cmb");
  const uniquePlaces = placesOnly.filter((p, i, a) => a.findIndex((x) => x.key === p.key) === i);
  const routeText = uniquePlaces.map((p) => placeName(p, locale)).join(" → ");
  const airport = startsAndEndsAtAirport(english);
  const pageUrl = `${site.url}${lp(`/${tour.slug}/`)}`;
  const wa = `${site.whatsapp}?text=${encodeURIComponent(fmt(t.whatsappTour, { title: tour.title, url: pageUrl }))}`;
  const priceText = price ? fmt(t.priceFrom, { price: price.toLocaleString("en-US") }) : "";
  const nights = Math.max(days - 1, 1);

  // Every photo on the page, without duplicates, for the gallery.
  const photos: Img[] = [tour.hero, ...tour.days.flatMap((x) => x.images)].filter(
    (img, i, arr) => img.src && arr.findIndex((x) => x.src === img.src) === i,
  );

  // Related: share a category first, then the rest, max 3.
  const others = all.filter((x) => x.slug !== tour.slug);
  const related = [
    ...others.filter((x) => x.categories.some((c) => tour.categories.includes(c))),
    ...others.filter((x) => !x.categories.some((c) => tour.categories.includes(c))),
  ].slice(0, 3);

  const facts = [
    { icon: CalendarDays, label: t.duration, value: fmt(d.common.daysNights, { d: days, n: nights }) },
    routeText && { icon: RouteIcon, label: t.route, value: routeText },
    km > 0 && { icon: MapPin, label: t.driving, value: fmt(t.drivingValue, { km: Math.round(km / 10) * 10 }) },
    airport ? { icon: Plane, label: t.startsEnds, value: t.airportValue } : price && { icon: Wallet, label: t.price, value: priceText },
  ].filter(Boolean) as { icon: typeof Clock; label: string; value: string }[];

  const trust = [d.trust.approved, d.trust.since, d.trust.payOnArrival, d.trust.freeChanges, d.trust.support];

  return (
    <>
      <JsonLd
        data={[
          tourSchema(english),
          breadcrumbSchema([
            { name: d.common.home, path: lp("/") },
            { name: d.common.packages, path: lp("/packages/") },
            { name: tour.title, path: lp(`/${tour.slug}/`) },
          ]),
        ]}
      />

      {/* Hero */}
      <section className="relative isolate flex min-h-[560px] items-end overflow-hidden md:min-h-[680px]">
        <Image src={tour.hero.src} alt={tour.hero.alt} fill loading="eager" fetchPriority="high" sizes="100vw" className="-z-20 object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/90 via-ink/45 to-ink/40" />
        <div className="container-x max-w-6xl! pt-52 pb-12 text-white">
          <nav aria-label="Breadcrumb" className="mb-4 text-sm text-white/80">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li><Link href={lp("/")} className="hover:text-teal">{d.common.home}</Link></li>
              <li aria-hidden="true">»</li>
              <li><Link href={lp("/packages/")} className="hover:text-teal">{d.common.packages}</Link></li>
              <li aria-hidden="true">»</li>
              <li aria-current="page">{tour.title}</li>
            </ol>
          </nav>
          {tour.categories.length > 0 && (
            <ul className="mb-3 flex flex-wrap gap-2">
              {tour.categories.map((c) => (
                <li key={c} className="border border-white/40 px-2.5 py-0.5 text-xs tracking-wide uppercase">{d.ui.categories[c] ?? c}</li>
              ))}
            </ul>
          )}
          <h1 className="max-w-3xl text-4xl leading-tight md:text-6xl">{tour.title}</h1>
          <p className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-lg">
            <span className="flex items-center gap-2"><Clock className="size-5 text-teal" /> {fmt(d.common.days, { n: days })}</span>
            {price && (
              <span>
                <b className="text-2xl">{priceText}</b> {d.common.perPerson}
              </span>
            )}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#request" className="btn btn-teal">{t.requestTour}</a>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              <WhatsAppIcon /> {d.common.askWhatsApp}
            </a>
          </div>
        </div>
      </section>

      {/* Quick facts */}
      <section aria-label={t.factsAria} className="border-b border-black/10 bg-sand">
        <dl className="container-x grid max-w-6xl! gap-x-8 gap-y-4 py-6 sm:grid-cols-2 lg:grid-cols-4">
          {facts.map((f) => (
            <div key={f.label} className="relative pl-8">
              <dt className="text-xs tracking-wide text-ink/70 uppercase">
                <f.icon className="absolute top-0.5 left-0 size-5 text-teal-dark" aria-hidden="true" />
                {f.label}
              </dt>
              <dd className="text-sm font-semibold">{f.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {locale === "ja" && !tour.translated && (
        <p className="container-x mt-6 flex max-w-6xl! items-start gap-2 bg-teal/10 p-3 text-sm">
          <Languages className="mt-0.5 size-4 shrink-0 text-teal-dark" aria-hidden="true" /> {t.englishOnly}
        </p>
      )}

      <div className="container-x grid max-w-6xl! gap-12 py-14 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-14">
          {/* Overview */}
          <section>
            <h2 className="text-3xl text-ink">{t.overview}</h2>
            <p className="mt-4 leading-relaxed">{tour.summary}</p>
            {tour.highlights.length > 0 && (
              <>
                <h3 className="mt-8 text-xl text-ink">{t.highlights}</h3>
                <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
                  {tour.highlights.map((h) => (
                    <li key={h} className="flex gap-2.5 text-sm">
                      <Check className="mt-0.5 size-4 shrink-0 text-teal-dark" aria-hidden="true" /> {h}
                    </li>
                  ))}
                </ul>
              </>
            )}
            <div className="mt-8 flex gap-4 border-l-4 border-teal bg-teal/10 p-5">
              <Pencil className="mt-1 size-5 shrink-0 text-teal-dark" aria-hidden="true" />
              <div>
                <p className="font-semibold">{t.makeItYours}</p>
                <p className="mt-1 text-sm leading-relaxed">
                  {t.makeItYoursText} <a href="#request" className="underline">{t.tellUs}</a>.
                </p>
              </div>
            </div>
          </section>

          {/* Route */}
          {placesOnly.length >= 2 && (
            <section>
              <h2 className="text-3xl text-ink">{t.yourRoute}</h2>
              <div className="mt-6 grid items-center gap-8 md:grid-cols-[1fr_1fr]">
                <RouteMap stops={stops} title={tour.title} locale={locale} airportLabel={`✈ ${t.airportShort}`} />
                <ol className="space-y-3">
                  {uniquePlaces.map((p, i) => (
                    <li key={p.key} className="flex items-center gap-3">
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-pink text-xs font-bold text-white">{i + 1}</span>
                      {placeName(p, locale)}
                    </li>
                  ))}
                  {airport && (
                    <li className="flex items-center gap-3 text-sm text-ink/70">
                      <Plane className="size-5" aria-hidden="true" /> {t.startsEndsAirport}
                    </li>
                  )}
                </ol>
              </div>
            </section>
          )}

          {/* Itinerary */}
          <section>
            <h2 className="text-3xl text-ink">{t.dayByDay}</h2>
            {tour.itineraryTitle && <p className="mt-1 text-sm text-ink/60">{tour.itineraryTitle}</p>}
            <div className="mt-4">
              <Itinerary days={tour.days} />
            </div>
          </section>

          {/* Inclusions */}
          {(tour.includes.length > 0 || tour.excludes.length > 0) && (
            <section>
              <h2 className="text-3xl text-ink">{t.whatsIncluded}</h2>
              <div className="mt-6 grid gap-8 md:grid-cols-2">
                {tour.includes.length > 0 && (
                  <div>
                    <h3 className="mb-3 text-lg text-ink">{t.included}</h3>
                    <ul className="space-y-2 text-sm">
                      {tour.includes.map((x) => (
                        <li key={x} className="flex gap-2.5"><Check className="mt-0.5 size-4 shrink-0 text-teal-dark" aria-hidden="true" /> {x}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {tour.excludes.length > 0 && (
                  <div>
                    <h3 className="mb-3 text-lg text-ink">{t.notIncluded}</h3>
                    <ul className="space-y-2 text-sm">
                      {tour.excludes.map((x) => (
                        <li key={x} className="flex gap-2.5"><X className="mt-0.5 size-4 shrink-0 text-pink" aria-hidden="true" /> {x}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              {tour.notes.length > 0 && (
                <div className="mt-8 flex gap-4 bg-sand p-5">
                  <Info className="mt-0.5 size-5 shrink-0 text-blue" aria-hidden="true" />
                  <div>
                    <h3 className="font-semibold">{t.goodToKnow}</h3>
                    <ul className="mt-2 list-disc space-y-1 pl-4 text-sm">
                      {tour.notes.map((n) => <li key={n}>{n}</li>)}
                    </ul>
                    <p className="mt-3 text-sm">
                      {t.seeAlsoTerms} <Link href={lp("/terms/")} className="underline">{d.common.terms}</Link>
                    </p>
                  </div>
                </div>
              )}
            </section>
          )}

          {photos.length >= 3 && (
            <section>
              <h2 className="text-3xl text-ink">{t.photos}</h2>
              <div className="mt-6">
                <Gallery images={photos} />
              </div>
            </section>
          )}
        </div>

        {/* Sticky booking card (desktop) */}
        <aside className="hidden lg:block">
          <div className="sticky top-6 bg-white p-6 shadow-lg ring-1 ring-black/5">
            {price ? (
              <p>
                <b className="text-3xl">{priceText}</b> <span className="text-sm">{d.common.perPerson}</span>
              </p>
            ) : (
              <p className="text-lg font-semibold">{t.priceOnRequest}</p>
            )}
            {tour.price && <p className="mt-1 text-xs text-ink/60">{tour.price}</p>}
            <p className="mt-4 flex items-center gap-2 text-sm"><Clock className="size-4 text-teal-dark" /> {fmt(d.common.daysNights, { d: days, n: nights })}</p>
            <a href="#request" className="btn btn-teal mt-5 w-full">{t.requestTour}</a>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn mt-2 w-full border border-[#25d366] text-ink hover:bg-[#25d366]/10">
              <WhatsAppIcon className="size-4 text-[#25d366]" /> {d.common.askWhatsApp}
            </a>
            <ul className="mt-6 space-y-2 border-t border-black/10 pt-5 text-sm">
              {trust.map((x) => (
                <li key={x} className="flex gap-2"><BadgeCheck className="mt-0.5 size-4 shrink-0 text-teal-dark" aria-hidden="true" /> {x}</li>
              ))}
            </ul>
            <a href={`tel:${site.phone}`} className="mt-5 flex items-center gap-2 text-sm hover:text-teal-dark">
              <Headset className="size-4" /> {site.phone}
            </a>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="bg-sand py-14">
          <div className="container-x max-w-6xl!">
            <h2 className="mb-8 text-3xl text-ink">{t.youMayLike}</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {related.map((x) => <TourCard key={x.slug} tour={x} />)}
            </div>
          </div>
        </section>
      )}

      {/* Request form */}
      <section id="request" className="scroll-mt-4 py-16">
        <div className="container-x max-w-3xl">
          <h2 className="text-center text-3xl text-ink md:text-4xl">{t.requestTour}</h2>
          <span className="mx-auto mt-4 mb-6 block h-0.5 w-40 bg-teal" />
          <p className="mb-8 text-center text-sm leading-relaxed">{t.requestText}</p>
          <BookingForm packages={all.map((x) => x.title)} defaultPackage={tour.title} submit="sendRequest" />
        </div>
      </section>

      {/* Sticky price bar (phones and tablets) */}
      <div className="tour-mobile-bar fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-black/10 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="text-sm leading-tight">
          {price ? (
            <>
              <b className="text-lg">{priceText}</b>
              <br />
              <span className="text-xs text-ink/60">{fmt(t.perPersonDays, { n: days })}</span>
            </>
          ) : (
            <b>{fmt(d.common.days, { n: days })}</b>
          )}
        </div>
        <a href="#request" className="btn btn-teal shrink-0">{t.requestShort}</a>
      </div>
      <div className="h-16 lg:hidden" aria-hidden="true" />
    </>
  );
}
