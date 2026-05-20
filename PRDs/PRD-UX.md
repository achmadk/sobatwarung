# PRD-UX: User Experience Improvements

## Overview

This PRD documents the UX improvements for SobatWarung's web PWA, focusing on making the offline-first architecture visible and trustworthy, guiding users to success milestones, and providing contextual error handling.

## Goals

- Make offline-first capability visible and trustworthy
- Guide users to complete both success milestones (order + group buy)
- Reduce registration drop-off with progressive disclosure
- Provide actionable error messages in Indonesian
- Enable channel-aware onboarding without separate code paths

## Capabilities Implemented

### 1. Sync Status Indicator

Persistent UI element showing online/offline state and pending mutation count.

**Component:** `SyncStatusBar`
- Location: `apps/web-pwa/src/components/SyncStatusBar.tsx`
- States:
  - Online + Synced: `🟢 Online | ✓ Tersinkronisasi`
  - Online + Syncing: `🔄 Menyinkronkan... | N tersisa`
  - Offline: `🟡 Offline | N menunggu`
  - Sync Failed: `🟡 Gagal menyinkronkan | Coba lagi`
- Placement: Fixed bottom bar (44px height) on mobile, fixed header on desktop
- Styling: Mobile-first with Tailwind CSS

### 2. Toast Notification System

Lightweight notification component for async operation feedback.

**Components:**
- `Toast` - Individual toast with variants (success, error, info)
- `ToastProvider` - Global context for toast management
- Location: `apps/web-pwa/src/components/Toast.tsx`, `ToastProvider.tsx`
- Features:
  - Auto-dismiss after 3 seconds
  - Tap/swipe to dismiss
  - Queue support for multiple toasts
  - Slide-in animation

**Toast Messages:**
- Sync complete: "Pesanan berhasil disinkronkan"
- Sync failed: "Sinkronisasi gagal. Akan dicoba lagi otomatis."

### 3. Onboarding Progress Tracking

Track and display user progress toward success milestones.

**Component:** `OnboardingProgress`
- Location: `apps/web-pwa/src/components/OnboardingProgress.tsx`

**Hook:** `useOnboardingProgress`
- Location: `apps/web-pwa/src/hooks/useOnboardingProgress.ts`
- Features:
  - Track "first order" milestone
  - Track "first group buy" milestone
  - Persist to IndexedDB
  - Sync across devices

**Visual Display:** `🛒✓ | 🤝○` style progress indicator

**Milestones:**
- First Order: Marked when order is confirmed
- First Group Buy: Marked when user joins a group buying room

**Congratulations Message:**
"Selamat! Anda telah mengenal semua fitur utama."

### 4. Channel-Aware Onboarding

Adapt first-use experience based on acquisition channel.

**Component:** `ChannelDetector`
- Location: `apps/web-pwa/src/components/ChannelDetector.tsx`

**URL Parameters:**
- `?from=wa` - WhatsApp channel
- `?from=referral&code=XXX` - Referral channel
- Organic (default) - Direct/organic traffic

**Channel Content:**
| Channel | Title | Subtitle |
|---------|-------|----------|
| WhatsApp | Mulai dengan memesan dari katalog | Proses hanya 30 detik! |
| Referral | Agen mengundang Anda ke SobatWarung | Bergabung dan dapatkan manfaat group buying! |
| Organic | Selamat datang di SobatWarung | Aplikasi offline-first untuk warung Indonesia |

### 5. Optimistic UI Updates

Show changes immediately with sync feedback.

**Features:**
- Sync status icons on order list items
  - `⟳` syncing
  - `✓` synced
  - `⏳` pending
- Immediate order creation with pending state
- Real-time sync status updates via custom events

### 6. Registration Flow Improvements

Multi-step registration with role-based fields.

**Multi-Step Indicator:**
- Step 1: Data Diri
- Step 2: Verifikasi
- Step 3: Selesai

