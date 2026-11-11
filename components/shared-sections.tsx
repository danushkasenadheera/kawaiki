import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, MessageCircle } from "lucide-react";
import { getDict, getLp } from "@/lib/i18n/server";
import { site } from "@/lib/site";
import { SectionHeading } from "./page-banner";

const interests = [
  { href: "/sri-lanka-gem-mining-tours/", src: "/images/2025-06-gem-1024.jpg" },
  { href: "/sri-lanka-golf-tours/", src: "/images/2025-06-Golf.webp" },
  { href: "/sri-lanka-wildlife-tours/", src: "/images/2025-06-leopard-kumana-thamara.webp" },
  { href: "/sri-lanka-wildlife-tours/", src: "/images/indian-pitta-birdwatching.jpg" },
  { href: "/contact/", src: "/images/2025-06-iStock-862152836-scaled.jpg" },
  { href: "/contact/", src: "/images/2025-06-ella-rock-by-kapila-jayawardana.webp" },
];

export async function SpecialInterestTiles() {
  const [d, lp] = await Promise.all([getDict(), getLp()]);
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
      {interests.map((t, i) => {
        const text = d.sections.interests[i];
        return (
          <Link key={t.src} href={lp(t.href)} className="group relative aspect-[4/3] overflow-hidden">
            <Image src={t.src} alt={text.alt} fill sizes="(min-width: 768px) 33vw, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
            <span className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
            <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 p-3 text-sm leading-tight text-white sm:text-base md:p-4 md:text-xl">
              {text.title} <ArrowRight className="size-5 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </span>
          </Link>
        );
      })}
    </div>
  );
}

export async function HowItWorks({ ctaHref = "#book" }: { ctaHref?: string }) {
  const d = await getDict();
  const t = d.sections;
  const wa = `${site.whatsapp}?text=${encodeURIComponent(d.common.whatsappMessage)}`;
  return (
    <section className="py-16">
      <div className="container-x max-w-6xl!">
        <SectionHeading title={t.howItWorks} className="mb-10" />
        <ol className="grid gap-8 md:grid-cols-3">
          {t.steps.map((s, i) => (
            <li key={s.title} className="text-center">
              <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-teal text-xl text-ink">{i + 1}</span>
              <h3 className="mt-4 text-xl text-ink">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed">{s.text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <a href={ctaHref} className="btn btn-teal">{d.common.startPlanning}</a>
          <a href={wa} target="_blank" rel="noopener noreferrer" className="btn border border-ink/20">
            <MessageCircle className="size-4" aria-hidden="true" /> {d.common.chatWhatsApp}
          </a>
        </div>
      </div>
    </section>
  );
}

export async function TourOperatorsSection() {
  const d = await getDict();
  const t = d.sections;
  return (
    <section className="bg-sand py-14">
      <div className="container-x grid max-w-6xl! items-center gap-8 md:grid-cols-[1fr_auto]">
        <div>
          <h2 className="flex items-center gap-3 text-3xl text-ink">
            <Building2 className="size-8 text-teal-dark" aria-hidden="true" /> {t.operatorsTitle}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed">{t.operatorsText}</p>
        </div>
        <a href={`mailto:${site.email}?subject=${encodeURIComponent(t.operatorsSubject)}`} className="btn btn-teal">
          {d.common.partnerWithUs}
        </a>
      </div>
    </section>
  );
}
