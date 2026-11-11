"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { ArrowDown, ArrowUp, CheckCircle2, Plus, Trash2 } from "lucide-react";
import { saveTour } from "@/app/admin/actions";
import type { TourInput } from "@/lib/admin/validate";
import { slugify } from "@/lib/admin/validate";
import type { TourDay } from "@/lib/tours";
import { CATEGORIES, metaDescription } from "@/lib/tour-utils";
import { ImageField, ImageList } from "./image-field";
import { isJapaneseDone, JapaneseFields } from "./japanese-fields";

export const emptyTour: TourInput = {
  slug: "",
  title: "",
  duration: "",
  summary: "",
  price: "",
  itineraryTitle: "",
  image: "",
  imageAlt: "",
  heroImage: "",
  heroAlt: "",
  days: [],
  includes: [],
  excludes: [],
  notes: [],
  highlights: [],
  categories: [],
  seoTitle: "",
  seoDescription: "",
  ja: {},
  published: false,
};

const lines = (s: string) => s.split("\n").map((x) => x.trim()).filter(Boolean);

function Section({ title, children, hint }: { title: string; children: React.ReactNode; hint?: string }) {
  return (
    <section className="rounded-lg bg-white p-6 ring-1 ring-black/5">
      <h2 className="text-xl">{title}</h2>
      {hint && <p className="mt-1 text-sm text-ink/60">{hint}</p>}
      <div className="mt-5 grid gap-5">{children}</div>
    </section>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="font-semibold">{label}</span>
      {children}
      {hint && <span className="text-xs text-ink/60">{hint}</span>}
    </label>
  );
}

/** Textarea where each line becomes one bullet point. */
function LinesField({ label, value, onChange, rows = 5, hint }: { label: string; value: string[]; onChange: (v: string[]) => void; rows?: number; hint?: string }) {
  const [text, setText] = useState(value.join("\n"));
  return (
    <Field label={label} hint={hint ?? "One item per line."}>
      <textarea
        className="field"
        rows={rows}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          onChange(lines(e.target.value));
        }}
      />
    </Field>
  );
}

