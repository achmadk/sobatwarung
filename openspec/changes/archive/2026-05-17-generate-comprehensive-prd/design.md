## Context

The project currently has a landing page (Vite+React PWA) and a PRD.md covering product vision, personas, and functional requirements. What's missing is a **unified technical architecture document** that defines how the backend, mobile app, and web PWA work together. Key architectural challenges include:

- Decentralized offline-first sync with conflict resolution across 3-tier agency hierarchy
- Multi-platform targeting: Node.js backend, KMP mobile app, and React PWA web app
- Phased migration from TypeScript to Rust for performance-critical subsystems
- Data sovereignty with edge encryption

This document defines the architecture that PRD-BE.md will capture.

## Goals / Non-Goals

**Goals:**

- Define the full-stack architecture: Node.js/TypeScript backend (Phase 1) → Rust microservices (Phase 2)
- Define Kotlin Compose Multiplatform mobile app architecture for Agen Utama & Agen Mitra
- Define PWA React TypeScript web app for Reseller, Pemasok, and Etalase Tetangga
- Define pnpm workspaces monorepo structure with shared packages
- Define sync protocol, data ownership model, and encryption architecture
- All documented in a single PRD-BE.md file

**Non-Goals:**

- No source code changes — this is documentation-only
- No changes to the existing landing page or PRD.md
- No detailed API endpoint specifications (those belong in a separate API spec)
- No UI/UX mockups or design system definitions

## Decisions

### D1: Monorepo via pnpm workspaces

- **Choice:** pnpm workspaces with strict dependency isolation
- **Rationale:** pnpm's strict mode prevents phantom dependencies. Workspaces are well-suited for monorepos with shared TypeScript packages. No extra tooling overhead like Nx or turborepo for the initial phase.
- **Structure:**
  ```
  sobatwarung/
    pnpm-workspace.yaml
    apps/
      landing-page/     # Existing Vite+React PWA (npm → pnpm migration)
      backend/          # Node.js/TypeScript (Express/Hono)
      web-pwa/          # React PWA for Reseller/Pemasok/Etalase
    packages/
      shared-types/     # TypeScript interfaces & types
      sdk/              # API client SDK (auto-generated from OpenAPI)
    services/
      rust-sync-engine/ # Rust microservice (Phase 2)
  ```

### D2: Backend — Full feature from day one (Monolith-first)

- **Choice:** Node.js/TypeScript monolith using Express.js (or Hono for edge-compatibility later)
- **Rationale:** A monolith is faster to build and deploy for MVP. The architecture uses internal module boundaries that can later be extracted into microservices. Full feature scope means group buying rooms, order processing, agent relay, and sync protocol are included from the start.
- **Key libraries:** Express/Hono, Prisma (PostgreSQL), ioredis (Redis), socket.io (WebSocket), Baileys (WhatsApp), zod (validation), jsonwebtoken (auth)

### D3: Sync Protocol — Event-sourced with last-writer-wins

- **Choice:** Append-only event log with conflict-free replicated data types (CRDTs) for critical fields, last-writer-wins for simple fields
- **Rationale:** Works within the constraints of offline-first by treating network partitions as expected. CRDTs (via Rust in Phase 2) handle complex merge scenarios. LWWT suffices for simple scalar fields.
- **Phase 1:** Timestamp-based LWWT with conflict detection alerts to users
- **Phase 2:** Full CRDT engine in Rust for automatic conflict resolution

### D4: Mobile — Kotlin Compose Multiplatform with SQLDelight

- **Choice:** KMP with shared business logic in `commonMain`, platform-specific UI in Android/iOS modules
- **Rationale:** Maximizes code sharing while retaining native UI capabilities needed for offline-first UX (background services, local notifications, WorkManager). SQLDelight provides type-safe local SQLite access shared across platforms.
- **Agent execution:** Background agents run via WorkManager (Android) / BGTaskScheduler (iOS), compiled from shared Kotlin common code

### D5: Web PWA — React with Service Worker + IndexedDB

- **Choice:** React + TypeScript with Workbox for Service Worker caching and Dexie.js for IndexedDB access
- **Rationale:** Reseller, Pemasok, and Etalase consumers need frictionless access (no app store install). PWA provides adequate offline support for catalog browsing and order placement. Matches the existing landing page stack.

### D6: Encryption — Edge-first with local key storage

- **Choice:** Client-side encryption using Web Crypto API (web) and Android Keystore/iOS Keychain (mobile), with public key exchange via backend
- **Rationale:** Data sovereignty requires that encryption keys never leave the user's device. The backend relays encrypted payloads but cannot decrypt them. This aligns with the "Data Milik Anda" value proposition.

### D7: API Contracts — OpenAPI 3.1

- **Choice:** OpenAPI 3.1 specification auto-generated from zod schemas
- **Rationale:** Provides a language-agnostic contract that both TypeScript (backend + web) and Kotlin (mobile) clients can generate SDKs from. Zod-to-OpenAPI tooling generates the spec from source of truth.

## Risks / Trade-offs

- **[Medium] Monolith scalability** — As the feature set grows, the Node.js monolith may become a bottleneck. Mitigation: internal modular architecture with clear interface boundaries for future microservice extraction.
- **[Low] pnpm + existing npm project** — The existing landing page uses npm. Migration to pnpm workspace may require dependency resolution adjustments. Mitigation: migrate landing page as part of monorepo setup with `pnpm import` to convert lockfile.
- **[Medium] Kotlin↔TypeScript contract misalignment** — Platform-specific types may diverge between KMP and TypeScript codebases. Mitigation: use OpenAPI as the single source of truth and generate both TypeScript and Kotlin client SDKs.
- **[High] CRDT complexity in Phase 2** — Implementing correct CRDTs is non-trivial and error-prone. Mitigation: use established CRDT libraries (e.g., `crdt-rs` or `y-crdt` for Rust) rather than implementing from scratch.
- **[Low] PWA Storage limits on iOS** — Safari may evict IndexedDB data under storage pressure. Mitigation: clear user communication about data persistence limitations and recommend mobile app for power users (Agen Utama/Mitra).
