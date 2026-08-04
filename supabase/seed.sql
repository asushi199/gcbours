-- Seed reference data.
-- 1) Create an admin user in Supabase Auth (Dashboard → Users), note the UUID.
-- 2) Replace :owner_id below, or run after login so profiles row already exists.
--
-- Example (SQL editor):
--   \set owner_id '00000000-0000-4000-8000-000000000099'

-- Tags (safe to re-run)
insert into public.memory_tags (name, category)
values
  ('日常', 'activity'),
  ('旅行', 'activity'),
  ('庆祝', 'activity'),
  ('食物', 'food'),
  ('地点', 'place'),
  ('夜晚', 'mood'),
  ('温暖', 'mood')
on conflict (name) do nothing;

-- After you have an owner profile id, run the block below with that UUID:
--
-- insert into public.relationship_settings (
--   owner_id,
--   relationship_title,
--   partner_name,
--   owner_name,
--   relationship_start_date,
--   unlock_title,
--   unlock_hint
-- ) values (
--   '<OWNER_UUID>',
--   'OURS',
--   '她',
--   '我',
--   '2023-01-01',
--   'PERSONAL MEMORY ARCHIVE',
--   'Enter the date only we remember.'
-- )
-- on conflict (owner_id) do nothing;
--
-- insert into public.letters (owner_id, title, body, letter_date, status)
-- values (
--   '<OWNER_UUID>',
--   '写给你的一封信',
--   E'这个档案没有最后一页。\n\n生日快乐。\n谢谢你出现在我的生活里。',
--   current_date,
--   'draft'
-- );
