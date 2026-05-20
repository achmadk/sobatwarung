## Why

The landing page currently uses Tailwind CSS v3.4.1 with the PostCSS plugin and a JavaScript config file. Tailwind CSS v4 introduces a CSS-first configuration model, native Vite plugin support, faster build times, and a smaller runtime. Migrating now keeps the project on the latest toolchain and aligns with the Vite+ ecosystem being used across the monorepo.

## What Changes

- Replace `tailwindcss` v3 PostCSS-based setup with `@tailwindcss/vite` plugin (native Vite integration)
- Replace `@tailwind` CSS directives with `@import "tailwindcss"` (v4 CSS-first configuration)
- Replace `tailwind.config.js` with CSS `@theme` block for custom design tokens
- Remove `postcss.config.js` tailwindcss plugin entry (PostCSS may still be retained if needed for autoprefixing) (Note: autoprefixer is included natively in Tailwind v4)
- Update `package.json`: upgrade `tailwindcss` to v4, add `@tailwindcss/vite`, remove `postcss` + `autoprefixer` if no longer needed
- No breaking changes to the rendered output — visual regression is not expected

## Capabilities

### New Capabilities

- `tailwind-v4-migration`: Upgrade the landing page's styling pipeline from Tailwind CSS v3 to v4, covering dependency updates, configuration migration, CSS entry-point changes, and build verification.

### Modified Capabilities

<!-- No spec-level behavior changes — this is purely a build toolchain upgrade. Existing landing-page-migration spec does not need modification. -->
- _(none)_

## Impact

- **Affected directory:** `apps/landing-page/`
- **Dependencies upgraded:** `tailwindcss` from `^3.4.1` to `^4.x`, add `@tailwindcss/vite`
- **Dependencies removed:** `postcss` (bundled) and `autoprefixer` (built into v4) — if no other PostCSS usage exists
- **Files removed:** `tailwind.config.js`, postcss entry in `postcss.config.js`
- **Files modified:** `src/index.css`, `vite.config.ts`, `package.json`, `postcss.config.js`
- **Build verification:** `pnpm --filter @sobatwarung/landing-page build` must pass; `dev` server must start and render identically
