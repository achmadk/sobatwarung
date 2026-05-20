## Context

The SobatWarung backend (`apps/backend`) needs WhatsApp integration to send order confirmations and share Etalase Tetangga catalogs. The `backend-node-api` spec requires WhatsApp integration but only describes link-sharing. The PRD-BE.md specifies **Baileys (MD)** as the WhatsApp solution — a self-hosted, unofficial WhatsApp Web API that avoids official API fees.

**Current state:** No WhatsApp library is installed. No `whatsapp/` module exists.

**Constraints:**
- Baileys MD requires persistent session state (auth info) to reconnect after server restart
- Baileys runs as a long-lived process — cannot be serverless/ephemeral
- pino is required for structured logging as specified in the change request
- WhatsApp session data must be persisted to disk (Docker volume)
- The Baileys library is Node.js-native (not Browser/WASM)

## Goals / Non-Goals

**Goals:**
- Install `@whiskeysockets/baileys` + `pino` into `apps/backend`
- Create `src/whatsapp/` module with client management, message templates, and handlers
- Persist WhatsApp auth state to disk for session survival across restarts
- Send order confirmation messages when orders are placed
- Generate shareable WhatsApp links for Etalase Tetangga products
- Integrate pino for structured logging of Baileys events

**Non-Goals:**
- Implementing full incoming message parsing (auto-reply bots) — this is Phase 2
- Supporting multiple WhatsApp accounts simultaneously
- Replacing the existing WebSocket notification system

## Decisions

### 1. Use `@whiskeysockets/baileys` (not `baileys` or `@adiwajshing/baileys`)

**Decision:** Install `@whiskeysockets/baileys` as the WhatsApp library.

**Rationale:** The `@whiskeysockets/baileys` package is the actively maintained fork of the original Baileys library. The old `baileys` and `@adiwajshing/baileys` packages are deprecated and unmaintained. It supports modern WhatsApp features and has better TypeScript types.

**Alternative considered:** `whatsapp-web.js` (Baileys-based) — rejected because it wraps Baileys and adds Electron/Puppeteer overhead, which is unnecessary for a backend-only integration.

### 2. Use `pino` for structured logging

**Decision:** Use `pino` for all WhatsApp module logging, replacing default console.log.

**Rationale:** pino is the de facto standard for structured logging in Node.js. It produces JSON logs that integrate well with Docker, Cloudflare Logpush, and external log aggregators. Baileys natively supports pino as a logger option.

### 3. Persist auth state to disk via `makeInMemoryStore` + custom file persistence

**Decision:** Use Baileys' `makeInMemoryStore` with a custom `fs` write/read implementation to persist session state to `WHATSAPP_SESSION_DIR`.

**Rationale:** WhatsApp sessions must survive server restarts. Persisting to a Docker volume (`whatsapp-data:/data/whatsapp-sessions`) ensures sessions survive container restarts. The session contains the QR code state / pairing info, which must be re-hydrated on startup.

### 4. Initialize Baileys client as a singleton on server start

**Decision:** Baileys client is initialized once in `whatsapp.service.ts` when the backend starts, not per-request.

**Rationale:** WhatsApp MD connections are stateful and expensive to establish. A singleton pattern ensures a single persistent connection shared across all API handlers.

**Alternative considered:** On-demand connection per message — rejected because WhatsApp will flag repeated connections from the same number as suspicious.

### 5. Graceful shutdown on SIGINT/SIGTERM

**Decision:** The Baileys client is closed gracefully on server shutdown before database disconnection.

**Rationale:** Abrupt disconnection can cause WhatsApp to mark the device as "phone offline" and require re-pairing. The shutdown sequence should call `baileysClient.logout()` before the process exits.

## Risks / Trade-offs

- **[Risk] WhatsApp ban** → Device phone number gets banned by WhatsApp for using unofficial clients → **Mitigation**: Use a dedicated test number first; avoid bulk message sending; add rate limiting on outgoing messages
- **[Risk] Session persistence failure** → Auth state corruption causes re-pairing → **Mitigation**: Back up session files; detect and handle `auth_state` read errors gracefully; log clear error messages
- **[Risk] Baileys version mismatch** → Library updates break existing code → **Mitigation**: Pin `@whiskeysockets/baileys` version in `package.json`; review changelog before upgrading
- **[Trade-off] Single device only** → Only one WhatsApp number can be connected at a time → Accept this limitation for Phase 1

## Migration Plan

1. Install packages: `pnpm add @whiskeysockets/baileys pino` in `apps/backend`
2. Create `src/whatsapp/` directory with `client.ts`, `templates.ts`, `handlers.ts`
3. Add `WHATSAPP_SESSION_DIR` to `apps/backend/.env` (default: `./whatsapp-sessions`)
4. Update `apps/backend/src/index.ts` to initialize WhatsApp service after DB connect
5. Add `WHATSAPP_SESSION_DIR` volume to `docker-compose.yml`
6. Update `apps/backend/prisma/schema.prisma` if any WhatsApp event records need persistence
7. Rollback: Remove packages, delete `src/whatsapp/`, revert `index.ts` — no DB migration needed

## Open Questions

- Should incoming WhatsApp messages be parsed and acted upon in Phase 1, or only outgoing notifications?
- Should the WhatsApp device be paired via QR code automatically on first start, or require a pre-authenticated session file?
- Should we support sending messages to WhatsApp groups (for Agen Utama broadcasting)?
