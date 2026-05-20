## Why

The ekosistem-warung-komunal requires a high-performance, CRDT-based synchronization engine to handle offline-first data conflicts across mobile and web clients. The existing Node.js backend cannot meet the performance demands for real-time conflict resolution during mass reconnection events. A Rust-based microservice provides the necessary performance characteristics while integrating with the existing monorepo architecture.

## What Changes

- Create a new Rust microservice under `services/rust-sync-engine/` using Axum framework and Tokio runtime
- Implement CRDT-based conflict resolution for Products, Orders, and GroupBuying entities
- Build async WebSocket server for real-time sync notifications
- Implement gRPC interface for Node.js gateway communication
- Add NATS/Redis Streams for async message queuing
- Compile cryptographic module to WebAssembly for client-side encryption
- Create Docker containerization for deployment

## Capabilities

### New Capabilities

- `rust-sync-engine-core`: Core CRDT sync engine with conflict resolution algorithms
- `rust-sync-websocket`: Async WebSocket server for real-time client connections
- `rust-sync-grpc`: gRPC interface for synchronous operations with Node.js gateway
- `rust-crypto-wasm`: WebAssembly crypto module for client-side encryption acceleration
- `rust-sync Nats-integration`: NATS message queue integration for async operations

### Modified Capabilities

- `backend-rust-sync-engine`: Extend existing spec to include detailed implementation requirements for the Rust service
- `monorepo-contracts`: Add Rust service to pnpm workspace configuration

## Impact

- New service directory: `services/rust-sync-engine/` with Cargo workspace structure
- New dependency: Rust toolchain (stable 1.75+)
- New dependency: tonic for gRPC, tokio-postgres for database, rusoto for AWS services
- gRPC proto definitions for Node.js ↔ Rust communication
- WebSocket endpoint at `/ws/sync` for client connections
- NATS topic subscriptions for `sync.>` events
