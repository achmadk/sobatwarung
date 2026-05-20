## 1. Project Setup

- [x] 1.1 Create `services/rust-sync-engine/` directory with Cargo workspace structure
- [x] 1.2 Initialize `Cargo.toml` with workspace configuration
- [x] 1.3 Add dependencies: axum, tokio, tonic, prost, sqlx, yrs, nats.rs, wasm-pack
- [x] 1.4 Create proto files for gRPC service definition
- [x] 1.5 Configure Rust toolchain (rust-toolchain.toml with stable 1.75+)
- [x] 1.6 Add Dockerfile and docker-compose.yml for the service

## 2. Core CRDT Engine

- [x] 2.1 Implement Yrs document store with agency-scoped documents
- [x] 2.2 Implement CRDT merge operations for Products entity
- [x] 2.3 Implement CRDT merge operations for Orders entity
- [x] 2.4 Implement CRDT merge operations for GroupBuying entity
- [x] 2.5 Implement vector clock generation and comparison
- [x] 2.6 Implement conflict resolution strategies (LWW, state-based, add-wins)
- [x] 2.7 Add PostgreSQL persistence for CRDT state using sqlx

## 3. gRPC Interface

- [x] 3.1 Generate protobuf code with tonic-build
- [x] 3.2 Implement SyncBatch gRPC handler
- [x] 3.3 Implement GetState gRPC handler
- [x] 3.4 Implement gRPC authentication middleware
- [x] 3.5 Add health check endpoint (grpc.health.v1)
- [x] 3.6 Create gRPC client for Node.js integration

## 4. WebSocket Server

- [x] 4.1 Set up Axum WebSocket server with tokio-tungstenite
- [x] 4.2 Implement connection registry with agency scoping
- [x] 4.3 Implement WebSocket message protocol (sync, broadcast, ping/pong)
- [x] 4.4 Add JWT authentication for WebSocket connections
- [x] 4.5 Implement broadcast to agency clients on state change
- [x] 4.6 Add connection heartbeat and cleanup

## 5. NATS Integration

- [x] 5.1 Configure NATS client with JetStream support
- [x] 5.2 Implement NATS connection manager with reconnection
- [x] 5.3 Subscribe to `sync.>` topic hierarchy
- [x] 5.4 Publish conflict resolution events to `sync.conflict_resolved`
- [x] 5.5 Implement request/reply patterns for state snapshots
- [x] 5.6 Add JetStream persistence configuration

## 6. Crypto Module

- [x] 6.1 Implement X25519 key generation and exchange
- [x] 6.2 Implement ChaCha20-Poly1305 encryption/decryption
- [x] 6.3 Implement Ed25519 signature verification
- [x] 6.4 Add WASM compilation target with wasm-pack
- [x] 6.5 Create JavaScript bindings for web PWA consumption
- [x] 6.6 Implement server-side re-encryption for forwarding

## 7. Database Schema

- [x] 7.1 Create PostgreSQL schema for CRDT document persistence
- [x] 7.2 Add migration files for sqlx
- [x] 7.3 Create agency_key_registry table for public keys
- [x] 7.4 Create sync_state table for tracking sync progress
- [x] 7.5 Add indexes for efficient state lookups

## 8. Testing

- [x] 8.1 Write unit tests for CRDT merge operations
- [x] 8.2 Write integration tests for gRPC handlers
- [x] 8.3 Write integration tests for WebSocket connections
- [x] 8.4 Write integration tests for NATS pub/sub
- [x] 8.5 Add WASM crypto module tests
- [x] 8.6 Set up CI/CD pipeline for Rust service

## 9. Monorepo Integration

- [x] 9.1 Update pnpm-workspace.yaml to include services/*
- [x] 9.2 Add build script for Rust service (cargo build --release)
- [x] 9.3 Create docker-compose development environment
- [x] 9.4 Add protobuf generation to build pipeline
- [x] 9.5 Document service endpoints and configuration
