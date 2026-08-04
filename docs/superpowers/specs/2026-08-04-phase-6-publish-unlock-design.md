# Phase 6 — 发布与私密体验 Design

**Date:** 2026-08-04  
**Status:** Awaiting user review of this file  
**Scope:** Full Phase 6 **except** background music (deferred)

## Goal

让管理员能把草稿回忆正式发布；让对方用专属密码解锁后，只看到已发布内容；缩略图与原图均需会话鉴权，原图永不公开直链。

## Decisions (locked)

| Topic | Choice |
| --- | --- |
| Architecture | Cookie 会话 + 服务端门禁（方案 1） |
| Unlock password | Studio 设置页设置；DB 存 `access_hash`（方案 B） |
| Music | 整块延后（方案 C） |
| Images | 列表用签名缩略图；全屏经鉴权代理拉 Drive 原图（方案 B） |
| Slug on publish | 发布前可编辑一次，默认草稿 slug，做唯一校验（方案 B） |

## Out of scope

- 背景音乐（播放/暂停/音量/会话记忆）
- Phase 7 视觉动效大改（转场、揭示动画等）
- GAS `getFile` 大文件分块流式优化（记下限制，本阶段可用现有 base64 网关）
- 给 partner 开 Supabase Auth 账号
- AI 自动发布

---

## 1. Publish & slug

### Editor UX

- Enable **发布** on the memory editor.
- Clicking opens a confirm panel: title, date, editable slug (default = current draft slug).
- Uniqueness check against `memory_events.slug`; on conflict, show error and suggest a suffixed candidate.
- On confirm: `status = published`, `published_at = now()`, persist final slug.
- **取消发布**: `status = draft`, clear `published_at`, **keep slug**.
- Editing a published memory updates the live published fields (no separate publish pipeline).
- AI generation never publishes.

### Publish guards

Block publish unless:

- at least one linked photo
- non-empty title
- valid `event_date`

### APIs

- `POST /api/memories/[id]/publish` — body `{ slug: string }` — owner auth only
- `POST /api/memories/[id]/unpublish` — owner auth only

### Visibility

| Actor | Draft | Published |
| --- | --- | --- |
| Anonymous | no | no |
| Partner (valid cookie) | no | yes |
| Owner (Supabase Auth) in Studio | yes | yes |
| Owner browsing experience routes | published only (same as partner), unless explicitly using Studio |

---

## 2. Unlock password & session cookie

### Schema

Add migration column:

```sql
alter table public.relationship_settings
  add column if not exists access_hash text;
```

- Store password hash only (Node `scrypt` or bcrypt). Never store plaintext.
- Do not read partner password from `BIRTHDAY_ACCESS_HASH` as the primary path. Env var may remain in `.env.example` as legacy/unused or documented as unused after this phase.

### Studio settings

- Section **解锁密码**: status「已设置 / 未设置」, new password, confirm, save.
- `POST /api/settings/unlock-password` — owner only — body `{ password, confirmPassword }`.
- Optionally allow editing `unlock_title`, `unlock_hint`, `partner_name` used on unlock success copy.
- Never display the current password.

### Unlock flow (`/unlock`)

1. Partner submits code → `POST /api/unlock` (Zod: existing `UnlockPayloadSchema`).
2. Load `relationship_settings.access_hash` (single-tenant / owner settings row used by the app).
3. Verify hash.
4. On success, set cookie `ours_partner_session`:
   - HttpOnly
   - `Secure` in production
   - `SameSite=Lax`
   - Payload: HMAC-signed token using `SESSION_SIGNING_SECRET`, includes expiry (default **30 days**) and role `partner`
5. Failure: generic error (do not over-reveal whether hash is unset vs wrong).
6. Success UI: `Welcome back, [partner_name]` → navigate to `/` or `/story`.
7. `POST /api/unlock/logout` clears cookie. Quiet “重新上锁” control on unlock or experience chrome.

### Rate limiting

Simple best-effort limit on `/api/unlock` (e.g. in-memory / IP window). Return the same generic error when limited.

### Middleware gate

Extend `src/middleware.ts` matcher beyond Studio:

- Protect: `/`, `/story`, `/timeline`, `/letter`, `/memory/:path*`
- Allow without partner cookie: `/unlock`, `/api/unlock`, static assets, auth routes, Studio (Studio stays on Supabase session)
- If **no** valid partner cookie **and** **no** owner Supabase session → redirect to `/unlock`
- Owner Supabase session may enter experience routes for self-test; data loaders still return **published-only** on those routes

---

## 3. Published frontend data

### Loaders (server-only)

