## ADDED Requirements

### Requirement: Group Buy Rooms List

The system SHALL display a list of available group buying rooms that the user can join.

#### Scenario: User views available rooms

- **WHEN** user navigates to the group buy section
- **THEN** the system SHALL display a list of rooms with: room name, product name, target quantity, current quantity, price per unit, and status

#### Scenario: User sees empty room list

- **WHEN** user navigates to group buy section and no rooms are available
- **THEN** the system SHALL display a message: "Belum ada group buy tersedia. Jadilah yang pertama membuat!"

#### Scenario: User sees room with available slots

- **WHEN** a room is displayed and has remaining capacity
- **THEN** the system SHALL show a "Gabung" button enabled

#### Scenario: User sees full room

- **WHEN** a room's current quantity meets or exceeds target
- **THEN** the system SHALL show "Penuh" badge and disable the join button

#### Scenario: User refreshes room list

- **WHEN** user pulls down on the room list
- **THEN** the system SHALL fetch latest room data from the API and update the display

### Requirement: Room Status Display

The system SHALL display the current status of each room.

#### Scenario: Room is open for participation

- **WHEN** room status is "open"
- **THEN** the system SHALL display: "Terbuka" badge in green

#### Scenario: Room has reached target

- **WHEN** room current quantity meets or exceeds target quantity
- **THEN** the system SHALL display: "Target Tercapai" badge in blue

#### Scenario: Room is locked for checkout

- **WHEN** room status is "locked"
- **THEN** the system SHALL display: "Dikunci" badge in orange and disable join

#### Scenario: Room has expired

- **WHEN** room deadline has passed and target not met
- **THEN** the system SHALL display: "Kedaluwarsa" badge in gray and disable join
