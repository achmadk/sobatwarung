## Context

The SobatWarung platform is a multi-tier agency ecosystem (Keagenan Framework) supporting Agen Utama, Agen Mitra, Reseller, and Pemasok roles. The MVP phase requires a Node.js/TypeScript backend to serve the web PWA and future mobile app clients.

**Current State**: The monorepo has a landing page and web-pwa scaffold. The `packages/shared-types` exists with basic interfaces. No backend implementation exists.

**Constraints**:
- Must support offline-first clients with eventual consistency
- WhatsApp integration must be self-hosted (no Business API costs)
- Device-level encryption keys for data sovereignty
- Phase 2 will migrate sync engine to Rust microservices

**Stakeholders**: Agen Utama (hub owners), Agen Mitra (sub-agents), Reseller (downstream sellers), Pemasok (suppliers)

## Goals / Non-Goals

**Goals:**
- Implement complete REST API and WebSocket backend in `apps/backend/`
- PostgreSQL database with Prisma ORM for relational integrity
- JWT authentication with refresh tokens and device key verification
- Group buying room lifecycle management (OPEN → LOCKED → CHECKOUT → DISTRIBUTED)
- Order processing with status transitions
- Offline sync queue with timestamp-based LWWT conflict resolution
- WhatsApp notifications via Baileys (self-hosted)
- Agent communication relay via in-memory event bus
- Docker Compose deployment configuration

**Non-Goals:**
- Rust sync engine (Phase 2)
- Mobile app backend beyond REST/WebSocket APIs
- gRPC inter-service communication (Phase 2)
- Full end-to-end encryption (Privacy-Guard is device-side only for Phase 1)
- Push notification infrastructure (FCM/APNs)

## Decisions

### Decision 1: Hono over Express for HTTP Framework

**Choice**: Hono with `@hono/node-server` adapter
**Rationale**: Hono is lightweight, fast, and has first-class TypeScript support. It provides WebSocket support via `ws` adapter and has middleware for JWT, CORS, and body parsing. Express is more mature but Hono's performance and DX justify the choice for a greenfield project.

**Alternatives Considered**:
- Express: More plugins, but slower and not TypeScript-native
- Fastify: Good performance but more complex setup
- NestJS: Overkill for MVP scope

### Decision 2: Prisma over raw SQL or other ORMs

**Choice**: Prisma with PostgreSQL
**Rationale**: Prisma provides type-safe queries, auto-generated client, and excellent migration tooling. The schema is defined in `schema.prisma` and generates TypeScript types.

**Alternatives Considered**:
- Raw SQL (pg): Maximum control but no type safety, manual query building
- TypeORM: More features but slower DX, complex configuration
- Drizzle: Lighter but less mature ecosystem

### Decision 3: Socket.io for WebSocket

**Choice**: Socket.io
**Rationale**: Socket.io provides automatic reconnection, room-based broadcasting, and fallback to long-polling. Essential for the group buying room updates and agent event relay.

**Alternatives Considered**:
- Native `ws`: Lighter but no automatic reconnection or room semantics
- SSE: One-way only, not suitable for real-time bidirectional needs

### Decision 4: Baileys for WhatsApp Integration

**Choice**: Baileys (MD protocol)
**Rationale**: Self-hosted, no WhatsApp Business API costs. Baileys is the most mature open-source solution for WhatsApp Web protocol.

**Alternatives Considered**:
- WhatsApp Business API: Too expensive for small warungs
- Chat API: Third-party, less control
- None: Not viable for the Etalase feature

### Decision 5: Redis for Session Store and Pub-Sub

**Choice**: Redis 7
**Rationale**: Redis serves dual purpose: session token storage (for refresh token invalidation) and Socket.io pub-sub adapter for multi-instance deployment.

**Alternatives Considered**:
- In-memory only: Doesn't scale beyond single instance
- PostgreSQL sessions: Slower than Redis for frequent reads

### Decision 6: JWT with Refresh Token Rotation

**Choice**: Short-lived access tokens (15 min) + long-lived refresh tokens (7 days) stored in Redis
**Rationale**: Enables server-side token revocation and reduces window of compromise for stolen access tokens.

**Alternatives Considered**:
- Single long-lived JWT: No revocation capability
- OAuth2/OIDC: Overkill for this scope

## Risks / Trade-offs

**[Risk] Baileys WhatsApp session instability**
→ **Mitigation**: Store sessions in persistent volume, implement reconnection logic with exponential backoff. Accept that WhatsApp web protocol may break on WhatsApp updates.

**[Risk] Offline sync conflicts**
→ **Mitigation**: LWWT for scalar fields, additive merge for arrays. Semantic conflicts (e.g., double-booking last unit) flagged for manual resolution. Clear user messaging about conflict states.

**[Risk] Redis single point of failure**
→ **Mitigation**: Redis Sentinel for HA in Phase 2. For MVP, single Redis instance is acceptable with persistent storage.

**[Risk] JWT token theft**
→ **Mitigation**: Device public key signatures required for sync endpoints. Short access token expiry. Refresh token stored server-side in Redis for revocation.

**[Risk] Database migration complexity**
→ **Mitigation**: Prisma Migrate for versioned, reversible schema changes. Never modify historical migrations.

## Migration Plan

1. **Development Setup**: Run `pnpm install` to install backend dependencies
2. **Database**: Run `pnpm --filter @sobatwarung/backend prisma migrate dev` to create tables
3. **WhatsApp Auth**: Pair Baileys client by scanning QR code on first startup
4. **Deploy**: Docker Compose builds and starts all services
5. **Rollback**: Previous Docker image tag remains available; database migrations are additive-only for MVP

## Open Questions

1. Should Etalase links support deep-linking into mobile app when available?
2. What's the rate limit strategy for sync/push endpoint to prevent abuse?
3. Should room checkout automatically create an order or require separate confirmation?
4. How to handle WhatsApp message delivery failures (retry queue, dead letter)?
