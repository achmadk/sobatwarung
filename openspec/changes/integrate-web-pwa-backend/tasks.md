## 1. Auth Service Enhancement

- [x] 1.1 Update `apps/web-pwa/src/services/api.ts` to export typed API methods (login, register, getOrders, getProducts, etc.)
- [x] 1.2 Create `apps/web-pwa/src/services/auth.ts` with token management (getToken, setToken, clearToken, refreshToken)
- [x] 1.3 Create `apps/web-pwa/src/hooks/useAuth.ts` React hook for auth state

## 2. Login Page Integration

- [x] 2.1 Import useAuth hook in LoginPage
- [x] 2.2 Connect form submit to auth.login() API call
- [x] 2.3 Handle success: store tokens, redirect based on role
- [x] 2.4 Handle error: display error message
- [x] 2.5 Add loading state on submit button

## 3. Register Page Integration

- [x] 3.1 Import useAuth hook in RegisterPage
- [x] 3.2 Map form role (reseller → RESELLER, pemasok → PEMASOK)
- [x] 3.3 Connect form submit to auth.register() API call
- [x] 3.4 Handle success: redirect to login with success message
- [x] 3.5 Handle error: display error message
- [x] 3.6 Add loading state on submit button

## 4. WebSocket Service Integration

- [x] 4.1 Update `apps/web-pwa/src/services/ws.ts` to use auth token from storage
- [x] 4.2 Add event handlers for room:updated, order:status, agent:event
- [x] 4.3 Implement auto-reconnect with exponential backoff
- [x] 4.4 Add connection state indicator

## 5. Sync Service Integration

- [x] 5.1 Update `apps/web-pwa/src/services/sync.ts` to use proper deviceId
- [x] 5.2 Connect sync events to update IndexedDB
- [x] 5.3 Wire setupAutoSync() to app initialization
- [x] 5.4 Add conflict notification UI

## 6. Reseller Dashboard Integration

- [x] 6.1 Import apiClient and db in ResellerDashboard
- [x] 6.2 Fetch orders on mount via GET /api/v1/orders
- [x] 6.3 Store orders in IndexedDB
- [x] 6.4 Display orders with status badges
- [x] 6.5 Calculate and display "Pesanan Aktif" count
- [x] 6.6 Calculate and display "Total Belanja"
- [x] 6.7 Wire WebSocket order:status handler to refresh orders
- [x] 6.8 Implement pull-to-refresh

## 7. Etalase Page Integration

- [x] 7.1 Get agenId from URL params
- [x] 7.2 Fetch products via GET /api/v1/etalase/:agenId/products
- [x] 7.3 Store products in IndexedDB
- [x] 7.4 Display product grid with name, price, category, image
- [x] 7.5 Add quantity selector per product
- [x] 7.6 Implement "Pesan via WhatsApp" button with deep link
- [x] 7.7 Add offline banner when cached data shown

## 8. Pemasok Portal Integration

- [x] 8.1 Fetch supplier's products via GET /api/v1/products?supplierId=me
- [x] 8.2 Store products in IndexedDB
- [x] 8.3 Display product list with edit/delete buttons
- [x] 8.4 Implement create product form with POST /api/v1/products
- [x] 8.5 Implement edit product with PUT /api/v1/products/:id
- [x] 8.6 Implement delete (deactivate) with DELETE /api/v1/products/:id
- [x] 8.7 Queue mutations offline with sync.ts enqueueMutation

## 9. App Entry Point Updates

- [x] 9.1 Import and initialize sync service in main.tsx
- [x] 9.2 Add auth state check on app load
- [x] 9.3 Add route guards for protected pages
- [x] 9.4 Add 401 interceptor for token refresh

## 10. Environment Configuration

- [x] 10.1 Add VITE_API_BASE_URL to web-pwa .env
- [x] 10.2 Add VITE_WS_BASE_URL to web-pwa .env
- [x] 10.3 Update vite.config.ts proxy for development
