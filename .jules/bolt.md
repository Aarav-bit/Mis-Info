## 2024-07-01 - Optimize Dashboard Stats\n**Learning:** In React apps, repeated array iterations (.filter/.map) over the same data on every render loop (e.g. HistoryPage stats) can be easily collapsed into single O(n) passes wrapped in useMemo to prevent sluggish search/input interactions.\n**Action:** Look for multiple .filter() calls on the same array in component bodies, convert to single loops inside useMemo.

## 2024-05-18 - Route-level code splitting
**Learning:** The initial Vite bundle was >1MB because all pages (including Recharts dependencies in AnalyticsPage) were loaded synchronously in `App.tsx`.
**Action:** Used `React.lazy` and `Suspense` for route-level code splitting. Wrapped each individual route in `<Suspense>` to avoid layout thrashing when navigating. This successfully split `AnalyticsPage` into its own chunk, cutting the main bundle size in half.

## 2026-08-06 - Optimal Jaccard Similarity Set Operations
**Learning:** Naive JavaScript `Set` operations using `new Set([...setA].filter(x => setB.has(x)))` and `new Set([...setA, ...setB])` are highly inefficient ($O(N+M)$ memory and multiple passes) when executed repeatedly on large text token sets, causing noticeable garbage collection spikes. Using mathematical properties of sets ($|A \cup B| = |A| + |B| - |A \cap B|$) and iterating only the smaller set to find the intersection reduces this to $O(\min(N,M))$ time and $O(1)$ space.
**Action:** When calculating similarity metrics over Sets, avoid array spreading for unions/intersections; use size counters and iterative checks on the smaller dataset instead.
