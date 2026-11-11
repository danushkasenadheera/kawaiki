// Writes the Japanese translations into data/tours.json (fallback) and a SQL migration for Supabase.
// Run: node scripts/apply-tours-ja.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { toursJa } from "./tours-ja.mjs";

const file = new URL("../data/tours.json", import.meta.url);
const tours = JSON.parse(readFileSync(file, "utf8"));
for (const t of tours) {
  const ja = toursJa[t.slug];
  if (!ja) continue;
  if (ja.days.length !== t.days.length) throw new Error(`${t.slug}: ${ja.days.length} Japanese days vs ${t.days.length} English days`);
  t.ja = ja;
}
writeFileSync(file, JSON.stringify(tours, null, 2) + "\n");

const q = (s) => `'${s.replace(/'/g, "''")}'`;
const sql =
  "-- Japanese translations for the six original packages (AI first draft; review before launch).\n" +
  Object.entries(toursJa)
    .map(([slug, ja]) => `update public.tours set ja = ${q(JSON.stringify(ja))}::jsonb where slug = ${q(slug)};`)
    .join("\n") +
  "\n";
writeFileSync(new URL("../supabase/migrations/20261112000001_tour_japanese_content.sql", import.meta.url), sql);
console.log("Updated data/tours.json and wrote migration for", Object.keys(toursJa).length, "tours");
