import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { PageBanner } from "@/components/page-banner";
import { pageMeta } from "@/lib/i18n/meta";
import { getDict, getLocale, getLp } from "@/lib/i18n/server";
import { faqSchema } from "@/lib/schema";

export async function generateMetadata(): Promise<Metadata> {
  const [d, locale] = await Promise.all([getDict(), getLocale()]);
  return pageMeta(locale, "/faq/", { title: d.faqPage.metaTitle, description: d.faqPage.metaDescription, absolute: true });
}

export default async function FaqPage() {
  const [d, lp] = await Promise.all([getDict(), getLp()]);
  const t = d.faqPage;
  return (
    <>
      <JsonLd data={faqSchema(t.faqs)} />
      <PageBanner title={t.banner} />
      <section className="py-16">
        <div className="container-x max-w-3xl">
          <div className="divide-y divide-teal/40 border-y border-teal/40">
            {t.faqs.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg text-ink [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <ChevronDown className="size-5 shrink-0 text-teal-dark transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
          <p className="mt-10 text-center text-sm">
            {t.still} <Link href={lp("/contact/")} className="underline">{t.contactUs}</Link> {t.orRead}{" "}
            <Link href={lp("/terms/")} className="underline">{d.common.terms}</Link>
          </p>
        </div>
      </section>
    </>
  );
}
