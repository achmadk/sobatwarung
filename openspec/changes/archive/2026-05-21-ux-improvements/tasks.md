## 1. Sync Status Indicator

- [x] 1.1 Create `SyncStatusBar` component in `apps/web-pwa/src/components/`
- [x] 1.2 Add online/offline detection using `navigator.onLine` and `window` events
- [x] 1.3 Query pending mutation count from IndexedDB sync queue
- [x] 1.4 Add `syncStatusIndicator` to main dashboard layout
- [x] 1.5 Style for mobile-first (bottom bar, 44px height)

## 2. Toast Notification System

- [x] 2.1 Create `Toast` component with variants: success, error, info
- [x] 2.2 Create `ToastProvider` context for global toast management
- [x] 2.3 Implement toast queue with 3-second display interval
- [x] 2.4 Integrate toast system into sync service callbacks
- [x] 2.5 Add toast dismissal on tap/swipe

## 3. Onboarding Progress Tracking

- [x] 3.1 Extend IndexedDB schema to include `onboardingProgress` table
- [x] 3.2 Create `useOnboardingProgress` hook
- [x] 3.3 Track "first order" milestone on order confirmation
- [x] 3.4 Track "first group buy" milestone on group room join
- [x] 3.5 Create `OnboardingProgress` component for dashboard
- [x] 3.6 Display progress as `🛒✓ | 🤝○` style visual

## 4. Group Buy Discovery CTA

- [x] 4.1 Add group buy CTA to reseller dashboard (shown when milestone incomplete)
- [ ] 4.2 Create "available group buy rooms" list view
- [ ] 4.3 Add "create new group buy" flow
- [x] 4.4 Add congratulations message when both milestones complete

## 5. Optimistic UI Updates

- [x] 5.1 Add sync status icons to order list items (`⟳` syncing, `✓` synced, `⏳` pending)
- [x] 5.2 Update order creation to show immediately with pending state
- [x] 5.3 Update sync service to emit events on mutation status change

## 6. Channel-Aware Onboarding

- [x] 6.1 Add URL parameter parsing for `from`, `code` in registration entry
- [x] 6.2 Store channel in session storage during registration
- [x] 6.3 Create channel-aware content component with WhatsApp/referral/organic variants
- [x] 6.4 Integrate channel content into registration flow

## 7. Registration Flow Improvements

- [x] 7.1 Add multi-step progress indicator to registration
- [x] 7.2 Implement role-based field filtering (Reseller vs Agen Utama vs Agen Mitra)
- [x] 7.3 Add WhatsApp verification step with OTP
- [x] 7.4 Improve error messages to Indonesian with actionable hints

## 8. Error Handling Improvements

- [x] 8.1 Map backend error codes to Indonesian messages in `api.ts`
- [x] 8.2 Add specific error messages for: invalid credentials, network timeout, offline, validation errors
- [x] 8.3 Add retry buttons for recoverable errors
- [x] 8.4 Show context-specific hints (e.g., "Pastikan nomor dimulai dengan 628")

## 9. PRD Output

- [x] 9.1 Compile all UX improvement specifications into `./PRDs/PRD-UX.md`
- [x] 9.2 Include component inventory with visual descriptions
- [x] 9.3 Add implementation priority matrix
