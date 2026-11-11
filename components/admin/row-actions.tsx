"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { ArrowDown, ArrowUp, Eye, EyeOff, ExternalLink, Pencil, Trash2 } from "lucide-react";
import { deleteTour, moveTour, setPublished } from "@/app/admin/actions";

const iconBtn = "inline-flex size-9 items-center justify-center rounded hover:bg-sand disabled:opacity-30";

export function RowActions({
  id,
  slug,
  published,
  isFirst,
  isLast,
}: {
  id: string;
  slug: string;
  published: boolean;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [pending, start] = useTransition();
  const [confirming, setConfirming] = useState(false);

  return (
    <div className={`flex items-center gap-1 ${pending ? "opacity-50" : ""}`}>
      <button type="button" className={iconBtn} disabled={pending || isFirst} onClick={() => start(() => moveTour(id, "up"))} aria-label="Move up" title="Move up">
        <ArrowUp className="size-4" />
      </button>
      <button type="button" className={iconBtn} disabled={pending || isLast} onClick={() => start(() => moveTour(id, "down"))} aria-label="Move down" title="Move down">
        <ArrowDown className="size-4" />
      </button>
      <button
        type="button"
        className={iconBtn}
        disabled={pending}
        onClick={() => start(() => setPublished(id, !published))}
        aria-label={published ? "Unpublish" : "Publish"}
        title={published ? "Unpublish (hide from site)" : "Publish (show on site)"}
      >
        {published ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
      <Link href={`/admin/tours/${id}/`} className={iconBtn} aria-label="Edit" title="Edit">
        <Pencil className="size-4" />
      </Link>
      {published && (
        <Link href={`/${slug}/`} target="_blank" className={iconBtn} aria-label="View on site" title="View on site">
          <ExternalLink className="size-4" />
        </Link>
      )}
      {confirming ? (
        <span className="ml-1 flex items-center gap-1 text-sm">
          <button type="button" className="rounded bg-pink px-2 py-1 text-white" disabled={pending} onClick={() => start(() => deleteTour(id))}>
            Delete
          </button>
          <button type="button" className="rounded px-2 py-1 hover:bg-sand" onClick={() => setConfirming(false)}>
            Cancel
          </button>
        </span>
      ) : (
        <button type="button" className={`${iconBtn} text-pink`} onClick={() => setConfirming(true)} aria-label="Delete" title="Delete">
          <Trash2 className="size-4" />
        </button>
      )}
    </div>
  );
}
