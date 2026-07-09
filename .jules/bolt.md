## 2024-07-01 - Optimize Dashboard Stats\n**Learning:** In React apps, repeated array iterations (.filter/.map) over the same data on every render loop (e.g. HistoryPage stats) can be easily collapsed into single O(n) passes wrapped in useMemo to prevent sluggish search/input interactions.\n**Action:** Look for multiple .filter() calls on the same array in component bodies, convert to single loops inside useMemo.

## 2024-05-18 - Route-level code splitting
**Learning:** The initial Vite bundle was >1MB because all pages (including Recharts dependencies in AnalyticsPage) were loaded synchronously in `App.tsx`.
**Action:** Used `React.lazy` and `Suspense` for route-level code splitting. Wrapped each individual route in `<Suspense>` to avoid layout thrashing when navigating. This successfully split `AnalyticsPage` into its own chunk, cutting the main bundle size in half.
## 2024-05-24 - Pre-computation of Keyword Rules Cache
**Learning:** Recreating a Map containing the keyword rules and recomputing the keyword frequency cache on every verification request was wasting CPU cycles in `VerificationContext.tsx` and `keywordScorer.ts`. Because the `RULE_DATABASE` is largely static, these O(R*K) operations don't need to happen on each request.
**Action:** Always verify if an object used for lookup or rule matching is static. If so, pre-compute and cache it at the module level (e.g., as a global constant `RULE_MAP`) or cache derived calculations based on object identity (e.g., using `WeakMap` in `findBestRuleMatch`) to ensure O(1) retrieval during runtime operations.
