## Requirements

### Requirement: Landing page moved to apps/landing-page/

The existing landing page source code, config files, and dependencies SHALL be relocated to `apps/landing-page/` with its own `package.json`.

#### Scenario: All files are relocated

- **WHEN** the migration is applied
- **THEN** `apps/landing-page/` SHALL contain `src/`, `public/`, `index.html`, `vite.config.ts`, `tailwind.config.js`, `postcss.config.js`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, and `package.json`

#### Scenario: Landing page package.json has correct @sobat scope

- **WHEN** reviewing `apps/landing-page/package.json`
- **THEN** the `name` field SHALL be `@sobatwarung/landing-page` and the `private` field SHALL be `true`

### Requirement: Landing page builds and dev works after migration

The landing page SHALL build and run identically after being relocated to `apps/landing-page/`.

#### Scenario: Build succeeds after migration

- **WHEN** `pnpm --filter @sobatwarung/landing-page build` is executed
- **THEN** the build SHALL succeed and produce output in `apps/landing-page/dist/`

#### Scenario: Dev server starts

- **WHEN** `pnpm --filter @sobatwarung/landing-page dev` is executed
- **THEN** the Vite dev server SHALL start on the expected port with HMR enabled
