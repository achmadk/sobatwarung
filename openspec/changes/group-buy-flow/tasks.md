## 1. Group Buy Rooms List Page

- [x] 1.1 Create GroupBuyListPage component in `apps/web-pwa/src/pages/group-buy/GroupBuyListPage.tsx`
- [x] 1.2 Add route `/group-buy` to App.tsx routing
- [x] 1.3 Add "Group Buy" link to reseller dashboard navigation
- [x] 1.4 Implement room card component with product, quantity, price, and status display
- [x] 1.5 Add pull-to-refresh functionality
- [x] 1.6 Display empty state when no rooms available

## 2. Room Detail Page

- [x] 2.1 Create GroupBuyRoomDetailPage component in `apps/web-pwa/src/pages/group-buy/GroupBuyRoomDetailPage.tsx`
- [x] 2.2 Add route `/group-buy/:roomId` to App.tsx routing
- [x] 2.3 Display room info: product, target/current quantity, price, deadline
- [x] 2.4 Show progress bar for quantity target
- [x] 2.5 Display participant list with contributions
- [x] 2.6 Navigate back to list on room full/expired

## 3. Join Room Flow

- [x] 3.1 Create JoinRoomDialog component with quantity input
- [x] 3.2 Integrate joinRoom API call on confirmation
- [x] 3.3 Handle success with toast and milestone tracking
- [x] 3.4 Handle offline by queuing mutation
- [x] 3.5 Handle "room full" error state

## 4. Create Room Flow (Agen Utama)

- [x] 4.1 Create CreateRoomPage with multi-step form
- [x] 4.2 Step 1: Product search and selection
- [x] 4.3 Step 2: Target quantity, max price, deadline inputs with validation
- [x] 4.4 Step 3: Review and confirm
- [x] 4.5 Integrate createRoom API
- [x] 4.6 Handle creation errors with retry option

## 5. Checkout Flow (Agen Utama)

- [x] 5.1 Add "Checkout" button to room detail for Agen Utama
- [x] 5.2 Disable button when target not met with explanatory text
- [x] 5.3 Integrate checkoutRoom API
- [x] 5.4 Handle checkout success and update room status

## 6. Onboarding Progress Integration

- [x] 6.1 Call markFirstGroupBuyComplete() when user joins first room
- [x] 6.2 Update OnboardingProgress component to show group buy milestone
- [x] 6.3 Show congratulations message when both milestones complete
