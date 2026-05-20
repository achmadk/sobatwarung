## ADDED Requirements

### Requirement: Pemasok portal displays supplier's products

The system SHALL fetch and display the supplier's products from the backend API.

#### Scenario: Pemasok opens portal
- **WHEN** authenticated Pemasok navigates to /pemasok
- **THEN** the PWA SHALL call GET /api/v1/products?supplierId=me, store products in IndexedDB, and display the product list

#### Scenario: Product list displays correctly
- **WHEN** products are loaded
- **THEN** each product SHALL show name, category, price, unit, and active status indicator

### Requirement: Pemasok can create products

The system SHALL allow Pemasok to add new products via the backend API.

#### Scenario: Pemasok creates product
- **WHEN** authenticated Pemasok submits new product form (name, category, price, unit, description, images)
- **THEN** the PWA SHALL call POST /api/v1/products, add to IndexedDB, and show success toast

#### Scenario: Create product offline
- **WHEN** Pemasok creates product while offline
- **THEN** the PWA SHALL store mutation in syncQueue and show "Akan disinkronkan saat online" message

### Requirement: Pemasok can update products

The system SHALL allow Pemasok to edit their products.

#### Scenario: Pemasok updates product
- **WHEN** authenticated Pemasok edits product and submits
- **THEN** the PWA SHALL call PUT /api/v1/products/:id and update IndexedDB

### Requirement: Pemasok can deactivate products

The system SHALL allow Pemasok to soft-delete (deactivate) their products.

#### Scenario: Pemasok deactivates product
- **WHEN** authenticated Pemasok taps delete on a product
- **THEN** the PWA SHALL call DELETE /api/v1/products/:id and update IndexedDB to mark inactive
