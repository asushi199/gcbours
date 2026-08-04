# Privacy checklist

Use before production launch and after major feature work.

## Forbidden (must stay true)

- [ ] No plaintext partner password in Git, client bundles, or `localStorage`
- [ ] No `SUPABASE_SERVICE_ROLE_KEY` / `GAS_SHARED_SECRET` / `AI_API_KEY` with `NEXT_PUBLIC_` prefix
- [ ] No public Supabase Storage bucket for thumbnails or originals
- [ ] No “anyone with the link” Google Drive shares for originals
- [ ] Draft memories never appear on `/`, `/story`, `/timeline`, `/memory/*` for partners
- [ ] AI never auto-publishes
- [ ] Music never autoplays (music feature deferred; keep this when added)

## Access model

- [ ] Studio = Supabase Auth owner only
- [ ] Partner = unlock password → HttpOnly cookie (`ours_partner_session`)
- [ ] Originals only via `/api/signed-original` after authz
- [ ] Thumbnails only via short-lived signed URLs generated server-side

## Content hygiene

- [ ] No real names/birthdays/passwords hard-coded in source
- [ ] No unauthorized stock photos
- [ ] User notes (`user_note`) not shown on public/partner pages unless intentionally designed

## Ops

- [ ] Production `SESSION_SIGNING_SECRET` is unique and long
- [ ] Vercel preview env does not reuse production service role casually (or accepts the risk)
- [ ] Backup plan documented in [`backup.md`](./backup.md)

## Quick manual probe

1. Incognito → `/timeline` → must land on `/unlock`
2. Wrong unlock password → generic failure, no stack traces
3. Correct unlock → only published content
4. DevTools → Network: no service role key, no GAS secret, no Drive public URLs
