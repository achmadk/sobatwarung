## ADDED Requirements

### Requirement: Offline Mutation Queue

The system SHALL maintain a queue of mutations (create, update, delete operations) when the device is offline and apply them when connectivity resumes.

#### Scenario: Mutation queued while offline

- **WHEN** user performs a data-modifying operation while device has no network connectivity
- **THEN** the app SHALL add the mutation to a local SQLDelight-based queue table with timestamp and operation type

#### Scenario: Queued mutations applied when online

- **WHEN** device regains network connectivity
- **THEN** the app SHALL process the queue in FIFO order, sending each mutation to the backend

#### Scenario: Conflict detection on sync

- **WHEN** a queued mutation conflicts with server-side data (timestamp mismatch)
- **THEN** the app SHALL use last-write-wins strategy based on device timestamp

### Requirement: Sync Status Visibility

The system SHALL provide visibility into sync status to the user.

#### Scenario: Pending sync indicator

- **WHEN** the sync queue contains unapplied mutations
- **THEN** the app SHALL display a badge or indicator showing the number of pending items

#### Scenario: Sync in progress indicator

- **WHEN** mutations are being sent to backend
- **THEN** the app SHALL display a syncing indicator

#### Scenario: Sync error handling

- **WHEN** a mutation fails to sync (network error or server rejection)
- **THEN** the app SHALL retry with exponential backoff up to 3 times before marking as failed

### Requirement: Database Synchronization

The system SHALL synchronize local database with remote data when online.

#### Scenario: Pull remote changes

- **WHEN** connectivity is restored after being offline
- **THEN** the app SHALL first pull remote changes before pushing queued mutations to ensure server state is current

#### Scenario: Incremental sync

- **WHEN** app syncs while previously synced
- **THEN** the app SHALL only fetch records modified since last sync timestamp
