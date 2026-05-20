## Why

The backend currently has no WhatsApp integration despite the `backend-node-api` spec requiring WhatsApp for order notifications and Etalase Tetangga catalog sharing. Installing `@whiskeysockets/baileys` and `pino` enables a self-hosted WhatsApp MD client within the backend process for sending and receiving WhatsApp messages without expensive official WhatsApp Business API fees.

## What Changes

- Install `@whiskeysockets/baileys` (WhatsApp MD client) and `pino` (structured logging) into `apps/backend`
- Create `apps/backend/src/whatsapp/` module with Baileys client initialization, message handling, and notification templates
- Add WhatsApp session persistence (auth state stored to disk for reconnection after restart)
- Add an API endpoint to generate shareable WhatsApp links for Etalase Tetangga product pages
- Send order confirmation messages via WhatsApp when orders are placed
- Add structured logging with `pino` for Baileys events and errors

## Capabilities

### New Capabilities
- `whatsapp-notifications`: Send WhatsApp messages for order confirmations, room updates, and Etalase links via Baileys MD client

### Modified Capabilities
- `backend-node-api`: The existing `WhatsApp Integration` requirement will be expanded from a simple link-sharing approach to a full Baileys MD integration that can both send notifications and receive incoming messages

## Impact

- `apps/backend/package.json` — New dependencies: `@whiskeysockets/baileys`, `pino`
- `apps/backend/src/whatsapp/` — New module directory for WhatsApp integration
- `apps/backend/src/index.ts` — Initialize Baileys client on server start
- `apps/backend/src/services/whatsapp.service.ts` — WhatsApp notification service
- `apps/backend/src/api/v1/rooms.routes.ts` / `orders.routes.ts` — Trigger WhatsApp messages on relevant events
