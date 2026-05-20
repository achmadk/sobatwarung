## ADDED Requirements

### Requirement: Web PWA scaffold directory structure

The monorepo SHALL contain an `apps/web-pwa/` directory with a scaffolded React TypeScript PWA structure matching the PRD-BE.md module layout.

#### Scenario: Web PWA directory exists with correct structure

- **WHEN** the migration is applied
- **THEN** `apps/web-pwa/` SHALL contain `package.json`, `tsconfig.json`, `public/manifest.json`, and `src/` with the following subdirectories: `pages/etalase/`, `pages/reseller/`, `pages/pemasok/`, `pages/auth/`, `services/`

#### Scenario: Web PWA package.json has correct configuration

- **WHEN** reviewing `apps/web-pwa/package.json`
- **THEN** the `name` SHALL be `@sobatwarung/web-pwa`, and dependencies SHALL include `react`, `react-dom`, `react-router-dom`, `dexie`, `vite-plugin-pwa`
