"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Mail, Sparkles } from "lucide-react";
import { fmt } from "@/lib/i18n/dict/en";
import { site } from "@/lib/site";
import { useDict, useLp } from "./i18n-provider";

export type BuilderTour = {
  slug: string;
  title: string;
  image: string;
  categories: string[];
  days: number;
  price: number | null;
};

// Interest keys match the tour categories; labels come from the dictionary.
const INTERESTS = ["Wildlife", "Culture", "Beach", "Nature", "Romantic", "Golf", "Gems"];
const LENGTHS = [
  { min: 4, max: 6 },
  { min: 7, max: 9 },
  { min: 10, max: 14 },
  { min: 15, max: 30 },
];

/** General season note for a month index (1–12); 0 = not sure. */
function seasonKey(m: number) {
  if (m <= 0) return "any" as const;
  if ([12, 1, 2, 3].includes(m)) return "dry" as const;
  if (m === 4) return "april" as const;
  if ([7, 8].includes(m)) return "julAug" as const;
  if ([5, 6, 9].includes(m)) return "sw" as const;
  return "inter" as const;
}

/** Picks the tour that best matches the chosen interests and trip length. */
function bestMatch(tours: BuilderTour[], interests: string[], length?: { min: number; max: number }) {
  let best: { tour: BuilderTour; score: number } | undefined;
  for (const tour of tours) {
    let score = interests.filter((i) => tour.categories.includes(i)).length * 3;
    if (length) {
      if (tour.days >= length.min && tour.days <= length.max) score += 3;
      else if (tour.days >= length.min - 2 && tour.days <= length.max + 2) score += 1;
    }
    if (!best || score > best.score) best = { tour, score };
  }
  return best && best.score > 0 ? best.tour : undefined;
}

function Chip({ on, children, onClick }: { on: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
        on ? "border-teal bg-teal text-ink" : "border-white/30 bg-white/10 text-white hover:border-teal"
      }`}
    >
      {children}
    </button>
  );
}

export function TripBuilder({ tours }: { tours: BuilderTour[] }) {
  const t = useDict().planner;
  const lp = useLp();
  const [interests, setInterests] = useState<string[]>([]);
  const [length, setLength] = useState(-1);
  const [month, setMonth] = useState(0);
  const [who, setWho] = useState(-1);

  const match = useMemo(() => bestMatch(tours, interests, LENGTHS[length]), [tours, interests, length]);
  const started = interests.length > 0 || length >= 0 || who >= 0 || month > 0;

  const message = [
    t.msg.hello,
    interests.length ? fmt(t.msg.interests, { v: interests.map((i) => t.interests[i] ?? i).join(", ") }) : "",
    length >= 0 ? fmt(t.msg.length, { v: t.lengths[length] }) : "",
    month > 0 ? fmt(t.msg.when, { v: t.months[month] }) : "",
    who >= 0 ? fmt(t.msg.who, { v: t.whoOptions[who] }) : "",
    match ? fmt(t.msg.tour, { v: `${match.title} (${site.url}${lp(`/${match.slug}/`)})` }) : "",
    t.msg.ask,
  ]
    .filter(Boolean)
    .join("\n");

  const wa = `${site.whatsapp}?text=${encodeURIComponent(message)}`;
  const mail = `mailto:${site.email}?subject=${encodeURIComponent(t.emailSubject)}&body=${encodeURIComponent(message)}`;
  const toggle = (v: string) => setInterests((xs) => (xs.includes(v) ? xs.filter((x) => x !== v) : [...xs, v]));

  return (
    <div id="plan" className="scroll-mt-6 border border-white/20 bg-ink/55 p-5 text-white shadow-2xl backdrop-blur-md md:p-6">
      <p className="flex items-center gap-2 text-sm tracking-wide text-teal uppercase">
        <Sparkles className="size-4" aria-hidden="true" /> {t.title}
      </p>

      <fieldset className="mt-4">
        <legend className="mb-2 text-sm text-white/80">{t.excites}</legend>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map((i) => (
            <Chip key={i} on={interests.includes(i)} onClick={() => toggle(i)}>{t.interests[i]}</Chip>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-4">
        <legend className="mb-2 text-sm text-white/80">{t.howLong}</legend>
        <div className="flex flex-wrap gap-2">
          {t.lengths.map((label, i) => (
            <Chip key={label} on={length === i} onClick={() => setLength(length === i ? -1 : i)}>{label}</Chip>
          ))}
        </div>
      </fieldset>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1 text-sm text-white/80">
          {t.when}
          <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="border border-white/30 bg-ink/60 px-3 py-2 text-white">
            {t.months.map((m, i) => <option key={m} value={i}>{m}</option>)}
          </select>
        </label>
        <label className="grid gap-1 text-sm text-white/80">
          {t.who}
          <select value={who} onChange={(e) => setWho(Number(e.target.value))} className="border border-white/30 bg-ink/60 px-3 py-2 text-white">
            <option value={-1}>{t.choose}</option>
            {t.whoOptions.map((w, i) => <option key={w} value={i}>{w}</option>)}
          </select>
        </label>
      </div>

      {/* Live suggestion */}
      <div aria-live="polite" className="mt-5 min-h-24">
        {started && (
          <div className="space-y-3">
            {match ? (
              <Link href={lp(`/${match.slug}/`)} className="group flex items-center gap-3 bg-white/10 p-2 hover:bg-white/15">
                <span className="relative block h-16 w-24 shrink-0 overflow-hidden">
                  <Image src={match.image} alt="" fill sizes="96px" className="object-cover" />
                </span>
                <span className="min-w-0 text-sm">
                  <span className="block text-xs text-teal uppercase">{t.suggested}</span>
                  <span className="block truncate text-base">{match.title}</span>
                  <span className="text-white/75">
                    {match.price
                      ? fmt(t.daysFrom, { n: match.days, price: match.price.toLocaleString("en-US") })
                      : fmt(t.daysOnly, { n: match.days })}
                  </span>
                </span>
                <ArrowRight className="ml-auto size-4 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            ) : (
              <p className="bg-white/10 p-3 text-sm">{t.tailorMade}</p>
            )}
            {month > 0 && (
              <p className="text-xs leading-relaxed text-white/75">
                {t.months[month]}: {t.seasons[seasonKey(month)]}
              </p>
            )}
          </div>
        )}
      </div>

      <a href={wa} target="_blank" rel="noopener noreferrer" className="btn mt-4 w-full bg-[#25d366] py-3.5 text-base text-ink hover:bg-[#1fbd5a]">
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-5">
          <path d="M12 0C5.4 0 0 5.4 0 12c0 2.1.6 4.2 1.6 6L0 24l6.2-1.6c1.8 1 3.8 1.5 5.8 1.5 6.6 0 12-5.4 12-12S18.6 0 12 0zm0 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4C2.7 15.6 2.2 13.8 2.2 12 2.2 6.6 6.6 2.2 12 2.2S21.8 6.6 21.8 12 17.4 21.8 12 21.8zm5.5-7.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5 1.9.8 2.6.9 3.6.7.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3z" />
        </svg>
        {t.send}
      </a>
      <p className="mt-2 text-center text-xs text-white/70">
        {t.free}{" "}
        <a href={mail} className="inline-flex items-center gap-1 underline">
          <Mail className="size-3" aria-hidden="true" /> {t.email}
        </a>
      </p>
    </div>
  );
}
