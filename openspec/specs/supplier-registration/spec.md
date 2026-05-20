## Requirements

### Requirement: Supplier registration form page

The system SHALL provide a `/daftar-pemasok` page at route `/daftar-pemasok` with a registration form for Pemasok Lokal (local producers, farmers, artisans who supply products to the warung network).

The page SHALL follow the same visual layout as `RegisterHub.tsx`: centered card layout, rounded corners, shadow, and the same input field styling (rounded-xl borders, focus ring on sobatGreen-500). The supplier form is more comprehensive and SHALL include business details matching the supplier persona.

#### Scenario: Supplier visits registration page

- **WHEN** user navigates to `/daftar-pemasok`
- **THEN** the system displays a registration page with a `PackageOpen` icon header, title "Daftar sebagai Pemasok Lokal", and subtitle "Pasok produk Anda langsung ke jaringan warung di sekitar Anda"

#### Scenario: Supplier form contains all required fields

- **WHEN** user views the supplier registration form
- **THEN** the form SHALL contain the following fields: Nama Usaha/Produk (text), Nama Pemilik (text), Nomor WhatsApp (tel), Alamat Lengkap (textarea), Kategori Produk (text, e.g. Sembako/Sayuran/Kerajinan), Deskripsi Produk (textarea, optional), and "Kirim Pengajuan" submit button

### Requirement: Navigate to other registration pages

The page SHALL provide navigation links consistent with the existing pattern.

#### Scenario: Login link shown on supplier page

- **WHEN** user views the supplier registration page
- **THEN** the form footer SHALL show "Sudah punya akun? Masuk di sini" with a `#` link, matching the pattern from `RegisterHub.tsx`

### Requirement: Submit button behavior

The form SHALL have a submit button that matches the existing pattern (placeholder behavior, no backend integration).

#### Scenario: Submit button present

- **WHEN** user views the supplier registration form
- **THEN** the form SHALL display a "Kirim Pengajuan" button with `bg-sobatGreen-600` styling, matching the pattern from `RegisterHub.tsx`
