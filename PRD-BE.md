# Technical Architecture & Product Requirements Document (PRD-BE)

## Project SobatWarung: Backend, Mobile & Web Platform Architecture

- **Status:** Architecture Planning — Ready for Development
- **Version:** 1.0 (Technical Architecture Baseline)
- **Date:** May 2026
- **Target Release:** Q3 2026 (Phase 1), Q1 2027 (Phase 2)
- **Complementary Document:** See `PRD.md` for product vision, personas, functional requirements (FR-01 to FR-04), and MAS specifications

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Monorepo Structure & Shared Contracts](#2-monorepo-structure--shared-contracts)
3. [Backend Architecture — Node.js/TypeScript (Phase 1)](#3-backend-architecture--nodejstypescript-phase-1)
4. [Backend Architecture — Rust Microservices (Phase 2)](#4-backend-architecture--rust-microservices-phase-2)
5. [Mobile App — Kotlin Compose Multiplatform](#5-mobile-app--kotlin-compose-multiplatform)
6. [Web App — PWA React TypeScript](#6-web-app--pwa-react-typescript)
7. [Data Sovereignty & Security](#7-data-sovereignty--security)
8. [Deployment & DevOps](#8-deployment--devops)
9. [Implementation Roadmap](#9-implementation-roadmap)

---

## 1. Executive Summary

SobatWarung's technical architecture is designed around three core principles: **Offline-First**, **Data Sovereignty**, and **Multi-Platform Accessibility**. This document defines the complete technical architecture that supports the Keagenan Framework (3-tier agency hierarchy: Agen Utama, Agen Mitra, Reseller) and the Multi-Agent System (Stock, Community, Sales, Privacy-Guard agents).

**Platform Strategy:**

| Platform        | Target Users                               | Technology                          | Distribution                |
| --------------- | ------------------------------------------ | ----------------------------------- | --------------------------- |
| **Mobile App**  | Agen Utama, Agen Mitra                     | Kotlin Compose Multiplatform        | Android APK / iOS App Store |
| **Web PWA**     | Reseller, Pemasok, End-consumers (Etalase) | React TypeScript + Workbox          | Browser / Installable PWA   |
| **Backend API** | All platforms                              | Node.js/TypeScript → Rust (Phase 2) | Docker / Cloud VM           |

**Phased Approach:**

- **Phase 1 (MVP):** Node.js/TypeScript monolith backend + PWA web app + monorepo setup. Sync via timestamp-based LWWT. Full feature set: auth, group buying, orders, WhatsApp integration, agent relay.
- **Phase 2 (Scale):** Rust microservices for CRDT sync engine + crypto hub. KMP mobile app for Agen Utama & Agen Mitra. gRPC between Node.js gateway and Rust services.

---

## 2. Monorepo Structure & Shared Contracts

### 2.1 pnpm Workspaces Layout

SobatWarung uses **pnpm workspaces** for monorepo management, providing strict dependency isolation and efficient caching.

```
sobatwarung/
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── package.json              # Root scripts (pnpm -r build, dev, lint)
├── tsconfig.base.json        # Shared TypeScript config
│
├── apps/
│   ├── landing-page/         # Existing Vite+React PWA (migrated from npm)
│   │   ├── package.json
│   │   ├── src/
│   │   └── vite.config.ts
│   │
│   ├── backend/              # Node.js/TypeScript API server
│   │   ├── package.json
│   │   ├── src/
│   │   │   ├── api/          # REST routes (express.Router modules)
│   │   │   ├── ws/           # WebSocket handlers
│   │   │   ├── services/     # Business logic
│   │   │   ├── db/           # Prisma schema & migrations
│   │   │   ├── sync/         # Offline sync protocol
│   │   │   ├── whatsapp/     # Baileys integration
│   │   │   ├── agents/       # Agent relay bus
│   │   │   ├── auth/         # JWT + device key auth
│   │   │   └── index.ts      # Entry point
│   │   └── prisma/
│   │       └── schema.prisma
│   │
│   └── web-pwa/              # PWA for Reseller/Pemasok/Etalase
│       ├── package.json
│       ├── public/
│       │   ├── manifest.json
│       │   └── sw.js
│       └── src/
│           ├── pages/
│           │   ├── etalase/       # Public storefront
│           │   ├── reseller/      # Reseller dashboard
│           │   ├── pemasok/       # Supplier management
│           │   └── auth/          # Login/register
│           ├── services/
│           │   ├── sync.ts        # IndexedDB sync engine
│           │   ├── api.ts         # API client SDK
│           │   └── ws.ts          # WebSocket client
│           └── App.tsx
│
├── packages/
│   ├── shared-types/          # TypeScript interfaces shared across packages
│   │   ├── package.json
│   │   └── src/
│   │       ├── user.ts
│   │       ├── buying-room.ts
│   │       ├── order.ts
│   │       ├── product.ts
│   │       ├── agent-event.ts
│   │       ├── sync.ts
│   │       └── index.ts
│   │
│   └── sdk/                   # Auto-generated API client from OpenAPI spec
│       ├── package.json
│       └── src/
│           ├── client.ts       # Generated HTTP client
│           ├── types.ts        # Generated response types
│           └── index.ts
│
├── services/                   # Phase 2 — Rust microservices
│   └── rust-sync-engine/
│       ├── Cargo.toml
│       └── src/
│           ├── main.rs         # axum server
│           ├── crdt/           # CRDT merge logic
│           ├── crypto/         # Encryption/decryption
│           ├── ws/             # WebSocket handler (tokio)
│           └── grpc/           # gRPC server for Node.js gateway
│
└── openspec/                   # OpenSpec change management
    └── ...
```

### 2.2 Workspace Configuration

**pnpm-workspace.yaml:**

```yaml
packages:
  - "apps/*"
  - "packages/*"
  - "services/*"
```

**Key workspace scripts (root package.json):**

```json
{
  "scripts": {
    "dev:backend": "pnpm --filter @sobatwarung/backend dev",
    "dev:web-pwa": "pnpm --filter @sobatwarung/web-pwa dev",
    "build:shared": "pnpm --filter @sobatwarung/shared-types build",
    "build:backend": "pnpm --filter @sobatwarung/backend build",
    "build:web-pwa": "pnpm --filter @sobatwarung/web-pwa build",
    "build:all": "pnpm -r build",
    "lint": "pnpm -r lint",
    "typecheck": "pnpm -r typecheck",
    "generate:sdk": "openapi-generator -i apps/backend/openapi.yaml -o packages/sdk/src"
  }
}
```

### 2.3 Shared Types Package (`packages/shared-types`)

Central source of truth for TypeScript interfaces used by the landing page, backend, and web PWA. Examples:

```typescript
// user.ts
export type UserRole =
  | "AGENT_MAIN" // agen-utama
  | "AGENT_PARTNER" // agen-mitra
  | "RESELLER"
  | "SUPPLIER"; // pemasok;

export interface User {
  id: string;
  name: string;
  whatsapp: string;
  role: UserRole;
  devicePublicKey: string; // Ed25519 public key
  hubId?: string; // If role is agen-mitra or reseller
  createdAt: string;
}

// buying-room.ts
export type RoomStatus = "OPEN" | "LOCKED" | "CHECKOUT" | "DISTRIBUTED";

export interface BuyingRoom {
  id: string;
  hubId: string;
  createdBy: string; // agen-utama userId
  productName: string;
  targetQuantity: number;
  priceCeiling: number; // per unit IDR
  currentQuantity: number;
  status: RoomStatus;
  deadline: string;
  participants: RoomParticipant[];
  createdAt: string;
}

export interface RoomParticipant {
  userId: string;
  userName: string;
  quantity: number;
  joinedAt: string;
}

// agent-event.ts
export type AgentEventType =
  | "INITIATE_GROUP_BUY_POOL"
  | "STOCK_ALERT"
  | "PRICE_NEGOTIATION"
  | "PROMOTION_DRAFT"
  | "ENCRYPTION_STATUS";

export interface AgentEvent {
  timestamp: string;
  traceId: string;
  from: string; // Agent name (e.g., "Stock_Agent_01")
  to: string; // Target agent or hub
  action: AgentEventType;
  payload: Record<string, unknown>;
  signature: string; // Cryptographic signature
}
```

### 2.4 API Contract Strategy

- **Source of Truth:** OpenAPI 3.1 specification auto-generated from Zod schemas in the backend package
- **Tooling:** `zod-to-openapi` generates `openapi.yaml` from runtime validation schemas
- **TypeScript SDK:** `packages/sdk/` generated via `openapi-generator-typescript`
- **Kotlin SDK:** Generated via `openapi-generator-kotlin` (Ktor client) for KMP mobile app
- **Validation:** Both TypeScript and Kotlin SDKs are verified against the same OpenAPI spec in CI

---

## 3. Backend Architecture — Node.js/TypeScript (Phase 1)

### 3.1 Technology Stack

| Component           | Technology               | Rationale                                                      |
| ------------------- | ------------------------ | -------------------------------------------------------------- |
| **Runtime**         | Node.js 22 LTS           | Mature ecosystem, TypeScript-native via tsx/ts-node            |
| **Framework**       | Hono (or Express)        | Lightweight, fast, WebSocket-first support via WS adapter      |
| **Database**        | PostgreSQL 16            | Relational integrity for orders, users, rooms, transactions    |
| **Cache / Pub-Sub** | Redis 7                  | Session store, WebSocket pub-sub, rate limiting, job queues    |
| **ORM**             | Prisma                   | Type-safe queries, migrations, auto-generated client           |
| **WebSocket**       | socket.io (or ws)        | Bidirectional real-time sync, room-based broadcasting          |
| **WhatsApp**        | Baileys (MD)             | Unofficial WhatsApp Web API, self-hosted, no business API fees |
| **Auth**            | jsonwebtoken + tweetnacl | JWT for session, NaCl for device key signatures                |
| **Validation**      | zod                      | Runtime schema validation with TypeScript inference            |
| **API Docs**        | zod-to-openapi + Scalar  | Auto-generated OpenAPI spec + developer UI                     |

### 3.2 Backend Module Architecture

```
src/
├── index.ts                  # Entry point: creates Hono app, starts HTTP + WS servers
├── config/
│   ├── env.ts                # Environment variables (zod-validated)
│   └── app.ts                # App configuration
├── api/                      # REST endpoints
│   ├── v1/
│   │   ├── auth.routes.ts    # POST /register, POST /login, POST /refresh
│   │   ├── rooms.routes.ts   # CRUD for group buying rooms
│   │   ├── orders.routes.ts  # Order management
│   │   ├── products.routes.ts# Product catalog
│   │   ├── users.routes.ts   # User profile, device management
│   │   └── sync.routes.ts    # POST /sync/push, POST /sync/pull
│   └── middleware/
│       ├── auth.ts           # JWT verification middleware
│       ├── device-key.ts     # Device signature verification
│       └── error-handler.ts  # Global error handling
├── ws/                       # WebSocket handlers
│   ├── connection.ts         # Connection lifecycle management
│   ├── rooms.ts              # Room-based broadcasting
│   ├── sync.ts               # Real-time sync events
│   └── agents.ts             # Agent event relay
├── services/
│   ├── auth.service.ts       # Registration, login, token management
│   ├── room.service.ts       # Buying room lifecycle
│   ├── order.service.ts      # Order processing and fulfillment
│   ├── sync.service.ts       # Offline queue ingestion, conflict resolution
│   ├── whatsapp.service.ts   # Baileys integration for notifications
│   └── agent-relay.service.ts# Agent event routing
├── sync/
│   ├── queue.ts              # Sync queue processor
│   ├── conflict.ts           # LWWT conflict resolution
│   └── types.ts              # Sync payload types
├── agents/
│   ├── event-bus.ts          # In-memory event bus for agent relay
│   └── validators.ts         # Agent event schema validation
├── db/
│   ├── prisma/               # Prisma schema & migrations
│   └── redis.ts              # Redis client setup
└── whatsapp/
    ├── client.ts             # Baileys client management
    ├── templates.ts          # Message templates
    └── handler.ts            # Incoming message handler
```

### 3.3 Database Schema (PostgreSQL via Prisma)

```prisma
enum UserRole {
  AGEN_UTAMA
  AGEN_MITRA
  RESELLER
  PEMASOK
}

enum RoomStatus {
  OPEN
  LOCKED
  CHECKOUT
  DISTRIBUTED
}

enum OrderStatus {
  DRAFT
  CONFIRMED
  PAID
  SHIPPED
  DELIVERED
  CANCELLED
}

model User {
  id              String   @id @default(uuid())
  name            String
  whatsapp        String   @unique
  role            UserRole
  passwordHash    String   // bcrypt
  devicePublicKey String   // Ed25519 public key for offline signature verification
  hubId           String?  // Reference to agen-utama hub
  refreshToken    String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Relations
  createdRooms    BuyingRoom[]  @relation("RoomCreator")
  participants    RoomParticipant[]
  orders          Order[]
}

model Hub {
  id        String   @id @default(uuid())
  name      String
  address   String
  latitude  Float?
  longitude Float?
  ownerId   String   @unique
  owner     User     @relation(fields: [ownerId], references: [id])
  createdAt DateTime @default(now())
}

model BuyingRoom {
  id              String        @id @default(uuid())
  hubId           String
  createdById     String
  productName     String
  targetQuantity  Int
  priceCeiling    Decimal       @db.Decimal(12, 2)
  currentQuantity Int           @default(0)
  status          RoomStatus    @default(OPEN)
  deadline        DateTime
  createdAt       DateTime      @default(now())
  closedAt        DateTime?

  // Relations
  hub            Hub              @relation(fields: [hubId], references: [id])
  creator        User             @relation("RoomCreator", fields: [createdById], references: [id])
  participants   RoomParticipant[]
  order          Order?
}

model RoomParticipant {
  id        String @id @default(uuid())
  roomId    String
  userId    String
  quantity  Int
  joinedAt  DateTime @default(now())

  room BuyingRoom @relation(fields: [roomId], references: [id])
  user User       @relation(fields: [userId], references: [id])

  @@unique([roomId, userId])
}

model Product {
  id          String   @id @default(uuid())
  name        String
  category    String
  price       Decimal  @db.Decimal(12, 2)
  unit        String   // kg, pcs, liter, etc.
  description String?
  images      String[] // URLs or local paths
  supplierId  String   // pemasok userId
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  supplier User @relation(fields: [supplierId], references: [id])
}

model Order {
  id             String      @id @default(uuid())
  buyerId        String
  roomId         String?     // null for direct orders
  items          Json        // [{ productId, name, quantity, price }]
  totalAmount    Decimal     @db.Decimal(12, 2)
  status         OrderStatus @default(DRAFT)
  notes          String?
  createdAt      DateTime    @default(now())
  updatedAt      DateTime    @updatedAt

  buyer  User       @relation(fields: [buyerId], references: [id])
  room   BuyingRoom? @relation(fields: [roomId], references: [id])
}

model SyncQueue {
  id         String   @id @default(uuid())
  deviceId   String
  mutations  Json     // Array of queued mutations
  receivedAt DateTime @default(now())
  processed  Boolean  @default(false)
  error      String?
}
```

### 3.4 API Design

**REST Endpoints (`/api/v1`):**

| Method | Path                   | Description                         | Auth             |
| ------ | ---------------------- | ----------------------------------- | ---------------- |
| POST   | `/auth/register`       | Register new user                   | Public           |
| POST   | `/auth/login`          | Login with WhatsApp + password      | Public           |
| POST   | `/auth/refresh`        | Refresh JWT                         | Refresh token    |
| GET    | `/users/me`            | Get current user profile            | JWT              |
| PUT    | `/users/me/device-key` | Register/update device public key   | JWT              |
| POST   | `/rooms`               | Create a buying room                | JWT (Agen Utama) |
| GET    | `/rooms`               | List rooms by hub                   | JWT              |
| GET    | `/rooms/:id`           | Get room details                    | JWT              |
| POST   | `/rooms/:id/join`      | Join a buying room                  | JWT (Agen Mitra) |
| POST   | `/rooms/:id/checkout`  | Lock & checkout room                | JWT (Agen Utama) |
| POST   | `/orders`              | Create an order                     | JWT              |
| GET    | `/orders`              | List user's orders                  | JWT              |
| GET    | `/orders/:id`          | Get order details                   | JWT              |
| PUT    | `/orders/:id/status`   | Update order status                 | JWT              |
| GET    | `/products`            | List products (by hub or category)  | JWT              |
| POST   | `/products`            | Create product listing              | JWT (Pemasok)    |
| PUT    | `/products/:id`        | Update product                      | JWT (Owner)      |
| POST   | `/sync/push`           | Submit offline sync queue           | Device-signed    |
| POST   | `/sync/pull`           | Pull latest changes since timestamp | Device-signed    |
| GET    | `/ws/token`            | Get WebSocket auth token            | JWT              |

**WebSocket Events (`/ws`):**

| Event Direction | Event Name       | Description                        |
| --------------- | ---------------- | ---------------------------------- |
| Server → Client | `room:updated`   | Room status or aggregate changed   |
| Server → Client | `room:joined`    | New participant joined user's room |
| Server → Client | `order:status`   | Order status changed               |
| Server → Client | `agent:event`    | Agent communication event relayed  |
| Server → Client | `sync:complete`  | Sync batch processed               |
| Client → Server | `sync:subscribe` | Subscribe to specific hub events   |
| Client → Server | `agent:emit`     | Emit local agent event to relay    |

### 3.5 Authentication Flow

**Registration (with Device Key Pairing):**

1. User submits: name, WhatsApp, password, role, devicePublicKey (Ed25519)
2. Server creates user, returns JWT (access + refresh) + deviceId
3. Device stores refresh token securely and uses access token for API calls
4. Future offline mutations are signed with the device's private key and verified server-side using the stored public key

**Device Key Verification (for Sync Endpoints):**

- Every `/sync/push` payload includes a cryptographic signature
- Server verifies: `verify(payload, signature, user.devicePublicKey)` using tweetnacl
- Rejected mutations return specific error codes

### 3.6 WhatsApp Integration (Baileys)

**Architecture:**

- Self-hosted Baileys MD client running as a sidecar or service within the backend process
- Handles both outgoing notifications and incoming message parsing

**Notification Flows:**

1. **Order Confirmation:** When an order is placed → send WhatsApp message to buyer with order summary
2. **Room Update:** When a buying room progresses (locked, checkout) → notify all participants
3. **Stock Alert:** When Stock Agent triggers an alert → forward to Agen Utama's WhatsApp
4. **Etalase Link Sharing:** Auto-generated WhatsApp message template containing catalog link

**Etalase Link Generation:**

```
https://etalase.sobatwarung.com/{agenId}?product={productId}
```

When a customer clicks this link, the web PWA displays product details and a "Pesan via WhatsApp" button that pre-fills:

```
Halo, saya ingin memesan:
- {productName} x {quantity} = Rp{total}
```

### 3.7 Offline Sync Protocol

**Sync Queue Format (sent to `/sync/push`):**

```typescript
interface SyncPushRequest {
  deviceId: string;
  lastSyncTimestamp: string; // ISO 8601
  mutations: SyncMutation[];
  signature: string; // device-signed hash of mutations array
}

interface SyncMutation {
  id: string; // Client-generated UUID for dedup
  entity: "order" | "product" | "room" | "user";
  operation: "create" | "update" | "delete";
  entityId: string;
  data: Record<string, unknown>;
  timestamp: string; // Client wall-clock time
  deviceId: string;
}
```

**Conflict Resolution Strategy (Phase 1):**

- **Timestamp-based Last-Writer-Wins (LWWT):** For scalar fields (status, quantity, price), the mutation with the latest `timestamp` wins
- **Additive fields:** Array appends (e.g., room participants) are merged additively — duplicates are removed by ID
- **Conflict Detection:** If concurrent mutations create semantic conflicts (e.g., two participants claiming the last unit), the server flags the conflict and notifies affected users to resolve via manual input

**Sync Response Format:**

```typescript
interface SyncPushResponse {
  accepted: string[]; // Mutation IDs that were processed
  rejected: RejectedMutation[];
  conflicts: Conflict[];
  serverTimestamp: string; // New anchor timestamp for next sync
}

interface RejectedMutation {
  mutationId: string;
  reason: string; // e.g., "stale_timestamp", "invalid_signature", "entity_not_found"
}

interface Conflict {
  mutationId: string;
  entityId: string;
  field: string;
  localValue: unknown;
  remoteValue: unknown;
  resolutionStrategy: "lwwt" | "manual";
}
```

**Pull Protocol:**

- `POST /sync/pull` with `{ lastSyncTimestamp, deviceId }`
- Returns all changes for entities the device is authorized to see, ordered by timestamp
- Changes are returned as `{ entity, entityId, operation, data, timestamp }[]`
- Client applies changes to local DB, updating its local anchor timestamp

### 3.8 Group Buying System — Room Lifecycle

```
[OPEN] → [LOCKED] → [CHECKOUT] → [DISTRIBUTED]
```

1. **OPEN:** Agen Utama creates room with product, target quantity, price ceiling, deadline. Room visible to connected Agen Mitra.
2. **LOCKED:** When `currentQuantity >= targetQuantity` (or deadline passes), system locks room. No more participants. Price is finalized at the best available distributor rate.
3. **CHECKOUT:** System calculates per-member cost breakdown. Agen Utama confirms and places the bulk order with the distributor. Order created in system.
4. **DISTRIBUTED:** Goods arrive at Hub. System records distribution to each participant and updates order statuses to DELIVERED.

**Key Business Logic:**

- Price per unit improves as aggregate quantity increases (tiered pricing)
- Agen Utama receives a coordination commission (configurable percentage)
- If deadline passes without meeting target, room enters "shortfall" state — participants may choose to proceed at higher per-unit cost or cancel

### 3.9 Agent Communication Relay

**Event Bus Architecture:**

- In-memory event bus within the Node.js process processes agent events
- Events are routed to connected WebSocket clients via room-based broadcasting (socket.io rooms based on hubId)
- Agent events are stored in the `sync_queue` for offline clients to pull on reconnection

**Agent Event Schema:**

```typescript
interface AgentRelayEvent {
  id: string;
  timestamp: string;
  traceId: string;
  sourceDeviceId: string;
  sourceAgent: string;
  targetAudience:
    | "HUB"
    | "PARTNER" // mitra
    | "all"; // Routing scope
  action: AgentEventType;
  payload: Record<string, unknown>;
  signature: string;
}
```

**Routing Rules:**

- `targetAudience: 'HUB'` → Broadcast to all devices in the same hub (Agen Utama + connected Agen Mitra)
- `targetAudience: 'PARTNER'` → Broadcast only to Agen Mitra devices in the hub
- `targetAudience: 'ALL'` → Broadcast to all devices in the agency hierarchy (including Reseller)

---

## 4. Backend Architecture — Rust Microservices (Phase 2)

### 4.1 Overview

Phase 2 introduces Rust microservices to handle performance-critical subsystems that benefit from near-zero latency, memory safety, and efficient concurrency. The Node.js gateway remains the entry point for all client requests, routing specific workloads to Rust services.

**Service Boundaries:**

- **Node.js Gateway:** Auth, REST API, WhatsApp integration, business logic orchestration
- **Rust Sync Engine:** CRDT-based conflict resolution, high-volume WebSocket handling
- **Rust Crypto Hub:** Server-side cryptography acceleration, WASM compilation target

```
[Client Devices]
      │
      ▼
┌────────────────────────┐
│  Node.js API Gateway   │
│  (Hono + Express)      │
└───┬─────────┬─────────┘
    │         │
    ▼         ▼
┌────────┐ ┌──────────┐
│  Rust  │ │  Rust    │
│  Sync  │ │  Crypto  │
│ Engine │ │   Hub    │
└────────┘ └──────────┘
    │         │
    ▼         ▼
┌────────┐ ┌──────────┐
│Postgres│ │   Redis  │
└────────┘ └──────────┘
```

### 4.2 Rust CRDT Sync Engine

**Technology Stack:**

- **Web Framework:** axum (async, tokio-based)
- **CRDT Library:** `y-crdt` or `crdt-rs` — battle-tested CRDT implementations
- **Communication:** gRPC for synchronous sync requests + Redis Streams for async event streaming
- **Database:** Direct PostgreSQL connection (sqlx) for writing merged results

**When Requests Go to Rust:**

1. `/sync/push` with `?engine=rust` query parameter — Node.js proxy forwards to Rust gRPC endpoint
2. High-volume sync batches (>100 mutations) automatically routed to Rust
3. JSON data types that require CRDT merge (arrays, maps, text) processed by Rust

**CRDT Merge Rules:**

| Data Type                               | CRDT Strategy                          | Library  |
| --------------------------------------- | -------------------------------------- | -------- |
| Scalar fields (number, string, boolean) | Last-Writer-Wins (LWWT Register)       | Built-in |
| Map/object fields                       | Observed-Remove Map (ORMAP)            | y-crdt   |
| List/array fields (ordered)             | Replicated Growable Array (RGA)        | y-crdt   |
| Counter fields (quantity, price)        | Positive-Negative Counter (PN-Counter) | crdt-rs  |
| Text fields (notes, descriptions)       | Sequence CRDT                          | y-crdt   |

**High-Volume Connection Handling:**

- tokio async runtime with worker threads = CPU core count
- Connection pool management with backpressure
- WebSocket keepalive with configurable heartbeat intervals
- Graceful degradation under load: fallback to Node.js sync engine if Rust is saturated

### 4.3 Rust Crypto Hub

**Responsibilities:**

1. **Server-side key generation:** Generate Ed25519/X25519 key pairs for new devices (optional, can also be client-generated)
2. **WASM compilation target:** The same Rust crypto code compiled to WebAssembly for use in the web PWA
3. **Batch encryption/decryption:** For serverside batch operations (e.g., bulk export with decryption)

**Compilation Pipeline:**

```
Rust Crypto Source (crypto/src/lib.rs)
      │
      ├── cargo build --target x86_64-unknown-linux-gnu  → Native library for Rust services
      └── wasm-pack build --target web                    → WASM module for web PWA
```

### 4.4 Rust↔Node.js Communication

**Synchronous (gRPC):**

- Protobuf definitions in `services/rust-sync-engine/proto/`
- Node.js connects via `@grpc/grpc-js` client
- Used for: sync push/pull requests, key generation requests

**Asynchronous (Redis Streams):**

- Node.js publishes agent events to Redis Streams
- Rust service consumes and processes CRDT merge for complex types
- Rust publishes merged results back to Redis Streams
- Node.js consumes and persists to PostgreSQL

---

## 5. Mobile App — Kotlin Compose Multiplatform

### 5.1 Overview

The KMP mobile app targets **Agen Utama** and **Agen Mitra** users who need reliable offline-first operation, background agent execution, and access to platform-specific features (local notifications, WorkManager, hardware-backed keystore).

**Module Structure:**

```
mobile/
├── build.gradle.kts
├── settings.gradle.kts
├── shared/                           # KMP shared module
│   ├── build.gradle.kts
│   └── src/
│       ├── commonMain/               # Shared business logic
│       │   ├── di/                   # Koin dependency injection
│       │   ├── data/
│       │   │   ├── local/            # SQLDelight DAOs
│       │   │   ├── remote/           # Ktor API client
│       │   │   ├── sync/             # Sync queue & conflict resolution
│       │   │   └── repository/       # Repository pattern
│       │   ├── domain/
│       │   │   ├── model/            # Domain models
│       │   │   ├── usecase/          # Business use cases
│       │   │   └── agents/           # Agent execution engine
│       │   └── presentation/
│       │       └── viewmodel/        # Shared ViewModels
│       ├── androidMain/
│       │   ├── di/                   # Android-specific DI modules
│       │   ├── agents/               # WorkManager-based agent scheduling
│       │   ├── crypto/               # Android Keystore integration
│       │   └── platform/             # Platform expect/actual
│       └── iosMain/
│           ├── agents/               # BGTaskScheduler-based agent scheduling
│           ├── crypto/               # iOS Keychain integration
│           └── platform/             # Platform expect/actual
│
├── composeApp/                       # Compose Multiplatform UI
│   ├── build.gradle.kts
│   └── src/
│       ├── commonMain/
│       │   ├── ui/                   # Shared Compose UI
│       │   │   ├── screens/
│       │   │   │   ├── dashboard/    # Main dashboard
│       │   │   │   ├── rooms/        # Buying room management
│       │   │   │   ├── orders/       # Order management
│       │   │   │   ├── inventory/    # Stock management
│       │   │   │   ├── etalase/      # Storefront management
│       │   │   │   └── settings/     # Profile & data management
│       │   │   ├── components/       # Shared UI components
│       │   │   └── theme/            # Design system
│       │   └── navigation/
│       └── androidMain/              # Android-specific UI adjustments
│       └── iosMain/                  # iOS-specific UI adjustments
│
├── androidApp/                       # Android entry point
│   └── src/main/
│       ├── AndroidManifest.xml
│       └── MainActivity.kt
└── iosApp/                           # iOS entry point (Xcode project)
    └── iosApp/
        └── iOSApp.swift
```

### 5.2 Offline-First Data Layer

**SQLDelight Schema (shared/commonMain/sqldelight):**

```sql
-- User.sq
CREATE TABLE LocalUser (
    id TEXT NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    role TEXT NOT NULL,
    devicePublicKey TEXT NOT NULL,
    hubId TEXT,
    lastSyncTimestamp TEXT NOT NULL DEFAULT ''
);

-- BuyingRoom.sq
CREATE TABLE LocalBuyingRoom (
    id TEXT NOT NULL PRIMARY KEY,
    hubId TEXT NOT NULL,
    productName TEXT NOT NULL,
    targetQuantity INTEGER NOT NULL DEFAULT 0,
    priceCeiling REAL NOT NULL DEFAULT 0.0,
    currentQuantity INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'OPEN',
    deadline TEXT NOT NULL,
    lastModified TEXT NOT NULL,         -- For conflict resolution
    isDirty INTEGER NOT NULL DEFAULT 1  -- 1 = needs sync
);

-- SyncQueue.sq
CREATE TABLE SyncQueue (
    id TEXT NOT NULL PRIMARY KEY,
    entity TEXT NOT NULL,
    operation TEXT NOT NULL,
    entityId TEXT NOT NULL,
    data TEXT NOT NULL,          -- JSON blob
    timestamp TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING',  -- PENDING, SYNCING, SYNCED, FAILED
    error TEXT
);
```

**Sync Engine (commonMain):**

- On app start: check connectivity, attempt sync of all `isDirty = 1` records
- On mutation: write to SQLDelight immediately, mark as dirty, add to SyncQueue
- On connectivity restored: process SyncQueue in FIFO order, update status per mutation
- Pull latest changes after push: merge remote changes into local DB, resolve conflicts using LWWT

### 5.3 Agent Execution Environment

Each of the four agents (Stock, Community, Sales, Privacy-Guard) runs as a scheduled background task.

**Scheduling:**

| Agent               | Trigger                    | Platform API                                  | Frequency                  |
| ------------------- | -------------------------- | --------------------------------------------- | -------------------------- |
| Stock Agent         | Local DB changes + timer   | WorkManager (Android) / BGTaskScheduler (iOS) | Every 30 min + on DB write |
| Community Agent     | Stock Agent output         | In-process event bus                          | Reactive                   |
| Sales Agent         | Inventory surplus detected | WorkManager                                   | Every 60 min + on event    |
| Privacy-Guard Agent | Timer + sync events        | WorkManager                                   | Every 15 min + on sync     |

**Architecture:**

```kotlin
// agents/AgentManager.kt (commonMain)
class AgentManager(
    private val stockAgent: StockAgent,
    private val communityAgent: CommunityAgent,
    private val salesAgent: SalesAgent,
    private val privacyGuard: PrivacyGuardAgent
) {
    private val eventBus = MutableSharedFlow<AgentEvent>()

    fun start() {
        // Subscribe agent outputs to event bus
        stockAgent.events.onEach { eventBus.emit(it) }.launchIn(scope)
        communityAgent.events.onEach { eventBus.emit(it) }.launchIn(scope)
        salesAgent.events.onEach { eventBus.emit(it) }.launchIn(scope)

        // Privacy-Guard wraps all events with encryption
        eventBus
            .map { privacyGuard.encrypt(it) }
            .onEach { relayToBackend(it) }
            .launchIn(scope)
    }
}

// agents/StockAgent.kt (commonMain)
class StockAgent(
    private val localDb: LocalDatabase,
    private val thresholds: InventoryThresholds
) {
    val events = MutableSharedFlow<AgentEvent>()

    suspend fun analyze() {
        val lowStockItems = localDb.getAllProducts().filter {
            it.currentStock <= thresholds.getMinStock(it.id)
        }
        if (lowStockItems.isNotEmpty()) {
            events.emit(AgentEvent(
                action = AgentAction.INITIATE_GROUP_BUY_POOL,
                payload = mapOf("items" to lowStockItems.map { it.toRestockPayload() })
            ))
        }
    }
}
```

**Platform-specific Scheduling (androidMain):**

```kotlin
// WorkManager periodic task for Stock Agent
class StockAgentWorker(
    context: Context,
    params: WorkerParameters
) : CoroutineWorker(context, params) {
    override suspend fun doWork(): Result {
        val agent = AppDependencies.stockAgent
        agent.analyze()
        return Result.success()
    }
}
```

### 5.4 Real-Time Communication

- **Ktor WebSocket Client:** Maintains persistent WebSocket connection to backend when online
- **Auto-reconnect:** Exponential backoff with jitter, max 5 minutes
- **Connection State:** Exposed as `StateFlow<ConnectionState>` (CONNECTED, CONNECTING, DISCONNECTED, RECONNECTING)
- **Push Notifications:** FCM (Android) / APNs (iOS) for critical events when app is in background
- **Local Notifications:** For agent-triggered alerts (stock warnings, buying pool notifications)

### 5.5 App Architecture (MVI Pattern)

```kotlin
// Unidirectional data flow: Intent → ViewModel → State
data class DashboardState(
    val rooms: List<BuyingRoom> = emptyList(),
    val orders: List<Order> = emptyList(),
    val lowStockItems: List<Product> = emptyList(),
    val connectionState: ConnectionState = ConnectionState.DISCONNECTED,
    val isLoading: Boolean = false,
    val error: String? = null
)

sealed interface DashboardIntent {
    data object Refresh : DashboardIntent
    data class JoinRoom(val roomId: String, val quantity: Int) : DashboardIntent
    data object SyncNow : DashboardIntent
}

class DashboardViewModel(
    private val roomRepository: RoomRepository,
    private val syncManager: SyncManager
) : ViewModel() {
    private val _state = MutableStateFlow(DashboardState())
    val state: StateFlow<DashboardState> = _state.asStateFlow()

    fun onIntent(intent: DashboardIntent) {
        when (intent) {
            is DashboardIntent.Refresh -> loadData()
            is DashboardIntent.JoinRoom -> joinRoom(intent.roomId, intent.quantity)
            is DashboardIntent.SyncNow -> syncManager.triggerSync()
        }
    }
}
```

---

## 6. Web App — PWA React TypeScript

### 6.1 Overview

The PWA web app targets **Reseller**, **Pemasok**, and **End-consumers** (Etalase Tetangga) who need frictionless access without app store installation. The PWA provides offline-capable catalog browsing, order placement, and dashboard management.

**Technology Stack:**

| Component            | Technology                              | Rationale                                             |
| -------------------- | --------------------------------------- | ----------------------------------------------------- |
| **Framework**        | React 19 + TypeScript                   | Matches existing landing page stack, team familiarity |
| **Build Tool**       | Vite+ (same as landing page)            | Consistent toolchain across web projects              |
| **Service Worker**   | Workbox (via vite-plugin-pwa)           | Automated caching strategies, precaching              |
| **Offline Storage**  | Dexie.js (IndexedDB wrapper)            | Simple promise-based API for offline data             |
| **API Client**       | `packages/sdk` (generated)              | Type-safe API calls from shared OpenAPI spec          |
| **WebSocket**        | native WebSocket + reconnection logic   | Lightweight, no extra dependency                      |
| **State Management** | Zustand (or React Context + useReducer) | Minimal boilerplate, TypeScript-first                 |

### 6.2 PWA Configuration

**Manifest (`public/manifest.json`):**

```json
{
  "name": "SobatWarung — Etalase & Reseller",
  "short_name": "SobatWarung",
  "description": "Platform keagenan digital untuk warung Indonesia",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#f0fdf4",
  "theme_color": "#14532d",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

**Service Worker (Workbox via vite-plugin-pwa):**

```typescript
// vite.config.ts (in apps/web-pwa)
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        runtimeCaching: [
          {
            // Cache catalog images
            urlPattern: /^https:\/\/images\.unsplash\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "product-images",
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
          {
            // Cache API responses for offline browsing
            urlPattern: /^https:\/\/api\.sobatwarung\.com\/api\/v1\/products.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 },
            },
          },
        ],
      },
    }),
  ],
});
```

### 6.3 Offline Storage (IndexedDB via Dexie.js)

```typescript
// services/db.ts
import Dexie, { type Table } from "dexie";

interface CachedProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  imageUrl?: string;
  supplierId: string;
  hubId: string;
  cachedAt: number;
}

