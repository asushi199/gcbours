# Deploy OURS to production

This guide covers Vercel + Supabase + GAS for the private couple archive.

## Prerequisites

- GitHub repo connected (this project: `asushi199/gcbours`)
- Supabase project (production)
- Google Apps Script web app deployed (`gas/OursDriveGateway.gs`)
- Strong random values for secrets (do not reuse local `.env.local`)

## 1. Production Supabase

1. Create / open the production Supabase project.
2. In SQL Editor, run migrations **in order**:
   - `supabase/migrations/20260804000000_init.sql`
   - `supabase/migrations/20260804010000_memory_user_note.sql`
   - `supabase/migrations/20260804120000_access_hash.sql`
   - `supabase/migrations/20260804140000_chapter_labels.sql`
3. Create the admin Auth user (email/password).
4. Ensure Storage bucket `memory-thumbnails` exists and is **private** (created by init migration / policies).
5. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (**server only**)

Optional: run `npm run seed` locally against production only if you understand it writes relationship settings.

## 2. GAS Drive gateway

Follow [`docs/phase-2-setup.md`](./phase-2-setup.md). Production must use:

- `GAS_WEB_APP_URL`
- `GAS_SHARED_SECRET` (same as Script Property)
- `GAS_ROOT_FOLDER_ID`

Never make Drive folders “anyone with the link”.

## 3. Vercel project

1. Import the GitHub repo into Vercel.
2. Framework preset: Next.js.
3. Set Environment Variables (Production + Preview as needed):

| Name | Notes |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Public |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret, server only |
| `GAS_WEB_APP_URL` | Secret |
| `GAS_SHARED_SECRET` | Secret |
| `GAS_ROOT_FOLDER_ID` | Secret |
| `SESSION_SIGNING_SECRET` | Secret, ≥16 chars, partner cookie HMAC |
| `NEXT_PUBLIC_APP_URL` | e.g. `https://your-domain.vercel.app` |
| `AI_PROVIDER` | `mock` or `openai_compatible` |
| `AI_API_KEY` / `AI_MODEL` / `AI_BASE_URL` | Only if using real AI |
| `AI_VISION` | usually `false` |

4. Deploy. Confirm:
   - `/unlock` loads
   - `/studio` redirects to login
   - After admin login + unlock password set, partner can unlock
   - Publish a memory; partner sees it on `/timeline`
   - Fullscreen original loads via `/api/signed-original`

## 4. Post-deploy checklist

- [ ] Studio settings: unlock password set
- [ ] At least one published memory visible after unlock
- [ ] Draft memories not visible without Studio
- [ ] Service role / GAS secret not present in browser Network payloads
- [ ] Custom domain HTTPS only (if used)

## 5. Local validation before each deploy

```bash
npm run validate
npm run test:e2e
```
