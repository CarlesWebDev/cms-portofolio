

create extension if not exists "pgcrypto";

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null,
  url text not null,
  filename text not null,
  size_bytes int,
  width int,
  height int,
  mime_type text default 'image/webp',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category text,
  year int,
  status text not null default 'draft' check (status in ('draft','published')),
  thumbnail_id uuid references public.media(id) on delete set null,
  summary text,
  live_url text,
  repo_url text,
  tech_stack text[],
  cs_problem text,
  cs_solution text,
  cs_role text,
  cs_result text,
  gallery uuid[],
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text,
  year int,
  credential_url text,
  image_id uuid references public.media(id) on delete set null,
  status text not null default 'draft' check (status in ('draft','published')),
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.now_status (
  id int primary key check (id = 1),
  coding text,
  learning text,
  listening text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.about (
  id int primary key check (id = 1),
  headline text,
  body text,
  photo_id uuid references public.media(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contact (
  id int primary key check (id = 1),
  section_title text,
  email text,
  copy_button_label text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id int primary key check (id = 1),
  site_title text,
  meta_description text,
  favicon_id uuid references public.media(id) on delete set null,
  og_image_id uuid references public.media(id) on delete set null,
  hero_greeting text,
  hero_label text,
  hero_cta_text text,
  hero_cta_link text,
  footer_text text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null check (platform in ('github','linkedin','instagram','whatsapp')),
  url text not null,
  visible boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.activity_log (
  id uuid primary key default gen_random_uuid(),
  entity text not null,
  entity_id uuid,
  action text not null check (action in ('create','update','delete')),
  summary text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.publish_log (
  id uuid primary key default gen_random_uuid(),
  status text not null check (status in ('success','failed')),
  message text,
  triggered_at timestamptz not null default now()
);

do $$
declare t text;
begin
  foreach t in array array['media','projects','achievements','now_status','about','contact','site_settings','social_links']
  loop
    execute format('drop trigger if exists trg_%s_updated on public.%I', t, t);
    execute format('create trigger trg_%s_updated before update on public.%I for each row execute function set_updated_at()', t, t);
  end loop;
end $$;

create or replace function public.is_admin()
returns boolean language sql stable as $$
  select auth.uid() is not null;
$$;

alter table public.media enable row level security;
alter table public.projects enable row level security;
alter table public.achievements enable row level security;
alter table public.now_status enable row level security;
alter table public.about enable row level security;
alter table public.contact enable row level security;
alter table public.site_settings enable row level security;
alter table public.social_links enable row level security;
alter table public.activity_log enable row level security;
alter table public.publish_log enable row level security;

drop policy if exists "media_public_read" on public.media;
create policy "media_public_read" on public.media for select using (true);
drop policy if exists "media_admin_write" on public.media;
create policy "media_admin_write" on public.media for all to authenticated using (is_admin()) with check (is_admin());

drop policy if exists "projects_public_read" on public.projects;
create policy "projects_public_read" on public.projects for select using (status = 'published' or is_admin());
drop policy if exists "projects_admin_write" on public.projects;
create policy "projects_admin_write" on public.projects for all to authenticated using (is_admin()) with check (is_admin());

drop policy if exists "achievements_public_read" on public.achievements;
create policy "achievements_public_read" on public.achievements for select using (status = 'published' or is_admin());
drop policy if exists "achievements_admin_write" on public.achievements;
create policy "achievements_admin_write" on public.achievements for all to authenticated using (is_admin()) with check (is_admin());

drop policy if exists "now_public_read" on public.now_status;
create policy "now_public_read" on public.now_status for select using (true);
drop policy if exists "now_admin_write" on public.now_status;
create policy "now_admin_write" on public.now_status for all to authenticated using (is_admin()) with check (is_admin());

drop policy if exists "about_public_read" on public.about;
create policy "about_public_read" on public.about for select using (true);
drop policy if exists "about_admin_write" on public.about;
create policy "about_admin_write" on public.about for all to authenticated using (is_admin()) with check (is_admin());

drop policy if exists "contact_public_read" on public.contact;
create policy "contact_public_read" on public.contact for select using (true);
drop policy if exists "contact_admin_write" on public.contact;
create policy "contact_admin_write" on public.contact for all to authenticated using (is_admin()) with check (is_admin());

drop policy if exists "settings_public_read" on public.site_settings;
create policy "settings_public_read" on public.site_settings for select using (true);
drop policy if exists "settings_admin_write" on public.site_settings;
create policy "settings_admin_write" on public.site_settings for all to authenticated using (is_admin()) with check (is_admin());

drop policy if exists "social_public_read" on public.social_links;
create policy "social_public_read" on public.social_links for select using (visible or is_admin());
drop policy if exists "social_admin_write" on public.social_links;
create policy "social_admin_write" on public.social_links for all to authenticated using (is_admin()) with check (is_admin());

drop policy if exists "activity_admin_all" on public.activity_log;
create policy "activity_admin_all" on public.activity_log for all to authenticated using (is_admin()) with check (is_admin());

drop policy if exists "publish_admin_all" on public.publish_log;
create policy "publish_admin_all" on public.publish_log for all to authenticated using (is_admin()) with check (is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 5242880, array['image/png','image/jpeg','image/webp','image/gif','image/svg+xml'])
on conflict (id) do update
  set public = true,
      file_size_limit = 5242880,
      allowed_mime_types = array['image/png','image/jpeg','image/webp','image/gif','image/svg+xml'];

drop policy if exists "media_bucket_public_read" on storage.objects;
create policy "media_bucket_public_read" on storage.objects for select
  using (bucket_id = 'media');

drop policy if exists "media_bucket_admin_write" on storage.objects;
create policy "media_bucket_admin_write" on storage.objects for all to authenticated
  using (bucket_id = 'media' and is_admin())
  with check (bucket_id = 'media' and is_admin());

create index if not exists projects_sort_idx on public.projects (sort_order);
create index if not exists achievements_sort_idx on public.achievements (sort_order);
create index if not exists activity_created_idx on public.activity_log (created_at desc);
