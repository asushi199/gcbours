-- Phase 6: partner unlock password hash on relationship settings
alter table public.relationship_settings
  add column if not exists access_hash text;
