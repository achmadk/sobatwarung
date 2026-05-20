## ADDED Requirements

### Requirement: Backend README documentation

The system SHALL provide a comprehensive README.md in the `apps/backend/` directory covering all major features, API endpoints, authentication, and development setup.

#### Scenario: README exists at apps/backend/README.md
- **WHEN** developer opens `apps/backend/README.md`
- **THEN** the file SHALL contain sections for Overview, Quick Start, API Reference, Authentication, WebSocket Events, Database Schema, Environment Variables, and Docker Deployment

#### Scenario: README documents API endpoints
- **WHEN** developer reads README API Reference section
- **THEN** the document SHALL list all REST endpoints with HTTP method, path, description, auth requirement, and request/response examples

#### Scenario: README documents authentication flow
- **WHEN** developer reads README Authentication section
- **THEN** the document SHALL explain JWT access/refresh token flow, device key verification for sync endpoints, and protected route requirements

#### Scenario: README documents WebSocket events
- **WHEN** developer reads README WebSocket section
- **THEN** the document SHALL list all Socket.io events (room:updated, room:joined, order:status, agent:event, sync:complete) with payload structure

#### Scenario: README documents database schema
- **WHEN** developer reads README Database Schema section
- **THEN** the document SHALL describe all Prisma models (User, Hub, BuyingRoom, RoomParticipant, Product, Order, SyncQueue) with field types and relationships

#### Scenario: README documents environment variables
- **WHEN** developer reads README Environment Variables section
- **THEN** the document SHALL list all required env vars (DATABASE_URL, REDIS_URL, JWT_SECRET, etc.) with descriptions and example values

#### Scenario: README provides Docker deployment instructions
- **WHEN** developer reads README Docker section
- **THEN** the document SHALL explain docker-compose services, port mappings, and volume configuration
