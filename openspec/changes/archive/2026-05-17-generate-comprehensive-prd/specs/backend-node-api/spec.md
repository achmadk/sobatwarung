## ADDED Requirements

### Requirement: Node.js/TypeScript Backend API Server

The system SHALL provide a Node.js/TypeScript backend server that exposes RESTful APIs and WebSocket endpoints for the full SobatWarung feature set: user authentication, group buying room management, order processing, agent communication relay, WhatsApp integration, and data sync.

#### Scenario: Backend server starts and serves APIs

- **WHEN** the backend server starts
- **THEN** it SHALL listen on the configured port and serve REST endpoints under `/api/v1/` and WebSocket connections under `/ws/`

#### Scenario: REST API returns structured responses

- **WHEN** any REST API endpoint responds
- **THEN** the response SHALL follow a consistent JSON structure with `{ success: boolean, data?: T, error?: { code: string, message: string } }` envelope

### Requirement: Authentication & Authorization

The system SHALL support JWT-based authentication with device-level key pairing for offline-first identity verification.

#### Scenario: User registers a new account

- **WHEN** a new user submits registration with role (agen-utama, agen-mitra, reseller, pemasok), name, WhatsApp number, and device public key
- **THEN** the system creates an account, returns a JWT access token + refresh token, and stores the device public key for future offline signature verification

#### Scenario: User authenticates via JWT

- **WHEN** a registered user presents a valid JWT access token in the Authorization header
- **THEN** the system authenticates the request and provides access to authorized resources

### Requirement: Group Buying Room Management

The system SHALL manage the full lifecycle of group buying rooms: creation, joining, contribution tracking, checkout, and distribution.

#### Scenario: Agen Utama creates a buying room

- **WHEN** Agen Utama submits a new group buying room with target product, quantity, price ceiling, and participation deadline
- **THEN** the system creates the room, assigns it to the Agen Utama's hub, and makes it visible to connected Agen Mitra

#### Scenario: Agen Mitra joins a buying room

- **WHEN** Agen Mitra submits a join request with desired quantity
- **THEN** the system adds the contribution, updates the room's aggregate quantity, and notifies the Agen Utama via WebSocket

#### Scenario: Room reaches target and triggers checkout

- **WHEN** total aggregated quantity meets or exceeds the room's minimum target
- **THEN** the system locks the room, calculates per-member cost breakdown, and notifies all participants

### Requirement: Offline Sync Queue

The system SHALL accept and process batched sync payloads from offline clients, resolving conflicts using timestamp-based last-writer-wins for simple fields.

#### Scenario: Client submits offline queue after reconnection

- **WHEN** a client that was offline reconnects and submits a batch of queued mutations with timestamps
- **THEN** the system processes each mutation, applies LWWT conflict resolution, and returns a sync receipt with accepted/rejected status per mutation

### Requirement: WhatsApp Integration

The system SHALL integrate with WhatsApp to enable order notifications, catalog sharing, and customer communication for the Etalase Tetangga feature.

#### Scenario: Order placed via WhatsApp link

- **WHEN** a customer clicks a WhatsApp order link from an Etalase page
- **THEN** the system pre-fills a WhatsApp message with order details and sends a notification to the backend to track the order lifecycle

### Requirement: Agent Communication Relay

The system SHALL relay agent-to-agent communication events between devices within the same agency hierarchy.

#### Scenario: Stock Agent triggers group buy initiation

- **WHEN** a local Stock Agent on an Agen Utama device generates an `INITIATE_GROUP_BUY_POOL` event
- **THEN** the backend receives the event, validates it, and broadcasts it to connected Agen Mitra devices in the same hub
