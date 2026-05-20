## ADDED Requirements

### Requirement: Privacy-Guard Agent Routing Logic

The Node.js backend SHALL detect agent events targeted at `HUB` or `ALL` with encryption flags and forward them to the Rust Crypto Hub for validation before WebSocket relay.

#### Scenario: Encrypted event routed to Rust Crypto Hub

- **WHEN** Node.js receives an agent event with `targetAudience: 'HUB'` or `targetAudience: 'ALL'` and `encryptionFlags` present
- **THEN** Node.js SHALL forward the event to Rust via gRPC for cryptographic key validation

#### Scenario: Rust validates and returns key confirmation

- **WHEN** Rust receives the encrypted event for validation
- **THEN** Rust SHALL verify the cryptographic signature, validate the key exchange, and return a validation result to Node.js

#### Scenario: Validated event relayed via WebSocket

- **WHEN** Rust confirms the cryptographic validation and Node.js receives the result
- **THEN** Node.js SHALL relay the event via WebSocket (`/ws/agents`) to connected target devices without exposing plain-text sensitive data in logs

#### Scenario: Validation failure prevents relay

- **WHEN** Rust returns a validation failure
- **THEN** Node.js SHALL log the failure, discard the event, and NOT relay to WebSocket clients

### Requirement: Encryption Flag Detection

Node.js SHALL inspect incoming agent events for encryption indicators to determine if Rust validation is required.

#### Scenario: Event with encryption flag detected

- **WHEN** an agent event contains `encryptionFlags` field
- **THEN** Node.js SHALL treat the event as requiring Privacy-Guard routing

#### Scenario: Event without encryption flag bypasses Rust

- **WHEN** an agent event has no `encryptionFlags` field
- **THEN** Node.js SHALL process the event locally without forwarding to Rust Crypto Hub
