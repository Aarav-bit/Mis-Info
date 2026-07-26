## 2024-07-01 - Optimize Dashboard Stats\n**Learning:** In React apps, repeated array iterations (.filter/.map) over the same data on every render loop (e.g. HistoryPage stats) can be easily collapsed into single O(n) passes wrapped in useMemo to prevent sluggish search/input interactions.\n**Action:** Look for multiple .filter() calls on the same array in component bodies, convert to single loops inside useMemo.

## 2024-05-18 - Route-level code splitting
**Learning:** The initial Vite bundle was >1MB because all pages (including Recharts dependencies in AnalyticsPage) were loaded synchronously in `App.tsx`.
**Action:** Used `React.lazy` and `Suspense` for route-level code splitting. Wrapped each individual route in `<Suspense>` to avoid layout thrashing when navigating. This successfully split `AnalyticsPage` into its own chunk, cutting the main bundle size in half.

## 2026-07-26 - Prevent Parent Re-renders via Interval Polling
**Learning:** A `setInterval` in a heavy parent component (like a Dashboard page) that updates local state periodically will trigger complete re-renders of the component and all its children on every tick.
**Action:** Isolate polling intervals and their associated state into smaller, self-contained sub-components. If the parent still needs to communicate with the isolated component, use specific state (like an array of external events) passed as props instead of bringing the polling state up to the parent.
