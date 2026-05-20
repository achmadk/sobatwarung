## ADDED Requirements

### Requirement: Stock Agent

The system SHALL run a Stock Agent on-device that monitors inventory levels and generates alerts.

#### Scenario: Stock agent monitors inventory

- **WHEN** the app runs in background
- **THEN** the Stock Agent SHALL periodically check inventory levels against configured thresholds

#### Scenario: Low stock alert generated

- **WHEN** Stock Agent detects inventory below threshold
- **THEN** the app SHALL generate a local notification and add to sync queue for Agen Utama

### Requirement: Community Agent

The system SHALL run a Community Agent on-device that processes community-related events and notifications.

#### Scenario: Community agent processes group buying events

- **WHEN** a group buying room is created or updated in the hub
- **THEN** the Community Agent SHALL update local cache and trigger UI notification

#### Scenario: New member notification

- **WHEN** a new agent joins a group buying room
- **THEN** the Community Agent SHALL update the room participant list

### Requirement: Sales Agent

The system SHALL run a Sales Agent on-device that tracks sales performance and generates insights.

#### Scenario: Sales agent updates metrics

- **WHEN** orders are placed or updated
- **THEN** the Sales Agent SHALL recalculate sales metrics and update local cache

#### Scenario: Sales performance alert

- **WHEN** sales fall below target threshold
- **THEN** the Sales Agent SHALL generate an alert notification

### Requirement: Privacy Guard Agent

The system SHALL run a Privacy Guard Agent on-device that ensures data sovereignty and access control.

#### Scenario: Privacy guard validates access

- **WHEN** user attempts to view or modify data
- **THEN** the Privacy Guard Agent SHALL verify the user has appropriate permissions for that agent type

#### Scenario: Data isolation enforcement

- **WHEN** Agen Mitra attempts to access Agen Utama-only features
- **THEN** the Privacy Guard Agent SHALL deny access and log the attempt

### Requirement: Background Agent Scheduling

The system SHALL schedule agent execution using platform-specific background task schedulers.

#### Scenario: Android background scheduling

- **WHEN** the app runs on Android
- **THEN** the system SHALL use WorkManager with constraints (network type, battery) to schedule agent tasks

#### Scenario: iOS background scheduling

- **WHEN** the app runs on iOS
- **THEN** the system SHALL use BGTaskScheduler to schedule agent tasks during app refresh periods
