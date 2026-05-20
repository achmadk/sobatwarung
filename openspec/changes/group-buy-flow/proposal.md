## Why

The group buy feature is partially implemented - the backend supports room lifecycle (creation, joining, checkout, distribution) but the reseller dashboard lacks proper UX for discovering, creating, and joining group buying rooms. Users need a complete flow from room discovery to participation confirmation.

## What Changes

- Add Group Buy rooms list view showing available rooms with product, price, and availability
- Add "Create New Group Buy" flow for Agen Utama to create rooms
- Add "Join Group Buy" flow for resellers to contribute to rooms
- Add room detail view showing participants and contribution status
- Add room checkout and distribution workflow
- Track "first group buy" milestone completion via onboarding progress

## Capabilities

### New Capabilities
- `group-buy-rooms`: Frontend UX for browsing available group buying rooms
- `group-buy-creation`: Flow for Agen Utama to create new group buying rooms with product, target quantity, price ceiling, and deadline
- `group-buy-participation`: Flow for resellers to join and contribute to group buying rooms
- `group-buy-room-detail`: Detailed view of a room showing product, participants, aggregate quantity, and status

### Modified Capabilities
- `web-pwa-app`: Add group buy navigation and room management UI to reseller dashboard
- `onboarding-progress`: Add first group buy milestone tracking when user joins a room

## Impact

- **Frontend**: New pages/components for group buy UX in `apps/web-pwa/src/pages/group-buy/`
- **Backend**: Existing room APIs (`getRooms`, `getRoom`, `joinRoom`, `checkoutRoom`, `distributeRoom`) will be consumed
- **State**: Room participation stored in IndexedDB for offline support
- **Routing**: New routes for group buy list and room detail pages
