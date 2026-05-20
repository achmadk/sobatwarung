## Context

Navbar links `Fitur` (`/#fitur`) and `Ekosistem` (`/#ekosistem`) use React Router `<Link to="/#fitur">` and `<Link to="/#ekosistem">`. React Router's `<Link>` component navigates to the path (`/`) but does NOT trigger native hash-based scrolling — the browser only does that on full page loads, not SPA route transitions. As a result, when a user is on `/cara-kerja` (or any non-home page) and clicks these links, they land at the top of the Home page instead of scrolling to the Features or KeagenanHierarchy section.

The sections exist on the Home page with correct `id` attributes (`id="fitur"` in Features.tsx, `id="ekosistem"` in KeagenanHierarchy.tsx). The issue is purely in the navigation mechanism.

## Goals / Non-Goals

**Goals:**

- Clicking "Fitur" from any page navigates to `/` then scrolls to the `#fitur` element
- Clicking "Ekosistem" from any page navigates to `/` then scrolls to the `#ekosistem` element
- Same fix applied to any hash anchor links in Footer.tsx
- Work with `react-router-dom` without adding external dependencies
- Handle the case where the hash element doesn't exist (graceful fallback, no crash)

**Non-Goals:**

- No changes to page content or section structure
- No changes to existing routes
- No changes to how internal page scrolling works (e.g., within the same page)
- No keyboard/screen reader changes beyond fixing navigation behavior
- No changes to the non-hash Navbar links (Cara Kerja, Bergabung)

## Decisions

1. **`useHashScroll` hook approach** — A custom hook in `src/hooks/useHashScroll.ts` that reads `window.location.hash` on mount and scrolls to the matching element. The Home page component uses this hook. When a hash link is clicked from another page, React Router navigates to `/` (remounting Home), and the hook detects the hash + scrolls. This is simpler than a custom `HashLink` component because it keeps scroll logic separate from the link rendering.

2. **`smooth` scroll behavior** — Use `element.scrollIntoView({ behavior: 'smooth' })` with an offset to account for the sticky navbar (`scroll-margin-top` on the target sections or a manual offset). The existing sections already use `<section>` tags; adding `scroll-mt-20` (or inline style offset) ensures scrolling stops above the section to account for the fixed navbar.

3. **Section offset via CSS** — Add `scroll-mt-20` Tailwind class to the target `<section>` elements (`#fitur` in Features, `#ekosistem` in KeagenanHierarchy). This is simpler than JavaScript offset calculation and is the standard modern CSS approach.

4. **No custom HashLink component** — A hook-only solution is sufficient. The `<Link to="/#fitur">` stays as-is because React Router handles route navigation correctly; only the scroll-on-mount behavior is missing. Adding a custom component would introduce unnecessary complexity.

5. **Footer links** — Footer.tsx links to `/#fitur` and `/#ekosistem` use the same pattern. They'll benefit from the same fix automatically since they also navigate to `/` with a hash.

## Risks / Trade-offs

- **[Low] Race condition with DOM rendering** — If the hook runs before the target section renders (unlikely since Home renders all sections synchronously), the scroll would fail silently. Mitigation: use `requestAnimationFrame` or a small `setTimeout(0)` delay before querying the element.
- **[Low] Hash present on direct URL entry** — If a user bookmarks `/#fitur` and enters it directly, the page loads fresh and the browser handles hash scrolling natively. Our hook wouldn't interfere because the native behavior handles this case. The hook only applies to SPA route transitions.
- **[Low] Scroll-margin-top collision** — If navbar height changes (e.g., responsive breakpoint), the offset might be too large or small. Mitigation: use a generous `scroll-mt-24` (96px) which covers the ~64px navbar plus padding. If navbar height changes significantly, this class can be updated in one place.
