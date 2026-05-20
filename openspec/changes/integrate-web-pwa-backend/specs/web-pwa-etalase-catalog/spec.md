## ADDED Requirements

### Requirement: Etalase page displays public product catalog

The system SHALL fetch and display products from the backend API for public access.

#### Scenario: Customer opens Etalase link
- **WHEN** customer visits /etalase/:agenId
- **THEN** the PWA SHALL call GET /api/v1/etalase/:agenId/products and display the product catalog

#### Scenario: Catalog displays products
- **WHEN** products are loaded
- **THEN** each product SHALL show name, price, category, and image if available

#### Scenario: No products available
- **WHEN** hub has no active products
- **THEN** the PWA SHALL display "Tidak ada produk tersedia" message

### Requirement: WhatsApp order button works

The system SHALL generate WhatsApp order messages via deep links.

#### Scenario: Customer clicks "Pesan via WhatsApp"
- **WHEN** customer clicks the WhatsApp order button on a product
- **THEN** the PWA SHALL open WhatsApp with pre-filled message: "Halo, saya ingin memesan:\n- {productName} x {quantity} = Rp{total}"

#### Scenario: Quantity selector
- **WHEN** customer views a product
- **THEN** the PWA SHALL show quantity input (default 1) that updates the total in the WhatsApp message

### Requirement: Etalase works offline with cached data

The system SHALL serve cached products when offline.

#### Scenario: Customer views catalog offline
- **WHEN** customer has previously visited the catalog and is now offline
- **THEN** the PWA SHALL display cached products from IndexedDB with a "Offline - data mungkin tidak terbaru" banner
