## ADDED Requirements

### Requirement: WASM Crypto Module

The Rust crypto module SHALL be compiled to WebAssembly using wasm-pack for client-side operations in the web PWA.

#### Scenario: Encrypt data in browser

- **WHEN** the web PWA calls `crypto.encrypt(data, publicKey)`
- **THEN** the WASM module SHALL encrypt using X25519 key exchange and ChaCha20-Poly1305 encryption

#### Scenario: Decrypt data in browser

- **WHEN** the web PWA calls `crypto.decrypt(encryptedBlob, privateKey)`
- **THEN** the WASM module SHALL decrypt and return the original payload

#### Scenario: Generate key pair

- **WHEN** a new user device initializes
- **THEN** the WASM module SHALL generate an X25519 key pair and return the public key for registration

### Requirement: Server-Side Crypto Operations

The Rust sync engine SHALL provide native crypto operations for server-side validation without decryption.

#### Scenario: Verify signature without decryption

- **WHEN** the sync engine receives an encrypted payload
- **THEN** it SHALL verify the Ed25519 signature using the sender's registered public key

#### Scenario: Re-encrypt for forwarding

- **WHEN** the sync engine needs to forward encrypted data to another authorized client
- **THEN** it SHALL re-encrypt using the recipient's public key without accessing plaintext

### Requirement: Crypto Key Exchange

The system SHALL support secure key exchange for end-to-end encrypted sync.

#### Scenario: Public key registration

- **WHEN** a device registers its public key with the backend
- **THEN** the key SHALL be stored associated with the device's agency and user IDs

#### Scenario: Request recipient public key

- **WHEN** the sync engine needs to re-encrypt for a recipient
- **THEN** it SHALL look up the recipient's public key from the key registry

#### Scenario: Key rotation support

- **WHEN** a device requests key rotation
- **THEN** the system SHALL accept the new public key and deprecate the old key after grace period
