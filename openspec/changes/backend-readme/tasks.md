## 1. README Structure and Overview

- [x] 1.1 Create `apps/backend/README.md` with project title and description
- [x] 1.2 Add badges for build status, TypeScript version
- [x] 1.3 Document project architecture overview with module structure

## 2. Quick Start Guide

- [x] 2.1 Add Prerequisites section (Node.js 22+, PostgreSQL, Redis)
- [x] 2.2 Add Installation steps (pnpm install, copy .env.example)
- [x] 2.3 Add Database setup (prisma migrate dev)
- [x] 2.4 Add Development server startup (pnpm dev)
- [x] 2.5 Add Build instructions (pnpm build)

## 3. API Reference

- [x] 3.1 Document Auth endpoints (POST /register, /login, /refresh, /logout)
- [x] 3.2 Document User endpoints (GET /users/me, PUT /users/me/device-key)
- [x] 3.3 Document Room endpoints (POST/GET /rooms, /rooms/:id/join, /checkout, /distribute)
- [x] 3.4 Document Order endpoints (CRUD, status transitions)
- [x] 3.5 Document Product endpoints (CRUD, /etalase/link)
- [x] 3.6 Document Sync endpoints (POST /sync/push, /sync/pull)
- [x] 3.7 Document Agent endpoints (POST /agents/events)

## 4. Authentication

- [x] 4.1 Document JWT access/refresh token flow
- [x] 4.2 Document device key verification for sync endpoints
- [x] 4.3 Document protected route middleware behavior

## 5. WebSocket Events

- [x] 5.1 Document connection setup and authentication
- [x] 5.2 Document room events (room:updated, room:joined)
- [x] 5.3 Document order events (order:status)
- [x] 5.4 Document agent events (agent:event)
- [x] 5.5 Document sync events (sync:complete)

## 6. Database Schema

- [x] 6.1 Document User model and fields
- [x] 6.2 Document Hub model and fields
- [x] 6.3 Document BuyingRoom and RoomParticipant models
- [x] 6.4 Document Product model
- [x] 6.5 Document Order model
- [x] 6.6 Document SyncQueue model

## 7. Environment Variables

- [x] 7.1 Document DATABASE_URL, REDIS_URL
- [x] 7.2 Document JWT_SECRET, JWT_EXPIRY, REFRESH_TOKEN_EXPIRY
- [x] 7.3 Document WHATSAPP_SESSION_DIR, CORS_ORIGIN, PORT
- [x] 7.4 Document .env.example reference

## 8. Docker Deployment

- [x] 8.1 Document docker-compose services (postgres, redis, backend)
- [x] 8.2 Document port mappings and networking
- [x] 8.3 Document volume configuration for data persistence
