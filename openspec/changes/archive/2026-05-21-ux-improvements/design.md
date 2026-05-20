## Context

SobatWarung targets Indonesian warung owners who are skeptical of digital systems and may have low digital literacy. The app must work on low-end Android devices (2GB RAM) with unstable connectivity. Users measure success by completing two milestones: first order AND first group buy. Users arrive via two different acquisition channels with different expectations.

Currently:
- Sync is invisible (users don't know when data is synced)
- Dashboard focuses on orders; group buying is hard to discover
- Error messages are generic and not actionable
- No progress tracking toward "success"
- No trust signals for data sovereignty

## Goals / Non-Goals

**Goals:**
- Make offline-first capability visible and trustworthy
- Guide users to complete both success milestones (order + group buy)
- Reduce registration drop-off with progressive disclosure
- Provide actionable error messages in Indonesian
- Enable channel-aware onboarding without separate code paths

**Non-Goals:**
- Dark mode (not requested)
- Full rebrand or visual redesign
- New native mobile app (KMP is separate)
- Adding new backend APIs

## Decisions

### Decision 1: Sync Status Bar Placement

**Choice:** Fixed bottom bar on mobile, fixed header on desktop.

**Rationale:**
- Bottom bar is thumb-accessible and doesn't compete with content
- Always visible but non-intrusive
- Status: `🟢 Online | ✓ Tersinkronisasi` or `🟡 Offline | 3 menunggu`

**Alternatives considered:**
- Top notification banner: Too easy to dismiss or ignore
- Floating indicator: Obstructs content on small screens

### Decision 2: Progress Tracking Storage

**Choice:** Store onboarding progress in IndexedDB alongside existing sync queue.

**Rationale:**
- Already using Dexie (IndexedDB) for offline storage
- Progress survives app restarts
- Syncs across devices when online (eventual consistency)

**Alternatives considered:**
- localStorage: Simpler but less robust for complex objects
- Server-side: Adds backend dependency; progress should work offline

### Decision 3: Channel Detection

**Choice:** URL query parameter (`?from=wa` or `?from=referral`) passed through registration.

**Rationale:**
- Simple, stateless, works offline after capture
- WhatsApp links can include UTM-like parameters
- Referral codes can be墙上二维码

**Alternatives considered:**
- Server-side detection: Requires network at registration time
- Cookies/localStorage: Less reliable across sessions

### Decision 4: Toast Notification System

**Choice:** Lightweight toast component for async operation feedback.

**Rationale:**
- Non-blocking; doesn't interrupt flow
- Shows sync status, errors, success confirmations
- Can queue multiple toasts

**Alternatives considered:**
- Modal dialogs: Too intrusive for routine operations
- Snackbars (Material): Requires material-ui dependency we don't have

## Risks / Trade-offs

- **[Risk]** Too many toast notifications annoy users → **Mitigation:** Queue and batch; allow dismissal
- **[Risk]** Channel detection fails if users share links → **Mitigation:** Default to "organic" channel with standard onboarding
- **[Risk]** Progress tracking feels like gamification → **Mitigation:** Keep UI minimal; use subtle checkmarks, not badges or points
- **[Trade-off]** Adding sync status bar takes screen real estate → Acceptable; 44px is minimal cost for trust

## Migration Plan

1. **Phase 1:** Add SyncStatusBar component (non-blocking)
2. **Phase 2:** Integrate toast notification system into existing flows
3. **Phase 3:** Add onboarding progress tracking to reseller dashboard
4. **Phase 4:** Update registration flow with channel detection
5. **Phase 5:** Improve error messages across all forms

**Rollback:** Feature flags to disable each component individually.

## Open Questions

- Should onboarding progress reset if a user hasn't completed milestones in 7 days?
- Do we show progress to ALL roles or just Reseller (the primary target)?
- Should we ask users to rate their experience after completing first group buy?
