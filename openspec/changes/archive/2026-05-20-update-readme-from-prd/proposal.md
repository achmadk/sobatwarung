## Why

The current `README.md` is a generic Vite template scaffold and contains no information about the SobatWarung project, its architecture, or how to set up and run the monorepo. This misleads contributors and wastes time searching for basic project information.

## What Changes

- Replace the generic Vite template README with a comprehensive project README that reflects the actual SobatWarung monorepo structure and capabilities
- Document the pnpm workspace setup, build commands, and development workflows
- Document the three main apps: `landing-page`, `backend`, and `web-pwa`
- Document the `packages/` shared types and SDK
- Document the `services/` Rust microservice architecture
- Document the Phase 1 (Node.js) and Phase 2 (Rust) rollout strategy
- Document deployment targets (Fly.io, Cloudflare Pages)

## Capabilities

### New Capabilities
- `project-readme`: A comprehensive README documenting the SobatWarung project overview, monorepo structure, apps, packages, services, tech stack, commands, and development setup

### Modified Capabilities
- (none — this is a documentation-only change)

## Impact

- `README.md` will be completely replaced
- No code, API, or dependency changes
