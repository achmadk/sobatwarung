## 1. Project Setup

- [x] 1.1 Create KMP project structure under `apps/mobile-kmp/`
- [x] 1.2 Configure Gradle with Kotlin 2.0, KMP plugin, and Compose compiler
- [x] 1.3 Set up `commonMain`, `androidMain`, and `iosMain` source sets
- [x] 1.4 Add dependencies: SQLDelight, Ktor, Koin, Compose Navigation, WorkManager
- [x] 1.5 Configure pnpm workspace to include `apps/mobile-kmp/`

## 2. Database Layer (SQLDelight)

- [x] 2.1 Define SQLDelight schema for products, orders, inventory, sync_queue tables
- [x] 2.2 Generate SQLDelight Kotlin sources (requires build)
- [x] 2.3 Create DatabaseProvider interface in commonMain
- [x] 2.4 Implement Android-specific database setup with SQLDelight
- [x] 2.5 Implement iOS-specific database setup with SQLDelight

## 3. Sync Queue Implementation

- [x] 3.1 Create SyncQueue table in SQLDelight for pending mutations
- [x] 3.2 Implement SyncQueueRepository with add, getPending, markApplied, remove operations
- [x] 3.3 Create SyncManager to process queue when online
- [x] 3.4 Implement conflict resolution with last-write-wins strategy
- [x] 3.5 Add retry logic with exponential backoff (max 3 retries)

## 4. Networking Layer (Ktor)

- [x] 4.1 Set up Ktor Client with JSON serialization
- [x] 4.2 Implement WebSocket client for real-time updates
- [x] 4.3 Create ApiClient interface in commonMain
- [x] 4.4 Implement Android-specific HTTP client configuration
- [x] 4.5 Create sync endpoints (push mutations, pull changes)

## 5. Agent Framework

- [x] 5.1 Create Agent interface with execute() and schedule() methods
- [x] 5.2 Implement StockAgent for inventory monitoring
- [x] 5.3 Implement CommunityAgent for group buying events
- [x] 5.4 Implement SalesAgent for sales performance tracking
- [x] 5.5 Implement PrivacyGuardAgent for access control
- [x] 5.6 Create AgentManager to coordinate agent execution

## 6. Background Processing

- [x] 6.1 Configure WorkManager on Android with constraints
- [x] 6.2 Configure BGTaskScheduler on iOS for background refresh (stub)
- [x] 6.3 Create BackgroundTaskManager to schedule agent tasks
- [x] 6.4 Implement periodic sync worker

## 7. Shared UI Layer

- [x] 7.1 Set up Compose theme with Material 3
- [x] 7.2 Create navigation structure with Compose Navigation
- [x] 7.3 Build shared components (ProductCard, OrderCard, SyncStatusBadge)
- [x] 7.4 Implement AgentType enum and authentication state

## 8. Agen Utama Screens

- [x] 8.1 Create AgenUtamaDashboard screen with metrics display
- [x] 8.2 Build CatalogManagement screen (CRUD operations)
- [x] 8.3 Implement InventoryTracking screen with low-stock alerts
- [x] 8.4 Create OrderManagement screen with status updates
- [x] 8.5 Build GroupBuyingCoordinator screen

## 9. Agen Mitra Screens

- [x] 9.1 Create AgenMitraDashboard screen with simplified metrics
- [x] 9.2 Build CatalogBrowser screen (read-only catalog)
- [x] 9.3 Implement OrderDrafting screen
- [x] 9.4 Create CommunityView screen for group buying
- [x] 9.5 Build SalesTracking screen

## 10. Real-time Updates

- [x] 10.1 Implement WebSocket connection management
- [x] 10.2 Create real-time notification handler for group buying
- [x] 10.3 Implement local notification display for background events
- [x] 10.4 Add connection state indicator in UI
