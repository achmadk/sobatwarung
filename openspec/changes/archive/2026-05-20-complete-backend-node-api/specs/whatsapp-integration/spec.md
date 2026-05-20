## ADDED Requirements

### Requirement: WhatsApp client initialization

The system SHALL initialize and maintain a Baileys WhatsApp client session.

#### Scenario: Backend starts with WhatsApp session
- **WHEN** the backend starts with existing WhatsApp session files
- **THEN** the system SHALL load the session and connect to WhatsApp

#### Scenario: Backend starts without session
- **WHEN** the backend starts without WhatsApp session files
- **THEN** the system SHALL generate a new session and await QR code for pairing

#### Scenario: WhatsApp connection loss triggers reconnect
- **WHEN** the WhatsApp connection is lost
- **THEN** the system SHALL attempt reconnection with exponential backoff

### Requirement: Outgoing WhatsApp notifications

The system SHALL send WhatsApp messages for order and room events.

#### Scenario: Order confirmation sends WhatsApp to buyer
- **WHEN** an order is confirmed
- **THEN** the system SHALL send WhatsApp message to buyer's number with order summary

#### Scenario: Room update notifies participants
- **WHEN** a room transitions to LOCKED or CHECKOUT status
- **THEN** the system SHALL send WhatsApp notification to all participants

#### Scenario: Stock alert forwarded to Agen Utama
- **WHEN** Stock Agent triggers STOCK_ALERT event
- **THEN** the system SHALL forward alert to Agen Utama's WhatsApp number

### Requirement: Etalase link generation

The system SHALL generate shareable WhatsApp links for product catalog.

#### Scenario: Etalase link generated for agent
- **WHEN** an authenticated user requests GET `/api/v1/etalase/link`
- **THEN** the system SHALL return a link `https://etalase.sobatwarung.com/{agenId}`

#### Scenario: Product link includes product ID
- **WHEN** an authenticated user requests GET `/api/v1/etalase/link?productId=<id>`
- **THEN** the system SHALL return link with product query parameter

### Requirement: Incoming WhatsApp message handling

The system SHALL receive and process incoming WhatsApp messages for order tracking.

#### Scenario: Order placement via WhatsApp link click
- **WHEN** customer clicks WhatsApp order link from Etalase page
- **THEN** the link SHALL pre-fill message with product details and send to WhatsApp

#### Scenario: Incoming order confirmation message parsed
- **WHEN** WhatsApp message received from known customer with order-related keywords
- **THEN** the system SHALL parse message and update corresponding order status
