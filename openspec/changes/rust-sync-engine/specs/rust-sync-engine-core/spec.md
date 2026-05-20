## ADDED Requirements

### Requirement: CRDT Document Store

The Rust sync engine SHALL maintain a CRDT document store for each agency's data, using Yrs (Yjs Rust bindings) for CRDT operations.

#### Scenario: Initialize agency document store

- **WHEN** the sync engine receives the first sync request from an agency
- **THEN** it SHALL create a Yrs document keyed by `agency:{agency_id}` and persist it to PostgreSQL

#### Scenario: Apply mutation to CRDT document

- **WHEN** a sync mutation arrives with vector clock and payload
- **THEN** the engine SHALL apply the mutation to the agency's Yrs document and return the merged result

#### Scenario: Persist CRDT state periodically

- **WHEN** the CRDT document has been updated
- **THEN** the engine SHALL persist the state to PostgreSQL every 5 seconds or after 100 updates

### Requirement: Conflict Resolution Strategies

The sync engine SHALL support configurable conflict resolution strategies per entity type.

#### Scenario: Last-write-wins for products

- **WHEN** concurrent mutations conflict on a product entity
- **THEN** the engine SHALL resolve using wall-clock timestamp with Lamport clock ordering

#### Scenario: State-based merge for orders

- **WHEN** concurrent order status transitions conflict
- **THEN** the engine SHALL use the state-based CRDT merge that preserves all valid transitions

#### Scenario: Add-wins set for group buying participants

- **WHEN** multiple agents add the same participant to a group buying room
- **THEN** the engine SHALL use add-wins semantics to ensure the participant is included

### Requirement: Sync Protocol Handler

The sync engine SHALL implement a sync protocol handler that processes incoming sync batches.

#### Scenario: Process full sync batch

- **WHEN** a client sends a full sync batch with all pending mutations
- **THEN** the engine SHALL apply each mutation in causal order and return a full state snapshot

#### Scenario: Process incremental sync

- **WHEN** a client sends an incremental sync with only new mutations since last sync
- **THEN** the engine SHALL apply only the new mutations and return only the changed state

#### Scenario: Handle duplicate mutation detection

- **WHEN** a mutation arrives with an ID already processed
- **THEN** the engine SHALL acknowledge the mutation without re-applying (idempotent)
