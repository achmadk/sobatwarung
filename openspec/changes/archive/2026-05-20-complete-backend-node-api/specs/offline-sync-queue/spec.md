## ADDED Requirements

### Requirement: Sync push mutation processing

The system SHALL accept and process batched sync payloads from offline clients.

#### Scenario: Client submits offline sync queue
- **WHEN** a client submits POST `/api/v1/sync/push` with deviceId, lastSyncTimestamp, mutations array, and signature
- **THEN** the system SHALL verify signature, process each mutation, apply LWWT conflict resolution, and return sync receipt

#### Scenario: Valid signature processes mutations
- **WHEN** sync push has valid device signature matching stored public key
- **THEN** the system SHALL process mutations in order and return accepted mutation IDs

#### Scenario: Invalid signature rejects entire batch
- **WHEN** sync push has invalid or missing signature
- **THEN** the system SHALL return 401 Unauthorized with error code `INVALID_SIGNATURE`

#### Scenario: Duplicate mutation IDs are idempotent
- **WHEN** a mutation with an ID already processed is submitted
- **THEN** the system SHALL skip processing and include ID in accepted list (idempotent)

### Requirement: Conflict detection and resolution

The system SHALL detect and report conflicts from concurrent offline mutations.

#### Scenario: LWWT resolves scalar field conflicts
- **WHEN** concurrent mutations modify the same scalar field with different timestamps
- **THEN** the system SHALL apply the mutation with latest timestamp and include conflict in response

#### Scenario: Array fields merge additively
- **WHEN** concurrent mutations add items to the same array field
- **THEN** the system SHALL merge arrays by ID (deduplicated) and include merge info in response

#### Scenario: Semantic conflicts flagged for manual resolution
- **WHEN** concurrent mutations create semantic conflict (e.g., two participants claiming remaining units)
- **THEN** the system SHALL flag conflict with resolutionStrategy "manual" and notify affected users

### Requirement: Sync pull for latest changes

The system SHALL provide pull-based sync for clients to fetch changes since last sync.

#### Scenario: Client pulls changes since last sync
- **WHEN** a client submits POST `/api/v1/sync/pull` with deviceId and lastSyncTimestamp
- **THEN** the system SHALL return all changes for entities the device is authorized to see, ordered by timestamp

#### Scenario: Pull returns empty when no changes
- **WHEN** a client submits sync pull with lastSyncTimestamp after all changes
- **THEN** the system SHALL return empty changes array

#### Scenario: Pull includes new server timestamp
- **WHEN** a client submits sync pull
- **THEN** the response SHALL include serverTimestamp for client to use as new anchor

### Requirement: Sync queue persistence

The system SHALL persist agent events to SyncQueue for delivery to offline clients.

#### Scenario: Agent events queued for offline clients
- **WHEN** an agent relay event is emitted for a user who is offline
- **THEN** the system SHALL store event in SyncQueue with deviceId and processed=false
