## Context

The project is a single Vite+React landing page (`package.json` name: "app") managed via npm. All source code, configs, and dependencies are at the project root. PRD-BE.md defines a pnpm workspace monorepo with the following target structure:

```
apps/landing-page/   ← existing code moves here
apps/backend/        ← new Node.js backend scaffold
apps/web-pwa/        ← new PWA scaffold
packages/shared-types/ ← new shared TypeScript types
packages/sdk/        ← new API client scaffold
services/rust-sync-engine/ ← future Rust (scaffold directory only)
```

The migration must be zero-impact on the landing page's functionality — the same `vp dev` and `vp build` commands must work after the move, just via `pnpm` workspace commands.

## Goals / Non-Goals

**Goals:**

- Create pnpm workspace with `pnpm-workspace.yaml` and root `package.json`
- Migrate existing landing page into `apps/landing-page/` with its own `package.json`, `vite.config.ts`, `tsconfig.json`, `tailwind.config.js`, `postcss.config.js`, `index.html`, `public/`, and `src/`
- Scaffold `apps/backend/` with skeleton module structure matching PRD-BE.md
- Scaffold `apps/web-pwa/` with skeleton PWA structure
- Create `packages/shared-types/` with TypeScript interfaces from PRD-BE.md
- Create `packages/sdk/` with scaffold skeleton
- Root scripts for orchestration (`build:all`, `dev:landing`, `lint`)
- Landing page dev and build still work identically
- Update `AGENTS.md` to reference pnpm workflows

**Non-Goals:**

- No functional changes to the landing page — it must look and behave identically
- No backend logic implementation — only scaffold directory + package.json + placeholder files
- No web-pwa feature implementation — only scaffold directory + package.json + placeholder files
- No Rust service implementation — only empty directory scaffolding
- No CI/CD changes beyond root scripts
- No changes to `openspec/` directory structure

## Decisions

### D1: pnpm import for lockfile conversion

Convert the existing `package-lock.json` to `pnpm-lock.yaml` using `pnpm import` rather than a fresh install. This preserves exact dependency versions and avoids regression risk.

### D2: Landing page keeps Vite+ — separate at apps/landing-page/

The landing page's existing `vite.config.ts` uses `vp` CLI (`@voidzero-dev/vite-plus-core`). This is moved as-is into `apps/landing-page/`. Each app gets its own `package.json` with its own dependencies. The root `package.json` has only workspace orchestration scripts and dev tools.

### D3: Shared config files remain at apps/landing-page/

`tsconfig.app.json`, `tsconfig.node.json`, `tailwind.config.js`, `postcss.config.js`, `index.html`, `public/`, `src/` all move to `apps/landing-page/`. A root `tsconfig.json` is created that references workspace packages via project references.

### D4: Package naming convention

- `@sobatwarung/landing-page` — existing landing page
- `@sobatwarung/backend` — backend scaffold
- `@sobatwarung/web-pwa` — PWA scaffold
- `@sobatwarung/shared-types` — shared types
- `@sobatwarung/sdk` — API client SDK

### D5: workspaces.override for Vite+ compatibility

Since the existing setup uses npm `overrides` for `vite` and `vitest`, these must be converted to pnpm's `pnpm.overrides` in each workspace package's `package.json`.

## Risks / Trade-offs

- **[Medium] pnpm import may produce slightly different lockfile** — The converted `pnpm-lock.yaml` should resolve dependencies identically, but edge cases exist. Mitigation: verify landing page builds after migration, compare bundle output sizes.
- **[Low] Vite+ CLI compatibility with pnpm** — The `vp` command relies on a Vite+ package in `node_modules`. pnpm's strict module isolation could affect this. Mitigation: use `shamefully-hoist=true` in `.npmrc` if needed, or configure `--shamefully-hoist` during install.
- **[Low] Developer environment change** — Existing developers must install pnpm globally and may need to re-run `pnpm install`. Mitigation: document in AGENTS.md.
- **[Low] Git history impact** — Moving files to `apps/landing-page/` loses git blame granularity. Mitigation: use `git mv` for file moves to preserve history.
