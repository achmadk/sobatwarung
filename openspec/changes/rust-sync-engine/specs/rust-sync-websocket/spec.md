## ADDED Requirements

### Requirement: WebSocket Connection Manager

The Rust sync engine SHALL maintain a WebSocket connection manager using tokio-tungstenite for real-time client connections.

#### Scenario: Accept WebSocket connection

- **WHEN** a client initiates a WebSocket connection to `/ws/sync`
- **THEN** the server SHALL validate the authentication token and register the connection in the connection registry

#### Scenario: Broadcast to agency clients

- **WHEN** a mutation is resolved for an agency
- **THEN** the server SHALL broadcast the update to all connected clients in that agency via WebSocket

#### Scenario: Handle client disconnection gracefully

- **WHEN** a client disconnects or connection is lost
- **THEN** the server SHALL clean up the connection registry and preserve the client's last sync state

### Requirement: Connection Registry

The sync engine SHALL maintain a connection registry mapping agency IDs to connected client sessions.

#### Scenario: Register new client session

- **WHEN** a client successfully authenticates via WebSocket
- **THEN** the server SHALL add the session to the registry under `agency:{agency_id}:sessions:{client_id}`

#### Scenario: Track client subscription topics

- **WHEN** a client subscribes to specific data topics (e.g., `products`, `orders`)
- **THEN** the server SHALL update the session's subscription set for targeted broadcasts

#### Scenario: Cleanup stale connections

- **WHEN** a connection has been inactive for more than 30 seconds
- **THEN** the server SHALL send a ping and close the connection if no pong is received

### Requirement: WebSocket Message Protocol

The sync engine SHALL implement a JSON-based message protocol over WebSocket.

#### Scenario: Send sync request via WebSocket

- **WHEN** a client sends a sync request message
- **THEN** the message SHALL contain `{ "type": "sync", "batch": [...] }` and the server SHALL respond with `{ "type": "sync_ack", "result": {...} }`

#### Scenario: Receive broadcast notification

- **WHEN** the server broadcasts an update to clients
- **THEN** the message SHALL contain `{ "type": "broadcast", "entity": "...", "change": {...} }`

#### Scenario: Handle ping/pong heartbeat

- **WHEN** a client or server sends a ping
- **THEN** the receiver SHALL respond with a pong to keep the connection alive
