## ADDED Requirements

### Requirement: gRPC Service Definition

The Rust sync engine SHALL implement a gRPC service defined in protobuf, accessible via `tonic`.

#### Scenario: Handle SyncBatch gRPC call

- **WHEN** the Node.js gateway sends a SyncBatch request via gRPC
- **THEN** the Rust service SHALL process the batch, apply CRDT merges, and return SyncResult

#### Scenario: Handle GetState gRPC call

- **WHEN** the Node.js gateway requests the current state for an agency
- **THEN** the Rust service SHALL return the full CRDT document state serialized as bytes

#### Scenario: gRPC health check

- **WHEN** the Node.js gateway queries the health endpoint
- **THEN** the Rust service SHALL respond with serving status and dependency health

### Requirement: gRPC Authentication

The gRPC interface SHALL validate authentication tokens before processing requests.

#### Scenario: Validate gateway token

- **WHEN** a gRPC request arrives from the Node.js gateway
- **THEN** the service SHALL validate the JWT token and extract agency context

#### Scenario: Reject invalid token

- **WHEN** a gRPC request has an invalid or expired token
- **THEN** the service SHALL return gRPC UNAUTHENTICATED status

### Requirement: Protobuf Message Types

The gRPC interface SHALL use the following protobuf message types:

#### Scenario: SyncBatch request

- **WHEN** Node.js gateway sends SyncBatch
- **THEN** the message SHALL contain `agency_id`, `client_id`, `batch_id`, and repeated `Mutation` messages

#### Scenario: SyncResult response

- **WHEN** Rust service responds to SyncBatch
- **THEN** the message SHALL contain `batch_id`, `merged_state`, `conflicts`, and `sync_timestamp`

#### Scenario: Mutation message

- **WHEN** a Mutation is included in SyncBatch
- **THEN** the message SHALL contain `id`, `entity_type`, `entity_id`, `payload`, `vector_clock`, and `timestamp`
