import Link from "next/link";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { PageBanner } from "@/components/page-banner";
import { getDict, getLp } from "@/lib/i18n/server";

export default async function NotFound() {
  const [d, lp] = await Promise.all([getDict(), getLp()]);
  return (
    <>
      <Header />
      <main className="flex-1">
        <PageBanner title={d.notFound.title} />
        <section className="container-x py-20 text-center">
          <p className="text-lg">{d.notFound.text}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href={lp("/")} className="btn btn-teal">{d.notFound.home}</Link>
            <Link href={lp("/packages/")} className="btn btn-teal">{d.notFound.packages}</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
