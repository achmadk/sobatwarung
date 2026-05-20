## Why

The ekosistem-warung-komunal needs a unified mobile application for Agen Utama (main agents) and Agen Mitra (partner agents) that works offline-first with local data processing. A Kotlin Compose Multiplatform (KMP) solution enables shared business logic across Android and iOS while maintaining native UI performance. This replaces the need for separate native implementations and aligns with the existing `mobile-kmp-app` spec.

## What Changes

- Create a new Kotlin Compose Multiplatform mobile application targeting Android and iOS
- Implement shared business logic in `commonMain` with platform-specific UI in `androidMain` and `iosMain`
- Integrate SQLDelight for local SQLite database with offline-first architecture
- Implement four local agents (Stock, Community, Sales, Privacy-Guard) running on device
- Build UI screens for Agen Utama and Agen Mitra user flows
- Add WorkManager (Android) / BGTaskScheduler (iOS) for background agent processing
- Implement WebSocket connection for real-time updates when online
- Create sync queue mechanism for deferred mutations when offline

## Capabilities

### New Capabilities

- `mobile-kmp-agen-utama`: Agen Utama mobile screens and business logic for main agent operations (dashboard, catalog management, inventory tracking, order management, group buying coordination)
- `mobile-kmp-agen-mitra`: Agen Mitra mobile screens and business logic for partner agent operations (simplified dashboard, catalog browsing, order drafting, community features)
- `mobile-kmp-sync-queue`: Offline mutation queue with conflict resolution for deferred sync when connectivity resumes
- `mobile-kmp-agent-framework`: Framework for running Stock, Community, Sales, and Privacy-Guard agents on-device using KMP

### Modified Capabilities

- `mobile-kmp-app`: Extend existing spec to include detailed screen specifications for both Agen Utama and Agen Mitra user types

## Impact

- New app directory: `apps/mobile-kmp/` with KMP structure (androidMain, iosMain, commonMain)
- New dependency: SQLDelight for local database
- New dependency: Ktor client for WebSocket and HTTP
- Background task scheduling via WorkManager (Android) / BGTaskScheduler (iOS)
- Shared types from `packages/shared-types/` will be ported to Kotlin data classes
