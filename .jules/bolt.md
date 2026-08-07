## 2024-07-01 - Optimize Dashboard Stats\n**Learning:** In React apps, repeated array iterations (.filter/.map) over the same data on every render loop (e.g. HistoryPage stats) can be easily collapsed into single O(n) passes wrapped in useMemo to prevent sluggish search/input interactions.\n**Action:** Look for multiple .filter() calls on the same array in component bodies, convert to single loops inside useMemo.

## 2024-05-18 - Route-level code splitting
**Learning:** The initial Vite bundle was >1MB because all pages (including Recharts dependencies in AnalyticsPage) were loaded synchronously in `App.tsx`.
**Action:** Used `React.lazy` and `Suspense` for route-level code splitting. Wrapped each individual route in `<Suspense>` to avoid layout thrashing when navigating. This successfully split `AnalyticsPage` into its own chunk, cutting the main bundle size in half.
## 2024-08-07 - [Precomputed Maps for Static Datasets]
**Learning:** Found that the application was constructing a Map inside hot paths (e.g., simulating verifications or rule matching fallbacks) from a static `RULE_DATABASE`. In applications with static configuration objects that need fast lookups, repetitive transformation to Maps causes measurable CPU and garbage collection overhead.
**Action:** Precompute Maps from static datasets at module load time rather than dynamically during function execution to eliminate O(N) conversion costs per call.
