## MODIFIED Requirements

### Requirement: Rust CRDT Sync Engine

The system SHALL include a Rust-based microservice that provides high-performance CRDT-based conflict resolution for offline-first data synchronization.

#### Scenario: Sync engine receives conflicting mutations

- **WHEN** two or more clients submit conflicting mutations for the same resource while offline
- **THEN** the Rust sync engine SHALL apply CRDT merge rules to automatically resolve the conflict without data loss

#### Scenario: Sync engine handles high-volume WebSocket connections

- **WHEN** thousands of clients reconnect simultaneously after a network outage
- **THEN** the Rust async WebSocket server (axum + tokio) SHALL handle the connection surge without significant latency degradation

#### Scenario: CRDT merge for product inventory

- **WHEN** two clients modify the same product's stock while offline
- **THEN** the sync engine SHALL merge using last-write-wins with vector clock ordering for concurrent edits

#### Scenario: CRDT merge for order status

- **WHEN** multiple agents update the same order status concurrently
- **THEN** the sync engine SHALL use state-based CRDT to merge order status transitions deterministically

### Requirement: Rust Crypto Hub

The system SHALL provide a Rust-based cryptographic service for edge encryption/decryption acceleration, compiled to WebAssembly for in-browser use and as a native service for server-side operations.

#### Scenario: Crypto Hub performs edge encryption

- **WHEN** a client device requests encryption of local data before sync
- **THEN** the Rust crypto module SHALL encrypt the payload using the device's private key and return the encrypted blob + signature

#### Scenario: Rust compiled to WebAssembly for browser use

- **WHEN** the web PWA needs to perform encryption/decryption locally
- **THEN** the Rust crypto module SHALL be compiled to WebAssembly and loaded by the PWA for client-side cryptographic operations

#### Scenario: Server-side bulk encryption

- **WHEN** the Rust sync engine receives encrypted sync payloads
- **THEN** it SHALL verify signatures using the sender's public key without decrypting (client-side encryption preserves privacy)

### Requirement: Rust↔Node.js Communication

The Rust microservice SHALL communicate with the Node.js API gateway via gRPC for synchronous operations and via message queue (NATS or Redis Streams) for asynchronous operations.

#### Scenario: Node.js gateway forwards sync request to Rust

- **WHEN** the Node.js backend receives a sync batch that requires CRDT conflict resolution
- **THEN** the gateway SHALL forward the request to the Rust sync engine via gRPC and return the resolved result to the client

#### Scenario: Async event publishing via NATS

- **WHEN** the Rust sync engine resolves conflicts or receives new sync data
- **THEN** it SHALL publish events to NATS topic `sync.events` for downstream processing by Node.js services

#### Scenario: WebSocket client connection management

- **WHEN** mobile or web clients establish WebSocket connection to the sync engine
- **THEN** the Rust server SHALL authenticate via token validation and maintain per-client CRDT document state
