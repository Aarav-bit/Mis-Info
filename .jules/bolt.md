## 2024-07-01 - Optimize Dashboard Stats\n**Learning:** In React apps, repeated array iterations (.filter/.map) over the same data on every render loop (e.g. HistoryPage stats) can be easily collapsed into single O(n) passes wrapped in useMemo to prevent sluggish search/input interactions.\n**Action:** Look for multiple .filter() calls on the same array in component bodies, convert to single loops inside useMemo.

## 2024-05-18 - Route-level code splitting
**Learning:** The initial Vite bundle was >1MB because all pages (including Recharts dependencies in AnalyticsPage) were loaded synchronously in `App.tsx`.
**Action:** Used `React.lazy` and `Suspense` for route-level code splitting. Wrapped each individual route in `<Suspense>` to avoid layout thrashing when navigating. This successfully split `AnalyticsPage` into its own chunk, cutting the main bundle size in half.
## 2026-07-15 - Array Partitioning with useMemo
**Learning:** In React components that partition data arrays (e.g. into supporting/contradicting arrays using multiple `.filter()` calls), combining the partitioning into a single `for...of` pass and wrapping it in `useMemo` saves redundant O(n) loops. Furthermore, adding the proper React imports (`useMemo`) is critical when memoizing values, to prevent ReferenceErrors at runtime.
**Action:** When replacing `.filter()` with single loops inside components, always import and use `useMemo` properly from 'react', to give downstream components referential equality.
