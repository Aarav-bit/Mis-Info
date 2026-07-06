## 2024-07-01 - Optimize Dashboard Stats\n**Learning:** In React apps, repeated array iterations (.filter/.map) over the same data on every render loop (e.g. HistoryPage stats) can be easily collapsed into single O(n) passes wrapped in useMemo to prevent sluggish search/input interactions.\n**Action:** Look for multiple .filter() calls on the same array in component bodies, convert to single loops inside useMemo.

## 2024-05-18 - Route-level code splitting
**Learning:** The initial Vite bundle was >1MB because all pages (including Recharts dependencies in AnalyticsPage) were loaded synchronously in `App.tsx`.
**Action:** Used `React.lazy` and `Suspense` for route-level code splitting. Wrapped each individual route in `<Suspense>` to avoid layout thrashing when navigating. This successfully split `AnalyticsPage` into its own chunk, cutting the main bundle size in half.
## 2026-07-06 - [Prevented Global Re-renders on setInterval State]
**Learning:** React component state causing high frequency updates (e.g., `setInterval` for mock logging) at the top of a deeply nested tree causes global re-renders.
**Action:** Extract the interval logic to its own leaf-node component. To maintain top-down messaging control without lifting state, combine `forwardRef` and `useImperativeHandle` on the isolated component to expose an `addLog()` trigger directly to the parent, keeping the rest of the application stable.
