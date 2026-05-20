## ADDED Requirements

### Requirement: NATS Connection Manager

The Rust sync engine SHALL manage NATS connections using the async `nats.rs` client with JetStream support.

#### Scenario: Connect to NATS cluster

- **WHEN** the sync engine starts
- **THEN** it SHALL establish a connection to the NATS cluster and configure JetStream for persistence

#### Scenario: Subscribe to sync events

- **WHEN** the sync engine subscribes to `sync.events`
- **THEN** it SHALL consume events for downstream processing by other services

#### Scenario: Publish conflict resolution events

- **WHEN** a conflict is resolved by the CRDT engine
- **THEN** the service SHALL publish a `sync.conflict_resolved` event to NATS

### Requirement: JetStream Persistence

NATS JetStream SHALL provide at-least-once delivery for async sync operations.

#### Scenario: Persist sync mutations for durability

- **WHEN** a mutation is received and processed
- **THEN** the event SHALL be published to a JetStream stream for durability

#### Scenario: Consumer group processing

- **WHEN** multiple Rust instances are deployed for scaling
- **THEN** JetStream consumer groups SHALL ensure each event is processed by exactly one instance

### Requirement: Async Message Types

The NATS integration SHALL use the following message types on the `sync.>` topic hierarchy.

#### Scenario: Publish sync.conflict_resolved

- **WHEN** the CRDT engine resolves a conflict
- **THEN** the message SHALL be published to `sync.conflict_resolved` with `{ agency_id, entity_type, entity_id, resolution, timestamp }`

#### Scenario: Subscribe to sync.mutation_request

- **WHEN** a mutation request arrives via NATS instead of gRPC
- **THEN** the sync engine SHALL process it and publish the result to `sync.mutation_result`

#### Scenario: Handle sync.state_snapshot request

- **WHEN** a service requests the current state via NATS
- **THEN** the sync engine SHALL publish the full state to `sync.state_snapshot.{agency_id}`
