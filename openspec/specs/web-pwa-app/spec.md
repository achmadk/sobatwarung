## Requirements

### Requirement: PWA React TypeScript Web App

The system SHALL provide a Progressive Web App built with React and TypeScript, targeting Reseller, Pemasok, and end-consumers (Etalase Tetangga) with offline-capable catalog browsing and order placement.

#### Scenario: PWA is installable on home screen

- **WHEN** a user visits the web app on a mobile browser
- **THEN** the PWA SHALL trigger the browser's "Add to Home Screen" prompt with a valid manifest (icons, name, start_url, display: standalone)

#### Scenario: PWA serves cached content offline

- **WHEN** a user views the web app without network connectivity
- **THEN** the Service Worker (via Workbox) SHALL serve cached versions of the app shell, catalog pages, and previously loaded product images

### Requirement: Reseller Dashboard

The PWA SHALL provide a dedicated dashboard for Reseller users to manage their orders, view product catalogs, track sales via WhatsApp, and communicate with their Agen Mitra or Agen Utama.

#### Scenario: Reseller views order history

- **WHEN** a Reseller user navigates to their order history page
- **THEN** the PWA SHALL display a list of past orders with status, items, total cost, and delivery status — sourced from IndexedDB (offline) or API (online)

### Requirement: Etalase Tetangga (B2B2C Storefront)

The PWA SHALL generate lightweight, shareable storefront pages that end-consumers can access via WhatsApp links without authentication.

#### Scenario: Customer opens Etalase link from WhatsApp

- **WHEN** an end-consumer taps a WhatsApp link shared by a Reseller or Agen
- **THEN** the PWA SHALL display a product catalog page with pricing, availability, and a "Pesan via WhatsApp" button that pre-fills an order message

### Requirement: Pemasok Registration & Catalog Management

The PWA SHALL allow Pemasok (suppliers) to register their business, manage product listings, and view incoming orders from the agency network.

#### Scenario: Pemasok creates a product listing

- **WHEN** a registered Pemasok user submits a new product with name, category, price, unit, description, and images
- **THEN** the PWA SHALL save the listing locally and queue it for sync. Once synced, the product SHALL appear in the agency network's catalog.
