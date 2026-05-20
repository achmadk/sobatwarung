## ADDED Requirements

### Requirement: pnpm workspace configuration

The project root SHALL contain a `pnpm-workspace.yaml` file defining workspace packages.

#### Scenario: Workspace is properly configured

- **WHEN** a developer runs `pnpm install` at the project root
- **THEN** pnpm SHALL resolve workspace packages from `apps/*`, `packages/*`, and `services/*` directories

### Requirement: Root package.json with orchestration scripts

The root `package.json` SHALL be replaced to contain only workspace orchestration scripts and metadata, not application code or dependencies.

#### Scenario: Workspace scripts run correctly

- **WHEN** a developer runs `pnpm build:all`
- **THEN** all workspace packages SHALL build in topological order

### Requirement: Lockfile conversion from npm to pnpm

The existing `package-lock.json` SHALL be converted to `pnpm-lock.yaml` preserving exact dependency versions.

#### Scenario: Lockfile conversion preserves versions

- **WHEN** `pnpm import` is run
- **THEN** the generated `pnpm-lock.yaml` SHALL contain the same resolved versions as the original `package-lock.json`
