## Why

The web-pwa application exists with UI pages and service scaffolds, but they are not connected to the backend API. Without integration, the application cannot authenticate users, fetch products, create orders, or receive real-time updates. This change wires up all pages to the backend API endpoints and implements offline-first data flow with sync queue support.

## What Changes

- **Login Page Integration**: Connect login form to POST /auth/login, store JWT tokens, redirect on success
- **Register Page Integration**: Connect registration form to POST /auth/register, handle role selection (RESELLER, PEMASOK), redirect on success
- **Reseller Dashboard Integration**: Connect order list to GET /orders, display real data with status badges, wire "Jelajahi Katalog" button
- **Etalase Page Integration**: Connect to GET /etalase/:agenId/products for public catalog, implement "Pesan via WhatsApp" button
- **Pemasok Portal Integration**: Connect product CRUD to /products endpoints, display supplier's products
- **WebSocket Integration**: Connect wsClient to /ws endpoint, subscribe to room:updated, order:status events
- **Auth State Management**: Persist JWT tokens to localStorage, auto-refresh on expiry, clear on logout
- **Offline Support**: Wire IndexedDB caching via db.ts, sync queue processing on reconnect

## Capabilities

### New Capabilities

- `web-pwa-auth-flow`: Login/register forms connected to backend auth endpoints with token persistence
- `web-pwa-reseller-dashboard`: Reseller dashboard connected to orders API with real-time status updates
- `web-pwa-etalase-catalog`: Public Etalase page connected to product catalog API with WhatsApp ordering
- `web-pwa-pemasok-portal`: Pemasok portal connected to products API for CRUD operations
- `web-pwa-realtime-sync`: WebSocket client wired to API events with offline queue integration

### Modified Capabilities

- `web-pwa-app`: Existing spec requires UI pages - this change implements the API integration for those pages

## Impact

- **Code**: Updates to `apps/web-pwa/src/pages/auth/LoginPage.tsx`, `RegisterPage.tsx`, `ResellerDashboard.tsx`, `EtalasePage.tsx`, `PemasokPortal.tsx`
- **Services**: Updates to `apps/web-pwa/src/services/api.ts`, `sync.ts`, `ws.ts`, `db.ts`
- **Dependencies**: Requires `@sobatwarung/sdk` package for typed API client
- **Environment**: VITE_API_BASE_URL and VITE_WS_BASE_URL environment variables
