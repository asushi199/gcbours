# Phase 6 Publish & Partner Unlock Implementation Plan

> **For agentic workers:** Execute task-by-task. Prefer inline execution in this session (user asked to start building). Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Owner can publish/unpublish with editable slug; partner unlocks via Studio-set password cookie; experience pages show only published data; thumbnails signed + originals proxied via GAS auth.

**Architecture:** HMAC partner session cookie + middleware gate; `relationship_settings.access_hash`; publish APIs; server loaders for published content; `/api/signed-original` for Drive originals.

**Tech Stack:** Next.js App Router, Supabase Auth + Storage, Node crypto (scrypt + HMAC), existing GAS `getFile`, Zod, Vitest.

**Spec:** `docs/superpowers/specs/2026-08-04-phase-6-publish-unlock-design.md`

## Global Constraints

- AI never auto-publishes
- No plaintext password in Git / localStorage / client bundles
- Draft never visible on experience routes to partners
- Music deferred (do not implement)
- `.env.local` secrets never committed
- Run `npm run lint`, `typecheck`, `test`, `build` before claiming done

## File map

| File | Role |
| --- | --- |
| `supabase/migrations/20260804120000_access_hash.sql` | `access_hash` column |
| `src/lib/security/password-hash.ts` | scrypt hash/verify |
| `src/lib/security/partner-session.ts` | cookie sign/verify/clear |
| `src/app/api/unlock/route.ts` | unlock |
| `src/app/api/unlock/logout/route.ts` | logout |
| `src/app/api/settings/unlock-password/route.ts` | set password |
| `src/middleware.ts` + `src/lib/supabase/middleware.ts` | experience gate |
| `src/features/memories/publish-memory.ts` | publish/unpublish |
| `src/features/memories/published.ts` | published queries/stats |
| `src/app/api/signed-original/route.ts` | original proxy |
| Studio settings + editor + experience pages | UI |

---

### Task 1: Password hash + partner session + migration

**Files:**
- Create: `supabase/migrations/20260804120000_access_hash.sql`
- Create: `src/lib/security/password-hash.ts`
- Create: `src/lib/security/password-hash.test.ts`
- Create: `src/lib/security/partner-session.ts`
- Create: `src/lib/security/partner-session.test.ts`
- Modify: `src/types/database.ts` (add `access_hash`)

- [ ] **Step 1:** Migration adds `access_hash text` to `relationship_settings`
- [ ] **Step 2:** `hashPassword` / `verifyPassword` with scrypt; unit tests
- [ ] **Step 3:** `createPartnerSessionToken` / `verifyPartnerSessionToken` / cookie helpers; unit tests
- [ ] **Step 4:** Commit

**Produces:**
- `hashPassword(password: string): Promise<string>`
- `verifyPassword(password: string, hash: string): Promise<boolean>`
- `PARTNER_COOKIE_NAME = "ours_partner_session"`
- `signPartnerSession(): string` / `verifyPartnerSession(token: string): { ok: true; exp: number } | { ok: false }`
- Cookie option helpers for NextResponse

---

### Task 2: Unlock + settings password APIs + unlock UI wire-up

**Files:**
- Modify: `src/app/api/unlock/route.ts`
- Create: `src/app/api/unlock/logout/route.ts`
- Create: `src/app/api/settings/unlock-password/route.ts`
- Modify: `src/components/experience/unlock-screen.tsx`
- Modify: `src/app/(studio)/studio/settings/page.tsx` (+ small client form component)

- [ ] Unlock verifies DB hash, sets cookie, returns partnerName
- [ ] Settings form saves hash (owner only)
- [ ] Unlock screen calls real API
- [ ] Commit

---

### Task 3: Experience middleware gate

**Files:**
- Modify: `src/middleware.ts`
- Modify: `src/lib/supabase/middleware.ts`

- [ ] Protect `/`, `/story`, `/timeline`, `/letter`, `/memory/*`, `/today` except `/unlock`
- [ ] Allow if partner cookie valid OR owner logged in
- [ ] Else redirect `/unlock`
- [ ] Commit

---

### Task 4: Publish / unpublish

**Files:**
- Create: `src/features/memories/publish-memory.ts`
- Create: `src/features/memories/publish-memory.test.ts`
- Create: `src/app/api/memories/[id]/publish/route.ts`
- Create: `src/app/api/memories/[id]/unpublish/route.ts`
- Modify: `src/components/studio/memory-editor.tsx`
- Modify: `src/lib/utils/slug.ts` if needed for uniqueness helper

- [ ] Guards: ≥1 photo, title, date; slug unique
- [ ] Editor publish panel + unpublish
- [ ] Commit

---

### Task 5: Published loaders + experience pages

**Files:**
- Create: `src/features/memories/published.ts`
- Modify: experience pages (`page.tsx`, `story`, `timeline`, `memory/[slug]`)
- Modify: studio list pages for status badges / view link

- [ ] Real stats, lists, adjacent prev/next
- [ ] Empty states when no published data
- [ ] Commit

---

### Task 6: Signed images + lightbox

**Files:**
- Create: `src/app/api/signed-original/route.ts`
- Modify: `src/app/api/signed-image/route.ts` (thumbnail helper or deprecate)
- Create: `src/components/photo-viewer/lightbox.tsx`
- Wire layouts / memory page to lightbox
- Ensure published loaders attach signed thumbnail URLs

- [ ] Partner/owner authz for originals
- [ ] Commit + full validation suite

---

## Execution

User requested start now → **inline execution** of tasks 1→6 in this session with commits after each task.
