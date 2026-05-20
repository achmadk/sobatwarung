## ADDED Requirements

### Requirement: README SHALL document the SobatWarung project overview

The project README at the monorepo root SHALL provide a concise project overview including:
- Project name and tagline ("SobatWarung: Independent Keagenan & Komunal Ecosystem")
- Brief description of the platform's purpose (offline-first, multi-tier agency framework for warung)
- Key target users (Agen Utama, Agen Mitra, Reseller, Pemasok)

### Requirement: README SHALL document the monorepo structure

The README SHALL document the complete monorepo structure using the following sections:

**Apps section** SHALL document:
- `apps/landing-page` — Existing Vite+React PWA (main landing page)
- `apps/backend` — Node.js/TypeScript API server with Hono, Prisma, Socket.IO
- `apps/web-pwa` — PWA for Reseller/Pemasok/Etalase

**Packages section** SHALL document:
- `packages/shared-types` — TypeScript interfaces shared across apps
- `packages/sdk` — Auto-generated API client from OpenAPI spec

**Services section** SHALL document:
- `services/rust-sync-engine` — Rust microservice (Phase 2: CRDT sync, crypto hub)

### Requirement: README SHALL document the tech stack

The README SHALL document the technology stack for each component:
- Frontend: React, TypeScript, Vite, PWA (Workbox)
- Backend: Node.js 22 LTS, Hono, Prisma, PostgreSQL, Redis, Socket.IO, Baileys (WhatsApp)
- Rust (Phase 2): Rust, tokio, axum, yrs (CRDTs), NATS, sqlx, tonic (gRPC)
- DevOps: pnpm workspaces, Docker Compose, Vite+

### Requirement: README SHALL document pnpm workspace commands

The README SHALL document all available workspace commands:

| Command | Description |
|---------|-------------|
| `pnpm dev:landing` | Start landing page dev server |
| `pnpm dev:web-pwa` | Start web PWA dev server |
| `pnpm dev:backend` | Start backend dev server |
| `pnpm build:landing` | Build landing page for production |
| `pnpm build:web-pwa` | Build web PWA for production |
| `pnpm build:backend` | Build backend for production |
| `pnpm build:shared` | Build shared types package |
| `pnpm build:all` | Build all workspace packages |
| `pnpm lint` | Lint all packages |
| `pnpm typecheck` | Type-check all packages |
| `pnpm format` | Format all files via Oxlint |

### Requirement: README SHALL document backend API routes

The README SHALL document the backend API prefix (`/api/v1`) and available route modules:
- `/auth` — Authentication (register, login, device key)
- `/users` — User management
- `/rooms` — Group buying rooms (Pengadaan Kolektif)
- `/orders` — Order management
- `/products` — Product catalog
- `/etalase` — Digital storefront (Etalase Tetangga)
- `/sync` — Offline sync protocol
- `/agents` — Multi-agent system relay bus

### Requirement: README SHALL document deployment targets

The README SHALL document the deployment strategy:
- **Frontends**: Cloudflare Pages (PWA apps)
- **Backend (Phase 1)**: Fly.io or Docker Compose with Cloudflare Tunnel
- **Rust Service (Phase 2)**: Fly.io container (Singapore region for Indonesia coverage)
- **Database**: PostgreSQL 16 on Fly.io or Railway

### Requirement: README SHALL reference related documentation

The README SHALL reference:
- `PRD.md` — Product vision, personas, and functional requirements
- `PRD-BE.md` — Full technical architecture documentation
- `AGENTS.md` — Agent/skills configuration and developer tooling

#### Scenario: Contributor reads README to understand project

- **WHEN** a new contributor opens the repository
- **THEN** they can immediately understand the project structure, tech stack, and how to run the development environment

#### Scenario: Developer starts local development

- **WHEN** a developer runs `pnpm install && pnpm dev:backend`
- **THEN** the backend server starts successfully with all dependencies connected

#### Scenario: README stays relevant after updates

- **WHEN** project structure changes (new apps, packages, or routes)
- **THEN** the README sections for structure and routes SHALL be updated to reflect changes