export function TourEditor({ initial, created = false }: { initial: TourInput; created?: boolean }) {
  const [tour, setTour] = useState<TourInput>(initial);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial.id));
  const [lang, setLang] = useState<"en" | "ja">("en");
  const [state, action, pending] = useActionState(saveTour, created ? { ok: true, message: "Package created." } : null);
  const folder = tour.slug || "new";

  const set = <K extends keyof TourInput>(key: K, value: TourInput[K]) => setTour((t) => ({ ...t, [key]: value }));
  const setDay = (i: number, patch: Partial<TourDay>) =>
    set("days", tour.days.map((d, k) => (k === i ? { ...d, ...patch } : d)));
  const moveDay = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= tour.days.length) return;
    const days = [...tour.days];
    [days[i], days[j]] = [days[j], days[i]];
    set("days", days);
  };
  const addDay = () =>
    set("days", [...tour.days, { title: `Day ${tour.days.length + 1} - `, distance: null, items: [], images: [] }]);

  return (
    <form action={action} className="grid gap-6">
      <input type="hidden" name="payload" value={JSON.stringify(tour)} />

      <div className="sticky top-16 z-30 -mx-4 flex flex-wrap items-center justify-between gap-3 border-b border-black/10 bg-sand/95 px-4 py-3 backdrop-blur">
        <div>
          <Link href="/admin/" className="text-sm text-ink/60 hover:text-ink">← All packages</Link>
          <h1 className="text-2xl">{tour.title || "New package"}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {state && (
            <p role="status" className={`flex items-center gap-1 text-sm ${state.ok ? "text-teal-dark" : "text-pink"}`}>
              {state.ok && <CheckCircle2 className="size-4" />} {state.message}
            </p>
          )}
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="size-4 accent-teal" checked={tour.published} onChange={(e) => set("published", e.target.checked)} />
            Published
          </label>
          {tour.id && tour.published && (
            <Link href={`/${tour.slug}/`} target="_blank" className="btn border border-ink/20 bg-white">View</Link>
          )}
          <button type="submit" className="btn btn-teal" disabled={pending}>
            {pending ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      <div role="tablist" aria-label="Language" className="flex gap-2">
        {(["en", "ja"] as const).map((l) => (
          <button
            key={l}
            type="button"
            role="tab"
            aria-selected={lang === l}
            onClick={() => setLang(l)}
            className={`rounded-full border px-4 py-1.5 text-sm ${lang === l ? "border-ink bg-ink text-white" : "border-ink/20 bg-white"}`}
          >
            {l === "en" ? "English" : "日本語 Japanese"}
            {l === "ja" && (
              <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${isJapaneseDone(tour.ja) ? "bg-teal text-ink" : "bg-black/10"}`}>
                {isJapaneseDone(tour.ja) ? "✓" : "not translated"}
              </span>
            )}
          </button>
        ))}
      </div>

      {lang === "ja" ? (
        <JapaneseFields tour={tour} onChange={(ja) => set("ja", ja)} />
      ) : (
      <>
      <Section title="Basics" hint="Shown on the Packages page and in Google results.">
        <Field label="Title">
          <input
            className="field"
            required
            value={tour.title}
            onChange={(e) => {
              set("title", e.target.value);
              if (!slugTouched) set("slug", slugify(e.target.value));
            }}
            placeholder="e.g. Wildlife & Leopard Safari"
          />
        </Field>
        <Field label="URL" hint={`The page address: kawaiki.com/${tour.slug || "your-package"}/ . Changing it on a published package breaks old links.`}>
          <input
            className="field"
            value={tour.slug}
            onChange={(e) => {
              setSlugTouched(true);
              set("slug", slugify(e.target.value));
            }}
          />
        </Field>
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Duration" hint="Shown on the package card.">
            <input className="field" value={tour.duration} onChange={(e) => set("duration", e.target.value)} placeholder="8 NIGHTS 9 DAYS GOLF TOUR IN SRI LANKA" />
          </Field>
          <Field label="Price" hint="Start with “USD 1234” so the site can show “From USD 1,234”.">
            <input className="field" value={tour.price} onChange={(e) => set("price", e.target.value)} placeholder="USD 2500 Per Person on Twin Sharing Basis (Conditions Apply)" />
          </Field>
        </div>
        <Field label="Summary" hint="2–4 sentences. Used on the package card, the tour page and as the Google description.">
          <textarea className="field" rows={5} value={tour.summary} onChange={(e) => set("summary", e.target.value)} />
        </Field>
        <LinesField
          label="Highlights"
          value={tour.highlights}
          onChange={(v) => set("highlights", v)}
          rows={5}
          hint="3–6 short points shown near the top of the tour page. One per line."
        />
        <fieldset className="grid gap-2 text-sm">
          <legend className="font-semibold">Categories</legend>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => {
              const on = tour.categories.includes(c);
              return (
                <label key={c} className={`cursor-pointer rounded-full border px-3 py-1 ${on ? "border-teal bg-teal/20" : "border-ink/20 bg-white"}`}>
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={on}
                    onChange={() => set("categories", on ? tour.categories.filter((x) => x !== c) : [...tour.categories, c])}
                  />
                  {c}
                </label>
              );
            })}
          </div>
          <span className="text-xs text-ink/60">Used for the filter buttons on the Packages page.</span>
        </fieldset>
      </Section>

      <Section title="Google search" hint="How this package appears in Google results. Leave empty to use the title and summary automatically.">
        <Field label={`Search title (${tour.seoTitle.length}/60)`} hint="Include what people search for, e.g. “10-Day Sri Lanka Gem Mining Tour, Ratnapura | Kawaiki”.">
          <input className="field" maxLength={70} value={tour.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} placeholder={`${tour.title || "Package title"} - Kawaiki Tours & Travels`} />
        </Field>
        <Field label={`Search description (${tour.seoDescription.length}/160)`} hint="One or two sentences: the highlights, length and starting price.">
          <textarea className="field" rows={3} maxLength={170} value={tour.seoDescription} onChange={(e) => set("seoDescription", e.target.value)} />
        </Field>
        <div className="rounded border border-black/10 bg-white p-4" aria-label="Google result preview">
          <p className="text-xs text-ink/60">Preview</p>
          <p className="mt-1 truncate text-sm text-[#1a0dab]">{tour.seoTitle || `${tour.title || "Package title"} - Kawaiki Tours & Travels`}</p>
          <p className="text-xs text-[#006621]">kawaiki.com › {tour.slug || "your-package"}</p>
          <p className="mt-1 text-xs text-ink/75">{tour.seoDescription || metaDescription(tour.summary) || "Your summary will appear here."}</p>
        </div>
      </Section>

      <Section title="Images">
        <ImageField
          label="Card image"
          src={tour.image}
          alt={tour.imageAlt}
          folder={folder}
          hint="Shown on the Packages page and when the page is shared. Landscape works best."
          onChange={({ src, alt }) => setTour((t) => ({ ...t, image: src, imageAlt: alt }))}
        />
        <ImageField
          label="Main photo on the tour page"
          src={tour.heroImage}
          alt={tour.heroAlt}
          folder={folder}
          hint="Optional. If empty, the card image is used."
          onChange={({ src, alt }) => setTour((t) => ({ ...t, heroImage: src, heroAlt: alt }))}
        />
      </Section>

      <Section title="Itinerary" hint="Each day appears in order on the tour page.">
        <Field label="Itinerary heading">
          <input className="field" value={tour.itineraryTitle} onChange={(e) => set("itineraryTitle", e.target.value)} placeholder="ITINERARY FOR 8 NIGHTS 9 DAYS GOLF TOUR IN SRI LANKA" />
        </Field>

        {tour.days.map((d, i) => (
          <div key={i} className="grid gap-4 rounded-lg border border-black/10 p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-ink/60">Day block {i + 1}</span>
              <div className="flex items-center gap-1">
                <button type="button" className="rounded p-1.5 hover:bg-sand disabled:opacity-30" disabled={i === 0} onClick={() => moveDay(i, -1)} aria-label="Move day up">
                  <ArrowUp className="size-4" />
                </button>
                <button type="button" className="rounded p-1.5 hover:bg-sand disabled:opacity-30" disabled={i === tour.days.length - 1} onClick={() => moveDay(i, 1)} aria-label="Move day down">
                  <ArrowDown className="size-4" />
                </button>
                <button type="button" className="rounded p-1.5 text-pink hover:bg-sand" onClick={() => set("days", tour.days.filter((_, k) => k !== i))} aria-label="Remove day">
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-[1fr_220px]">
              <Field label="Day title">
                <input className="field" value={d.title} onChange={(e) => setDay(i, { title: e.target.value })} placeholder="Day 2 - Colombo to Kandy" />
              </Field>
              <Field label="Distance / travel time">
                <input className="field" value={d.distance ?? ""} onChange={(e) => setDay(i, { distance: e.target.value || null })} placeholder="100 km / 3 hours" />
              </Field>
            </div>
            <LinesField label="Activities" value={d.items} onChange={(items) => setDay(i, { items })} rows={4} />
            <div className="grid gap-1 text-sm">
              <span className="font-semibold">Photos (optional)</span>
              <ImageList images={d.images} folder={folder} onChange={(images) => setDay(i, { images })} />
            </div>
          </div>
        ))}

        <button type="button" onClick={addDay} className="btn justify-self-start border border-dashed border-ink/30 bg-white">
          <Plus className="size-4" /> Add day
        </button>
      </Section>

      <Section title="What's included">
        <div className="grid gap-5 md:grid-cols-3">
          <LinesField label="Tour includes" value={tour.includes} onChange={(v) => set("includes", v)} rows={8} />
          <LinesField label="Tour does not include" value={tour.excludes} onChange={(v) => set("excludes", v)} rows={8} />
          <LinesField label="Notes" value={tour.notes} onChange={(v) => set("notes", v)} rows={8} />
        </div>
      </Section>
      </>
      )}

      <div className="flex justify-end">
        <button type="submit" className="btn btn-teal" disabled={pending}>
          {pending ? "Saving…" : "Save"}
        </button>
      </div>
    </form>
  );
}
