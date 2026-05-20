## ADDED Requirements

### Requirement: Agen Mitra Dashboard

The system SHALL provide a simplified dashboard for Agen Mitra users displaying their key metrics (pending orders, community activity, personal sales).

#### Scenario: Dashboard loads with cached data

- **WHEN** the Agen Mitra user opens the app
- **THEN** the app SHALL display the dashboard with data from local SQLDelight cache without requiring network connectivity

### Requirement: Catalog Browsing

The system SHALL allow Agen Mitra users to browse the product catalog from their parent Agen Utama.

#### Scenario: Browse catalog offline

- **WHEN** Agen Mitra user opens catalog while offline
- **THEN** the app SHALL display cached catalog data from local database

### Requirement: Order Drafting

The system SHALL allow Agen Mitra users to create and draft orders for submission.

#### Scenario: Create order draft

- **WHEN** Agen Mitra user adds products to a new order
- **THEN** the app SHALL save the draft to local database immediately

#### Scenario: Submit order when online

- **WHEN** Agen Mitra user submits order with network connectivity available
- **THEN** the app SHALL send order to backend and clear local draft

#### Scenario: Submit order when offline

- **WHEN** Agen Mitra user submits order without network connectivity
- **THEN** the app SHALL queue the order submission in sync queue for later transmission

### Requirement: Community Features

The system SHALL allow Agen Mitra users to view and participate in group buying rooms.

#### Scenario: View group buying rooms

- **WHEN** Agen Mitra user opens community section
- **THEN** the app SHALL display available group buying rooms from cache or network

#### Scenario: Join group buying room

- **WHEN** Agen Mitra user joins a group buying room
- **THEN** the app SHALL register participation locally and queue sync mutation

### Requirement: Personal Sales Tracking

The system SHALL allow Agen Mitra users to view their personal sales performance.

#### Scenario: View sales summary

- **WHEN** Agen Mitra user opens sales screen
- **THEN** the app SHALL display cached sales data with key metrics
