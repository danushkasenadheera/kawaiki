import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";
import { RowActions } from "@/components/admin/row-actions";
import { requireAdmin } from "@/lib/admin/auth";
import { rowToTour, type TourRow } from "@/lib/tours";

export const metadata: Metadata = { title: "Packages" };

async function ToursTable() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from("tours").select("*").order("sort_order").order("created_at");
  if (error) return <p className="text-pink">Could not load packages: {error.message}</p>;
  const tours = (data as TourRow[]).map((r) => rowToTour(r));

  if (!tours.length) {
    return (
      <div className="rounded-lg bg-white p-10 text-center ring-1 ring-black/5">
        <p>No packages yet.</p>
        <Link href="/admin/tours/new/" className="btn btn-teal mt-4">Add your first package</Link>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-black/5 overflow-hidden rounded-lg bg-white ring-1 ring-black/5">
      {tours.map((t, i) => (
        <li key={t.id} className="flex flex-wrap items-center gap-4 p-4">
          {/* eslint-disable-next-line @next/next/no-img-element -- admin thumbnails can come from any configured storage host */}
          <img src={t.image} alt="" className="h-16 w-24 shrink-0 rounded object-cover" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Link href={`/admin/tours/${t.id}/`} className="font-semibold hover:text-teal-dark">{t.title}</Link>
              <span className={`rounded-full px-2 py-0.5 text-xs ${t.published ? "bg-teal/20 text-ink" : "bg-black/10 text-ink/70"}`}>
                {t.published ? "Published" : "Draft"}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${t.ja?.title && t.ja?.summary ? "bg-teal/20 text-ink" : "bg-orange/15 text-ink"}`}
                title={t.ja?.title && t.ja?.summary ? "Japanese translation done" : "Shown in English on the Japanese site"}
              >
                {t.ja?.title && t.ja?.summary ? "日本語 ✓" : "English only"}
              </span>
            </div>
            <p className="mt-1 truncate text-sm text-ink/60">
              /{t.slug}/ · {t.days.length} days · {t.price || "No price"}
            </p>
          </div>
          <RowActions id={t.id!} slug={t.slug} published={!!t.published} isFirst={i === 0} isLast={i === tours.length - 1} />
        </li>
      ))}
    </ul>
  );
}

export default function AdminHome() {
  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl">Packages</h1>
          <p className="text-sm text-ink/60">Published packages appear on the Packages page in this order.</p>
        </div>
        <Link href="/admin/tours/new/" className="btn btn-teal">
          <Plus className="size-4" /> New package
        </Link>
      </div>
      <Suspense fallback={<div className="h-64 animate-pulse rounded-lg bg-white" />}>
        <ToursTable />
      </Suspense>
    </>
  );
}
