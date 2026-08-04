# Current Phase

Phase 6 — 发布与私密体验（实现中 / 核心已落地）

## Todo

- [ ] 在 Supabase 执行 migration：`20260804120000_access_hash.sql`
- [ ] Studio 设置解锁密码 → 发布一篇 → 无痕窗口解锁验收
- [ ] 背景音乐（已明确延后）

## In Progress

- [x] 设计文档 + 实现计划
- [x] 解锁密码 / Cookie / middleware
- [x] 发布 / 取消发布
- [x] 前台 published 数据
- [x] 签名缩略图 + 原图代理 + lightbox

## Completed

### Phase 6（代码）
- [x] `access_hash` migration
- [x] password-hash + partner-session
- [x] `/api/unlock` `/api/unlock/logout` `/api/settings/unlock-password`
- [x] 体验路由门禁
- [x] publish / unpublish API + 编辑器 UI
- [x] home / story / timeline / memory 接真数据
- [x] `/api/signed-original` + lightbox

### Phase 5
- [x] AI 日记生成（含 Groq 兼容修复）

## Validation

- [x] typecheck / unit tests（27）
- [ ] lint + production build（提交前再跑）
- [ ] 手工解锁/发布验收

## Notes

- 仓库：https://github.com/asushi199/gcbours
- 需配置 `SESSION_SIGNING_SECRET`（本地已生成，勿提交 `.env.local`）
- 设计：`docs/superpowers/specs/2026-08-04-phase-6-publish-unlock-design.md`
- 计划：`docs/superpowers/plans/2026-08-04-phase-6-publish-unlock.md`
