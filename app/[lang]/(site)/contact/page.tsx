import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Building2, Clock, LifeBuoy, Mail, MapPin, Phone } from "lucide-react";
import { SocialLinks } from "@/components/icons";
import { MapEmbed } from "@/components/map-embed";
import { ServiceEnquiryForm } from "@/components/service-enquiry-form";
import { pageMeta } from "@/lib/i18n/meta";
import { getDict, getLocale, getLp } from "@/lib/i18n/server";
import { images, site } from "@/lib/site";
import { getPackageNames } from "@/lib/tours";

export async function generateMetadata(): Promise<Metadata> {
  const [d, locale] = await Promise.all([getDict(), getLocale()]);
  return pageMeta(locale, "/contact/", { title: d.contact.metaTitle, description: d.contact.metaDescription, absolute: true });
}

function WhatsAppIcon({ className = "size-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 0C5.4 0 0 5.4 0 12c0 2.1.6 4.2 1.6 6L0 24l6.2-1.6c1.8 1 3.8 1.5 5.8 1.5 6.6 0 12-5.4 12-12S18.6 0 12 0zm0 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4C2.7 15.6 2.2 13.8 2.2 12 2.2 6.6 6.6 2.2 12 2.2S21.8 6.6 21.8 12 17.4 21.8 12 21.8zm5.5-7.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5 1.9.8 2.6.9 3.6.7.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3z" />
    </svg>
  );
}

const quickLinks = ["/faq/", "/terms/", "/faq/"];

export default async function ContactPage() {
  const [d, locale, lp] = await Promise.all([getDict(), getLocale(), getLp()]);
  const t = d.contact;
  const packages = await getPackageNames(locale);
  const wa = `${site.whatsapp}?text=${encodeURIComponent(d.common.whatsappMessage)}`;
  const waBooking = `${site.whatsapp}?text=${encodeURIComponent(t.bookedMessage)}`;

  const channels = [
    { icon: <WhatsAppIcon />, title: t.waTitle, text: t.waText, action: d.common.chatWhatsApp, href: wa, external: true, accent: "bg-[#25d366] text-white" },
    { icon: <Phone className="size-7" aria-hidden="true" />, title: t.callTitle, text: site.phone, action: t.callNow, href: `tel:${site.phone}`, accent: "bg-teal text-ink" },
    { icon: <Mail className="size-7" aria-hidden="true" />, title: t.emailTitle, text: site.email, action: t.sendEmail, href: `mailto:${site.email}`, accent: "bg-ink text-white" },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative isolate flex min-h-[520px] items-end overflow-hidden md:min-h-[600px]">
        <Image src={images.pageBanner.src} alt={images.pageBanner.alt} fill loading="eager" fetchPriority="high" sizes="100vw" className="-z-20 object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/85 via-ink/40 to-ink/40" />
        <div className="container-x max-w-6xl! pt-52 pb-14 text-white">
          <nav aria-label="Breadcrumb" className="mb-4 text-sm text-white/80">
            <Link href={lp("/")} className="hover:text-teal">{d.common.home}</Link> <span aria-hidden="true">»</span> <span aria-current="page">{t.crumb}</span>
          </nav>
          <h1 className="max-w-3xl text-4xl leading-tight md:text-6xl">{t.h1}</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/90">{t.lead}</p>
        </div>
      </section>

      {/* Contact channels */}
      <section aria-label={t.channelsAria} className="relative z-10 -mt-10">
        <div className="container-x grid max-w-6xl! gap-4 md:grid-cols-3">
          {channels.map((c) => (
            <div key={c.title} className="flex flex-col bg-white p-6 shadow-lg ring-1 ring-black/5">
              <span className={`flex size-12 items-center justify-center rounded-full ${c.accent}`}>{c.icon}</span>
              <h2 className="mt-4 text-2xl text-ink">{c.title}</h2>
              <p className="mt-1 flex-1 text-sm break-words">{c.text}</p>
              <a
                href={c.href}
                {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="mt-5 inline-flex items-center gap-1.5 self-start font-semibold hover:text-teal-dark"
              >
                {c.action} <ArrowRight className="size-4" aria-hidden="true" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Form + sidebar */}
      <section className="py-16">
        <div className="container-x grid max-w-6xl! gap-12 lg:grid-cols-[1fr_320px]">
          <div id="enquire" className="scroll-mt-4">
            <h2 className="text-3xl text-ink">{t.formTitle}</h2>
            <p className="mt-2 mb-6 flex items-center gap-2 text-sm">
              <BadgeCheck className="size-4 text-teal-dark" aria-hidden="true" />
              {t.reassure}
            </p>
            <ServiceEnquiryForm packages={packages} include={["tour", "transfer", "car", "hotel", "flight", "booking", "partner", "other"]} />
          </div>

          <aside className="space-y-6">
            <div className="bg-sand p-6">
              <h2 className="text-xl text-ink">{t.office}</h2>
              <p className="mt-3 flex gap-3 text-sm leading-relaxed">
                <MapPin className="mt-0.5 size-4 shrink-0 text-teal-dark" aria-hidden="true" />
                <span>
                  {site.legalName}
                  <br />
                  58/21, 3rd Lane, Soma Thalagala Mw,
                  <br />
                  Gangodawila, Nugegoda,
                  <br />
                  Sri Lanka 10250
                </span>
              </p>
              <p className="mt-3 flex gap-3 text-sm">
                <Clock className="mt-0.5 size-4 shrink-0 text-teal-dark" aria-hidden="true" /> {d.ui.header.hours}
              </p>
              <SocialLinks className="mt-5" />
            </div>

            <div className="border border-black/10 p-6">
              <h2 className="flex items-center gap-2 text-lg text-ink">
                <LifeBuoy className="size-5 text-teal-dark" aria-hidden="true" /> {t.bookedTitle}
              </h2>
              <p className="mt-2 text-sm leading-relaxed">{t.bookedText}</p>
              <a href={waBooking} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold hover:text-teal-dark">
                {t.bookedLink} <ArrowRight className="size-4" aria-hidden="true" />
              </a>
            </div>

            <div className="border border-black/10 p-6">
              <h2 className="flex items-center gap-2 text-lg text-ink">
                <Building2 className="size-5 text-teal-dark" aria-hidden="true" /> {t.operatorTitle}
              </h2>
              <p className="mt-2 text-sm leading-relaxed">{t.operatorText}</p>
              <a href="#enquire-partner" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold hover:text-teal-dark">
                {t.operatorLink} <ArrowRight className="size-4" aria-hidden="true" />
              </a>
            </div>

            <div className="p-1">
              <h2 className="text-lg text-ink">{t.quickAnswers}</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {t.quick.map((q, i) => (
                  <li key={q}>
                    <Link href={lp(quickLinks[i])} className="underline underline-offset-2 hover:text-teal-dark">{q}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <section aria-label={t.mapAria}>
        <MapEmbed />
      </section>
    </>
  );
}
