## 2024-07-01 - Optimize Dashboard Stats\n**Learning:** In React apps, repeated array iterations (.filter/.map) over the same data on every render loop (e.g. HistoryPage stats) can be easily collapsed into single O(n) passes wrapped in useMemo to prevent sluggish search/input interactions.\n**Action:** Look for multiple .filter() calls on the same array in component bodies, convert to single loops inside useMemo.

## 2024-05-18 - Route-level code splitting
**Learning:** The initial Vite bundle was >1MB because all pages (including Recharts dependencies in AnalyticsPage) were loaded synchronously in `App.tsx`.
**Action:** Used `React.lazy` and `Suspense` for route-level code splitting. Wrapped each individual route in `<Suspense>` to avoid layout thrashing when navigating. This successfully split `AnalyticsPage` into its own chunk, cutting the main bundle size in half.
## 2026-08-16 - Math tricks for Array/Set union performance
**Learning:** In heavily utilized data pipeline logic (like evidence and knowledge retrieval text matching), creating new Sets from array spread operations to calculate unions (`new Set([...a, ...b]).size`) is extremely expensive and causes heavy garbage collection. Mathematical inclusion-exclusion `(sizeA + sizeB - intersection)` avoids all intermediate allocations.
**Action:** Always look for mathematical set operations (Union, Intersection) that can be solved by iterating over the `min()` size of the sets without creating intermediate arrays.
