## ADDED Requirements

### Requirement: Agent event relay bus

The system SHALL provide an in-memory event bus for routing agent events.

#### Scenario: Agent event published to bus
- **WHEN** a client submits POST `/api/v1/agents/events` with agent event payload
- **THEN** the system SHALL validate event schema, store in SyncQueue for offline, and route to connected clients

#### Scenario: Event validates against schema
- **WHEN** an agent event is submitted with missing required fields
- **THEN** the system SHALL return 400 Bad Request with validation error

#### Scenario: Events stored for offline delivery
- **WHEN** an agent event is published for a user not currently connected
- **THEN** the system SHALL persist event to SyncQueue for pull-based delivery

### Requirement: Hub-based event routing

The system SHALL route agent events to devices within the same hub.

#### Scenario: HUB target audience routes to all hub devices
- **WHEN** an agent event with targetAudience "HUB" is published
- **THEN** the system SHALL broadcast to all connected devices in the same hub (Agen Utama + Agen Mitra)

#### Scenario: PARTNER target audience routes to Mitra only
- **WHEN** an agent event with targetAudience "PARTNER" is published
- **THEN** the system SHALL broadcast only to Agen Mitra devices in the hub

#### Scenario: ALL target audience routes to entire hierarchy
- **WHEN** an agent event with targetAudience "ALL" is published
- **THEN** the system SHALL broadcast to all connected devices including Resellers

### Requirement: Agent event WebSocket delivery

The system SHALL deliver agent events to connected clients via WebSocket.

#### Scenario: Connected client receives agent:event
- **WHEN** an agent event is published for a connected client
- **THEN** the client SHALL receive `agent:event` WebSocket message with event payload

#### Scenario: Client subscribes to agent events
- **WHEN** a client sends `sync:subscribe` WebSocket message with hubId
- **THEN** the system SHALL subscribe client to hub's agent events
