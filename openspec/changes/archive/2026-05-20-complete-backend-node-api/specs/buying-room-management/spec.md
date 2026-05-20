## ADDED Requirements

### Requirement: Buying room creation by Agen Utama

The system SHALL allow Agen Utama users to create group buying rooms for collective purchasing.

#### Scenario: Agen Utama creates a new buying room
- **WHEN** an authenticated Agen Utama submits POST `/api/v1/rooms` with productName, targetQuantity, priceCeiling, and deadline
- **THEN** the system SHALL create a BuyingRoom with status OPEN, assign it to the user's hub, and return the room details

#### Scenario: Non-Agen Utama cannot create room
- **WHEN** an authenticated Agen Mitra, Reseller, or Pemasok submits POST `/api/v1/rooms`
- **THEN** the system SHALL return 403 Forbidden with error code `ROLE_NOT_ALLOWED`

#### Scenario: Creating room requires valid deadline
- **WHEN** an Agen Utama submits room creation with deadline in the past
- **THEN** the system SHALL return 400 Bad Request with error code `INVALID_DEADLINE`

### Requirement: Listing rooms by hub

The system SHALL provide listing of buying rooms filtered by hub.

#### Scenario: List rooms for user's hub
- **WHEN** an authenticated user submits GET `/api/v1/rooms`
- **THEN** the system SHALL return rooms belonging to the user's hub, ordered by creation date descending

#### Scenario: Get single room details
- **WHEN** an authenticated user submits GET `/api/v1/rooms/:id`
- **THEN** the system SHALL return full room details including participants

### Requirement: Agen Mitra joins a buying room

The system SHALL allow Agen Mitra to contribute to buying rooms.

#### Scenario: Agen Mitra joins an open room
- **WHEN** an authenticated Agen Mitra submits POST `/api/v1/rooms/:id/join` with quantity
- **THEN** the system SHALL add a RoomParticipant record, increment room's currentQuantity, and notify via WebSocket

#### Scenario: Cannot join locked or closed room
- **WHEN** an authenticated user submits POST `/api/v1/rooms/:id/join` to a LOCKED, CHECKOUT, or DISTRIBUTED room
- **THEN** the system SHALL return 400 Bad Request with error code `ROOM_NOT_JOINABLE`

#### Scenario: Cannot join room not in user's hub
- **WHEN** an authenticated user submits POST `/api/v1/rooms/:id/join` for a room in a different hub
- **THEN** the system SHALL return 403 Forbidden with error code `HUB_MISMATCH`

### Requirement: Room status transitions

The system SHALL manage room lifecycle transitions based on quantity and deadline.

#### Scenario: Room automatically locks when target is met
- **WHEN** room's currentQuantity >= targetQuantity
- **THEN** the system SHALL set room status to LOCKED and notify all participants

#### Scenario: Room locks when deadline passes
- **WHEN** room's deadline passes with currentQuantity < targetQuantity
- **THEN** the system SHALL set room status to LOCKED and enter shortfall mode

#### Scenario: Agen Utama checks out locked room
- **WHEN** an authenticated Agen Utama submits POST `/api/v1/rooms/:id/checkout` for a LOCKED room
- **THEN** the system SHALL calculate per-member costs, create Order, set room status to CHECKOUT

#### Scenario: Room distribution marks completion
- **WHEN** an authenticated Agen Utama submits POST `/api/v1/rooms/:id/distribute`
- **THEN** the system SHALL set room status to DISTRIBUTED and mark all participant orders as DELIVERED

### Requirement: Real-time room updates via WebSocket

The system SHALL broadcast room events to connected clients.

#### Scenario: Participant joins broadcast room:updated
- **WHEN** a new participant joins a room
- **THEN** all clients subscribed to that room SHALL receive `room:updated` event with new participant count and currentQuantity

#### Scenario: Room locks broadcast room:updated
- **WHEN** a room transitions to LOCKED status
- **THEN** all clients subscribed to that room SHALL receive `room:updated` event with status change
