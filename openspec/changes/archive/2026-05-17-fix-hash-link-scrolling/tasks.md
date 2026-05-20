## 1. Create useHashScroll Hook

- [x] 1.1 Create `src/hooks/useHashScroll.ts` that reads `window.location.hash` on mount and scrolls to the matching element
- [x] 1.2 Add `requestAnimationFrame` or short `setTimeout` delay to ensure DOM is rendered before querying
- [x] 1.3 Handle missing hash element gracefully (no-op, no error thrown)

## 2. Add Section Offsets

- [x] 2.1 Add `scroll-mt-24` class to `<section id="fitur">` in `src/components/Features.tsx`
- [x] 2.2 Add `scroll-mt-24` class to `<section id="ekosistem">` in `src/components/KeagenanHierarchy.tsx`

## 3. Apply Hook to Home Page

- [x] 3.1 Import and call `useHashScroll()` in `src/pages/Home.tsx` to trigger scroll on mount when hash is present in URL

## 4. Validate

- [x] 4.1 Run `vp check` to verify formatting, linting, and type checking pass
- [x] 4.2 Run `vp build` to verify production build succeeds
