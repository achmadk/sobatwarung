## Requirements

### Requirement: Backend scaffold directory structure

The monorepo SHALL contain an `apps/backend/` directory with a scaffolded Node.js/TypeScript backend structure matching the PRD-BE.md module layout.

#### Scenario: Backend directory exists with correct structure

- **WHEN** the migration is applied
- **THEN** `apps/backend/` SHALL contain `package.json`, `tsconfig.json`, and `src/` with the following subdirectories: `api/`, `ws/`, `services/`, `sync/`, `agents/`, `db/`, `whatsapp/`, `auth/`, `config/`

#### Scenario: Backend package.json has correct configuration

- **WHEN** reviewing `apps/backend/package.json`
- **THEN** the `name` SHALL be `@sobatwarung/backend`, `type` SHALL be `module`, and dependencies SHALL include `hono`, `zod`, and `typescript`
