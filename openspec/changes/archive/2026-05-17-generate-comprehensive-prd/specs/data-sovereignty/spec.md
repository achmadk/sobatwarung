## ADDED Requirements

### Requirement: Client-Side Encryption

The system SHALL encrypt all sensitive data at rest and in transit using client-side encryption keys that never leave the user's device.

#### Scenario: Data is encrypted before sync to backend

- **WHEN** a client device prepares data for sync to the backend
- **THEN** the data SHALL be encrypted on-device using the user's private key before transmission. The backend SHALL store only encrypted blobs and SHALL NOT have access to decryption keys.

#### Scenario: Encrypted data is decrypted on receipt

- **WHEN** a client device receives synced data from another authorized device in the same agency hierarchy
- **THEN** the receiving device SHALL decrypt the data using the sender's public key (previously exchanged via the backend's PKI relay)

### Requirement: Edge Key Management

The system SHALL generate, store, and manage cryptographic key pairs locally on each device.

#### Scenario: Device generates key pair on first launch

- **WHEN** a user launches the app for the first time
- **THEN** the app SHALL generate an Ed25519 or X25519 key pair, store the private key in platform-secure storage (Android Keystore, iOS Keychain, or Web Crypto API's IndexedDB-backed key store), and register the public key with the backend

### Requirement: Data Ownership Model

The system SHALL clearly distinguish between data that resides only on the user's device, data that is synced across the user's own devices, and data that is shared with the agency hierarchy.

#### Scenario: User views data ownership classification

- **WHEN** a user accesses their data management settings
- **THEN** the app SHALL display a clear classification of their data: "Local Only" (never leaves device), "Personal Sync" (synced across user's own devices), "Agency Shared" (visible to authorized agents in the same hub)
