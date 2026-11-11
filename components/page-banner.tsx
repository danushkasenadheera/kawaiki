import Image from "next/image";
import Link from "next/link";
import { getDict, getLp } from "@/lib/i18n/server";
import { images, type Img } from "@/lib/site";

/** Full-bleed banner behind the transparent header, with title and breadcrumb. */
export async function PageBanner({
  title,
  image = images.pageBanner,
  crumbs = [],
}: {
  title: string;
  image?: Img;
  crumbs?: { href: string; label: string }[];
}) {
  const [d, lp] = await Promise.all([getDict(), getLp()]);
  return (
    <section className="relative isolate flex min-h-[420px] items-end overflow-hidden md:min-h-[640px]">
      <Image src={image.src} alt="" fill loading="eager" fetchPriority="high" sizes="100vw" className="-z-20 object-cover" />
      <div className="absolute inset-0 -z-10 bg-ink/45" />
      <div className="container-x pt-40 pb-20 text-center text-white md:pb-24">
        <h1 className="text-4xl md:text-5xl">{title}</h1>
        <nav aria-label="Breadcrumb" className="mt-3 text-sm">
          <ol className="flex flex-wrap items-center justify-center gap-1.5">
            <li><Link href={lp("/")} className="hover:text-teal">{d.common.home}</Link></li>
            {crumbs.map((c) => (
              <li key={c.href} className="flex items-center gap-1.5">
                <span aria-hidden="true">»</span>
                <Link href={lp(c.href)} className="hover:text-teal">{c.label}</Link>
              </li>
            ))}
            <li className="flex items-center gap-1.5">
              <span aria-hidden="true">»</span>
              <span aria-current="page">{title}</span>
            </li>
          </ol>
        </nav>
      </div>
    </section>
  );
}

export function SectionHeading({
  title,
  center = true,
  light = false,
  as: Tag = "h2",
  className = "mb-12",
}: {
  title: string;
  center?: boolean;
  light?: boolean;
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  return (
    <div className={`${className} ${center ? "text-center" : ""}`}>
      <Tag className={`heading ${center ? "" : "heading-left"} ${light ? "text-white" : "text-ink"}`}>{title}</Tag>
    </div>
  );
}
