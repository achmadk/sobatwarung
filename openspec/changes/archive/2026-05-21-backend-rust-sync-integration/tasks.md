## 1. gRPC Sync Bridge - Node.js

- [x] 1.1 Add `@grpc/grpc-js` and `@grpc/proto-loader` to `apps/backend/package.json`
- [x] 1.2 Copy `sync.proto` from `services/rust-sync-engine/proto/sync.proto` to shared location or reference it
- [x] 1.3 Create `apps/backend/src/grpc/client.ts` for gRPC connection management
- [x] 1.4 Create `apps/backend/src/grpc/sync-service.ts` implementing SyncService client
- [x] 1.5 Refactor `apps/backend/src/services/sync.service.ts` to forward `syncPush` to Rust via gRPC
- [x] 1.6 Refactor `apps/backend/src/services/sync.service.ts` to forward `syncPull` to Rust via gRPC
- [x] 1.7 Add circuit breaker with fallback to local Prisma resolution when `SYNC_USE_GRPC=true`
- [x] 1.8 Add `SYNC_USE_GRPC` environment variable configuration

## 2. gRPC Sync Bridge - Rust

- [x] 2.1 Ensure `sync.proto` defines `SyncService` with `SyncPush` and `SyncPull` RPC methods
- [x] 2.2 Implement `SyncService` server in Rust accepting gRPC requests
- [x] 2.3 Implement CRDT merge logic using `yrs` in the `syncPush` handler
- [x] 2.4 Implement state vector response in the `syncPull` handler
- [x] 2.5 Add tonic-build and prost dependencies to `services/rust-sync-engine/Cargo.toml`

## 3. Redis Streams Event Bus - Node.js

- [x] 3.1 Refactor `apps/backend/src/agents/event-bus.ts` to use Redis Streams producer
- [x] 3.2 Add `XADD` call to publish events to `agents` stream
- [x] 3.3 Include `eventType`, `targetAudience`, `encryptionFlags`, `timestamp`, `deviceId` in event payload
- [x] 3.4 Add dual-write mode with `EVENTS_DUAL_WRITE=true` flag
- [x] 3.5 Remove or deprecate in-memory EventEmitter after validation

## 4. Redis Streams Event Bus - Rust

- [x] 4.1 Add `fred` or `redis` crate to `services/rust-sync-engine/Cargo.toml`
- [x] 4.2 Implement background worker consuming from `agents` stream via `XREADGROUP`
- [x] 4.3 Set up consumer group `sync-engine-group` for the Rust consumer
- [x] 4.4 Implement cryptographic signature verification for events with `encryptionFlags`
- [x] 4.5 Add `XACK` after successful processing
- [x] 4.6 Handle unacknowledged messages with automatic reprocessing

## 5. Privacy-Guard Agent Routing

- [x] 5.1 Add detection logic in Node.js to identify events with `targetAudience: 'HUB'` or `'ALL'` and `encryptionFlags`
- [x] 5.2 Create routing function to forward encrypted events to Rust Crypto Hub via gRPC
- [x] 5.3 Add WebSocket relay in `apps/backend/src/ws/agents.ts` after Rust validation confirms
- [x] 5.4 Ensure plain-text sensitive data is NOT logged in backend
- [x] 5.5 Handle validation failure by discarding event and logging error

## 6. E2E Testing Validation

- [x] 6.1 Write E2E test for gRPC Sync Flow: `POST /api/v1/sync/push` → Rust → response
- [x] 6.2 Write E2E test for Redis Streams: `INITIATE_GROUP_BUY_POOL` event → Redis → Rust consumes
- [x] 6.3 Write E2E test for Privacy-Guard: encrypted payload → Node.js → Rust validation → WebSocket relay
- [x] 6.4 Verify all three E2E scenarios pass before marking change complete
