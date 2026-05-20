## ADDED Requirements

### Requirement: User registration with device key

The system SHALL support user registration with role selection and device public key storage for offline-first identity verification.

#### Scenario: New user registers successfully
- **WHEN** a new user submits POST `/api/v1/auth/register` with name, whatsapp, password, role, and devicePublicKey
- **THEN** the system SHALL create a User record, hash the password with bcrypt, store the devicePublicKey, and return JWT access token + refresh token

#### Scenario: Registration rejects duplicate WhatsApp number
- **WHEN** a user attempts to register with a WhatsApp number that already exists
- **THEN** the system SHALL return 409 Conflict with error code `WHATSAPP_EXISTS`

#### Scenario: Registration validates required fields
- **WHEN** a user submits registration with missing required fields
- **THEN** the system SHALL return 400 Bad Request with validation error details

### Requirement: User authentication via JWT

The system SHALL authenticate users via JWT access tokens and support token refresh.

#### Scenario: User logs in with credentials
- **WHEN** a user submits POST `/api/v1/auth/login` with whatsapp and password
- **THEN** the system SHALL verify credentials, return JWT access token (15 min expiry) and refresh token (7 day expiry)

#### Scenario: User refreshes expired access token
- **WHEN** a user submits POST `/api/v1/auth/refresh` with a valid refresh token
- **THEN** the system SHALL invalidate old refresh token, issue new access token + refresh token pair

#### Scenario: Invalid credentials return unauthorized
- **WHEN** a user submits login with wrong password
- **THEN** the system SHALL return 401 Unauthorized with error code `INVALID_CREDENTIALS`

#### Scenario: Expired access token is rejected
- **WHEN** a request is made with an expired JWT access token
- **THEN** the system SHALL return 401 Unauthorized with error code `TOKEN_EXPIRED`

#### Scenario: Invalid access token is rejected
- **WHEN** a request is made with a malformed or invalid JWT access token
- **THEN** the system SHALL return 401 Unauthorized with error code `INVALID_TOKEN`

### Requirement: Device key verification for sync endpoints

The system SHALL verify device signatures on sync endpoints to enable offline-first identity.

#### Scenario: Sync push with valid device signature
- **WHEN** a client submits POST `/api/v1/sync/push` with valid signature header
- **THEN** the system SHALL process the sync mutations and return success

#### Scenario: Sync push with invalid device signature
- **WHEN** a client submits POST `/api/v1/sync/push` with invalid or missing signature
- **THEN** the system SHALL return 401 Unauthorized with error code `INVALID_SIGNATURE`

### Requirement: Protected routes require valid JWT

The system SHALL enforce JWT authentication on protected routes.

#### Scenario: Authenticated request to protected route
- **WHEN** a request with valid Authorization: Bearer <token> header is made to a protected endpoint
- **THEN** the system SHALL process the request with authenticated user context

#### Scenario: Missing auth header on protected route
- **WHEN** a request without Authorization header is made to a protected endpoint
- **THEN** the system SHALL return 401 Unauthorized with error code `MISSING_AUTH`

### Requirement: User logout invalidates refresh token

The system SHALL support logout by invalidating the refresh token in Redis.

#### Scenario: User logs out successfully
- **WHEN** a user submits POST `/api/v1/auth/logout` with valid refresh token
- **THEN** the system SHALL remove the refresh token from Redis and return success
