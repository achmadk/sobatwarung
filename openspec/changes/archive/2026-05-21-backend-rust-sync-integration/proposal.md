## Why

The Node.js backend (`apps/backend`) and the Rust Sync Engine (`services/rust-sync-engine`) currently exist as isolated silos. Mobile clients performing offline sync operations cannot leverage Rust's CRDT conflict resolution (yrs), and agent events cannot be asynchronously processed by Rust's Crypto Hub. This integration is blocking Phase 2 completion.

## What Changes

- **gRPC Sync Bridge**: Node.js will forward `syncPush` and `syncPull` operations to Rust via gRPC instead of local Prisma logic
- **Redis Streams Event Bus**: Replace in-memory `EventEmitter` with Redis Streams for cross-service agent event distribution
- **Privacy-Guard Agent Routing**: Node.js will route encrypted payloads targeted at `HUB` or `ALL` to Rust for cryptographic validation before WebSocket relay

## Capabilities

### New Capabilities

- `grpc-sync-bridge`: gRPC client in Node.js to forward sync operations to Rust Sync Engine for CRDT merge (yrs)
- `redis-event-stream`: Redis Streams producer/consumer for asynchronous agent event distribution between Node.js and Rust
- `privacy-guard-routing`: Backend routing logic for encrypted payload key exchange and validation via Rust Crypto Hub

### Modified Capabilities

- `backend-node-api`: Add new endpoints/routes for gRPC forwarding and Privacy-Guard routing logic
- `backend-rust-sync-engine`: Add Redis Streams consumer for agent events and cryptographic signature verification

## Impact

- **APIs**: `/api/v1/sync/push` and `/api/v1/sync/pull` now forward to Rust via gRPC
- **Dependencies**: Add `@grpc/grpc-js`, `@grpc/proto-loader` to Node.js; Add `redis` or `fred` to Rust
- **Services**: Redis Streams topic `agents` for event distribution
- **Code**: Refactor `apps/backend/src/services/sync.service.ts` and `apps/backend/src/agents/event-bus.ts`; Add background worker in Rust
