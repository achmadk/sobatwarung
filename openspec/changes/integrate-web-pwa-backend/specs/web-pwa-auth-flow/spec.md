## ADDED Requirements

### Requirement: Login page connects to auth API

The system SHALL allow users to log in with WhatsApp number and password via the backend API.

#### Scenario: User submits valid credentials
- **WHEN** user enters WhatsApp number and password, then clicks "Masuk"
- **THEN** the PWA SHALL call POST /api/v1/auth/login, store the returned accessToken and refreshToken in localStorage, and redirect to the appropriate dashboard based on user role

#### Scenario: User submits invalid credentials
- **WHEN** user enters wrong password and clicks "Masuk"
- **THEN** the PWA SHALL display an error message "Nomor WhatsApp atau kata sandi salah"

#### Scenario: User submits empty fields
- **WHEN** user clicks "Masuk" without filling in fields
- **THEN** the PWA SHALL show HTML5 validation error

### Requirement: Register page connects to auth API

The system SHALL allow new users to register with role selection via the backend API.

#### Scenario: User submits valid registration
- **WHEN** user fills name, WhatsApp, role, password and clicks "Daftar"
- **THEN** the PWA SHALL call POST /api/v1/auth/register with role converted to AGEN_UTAMA/AGEN_MITRA/RESELLER/PEMASOK, store tokens, and redirect to login

#### Scenario: WhatsApp number already registered
- **WHEN** user submits registration with an existing WhatsApp number
- **THEN** the PWA SHALL display error "Nomor WhatsApp sudah terdaftar"

### Requirement: JWT tokens are persisted

The system SHALL persist JWT tokens for session continuity.

#### Scenario: User returns with valid token
- **WHEN** user opens app with valid accessToken in localStorage
- **THEN** the PWA SHALL use that token for API calls without re-login

#### Scenario: Access token expired
- **WHEN** API call returns 401 with TOKEN_EXPIRED code
- **THEN** the PWA SHALL attempt token refresh using stored refreshToken, then retry the original request

#### Scenario: Refresh token expired or invalid
- **WHEN** refresh attempt fails with 401
- **THEN** the PWA SHALL clear stored tokens and redirect to login

### Requirement: Logout clears stored tokens

The system SHALL clear tokens on logout.

#### Scenario: User clicks logout
- **WHEN** user triggers logout action
- **THEN** the PWA SHALL clear accessToken and refreshToken from localStorage, disconnect WebSocket, and redirect to /auth/login
