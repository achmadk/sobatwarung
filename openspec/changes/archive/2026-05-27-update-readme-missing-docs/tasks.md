## 1. Document `apps/mobile-kmp/` in README

- [x] 1.1 Add `apps/mobile-kmp/` to the Monorepo Structure tree diagram under `apps/` section
- [x] 1.2 Add a row to the Apps table: description "Kotlin Multiplatform mobile app for Agen Utama & Agen Mitra"

## 2. Document `PRD-UX.md` in README

- [x] 2.1 Add `PRD-UX.md` entry to the Documentation section list (after PRD-P2.md)

## 3. Add Missing Root Scripts

- [x] 3.1 Add `"dev:backend": "pnpm --filter @sobatwarung/backend dev"` to root `package.json`
- [x] 3.2 Add `"dev:web-pwa": "pnpm --filter @sobatwarung/web-pwa dev"` to root `package.json`
- [x] 3.3 Sync the Development Commands table in README if needed (already lists these commands)

## 4. Fix SDK Description

- [x] 4.1 Update SDK description in README from "Auto-generated HTTP client from OpenAPI spec" to "TypeScript HTTP client library"

## 5. Verify

- [x] 5.1 Run `pnpm lint` to ensure no linting issues from package.json changes
- [x] 5.2 Confirm README renders correctly (structure, links, no broken markdown)
