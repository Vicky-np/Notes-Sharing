-- ╔═══════════════════════════════════════════════════════════════╗
-- ║           Campus Notes — Supabase Schema (v2 - Admin Only)   ║
-- ║                                                               ║
-- ║  HOW TO USE:                                                  ║
-- ║  1. Go to Supabase → SQL Editor → New Query                  ║
-- ║  2. Paste this ENTIRE file                                    ║
-- ║  3. Change 'your.gmail@gmail.com' to YOUR Gmail address       ║
-- ║  4. Click "Run"                                               ║
-- ║  5. Done! Tables, security rules, and storage buckets ready.  ║
-- ╚═══════════════════════════════════════════════════════════════╝

-- ─── 1. Admin config ────────────────────────────────────────────
-- Change this to YOUR Gmail before running!
create table if not exists public.site_config (
  id int primary key default 1 check (id = 1),
  admin_email text not null default 'your.gmail@gmail.com'
);

insert into public.site_config (id, admin_email)
values (1, 'your.gmail@gmail.com')     -- ← PUT YOUR GMAIL HERE
on conflict (id) do update set admin_email = excluded.admin_email;

-- ─── 2. User profiles ───────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

-- ─── 3. Courses ─────────────────────────────────────────────────
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  sort_order int not null default 0
);

-- ─── 4. Resource types enum ─────────────────────────────────────
do $$
begin
  if not exists (select 1 from pg_type where typname = 'resource_kind') then
    create type public.resource_kind as enum (
      'syllabus',
      'notes',
      'past_question',
      'other'
    );
  end if;
end $$;

-- ─── 5. Resources (the actual files) ────────────────────────────
create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  semester text,                         -- e.g. "Semester 1" or "Year 2"
  type public.resource_kind not null,
  title text not null,
  file_path text,                        -- Supabase storage path (public-notes bucket)
  file_url text,                         -- Direct URL (for external links)
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

-- ─── 6. Helper: is_admin() ──────────────────────────────────────
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and is_admin = true
  );
$$;

-- ─── 7. Auto-create profile on Google Sign In ───────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  admin text;
begin
  select admin_email into admin from public.site_config where id = 1;
  insert into public.profiles (id, email, full_name, is_admin)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    lower(coalesce(new.email, '')) = lower(coalesce(admin, ''))
  )
  on conflict (id) do update set
    email = excluded.email,
    is_admin = public.profiles.is_admin or excluded.is_admin;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── 8. Row Level Security ──────────────────────────────────────
alter table public.site_config enable row level security;
alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.resources enable row level security;

-- site_config: everyone can read
drop policy if exists "Public read site_config" on public.site_config;
create policy "Public read site_config"
  on public.site_config for select using (true);

-- profiles: user sees own profile, admin sees all
drop policy if exists "Read own or admin profiles" on public.profiles;
create policy "Read own or admin profiles"
  on public.profiles for select
  using (id = auth.uid() or public.is_admin());

-- courses: everyone can read, only admin can write
drop policy if exists "Public read courses" on public.courses;
create policy "Public read courses"
  on public.courses for select using (true);

drop policy if exists "Admin write courses" on public.courses;
create policy "Admin write courses"
  on public.courses for all
  using (public.is_admin()) with check (public.is_admin());

-- resources: everyone can read, only admin can write
drop policy if exists "Public read resources" on public.resources;
create policy "Public read resources"
  on public.resources for select using (true);

drop policy if exists "Admin write resources" on public.resources;
create policy "Admin write resources"
  on public.resources for all
  using (public.is_admin()) with check (public.is_admin());

-- ─── 9. Storage buckets ─────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('public-notes', 'public-notes', true)
on conflict (id) do update set public = excluded.public;

-- Public can read files from public-notes
drop policy if exists "Public read notes files" on storage.objects;
create policy "Public read notes files"
  on storage.objects for select
  using (bucket_id = 'public-notes');

-- Only admin can upload files
drop policy if exists "Admin upload notes files" on storage.objects;
create policy "Admin upload notes files"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'public-notes'
    and public.is_admin()
  );

-- Only admin can delete files
drop policy if exists "Admin delete notes files" on storage.objects;
create policy "Admin delete notes files"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'public-notes'
    and public.is_admin()
  );

-- ─── 10. Seed sample courses ────────────────────────────────────
-- (Remove or edit these to match your actual college courses)
insert into public.courses (id, name, slug, description, sort_order)
values
  ('11111111-1111-1111-1111-111111111111', 'Physics', 'physics', 'Mechanics, electricity, and exam-ready summaries.', 1),
  ('22222222-2222-2222-2222-222222222222', 'Programming', 'programming', 'Intro coding notes, lab sheets, and past papers.', 2),
  ('33333333-3333-3333-3333-333333333333', 'Accounting', 'accounting', 'Principles, worksheets, and previous questions.', 3),
  ('44444444-4444-4444-4444-444444444444', 'Mathematics', 'mathematics', 'Calculus, algebra, and practice sets.', 4),
  ('55555555-5555-5555-5555-555555555555', 'English', 'english', 'Reading lists, notes, and writing samples.', 5),
  ('66666666-6666-6666-6666-666666666666', 'Chemistry', 'chemistry', 'Organic, inorganic, and lab manuals.', 6)
on conflict (id) do nothing;
