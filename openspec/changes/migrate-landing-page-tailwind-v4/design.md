## Context

The landing page (`apps/landing-page/`) is a Vite+React PWA styled with Tailwind CSS v3.4.1. The current styling pipeline uses:

- **PostCSS** with the `tailwindcss` plugin and `autoprefixer`
- **`tailwind.config.js`** with a custom `sobatGreen` color palette
- **CSS entry point** (`src/index.css`) using `@tailwind` directives

Tailwind CSS v4 introduces a CSS-first configuration model, eliminating the need for a JavaScript config file and the PostCSS plugin. It ships a native Vite plugin (`@tailwindcss/vite`) and includes `autoprefixer` functionality by default.

This migration is confined to `apps/landing-page/` and does not affect other workspace packages or the shared design system.

## Goals / Non-Goals

**Goals:**
- Upgrade `tailwindcss` from v3.4.1 to v4.x in the landing page
- Replace PostCSS-based Tailwind integration with `@tailwindcss/vite` plugin
- Migrate `tailwind.config.js` custom theme values (`sobatGreen`) into a CSS `@theme` block
- Replace `@tailwind` CSS directives with `@import "tailwindcss"`
- Remove now-unnecessary PostCSS and autoprefixer dependencies
- Verify the landing page builds and renders identically

**Non-Goals:**
- Migrating other apps (web-pwa, backend) to Tailwind v4 — only `apps/landing-page/`
- Refactoring component class names or visual design — no class-name changes
- Changing the Vite+ configuration beyond the Tailwind plugin swap
- Updating the shared design system or design tokens outside the landing page

## Decisions

### Decision 1: Use `@tailwindcss/vite` instead of PostCSS plugin

Tailwind v4 offers three integration paths: PostCSS plugin, CLI, and Vite plugin. Since the landing page already uses Vite (via Vite+), the `@tailwindcss/vite` plugin is the natural choice. It provides faster rebuilds via native Vite integration and avoids the extra PostCSS processing step.

- **Alternative considered:** Keep PostCSS plugin (works but is the legacy approach; Vite plugin is the recommended path for v4)
- **Verdict:** Use `@tailwindcss/vite`

### Decision 2: Inline custom theme tokens via `@theme` in `index.css`

Tailwind v4 moves theme configuration into CSS with the `@theme` directive. The `sobatGreen` custom color palette will be declared directly in `@theme` at the top of `index.css`.

- **Alternative considered:** Create a separate `theme.css` file — not needed given the small number of custom tokens
- **Verdict:** Inline in `index.css` for simplicity

### Decision 3: Remove `postcss` and `autoprefixer` dependencies

Tailwind v4 includes autoprefixing natively. If no other PostCSS plugins are needed, both `postcss` and `autoprefixer` can be removed from `package.json`. The `postcss.config.js` file will be updated to remove the `tailwindcss` plugin entry (or removed entirely if unused).

- **Alternative considered:** Keep PostCSS config for future extensibility — adds unnecessary weight
- **Verdict:** Remove both deps and clean up PostCSS config

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| **Visual regression** — Tailwind v4 changes default values for some utilities (e.g., ring widths, shadow scales) | Run a visual diff of the built site before/after migration; verify key pages render identically |
| **Missing class utilities** — A small number of v3 utility classes were removed in v4 | Check the Tailwind v4 upgrade guide for removed classes; search the codebase for any usage before migrating |
| **Vite+ compatibility** — `@tailwindcss/vite` may conflict with Vite+'s bundler (Rolldown) | Install and test in a branch first; if incompatible, fall back to the PostCSS plugin approach |
| **`@theme` syntax mismatch** — Custom color tokens may not map 1:1 from `tailwind.config.js` to `@theme` | Verify the generated CSS output; use the `--color-sobatGreen-*` variable naming convention |
