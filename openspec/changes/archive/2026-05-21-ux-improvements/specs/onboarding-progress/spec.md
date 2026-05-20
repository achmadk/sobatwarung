## ADDED Requirements

### Requirement: Onboarding Progress Tracking

The system SHALL track user progress toward success milestones and display them in the dashboard.

#### Scenario: User completes first order

- **WHEN** user creates and confirms their first order
- **THEN** the system SHALL mark "first order" as complete in onboarding progress
- **AND** store the completion timestamp in IndexedDB

#### Scenario: User completes first group buy

- **WHEN** user joins or creates their first group buying room
- **THEN** the system SHALL mark "first group buy" as complete in onboarding progress
- **AND** store the completion timestamp in IndexedDB

#### Scenario: Progress shown in dashboard

- **WHEN** user views the reseller dashboard
- **THEN** the system SHALL display a progress indicator showing completed milestones (e.g., `🛒✓ | 🤝○`)

#### Scenario: All milestones completed

- **WHEN** user completes both first order AND first group buy
- **THEN** the system SHALL display a congratulations message: `"Selamat! Anda telah mengenal semua fitur utama."`

### Requirement: Progress Persistence

The system SHALL persist onboarding progress across sessions and devices.

#### Scenario: User returns after app restart

- **WHEN** user opens the app after closing it
- **THEN** the system SHALL restore previously completed milestones from IndexedDB

#### Scenario: Progress syncs when online

- **WHEN** user completes a milestone while offline
- **THEN** the milestone SHALL sync to the server when connectivity is restored

### Requirement: First Group Buy Discovery CTA

The system SHALL make group buying visible to users who haven't completed this milestone.

#### Scenario: User has not joined a group buy

- **WHEN** user views dashboard and has not completed "first group buy"
- **THEN** the dashboard SHALL show a CTA: `"Gabung Group Buy pertama Anda"` with clear value proposition

#### Scenario: User taps group buy CTA

- **WHEN** user taps the group buy CTA
- **THEN** the system SHALL navigate to available group buying rooms or create new room flow
