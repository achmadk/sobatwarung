# SobatWarung Backend API

Node.js/TypeScript backend server for the SobatWarung platform.

## Project Overview

The SobatWarung backend provides REST APIs and WebSocket endpoints for a multi-tier agency ecosystem supporting:

- **Agen Utama** - Hub owners managing buying rooms and agents
- **Agen Mitra** - Sub-agents participating in group buying
- **Reseller** - Downstream sellers
- **Pemasok** - Suppliers managing product catalogs

### Tech Stack

- **Runtime**: Node.js 22 LTS
- **Framework**: Hono (lightweight, fast)
- **Database**: PostgreSQL 16 with Prisma ORM
- **Cache/Pub-Sub**: Redis 7
- **WebSocket**: Socket.io with Redis adapter
- **Auth**: JWT + Ed25519 device keys
- **Validation**: Zod

## Quick Start

### Prerequisites

- Node.js >= 22.0.0
- PostgreSQL 16
- Redis 7
- pnpm >= 9

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment file
cp apps/backend/.env.example apps/backend/.env

# Edit .env with your database credentials
```

### Database Setup

```bash
# Generate Prisma client
pnpm --filter @sobatwarung/backend db:generate

# Run migrations
pnpm --filter @sobatwarung/backend db:migrate
```

### Development

```bash
# Start development server
pnpm --filter @sobatwarung/backend dev

