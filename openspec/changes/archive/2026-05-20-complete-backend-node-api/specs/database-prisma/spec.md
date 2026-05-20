## ADDED Requirements

### Requirement: Prisma schema defines all models

The system SHALL use Prisma ORM with PostgreSQL for all database operations.

#### Scenario: Prisma schema includes User model
- **WHEN** the backend starts
- **THEN** Prisma client SHALL expose User model with fields: id, name, whatsapp, role, passwordHash, devicePublicKey, hubId, refreshToken, createdAt, updatedAt

#### Scenario: Prisma schema includes Hub model
- **WHEN** the backend starts
- **THEN** Prisma client SHALL expose Hub model with fields: id, name, address, latitude, longitude, ownerId, createdAt

#### Scenario: Prisma schema includes BuyingRoom model
- **WHEN** the backend starts
- **THEN** Prisma client SHALL expose BuyingRoom model with fields: id, hubId, createdById, productName, targetQuantity, priceCeiling, currentQuantity, status, deadline, createdAt, closedAt

#### Scenario: Prisma schema includes RoomParticipant model
- **WHEN** the backend starts
- **THEN** Prisma client SHALL expose RoomParticipant model with fields: id, roomId, userId, quantity, joinedAt, with unique constraint on [roomId, userId]

#### Scenario: Prisma schema includes Product model
- **WHEN** the backend starts
- **THEN** Prisma client SHALL expose Product model with fields: id, name, category, price, unit, description, images, supplierId, isActive, createdAt, updatedAt

#### Scenario: Prisma schema includes Order model
- **WHEN** the backend starts
- **THEN** Prisma client SHALL expose Order model with fields: id, buyerId, roomId, items (JSON), totalAmount, status, notes, createdAt, updatedAt

#### Scenario: Prisma schema includes SyncQueue model
- **WHEN** the backend starts
- **THEN** Prisma client SHALL expose SyncQueue model with fields: id, deviceId, mutations (JSON), receivedAt, processed, error

### Requirement: Database migrations

The system SHALL support versioned database migrations via Prisma Migrate.

#### Scenario: Migrations run on startup
- **WHEN** `prisma migrate deploy` is executed
- **THEN** all unapplied migrations SHALL be applied to PostgreSQL

#### Scenario: New migration created for schema changes
- **WHEN** developers modify schema.prisma
- **THEN** `prisma migrate dev` SHALL create a new migration file in `prisma/migrations/`

### Requirement: Redis client for sessions and pub-sub

The system SHALL use Redis for session storage and Socket.io pub-sub.

#### Scenario: Redis client connects to Redis URL
- **WHEN** the backend starts with REDIS_URL configured
- **THEN** the system SHALL establish connection to Redis for session store

#### Scenario: Refresh tokens stored in Redis
- **WHEN** a user logs in or refreshes token
- **THEN** the refresh token SHALL be stored in Redis with TTL matching token expiry

#### Scenario: Redis unavailable returns error
- **WHEN** Redis connection fails
- **THEN** the system SHALL log error and return 503 Service Unavailable for auth operations
