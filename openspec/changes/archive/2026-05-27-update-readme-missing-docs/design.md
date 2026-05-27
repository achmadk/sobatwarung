## Context

The README.md documents the project's monorepo structure, apps, packages, services, and documentation references. Two items currently exist in the repository but are omitted:

- **`apps/mobile-kmp/`**: Kotlin Multiplatform app with shared business logic, agent implementations, and Compose UI. Already integrated into the pnpm workspace via `pnpm-workspace.yaml` (`apps/*` glob).
- **`PRD-UX.md``: UX-focused PRD documenting sync indicators, onboarding, toast notifications, error handling, and registration flow improvements.

Additionally, the README's Development Commands table references `pnpm dev:backend` and `pnpm dev:web-pwa` but these scripts don't exist in the root `package.json`. The SDK description says "Auto-generated HTTP client from OpenAPI spec" but it's built via `tsc -b` (hand-written).

## Goals / Non-Goals

**Goals:**
- Add `apps/mobile-kmp/` to the monorepo structure diagram and apps table
- Add `PRD-UX.md` to the Documentation section
- Add missing `dev:backend` and `dev:web-pwa` scripts to root `package.json`
- Fix SDK description to accurately reflect hand-written implementation

**Non-Goals:**
- No changes to app code, backend, or infrastructure
- No restructuring of the monorepo
- No migration or data changes

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Mobile-KMP app description | "Kotlin Multiplatform mobile app for Agen Utama & Agen Mitra" | Matches PRD-BE.md platform strategy — KMP targets Agen Utama and Agen Mitra |
| Placement in structure | Under `apps/` section, after `web-pwa` | Alphabetical within apps, consistent with existing ordering |
| Dev scripts naming | `dev:backend` → `pnpm --filter @sobatwarung/backend dev`, `dev:web-pwa` → `pnpm --filter @sobatwarung/web-pwa dev` | Existing pattern from `dev:landing` and `build:landing` scripts |
| SDK description fix | "TypeScript HTTP client library" | Accurate — it's hand-written TypeScript compiled with `tsc -b` |

## Risks / Trade-offs

- **[Low] README gets slightly longer** — adding 5-7 lines is negligible. Trade-off is improved accuracy for contributors.
- **[None] No behavioral changes** — pure documentation + two package.json script aliases.