- `getPublishedMemories()` — `status = published`, order by `event_date` asc, then `published_at`
- `getPublishedMemoryBySlug(slug)` — event + linked photos (`thumbnail_path`, `drive_file_id` server-side only)
- `getHomeStats()`:
  - days together from `relationship_start_date` (null → omit or show “—”)
  - count published memories
  - distinct non-null `place_name` among published
  - count photos linked to published events
- `getStoryChapters()` — group published by `chapter` with cover thumb, count, date range, one-liner
- Adjacent memories for detail: previous/next among published ordered by `event_date` / `published_at`

When Supabase is unset or empty: show empty states — **do not** pretend mock published data is live.

### Pages

| Route | Behavior |
| --- | --- |
| `/` | Real stats + CTA |
| `/story` | Chapter aggregates from published |
| `/timeline` | Published list; filters map tags/mood/chapter → 旅行/日常/庆祝/食物/地点/全部 |
| `/memory/[slug]` | Real template + diary; prev/next links |
| `/letter` | Read DB letter if present; else empty/placeholder — must not block publish path |

### Studio linkage

- After publish: link「查看已发布页」→ `/memory/[slug]`
- Studio lists distinguish `draft` / `published`

---

## 4. Image auth

### Thumbnails

- Server creates Supabase Storage signed URLs (`memory-thumbnails`, TTL ≈ `appConfig.signedUrlTtlSeconds`) only inside authenticated published (or Studio) loaders.
- Bucket stays private.

### Fullscreen original

- Implement `GET /api/signed-original?photoId=<uuid>`
- Auth: valid partner cookie **or** owner session
- Authorization:
  - Partner: photo must belong to ≥1 **published** memory
  - Owner preview of draft: allow with owner session (optional `preview=1`); partners must never get draft originals
- Fetch via existing GAS `getFile`, decode, return binary with correct `Content-Type`
- Headers: `Cache-Control: private, max-age=300` — no public CDN caching
- Resolve stub `/api/signed-image`: either implement as thumbnail redirect helper or remove usages; prefer one clear original endpoint name (`signed-original`)

### Frontend

- Layouts keep using thumbnail URLs
- Tap photo → lightbox → `src=/api/signed-original?photoId=...`
- Unauthenticated hit → `401` or redirect `/unlock`

### Known limitation

GAS `getFile` returns full-file base64; large originals (>~15MB) may stress memory. Accept for Phase 6; optimize later.

### Forbidden

- Browser-direct public Drive links
- Mirroring originals into Supabase
- Exposing raw long-lived Drive URLs to the client

---

## 5. Modules & file boundaries

| Unit | Responsibility |
| --- | --- |
| `src/lib/security/partner-session.ts` | Sign/verify/clear partner cookie |
| `src/lib/security/password-hash.ts` | Hash + verify unlock password |
| `src/app/api/unlock/route.ts` | Unlock + set cookie |
| `src/app/api/unlock/logout/route.ts` | Clear cookie |
| `src/app/api/settings/unlock-password/route.ts` | Owner sets hash |
| `src/app/api/memories/[id]/publish/route.ts` | Publish + slug |
| `src/app/api/memories/[id]/unpublish/route.ts` | Unpublish |
| `src/app/api/signed-original/route.ts` | Authz + GAS stream |
| `src/features/memories/published.ts` | Published queries + stats + adjacent |
| `src/middleware.ts` | Partner/owner gate for experience routes |
| Studio settings + editor publish UI | Surfaces above APIs |

---

## 6. Testing & acceptance

### Automated

- Unit: slug collision helper, session sign/verify, unlock payload schema, password hash round-trip
- Existing lint / typecheck / test / build must pass

### Manual / E2E checklist

1. Owner sets unlock password in Studio
2. Edit memory → publish with custom slug
3. Sign out / use private window → `/unlock` with password
4. Home stats reflect published data
5. Timeline + memory detail + prev/next work
6. Fullscreen original loads; direct URL without cookie fails
7. Unpublish → partner can no longer open that memory
8. Draft never appears on experience routes

### Product rules

- Music does not autoplay (N/A — music deferred)
- AI never auto-publishes
- No plaintext password in Git, localStorage, or client bundles

---

## 7. Env

Required for partner session:

```env
SESSION_SIGNING_SECRET=<long random>
```

Unlock hash lives in DB after settings save. `BIRTHDAY_ACCESS_HASH` is not the primary store for Phase 6.

---

## 8. Success criteria

Phase 6 is done when an owner can publish/unpublish with editable slug, a partner can unlock with a Studio-configured password, experience pages show only published DB content with real stats and adjacent links, and originals are only reachable through the authenticated proxy.
