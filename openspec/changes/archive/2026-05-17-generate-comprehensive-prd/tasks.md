## 1. Document Overview & Monorepo

- [x] 1.1 Write PRD-BE.md header, table of contents, and executive summary for the technical architecture
- [x] 1.2 Write monorepo section: pnpm workspaces structure, workspace topology diagram, shared packages (shared-types, sdk), build orchestration scripts

## 2. Backend Architecture — Node.js/TypeScript (Phase 1)

- [x] 2.1 Write backend overview: technology choices (Express/Hono, Prisma, Redis, socket.io, Baileys), monolith-first rationale, internal module boundaries
- [x] 2.2 Write database schema section: PostgreSQL entities (users, roles, buying rooms, orders, sync queues) with entity-relationship descriptions
- [x] 2.3 Write API design section: RESTful endpoint categories, WebSocket event types, authentication flow (JWT + device key pairing)
- [x] 2.4 Write WhatsApp integration section: Baileys library usage, message templates, Etalase link generation, order notification flow
- [x] 2.5 Write sync protocol section: offline queue format, timestamp-based LWWT conflict resolution, batch sync endpoints, sync reconciliation flow
- [x] 2.6 Write group buying system section: room lifecycle (create → join → aggregate → checkout → distribute), pricing calculation, role-based access
- [x] 2.7 Write agent communication relay section: event bus design, agent event schema, routing rules, WebSocket broadcast topology

## 3. Backend Architecture — Rust Microservices (Phase 2)

- [x] 3.1 Write Rust integration overview: service boundaries (Sync Engine, Crypto Hub), communication patterns with Node.js gateway (gRPC + message queue)
- [x] 3.2 Write CRDT sync engine section: conflict resolution strategy, CRDT library selection (y-crdt / crdt-rs), merge rules per data type, high-volume connection handling with tokio

## 4. Mobile App — Kotlin Compose Multiplatform

- [x] 4.1 Write KMP overview: module structure (commonMain, androidMain, iosMain), shared business logic vs platform-specific UI, target devices (Agen Utama & Agen Mitra)
- [x] 4.2 Write offline-first data layer section: SQLDelight schema, sync queue implementation, CRDT-aware data merging on reconnect
- [x] 4.3 Write agent execution environment section: background agent lifecycle (WorkManager/BGTaskScheduler), local agent communication via in-memory event bus, agent scheduling policies
- [x] 4.4 Write real-time section: Ktor WebSocket client, push notification integration (FCM/APNs), connection state management

## 5. Web App — PWA React TypeScript

- [x] 5.1 Write PWA overview: react app structure, Workbox Service Worker configuration, IndexedDB via Dexie.js, manifest configuration
- [x] 5.2 Write Reseller dashboard section: order management, catalog browsing, sales tracking, WhatsApp integration for order placement
- [x] 5.3 Write Pemasok section: registration flow, product catalog management, order intake
- [x] 5.4 Write Etalase Tetangga section: lightweight public storefront pages, unauthenticated access, WhatsApp link generation, SEO-friendly catalog URLs

## 6. Data Sovereignty & Security

- [x] 6.1 Write encryption architecture section: Ed25519/X25519 key generation, platform-secure key storage, edge encryption before sync, PKI relay via backend
- [x] 6.2 Write data ownership model section: classification tiers (Local Only, Personal Sync, Agency Shared), data retention policies, user-facing data management UI concepts

## 7. Deployment & DevOps

- [x] 7.1 Write deployment architecture section: Docker Compose setup for Phase 1, service diagram, environment configuration, CI/CD pipeline recommendations
- [x] 7.2 Write Phase 2 deployment section: Rust service containerization, gRPC service mesh, horizontal scaling considerations for sync engine

## 8. Validate

- [x] 8.1 Run `vp check` to verify formatting, linting, and type checking pass (for openspec artifacts)
- [x] 8.2 Run `vp build` to verify no build breakage (existing landing page unaffected)
