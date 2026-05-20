## Context

The ekosistem-warung-komunal requires a high-performance synchronization engine capable of handling CRDT-based conflict resolution for offline-first mobile and web clients. The existing `backend-rust-sync-engine` spec outlines requirements for this service. This design covers the implementation architecture for a Rust microservice using Axum, Tokio, and related technologies.

Key constraints:
- Must integrate with existing Node.js API gateway via gRPC
- Must support WebSocket connections for real-time sync
- Must compile to WebAssembly for client-side crypto operations
- Must handle NATS message queue for async operations
- Must use pnpm workspaces monorepo structure

## Goals / Non-Goals

**Goals:**
- Create a Rust workspace under `services/rust-sync-engine/` with Cargo structure
- Implement CRDT conflict resolution for Products, Orders, and GroupBuying entities
- Build async WebSocket server with connection management
- Create gRPC interface for Node.js gateway communication
- Integrate NATS for event-driven async operations
- Compile crypto module to WebAssembly

**Non-Goals:**
- Complete rewrite of Node.js backend (only sync-specific functionality in Rust)
- Implementing full database ORM (use sqlx with connection pooling)
- Complex multi-region replication (single-region deployment first)
- WASM integration with React Native (mobile KMP handles this)

## Decisions

### Decision 1: Framework Stack

Use **Axum** for HTTP/WebSocket server + **Tokio** async runtime.

**Rationale**: Axum is the most ergonomic web framework for Tokio, has excellent WebSocket support via `tokio-tungstenite`, and integrates well with Tower middleware ecosystem.

### Decision 2: CRDT Implementation

Use **Automerge** or **Yrs** (Yjs Rust bindings) for CRDT operations.

**Rationale**: Yrs provides a proven CRDT implementation with Yjs compatibility for future web PWA integration. Automerge is more feature-rich but heavier.

### Decision 3: gRPC Stack

Use **Tonic** for gRPC server + **prost** for protobuf serialization.

**Rationale**: Tonic is the mature gRPC implementation for Rust with excellent async support. prost generates clean serialization code.

### Decision 4: Message Queue

Use **NATS** via **nats.rs** client with JetStream for persistence.

**Rationale**: NATS provides lightweight pub/sub with excellent Rust support. JetStream adds persistence for async operations that need guaranteed delivery.

### Decision 5: Database

Use **sqlx** with PostgreSQL via **tokio-postgres**.

**Rationale**: sqlx provides compile-time query verification without macros. Works well with async PostgreSQL connections.

### Decision 6: WebAssembly Compilation

Use **wasm-pack** + **wasm-bindgen** for crypto module compilation.

**Rationale**: wasm-pack provides excellent Cargo integration and generates JavaScript-friendly WASM bindings. Crypto operations can be offloaded to WASM for client-side acceleration.

## Risks / Trade-offs

[Risk] Rust compilation times can slow development iteration
→ Mitigation: Use `cargo watch` with incremental compilation, separate workspace members

[Risk] gRPC between Node.js and Rust may have serialization overhead
→ Mitigation: Use prost with `no_std` compatible types for efficiency

[Risk] WASM crypto performance may not match native
→ Mitigation: Benchmark; native Rust crypto available for KMP mobile app

[Risk] NATS connection management in async context
→ Mitigation: Use connection pooling with health checks

## Migration Plan

1. Deploy Rust service alongside Node.js backend with feature flag routing
2. Migrate sync operations one at a time from Node.js to Rust
3. Switch WebSocket endpoint once stability confirmed
4. Remove Node.js sync implementation after full migration

## Open Questions

1. Should the Rust service handle authentication or delegate to Node.js gateway?
2. What is the expected concurrent WebSocket connection count for sizing?
3. Should we use Kubernetes HPA or static scaling for the Rust service?
