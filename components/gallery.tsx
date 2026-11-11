"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Img } from "@/lib/site";
import { fmt } from "@/lib/i18n/dict/en";
import { useDict } from "./i18n-provider";

/** Photo grid; tapping a photo opens it full screen with previous/next. */
export function Gallery({ images }: { images: Img[] }) {
  const t = useDict().gallery;
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState<number | null>(null);
  const count = images.length;

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (index !== null && !d.open) d.showModal();
    if (index === null && d.open) d.close();
  }, [index]);

  const go = (dir: 1 | -1) => setIndex((i) => (i === null ? i : (i + dir + count) % count));

  return (
    <>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            onClick={() => setIndex(i)}
            className="group relative aspect-square overflow-hidden"
            aria-label={fmt(t.view, { alt: img.alt || String(i + 1) })}
          >
            <Image src={img.src} alt={img.alt} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
          </button>
        ))}
      </div>

      <dialog
        ref={dialog}
        onClose={() => setIndex(null)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(1);
          if (e.key === "ArrowLeft") go(-1);
        }}
        className="m-0 h-full max-h-none w-full max-w-none bg-ink/95 p-0 backdrop:bg-ink/80"
        aria-label={t.viewer}
      >
        {index !== null && (
          <div className="relative flex h-full flex-col">
            <div className="flex items-center justify-between p-4 text-sm text-white/80">
              <span>
                {index + 1} / {count}
              </span>
              <button type="button" onClick={() => setIndex(null)} className="rounded-full p-2 hover:bg-white/10" aria-label={t.close}>
                <X className="size-6" />
              </button>
            </div>
            <div className="relative flex-1">
              <Image src={images[index].src} alt={images[index].alt} fill sizes="100vw" className="object-contain" />
            </div>
            {images[index].alt && <p className="p-4 text-center text-sm text-white/80">{images[index].alt}</p>}
            {count > 1 && (
              <>
                <button type="button" onClick={() => go(-1)} className="absolute top-1/2 left-3 rounded-full bg-white/15 p-3 text-white hover:bg-white/25" aria-label={t.prev}>
                  <ChevronLeft className="size-6" />
                </button>
                <button type="button" onClick={() => go(1)} className="absolute top-1/2 right-3 rounded-full bg-white/15 p-3 text-white hover:bg-white/25" aria-label={t.next}>
                  <ChevronRight className="size-6" />
                </button>
              </>
            )}
          </div>
        )}
      </dialog>
    </>
  );
}