interface CachedOrder {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  isDirty: boolean; // true if created offline, needs sync
  createdAt: string;
}

class SobatWarungDB extends Dexie {
  products!: Table<CachedProduct, string>;
  orders!: Table<CachedOrder, string>;
  syncQueue!: Table<SyncMutation, string>;

  constructor() {
    super("SobatWarungDB");
    this.version(1).stores({
      products: "id, category, hubId, cachedAt",
      orders: "id, status, createdAt",
      syncQueue: "id++, entity, status",
    });
  }
}

export const db = new SobatWarungDB();
```

### 6.4 Page Architecture

**Etalase Tetangga (Public Storefront):**

- Route: `/etalase/:agenId` — Unauthenticated access
- Displays product catalog with pricing and availability
- "Pesan via WhatsApp" button generates pre-filled message with product details
- Service Worker caches catalog pages for repeat visits
- SEO-friendly with meta tags for social sharing

**Reseller Dashboard:**

- Route: `/reseller/*` — Requires authentication
- Pages: Dashboard (order summary), Orders (CRUD + status tracking), Catalog (browse products from hub), Profile
- Orders created offline are stored in IndexedDB with `isDirty: true` and sync when online
- WebSocket connection for real-time order status updates

**Pemasok Portal:**

- Route: `/pemasok/*` — Requires authentication
- Pages: Products (CRUD), Orders (incoming orders from agents), Profile
- Product images uploaded via compressed WebP (max 200KB) to minimize data usage
- Incoming order notifications via WebSocket + Service Worker push

### 6.5 Sync Strategy (Web PWA)

- **Online-first read:** API calls with `NetworkFirst` Workbox strategy — try network, fall back to cache
- **Offline writes:** Mutations saved to IndexedDB sync queue with `POST /sync/push` called on connectivity restore
- **Connectivity detection:** `navigator.onLine` + periodic `fetch('/ping')` heartbeat
- **Sync trigger:** On `online` event, process pending sync queue in order
- **Conflict handling:** Server returns conflicts → display to user for manual resolution via a "Konflik Sinkronisasi" notification panel

---

## 7. Data Sovereignty & Security

### 7.1 Encryption Architecture

SobatWarung implements a **zero-trust, edge-first** encryption model. The backend never has access to plaintext data or decryption keys.

```
[Device A]                    [Backend]                    [Device B]
    │                            │                            │
    ├─ Generate Ed25519 key pair ─┤                            │
    │  (store private in         │                            │
    │   Android Keystore /       │                            │
    │   iOS Keychain /           │                            │
    │   Web Crypto IndexedDB)    │                            │
    │                            │                            │
    ├─ Register public key ──────┤                            │
    │                            ├── Relay public keys ───────┤
    │                            │                            │
    ├─ Encrypt data with         │                            │
    │  Device B's public key     │                            │
    ├─ Send encrypted blob ──────┤                            │
    │                            ├── Forward encrypted blob ──┤
    │                            │                            ├─ Decrypt with
    │                            │                            │  Device B's private key
    │                            │                            │
    │     (Backend stores only encrypted blobs —              │
    │      cannot decrypt)                                     │
```

**Key Generation per Platform:**

| Platform         | Key Storage                    | Algorithm  | Generation                                                       |
| ---------------- | ------------------------------ | ---------- | ---------------------------------------------------------------- |
| Mobile (Android) | Android Keystore               | Ed25519    | `KeyPairGenerator.getInstance("Ed25519", "AndroidKeyStore")`     |
| Mobile (iOS)     | iOS Keychain                   | Curve25519 | `CryptoKit.Curve25519.KeyAgreement`                              |
| Web PWA          | IndexedDB (via Web Crypto API) | Ed25519    | `crypto.subtle.generateKey("Ed25519", true, ["sign", "verify"])` |

### 7.2 Data Classification & Ownership

| Category          | Examples                                              | Storage                      | Sync Behavior                            | Backend Access                                                |
| ----------------- | ----------------------------------------------------- | ---------------------------- | ---------------------------------------- | ------------------------------------------------------------- |
| **Local Only**    | Draft orders, personal notes, browsing history        | Device only                  | Never synced                             | None                                                          |
| **Personal Sync** | User profile, device keys                             | Device + backend (encrypted) | Encrypted sync across user's own devices | Encrypted blob only                                           |
| **Agency Shared** | Room participation, order confirmations, agent events | Device + backend (encrypted) | Encrypted sync within hub                | Encrypted blob + metadata (timestamps, participant IDs)       |
| **Public**        | Product names, prices, agent names, hub names         | Device + backend (plaintext) | Full sync                                | Plaintext (necessary for catalog browsing and room discovery) |

**User-Facing Data Management:**

- Settings screen shows data classification with clear labels
- "Hapus Data Lokal" button clears all local data and keys
- "Ekspor Data Saya" exports decrypted data in JSON format
- "Cabut Izin Perangkat" revokes a device's access keys

### 7.3 Privacy-Guard Agent Integration

The Privacy-Guard Agent runs on each device and coordinates encryption operations:

1. **On data write:** Intercepts sensitive fields before they reach the local database, encrypts them with the appropriate key
2. **On sync:** Wraps the sync payload with envelope encryption before transmission
3. **On received sync:** Decrypts incoming blobs using the recipient's private key
4. **On key compromise:** Generates new key pair, revokes old public key via backend, re-encrypts data with new key
5. **Audit logging:** Maintains an append-only log of all encryption/decryption operations on the device

---

## 8. Deployment & DevOps

### 8.1 Phase 1 Deployment (Node.js + PostgreSQL + Redis)

**Infrastructure (Docker Compose):**

```yaml
# docker-compose.yml
version: "3.8"

networks:
  frontend-net:
    driver: bridge
  backend-net:
    driver: bridge

volumes:
  pg-data:
  redis-data:
  whatsapp-data:
  caddy-data:
  caddy-config:

services:
  # --- REVERSE PROXY (The Gateway) ---
  reverse-proxy:
    image: caddy:2-alpine
    container_name: sobat_reverse_proxy
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy-data:/data
      - caddy-config:/config
    networks:
      - frontend-net
    restart: unless-stopped

  backend:
    build: ./apps/backend
    ports:
      # Removed host port mapping "3000:3000" to prevent public exposure.
      # The reverse proxy will access it internally via http://backend:3000
      - "3000"
    environment:
      - DATABASE_URL=postgresql://sobat:${DB_PASSWORD}@postgres:5432/sobatwarung
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=${JWT_SECRET}
      - WHATSAPP_SESSION_DIR=/data/whatsapp-sessions
    volumes:
      - whatsapp-data:/data/whatsapp-sessions
    networks:
      - frontend-net # To talk to the reverse proxy
      - backend-net # To talk to Postgres and Redis
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    restart: unless-stopped

  postgres:
    image: postgres:16-alpine
    environment:
      - POSTGRES_USER=sobat
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=sobatwarung
    volumes:
      - pg-data:/var/lib/postgresql/data
    networks:
      - backend-net # Isolated from the frontends
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U sobat -d sobatwarung"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    volumes:
      - redis-data:/data
    networks:
      - backend-net # Isolated from the frontends
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  web-pwa:
    build: ./apps/web-pwa
    ports:
      - "80"
    networks:
      - frontend-net
    restart: unless-stopped

  landing-page:
    build: ./apps/landing-page
    ports:
      - "80"
    networks:
      - frontend-net
    restart: unless-stopped
```

**The `Caddyfile` configuration**

```yaml
# 1. Landing Page (Root Domain)
sobatwarung.biz.id {
    reverse_proxy landing-page:80

    # Optimal Security Headers
    header {
        X-Content-Type-Options "nosniff"
        X-Frame-Options "DENY"
        Referrer-Policy "strict-origin-when-cross-origin"
        Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
        -Server # Hides the Caddy version signature
    }
}

# 2. Web PWA Application
app.sobatwarung.biz.id {
    reverse_proxy web-pwa:80

    header {
        X-Content-Type-Options "nosniff"
        X-Frame-Options "SAMEORIGIN"
        Referrer-Policy "strict-origin-when-cross-origin"
        Strict-Transport-Security "max-age=31536000;"
        -Server
    }
}

# 3. Backend API
api.sobatwarung.biz.id {
    reverse_proxy backend:3000

    header {
        X-Content-Type-Options "nosniff"
        X-Frame-Options "DENY"
        Referrer-Policy "strict-origin-when-cross-origin"
        Strict-Transport-Security "max-age=31536000;"
        -Server
    }
}
```

**CI/CD Pipeline:**

- **Platform:** GitHub Actions
- **Triggers:** Push to `main` branch, PR to `main`
- **Steps:** Install → Lint → TypeCheck → Test → Build → Deploy
- **Deployment target:** Single VM (DigitalOcean/AWS EC2) via Docker Compose + watchtower for auto-updates

### 8.2 Phase 2 Deployment (Adding Rust Services)

```yaml
# docker-compose.yml (Phase 2 additions)
services:
  # ... Phase 1 services ...

  rust-sync-engine:
    build: ./services/rust-sync-engine
    expose:
      - "50051" # gRPC
      - "8081" # WebSocket fallback
    environment:
      - DATABASE_URL=postgresql://sobat:${DB_PASSWORD}@postgres:5432/sobatwarung
      - REDIS_URL=redis://redis:6379
      - GRPC_PORT=50051
    # 2. Network Isolation: Connects to backend for DB/Redis, frontend for Proxy routing.
    networks:
      - frontend-net
      - backend-net

    # 3. Security Hardening Flags
    user: "10001:10001" # Run as a non-root, unprivileged user ID
    read_only: true # Prevent changes to the container's root filesystem
    security_opt:
      - no-new-privileges:true # Prevent processes from gaining extra privileges (like sudo)
    cap_drop:
      - ALL # Drop all Linux capabilities; Rust binaries rarely need them
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy

    deploy:
      replicas: 3 # Horizontal scaling for sync engine
    restart: unless-stopped
```

**Dockerfile:**

```yaml
# --- Stage 1: Build the Rust binary ---
FROM rust:1.78-alpine AS builder
RUN apk add --no-cache musl-dev protoc # Add protoc if compiling gRPC .proto files

WORKDIR /usr/src/app
COPY . .

# Build with optimizations for production
RUN cargo build --release

# --- Stage 2: The Hardened Runtime ---
# Using distroless cc-debian12 for dynamically linked C/C++ or standard alpine
FROM gcr.io/distroless/cc-debian12:latest

# Create a non-root directory if your app needs to write local files/logs
# Otherwise, 'read_only: true' in compose handles filesystem protection
WORKDIR /app

# Copy the compiled binary from the builder stage
COPY --from=builder /usr/src/app/target/release/rust-sync-engine /app/rust-sync-engine

# Use an explicit unprivileged UID
USER 10001:10001

# Run the engine
CMD ["./rust-sync-engine"]
```

**Scaling Considerations:**

- Rust sync engine can scale horizontally via Redis-backed session affinity
- Node.js gateway remains single-instance with multiple worker processes (cluster mode)
- PostgreSQL: read replicas for sync pull queries, primary for write operations
- Redis: Redis Cluster for high-availability pub-sub

---

## 9. Implementation Roadmap

### Phase 1 (Q3 2026)

| Milestone            | Duration | Deliverables                                                          |
| -------------------- | -------- | --------------------------------------------------------------------- |
| Monorepo Setup       | 1 week   | pnpm workspaces, shared-types, SDK scaffolding, CI pipeline           |
| Backend Core         | 3 weeks  | Auth, Prisma schema, REST API base, user management                   |
| Buying System        | 2 weeks  | Room CRUD, join/checkout logic, pricing calculation                   |
| Sync Protocol        | 2 weeks  | Offline queue, LWWT conflict resolution, sync endpoints               |
| WhatsApp Integration | 2 weeks  | Baileys client, notification templates, Etalase link generation       |
| Agent Relay          | 1 week   | Event bus, WebSocket broadcasting, agent event schema                 |
| Web PWA MVP          | 3 weeks  | Reseller dashboard, Etalase storefront, offline catalog via IndexedDB |
| Deployment           | 1 week   | Docker Compose, CI/CD, production deployment                          |

**Total Phase 1: ~15 weeks**

### Phase 2 (Q1 2027)

| Milestone                | Duration | Deliverables                                                                |
| ------------------------ | -------- | --------------------------------------------------------------------------- |
| Rust Sync Engine         | 6 weeks  | axum server, CRDT merge implementation, gRPC API, Redis Streams integration |
| Rust Crypto Hub          | 4 weeks  | Crypto operations, WASM compilation target, key management                  |
| Rust↔Node.js Integration | 2 weeks  | Gateway routing, fallback logic, performance testing                        |
| KMP Mobile App           | 12 weeks | Shared business logic, SQLDelight, Compose UI, agent execution environment  |
| Full System Integration  | 4 weeks  | Cross-platform testing, sync verification, end-to-end encryption validation |

**Total Phase 2: ~28 weeks** (can overlap with late Phase 1)
