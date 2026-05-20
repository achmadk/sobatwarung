## ADDED Requirements

### Requirement: Reseller registration form page

The system SHALL provide a `/daftar-reseller` page at route `/daftar-reseller` with a registration form for Reseller Tetangga (individuals without a physical shop who sell via WhatsApp).

The page SHALL follow the same visual layout as `RegisterHub.tsx`: centered card layout, rounded corners, shadow, and the same input field styling (rounded-xl borders, focus ring on sobatGreen-500).

#### Scenario: Reseller visits registration page

- **WHEN** user navigates to `/daftar-reseller`
- **THEN** the system displays a registration page with a `Smartphone` icon header, title "Gabung sebagai Reseller Tetangga", and subtitle "Mulai jualan tanpa toko fisik — cukup modal smartphone"

#### Scenario: Reseller form contains all required fields

- **WHEN** user views the reseller registration form
- **THEN** the form SHALL contain the following fields: Nama Lengkap (text), Nomor WhatsApp (tel), Domisili / Area Operasi (text), Produk yang Ingin Dijual (text/select), and preferred Agen Terdekat (text, optional)

### Requirement: Navigate to other registration pages

The page SHALL provide navigation links consistent with the existing pattern — a "Sudah punya akun?" login link at the bottom.

#### Scenario: Login link shown on reseller page

- **WHEN** user views the reseller registration page
- **THEN** the form footer SHALL show "Butuh bantuan pendaftaran? Hubungi CS" with a `#` link, matching the pattern from `RegisterMember.tsx`

### Requirement: Submit button behavior

The form SHALL have a submit button that matches the existing pattern (placeholder behavior, no backend integration).

#### Scenario: Submit button present

- **WHEN** user views the reseller registration form
- **THEN** the form SHALL display a "Daftar Sekarang" button with `bg-sobatGreen-600` styling, matching the existing pattern
