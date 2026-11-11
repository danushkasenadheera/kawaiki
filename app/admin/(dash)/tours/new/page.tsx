import type { Metadata } from "next";
import { Suspense } from "react";
import { emptyTour, TourEditor } from "@/components/admin/tour-editor";
import { requireAdmin } from "@/lib/admin/auth";

export const metadata: Metadata = { title: "New package" };

async function Editor() {
  await requireAdmin();
  return <TourEditor initial={emptyTour} />;
}

export default function NewTourPage() {
  return (
    <Suspense fallback={<div className="h-96 animate-pulse rounded-lg bg-white" />}>
      <Editor />
    </Suspense>
  );
}
