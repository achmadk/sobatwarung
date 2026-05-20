## ADDED Requirements

### Requirement: Node.js gRPC Client for Sync Operations

The Node.js backend SHALL forward sync push and pull operations to the Rust Sync Engine via gRPC for CRDT-based conflict resolution using `yrs`.

#### Scenario: Node.js forwards syncPush to Rust via gRPC

- **WHEN** a mobile client submits a `POST /api/v1/sync/push` with batched offline mutations
- **THEN** Node.js SHALL forward the payload to Rust via gRPC `SyncService.SyncPush` and return the merged result to the client

#### Scenario: Node.js forwards syncPull to Rust via gRPC

- **WHEN** a mobile client submits a `POST /api/v1/sync/pull` with sync state vector
- **THEN** Node.js SHALL forward the request to Rust via gRPC `SyncService.SyncPull` and return the client's missing updates

#### Scenario: gRPC connection failure triggers fallback

- **WHEN** the Rust gRPC server is unavailable and `SYNC_USE_GRPC=true`
- **THEN** Node.js SHALL log the error, increment a circuit breaker failure counter, and return an appropriate error response to the client

### Requirement: gRPC Connection Management

The Node.js gRPC client SHALL manage connection pooling and keep-alive to ensure efficient communication with the Rust Sync Engine.

#### Scenario: gRPC client maintains persistent connection

- **WHEN** the gRPC channel is established
- **THEN** Node.js SHALL reuse the channel for subsequent requests to minimize connection overhead

#### Scenario: gRPC client handles server restart

- **WHEN** the Rust server restarts and the gRPC channel becomes stale
- **THEN** Node.js SHALL automatically reconnect and resume operations
