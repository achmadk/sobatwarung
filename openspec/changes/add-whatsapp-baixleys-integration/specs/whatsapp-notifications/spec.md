## ADDED Requirements

### Requirement: WhatsApp Client Initialization

The system SHALL initialize a Baileys MD WhatsApp client on backend startup, using `@whiskeysockets/baileys` with pino-structured logging. The client SHALL persist its auth state to disk at `WHATSAPP_SESSION_DIR` so that sessions survive server restarts without requiring re-pairing.

#### Scenario: Backend starts and Baileys client initializes

- **WHEN** the backend server starts
- **THEN** the WhatsApp service SHALL initialize a Baileys MD client, load any existing auth state from disk, and log the connection status via pino

#### Scenario: Backend restarts and restores existing session

- **WHEN** the backend restarts after a previous session was established
- **THEN** the Baileys client SHALL re-hydrate the auth state from disk and reconnect to WhatsApp without requiring a new QR scan

### Requirement: WhatsApp Session Persistence

The system SHALL persist Baileys auth state to the directory specified by `WHATSAPP_SESSION_DIR` environment variable (default: `./whatsapp-sessions`). The auth state SHALL be saved to disk after every state change.

#### Scenario: Auth state is saved after successful pairing

- **WHEN** the Baileys client successfully pairs with a WhatsApp account
- **THEN** the system SHALL write the auth state to `WHATSAPP_SESSION_DIR/auth-state.json`

#### Scenario: Auth state is loaded on startup

- **WHEN** the backend starts and `WHATSAPP_SESSION_DIR/auth-state.json` exists
- **THEN** the system SHALL read and apply the auth state to restore the WhatsApp session

### Requirement: Send Order Confirmation via WhatsApp

When an order is placed, the system SHALL send a WhatsApp message to the buyer's WhatsApp number containing the order summary (order ID, items, total amount, and delivery info).

#### Scenario: Order is placed and confirmation message is sent

- **WHEN** a new order is created via the API
- **THEN** the system SHALL send a WhatsApp message to the buyer's registered WhatsApp number with the order confirmation details

#### Scenario: WhatsApp sending fails silently without blocking order creation

- **WHEN** the WhatsApp message sending fails (e.g., client not connected)
- **THEN** the order creation SHALL still succeed, and the failure SHALL be logged via pino error without throwing an exception

### Requirement: Generate Etalase Tetangga Share Link

The system SHALL provide a function that generates a WhatsApp shareable link containing a pre-filled message with the Etalase product catalog URL, allowing customers to share product pages via WhatsApp.

#### Scenario: Etalase share link is generated for a product

- **WHEN** a reseller requests a WhatsApp shareable link for an Etalase product page
- **THEN** the system SHALL return a `wa.me` or custom URL with `text` parameter containing the product name, price, and link

### Requirement: Graceful WhatsApp Shutdown

The system SHALL call `baileysClient.logout()` and close the Baileys connection gracefully when the backend process receives SIGINT or SIGTERM, to prevent the WhatsApp device from being marked as offline.

#### Scenario: SIGTERM is received by the backend process

- **WHEN** the backend process receives SIGTERM
- **THEN** it SHALL logout from WhatsApp gracefully, save the final auth state, and only then exit the process
