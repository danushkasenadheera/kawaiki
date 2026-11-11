# Kawaiki Tours & Travels

Next.js rebuild of [kawaiki.com](https://kawaiki.com) (previously WordPress + PopularFX/Pagelayer), with an admin for managing tour packages.

## Develop

```bash
pnpm install
cp .env.example .env.local   # fill in Supabase and Resend values
pnpm dev
```

Without Supabase variables the public site still works: it shows the packages in `data/tours.json`, and the admin can't sign in.

## Structure

- `app/(site)/` – public pages. URLs match the old WordPress site (`/services/`, `/packages/`, `/about-us/`, `/contact/`, and each tour at `/<slug>/`).
- `app/admin/` – packages admin (sign in, list, create, edit, publish, reorder, delete).
- `lib/tours.ts` – reads published packages (cached; refreshed instantly when the admin saves).
- `lib/site.ts` – contact details, navigation, services and gallery images.
- `lib/legal.ts` – Terms & Conditions and FAQ content.
- `supabase/migrations/` – database tables, access rules and image storage.
- `supabase/seed.sql` – the 6 original packages (regenerate with `node scripts/generate-seed.mjs`).
- `public/images/` – images migrated from the WordPress media library.

## Set up Supabase (one time)

1. Create a project at [supabase.com](https://supabase.com) (region: Singapore or Mumbai is closest to Sri Lanka).
2. **SQL Editor** → paste and run `supabase/migrations/20261109000000_tours.sql`, then `supabase/seed.sql`.
3. **Authentication → Sign In / Providers**: turn off "Allow new users to sign up" (admins are added manually).
4. **Authentication → Users → Add user**: enter the admin's email and a password, tick "Auto confirm user".
5. **SQL Editor** → give that user admin access:
   ```sql
   insert into public.admins (id, email)
   select id, email from auth.users where email = 'admin@example.com';
   ```
6. **Project Settings → API**: copy the Project URL and the publishable key into `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (in `.env.local`, and in Vercel).

Sign in at `/admin/`. To add another admin later, repeat steps 4–5.

## Using the admin

- **Published** packages show on the site; drafts don't. Saving updates the live site immediately.
- The arrows on the package list set the order on the Packages page.
- Photos are resized in the browser (max 2400px, WebP) and stored in Supabase Storage.
- Changing a published package's URL breaks old links to it, so avoid that once it's live.
- The homepage banners link to `/nature-culture-tour/` and `/luxury-golf-escape/`, and the Services page links to `/discover-gems/`. Keep those packages (or update the links in code) if you delete or rename them.

## Deploy to Vercel

1. Push this repo to GitHub and import it in Vercel (framework preset: Next.js; pnpm is detected from `pnpm-lock.yaml`).
2. Add the environment variables from `.env.example` in Project Settings → Environment Variables.
3. Point the `kawaiki.com` domain at the Vercel project, then submit `https://kawaiki.com/sitemap.xml` in Google Search Console.
