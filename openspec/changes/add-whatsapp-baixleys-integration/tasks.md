## 1. Setup

- [x] 1.1 Install `@whiskeysockets/baileys` and `pino` packages in `apps/backend`
- [x] 1.2 Add `WHATSAPP_ENABLED` environment variable to `apps/backend/.env.example`
- [x] 1.3 Add `whatsapp-data` volume mount for WhatsApp session persistence in `apps/backend/docker-compose.yml` (already existed)

## 2. WhatsApp Module Scaffolding

- [x] 2.1 Create `apps/backend/src/whatsapp/` directory (already existed)
- [x] 2.2 Create `apps/backend/src/whatsapp/client.ts` — Baileys client initialization with pino logger and auth state persistence
- [x] 2.3 Create `apps/backend/src/whatsapp/templates.ts` — Message template functions (already existed)
- [x] 2.4 Create `apps/backend/src/whatsapp/handlers.ts` — Incoming message handler stubs (already existed)

## 3. WhatsApp Service

- [x] 3.1 Create `apps/backend/src/services/whatsapp.service.ts` — High-level service (already existed with notifyOrderCreated, notifyRoomUpdate, notifyStockAlert, generateEtalaseLink, initializeWhatsAppService)
- [x] 3.2 Export `whatsappService` singleton from `apps/backend/src/services/whatsapp.service.ts` (already exported)

## 4. Backend Integration

- [x] 4.1 Update `apps/backend/src/index.ts` to initialize `whatsappService` after database connection (already implemented)
- [x] 4.2 Add SIGINT/SIGTERM handlers to gracefully logout from WhatsApp before process exit (already implemented)
- [x] 4.3 Add `whatsapp.service.ts` import and initialization to `apps/backend/src/index.ts` (already implemented)

## 5. Order Integration

- [x] 5.1 Find `createOrder` handler in `apps/backend/src/api/v1/orders.routes.ts`
- [x] 5.2 Call `notifyOrderCreated()` after successful order creation (fire-and-forget, non-blocking)

## 6. Etalase Share Link

- [x] 6.1 Add `generateWhatsappShareLink(orderId, productName, price, etalaseUrl)` helper in `whatsapp/templates.ts` (formatEtalaseLink already existed)
- [x] 6.2 Expose via a utility function (generateEtalaseLink already existed in whatsapp.service.ts)

## 7. Docker Compose Update

- [x] 7.1 Add `WHATSAPP_SESSION_DIR` environment variable to `backend` service in `apps/backend/docker-compose.yml` (already existed)
- [x] 7.2 Mount `whatsapp-data` volume to `whatsapp-sessions` path inside the container (already existed)
