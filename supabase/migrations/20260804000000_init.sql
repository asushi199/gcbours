-- OURS Phase 2 initial schema
-- Apply with Supabase CLI or SQL editor.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  avatar_path text,
  role text not null default 'owner' check (role in ('owner', 'partner')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- relationship_settings
-- ---------------------------------------------------------------------------
create table if not exists public.relationship_settings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  relationship_title text not null,
  partner_name text not null,
  owner_name text not null,
  owner_nickname text,
  partner_nickname text,
  relationship_start_date date,
  birthday_date date,
  unlock_title text,
  unlock_hint text,
  default_diary_tone text not null default 'warm',
  default_language text not null default 'zh-CN',
  music_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists relationship_settings_owner_id_uidx
  on public.relationship_settings (owner_id);

-- ---------------------------------------------------------------------------
-- photos (originals on Google Drive; thumbnails on Supabase Storage)
-- ---------------------------------------------------------------------------
create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  drive_file_id text not null,
  drive_folder_id text,
  thumbnail_path text,
  original_filename text not null,
  mime_type text not null,
  width integer,
  height integer,
  size_bytes bigint,
  taken_at timestamptz,
  latitude numeric,
  longitude numeric,
  camera_model text,
  orientation integer,
  caption text,
  alt_text text,
  dominant_subject text,
  created_at timestamptz not null default now()
);

create index if not exists photos_owner_id_idx on public.photos (owner_id);
create index if not exists photos_taken_at_idx on public.photos (taken_at);

-- ---------------------------------------------------------------------------
-- memory_events
-- ---------------------------------------------------------------------------
create table if not exists public.memory_events (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  slug text not null unique,
  title text not null,
  subtitle text,
  one_line text,
  diary_body text,
  event_date date not null,
  event_start_time timestamptz,
  event_end_time timestamptz,
  place_name text,
  latitude numeric,
  longitude numeric,
  mood text,
  chapter text,
  template_id text not null,
  cover_photo_id uuid references public.photos (id) on delete set null,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  is_featured boolean not null default false,
  ai_generated boolean not null default false,
  ai_confidence numeric,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists memory_events_owner_status_idx
  on public.memory_events (owner_id, status);
create index if not exists memory_events_event_date_idx
  on public.memory_events (event_date desc);

-- ---------------------------------------------------------------------------
-- event_photos
-- ---------------------------------------------------------------------------
create table if not exists public.event_photos (
  event_id uuid not null references public.memory_events (id) on delete cascade,
  photo_id uuid not null references public.photos (id) on delete cascade,
  sort_order integer not null default 0,
  role text not null default 'detail' check (
    role in ('cover', 'hero', 'detail', 'food', 'place', 'portrait', 'candid')
  ),
  crop_x numeric,
  crop_y numeric,
  crop_zoom numeric,
  primary key (event_id, photo_id)
);

-- ---------------------------------------------------------------------------
-- tags
-- ---------------------------------------------------------------------------
create table if not exists public.memory_tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  category text not null check (
    category in ('mood', 'place', 'activity', 'food', 'relationship')
  )
);

create table if not exists public.event_tags (
  event_id uuid not null references public.memory_events (id) on delete cascade,
  tag_id uuid not null references public.memory_tags (id) on delete cascade,
  primary key (event_id, tag_id)
);

-- ---------------------------------------------------------------------------
-- diary_versions
-- ---------------------------------------------------------------------------
create table if not exists public.diary_versions (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.memory_events (id) on delete cascade,
  title text not null,
  one_line text,
  diary_body text not null,
  tone text not null,
  source text not null check (source in ('ai', 'user')),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- letters
-- ---------------------------------------------------------------------------
create table if not exists public.letters (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  body text not null,
  letter_date date,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- updated_at helper
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists relationship_settings_set_updated_at on public.relationship_settings;
create trigger relationship_settings_set_updated_at
  before update on public.relationship_settings
  for each row execute function public.set_updated_at();

drop trigger if exists memory_events_set_updated_at on public.memory_events;
create trigger memory_events_set_updated_at
  before update on public.memory_events
  for each row execute function public.set_updated_at();

drop trigger if exists letters_set_updated_at on public.letters;
create trigger letters_set_updated_at
  before update on public.letters
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- auto-create owner profile on signup
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1), 'Owner'),
    'owner'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.relationship_settings enable row level security;
alter table public.photos enable row level security;
alter table public.memory_events enable row level security;
alter table public.event_photos enable row level security;
alter table public.memory_tags enable row level security;
alter table public.event_tags enable row level security;
alter table public.diary_versions enable row level security;
alter table public.letters enable row level security;

-- profiles
create policy "profiles_select_own"
  on public.profiles for select
  to authenticated
  using (id = auth.uid());

create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- relationship_settings
create policy "relationship_settings_owner_all"
  on public.relationship_settings for all
  to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

-- photos
create policy "photos_owner_all"
  on public.photos for all
  to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

-- memory_events
create policy "memory_events_owner_all"
  on public.memory_events for all
  to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

-- event_photos via parent ownership
create policy "event_photos_owner_all"
  on public.event_photos for all
  to authenticated
  using (
    exists (
      select 1 from public.memory_events e
      where e.id = event_id and e.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.memory_events e
      where e.id = event_id and e.owner_id = auth.uid()
    )
  );

-- tags are readable by authenticated owners; writes by authenticated
create policy "memory_tags_select_authenticated"
  on public.memory_tags for select
  to authenticated
  using (true);

create policy "memory_tags_write_authenticated"
  on public.memory_tags for all
  to authenticated
  using (true)
  with check (true);

create policy "event_tags_owner_all"
  on public.event_tags for all
  to authenticated
  using (
    exists (
      select 1 from public.memory_events e
      where e.id = event_id and e.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.memory_events e
      where e.id = event_id and e.owner_id = auth.uid()
    )
  );

create policy "diary_versions_owner_all"
  on public.diary_versions for all
  to authenticated
  using (
    exists (
      select 1 from public.memory_events e
      where e.id = event_id and e.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.memory_events e
      where e.id = event_id and e.owner_id = auth.uid()
    )
  );

create policy "letters_owner_all"
  on public.letters for all
  to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Storage buckets (private thumbnails / AI previews)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'memory-thumbnails',
    'memory-thumbnails',
    false,
    5242880,
    array['image/jpeg', 'image/png', 'image/webp']
  ),
  (
    'memory-ai-previews',
    'memory-ai-previews',
    false,
    2097152,
    array['image/jpeg', 'image/png', 'image/webp']
  )
on conflict (id) do nothing;

-- path convention: {ownerId}/{year}/{month}/{uuid}.jpg
create policy "thumbnails_select_own"
  on storage.objects for select
  to authenticated
  using (
    bucket_id in ('memory-thumbnails', 'memory-ai-previews')
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "thumbnails_insert_own"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id in ('memory-thumbnails', 'memory-ai-previews')
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "thumbnails_update_own"
  on storage.objects for update
  to authenticated
  using (
    bucket_id in ('memory-thumbnails', 'memory-ai-previews')
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id in ('memory-thumbnails', 'memory-ai-previews')
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "thumbnails_delete_own"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id in ('memory-thumbnails', 'memory-ai-previews')
    and (storage.foldername(name))[1] = auth.uid()::text
  );
