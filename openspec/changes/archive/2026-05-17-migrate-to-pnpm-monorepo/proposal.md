## Why

The project currently exists as a single Vite+React landing page using npm, but PRD-BE.md defines a comprehensive monorepo architecture with multiple apps (landing-page, backend, web-pwa), shared packages (shared-types, sdk), and Rust services. Migrating to a pnpm workspace monorepo is the foundational step that enables all future development: shared TypeScript types across frontends, a dedicated backend package, a separate web-pwa for Reseller/Pemasok/Etalase, and a unified build/test/lint pipeline.

## What Changes

- **BREAKING**: Replace npm with pnpm as the package manager. npm lockfile (`package-lock.json`) will be replaced by `pnpm-lock.yaml`.
- **BREAKING**: Restructure project directory from flat layout to monorepo layout:
  - Move existing landing page code into `apps/landing-page/`
  - Create `apps/backend/` with scaffolded Hono + Prisma + TypeScript structure
  - Create `apps/web-pwa/` with scaffolded React + TypeScript + Workbox PWA structure
  - Create `packages/shared-types/` with TypeScript interfaces from PRD-BE.md
  - Create `packages/sdk/` with scaffolded API client structure
- Relocate project root config files (`tsconfig.json`, `vite.config.ts`, `tailwind.config.js`, `postcss.config.js`, `index.html`, `public/`, `src/`) into `apps/landing-page/`
- Create root `pnpm-workspace.yaml` and root `package.json` with workspace orchestration scripts
- Update `AGENTS.md` to reflect pnpm workflow (replace `vp install` with `pnpm install`)
- Existing landing page functionality remains identical — no feature changes

## Capabilities

### New Capabilities
- `workspace-setup`: pnpm workspace configuration, root scripts, and cross-package orchestration
- `landing-page-migration`: Relocate existing landing page into `apps/landing-page/` with self-contained config
- `backend-scaffold`: Scaffold Node.js/TypeScript backend package structure (Hono, Prisma, modules)
- `web-pwa-scaffold`: Scaffold PWA React TypeScript package structure (Workbox, pages, services)
- `shared-types-package`: Create `packages/shared-types/` with TypeScript interfaces shared across all apps

### Modified Capabilities
- *(none — existing openspec/specs/ entries are unrelated to build tooling)*

## Impact

- **New files**: `pnpm-workspace.yaml`, root `package.json` (pnpm-based), `apps/backend/`, `apps/web-pwa/`, `packages/shared-types/`, `packages/sdk/`
- **Moved files**: `src/` → `apps/landing-page/src/`, all config files → `apps/landing-page/`
- **Removed files**: `package-lock.json` (replaced by `pnpm-lock.yaml`)
- **Dependencies**: pnpm must be installed globally; all existing npm packages migrate via `pnpm import`
- **Build tooling**: `vp` CLI remains via Vite+ in each app's package.json; root scripts delegate via `pnpm --filter`
