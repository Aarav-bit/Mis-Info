## 2024-07-01 - Optimize Dashboard Stats\n**Learning:** In React apps, repeated array iterations (.filter/.map) over the same data on every render loop (e.g. HistoryPage stats) can be easily collapsed into single O(n) passes wrapped in useMemo to prevent sluggish search/input interactions.\n**Action:** Look for multiple .filter() calls on the same array in component bodies, convert to single loops inside useMemo.

## 2024-05-18 - Route-level code splitting
**Learning:** The initial Vite bundle was >1MB because all pages (including Recharts dependencies in AnalyticsPage) were loaded synchronously in `App.tsx`.
**Action:** Used `React.lazy` and `Suspense` for route-level code splitting. Wrapped each individual route in `<Suspense>` to avoid layout thrashing when navigating. This successfully split `AnalyticsPage` into its own chunk, cutting the main bundle size in half.
## 2026-08-14 - Iterating Arrays During Verification API Workflows
**Learning:** The verification workflows in `factCheckApi.ts`, `evidenceRetrieval.ts`, and `VerificationContext.tsx` were making multiple passes (O(k*n)) over the `sources` array to calculate identical metrics (`supportingCount`, `contradictingCount`, `tier1Count`, etc) by repeatedly calling `.filter()`.
**Action:** Replace multiple `.filter().length` calls operating on the same array with a single `for...of` loop to compute all metrics simultaneously, reducing passes to O(n) and minimizing intermediate object creation, particularly on paths running concurrently via Promise.all.
