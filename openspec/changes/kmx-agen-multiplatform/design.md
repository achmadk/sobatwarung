## Context

The ekosistem-warung-komunal project uses a monorepo structure with pnpm workspaces. The existing `mobile-kmp-app` spec defines requirements for a Kotlin Compose Multiplatform mobile app for Agen Utama and Agen Mitra users. Currently there is no mobile-kmp app directory - this design covers creating the KMP project structure and implementing the core architecture.

Key constraints:
- Must use Kotlin Compose Multiplatform (KMP) for cross-platform code sharing
- Offline-first with SQLDelight for local SQLite storage
- Background agent processing via WorkManager (Android) / BGTaskScheduler (iOS)
- WebSocket for real-time updates when online
- Existing TypeScript shared-types will be ported to Kotlin data classes

## Goals / Non-Goals

**Goals:**
- Create KMP project structure with proper Gradle configuration
- Establish offline-first data layer with SQLDelight
- Implement shared UI screens for Agen Utama and Agen Mitra
- Build local agent framework for Stock, Community, Sales, Privacy-Guard agents
- Create sync queue mechanism for deferred mutation synchronization

**Non-Goals:**
- iOS-specific UI optimizations (handled in separate iOS-focused iteration)
- Backend API implementation (handled by existing backend services)
- Push notification server infrastructure
- Complex conflict resolution algorithms beyond last-write-wins with timestamp

## Decisions

### Decision 1: Project Structure

Use standard KMP structure with shared code in `commonMain`:
```
apps/mobile-kmp/
├── androidApp/          # Android entry point and UI
├── iosApp/              # iOS entry point and UI
└── shared/              # Shared business logic
    ├── commonMain/       # Kotlin common code
    ├── androidMain/      # Android-specific (SQLDelight, WorkManager)
    └── iosMain/          # iOS-specific (BGTaskScheduler)
```

**Rationale**: This follows JetBrains' official KMP template structure, maximizing code sharing while allowing platform-specific implementations where needed.

### Decision 2: Database Layer

Use SQLDelight for local SQLite with coroutines-based queries.

**Rationale**: SQLDelight provides type-safe SQL queries that compile to Kotlin, reducing runtime errors. Coroutines support enables reactive data streams via Flow.

### Decision 3: Dependency Injection

Use Koin for dependency injection.

**Rationale**: Koin is lightweight, Kotlin-first, and works well with KMP. Koin avoids the complexity of KSP-based DI while providing similar functionality.

### Decision 4: Networking

Use Ktor Client for HTTP and WebSocket communication.

**Rationale**: Ktor is Kotlin-first, supports coroutines, and has excellent WebSocket support. It integrates well with KMP and can share serialization code.

### Decision 5: Background Processing

Use WorkManager on Android and BGTaskScheduler on iOS for scheduling agent tasks.

**Rationale**: These are the platform-recommended solutions for background work. WorkManager handles Android battery optimization and constraints naturally. iOS BGTaskScheduler provides similar capabilities for iOS.

### Decision 6: Navigation

Use Compose Navigation with feature-based navigation graphs per agent type.

**Rationale**: Compose Navigation is the standard for Kotlin Compose apps. Separate navigation graphs per agent type (Utama/Mitra) allows different screen hierarchies while sharing common screens.

### Decision 7: State Management

Use ViewModel with StateFlow for UI state, Repository pattern for data.

**Rationale**: MVVM with StateFlow provides unidirectional data flow and lifecycle-aware state management. Repository pattern abstracts data sources (local DB, remote API).

## Risks / Trade-offs

[Risk] KMP iOS support can have slower compilation times
→ Mitigation: Use Gradle configuration caching and consider Xcode Cloud for CI

[Risk] SQLDelight requires manual SQL schema management
→ Mitigation: Start with clear schema design, use migration files for version updates

[Risk] WebSocket reconnection logic can be complex
→ Mitigation: Use Ktor's built-in reconnection with exponential backoff

[Risk] Large commonMain codebase can lead to platform-specific workarounds
→ Mitigation: Enforce architecture reviews, keep platform-specific code in respective targets
