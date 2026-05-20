## ADDED Requirements

### Requirement: Shared types package exists

The monorepo SHALL contain a `packages/shared-types/` package that exports TypeScript interfaces for domain models shared across workspace packages.

#### Scenario: Shared types directory exists

- **WHEN** the migration is applied
- **THEN** `packages/shared-types/` SHALL contain `package.json`, `tsconfig.json`, and `src/` with TypeScript interface files

#### Scenario: Shared types are importable by workspace packages

- **WHEN** a workspace package depends on `@sobatwarung/shared-types`
- **THEN** pnpm SHALL resolve the dependency to the local workspace package without publishing to npm
