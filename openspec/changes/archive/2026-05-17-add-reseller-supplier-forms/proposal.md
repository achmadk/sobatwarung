## Why

Join.tsx currently lists "Gabung sebagai Reseller" and "Daftar sebagai Pemasok" as role options, but both link to `#` placeholders — no registration pages exist. Users who want to join as a Reseller (individual without a physical shop) or Supplier (local producers/artisans) have no way to sign up. Adding these forms completes the 4-role onboarding flow aligned with the PRD v2.0 keagenan framework and unblocks the full multi-tier registration funnel.

## What Changes

- Create two new registration pages: `RegisterReseller.tsx` and `RegisterSupplier.tsx`
- Add routes for `/daftar-reseller` and `/daftar-pemasok` in `App.tsx`
- Update `Join.tsx` to link Reseller card to `/daftar-reseller` and Pemasok card to `/daftar-pemasok`
- Each form follows the existing UI pattern (cart-style card, lucide-react icons, Tailwind styling) with role-specific fields:
  - **Reseller**: name, WhatsApp, preferred agen location, product interest
  - **Supplier**: business name, owner name, WhatsApp, address, product category, description
- No breaking changes — existing routes (`/daftar-hub`, `/daftar-member`) remain untouched

## Capabilities

### New Capabilities

- `reseller-registration`: Registration form for Reseller Tetangga (individual without physical shop, sells via WhatsApp)
- `supplier-registration`: Registration form for Pemasok/Supplier (local producers, farmers, artisans supplying to the warung network)

### Modified Capabilities

- _(none — no existing specs to modify)_

## Impact

- **New files**: `src/pages/RegisterReseller.tsx`, `src/pages/RegisterSupplier.tsx`
- **Modified files**: `src/App.tsx` (2 new routes), `src/pages/Join.tsx` (2 link targets updated from `#` to real paths)
- **Dependencies**: No new npm packages — only existing lucide-react and react-router-dom
