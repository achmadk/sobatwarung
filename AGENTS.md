<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is a **pnpm workspace monorepo**. All apps and packages are managed via pnpm workspaces.

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Project Structure

```
sobatwarung/
├── apps/
│   ├── landing-page/        # Existing Vite+React PWA (main landing page)
│   ├── backend/             # Node.js/TypeScript API server
│   └── web-pwa/             # PWA for Reseller/Pemasok/Etalase
├── packages/
│   ├── shared-types/        # TypeScript interfaces shared across apps
│   └── sdk/                 # API client SDK
└── services/                # Phase 2 — Rust microservices
```

## Review Checklist

- [ ] Run `pnpm install` after pulling remote changes — NOT `npm install`
- [ ] Run `pnpm build:landing` to build the landing page
- [ ] Run `pnpm build:all` to build all workspace packages
- [ ] Run `pnpm lint` to lint all packages
- [ ] Run `pnpm typecheck` to type-check all packages
- [ ] Run `pnpm dev:landing` to start the landing page dev server

## Commands

| Command | Description |
|---------|-------------|
| `pnpm dev:landing` | Start landing page dev server |
| `pnpm build:landing` | Build landing page for production |
| `pnpm build:shared` | Build shared types package |
| `pnpm build:all` | Build all workspace packages |
| `pnpm lint` | Lint all packages |
| `pnpm typecheck` | Type-check all packages |
| `pnpm format` | Format all files via Oxlint |

<!--VITE PLUS END-->
