import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import { fmt } from "@/lib/i18n/dict/en";
import { getDict, getLocale } from "@/lib/i18n/server";
import { images, site, type Img } from "@/lib/site";
import { getPackageNames } from "@/lib/tours";
import { SocialLinks } from "./icons";
import { BookingForm, ContactForm } from "./forms";
import { SectionHeading } from "./page-banner";

export async function ContactInfo() {
  const t = (await getDict()).sections;
  return (
    <ul className="grid gap-8 text-center text-sm sm:grid-cols-3">
      <li className="flex flex-col items-center">
        <MapPin className="mb-2 size-9 text-teal" />
        <b className="mb-1">{t.address}</b>
        <span className="text-left leading-relaxed">
          {site.legalName},<br />
          58/21, 3rd Lane, Soma Thalagala Mw,<br />
          Gangodawila, Nugegoda.<br />
          Sri Lanka. 10250
        </span>
      </li>
      <li className="flex flex-col items-center">
        <Phone className="mb-2 size-9 fill-teal text-teal" />
        <b className="mb-1">{t.phone}</b>
        <a href={`tel:${site.phone}`} className="hover:text-teal-dark">{site.phone}</a>
      </li>
      <li className="flex flex-col items-center">
        <Mail className="mb-2 size-9 text-teal" />
        <b className="mb-1">{t.email}</b>
        <a href={`mailto:${site.email}`} className="hover:text-teal-dark">{site.email}</a>
      </li>
    </ul>
  );
}

export async function ContactSection() {
  const d = await getDict();
  const t = d.sections;
  return (
    <section className="relative isolate overflow-hidden py-16">
      <Image src={images.contactBg.src} alt="" fill sizes="100vw" className="-z-20 object-cover opacity-60" />
      <div className="absolute inset-0 -z-10 bg-white/55" />
      <div className="container-x">
        <SectionHeading title={t.contactUs} className="mb-10" />
        <div className="mx-auto max-w-4xl">
          <ContactInfo />
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <a
            href={`${site.whatsapp}?text=${encodeURIComponent(d.common.whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn bg-[#25d366] px-6 py-3 text-ink hover:bg-[#1fbd5a]"
          >
            {t.chatWa}
          </a>
          <a href={`tel:${site.phone}`} className="btn border border-ink/30 bg-white px-6 py-3">{fmt(t.call, { phone: site.phone })}</a>
        </div>
        <SectionHeading title={t.getInTouch} className="mt-14 mb-6" />
        <p className="mx-auto mb-6 max-w-lg text-center text-sm leading-relaxed">{t.getInTouchText}</p>
        <div className="mx-auto max-w-3xl">
          <ContactForm />
        </div>
        <SocialLinks className="mt-8 justify-center" />
      </div>
    </section>
  );
}

export async function BookNowSection({ title }: { title?: string }) {
  const [d, locale] = await Promise.all([getDict(), getLocale()]);
  const packageNames = await getPackageNames(locale);
  return (
    <section className="py-16">
      <div className="container-x max-w-3xl">
        <SectionHeading title={title ?? d.sections.bookNowTitle} className="mb-6" />
        <p className="mb-8 text-center text-sm leading-relaxed">{d.sections.bookNowText}</p>
        <BookingForm packages={packageNames} />
      </div>
    </section>
  );
}

export async function CustomTourSection() {
  const [d, locale] = await Promise.all([getDict(), getLocale()]);
  const packageNames = await getPackageNames(locale);
  const t = d.sections;
  return (
    <section className="py-16">
      <div className="container-x max-w-3xl text-center">
        <h2 className="text-3xl text-ink md:text-4xl">{t.customTitle}</h2>
        <span className="mx-auto mt-4 mb-6 block h-0.5 w-40 bg-teal" />
        <p className="mb-3 text-sm leading-relaxed">{t.customText1}</p>
        <p className="mb-8 text-sm leading-relaxed">{t.customText2}</p>
        <div className="text-left">
          <BookingForm packages={packageNames} showPackage={false} submit="send" />
        </div>
      </div>
    </section>
  );
}

export function ImageGrid({ items }: { items: Img[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4">
      {items.map((g) => (
        <div key={g.src} className="group relative aspect-square overflow-hidden">
          <Image src={g.src} alt={g.alt} fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-110" />
        </div>
      ))}
    </div>
  );
}
