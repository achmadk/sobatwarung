## Why

The existing PRD.md covers the product vision, personas, functional requirements, and Multi-Agent System specification, but lacks detailed technical architecture for the **backend**, **mobile app** (Kotlin Compose Multiplatform), and **web PWA** platforms. A comprehensive PRD-BE.md is needed to define the full-stack architecture, data sync protocols, monorepo structure, and the phased migration path from Node.js/TypeScript to Rust — serving as the single source of truth for engineering execution.

## What Changes

- Create `PRD-BE.md` at project root — a comprehensive technical PRD document covering:
  - **Backend (Phase 1):** Node.js/TypeScript full-feature backend with REST API, WebSocket sync, PostgreSQL/Redis, WhatsApp integration, authentication, group buying room management, order processing, and agent communication relay
  - **Backend (Phase 2):** Rust microservice integration for Sync Engine (CRDT), Crypto Hub, and WebSocket scaling
  - **Mobile App:** Kotlin Compose Multiplatform architecture for Agen Utama & Agen Mitra (shared business logic in commonMain, SQLDelight for offline storage, Ktor for networking, background agent execution)
  - **Web PWA:** React TypeScript PWA architecture for Reseller, Pemasok, and Etalase Tetangga (Service Worker, IndexedDB, WebSocket notifications)
  - **Monorepo Structure:** pnpm workspaces layout with shared packages
  - **Data Sovereignty & Security:** End-to-end encryption, edge key management, data ownership model
- No breaking changes — existing PRD.md, landing page, and registered specs remain untouched
- This is a **documentation-only** change — no source code is modified

## Capabilities

### New Capabilities

- `backend-node-api`: Node.js/TypeScript backend API design (REST + WebSocket, PostgreSQL, Redis, WhatsApp integration, auth)
- `backend-rust-sync-engine`: Rust microservice for CRDT sync engine, crypto hub, and WebSocket scaling (Phase 2)
- `mobile-kmp-app`: Kotlin Compose Multiplatform mobile app architecture for Agen Utama & Agen Mitra
- `web-pwa-app`: PWA React TypeScript web app architecture for Reseller, Pemasok, and Etalase Tetangga
- `data-sovereignty`: End-to-end encryption, edge key management, and data ownership model across all platforms
- `monorepo-contracts`: pnpm workspaces monorepo structure with shared TypeScript types, API contracts, and build orchestration

### Modified Capabilities

- _(none — no existing specs in openspec/specs/ relate to these new architecture documents)_

## Impact

- **New file**: `PRD-BE.md` at project root (~20-30 pages of comprehensive technical documentation)
- **New files**: 6 spec files under `openspec/changes/generate-comprehensive-prd/specs/` (document-only, no source code)
- **No source code changes**: This change produces only documentation artifacts
