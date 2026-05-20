## Context

The web-pwa (`apps/web-pwa/`) is a React PWA with pages for authentication, reseller dashboard, etalase storefront, and pemasok portal. Service scaffolds exist (api.ts, sync.ts, ws.ts, db.ts) but are not wired to the pages. The backend API (`apps/backend/`) exposes REST endpoints and WebSocket events for all features.

**Current State**: Pages have UI but call no APIs. Services have stubs but no data flow.

**Constraints**: Must maintain offline-first behavior. Must auto-refresh JWT tokens. Must sync pending mutations on reconnect.

**Stakeholders**: Reseller users, Pemasok suppliers, end-consumers browsing Etalase.

## Goals / Non-Goals

**Goals:**
- Wire all page components to backend API via existing SDK client
- Implement JWT token persistence and auto-refresh
- Connect WebSocket for real-time updates (room:updated, order:status)
- Implement offline queue processing with Dexie IndexedDB
- Handle errors gracefully with user feedback

**Non-Goals:**
- Build new pages (UI already exists)
- Implement device key signing for sync (Phase 2)
- Build native push notifications (Phase 2)
- Add unit tests (separate from this change)

## Decisions

### Decision 1: Use SDK client for API calls

**Choice**: Use existing `apiClient` from `@sobatwarung/sdk`
**Rationale**: Type-safe client generated from OpenAPI spec. Already imported in api.ts.

### Decision 2: localStorage for token persistence

**Choice**: Store JWT tokens in localStorage with secure defaults
**Rationale**: Simple, works across page reloads. HttpOnly cookies would require backend changes.

### Decision 3: Optimistic UI with rollback on error

**Choice**: Update UI immediately, rollback on API failure
**Rationale**: Better UX for offline-first. Sync queue handles eventual consistency.

### Decision 4: Dexie for IndexedDB

**Choice**: Existing Dexie wrapper in db.ts
**Rationale**: Already scaffolded with products, orders, syncQueue tables.

## Risks / Trade-offs

**[Risk] Token expiry during active session**
→ **Mitigation**: Auto-refresh on 401 response, queue operations during refresh

**[Risk] Sync conflicts when online after extended offline**
→ **Mitigation**: Server-side LWWT resolution, user notification for manual conflicts

**[Risk] WebSocket disconnection during critical updates**
→ **Mitigation**: Fallback to polling, visual connection status indicator