# Server runs on http://localhost:3000
```

### Build

```bash
pnpm --filter @sobatwarung/backend build
```

## API Reference

Base URL: `/api/v1`

### Authentication

#### POST /auth/register
Register a new user account.

```json
{
  "name": "John Doe",
  "whatsapp": "+6281234567890",
  "password": "secret123",
  "role": "AGEN_UTAMA",
  "devicePublicKey": "base64-encoded-ed25519-public-key"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJ...",
    "refreshToken": "eyJ...",
    "userId": "uuid",
    "hubId": "uuid"
  }
}
```

#### POST /auth/login
Authenticate with WhatsApp number and password.

```json
{
  "whatsapp": "+6281234567890",
  "password": "secret123"
}
```

#### POST /auth/refresh
Get new access token using refresh token.

```json
{
  "refreshToken": "eyJ..."
}
```

#### POST /auth/logout
Invalidate refresh token.

```json
{
  "refreshToken": "eyJ..."
}
```

### Users

#### GET /users/me
Get current user profile. **Auth required.**

#### PUT /users/me/device-key
Update device public key. **Auth required.**

```json
{
  "devicePublicKey": "base64-encoded-key"
}
```

### Rooms (Group Buying)

#### POST /rooms
Create a buying room. **Auth required (AGEN_UTAMA only).**

```json
{
  "productName": "Beras Premium 5kg",
  "targetQuantity": 100,
  "priceCeiling": 75000,
  "deadline": "2026-05-25T18:00:00Z"
}
```

#### GET /rooms
List rooms in user's hub. **Auth required.**

#### GET /rooms/:id
Get room details. **Auth required.**

#### POST /rooms/:id/join
Join a buying room. **Auth required (AGEN_MITRA only).**

```json
{
  "quantity": 10
}
```

#### POST /rooms/:id/checkout
Lock room and create order. **Auth required (AGEN_UTAMA only).**

#### POST /rooms/:id/distribute
Mark room as distributed. **Auth required (AGEN_UTAMA only).**

### Orders

#### POST /orders
Create an order. **Auth required.**

```json
{
  "items": [
    { "productId": "uuid", "name": "Beras", "quantity": 5, "price": 70000 }
  ],
  "notes": "Delivery to depan toko"
}
```

#### GET /orders
List user's orders. **Auth required.**

#### GET /orders/:id
Get order details. **Auth required.**

#### PUT /orders/:id/confirm
Confirm order. **Auth required.**

#### PUT /orders/:id/pay
Mark order as paid. **Auth required.**

#### PUT /orders/:id/ship
Mark order as shipped. **Auth required (PEMASOK only).**

#### PUT /orders/:id/deliver
Mark order as delivered. **Auth required.**

#### PUT /orders/:id/cancel
Cancel order. **Auth required.**

### Products

#### POST /products
Create product. **Auth required (PEMASOK only).**

```json
{
  "name": "Beras Premium 5kg",
  "category": "sembako",
  "price": 75000,
  "unit": "kg",
  "description": "Beras unggul kualitas premium",
  "images": ["https://example.com/beras.jpg"]
}
```

#### GET /products
List products. Supports `?category=`, `?supplierId=`, `?hubId=` filters.

#### GET /products/:id
Get product details.

#### PUT /products/:id
Update product. **Auth required (owner only).**

#### DELETE /products/:id
Deactivate product. **Auth required (owner only).**

### Etalase (Public Catalog)

#### POST /etalase/link
Generate shareable catalog link. **Auth required.**

**Response:**
```json
{
  "success": true,
  "data": {
    "link": "https://etalase.sobatwarung.com/{agenId}",
    "hubId": "uuid"
  }
}
```

#### GET /etalase/:agenId/products
Get public product catalog for an agent's hub.

### Sync (Offline Support)

#### POST /sync/push
Submit offline mutations. **Device key auth required.**

```json
{
  "deviceId": "uuid",
  "lastSyncTimestamp": "2026-05-20T00:00:00Z",
  "mutations": [
    {
      "id": "uuid",
      "entity": "order",
      "operation": "create",
      "entityId": "uuid",
      "data": { "status": "CONFIRMED" },
      "timestamp": "2026-05-20T10:00:00Z",
      "deviceId": "uuid"
    }
  ],
  "signature": "base64-signature"
}
```

#### POST /sync/pull
Pull changes since last sync. **Device key auth required.**

```json
{
  "deviceId": "uuid",
  "lastSyncTimestamp": "2026-05-20T00:00:00Z"
}
```

### Agent Events

#### POST /agents/events
Relay agent communication events. **Auth required.**

```json
{
  "id": "uuid",
  "timestamp": "2026-05-20T10:00:00Z",
  "traceId": "uuid",
  "sourceDeviceId": "uuid",
  "sourceAgent": "Stock_Agent_01",
  "targetAudience": "HUB",
  "action": "STOCK_ALERT",
  "payload": { "productId": "uuid", "currentStock": 5 },
  "signature": "base64-signature"
}
```

## Authentication

### JWT Flow

1. User registers or logs in → receives `accessToken` (15 min) + `refreshToken` (7 days)
2. Access token sent in `Authorization: Bearer <token>` header
3. When access token expires, use `/auth/refresh` with refresh token
4. Refresh tokens are stored in Redis and invalidated on logout

### Device Key Verification

For sync endpoints, requests must include:
- `X-Device-Id`: User's device ID
- `X-Device-Signature`: Ed25519 signature of request body using device private key

The server verifies the signature against the stored device public key.

### Protected Routes

All routes except `/auth/*`, `/health`, and `/docs` require valid JWT access token.

## WebSocket Events

Connect to `/ws` with JWT token in `auth.token` or `?token=` query param.

### Room Events

**room:updated** - Room status or quantity changed
```json
{
  "roomId": "uuid",
  "currentQuantity": 75,
  "status": "OPEN",
  "participantCount": 5
}
```

**room:joined** - New participant joined
```json
{
  "roomId": "uuid",
  "userId": "uuid",
  "userName": "Jane",
  "quantity": 10,
  "currentQuantity": 75
}
```

### Order Events

**order:status** - Order status changed
```json
{
  "orderId": "uuid",
  "status": "SHIPPED"
}
```

### Agent Events

**agent:event** - Agent communication relayed
```json
{
  "id": "uuid",
  "timestamp": "2026-05-20T10:00:00Z",
  "sourceAgent": "Stock_Agent_01",
  "action": "STOCK_ALERT",
  "payload": {}
}
```

### Sync Events

**sync:complete** - Sync batch processed
```json
{
  "accepted": ["uuid1", "uuid2"],
  "rejected": [],
  "serverTimestamp": "2026-05-20T10:00:00Z"
}
```

## Database Schema

### User
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| name | String | User's display name |
| whatsapp | String | Unique WhatsApp number |
| role | Enum | AGEN_UTAMA, AGEN_MITRA, RESELLER, PEMASOK |
| passwordHash | String | Bcrypt hashed password |
| devicePublicKey | String | Ed25519 public key for offline auth |
| hubId | UUID? | Associated hub (for AGEN_MITRA, RESELLER) |
| refreshToken | String? | Current refresh token |
| createdAt | DateTime | Account creation timestamp |
| updatedAt | DateTime | Last update timestamp |

### Hub
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| name | String | Hub name |
| address | String | Physical address |
| latitude | Float? | GPS latitude |
| longitude | Float? | GPS longitude |
| ownerId | UUID | User who owns this hub (unique) |
| createdAt | DateTime | Creation timestamp |

### BuyingRoom
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| hubId | UUID | Owning hub |
| createdById | UUID | Creator user (AGEN_UTAMA) |
| productName | String | Product being group-bought |
| targetQuantity | Int | Goal quantity |
| priceCeiling | Decimal | Max price per unit |
| currentQuantity | Int | Current aggregated quantity |
| status | Enum | OPEN, LOCKED, CHECKOUT, DISTRIBUTED |
| deadline | DateTime | Participation deadline |
| createdAt | DateTime | Creation timestamp |
| closedAt | DateTime? | When room was locked |

### RoomParticipant
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| roomId | UUID | Buying room |
| userId | UUID | Participating user |
| quantity | Int | Units contributed |
| joinedAt | DateTime | Join timestamp |

### Product
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| name | String | Product name |
| category | String | Product category |
| price | Decimal | Price per unit |
| unit | String | Unit (kg, pcs, liter) |
| description | String? | Product description |
| images | String[] | Image URLs |
| supplierId | UUID | PEMASOK user who owns this |
| isActive | Boolean | Soft delete flag |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

### Order
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| buyerId | UUID | Purchasing user |
| roomId | UUID? | Source buying room (if group buy) |
| items | JSON | Array of order items |
| totalAmount | Decimal | Total order value |
| status | Enum | DRAFT, CONFIRMED, PAID, SHIPPED, DELIVERED, CANCELLED |
| notes | String? | Order notes |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

### SyncQueue
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| deviceId | UUID | Source device |
| mutations | JSON | Queued mutations |
| receivedAt | DateTime | Reception timestamp |
| processed | Boolean | Processing flag |
| error | String? | Error message if failed |

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| DATABASE_URL | Yes | - | PostgreSQL connection string |
| REDIS_URL | Yes | - | Redis connection string |
| JWT_SECRET | Yes | - | Secret for JWT signing (min 32 chars) |
| JWT_EXPIRY | No | 15m | Access token expiry |
| REFRESH_TOKEN_EXPIRY | No | 7d | Refresh token expiry |
| WHATSAPP_SESSION_DIR | No | ./whatsapp-sessions | WhatsApp session storage |
| CORS_ORIGIN | No | * | CORS allowed origin |
| PORT | No | 3000 | Server port |
| NODE_ENV | No | development | Environment mode |

## Docker Deployment

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

### Services

- **postgres**: PostgreSQL 16 on port 5432
- **redis**: Redis 7 on port 6379
- **backend**: API server on port 3000

### Data Persistence

Volumes:
- `pg-data`: PostgreSQL data
- `redis-data`: Redis data
- `whatsapp-data`: WhatsApp session files

## Project Structure

```
apps/backend/
├── src/
│   ├── index.ts              # Entry point
│   ├── api/
│   │   ├── response.ts        # API response helpers
│   │   ├── v1/
│   │   │   ├── auth.routes.ts
│   │   │   ├── users.routes.ts
│   │   │   ├── rooms.routes.ts
│   │   │   ├── orders.routes.ts
│   │   │   ├── products.routes.ts
│   │   │   ├── etalase.routes.ts
│   │   │   ├── sync.routes.ts
│   │   │   └── agents.routes.ts
│   │   └── middleware/
│   │       ├── auth.ts
│   │       ├── device-key.ts
│   │       ├── role-guard.ts
│   │       └── error-handler.ts
│   ├── config/
│   │   ├── env.ts
│   │   └── app.ts
│   ├── db/
│   │   ├── prisma.ts
│   │   └── redis.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── hub.service.ts
│   │   ├── room.service.ts
│   │   ├── order.service.ts
│   │   ├── product.service.ts
│   │   ├── sync.service.ts
│   │   ├── whatsapp.service.ts
│   │   └── agent-relay.service.ts
│   ├── sync/
│   │   ├── types.ts
│   │   ├── conflict.ts
│   │   └── queue.ts
│   ├── ws/
│   │   ├── connection.ts
│   │   ├── rooms.ts
│   │   ├── sync.ts
│   │   └── agents.ts
│   ├── whatsapp/
│   │   ├── client.ts
│   │   ├── templates.ts
│   │   └── handler.ts
│   └── agents/
│       ├── event-bus.ts
│       └── validators.ts
├── prisma/
│   └── schema.prisma
├── package.json
├── tsconfig.json
├── vite.config.ts
└── .env.example
```

## License

Private - All rights reserved
