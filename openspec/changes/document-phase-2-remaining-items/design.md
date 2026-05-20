## Context

The SobatWarung repository currently contains a comprehensive `PRD.md` and `PRD-BE.md`. However, an exploration of the codebase revealed a gap between the architecture described in `PRD-BE.md` and the actual implementation, specifically regarding the "Phase 2" integration layers. The Node.js backend and Rust sync engine exist as isolated silos. We need a targeted document (`PRD-P2.md`) that AI agents can use as a strict reference guide to bridge these components.

## Goals / Non-Goals

**Goals:**
- Extract and expand upon the missing Phase 2 integration items from `PRD-BE.md`.
- Provide clear architectural diagrams (ASCII) in the new document showing the gRPC and Redis Streams flow between Node.js and Rust.
- Document the exact missing components: gRPC client in Node, Redis Streams producer/consumer, and Privacy-Guard agent routing.

**Non-Goals:**
- Do not modify existing codebase or implement the integration.
- Do not rewrite `PRD.md` or `PRD-BE.md`.

## Decisions

### 1. Dedicated PRD-P2.md Document
**Decision:** Create a new `PRD-P2.md` rather than appending to `PRD-BE.md`.
**Rationale:** `PRD-BE.md` is already 1400+ lines long. A dedicated document reduces context window overload for AI agents tasked specifically with executing the complex Phase 2 integration. 

### 2. Focus strictly on Integration (The "Bridge")
**Decision:** `PRD-P2.md` will assume the Rust axum server and Node.js Hono server already exist, focusing entirely on the communication bridge.
**Rationale:** Keeps the document actionable and prevents redundant re-implementation of existing systems.

## Risks / Trade-offs

- **[Risk] Document Drift** → Having multiple PRDs (`PRD.md`, `PRD-BE.md`, `PRD-P2.md`) could lead to conflicting information if the architecture changes.
- **Mitigation**: Clearly state at the top of `PRD-P2.md` that it is an execution guide for Phase 2 integration and depends on `PRD-BE.md` for base definitions.