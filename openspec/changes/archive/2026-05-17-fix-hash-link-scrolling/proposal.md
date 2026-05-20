## Why

Navbar links `Fitur` (`/#fitur`) and `Ekosistem` (`/#ekosistem`) use hash fragments to scroll to sections on the Home page. When a user is on a non-home page (e.g., `/cara-kerja`) and clicks these links, React Router navigates to `/` but does NOT auto-scroll to the target section — the section ID is ignored because React Router's `<Link>` component does not natively handle hash-based scroll behavior in SPAs. Users land at the top of the page instead of the intended section, creating a broken navigation experience.

## What Changes

- Create a reusable `HashLink` component that intercepts hash-based links, navigates to the target route, then scrolls to the element matching the hash after render
- Create a `useHashScroll` hook that any page can use to check for a hash on mount and scroll to the matching element
- Replace `/#fitur` and `/#ekosistem` links in `Navbar.tsx` — also in `Footer.tsx` links using hash anchors (`/#fitur`, `/#ekosistem`)
- Remove the `Link` hash anchor navigation — use programmatic scroll-to-element via `document.getElementById()` + `element.scrollIntoView()`
- No breaking changes — all existing routes and page content remain untouched

## Capabilities

### New Capabilities

- `hash-link-navigation`: Reusable mechanism for navigating to a route and auto-scrolling to a section by hash ID, works from any page

### Modified Capabilities

- _(none — no existing specs in openspec/specs/ related to navigation)_

## Impact

- **New file**: `src/components/HashLink.tsx` (custom component wrapping React Router Link with hash scroll logic)
- **New file**: `src/hooks/useHashScroll.ts` (hook to auto-scroll on page mount when URL contains a hash)
- **Modified file**: `src/components/Navbar.tsx` (replace `/#fitur`, `/#ekosistem` with `HashLink` or add scroll-on-mount behavior)
- **Modified file**: `src/components/Footer.tsx` (same fix for any hash anchor links)
- **Dependencies**: No new npm packages — uses built-in React Router hooks (`useLocation`, `useNavigate`) and native DOM APIs (`scrollIntoView`, `getElementById`)
