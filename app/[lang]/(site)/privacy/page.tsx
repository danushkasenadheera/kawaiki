import type { Metadata } from "next";
import { PageBanner } from "@/components/page-banner";
import { fmt } from "@/lib/i18n/dict/en";
import { pageMeta } from "@/lib/i18n/meta";
import { getDict, getLocale } from "@/lib/i18n/server";
import { site } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const [d, locale] = await Promise.all([getDict(), getLocale()]);
  return pageMeta(locale, "/privacy/", { title: d.privacyPage.metaTitle, description: d.privacyPage.metaDescription });
}

export default async function PrivacyPage() {
  const t = (await getDict()).privacyPage;
  return (
    <>
      <PageBanner title={t.banner} />
      <section className="py-16">
        <div className="container-x max-w-3xl">
          <p className="mb-10 text-sm">{fmt(t.intro, { company: site.legalName })}</p>
          <div className="space-y-8">
            {t.sections.map((s) => (
              <div key={s.title}>
                <h2 className="mb-2 text-2xl text-ink">{s.title}</h2>
                <p className="text-sm leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
          <p className="mt-12 text-sm">
            {t.contact} <a href={`mailto:${site.email}`} className="underline">{site.email}</a>, {site.address}.
          </p>
        </div>
      </section>
    </>
  );
}
