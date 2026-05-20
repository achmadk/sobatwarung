## Context

The Join.tsx page currently offers 4 role options (Agen Utama, Agen Mitra, Reseller, Pemasok) but only the first two have registration pages (`/daftar-hub` → `RegisterHub.tsx`, `/daftar-member` → `RegisterMember.tsx`). Reseller and Pemasok cards link to `#` placeholders.

The existing registration forms are standalone UI pages with no backend integration — static forms with Tailwind-styled inputs and placeholder submit buttons. The new forms must follow the same pattern for consistency.

Routes are defined inline in `App.tsx` using `react-router-dom`. No centralized route config exists.

## Goals / Non-Goals

**Goals:**

- Create `RegisterReseller.tsx` with fields specific to reseller onboarding (name, WhatsApp, preferred agen area, product interest)
- Create `RegisterSupplier.tsx` with fields specific to supplier onboarding (business name, owner, WhatsApp, address, product category, description, product photos placeholder)
- Add routes `/daftar-reseller` and `/daftar-pemasok` to `App.tsx`
- Update Join.tsx card links from `#` to real paths
- Follow exact visual style and layout patterns from existing RegisterHub.tsx / RegisterMember.tsx

**Non-Goals:**

- No backend/API integration — forms submit to `#` on submit, matching current pattern
- No form validation logic beyond basic HTML5 `required` attributes
- No authentication or session management
- No changes to existing `/daftar-hub` or `/daftar-member` routes or pages
- No i18n or multi-language support

## Decisions

1. **Form fields per role** — Reseller form is simpler (individual, no shop) while Supplier form mirrors Hub fields (business info + address + product details). This matches each persona's real-world data needs.

2. **Terminology alignment** — Reseller page uses "Reseller Tetangga" heading and "Gabung sebagai Reseller" CTA to match Join.tsx terminology. Supplier page uses "Pemasok Lokal" heading and "Daftar sebagai Pemasok" CTA.

3. **Route paths use Indonesian** — `/daftar-reseller` and `/daftar-pemasok` follow the existing convention (`/daftar-hub`, `/daftar-member`).

4. **No shared form component** — Each form is a standalone page file, matching the existing pattern. A shared form abstraction is unnecessary for 4 simple forms and would be a premature refactor.

5. **Icons** — Reseller form uses `Smartphone` icon (from lucide-react, already used in Personas.tsx for Reseller). Supplier form reuses `PackageOpen` (from Join.tsx Supplier card). This maintains visual consistency.

## Risks / Trade-offs

- **[Low] Missing field duplication** — Each form duplicates input markup. If a future backend integration requires consistent field names, a shared form component refactor will be needed. Acceptable trade-off for now given the small number of forms.
- **[Low] Route name mismatch risk** — If the team later renames roles (e.g., "Reseller" to "Agen Ritel"), the route `/daftar-reseller` would need redirects. Mitigation: route names match current PRD v2.0 terminology.
- **[Low] No 404 guard** — If someone navigates directly to `/daftar-reseller` or `/daftar-pemasok` before the pages exist during development, they'll hit a 404. Mitigation: routes are added atomically with the page components in the same implementation phase.
