-- Phase 4: user notes on memory events
alter table public.memory_events
  add column if not exists user_note text;
