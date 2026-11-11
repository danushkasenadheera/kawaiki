import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { getDict, getLp } from "@/lib/i18n/server";
import { site } from "@/lib/site";
import { SocialLinks } from "./icons";

export async function Footer() {
  const [d, lp] = await Promise.all([getDict(), getLp()]);
  const t = d.footer;
  return (
    <footer className="bg-teal text-ink">
      <div className="container-x grid gap-10 pt-16 pb-8 md:grid-cols-[1.25fr_0.9fr_1.25fr]">
        <div>
          <h2 className="mb-3 text-[1.7rem]">{site.name}</h2>
          <p className="text-sm leading-relaxed">{t.blurb}</p>
        </div>
        <div>
          <h2 className="mb-3 text-[1.7rem]">{t.popularTours}</h2>
          <ul className="space-y-1.5 text-sm">
            <li><Link href={lp("/sri-lanka-wildlife-tours/")} className="hover:underline">{t.wildlife}</Link></li>
            <li><Link href={lp("/sri-lanka-gem-mining-tours/")} className="hover:underline">{t.gems}</Link></li>
            <li><Link href={lp("/sri-lanka-golf-tours/")} className="hover:underline">{t.golf}</Link></li>
            <li><Link href={lp("/packages/")} className="hover:underline">{t.allPackages}</Link></li>
          </ul>
          <h2 className="mt-6 mb-3 text-[1.7rem]">{t.social}</h2>
          <SocialLinks variant="plain" />
        </div>
        <div>
          <h2 className="mb-3 text-[1.7rem]">{t.getInTouch}</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-3">
              <MapPin className="size-4 shrink-0" />
              <span>
                {site.legalName},<br />
                58/21, 3rd Lane, Soma Thalagala Mw,<br />
                Gangodawila, Nugegoda.<br />
                Sri Lanka. 10250
              </span>
            </li>
            <li><a href={`tel:${site.phone}`} className="flex items-center gap-3 hover:underline"><Phone className="size-4 shrink-0" />{site.phone}</a></li>
            <li><a href={`mailto:${site.email}`} className="flex items-center gap-3 hover:underline"><Mail className="size-4 shrink-0" />{site.email}</a></li>
          </ul>
        </div>
      </div>
      <div className="container-x flex flex-col items-center justify-between gap-2 pb-8 text-sm sm:flex-row">
        <p>{t.copyright}</p>
        <nav aria-label="Legal" className="flex gap-4">
          <Link href={lp("/faq/")} className="hover:underline">{d.common.faq}</Link>
          <Link href={lp("/terms/")} className="hover:underline">{d.common.terms}</Link>
          <Link href={lp("/privacy/")} className="hover:underline">{d.common.privacy}</Link>
        </nav>
        <p>{t.poweredBy}</p>
      </div>
    </footer>
  );
}
