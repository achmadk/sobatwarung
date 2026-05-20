## ADDED Requirements

### Requirement: Order creation

The system SHALL allow users to create orders for products or buying room checkouts.

#### Scenario: User creates direct order
- **WHEN** an authenticated user submits POST `/api/v1/orders` with items array and optional notes
- **THEN** the system SHALL create an Order with status DRAFT, calculate totalAmount, and return order details

#### Scenario: System creates order from room checkout
- **WHEN** an Agen Utama checks out a buying room
- **THEN** the system SHALL automatically create an Order with items from all participants' contributions

#### Scenario: Order creation requires valid items
- **WHEN** a user submits order with empty items array or invalid product IDs
- **THEN** the system SHALL return 400 Bad Request with validation error

### Requirement: Order status transitions

The system SHALL manage order lifecycle through defined states.

#### Scenario: User confirms order
- **WHEN** an authenticated user submits PUT `/api/v1/orders/:id/confirm`
- **THEN** the system SHALL set order status to CONFIRMED

#### Scenario: User marks order as paid
- **WHEN** an authenticated user submits PUT `/api/v1/orders/:id/pay`
- **THEN** the system SHALL set order status to PAID and record payment timestamp

#### Scenario: Supplier marks order as shipped
- **WHEN** an authenticated supplier submits PUT `/api/v1/orders/:id/ship` with tracking info
- **THEN** the system SHALL set order status to SHIPPED and store tracking details

#### Scenario: User confirms delivery
- **WHEN** an authenticated user submits PUT `/api/v1/orders/:id/deliver`
- **THEN** the system SHALL set order status to DELIVERED

#### Scenario: User cancels order
- **WHEN** an authenticated user submits PUT `/api/v1/orders/:id/cancel`
- **THEN** the system SHALL set order status to CANCELLED if status is DRAFT or CONFIRMED

#### Scenario: Cannot cancel shipped or delivered order
- **WHEN** a user submits cancel for an order with status SHIPPED or DELIVERED
- **THEN** the system SHALL return 400 Bad Request with error code `CANNOT_CANCEL`

### Requirement: Listing and retrieving orders

The system SHALL provide order listing and detail retrieval.

#### Scenario: List user's orders
- **WHEN** an authenticated user submits GET `/api/v1/orders`
- **THEN** the system SHALL return orders belonging to the user, ordered by creation date descending

#### Scenario: Get order details
- **WHEN** an authenticated user submits GET `/api/v1/orders/:id`
- **THEN** the system SHALL return full order details including items and status history

#### Scenario: Cannot access other user's order
- **WHEN** an authenticated user submits GET `/api/v1/orders/:id` where order belongs to different user
- **THEN** the system SHALL return 403 Forbidden with error code `ACCESS_DENIED`

### Requirement: Real-time order status updates

The system SHALL broadcast order status changes via WebSocket.

#### Scenario: Order status change broadcasts order:status
- **WHEN** an order's status changes
- **THEN** the system SHALL emit `order:status` WebSocket event to the order owner
