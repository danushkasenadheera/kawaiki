import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { TourEditor } from "@/components/admin/tour-editor";
import { requireAdmin } from "@/lib/admin/auth";
import type { TourInput } from "@/lib/admin/validate";
import type { TourRow } from "@/lib/tours";

export const metadata: Metadata = { title: "Edit package" };

async function Editor({ params, searchParams }: PageProps<"/admin/tours/[id]">) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("tours").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const r = data as TourRow;

  const initial: TourInput = {
    id: r.id,
    slug: r.slug,
    title: r.title,
    duration: r.duration,
    summary: r.summary,
    price: r.price,
    itineraryTitle: r.itinerary_title,
    image: r.image,
    imageAlt: r.image_alt,
    heroImage: r.hero_image,
    heroAlt: r.hero_alt,
    days: r.days ?? [],
    includes: r.includes ?? [],
    excludes: r.excludes ?? [],
    notes: r.notes ?? [],
    highlights: r.highlights ?? [],
    categories: r.categories ?? [],
    seoTitle: r.seo_title ?? "",
    seoDescription: r.seo_description ?? "",
    ja: r.ja ?? {},
    published: r.published,
  };

  // `key` resets the editor if a different package is opened.
  return <TourEditor key={r.id} initial={initial} created={sp.created === "1"} />;
}

export default function EditTourPage(props: PageProps<"/admin/tours/[id]">) {
  return (
    <Suspense fallback={<div className="h-96 animate-pulse rounded-lg bg-white" />}>
      <Editor {...props} />
    </Suspense>
  );
}
