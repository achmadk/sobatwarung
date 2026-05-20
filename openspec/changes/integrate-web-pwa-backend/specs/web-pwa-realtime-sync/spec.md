## ADDED Requirements

### Requirement: WebSocket connects on authentication

The system SHALL establish WebSocket connection after successful login.

#### Scenario: User logs in successfully
- **WHEN** login returns valid tokens
- **THEN** the PWA SHALL call wsClient.connect(accessToken) to establish WebSocket connection

#### Scenario: WebSocket connection established
- **WHEN** WebSocket connects
- **THEN** the PWA SHALL subscribe to room:updated, order:status, and agent:event events

### Requirement: WebSocket handles reconnection

The system SHALL automatically reconnect on connection loss.

#### Scenario: WebSocket disconnects
- **WHEN** WebSocket connection is lost
- **THEN** the PWA SHALL attempt reconnection with exponential backoff (max 5 retries)

#### Scenario: User is offline
- **WHEN** device loses network connectivity
- **THEN** the PWA SHALL show "Offline" indicator and queue any mutations

### Requirement: Sync queue processes on reconnect

The system SHALL sync pending mutations when coming back online.

#### Scenario: Device comes online with pending mutations
- **WHEN** network connectivity is restored and syncQueue has pending items
- **THEN** the PWA SHALL call processSyncQueue() to push mutations to server

#### Scenario: Sync completes successfully
- **WHEN** all mutations are accepted by server
- **THEN** the PWA SHALL mark mutations as synced and update local IndexedDB

### Requirement: IndexedDB caches API responses

The system SHALL store API responses in IndexedDB for offline access.

#### Scenario: API returns product list
- **WHEN** GET /products returns data
- **THEN** the PWA SHALL store products in IndexedDB with current timestamp

#### Scenario: API returns order list
- **WHEN** GET /orders returns data
- **THEN** the PWA SHALL store orders in IndexedDB with current timestamp
