## 1. Upgrade Dependencies

- [x] 1.1 Upgrade `tailwindcss` from `^3.4.1` to `^4.x` in `apps/landing-page/package.json`
- [x] 1.2 Add `@tailwindcss/vite` as a devDependency in `apps/landing-page/package.json`
- [x] 1.3 Remove `autoprefixer` from `apps/landing-page/package.json` (included in Tailwind v4)
- [x] 1.4 Remove `postcss` from `apps/landing-page/package.json` (no longer needed)

## 2. Configure Vite Plugin

- [x] 2.1 Import and register `@tailwindcss/vite` plugin in `apps/landing-page/vite.config.ts`
- [x] 2.2 Remove the PostCSS `tailwindcss` plugin entry from `apps/landing-page/postcss.config.js`
- [x] 2.3 Remove `postcss.config.js` entirely if tailwindcss was the only plugin

## 3. Migrate CSS Entry Point

- [x] 3.1 Replace `@tailwind base;` / `@tailwind components;` / `@tailwind utilities;` directives with `@import "tailwindcss"` in `src/index.css`
- [x] 3.2 Add `@theme` block to `src/index.css` with `--color-sobatGreen-*` custom color tokens matching the current `tailwind.config.js` values

## 4. Remove Legacy Config

- [x] 4.1 Delete `apps/landing-page/tailwind.config.js`

## 5. Verify Build

- [x] 5.1 Run `pnpm install` to apply dependency changes
- [x] 5.2 Run `pnpm --filter @sobatwarung/landing-page build` and confirm exit code 0
- [ ] 5.3 Visually verify the landing page renders identically (no class-name regression) — manual check required
