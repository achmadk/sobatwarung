## ADDED Requirements

### Requirement: WebSocket connection management

The system SHALL manage WebSocket connections with authentication.

#### Scenario: Client connects with valid JWT
- **WHEN** a client connects to `/ws` with valid JWT token in query param or header
- **THEN** the system SHALL authenticate the connection and join user's hub room

#### Scenario: Client connects with invalid token
- **WHEN** a client connects to `/ws` with invalid or missing JWT
- **THEN** the system SHALL reject the connection with 401

#### Scenario: Connection subscribes to hub room
- **WHEN** a client successfully connects
- **THEN** the system SHALL automatically subscribe client to their hub's Socket.io room

### Requirement: Room-based WebSocket broadcasting

The system SHALL use Socket.io rooms for hub-scoped event broadcasting.

#### Scenario: Event broadcast to hub room
- **WHEN** an event occurs for a specific hub
- **THEN** the system SHALL emit to the hub's Socket.io room only

#### Scenario: Event broadcast to specific room participants
- **WHEN** a room-specific event occurs
- **THEN** the system SHALL emit to the room's Socket.io room

### Requirement: Real-time sync completion notifications

The system SHALL notify clients when sync batches are processed.

#### Scenario: Sync batch complete broadcasts sync:complete
- **WHEN** a sync push batch is fully processed
- **THEN** the system SHALL emit `sync:complete` to the originating client with receipt summary

### Requirement: Redis pub-sub for multi-instance deployment

The system SHALL use Redis as pub-sub adapter for Socket.io to support horizontal scaling.

#### Scenario: Socket.io configured with Redis adapter
- **WHEN** Redis URL is configured in environment
- **THEN** the system SHALL use RedisAdapter for Socket.io pub-sub

#### Scenario: Events propagate across instances
- **WHEN** an event is emitted on one backend instance
- **THEN** all connected clients across all instances SHALL receive the event
