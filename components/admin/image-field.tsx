"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";
import { IMAGE_BUCKET } from "@/lib/supabase/env";

const MAX_SIDE = 2400;

/** Shrinks large photos in the browser before upload (max 2400px, WebP) to save storage and bandwidth. */
async function prepare(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Could not process image"))), "image/webp", 0.85),
  );
}

export async function uploadImage(file: File, folder: string): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file.");
  const blob = await prepare(file);
  const base = file.name.replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 50) || "image";
  const path = `${folder}/${Date.now()}-${base}.webp`;

  const supabase = createClient();
  const { error } = await supabase.storage.from(IMAGE_BUCKET).upload(path, blob, {
    contentType: "image/webp",
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw new Error(error.message);
  return supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path).data.publicUrl;
}

export function ImageField({
  label,
  src,
  alt,
  folder,
  onChange,
  hint,
}: {
  label: string;
  src: string;
  alt: string;
  folder: string;
  onChange: (v: { src: string; alt: string }) => void;
  hint?: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onFile(file?: File) {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      onChange({ src: await uploadImage(file, folder), alt });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div className="grid gap-2">
      <span className="text-sm font-semibold">{label}</span>
      <div className="flex flex-wrap items-start gap-4">
        <button
          type="button"
          onClick={() => input.current?.click()}
          className="relative flex h-32 w-48 shrink-0 items-center justify-center overflow-hidden rounded border border-dashed border-ink/30 bg-sand hover:border-teal"
          aria-label={src ? `Replace ${label}` : `Upload ${label}`}
        >
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element -- preview of an uploaded or bundled image
            <img src={src} alt="" className="absolute inset-0 size-full object-cover" />
          ) : (
            <ImagePlus className="size-8 text-ink/40" />
          )}
          {busy && (
            <span className="absolute inset-0 flex items-center justify-center bg-white/70">
              <Loader2 className="size-6 animate-spin" />
            </span>
          )}
        </button>
        <div className="grid min-w-56 flex-1 gap-2">
          <label className="grid gap-1 text-sm">
            Description (alt text, for Google and screen readers)
            <input className="field" value={alt} onChange={(e) => onChange({ src, alt: e.target.value })} placeholder="e.g. Leopard resting on a tree in Yala National Park" />
          </label>
          {hint && <p className="text-xs text-ink/60">{hint}</p>}
          {error && <p className="text-sm text-pink">{error}</p>}
        </div>
      </div>
      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
    </div>
  );
}

/** A row of day photos with add and remove. */
export function ImageList({
  images,
  folder,
  onChange,
}: {
  images: { src: string; alt: string }[];
  folder: string;
  onChange: (v: { src: string; alt: string }[]) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setError("");
    try {
      const added = [];
      for (const f of Array.from(files).slice(0, 8 - images.length)) {
        added.push({ src: await uploadImage(f, folder), alt: "" });
      }
      onChange([...images, ...added]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div className="grid gap-2">
      <div className="flex flex-wrap gap-3">
        {images.map((im, k) => (
          <div key={im.src} className="w-36">
            <div className="relative h-24 w-36 overflow-hidden rounded">
              {/* eslint-disable-next-line @next/next/no-img-element -- preview */}
              <img src={im.src} alt="" className="size-full object-cover" />
              <button
                type="button"
                onClick={() => onChange(images.filter((_, x) => x !== k))}
                className="absolute top-1 right-1 rounded-full bg-white/90 p-1"
                aria-label="Remove photo"
              >
                <X className="size-3.5" />
              </button>
            </div>
            <input
              className="field mt-1 py-1! text-xs!"
              value={im.alt}
              placeholder="Photo description"
              aria-label="Photo description"
              onChange={(e) => onChange(images.map((x, i) => (i === k ? { ...x, alt: e.target.value } : x)))}
            />
          </div>
        ))}
        {images.length < 8 && (
          <button
            type="button"
            onClick={() => input.current?.click()}
            className="flex h-24 w-36 items-center justify-center gap-2 rounded border border-dashed border-ink/30 text-sm text-ink/60 hover:border-teal"
          >
            {busy ? <Loader2 className="size-5 animate-spin" /> : <ImagePlus className="size-5" />} Add photos
          </button>
        )}
      </div>
      {error && <p className="text-sm text-pink">{error}</p>}
      <input ref={input} type="file" multiple accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => onFiles(e.target.files)} />
    </div>
  );
}
