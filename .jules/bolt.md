## 2024-07-01 - Optimize Dashboard Stats\n**Learning:** In React apps, repeated array iterations (.filter/.map) over the same data on every render loop (e.g. HistoryPage stats) can be easily collapsed into single O(n) passes wrapped in useMemo to prevent sluggish search/input interactions.\n**Action:** Look for multiple .filter() calls on the same array in component bodies, convert to single loops inside useMemo.

## 2024-05-18 - Route-level code splitting
**Learning:** The initial Vite bundle was >1MB because all pages (including Recharts dependencies in AnalyticsPage) were loaded synchronously in `App.tsx`.
**Action:** Used `React.lazy` and `Suspense` for route-level code splitting. Wrapped each individual route in `<Suspense>` to avoid layout thrashing when navigating. This successfully split `AnalyticsPage` into its own chunk, cutting the main bundle size in half.

## 2026-08-01 - Optimize Multiple Array Filters
**Learning:** Sequential `.filter().length` operations over identical arrays evaluate synchronously and allocate intermediate arrays in memory. Replacing them with a single `O(n)` loop using helper functions improves efficiency and lowers GC overhead.
**Action:** Replaced repetitive  logic used for tracking statistics with a shared  loop.

## 2026-08-01 - Optimize Multiple Array Filters
**Learning:** Sequential `.filter().length` operations over identical arrays evaluate synchronously and allocate intermediate arrays in memory. Replacing them with a single `O(n)` loop using helper functions improves efficiency and lowers GC overhead.
**Action:** Replaced repetitive filter logic used for tracking statistics with a shared loop.
