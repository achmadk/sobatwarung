## ADDED Requirements

### Requirement: Reseller dashboard displays orders from API

The system SHALL fetch and display the reseller's orders from the backend API.

#### Scenario: Reseller opens dashboard
- **WHEN** authenticated Reseller navigates to dashboard
- **THEN** the PWA SHALL call GET /api/v1/orders, store orders in IndexedDB, and display order history with status badges

#### Scenario: Order list shows status badges
- **WHEN** orders are displayed
- **THEN** each order SHALL show a colored badge: DRAFT (gray), CONFIRMED (blue), PAID (green), SHIPPED (orange), DELIVERED (dark green), CANCELLED (red)

#### Scenario: No orders yet
- **WHEN** user has no orders
- **THEN** the PWA SHALL display "Belum ada pesanan" message

### Requirement: Dashboard shows order statistics

The system SHALL display summary statistics on the dashboard.

#### Scenario: Calculate active orders
- **WHEN** dashboard loads
- **THEN** the PWA SHALL count orders with status DRAFT, CONFIRMED, PAID, SHIPPED and display as "Pesanan Aktif"

#### Scenario: Calculate total spending
- **WHEN** dashboard loads
- **THEN** the PWA SHALL sum totalAmount of all orders and display as "Total Belanja"

### Requirement: Dashboard refreshes on pull-to-refresh

The system SHALL allow manual refresh of order data.

#### Scenario: User pulls to refresh
- **WHEN** user performs pull-to-refresh gesture
- **THEN** the PWA SHALL call GET /api/v1/orders again and update the display

### Requirement: Dashboard connects to real-time updates

The system SHALL receive WebSocket events for order status changes.

#### Scenario: Order status changes
- **WHEN** WebSocket receives order:status event
- **THEN** the PWA SHALL update the corresponding order in IndexedDB and refresh the UI
