## 2024-07-01 - Optimize Dashboard Stats\n**Learning:** In React apps, repeated array iterations (.filter/.map) over the same data on every render loop (e.g. HistoryPage stats) can be easily collapsed into single O(n) passes wrapped in useMemo to prevent sluggish search/input interactions.\n**Action:** Look for multiple .filter() calls on the same array in component bodies, convert to single loops inside useMemo.

## 2024-05-18 - Route-level code splitting
**Learning:** The initial Vite bundle was >1MB because all pages (including Recharts dependencies in AnalyticsPage) were loaded synchronously in `App.tsx`.
**Action:** Used `React.lazy` and `Suspense` for route-level code splitting. Wrapped each individual route in `<Suspense>` to avoid layout thrashing when navigating. This successfully split `AnalyticsPage` into its own chunk, cutting the main bundle size in half.

## 2026-07-28 - Optimize Global Keyword Rules Evaluation
**Learning:** In highly nested scoring logic (), recalculating derived metadata (like frequency maps or flat arrays) on each execution via  iteration creates unnecessary O(N) overhead. If the reference object (the rules map) is statically defined, caching these calculations transforms O(N) traversal into O(1) retrieval.
**Action:** Apply a  to cache derivation results keyed to object references (like the rule map) in functions invoked frequently across verification cycles.

## 2026-07-28 - Optimize Global Keyword Rules Evaluation
**Learning:** In highly nested scoring logic (`keywordScorer.ts`), recalculating derived metadata (like frequency maps or flat arrays) on each execution via `Map.values()` iteration creates unnecessary O(N) overhead. If the reference object (the rules map) is statically defined, caching these calculations transforms O(N) traversal into O(1) retrieval.
**Action:** Apply a `WeakMap` to cache derivation results keyed to object references (like the rule map) in functions invoked frequently across verification cycles.
