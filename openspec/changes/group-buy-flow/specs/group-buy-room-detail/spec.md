## ADDED Requirements

### Requirement: Room Detail View

The system SHALL display detailed information about a group buying room including participants and contribution status.

#### Scenario: User views room details

- **WHEN** user taps on a room from the list
- **THEN** the system SHALL navigate to room detail page showing: product info, target/current quantity, price per unit, deadline, participant count, and user's own contribution (if any)

#### Scenario: User sees room progress bar

- **WHEN** room detail is displayed
- **THEN** the system SHALL show a progress bar indicating current quantity vs target quantity

#### Scenario: User sees participant list

- **WHEN** room detail is displayed
- **THEN** the system SHALL list participants with their individual contributions

#### Scenario: User sees own contribution highlighted

- **WHEN** user has joined the room
- **THEN** the system SHALL highlight the user's own entry in the participant list

### Requirement: Room Checkout Flow

The system SHALL allow Agen Utama to initiate checkout when target is met.

#### Scenario: Agen Utama triggers checkout

- **WHEN** Agen Utama clicks "Checkout" and room has met target
- **THEN** the system SHALL call checkoutRoom API and show confirmation dialog

#### Scenario: Checkout requires target met

- **WHEN** Agen Utama clicks "Checkout" but target not met
- **THEN** the system SHALL disable the button and show: "Target belum tercapai"

#### Scenario: Checkout succeeds

- **WHEN** checkoutRoom API returns success
- **THEN** the system SHALL show success toast and update room status to "checkout_complete"
