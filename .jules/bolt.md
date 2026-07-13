## 2024-07-01 - Optimize Dashboard Stats\n**Learning:** In React apps, repeated array iterations (.filter/.map) over the same data on every render loop (e.g. HistoryPage stats) can be easily collapsed into single O(n) passes wrapped in useMemo to prevent sluggish search/input interactions.\n**Action:** Look for multiple .filter() calls on the same array in component bodies, convert to single loops inside useMemo.

## 2024-05-18 - Route-level code splitting
**Learning:** The initial Vite bundle was >1MB because all pages (including Recharts dependencies in AnalyticsPage) were loaded synchronously in `App.tsx`.
**Action:** Used `React.lazy` and `Suspense` for route-level code splitting. Wrapped each individual route in `<Suspense>` to avoid layout thrashing when navigating. This successfully split `AnalyticsPage` into its own chunk, cutting the main bundle size in half.

## 2024-05-18 - Render-loop O(N²) array filtering
**Learning:** Performing `filtered.filter(c => c.group === group)` inside a `.map` over groups is an O(N * G) operation during render. This pattern is common for grouped lists (like a Command Palette) and scales poorly if the list grows or typing triggers frequent re-renders.
**Action:** Extract grouping logic outside the render loop into a `useMemo` block that yields a `Record<string, Item[]>` (an O(N) operation), reducing the render complexity to just mapping the dictionary keys.
