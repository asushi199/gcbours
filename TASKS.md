# Current Phase

Phase 6 — 发布与私密体验（设计已定稿，待实现）

## Todo

- [ ] 用户确认设计文档后：写实现计划并开工
- [ ] 设计文档：`docs/superpowers/specs/2026-08-04-phase-6-publish-unlock-design.md`

## In Progress

- [ ] （无；等设计文件确认）

## Completed

### Phase 5
- [x] AIProvider 接口 + MockAIProvider + OpenAICompatibleProvider
- [x] Zod MemoryAnalysisSchema + 系统/用户提示词
- [x] `/api/ai/analyze-memory`（失败保留照片与备注；schema 失败自动修复一次）
- [x] diary_versions 落库；版本列表与恢复
- [x] 编辑器：生成/重新生成、待确认问题、推断事实、历史版本
- [x] Groq JSON/reasoning 兼容修复

## Validation

- [x] Phase 5：lint / typecheck / tests / production build
- [ ] Phase 6：待实现后验收

## Notes

- 默认 `AI_PROVIDER=mock`，无 Key 也能用。
- 真实模型：设置 `AI_PROVIDER=openai_compatible`、`AI_API_KEY`、`AI_MODEL`、可选 `AI_BASE_URL`。
- Groq 当前可用 Qwen：`AI_MODEL=qwen/qwen3.6-27b`（旧的 `qwen/qwen3-32b` 已下线）。改 `.env.local` 后需重启 `npm run dev`。
- 默认不把缩略图发给模型（`AI_VISION=true` 才开启），避免纯文本模型报错。
- AI 不会自动发布。
- Phase 6 不含背景音乐（延后）；解锁密码在 Studio 设置；全屏原图走鉴权代理。
