-- ============================================================================
--  Portfolio database schema  (run this in Supabase -> SQL Editor -> New query)
-- ============================================================================
-- Security model:
--   * Anyone (anonymous) can READ content -> the public site works with the
--     anon key.
--   * Only an authenticated user (you, logged into /admin) can INSERT/UPDATE/
--     DELETE. Row Level Security (RLS) enforces this on the database side, so
--     it is safe to ship the anon key in a static site.
-- ============================================================================

-- ---------- PROFILE (single row that holds the "about me" section) ----------
create table if not exists public.profile (
  id          bigint primary key default 1,
  full_name   text not null default '',
  headline    text not null default '',
  bio         text not null default '',
  location    text,
  email       text,
  phone       text,
  photo_url   text,
  cover_url   text,
  resume_url  text,
  github_url  text,
  linkedin_url text,
  twitter_url text,
  website_url text,
  skills      text[] not null default '{}',
  constraint single_row check (id = 1)
);

-- Safe to re-run: adds the newer columns to an existing profile table.
alter table public.profile add column if not exists phone     text;
alter table public.profile add column if not exists cover_url text;

insert into public.profile (id) values (1)
on conflict (id) do nothing;

-- ---------- PROJECTS ----------
create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text not null default '',
  tech_tags   text[] not null default '{}',
  image_url   text,
  repo_url    text,
  live_url    text,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

-- ---------- EXPERIENCE ----------
create table if not exists public.experiences (
  id               uuid primary key default gen_random_uuid(),
  company          text not null,
  position         text not null,
  start_date       date,
  end_date         date,
  is_current       boolean not null default false,
  responsibilities text not null default '',  -- one bullet per line
  created_at       timestamptz not null default now()
);

-- ---------- BLOG POSTS ----------
create table if not exists public.posts (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  title       text not null,
  excerpt     text,
  body        text not null default '',
  cover_url   text,
  published   boolean not null default false,
  created_at  timestamptz not null default now()
);

-- ============================ Row Level Security ============================
alter table public.profile      enable row level security;
alter table public.projects     enable row level security;
alter table public.experiences  enable row level security;
alter table public.posts        enable row level security;

-- Public read access
create policy "public read profile"     on public.profile     for select using (true);
create policy "public read projects"    on public.projects    for select using (true);
create policy "public read experiences" on public.experiences for select using (true);
create policy "public read posts"       on public.posts       for select using (published = true);

-- Authenticated full access (the logged-in admin)
create policy "admin all profile"     on public.profile     for all to authenticated using (true) with check (true);
create policy "admin all projects"    on public.projects    for all to authenticated using (true) with check (true);
create policy "admin all experiences" on public.experiences for all to authenticated using (true) with check (true);
create policy "admin all posts"       on public.posts       for all to authenticated using (true) with check (true);

-- ============================ Storage bucket ===============================
-- Create a PUBLIC bucket named "media" for images and the resume PDF.
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- Anyone can read files; only authenticated users can upload/update/delete.
create policy "public read media"
  on storage.objects for select
  using (bucket_id = 'media');

create policy "admin write media"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'media');

create policy "admin update media"
  on storage.objects for update to authenticated
  using (bucket_id = 'media');

create policy "admin delete media"
  on storage.objects for delete to authenticated
  using (bucket_id = 'media');
