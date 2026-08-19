## 2024-07-01 - Optimize Dashboard Stats\n**Learning:** In React apps, repeated array iterations (.filter/.map) over the same data on every render loop (e.g. HistoryPage stats) can be easily collapsed into single O(n) passes wrapped in useMemo to prevent sluggish search/input interactions.\n**Action:** Look for multiple .filter() calls on the same array in component bodies, convert to single loops inside useMemo.

## 2024-05-18 - Route-level code splitting
**Learning:** The initial Vite bundle was >1MB because all pages (including Recharts dependencies in AnalyticsPage) were loaded synchronously in `App.tsx`.
**Action:** Used `React.lazy` and `Suspense` for route-level code splitting. Wrapped each individual route in `<Suspense>` to avoid layout thrashing when navigating. This successfully split `AnalyticsPage` into its own chunk, cutting the main bundle size in half.
## 2024-08-19 - [Hoisted Regex Calculations in Array Loops]
**Learning:** In `src/lib/keywordScorer.ts`, the `.replace()` string modifications were being unnecessarily computed inside a `.some()` loop array callback. This caused redundant regex evaluations for every token.
**Action:** Always check if constant expressions (especially regex string modifications) inside loop callbacks can be hoisted outside the loop to improve performance (turning O(N*M) constant calculations to O(1) per outer loop iteration).