**Role-Based Fields:**
| Role | Fields |
|------|--------|
| Reseller | Nama, WhatsApp, Alamat |
| Agen Utama | + Nama Toko, Alamat Lengkap, NPWP |
| Agen Mitra | + Nama Toko, Alamat |
| Pemasok | Nama, WhatsApp, Nama Tokok, Alamat |

**Error Handling:**
- Indonesian error messages
- Context-specific hints (e.g., "Pastikan nomor dimulai dengan 628")

### 7. Group Buy Discovery CTA

Elevated CTAs for users who haven't completed group buy milestone.

**Dashboard CTA:**
"Gabung Group Buy pertama Anda" with value proposition and button to view group buy rooms.

### 8. Error Handling

Comprehensive error mapping to Indonesian messages.

**Error Utilities:** `apps/web-pwa/src/services/errors.ts`

**Error Mappings:**
| Code | Message | Hint | Recoverable |
|------|---------|------|-------------|
| INVALID_CREDENTIALS | Nomor WhatsApp atau kata sandi salah | Pastikan nomor dan kata sandi sudah benar | Yes |
| NETWORK_TIMEOUT | Koneksi timeout | Pastikan koneksi internet stabil | Yes |
| OFFLINE | Anda sedang offline | Data akan disinkronkan saat koneksi kembali | Yes |
| VALIDATION_ERROR | Data yang dimasukkan tidak valid | Pastikan semua field terisi dengan benar | No |
| WHATSAPP_FORMAT | Format nomor WhatsApp salah | Pastikan nomor dimulai dengan 628 | No |
| WHATSAPP_EXISTS | Nomor WhatsApp sudah terdaftar | Coba masuk dengan akun yang sudah ada | No |

## Component Inventory

| Component | File | Status |
|-----------|------|--------|
| SyncStatusBar | `components/SyncStatusBar.tsx` | Implemented |
| Toast | `components/Toast.tsx` | Implemented |
| ToastProvider | `components/ToastProvider.tsx` | Implemented |
| OnboardingProgress | `components/OnboardingProgress.tsx` | Implemented |
| ChannelDetector | `components/ChannelDetector.tsx` | Implemented |
| useOnboardingProgress | `hooks/useOnboardingProgress.ts` | Implemented |
| useToast | `hooks/useToast.ts` (via ToastProvider) | Implemented |
| errorMappings | `services/errors.ts` | Implemented |

## Implementation Priority Matrix

| Priority | Feature | Tasks | Complexity |
|----------|---------|-------|------------|
| P0 - Critical | Sync Status Bar | 1.1-1.5 | Low |
| P0 - Critical | Toast System | 2.1-2.5 | Low |
| P1 - High | Onboarding Progress | 3.1-3.6 | Medium |
| P1 - High | Channel Detection | 6.1-6.4 | Low |
| P1 - High | Registration Flow | 7.1-7.4 | Medium |
| P2 - Medium | Group Buy CTA | 4.1-4.4 | Medium |
| P2 - Medium | Optimistic UI | 5.1-5.3 | Medium |
| P3 - Low | Error Handling | 8.1-8.4 | Low |
| P3 - Low | PRD Documentation | 9.1-9.3 | Low |

## Technical Notes

### IndexedDB Schema Changes

Added `onboardingProgress` table in version 2:
```typescript
interface OnboardingProgress {
  id: string;
  firstOrderCompleted: boolean;
  firstOrderCompletedAt?: string;
  firstGroupBuyCompleted: boolean;
  firstGroupBuyCompletedAt?: string;
  userId: string;
}
```

### Sync Event System

Custom events emitted for sync status:
```typescript
interface SyncEvent {
  type: "sync_complete" | "sync_failed" | "mutation_queued";
  count?: number;
  error?: string;
}
```

### Browser Compatibility

- Uses `navigator.onLine` for online/offline detection
- Uses `window.addEventListener` for online/offline events
- Uses `CustomEvent` for sync event emission
- All features work offline (data stored in IndexedDB)

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
