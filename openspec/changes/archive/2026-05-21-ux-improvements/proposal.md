## Why

SobatWarung's technical architecture (offline-first, CRDT sync, multi-agent) is solid, but users cannot SEE or FEEL these capabilities. The UX fails to communicate value, guide users to success, and build trust—especially for skeptical warung owners who are new to digital systems. Users need to complete BOTH "first order" AND "first group buy" to feel successful, but the current dashboard over-indexes on orders and hides group buying discovery.

## What Changes

- **Sync Status Visibility**: Add persistent status indicator showing online/offline state and pending sync count
- **Group Buying Discovery**: Elevate group buy CTAs and introduce progress-based success tracking (1/2, 2/2)
- **Channel-Aware Onboarding**: Adapt registration and first-use experience based on acquisition channel
- **Error Handling**: Replace generic error messages with contextual, actionable Indonesian messages
- **Optimistic UI**: Show changes immediately with sync feedback via toast notifications
- **Trust Signals**: Add data sovereignty indicators in profile/settings

## Capabilities

### New Capabilities

- `sync-status-indicator`: Persistent UI element showing online/offline state and pending mutation count
- `onboarding-progress`: Track and display user progress toward "success" milestones (first order, first group buy)
- `channel-aware-onboarding`: Adapt first-use experience based on acquisition channel parameter

### Modified Capabilities

- `web-pwa-app`: Add sync status component, optimistic UI updates, improved error handling, and progress tracking
- `landing-page`: Improve CTAs for group buying visibility and trust signals
- `reseller-registration`: Add role-based flow with progress indicator and WhatsApp verification step

## Impact

- **Components**: New `SyncStatusBar`, `OnboardingProgress`, `ChannelDetector` components
- **UX Patterns**: Toast notification system for async operation feedback
- **State**: Add `syncStatus` and `onboardingProgress` to local storage/IndexedDB
- **Routing**: Registration flow may need channel parameter passing
