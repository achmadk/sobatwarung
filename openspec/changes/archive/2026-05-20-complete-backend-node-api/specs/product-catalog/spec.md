## ADDED Requirements

### Requirement: Product creation by Pemasok

The system SHALL allow Pemasok users to create and manage product listings.

#### Scenario: Pemasok creates a product
- **WHEN** an authenticated Pemasok submits POST `/api/v1/products` with name, category, price, unit, description, and images
- **THEN** the system SHALL create a Product linked to the supplier and return product details

#### Scenario: Non-Pemasok cannot create product
- **WHEN** an authenticated user with role other than PEMASOK submits POST `/api/v1/products`
- **THEN** the system SHALL return 403 Forbidden with error code `ROLE_NOT_ALLOWED`

#### Scenario: Product creation validates required fields
- **WHEN** a Pemasok submits product creation with missing name, category, price, or unit
- **THEN** the system SHALL return 400 Bad Request with validation error

### Requirement: Product listing and retrieval

The system SHALL provide product browsing capabilities.

#### Scenario: List products by category
- **WHEN** an authenticated user submits GET `/api/v1/products?category=<category>`
- **THEN** the system SHALL return products in that category, ordered by creation date

#### Scenario: List products by supplier
- **WHEN** an authenticated user submits GET `/api/v1/products?supplierId=<id>`
- **THEN** the system SHALL return products from that supplier

#### Scenario: Get single product details
- **WHEN** an authenticated user submits GET `/api/v1/products/:id`
- **THEN** the system SHALL return full product details

#### Scenario: Public product listing for Etalase
- **WHEN** a request is made to GET `/api/v1/products?hubId=<hubId>&public=true`
- **THEN** the system SHALL return public product info (name, price, images, category) for the hub's suppliers

### Requirement: Product updates by owner

The system SHALL allow suppliers to update their own products.

#### Scenario: Supplier updates own product
- **WHEN** an authenticated Pemasok submits PUT `/api/v1/products/:id` with updated fields
- **THEN** the system SHALL update the product and return updated details

#### Scenario: Non-owner cannot update product
- **WHEN** an authenticated user submits PUT `/api/v1/products/:id` where product belongs to different supplier
- **THEN** the system SHALL return 403 Forbidden with error code `ACCESS_DENIED`

### Requirement: Product deactivation

The system SHALL allow suppliers to deactivate products without deleting them.

#### Scenario: Supplier deactivates product
- **WHEN** an authenticated Pemasok submits DELETE `/api/v1/products/:id`
- **THEN** the system SHALL set product's isActive to false (soft delete)

#### Scenario: Deactivated products not listed in catalog
- **WHEN** a user submits GET `/api/v1/products` without admin flag
- **THEN** the system SHALL exclude products where isActive is false
