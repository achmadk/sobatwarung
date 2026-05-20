## ADDED Requirements

### Requirement: Sync Status Indicator

The system SHALL display a persistent status indicator showing the current sync state and pending mutation count.

#### Scenario: User is online and all data is synced

- **WHEN** the device has internet connectivity and all mutations are synced
- **THEN** the indicator SHALL show `🟢 Online | ✓ Tersinkronisasi`

#### Scenario: User is offline with pending mutations

- **WHEN** the device loses internet connectivity and has pending mutations
- **THEN** the indicator SHALL show `🟡 Offline | N menunggu` where N is the count of pending mutations

#### Scenario: User is online with pending mutations syncing

- **WHEN** the device has connectivity and sync is in progress
- **THEN** the indicator SHALL show `🔄 Menyinkronkan... | N tersisa`

#### Scenario: Sync completes successfully

- **WHEN** all pending mutations are successfully synced
- **THEN** the system SHALL display a brief success toast and update indicator to `✓ Tersinkronisasi`

#### Scenario: Sync fails with recoverable error

- **WHEN** sync fails due to network timeout but mutations remain in queue
- **THEN** the indicator SHALL show `🟡 Gagal menyinkronkan | Coba lagi` and the retry SHALL be automatic after backoff

### Requirement: Optimistic UI Updates

The system SHALL show changes immediately in the UI and indicate sync status asynchronously.

#### Scenario: User creates an order while online

- **WHEN** user submits a new order and the device is online
- **THEN** the order SHALL appear immediately in the list with a subtle `⟳` icon
- **AND** when sync completes, the icon SHALL change to `✓`

#### Scenario: User creates an order while offline

- **WHEN** user submits a new order and the device is offline
- **THEN** the order SHALL appear immediately with a `⏳` icon
- **AND** the indicator SHALL show incremented pending count

### Requirement: Toast Notifications for Async Operations

The system SHALL display non-blocking toast notifications for async operation results.

#### Scenario: Order successfully synced

- **WHEN** an offline order is synced successfully
- **THEN** the system SHALL display a toast: `"Pesanan berhasil disinkronkan"`

#### Scenario: Sync fails with error

- **WHEN** sync fails and the error is recoverable
- **THEN** the system SHALL display a toast: `"Sinkronisasi gagal. Akan dicoba lagi otomatis."`

#### Scenario: Multiple toasts queue

- **WHEN** multiple async operations complete in quick succession
- **THEN** the system SHALL queue toasts and display them sequentially with 3-second intervals
