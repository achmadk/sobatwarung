## 1. Workspace Setup

- [x] 1.1 Create `pnpm-workspace.yaml` pointing to `apps/*`, `packages/*`, `services/*`
- [x] 1.2 Create root `package.json` with workspace orchestration scripts (dev:landing, build:all, lint) and `@sobat` scope
- [x] 1.3 Create root `tsconfig.json` with project references to all workspace packages
- [x] 1.4 Create root `.npmrc` with `shamefully-hoist=true` for Vite+ compatibility

## 2. Migrate Landing Page to apps/landing-page/

- [x] 2.1 Create `apps/landing-page/` directory structure
- [x] 2.2 Move `src/`, `public/`, `index.html`, `vite.config.ts`, `postcss.config.js`, `tailwind.config.js` into `apps/landing-page/`
- [x] 2.3 Move `tsconfig.app.json`, `tsconfig.node.json` into `apps/landing-page/`
- [x] 2.4 Create `apps/landing-page/package.json` with `@sobatwarung/landing-page` name, all existing dependencies, and `vp` scripts
- [x] 2.5 Create `apps/landing-page/tsconfig.json` extending root tsconfig
- [x] 2.6 Update relative paths in moved files if needed (e.g., path aliases)

## 3. Scaffold Backend Package

- [x] 3.1 Create `apps/backend/` with `package.json` (`@sobatwarung/backend`), `tsconfig.json`, and module directories (api, ws, services, sync, agents, db, whatsapp, auth, config)
- [x] 3.2 Create placeholder `src/index.ts` entry point

## 4. Scaffold Web PWA Package

- [x] 4.1 Create `apps/web-pwa/` with `package.json` (`@sobatwarung/web-pwa`), `tsconfig.json`, and module directories (pages/etalase, pages/reseller, pages/pemasok, pages/auth, services)
- [x] 4.2 Create placeholder `public/manifest.json` and `src/App.tsx`

## 5. Create Shared Types Package

- [x] 5.1 Create `packages/shared-types/` with `package.json` (`@sobatwarung/shared-types`), `tsconfig.json`
- [x] 5.2 Create TypeScript interface files: `user.ts`, `buying-room.ts`, `order.ts`, `product.ts`, `agent-event.ts`, `sync.ts`, `index.ts` (exports)

## 6. Create SDK Package Scaffold

- [x] 6.1 Create `packages/sdk/` with `package.json` (`@sobatwarung/sdk`) and `src/client.ts` placeholder

## 7. Setup pnpm and Validate

- [x] 7.1 Run `pnpm import` to convert `package-lock.json` → `pnpm-lock.yaml`
- [x] 7.2 Run `pnpm install` to install all workspace dependencies
- [x] 7.3 Run `pnpm --filter @sobatwarung/landing-page build` to verify landing page builds
- [x] 7.4 Run `pnpm -r build` to verify all packages build
- [x] 7.5 Update `AGENTS.md` to reference pnpm commands (replace `vp install` with `pnpm install`, add workspace scripts)
- [x] 7.6 Remove `package-lock.json` (old npm lockfile)
