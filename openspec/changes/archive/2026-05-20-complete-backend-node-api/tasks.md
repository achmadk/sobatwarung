## 1. Project Setup

- [x] 1.1 Create `apps/backend/` directory structure with `package.json`, `tsconfig.json`, `vite.config.ts`
- [x] 1.2 Add backend dependencies: hono, @hono/node-server, @hono/zod-validator, prisma, @prisma/client, socket.io, @socket.io/redis-adapter, ioredis, jsonwebtoken, bcrypt, tweetnacl, zod, @astega/tsx, baileys, whatsapp-web.js, dotenv, cross-env, cors
- [x] 1.3 Configure pnpm workspace to include `apps/backend`
- [x] 1.4 Create `prisma/schema.prisma` with all models: User, Hub, BuyingRoom, RoomParticipant, Product, Order, SyncQueue
- [ ] 1.5 Run `prisma generate` to generate Prisma client

## 2. Configuration and Environment

- [x] 2.1 Create `src/config/env.ts` with zod-validated environment variables (DATABASE_URL, REDIS_URL, JWT_SECRET, JWT_EXPIRY, REFRESH_TOKEN_EXPIRY, WHATSAPP_SESSION_DIR, CORS_ORIGIN)
- [x] 2.2 Create `src/config/app.ts` for app configuration constants
- [x] 2.3 Create `.env.example` with all required environment variables

## 3. Database Layer

- [x] 3.1 Create `src/db/prisma.ts` singleton Prisma client instance
- [x] 3.2 Create `src/db/redis.ts` Redis client setup with connection handling
- [ ] 3.3 Create initial migration: `prisma migrate dev --name init`

## 4. Authentication System

- [x] 4.1 Create `src/services/auth.service.ts` with register, login, refresh, logout functions
- [x] 4.2 Create `src/api/v1/auth.routes.ts` with POST /register, POST /login, POST /refresh, POST /logout endpoints
- [x] 4.3 Create `src/api/middleware/auth.ts` JWT verification middleware
- [x] 4.4 Create `src/api/middleware/error-handler.ts` global error handler with structured response envelope
- [x] 4.5 Implement password hashing with bcrypt
- [x] 4.6 Implement JWT access/refresh token generation with jsonwebtoken
- [x] 4.7 Implement refresh token storage and invalidation in Redis
- [x] 4.8 Create `src/api/middleware/device-key.ts` for device signature verification

## 5. User and Hub Management

- [x] 5.1 Create `src/services/user.service.ts` with user profile functions
- [x] 5.2 Create `src/api/v1/users.routes.ts` with GET /users/me, PUT /users/me/device-key
- [x] 5.3 Create `src/services/hub.service.ts` for Hub operations
- [x] 5.4 Implement Hub creation on Agen Utama registration

## 6. Buying Room Management

- [x] 6.1 Create `src/services/room.service.ts` with room lifecycle functions
- [x] 6.2 Create `src/api/v1/rooms.routes.ts` with POST /rooms, GET /rooms, GET /rooms/:id, POST /rooms/:id/join, POST /rooms/:id/checkout, POST /rooms/:id/distribute
- [x] 6.3 Implement room status transitions: OPEN → LOCKED → CHECKOUT → DISTRIBUTED
- [x] 6.4 Implement automatic room locking when targetQuantity met
- [x] 6.5 Implement deadline-based room locking
- [x] 6.6 Implement per-member cost calculation on checkout
- [x] 6.7 Create `src/api/middleware/role-guard.ts` for role-based access (AGEN_UTAMA only)

## 7. Order Processing

- [x] 7.1 Create `src/services/order.service.ts` with order CRUD and status transitions
- [x] 7.2 Create `src/api/v1/orders.routes.ts` with POST /orders, GET /orders, GET /orders/:id, PUT /orders/:id/confirm, PUT /orders/:id/pay, PUT /orders/:id/ship, PUT /orders/:id/deliver, PUT /orders/:id/cancel
- [x] 7.3 Implement order creation from room checkout
- [x] 7.4 Implement order status validation (cannot cancel shipped/delivered)

