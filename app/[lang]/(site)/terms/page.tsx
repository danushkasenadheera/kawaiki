import type { Metadata } from "next";
import { PageBanner } from "@/components/page-banner";
import { fmt } from "@/lib/i18n/dict/en";
import { pageMeta } from "@/lib/i18n/meta";
import { getDict, getLocale } from "@/lib/i18n/server";
import { site } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const [d, locale] = await Promise.all([getDict(), getLocale()]);
  return pageMeta(locale, "/terms/", { title: d.termsPage.metaTitle, description: d.termsPage.metaDescription });
}

export default async function TermsPage() {
  const t = (await getDict()).termsPage;
  return (
    <>
      <PageBanner title={t.banner} />
      <section className="py-16">
        <div className="container-x max-w-3xl">
          <p className="mb-10 text-sm">{fmt(t.intro, { company: site.legalName })}</p>
          <dl className="space-y-8">
            {t.terms.map((x) => (
              <div key={x.title}>
                <dt className="mb-2 text-2xl text-ink">{x.title}</dt>
                <dd className="text-sm leading-relaxed">{x.text}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-12 text-sm">{fmt(t.questions, { email: site.email, phone: site.phone })}</p>
        </div>
      </section>
    </>
  );
}
