## ADDED Requirements

### Requirement: Redis Streams Event Producer

The Node.js backend SHALL publish agent events to a Redis Stream instead of using in-memory EventEmitter for cross-service communication.

#### Scenario: Node.js publishes event to Redis Streams

- **WHEN** Node.js receives an agent event (e.g., `INITIATE_GROUP_BUY_POOL`)
- **THEN** Node.js SHALL publish the event to Redis Stream `agents` using `XADD` with the event payload

#### Scenario: Event includes required metadata

- **WHEN** Node.js publishes an agent event
- **THEN** the event payload SHALL include `eventType`, `targetAudience`, `encryptionFlags`, `timestamp`, and `deviceId`

### Requirement: Redis Streams Event Consumer (Rust)

The Rust Sync Engine SHALL consume agent events from Redis Streams for asynchronous processing and cryptographic verification.

#### Scenario: Rust consumes event from Redis Stream

- **WHEN** a new event appears in the `agents` stream
- **THEN** Rust SHALL consume the event via `XREADGROUP` using a consumer group and process it according to event type

#### Scenario: Rust verifies cryptographic signature

- **WHEN** Rust consumes an event with `encryptionFlags` indicating encryption
- **THEN** Rust SHALL verify the cryptographic signature using the device's public key before triggering Rust-side logic

#### Scenario: Rust consumer handles consumer group rebalance

- **WHEN** a Rust consumer instance crashes
- **THEN** the unacknowledged messages SHALL be automatically reprocessed by another consumer instance in the consumer group

### Requirement: Dual-Write During Migration

During migration, Node.js SHALL support dual-write mode where events are published to both EventEmitter and Redis Streams.

#### Scenario: Dual-write mode enabled

- **WHEN** `EVENTS_DUAL_WRITE=true`
- **THEN** Node.js SHALL publish events to both the existing EventEmitter and Redis Streams

#### Scenario: Dual-write mode disabled

- **WHEN** `EVENTS_DUAL_WRITE=false` or unset
- **THEN** Node.js SHALL only publish to Redis Streams
