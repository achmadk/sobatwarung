## ADDED Requirements

### Requirement: Backend server starts and serves APIs

The system SHALL provide a Node.js/TypeScript backend server that exposes RESTful APIs and WebSocket endpoints for the full SobatWarung feature set.

#### Scenario: Backend server starts successfully
- **WHEN** the backend server starts via `pnpm --filter @sobatwarung/backend dev`
- **THEN** it SHALL listen on the configured port (default 3000) and serve REST endpoints under `/api/v1/` and WebSocket connections under `/ws/`

#### Scenario: REST API returns structured responses
- **WHEN** any REST API endpoint responds
- **THEN** the response SHALL follow a consistent JSON structure with `{ success: boolean, data?: T, error?: { code: string, message: string } }` envelope

#### Scenario: API documentation is available
- **WHEN** developer accesses `/docs` or `/api/docs`
- **THEN** the system SHALL serve an OpenAPI/Scalar documentation page

#### Scenario: Health check endpoint responds
- **WHEN** GET `/health` is called
- **THEN** the system SHALL return `{ status: "ok", timestamp: string, version: string }`

### Requirement: CORS and security headers

The system SHALL enforce CORS policy and security headers for all API responses.

#### Scenario: CORS headers on API requests
- **WHEN** a browser client makes a cross-origin request to the API
- **THEN** the system SHALL include appropriate CORS headers (`Access-Control-Allow-Origin`, `Access-Control-Allow-Methods`, `Access-Control-Allow-Headers`)

#### Scenario: Security headers on all responses
- **WHEN** any HTTP response is sent
- **THEN** the system SHALL include security headers (`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`)
