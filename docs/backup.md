# Backup & recovery

OURS splits data across Supabase and Google Drive. Back up both.

## What lives where

| Data | Location |
| --- | --- |
| Auth users, relationship settings, memory metadata, photo rows, diary versions | Supabase Postgres |
| Thumbnails | Supabase Storage `memory-thumbnails` |
| Original photos / HEIC | Google Drive via GAS (`OURS/originals`) |
| Secrets | Vercel env + GAS Script Properties + your password manager |

## Supabase

1. Dashboard → **Project Settings → Database → Backups** (plan-dependent).
2. For free tier: periodically export:
   - Table data via SQL / CSV for critical tables (`memory_events`, `photos`, `event_photos`, `relationship_settings`, `diary_versions`, `letters`)
3. Keep a copy of all SQL under `supabase/migrations/` in Git (already done).

Suggested cadence for a personal archive: **weekly** metadata export while actively uploading; **monthly** otherwise.

## Google Drive originals

1. Drive already has your Google One backup story — keep `OURS` folder under your account.
2. Optionally: Google Takeout for the `OURS` folder before major trips / phone swaps.
3. Do **not** rely on public share links as backup.

## Environment secrets

1. Store production secrets in a password manager (1Password / Bitwarden).
2. Rotate `GAS_SHARED_SECRET` and `SESSION_SIGNING_SECRET` if leaked (rotating session secret logs all partners out).
3. Never commit `.env.local`.

## Recovery sketch

1. Restore / recreate Supabase project → re-run migrations → restore table dumps if needed.
2. Confirm GAS can still read the same Drive root folder ID.
3. Redeploy Vercel with the same env keys (or rotated secrets).
4. Admin logs into Studio; partner re-unlocks with password.
