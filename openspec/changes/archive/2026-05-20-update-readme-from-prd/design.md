## Context

The SobatWarung monorepo (`ekosistem-warung-komunal`) is a pnpm workspace containing:
- `apps/landing-page` — Vite+React PWA
- `apps/backend` — Node.js/TypeScript API server (Hono + Prisma)
- `apps/web-pwa` — PWA for Reseller/Pemasok/Etalase
- `packages/shared-types` — TypeScript interfaces shared across apps
- `packages/sdk` — API client SDK
- `services/rust-sync-engine` — Rust microservice (Phase 2)

The current `README.md` is the default Vite template scaffold with no project-specific content.

## Goals / Non-Goals

**Goals:**
- Replace the generic Vite README with a comprehensive SobatWarung project README
- Document the monorepo structure, apps, packages, services
- Document the tech stack (React, Hono, Prisma, TypeScript, Rust)
- Document pnpm workspace commands (`pnpm dev:landing`, `pnpm build:all`, etc.)
- Document the Phase 1 (Node.js) and Phase 2 (Rust microservices) architecture
- Document deployment targets (Fly.io for backend/rust, Cloudflare Pages for frontends)
- Document the offline-first, data sovereignty principles

**Non-Goals:**
- This is a documentation-only change — no code modifications
- Not creating a full developer guide — just the main README
- Not updating any existing spec files

## Decisions

1. **Single README at monorepo root** — Keep all project overview content in `README.md` at the repo root rather than分散 across multiple README files
2. **Cross-reference PRD-BE.md** — README will link to `PRD-BE.md` for full technical architecture details, keeping README concise as an entry point
3. **Reference AGENTS.md** — The `AGENTS.md` file contains agent/skills configuration, so README should reference it for developer tooling info

## Risks / Trade-offs

- [Risk] README may become stale if project structure changes → **Mitigation**: Keep README focused on stable aspects (structure, commands) and link to detailed docs for evolving specs
