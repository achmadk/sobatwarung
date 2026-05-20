## Context

SobatWarung's group buying feature allows resellers to pool orders to achieve volume discounts. The backend supports the full room lifecycle (create, join, checkout, distribute) but the frontend only has placeholder buttons. Resellers cannot discover or join rooms; Agen Utama cannot create rooms from the PWA.

The target users are Indonesian warung owners with low digital literacy on low-end Android devices. The UX must be simple, clear, and work offline.

## Goals / Non-Goals

**Goals:**
- Enable Agen Utama to create group buying rooms from the PWA
- Enable resellers to browse and join available rooms
- Show room details with participant count and aggregate quantity
- Track "first group buy" milestone for onboarding progress
- Work offline with sync when reconnected

**Non-Goals:**
- Push notifications (handled by mobile app)
- Real-time WebSocket updates (handled via polling)
- WhatsApp integration for room sharing
- Complex room analytics or reporting

## Decisions

### Decision 1: Room List Page

**Choice:** Dedicated `/group-buy` route with room list as primary dashboard section.

**Rationale:**
- Group buy discovery must be visible without hunting through menus
- Rooms have different UX than standard orders (deadlines, targets, participants)
- Separate page allows future expansion (filters, sorting)

**Alternatives considered:**
- Modal overlay: Too cramped for room details
- Tab within dashboard: Competes with orders tab

### Decision 2: Offline Room Data

**Choice:** Cache room data in IndexedDB, sync participation via mutation queue.

**Rationale:**
- Users may lose connectivity while browsing rooms
- Joining a room should work offline with eventual consistency
- Consistent with existing offline-first architecture

**Alternatives considered:**
- Server-only room state: Doesn't work offline
- LocalStorage: Insufficient for complex room objects

### Decision 3: Room Creation Flow

**Choice:** Multi-step form: Select Product → Set Terms → Confirm.

**Rationale:**
- Each step has distinct inputs (product search, quantity/price/deadline)
- Progressive disclosure reduces cognitive load
- Can validate each step before proceeding

**Alternatives considered:**
- Single form: Too many fields, intimidating
- Wizard with progress indicator: Already using in registration

## Risks / Trade-offs

- **[Risk]** Real-time updates require polling → **Mitigation:** 30-second poll interval acceptable for room deadlines
- **[Risk]** Room state changes while viewing → **Mitigation:** Pull-to-refresh, show "room updated" toast
- **[Trade-off]** More API calls for room list → Acceptable; rooms change infrequently

## Open Questions

- Should we show rooms from all hubs or only user's hub?
- What happens if a room fills while user is viewing it?
- Should Agen Utama be able to cancel a room before checkout?
