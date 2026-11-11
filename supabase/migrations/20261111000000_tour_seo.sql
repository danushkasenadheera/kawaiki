-- Search engine title & description per package (optional; the site falls back to title/summary).

alter table public.tours
  add column seo_title text not null default '',
  add column seo_description text not null default '';

-- Keyword-led SEO text for the six packages migrated from WordPress.
update public.tours set seo_title = '8-Day Sri Lanka Wildlife & Culture Tour | Kawaiki', seo_description = '8-day Sri Lanka tour: Yala leopard safari, Bundala birding, Horton Plains, Kandy''s Temple of the Tooth, Galle Fort and Bentota beach. From USD 4,199.' where slug = 'nature-culture-tour';
update public.tours set seo_title = '14-Day Sri Lanka Tour: Culture, Safari & Beach | Kawaiki', seo_description = 'Two weeks in Sri Lanka: Sigiriya, Anuradhapura, Polonnaruwa, Kandy, tea country, a Yala safari and Bentota beach days. Tailor-made, from USD 3,000.' where slug = 'exotic-sri-lanka-tour';
update public.tours set seo_title = '10-Day Sri Lanka Gem Mining Tour, Ratnapura | Kawaiki', seo_description = 'See traditional gem mining in Ratnapura, Sri Lanka''s City of Gems: working pits, gem washing and evaluation, plus a Yala safari and beach. From USD 2,500.' where slug = 'discover-gems';
update public.tours set seo_title = '9-Day Sri Lanka Golf Tour: 3 Historic Courses | Kawaiki', seo_description = 'Play Royal Colombo, Victoria Golf & Country Resort and Nuwara Eliya Golf Club on a 9-day Sri Lanka golf holiday with tea country and Kandy. From USD 6,299.' where slug = 'luxury-golf-escape';
update public.tours set seo_title = '4-Day Sri Lanka Romantic Getaway for Couples | Kawaiki', seo_description = 'A 4-day Sri Lanka escape for couples: Kandy''s Temple of the Tooth, tea plantations and waterfalls in Nuwara Eliya, Pinnawala and Colombo. From USD 2,299.' where slug = 'romantic-getaway';
update public.tours set seo_title = '7-Day Sri Lanka Ancient Cities & Culture Tour | Kawaiki', seo_description = 'Seven days through Sri Lanka''s cultural triangle: Kandy, Dambulla Cave Temple, Polonnaruwa and Anuradhapura, with Pinnawala elephants. From USD 2,250.' where slug = 'explore-paradise';
