## ADDED Requirements

### Requirement: Tailwind CSS upgraded to v4

The `apps/landing-page/` SHALL upgrade from Tailwind CSS v3.x to v4.x, replacing the PostCSS-based integration with the `@tailwindcss/vite` plugin and adopting CSS-first configuration.

#### Scenario: tailwindcss package is upgraded to v4

- **WHEN** checking `apps/landing-page/package.json`
- **THEN** `tailwindcss` SHALL be at version `^4.x` and `@tailwindcss/vite` SHALL be listed under `devDependencies`

#### Scenario: Vite plugin is registered

- **WHEN** reviewing `apps/landing-page/vite.config.ts`
- **THEN** the `@tailwindcss/vite` plugin SHALL be registered in the `plugins` array and the PostCSS `tailwindcss` plugin SHALL NOT be used

#### Scenario: CSS entry point uses v4 syntax

- **WHEN** reviewing `apps/landing-page/src/index.css`
- **THEN** the SHALL use `@import "tailwindcss"` instead of `@tailwind` directives, and custom design tokens SHALL be declared in a `@theme` block

### Requirement: Custom theme tokens migrated to CSS @theme

The `sobatGreen` custom color palette currently defined in `tailwind.config.js` SHALL be migrated to a CSS `@theme` block in `src/index.css`, preserving the exact hex values for each shade.

#### Scenario: sobatGreen colors are defined in @theme

- **WHEN** inspecting `apps/landing-page/src/index.css`
- **THEN** `--color-sobatGreen-*` CSS variables SHALL be defined inside a `@theme` block with the same hex values as the current `tailwind.config.js`

#### Scenario: tailwind.config.js is removed

- **WHEN** checking the `apps/landing-page/` directory
- **THEN** `tailwind.config.js` SHALL NOT exist

### Requirement: Build pipeline produces identical output

After migration, the landing page SHALL build successfully and produce functionally identical styled output.

#### Scenario: Build succeeds

- **WHEN** `pnpm --filter @sobatwarung/landing-page build` is executed
- **THEN** the build SHALL exit with code 0 and produce output in `apps/landing-page/dist/`

#### Scenario: PostCSS config is cleaned

- **WHEN** checking `apps/landing-page/postcss.config.js`
- **THEN** the `tailwindcss` plugin entry SHALL be removed (the file MAY be deleted if only tailwindcss was configured)
