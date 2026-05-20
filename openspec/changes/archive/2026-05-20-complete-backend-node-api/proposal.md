## Why

The SobatWarung platform requires a production-ready Node.js/TypeScript backend to support the MVP phase. The frontend applications (web PWA, landing page) need a backend API for authentication, group buying room management, order processing, WhatsApp integration, and offline data synchronization. Without the backend, the platform cannot function as a connected ecosystem for Agen Utama, Agen Mitra, Reseller, and Pemasok users.

## What Changes

- **New Backend Application**: Full Node.js/TypeScript API server in `apps/backend/` with Hono framework, Prisma ORM, PostgreSQL, Redis, and WebSocket support
- **Database Schema**: PostgreSQL database with Prisma migrations for User, Hub, BuyingRoom, RoomParticipant, Product, Order, and SyncQueue models
- **Authentication System**: JWT-based auth with refresh tokens and Ed25519 device key verification for offline-first identity
- **Group Buying Room Lifecycle**: REST APIs and WebSocket events for room creation, joining, contribution tracking, checkout, and distribution
- **Order Management**: Order creation, status tracking, and fulfillment across the agency hierarchy
- **Product Catalog**: CRUD operations for products managed by Pemasok users
- **Offline Sync Protocol**: Sync queue ingestion with timestamp-based LWWT conflict resolution
- **WhatsApp Integration**: Baileys-based WhatsApp client for order notifications and Etalase link sharing
- **Agent Communication Relay**: In-memory event bus for agent-to-agent communication with hub-based routing
- **Docker Compose Setup**: Production-ready deployment configuration with PostgreSQL, Redis, Caddy reverse proxy

## Capabilities

### New Capabilities

- `backend-api-server`: Core HTTP server with REST endpoints under `/api/v1/` and WebSocket at `/ws/`, structured JSON response envelope
- `auth-jwt`: JWT authentication with access/refresh tokens and device public key storage for offline signature verification
- `buying-room-management`: Full lifecycle management of group buying rooms from OPEN through DISTRIBUTED states
- `order-processing`: Order creation, status transitions (DRAFT → CONFIRMED → PAID → SHIPPED → DELIVERED), and fulfillment
- `product-catalog`: Product CRUD for Pemasok-managed product listings with category and image support
- `offline-sync-queue`: Batch mutation processing with LWWT conflict resolution and sync receipt responses
- `whatsapp-integration`: Baileys WhatsApp client for outgoing notifications and incoming message handling
- `agent-relay-bus`: In-memory event bus with hub-based routing for agent communication relay
- `websocket-real-time`: Socket.io-based real-time updates for rooms, orders, and agent events
- `database-prisma`: Prisma ORM with PostgreSQL for type-safe database operations and migrations

### Modified Capabilities

- `shared-types-package`: Will be extended with additional TypeScript interfaces for backend-specific types (sync mutations, agent events, API response envelopes)

## Impact

- **Code**: New `apps/backend/` directory with full TypeScript source code
- **Database**: PostgreSQL schema via Prisma migrations
- **Dependencies**: New npm packages for Hono, Prisma, Socket.io, Baileys, JSON Web Token, Zod, etc.
- **Infrastructure**: Docker Compose services for backend, PostgreSQL, Redis
- **Configuration**: Environment variables for database, Redis, JWT secrets, WhatsApp session storage
- **Packages**: `packages/shared-types` will be updated with additional interface exports
