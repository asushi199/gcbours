# OURS

私人情侣时光档案馆 — Next.js + Supabase + Google Drive (GAS)。

## 本地开发

```bash
cp .env.example .env.local
# 填入 Supabase / GAS / SESSION_SIGNING_SECRET 等
npm install
npm run dev
```

打开 http://localhost:3000/unlock（对方入口）或 http://localhost:3000/studio（管理员）。

完整环境说明见 [`docs/phase-2-setup.md`](docs/phase-2-setup.md)。

## 脚本

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | 本地开发 |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript |
| `npm run test` | Vitest 单测 |
| `npm run test:e2e` | Playwright 冒烟 |
| `npm run build` | 生产构建 |
| `npm run validate` | lint + typecheck + test + build |
| `npm run seed` | 可选：写入 relationship_settings |

## 文档

- [`docs/deploy.md`](docs/deploy.md) — Vercel / 生产 Supabase 部署
- [`docs/backup.md`](docs/backup.md) — 备份与恢复
- [`docs/privacy-checklist.md`](docs/privacy-checklist.md) — 隐私检查清单
- [`docs/superpowers/specs/2026-08-04-phase-6-publish-unlock-design.md`](docs/superpowers/specs/2026-08-04-phase-6-publish-unlock-design.md) — Phase 6 设计

## 仓库

https://github.com/asushi199/gcbours
