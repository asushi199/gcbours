-- Phase 6+: custom story chapter display names
alter table public.relationship_settings
  add column if not exists chapter_labels jsonb;
