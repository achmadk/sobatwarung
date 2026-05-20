## ADDED Requirements

### Requirement: Kotlin Compose Multiplatform Mobile App

The system SHALL provide a Kotlin Compose Multiplatform (KMP) mobile application for Android and iOS, targeting Agen Utama and Agen Mitra users. The app SHALL use shared business logic in `commonMain` with platform-specific UI layers.

#### Scenario: App launches and initializes offline-first data layer

- **WHEN** the mobile app launches on a device
- **THEN** the app SHALL initialize the local SQLDelight database, load cached data, and present the main dashboard without requiring network connectivity

#### Scenario: App serves as an execution environment for edge agents

- **WHEN** the app is running on a user's device
- **THEN** the app SHALL run the four local agents (Stock, Community, Sales, Privacy-Guard) in the background using WorkManager (Android) / BGTaskScheduler (iOS), processing data from the local SQLDelight database

### Requirement: Offline Operation with Deferred Sync

The mobile app SHALL support full offline operation for core features (catalog browsing, order drafting, inventory management) and queue mutations for sync when connectivity resumes.

#### Scenario: User creates an order while offline

- **WHEN** a user creates or modifies an order while the device has no network connectivity
- **THEN** the app SHALL save the mutation to a local sync queue and apply it to the local database immediately. When connectivity resumes, the app SHALL send queued mutations to the backend and reconcile any conflicts.

### Requirement: Real-Time Notifications via WebSocket

The mobile app SHALL maintain a persistent WebSocket connection to the backend for real-time updates when online.

#### Scenario: Real-time group buying notification received

- **WHEN** another agent in the same hub creates or updates a group buying room
- **THEN** the app SHALL display a push notification (or local notification if in background) with the room details
