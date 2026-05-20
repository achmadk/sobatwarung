## ADDED Requirements

### Requirement: Join Group Buy Room

The system SHALL allow resellers to join a group buying room by specifying their desired quantity.

#### Scenario: User joins a room

- **WHEN** reseller clicks "Gabung" on an open room
- **THEN** the system SHALL display a quantity input dialog with the room's product and per-unit price

#### Scenario: User confirms participation

- **WHEN** reseller enters quantity and confirms
- **THEN** the system SHALL submit joinRoom API and show loading state

#### Scenario: Join succeeds

- **WHEN** joinRoom API returns success
- **THEN** the system SHALL show success toast: "Berhasil bergabung dengan group buy!" and update the room list

#### Scenario: Join fails due to room full

- **WHEN** user tries to join but room has reached target
- **THEN** the system SHALL display error: "Maaf, room sudah penuh"

#### Scenario: Join fails due to offline

- **WHEN** user tries to join while offline
- **THEN** the system SHALL queue the mutation and show toast: "Anda offline. Partisipasi akan disinkronkan saat terhubung."

### Requirement: First Group Buy Milestone

The system SHALL mark "first group buy" as complete when user successfully joins their first room.

#### Scenario: User completes first group buy

- **WHEN** user successfully joins their first group buying room
- **THEN** the system SHALL update onboardingProgress with firstGroupBuyCompleted: true

#### Scenario: User has already completed first group buy

- **WHEN** user views onboarding progress and firstGroupBuyCompleted is true
- **THEN** the system SHALL display checkmark on the group buy milestone
