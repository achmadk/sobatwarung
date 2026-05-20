## Requirements

### Requirement: Auto-scroll to section on hash navigation

When a user navigates to the Home page (`/`) with a URL hash (e.g., `/#fitur` or `/#ekosistem`), the system SHALL automatically scroll to the DOM element matching that hash ID.

The scrolling SHALL be smooth and account for the sticky navbar height so the section heading is visible.

#### Scenario: Navigate from another page to /#fitur

- **WHEN** user is on `/cara-kerja` and clicks "Fitur" link (navigates to `/#fitur`)
- **THEN** the system navigates to `/` and scrolls smoothly to the element with `id="fitur"` with an offset for the sticky navbar

#### Scenario: Navigate from another page to /#ekosistem

- **WHEN** user is on `/cara-kerja` and clicks "Ekosistem" link (navigates to `/#ekosistem`)
- **THEN** the system navigates to `/` and scrolls smoothly to the element with `id="ekosistem"` with an offset for the sticky navbar

#### Scenario: Navigate from Home page to /#fitur (same-page)

- **WHEN** user is already on the Home page and clicks "Fitur" link
- **THEN** the system scrolls smoothly to the element with `id="fitur"` with an offset for the sticky navbar

#### Scenario: Hash element does not exist

- **WHEN** user navigates to `/#nonexistent` and no element matches that ID
- **THEN** the system navigates to `/` normally without scrolling and without throwing an error

### Requirement: Section offset for sticky navbar

The target sections SHALL have a scroll-margin-top CSS value sufficient to prevent the sticky navbar from obscuring the section heading after scroll.

#### Scenario: Section visible after scroll

- **WHEN** the system scrolls to `#fitur` or `#ekosistem`
- **THEN** the section heading is fully visible below the sticky navbar (not obscured)

### Requirement: Hash link in Navbar navigates correctly from any page

Navbar links using hash anchors SHALL navigate to the Home page and trigger scroll to the target section, regardless of which page the user is currently on.

#### Scenario: Click Fitur from non-home page

- **WHEN** user is on any non-home page (e.g., `/bergabung`, `/cara-kerja`, `/daftar-hub`)
- **WHEN** user clicks "Fitur" in Navbar
- **THEN** the system navigates to `/` and scrolls to `#fitur`

#### Scenario: Click Ekosistem from non-home page

- **WHEN** user is on any non-home page
- **WHEN** user clicks "Ekosistem" in Navbar
- **THEN** the system navigates to `/` and scrolls to `#ekosistem`
