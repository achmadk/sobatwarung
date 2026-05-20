## ADDED Requirements

### Requirement: Channel Detection

The system SHALL capture the acquisition channel from URL parameters during registration.

#### Scenario: User arrives via WhatsApp link

- **WHEN** user clicks a WhatsApp-shared link containing `?from=wa`
- **THEN** the system SHALL store `channel: "wa"` in the session
- **AND** pass this to the registration flow

#### Scenario: User arrives via referral link

- **WHEN** user clicks a referral link containing `?from=referral&code=XXX`
- **THEN** the system SHALL store `channel: "referral"` and `referralCode: "XXX"` in the session

#### Scenario: User arrives via direct/organic search

- **WHEN** user navigates directly without channel parameters
- **THEN** the system SHALL store `channel: "organic"` as default

### Requirement: Channel-Aware Onboarding Content

The system SHALL adapt onboarding content based on detected channel.

#### Scenario: WhatsApp channel user sees quick-start focus

- **WHEN** user registers with `channel: "wa"`
- **THEN** onboarding SHALL emphasize quick order creation and WhatsApp integration
- **AND** show: `"Mulai dengan memesan dari katalog - proses hanya 30 detik!"`

#### Scenario: Referral channel user sees social proof

- **WHEN** user registers with `channel: "referral"`
- **THEN** onboarding SHALL show: `"Agen [referrer_name] mengundang Anda ke SobatWarung"`
- **AND** highlight group buying benefits with community focus

#### Scenario: Organic channel user sees full feature overview

- **WHEN** user registers with `channel: "organic"`
- **THEN** onboarding SHALL provide complete feature tour
- **AND** explain offline-first and data sovereignty benefits

### Requirement: Registration Progress Indicator

The system SHALL show multi-step progress during registration.

#### Scenario: User starts registration

- **WHEN** user begins the registration process
- **THEN** the UI SHALL show step indicator: `"Langkah 1 dari 3: Data Diri"`

#### Scenario: User completes verification step

- **WHEN** user completes WhatsApp verification
- **THEN** the UI SHALL update to `"Langkah 2 dari 3: Verifikasi WhatsApp"` with checkmark on step 1

#### Scenario: User completes registration

- **WHEN** user finishes all registration steps
- **THEN** the UI SHALL show success state and transition to dashboard

### Requirement: Role-Based Registration Fields

The system SHALL adapt registration form based on selected role.

#### Scenario: User selects "Reseller" role

- **WHEN** user selects Reseller role
- **THEN** the form SHALL show fields: nama, nomor WhatsApp, alamat
- **AND** skip fields not applicable to Reseller (e.g., nama toko, NPWP)

#### Scenario: User selects "Agen Utama" role

- **WHEN** user selects Agen Utama role
- **THEN** the form SHALL show additional fields: nama toko, alamat lengkap, NPWP
