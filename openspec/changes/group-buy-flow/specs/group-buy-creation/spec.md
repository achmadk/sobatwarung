## ADDED Requirements

### Requirement: Create Group Buy Room

The system SHALL allow Agen Utama to create a new group buying room with product, target quantity, price ceiling, and deadline.

#### Scenario: Agen Utama starts room creation

- **WHEN** Agen Utama clicks "Buat Group Buy" button
- **THEN** the system SHALL show a multi-step form: Select Product → Set Terms → Confirm

#### Scenario: User selects product

- **WHEN** Agen Utama searches and selects a product from the catalog
- **THEN** the system SHALL display the selected product with its current retail price

#### Scenario: User sets room terms

- **WHEN** Agen Utama enters target quantity, max price per unit, and participation deadline
- **THEN** the system SHALL validate: target quantity > 0, max price > 0, deadline is in the future

#### Scenario: User confirms room creation

- **WHEN** Agen Utama reviews and confirms the room details
- **THEN** the system SHALL create the room via API and navigate to the room detail page

#### Scenario: Room creation fails

- **WHEN** room creation API returns an error
- **THEN** the system SHALL display an error toast with Indonesian message and allow retry

### Requirement: Room Creation Form Validation

The system SHALL validate room creation inputs before submission.

#### Scenario: Target quantity is zero or negative

- **WHEN** user enters target quantity <= 0
- **THEN** the system SHALL display: "Jumlah target harus lebih dari 0"

#### Scenario: Max price is zero or negative

- **WHEN** user enters max price <= 0
- **THEN** the system SHALL display: "Harga maksimal harus lebih dari 0"

#### Scenario: Deadline is in the past

- **WHEN** user enters a deadline that has already passed
- **THEN** the system SHALL display: "Batas waktu harus di masa depan"

#### Scenario: All fields are valid

- **WHEN** user has entered valid values for all fields
- **THEN** the system SHALL enable the "Buat Room" button
