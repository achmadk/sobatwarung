# SobatWarung

**Independent Keagenan & Komunal Ecosystem**

SobatWarung is an offline-first, decentralized digital ecosystem designed for mom-and-pop shops (warung) outside Java, Indonesia. It bridges the gap caused by unstable internet connectivity and high logistics costs through a resilient **Offline-First Data Architecture** combined with a local **Multi-Agent Smart Layer**.

The platform organizes local supply networks into a three-tier **Keagenan (Agency) Framework**:

- **Agen Utama** — Established local bulk-stores acting as transit inventory nodes
- **Agen Mitra** — Neighborhood shops that source from Agen Utama
- **Reseller** — Individuals selling via WhatsApp catalogs

---

## Tech Stack

### Frontend

- React 19 + TypeScript
- Vite (via Vite+)
- PWA with Workbox

### Backend (Phase 1)

- Node.js 22 LTS
- Hono (lightweight API framework)
- Prisma ORM + PostgreSQL 16
- Redis 7 (cache & pub/sub)
- Socket.IO (real-time WebSocket)
- Baileys (WhatsApp integration)

### Rust Service (Phase 2)

- Rust + tokio (async runtime)
- axum (HTTP framework)
- yrs (CRDTs for offline sync)
- NATS (messaging)
- sqlx + PostgreSQL
- tonic (gRPC)

### DevOps

- pnpm workspaces (monorepo)
- Docker Compose (local dev)
- Vite+ toolchain

---

## Monorepo Structure

```
sobatwarung/
├── apps/
│   ├── landing-page/        # Vite+React PWA (main landing page)
│   ├── backend/             # Node.js/TypeScript API server
│   ├── web-pwa/             # PWA for Reseller/Pemasok/Etalase
│   └── mobile-kmp/          # Kotlin Multiplatform mobile app (Phase 2)
├── packages/
│   ├── shared-types/       # TypeScript interfaces shared across apps
│   └── sdk/                # TypeScript HTTP client library
├── services/
│   └── rust-sync-engine/   # Rust microservice (Phase 2)
└── openspec/               # Change management
```

### Apps

| App                 | Description                                            |
| ------------------- | ------------------------------------------------------ |
| `apps/landing-page` | Public landing page (Vite+React PWA)                   |
| `apps/backend`      | REST API server (Hono + Prisma) with WebSocket support |
| `apps/web-pwa`      | PWA for Reseller, Pemasok, and Etalase storefronts     |
| `apps/mobile-kmp`   | Kotlin Multiplatform mobile app for Agen Utama & Agen Mitra (Phase 2) |

### Packages

| Package                 | Description                                                       |
| ----------------------- | ----------------------------------------------------------------- |
| `packages/shared-types` | TypeScript interfaces (User, Order, BuyingRoom, AgentEvent, etc.) |
| `packages/sdk`          | TypeScript HTTP client library                                     |

### Services

| Service                     | Description                             |
| --------------------------- | --------------------------------------- |
| `services/rust-sync-engine` | CRDT sync engine + crypto hub (Phase 2) |

---

## Quick Start

### Prerequisites

- Node.js 22+
- pnpm 11+
- Docker & Docker Compose (for local backend services)

### Installation

```bash
pnpm install
```

### Development Commands

| Command              | Description                       |
| -------------------- | --------------------------------- |
| `pnpm dev:landing`   | Start landing page dev server     |
| `pnpm dev:web-pwa`   | Start web PWA dev server          |
| `pnpm dev:backend`   | Start backend dev server          |
| `pnpm build:landing` | Build landing page for production |
| `pnpm build:shared`  | Build shared types package        |
| `pnpm build:all`     | Build all workspace packages      |
| `pnpm lint`          | Lint all packages                 |
| `pnpm typecheck`     | Type-check all packages           |
| `pnpm format`        | Format all files via Oxlint       |

### Running Backend Locally

The backend requires PostgreSQL and Redis. Start them with Docker Compose:

```bash
cd apps/backend
docker compose up -d postgres redis
pnpm dev:backend
```

---

## Backend API

Base URL: `/api/v1`

| Route              | Description                                  |
| ------------------ | -------------------------------------------- |
| `GET /health`      | Health check                                 |
| `/api/v1/auth`     | Authentication (register, login, device key) |
| `/api/v1/users`    | User management                              |
| `/api/v1/rooms`    | Group buying rooms (Pengadaan Kolektif)      |
| `/api/v1/orders`   | Order management                             |
| `/api/v1/products` | Product catalog                              |
| `/api/v1/etalase`  | Digital storefront (Etalase Tetangga)        |
| `/api/v1/sync`     | Offline sync protocol                        |
| `/api/v1/agents`   | Multi-agent system relay bus                 |

---

## Deployment

### Frontends

**Cloudflare Pages** — PWA apps deploy directly to Cloudflare's global edge network.

### Backend (Phase 1)

**Fly.io** — Deploy to Singapore region for optimal Indonesia coverage.

```bash
fly launch
fly deploy
```

Alternative: Docker Compose with Cloudflare Tunnel for DDoS protection.

### Rust Service (Phase 2)

**Fly.io** — Container deployment with internal networking to backend.

### Database

**PostgreSQL 16** on Fly.io or Railway.

---

## Documentation

- [PRD.md](./PRD.md) — Product vision, personas, and functional requirements
- [PRD-BE.md](./PRD-BE.md) — Full technical architecture documentation
- [PRD-P2.md](./PRD-P2.md) — Execution guide for Phase 2 Node.js ↔ Rust Integration
- [PRD-UX.md](./PRD-UX.md) — User experience specifications for the web PWA
- [AGENTS.md](./AGENTS.md) — Agent/skills configuration and developer tooling

---

## Architecture Highlights

### Offline-First

The system is designed to work seamlessly in low-connectivity environments. The backend sync protocol handles timestamp-based Last-Writer-Wins (LWWT) reconciliation, while the Phase 2 Rust service introduces CRDT-based conflict-free merging via `yrs`.

### Multi-Agent System

Autonomous software agents operate at the edge:

- **Stock Agent** — Inventory tracking and restock prediction
- **Community Agent** — Collective procurement negotiation
- **Sales Agent** — Hyper-local micro-marketing
- **Privacy-Guard Agent** — Edge security and encryption

### Data Sovereignty

All merchant data remains under merchant control. The Privacy-Guard Agent handles cryptographic signatures and strips sensitive identity tags before external sync.
