## Why

The README.md is out of sync with the actual codebase. Two items exist on disk but aren't documented:

1. **`apps/mobile-kmp/`** — A Kotlin Multiplatform mobile app (~3,000 lines) with shared business logic, agent implementations, and UI screens exists but is invisible to anyone reading the README.
2. **`PRD-UX.md`** — A fully written UX PRD documenting sync indicators, onboarding, toast notifications, and error handling exists but isn't linked in the Documentation section.

This creates confusion for new contributors and makes the project appear less complete than it is.

## What Changes

- Add `apps/mobile-kmp/` to the Monorepo Structure tree diagram
- Add a row for `apps/mobile-kmp` in the Apps table with description
- Add `PRD-UX.md` to the Documentation section
- Add `pnpm dev:backend` and `pnpm dev:web-pwa` scripts to the root `package.json` to match README commands
- Update the SDK package description to reflect it's hand-written TypeScript, not auto-generated from OpenAPI

## Capabilities

### New Capabilities

*None — this is purely a documentation & housekeeping update.*

### Modified Capabilities

*None — no spec-level behavior changes.*

## Impact

- **File modified**: `README.md` (documentation only)
- **File modified**: `package.json` (add missing dev scripts)
- No code behavior changes, no API changes, no migration needed
