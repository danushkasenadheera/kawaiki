-- Tour packages managed from /admin, plus the admin allow-list and image storage.

-- Admins: a user can sign in only if their auth user id is listed here.
create table public.admins (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

-- Security definer so policies can call it without recursive RLS checks.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where id = (select auth.uid()));
$$;

create policy "Admins can read the admin list"
  on public.admins for select
  to authenticated
  using ((select public.is_admin()));

-- Tours
create table public.tours (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (length(title) between 1 and 200),
  duration text not null default '',
  summary text not null default '',
  price text not null default '',
  itinerary_title text not null default '',
  image text not null default '',
  image_alt text not null default '',
  hero_image text not null default '',
  hero_alt text not null default '',
  -- [{ title, distance, items: string[], images: [{ src, alt }] }]
  days jsonb not null default '[]'::jsonb check (jsonb_typeof(days) = 'array'),
  includes text[] not null default '{}',
  excludes text[] not null default '{}',
  notes text[] not null default '{}',
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index tours_published_sort_idx on public.tours (published, sort_order);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger tours_set_updated_at
  before update on public.tours
  for each row execute function public.set_updated_at();

alter table public.tours enable row level security;

create policy "Anyone can read published tours"
  on public.tours for select
  to anon, authenticated
  using (published or (select public.is_admin()));

create policy "Admins can add tours"
  on public.tours for insert
  to authenticated
  with check ((select public.is_admin()));

create policy "Admins can edit tours"
  on public.tours for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Admins can delete tours"
  on public.tours for delete
  to authenticated
  using ((select public.is_admin()));

-- Image storage: public to view, only admins can upload, replace or delete.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('tour-images', 'tour-images', true, 10485760, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create policy "Admins can upload tour images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'tour-images' and (select public.is_admin()));

create policy "Admins can update tour images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'tour-images' and (select public.is_admin()));

create policy "Admins can delete tour images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'tour-images' and (select public.is_admin()));
