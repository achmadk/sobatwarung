## Requirements

### Requirement: Rust CRDT Sync Engine

The system SHALL include a Rust-based microservice that provides high-performance CRDT-based conflict resolution for offline-first data synchronization.

#### Scenario: Sync engine receives conflicting mutations

- **WHEN** two or more clients submit conflicting mutations for the same resource while offline
- **THEN** the Rust sync engine SHALL apply CRDT merge rules to automatically resolve the conflict without data loss

#### Scenario: Sync engine handles high-volume WebSocket connections

- **WHEN** thousands of clients reconnect simultaneously after a network outage
- **THEN** the Rust async WebSocket server (axum + tokio) SHALL handle the connection surge without significant latency degradation

### Requirement: Rust Crypto Hub

The system SHALL provide a Rust-based cryptographic service for edge encryption/decryption acceleration, compiled to WebAssembly for in-browser use and as a native service for server-side operations.

#### Scenario: Crypto Hub performs edge encryption

- **WHEN** a client device requests encryption of local data before sync
- **THEN** the Rust crypto module SHALL encrypt the payload using the device's private key and return the encrypted blob + signature

#### Scenario: Rust compiled to WebAssembly for browser use

- **WHEN** the web PWA needs to perform encryption/decryption locally
- **THEN** the Rust crypto module SHALL be compiled to WebAssembly and loaded by the PWA for client-side cryptographic operations

### Requirement: Rust↔Node.js Communication

The Rust microservice SHALL communicate with the Node.js API gateway via gRPC for synchronous operations and via message queue (NATS or Redis Streams) for asynchronous operations.

#### Scenario: Node.js gateway forwards sync request to Rust

- **WHEN** the Node.js backend receives a sync batch that requires CRDT conflict resolution
- **THEN** the gateway SHALL forward the request to the Rust sync engine via gRPC and return the resolved result to the client