## 8. Product Catalog

- [x] 8.1 Create `src/services/product.service.ts` with product CRUD
- [x] 8.2 Create `src/api/v1/products.routes.ts` with POST /products, GET /products, GET /products/:id, PUT /products/:id, DELETE /products/:id
- [x] 8.3 Implement soft delete (isActive flag)
- [x] 8.4 Create `src/api/v1/etalase.routes.ts` with GET /etalase/link for public catalog links

## 9. WebSocket Real-time Updates

- [x] 9.1 Create `src/ws/connection.ts` for WebSocket connection lifecycle
- [x] 9.2 Create `src/ws/rooms.ts` for room-based broadcasting
- [x] 9.3 Create `src/ws/sync.ts` for sync event handling
- [x] 9.4 Create `src/ws/agents.ts` for agent event relay
- [x] 9.5 Setup Socket.io with Redis adapter for multi-instance support
- [x] 9.6 Create GET /ws/token endpoint for WebSocket authentication

## 10. Offline Sync Protocol

- [x] 10.1 Create `src/sync/queue.ts` for sync queue processor
- [x] 10.2 Create `src/sync/conflict.ts` for LWWT conflict resolution
- [x] 10.3 Create `src/sync/types.ts` for sync payload types
- [x] 10.4 Create `src/services/sync.service.ts` for sync operations
- [x] 10.5 Create `src/api/v1/sync.routes.ts` with POST /sync/push, POST /sync/pull
- [x] 10.6 Implement device signature verification using tweetnacl
- [x] 10.7 Implement idempotent mutation processing with deduplication
- [x] 10.8 Implement additive array merge for room participants

## 11. WhatsApp Integration

- [x] 11.1 Create `src/whatsapp/client.ts` for Baileys client management
- [x] 11.2 Create `src/whatsapp/templates.ts` for message templates
- [x] 11.3 Create `src/whatsapp/handler.ts` for incoming message handling
- [x] 11.4 Create `src/services/whatsapp.service.ts` for notification sending
- [x] 11.5 Implement WhatsApp session persistence to disk
- [x] 11.6 Implement reconnection logic with exponential backoff
- [x] 11.7 Integrate WhatsApp notifications with order and room events

## 12. Agent Communication Relay

- [x] 12.1 Create `src/agents/event-bus.ts` for in-memory event bus
- [x] 12.2 Create `src/agents/validators.ts` for agent event schema validation
- [x] 12.3 Create `src/services/agent-relay.service.ts` for event routing
- [x] 12.4 Create `src/api/v1/agents.routes.ts` with POST /agents/events
- [x] 12.5 Implement hub-based routing (HUB, PARTNER, ALL)
- [x] 12.6 Store agent events in SyncQueue for offline delivery

## 13. API Response Structure

- [x] 13.1 Create `src/api/response.ts` with success/error response helpers
- [x] 13.2 Apply consistent `{ success: boolean, data?: T, error?: { code, message } }` envelope

## 14. Server Entry Point

- [x] 14.1 Create `src/index.ts` as main entry point
- [x] 14.2 Setup Hono app with all routes and middleware
- [x] 14.3 Start HTTP server and Socket.io server
- [x] 14.4 Add graceful shutdown handling

## 15. Docker Compose Setup

- [x] 15.1 Create `Dockerfile` for backend with multi-stage build
- [x] 15.2 Update `docker-compose.yml` with backend, postgres, redis services
- [x] 15.3 Create/update `Caddyfile` for reverse proxy to backend

## 16. Build and Test

- [x] 16.1 Run `pnpm --filter @sobatwarung/backend build` to verify TypeScript compilation
- [ ] 16.2 Run `pnpm --filter @sobatwarung/backend prisma migrate dev` to verify migrations
- [ ] 16.3 Test auth endpoints with curl/httpie
- [ ] 16.4 Test WebSocket connection with wscat or Socket.io client
- [ ] 16.5 Verify all specs by testing scenarios end-to-end
