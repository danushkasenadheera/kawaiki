-- Japanese translation per package, edited in the admin's 日本語 tab.
-- Shape: { title, summary, duration, price, itineraryTitle, imageAlt, heroAlt,
--          days: [{ title, distance, items[] }], includes[], excludes[], notes[], highlights[],
--          seoTitle, seoDescription }. Missing fields fall back to English on the site.
alter table public.tours
  add column ja jsonb not null default '{}'::jsonb check (jsonb_typeof(ja) = 'object');
