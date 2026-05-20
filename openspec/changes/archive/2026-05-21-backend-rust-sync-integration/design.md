## Context

The SobatWarung ecosystem consists of:
- **Node.js Backend** (`apps/backend`): Public-facing API Gateway using Hono.js, handling authentication, REST APIs, and WebSocket connections
- **Rust Sync Engine** (`services/rust-sync-engine`): High-performance CRDT-based sync engine using `yrs` (Yrs) for conflict resolution and a Crypto Hub for edge encryption

Currently, these two services exist as isolated silos. The Node.js backend uses Prisma for sync conflict resolution (last-writer-wins), but the Rust engine's `yrs`-based CRDT merge capability is not accessible. Agent events use an in-memory `EventEmitter` which cannot cross service boundaries.

## Goals / Non-Goals

**Goals:**
- Enable gRPC communication from Node.js to Rust for `syncPush` and `syncPull` operations
- Replace in-memory `EventEmitter` with Redis Streams for durable, cross-service agent event distribution
- Implement Privacy-Guard Agent routing: detect encrypted payloads targeting `HUB` or `ALL` and validate via Rust Crypto Hub before WebSocket relay
- Maintain backward compatibility for non-sync API endpoints

**Non-Goals:**
- Migrating existing data from Prisma to Rust
- Implementing full WebAssembly Crypto Hub in browser (handled separately)
- Modifying the mobile KMP client code

## Decisions

### Decision 1: gRPC over REST for Sync Operations

**Choice:** Use gRPC with Protocol Buffers for synchronous sync operations.

**Rationale:** The sync payload structure is well-defined and stable. gRPC provides:
- Binary serialization (efficient for CRDT documents)
- Bi-directional streaming support for future bulk sync
- Generated type-safe clients across Node.js and Rust

**Alternatives considered:**
- REST with JSON: Rejected due to larger payload sizes and lack of bi-directional streaming
- GraphQL: Overkill for this narrow use case

### Decision 2: Redis Streams over NATS for Async Events

**Choice:** Redis Streams as the message broker for agent events.

**Rationale:**
- Redis is already in the stack for caching and pub/sub
- Redis Streams provides persistence, consumer groups, and replay capability
- Simpler operational overhead than NATS

**Alternatives considered:**
- NATS JetStream: More capable but adds operational complexity; Redis Streams is sufficient for current scale
- Kafka: Over-engineered for this use case

### Decision 3: `fred` Crate for Rust Redis Client

**Choice:** Use `fred` crate for Rust Redis Streams consumption.

**Rationale:** `fred` is a mature, async-native Redis client built on tokio with good Streams support.

**Alternatives considered:**
- `redis` crate: Synchronous, would require blocking in async context
- `deadpool-redis`: Connection pooling, doesn't add value here

### Decision 4: Event Routing Based on `targetAudience`

**Choice:** Node.js inspects `targetAudience` field and routes accordingly:
- `HUB`: Forward to Rust Crypto Hub via gRPC or Redis Streams for key validation
- `ALL`: Same as HUB, plus relay via WebSocket after Rust validation

**Rationale:** Keeps routing logic centralized in Node.js while offloading cryptographic validation to Rust.

## Risks / Trade-offs

- **[Risk]** gRPC adds latency for sync operations → **Mitigation:** Profile end-to-end latency; consider connection pooling
- **[Risk]** Redis Streams consumer lag in Rust → **Mitigation:** Monitor with Redis Streams metrics; scale consumer group
- **[Risk]** Breaking change if Rust gRPC server is unavailable → **Mitigation:** Implement circuit breaker in Node.js; fallback to local Prisma resolution with warning logs
- **[Trade-off]** Increased complexity in Node.js routing logic → Acceptable given clear separation of concerns

## Migration Plan

1. **Phase 1:** Add gRPC client to Node.js with feature flag (`SYNC_USE_GRPC=true`)
2. **Phase 2:** Implement Redis Streams producer in Node.js alongside existing EventEmitter (dual-write)
3. **Phase 3:** Implement Redis Streams consumer in Rust with consumer group
4. **Phase 4:** Enable Privacy-Guard routing with Rust validation
5. **Phase 5:** Remove feature flags and EventEmitter after validation

**Rollback:** Disable feature flags to revert to current behavior.

## Open Questions

- Should the Rust gRPC server be embedded in the same process as the Rust Sync Engine or separate?
- What is the expected max latency for gRPC sync operations? (Needs performance benchmarking)
- Should we implement retry logic with exponential backoff for Redis Streams consumer?
