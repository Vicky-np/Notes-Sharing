-- Campus Notes — paste this whole file into Supabase → SQL Editor → Run.
-- Replace your.gmail@gmail.com below (must match NEXT_PUBLIC_ADMIN_EMAIL).
-- Safe to re-run.

create table if not exists public.site_config (
  id int primary key default 1 check (id = 1),
  admin_email text not null default 'your.gmail@gmail.com'
);

insert into public.site_config (id, admin_email)
values (1, 'your.gmail@gmail.com')
on conflict (id) do update set admin_email = excluded.admin_email;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  sort_order int not null default 0
);

do $$
begin
  if not exists (
    select 1 from pg_type where typname = 'resource_kind'
  ) then
    create type public.resource_kind as enum (
      'syllabus',
      'notes',
      'past_question',
      'other'
    );
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_type where typname = 'request_status'
  ) then
    create type public.request_status as enum (
      'pending',
      'approved',
      'rejected'
    );
  end if;
end $$;

create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  semester text,
  type public.resource_kind not null,
  title text not null,
  file_path text,
  file_url text,
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.contribution_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete cascade,
  semester text,
  type public.resource_kind not null,
  title text not null,
  message text,
  file_path text not null,
  status public.request_status not null default 'pending',
  admin_note text,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and is_admin = true
  );
$$;

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
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    lower(coalesce(new.email, '')) = lower(coalesce(admin, ''))
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.site_config enable row level security;
alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.resources enable row level security;
alter table public.contribution_requests enable row level security;

drop policy if exists "Public read site_config" on public.site_config;
create policy "Public read site_config"
  on public.site_config for select
  using (true);

drop policy if exists "Read own or admin profiles" on public.profiles;
create policy "Read own or admin profiles"
  on public.profiles for select
  using (id = auth.uid() or public.is_admin());

drop policy if exists "Public read courses" on public.courses;
create policy "Public read courses"
  on public.courses for select
  using (true);

drop policy if exists "Admin write courses" on public.courses;
create policy "Admin write courses"
  on public.courses for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Public read resources" on public.resources;
create policy "Public read resources"
  on public.resources for select
  using (true);

drop policy if exists "Admin write resources" on public.resources;
create policy "Admin write resources"
  on public.resources for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Users insert requests" on public.contribution_requests;
create policy "Users insert requests"
  on public.contribution_requests for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users read own requests" on public.contribution_requests;
create policy "Users read own requests"
  on public.contribution_requests for select
  using (auth.uid() = user_id or public.is_admin());

drop policy if exists "Admin update requests" on public.contribution_requests;
create policy "Admin update requests"
  on public.contribution_requests for update
  using (public.is_admin())
  with check (public.is_admin());

insert into storage.buckets (id, name, public)
values
  ('pending', 'pending', false),
  ('public-notes', 'public-notes', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public read notes files" on storage.objects;
create policy "Public read notes files"
  on storage.objects for select
  using (bucket_id = 'public-notes');

drop policy if exists "Users upload pending files" on storage.objects;
create policy "Users upload pending files"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'pending'
    and split_part(name, '/', 1) = auth.uid()::text
  );

drop policy if exists "Read pending files" on storage.objects;
create policy "Read pending files"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'pending'
    and (
      split_part(name, '/', 1) = auth.uid()::text
      or public.is_admin()
    )
  );

drop policy if exists "Admin insert public notes" on storage.objects;
create policy "Admin insert public notes"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'public-notes'
    and public.is_admin()
  );

drop policy if exists "Admin delete pending files" on storage.objects;
create policy "Admin delete pending files"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'pending'
    and public.is_admin()
  );

insert into public.courses (id, name, slug, description, sort_order)
values
  ('11111111-1111-1111-1111-111111111111', 'Physics', 'physics', 'Mechanics, electricity, and exam-ready summaries.', 1),
  ('22222222-2222-2222-2222-222222222222', 'Programming', 'programming', 'Intro coding notes, lab sheets, and past papers.', 2),
  ('33333333-3333-3333-3333-333333333333', 'Accounting', 'accounting', 'Principles, worksheets, and previous questions.', 3),
  ('44444444-4444-4444-4444-444444444444', 'Mathematics', 'mathematics', 'Calculus, algebra, and practice sets.', 4),
  ('55555555-5555-5555-5555-555555555555', 'English', 'english', 'Reading lists, notes, and writing samples.', 5),
  ('66666666-6666-6666-6666-666666666666', 'Chemistry', 'chemistry', 'Organic, inorganic, and lab manuals.', 6)
on conflict (id) do nothing;

insert into public.resources (id, course_id, type, title, file_url, featured)
values
  (
    'a1111111-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    'syllabus',
    'Physics syllabus (sample)',
    'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    true
  ),
  (
    'a1111111-1111-1111-1111-111111111112',
    '11111111-1111-1111-1111-111111111111',
    'notes',
    'Mechanics chapter notes',
    'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    true
  ),
  (
    'a1111111-1111-1111-1111-111111111113',
    '11111111-1111-1111-1111-111111111111',
    'past_question',
    'Physics board questions 2024',
    'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    false
  ),
  (
    'a2222222-2222-2222-2222-222222222221',
    '22222222-2222-2222-2222-222222222222',
    'syllabus',
    'Programming course outline',
    'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    true
  ),
  (
    'a2222222-2222-2222-2222-222222222222',
    '22222222-2222-2222-2222-222222222222',
    'notes',
    'Python basics handout',
    'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    true
  )
on conflict (id) do nothing;

insert into public.profiles (id, email, full_name, is_admin)
select
  u.id,
  u.email,
  coalesce(u.raw_user_meta_data ->> 'full_name', u.raw_user_meta_data ->> 'name'),
  lower(coalesce(u.email, '')) = lower(s.admin_email)
from auth.users u
cross join public.site_config s
where s.id = 1
on conflict (id) do update
set
  email = excluded.email,
  is_admin = public.profiles.is_admin or excluded.is_admin;
