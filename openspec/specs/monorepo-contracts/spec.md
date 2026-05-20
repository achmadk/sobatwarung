## Requirements

### Requirement: pnpm Workspaces Monorepo Structure

The system SHALL use pnpm workspaces to organize all SobatWarung packages into a single monorepo with strict dependency isolation and shared build scripts.

#### Scenario: Monorepo is set up with pnpm workspaces

- **WHEN** a developer clones the repository and runs `pnpm install`
- **THEN** pnpm SHALL resolve all workspace dependencies, link internal packages, and install external dependencies into a single `node_modules` with strict isolation

#### Scenario: Workspace scripts run across all packages

- **WHEN** a developer runs `pnpm -r build`
- **THEN** each workspace package SHALL execute its `build` script in topological order respecting inter-package dependencies

### Requirement: Shared TypeScript Types Package

The monorepo SHALL include a `packages/shared-types/` workspace that exports TypeScript interfaces, types, and enums shared by the landing page, backend, and web PWA.

#### Scenario: Shared type is used across packages

- **WHEN** a developer updates a type in `packages/shared-types/`
- **THEN** all dependent packages (apps/landing-page, apps/backend, apps/web-pwa) SHALL automatically use the updated type without manual synchronization

### Requirement: API Client SDK

The monorepo SHALL include a `packages/sdk/` workspace that provides a generated API client SDK consumed by the landing page and web PWA frontends.

#### Scenario: SDK is auto-generated from OpenAPI spec

- **WHEN** the backend API specification changes
- **THEN** the SDK package SHALL be regenerated (via openapi-generator or similar) to match the new specification, with type-safe request/response types

### Requirement: Kotlin Client SDK Alignment

The KMP mobile app SHALL consume the same OpenAPI specification via a generated Kotlin SDK (using Ktor client) to ensure contract alignment with the TypeScript frontends.

#### Scenario: KMP app uses generated API client

- **WHEN** the KMP mobile app needs to call a backend endpoint
- **THEN** the app SHALL use a generated Ktor-based API client derived from the same OpenAPI spec used by the TypeScript frontends
