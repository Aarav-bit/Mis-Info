## 2024-07-01 - Optimize Dashboard Stats\n**Learning:** In React apps, repeated array iterations (.filter/.map) over the same data on every render loop (e.g. HistoryPage stats) can be easily collapsed into single O(n) passes wrapped in useMemo to prevent sluggish search/input interactions.\n**Action:** Look for multiple .filter() calls on the same array in component bodies, convert to single loops inside useMemo.

## 2024-05-18 - Route-level code splitting
**Learning:** The initial Vite bundle was >1MB because all pages (including Recharts dependencies in AnalyticsPage) were loaded synchronously in `App.tsx`.
**Action:** Used `React.lazy` and `Suspense` for route-level code splitting. Wrapped each individual route in `<Suspense>` to avoid layout thrashing when navigating. This successfully split `AnalyticsPage` into its own chunk, cutting the main bundle size in half.

## 2025-02-12 - WeakMap Caching for React List Filtering
**Learning:** Calling `.toLowerCase()` (or other string manipulations) on object properties inside a large `.filter()` loop on every keystroke causes heavy memory allocation and garbage collection pauses.
**Action:** Use a module-level `WeakMap` to cache the manipulated strings keyed by the object reference itself. This shifts the string operation cost from O(N) per render to O(1) after the initial cache population, drastically improving text input responsiveness in search fields.
