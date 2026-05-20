## Context

The SobatWarung backend (`apps/backend/`) is a Node.js/TypeScript application using Hono framework with Prisma ORM, PostgreSQL, Redis, and Socket.io for real-time features. The backend provides REST APIs and WebSocket endpoints for the SobatWarung platform.

**Current State**: Backend code exists with full implementation but lacks developer documentation.

**Constraints**: README should be concise but comprehensive, covering all major features and workflows.

**Stakeholders**: Backend developers, frontend developers integrating with APIs, DevOps engineers deploying the application.

## Goals / Non-Goals

**Goals:**
- Document API endpoints with request/response examples
- Document authentication flow (JWT + device keys)
- Document WebSocket events and subscriptions
- Document database models (Prisma schema)
- Document environment configuration
- Provide quick start guide for local development
- Document Docker deployment

**Non-Goals:**
- Full API reference (OpenAPI spec at `/docs` provides this)
- Mobile-specific documentation (out of scope)
- End-to-end testing documentation (separate docs)

## Decisions

### Decision 1: Markdown format over auto-generated documentation

**Choice**: Manual Markdown README
**Rationale**: Markdown is portable, version-controllable, and renders nicely in GitHub/GitLab. Auto-generated API docs exist at `/docs` endpoint.

### Decision 2: Structure following standard README conventions

**Choice**: Standard sections (Overview, Quick Start, API Reference, etc.)
**Rationale**: Developers familiar with standard OSS project structure can navigate easily.

## Risks / Trade-offs

**[Risk] README may become stale as code evolves**
→ **Mitigation**: Keep documentation minimal, reference code for details. Auto-generated OpenAPI docs stay current.

**[Risk] Missing coverage of edge cases**
→ **Mitigation**: Focus on common workflows; link to detailed specs for edge cases.
