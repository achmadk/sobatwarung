## MODIFIED Requirements

### Requirement: WhatsApp Integration

**Original text:** The system SHALL integrate with WhatsApp to enable order notifications, catalog sharing, and customer communication for the Etalase Tetangga feature.

**Updated text:** The system SHALL integrate with WhatsApp via `@whiskeysockets/baileys` (MD client) to enable order notifications, catalog sharing, and customer communication for the Etalase Tetangga feature. The Baileys client SHALL be initialized as a singleton on server start, persist auth state to disk, use pino for structured logging, send order confirmation messages, generate WhatsApp share links, and shut down gracefully on SIGTERM.

#### Scenario: Order placed via WhatsApp link

- **WHEN** a customer clicks a WhatsApp order link from an Etalase page
- **THEN** the system pre-fills a WhatsApp message with order details and sends a notification to the backend to track the order lifecycle

#### Scenario: Order confirmation sent via Baileys MD

- **WHEN** an order is placed through the API
- **THEN** the system SHALL send a WhatsApp message to the buyer's number via Baileys MD containing the order summary, and the message sending SHALL NOT block the order creation response
