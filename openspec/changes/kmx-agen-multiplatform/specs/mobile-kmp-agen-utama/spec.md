## ADDED Requirements

### Requirement: Agen Utama Dashboard

The system SHALL provide a dashboard screen for Agen Utama users displaying key metrics (inventory levels, pending orders, community activity, sales performance).

#### Scenario: Dashboard loads with cached data

- **WHEN** the Agen Utama user opens the app
- **THEN** the app SHALL display the dashboard with data from local SQLDelight cache without requiring network connectivity

#### Scenario: Dashboard refreshes when online

- **WHEN** the Agen Utama user has network connectivity and pulls to refresh
- **THEN** the app SHALL fetch latest data from backend and update the local cache

### Requirement: Catalog Management

The system SHALL allow Agen Utama users to manage their product catalog including adding, editing, and removing products.

#### Scenario: Add new product

- **WHEN** Agen Utama user enters product details and submits
- **THEN** the app SHALL save to local database immediately and queue mutation for sync when online

#### Scenario: Edit existing product while offline

- **WHEN** Agen Utama user modifies a product while offline
- **THEN** the app SHALL save the change locally and add to sync queue

### Requirement: Inventory Tracking

The system SHALL provide real-time inventory tracking with low-stock alerts.

#### Scenario: Low stock alert triggered

- **WHEN** any product inventory falls below the configured threshold
- **THEN** the app SHALL display a visual alert on the dashboard

### Requirement: Order Management

The system SHALL allow Agen Utama users to view, create, update, and manage orders from their agents.

#### Scenario: View order list

- **WHEN** Agen Utama user opens order management screen
- **THEN** the app SHALL display all orders from local database with status indicators

#### Scenario: Update order status

- **WHEN** Agen Utama user changes order status
- **THEN** the app SHALL update locally and queue sync mutation

### Requirement: Group Buying Coordination

The system SHALL allow Agen Utama users to create and manage group buying rooms for their hub.

#### Scenario: Create group buying room

- **WHEN** Agen Utama user creates a new group buying room with products and pricing
- **THEN** the app SHALL save locally, queue sync, and send WebSocket notification to hub members when online

#### Scenario: Real-time group buying updates

- **WHEN** another agent in the same hub updates a group buying room
- **THEN** the app SHALL receive WebSocket notification and display updated room details
