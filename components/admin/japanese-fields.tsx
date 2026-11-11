"use client";

import { useState } from "react";
import type { TourInput } from "@/lib/admin/validate";
import type { TourTranslation } from "@/lib/tours";

const lines = (s: string) => s.split("\n").map((x) => x.trim()).filter(Boolean);

function Box({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg bg-white p-6 ring-1 ring-black/5">
      <h2 className="text-xl">{title}</h2>
      {hint && <p className="mt-1 text-sm text-ink/60">{hint}</p>}
      <div className="mt-5 grid gap-5">{children}</div>
    </section>
  );
}

/** A Japanese field with the English original shown underneath for reference. */
function JaField({ label, en, value, onChange, rows = 0, max }: { label: string; en?: string | null; value?: string; onChange: (v: string) => void; rows?: number; max?: number }) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="font-semibold">{label}</span>
      {rows ? (
        <textarea lang="ja" className="field" rows={rows} maxLength={max} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input lang="ja" className="field" maxLength={max} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
      )}
      {en && <span className="text-xs text-ink/50">English: {en}</span>}
    </label>
  );
}

/** Japanese list field: one item per line, English list shown for reference. */
function JaLines({ label, en, value, onChange, rows = 5 }: { label: string; en: string[]; value?: string[]; onChange: (v: string[]) => void; rows?: number }) {
  const [text, setText] = useState((value ?? []).join("\n"));
  return (
    <label className="grid gap-1 text-sm">
      <span className="font-semibold">{label}</span>
      <textarea
        lang="ja"
        className="field"
        rows={rows}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          onChange(lines(e.target.value));
        }}
      />
      <span className="text-xs text-ink/60">One item per line.</span>
      {en.length > 0 && (
        <details className="text-xs text-ink/50">
          <summary className="cursor-pointer">English ({en.length} lines)</summary>
          <ul className="mt-1 list-disc pl-4">{en.map((x, i) => <li key={i}>{x}</li>)}</ul>
        </details>
      )}
    </label>
  );
}

export function isJapaneseDone(ja?: TourTranslation) {
  return Boolean(ja?.title?.trim() && ja?.summary?.trim());
}

export function JapaneseFields({ tour, onChange }: { tour: TourInput; onChange: (ja: TourTranslation) => void }) {
  const ja = tour.ja ?? {};
  const set = <K extends keyof TourTranslation>(key: K, value: TourTranslation[K]) => onChange({ ...ja, [key]: value });
  const setDay = (i: number, patch: { title?: string; distance?: string; items?: string[] }) => {
    const days = tour.days.map((_, k) => ja.days?.[k] ?? {});
    days[i] = { ...days[i], ...patch };
    set("days", days);
  };

  return (
    <div className="grid gap-6">
      <p className="rounded bg-teal/10 p-4 text-sm">
        Japanese text for <b>kawaiki.com/ja/</b>. Leave a field empty to show the English version there. A package counts as translated once the
        title and summary are filled in. Photos, prices and the day order are shared with English.
      </p>

      <Box title="基本情報 Basics">
        <JaField label="タイトル Title" en={tour.title} value={ja.title} onChange={(v) => set("title", v)} max={200} />
        <div className="grid gap-5 md:grid-cols-2">
          <JaField label="日数 Duration" en={tour.duration} value={ja.duration} onChange={(v) => set("duration", v)} />
          <JaField label="料金表記 Price text" en={tour.price} value={ja.price} onChange={(v) => set("price", v)} />
        </div>
        <JaField label="概要 Summary" en={tour.summary} value={ja.summary} onChange={(v) => set("summary", v)} rows={5} max={3000} />
        <JaLines label="見どころ Highlights" en={tour.highlights} value={ja.highlights} onChange={(v) => set("highlights", v)} />
      </Box>

      <Box title="Google 検索 Google search" hint="Japanese search result title (about 30–35 characters) and description (about 100–120 characters).">
        <JaField label={`検索タイトル (${(ja.seoTitle ?? "").length})`} en={tour.seoTitle} value={ja.seoTitle} onChange={(v) => set("seoTitle", v)} max={70} />
        <JaField label={`検索説明文 (${(ja.seoDescription ?? "").length})`} en={tour.seoDescription} value={ja.seoDescription} onChange={(v) => set("seoDescription", v)} rows={3} max={170} />
      </Box>

      <Box title="画像の説明 Image descriptions">
        <JaField label="カード画像 Card image" en={tour.imageAlt} value={ja.imageAlt} onChange={(v) => set("imageAlt", v)} />
        <JaField label="メイン写真 Main photo" en={tour.heroAlt} value={ja.heroAlt} onChange={(v) => set("heroAlt", v)} />
      </Box>

      <Box title="日程 Itinerary" hint="One block per English day. Add or reorder days in the English tab.">
        <JaField label="日程の見出し Itinerary heading" en={tour.itineraryTitle} value={ja.itineraryTitle} onChange={(v) => set("itineraryTitle", v)} />
        {tour.days.map((d, i) => {
          const jd = ja.days?.[i] ?? {};
          return (
            <div key={i} className="grid gap-4 rounded-lg border border-black/10 p-4">
              <div className="grid gap-4 md:grid-cols-[1fr_220px]">
                <JaField label={`${i + 1}日目 タイトル`} en={d.title} value={jd.title} onChange={(v) => setDay(i, { title: v })} />
                <JaField label="距離・所要時間" en={d.distance} value={jd.distance} onChange={(v) => setDay(i, { distance: v })} />
              </div>
              <JaLines label="内容 Activities" en={d.items} value={jd.items} onChange={(v) => setDay(i, { items: v })} rows={4} />
            </div>
          );
        })}
      </Box>

      <Box title="料金に含まれるもの What's included">
        <div className="grid gap-5 md:grid-cols-3">
          <JaLines label="含まれるもの" en={tour.includes} value={ja.includes} onChange={(v) => set("includes", v)} rows={8} />
          <JaLines label="含まれないもの" en={tour.excludes} value={ja.excludes} onChange={(v) => set("excludes", v)} rows={8} />
          <JaLines label="ご注意 Notes" en={tour.notes} value={ja.notes} onChange={(v) => set("notes", v)} rows={8} />
        </div>
      </Box>
    </div>
  );
}
