## 2024-06-18 - Set Similarity in Hot Loops
**Learning:** Found multiple instances of `jaccard` similarity manually spreading Sets into arrays (`[...a].filter()`) and creating entirely new Sets for unions (`new Set([...a, ...b])`). In an evidence retrieval engine doing heavy string tokenization, this causes massive GC churn.
**Action:** Always check `Set` operations in NLP/text processing. Replace allocation-heavy union logic with mathematical `union = a.size + b.size - intersection` and iterate over the smaller set.
## 2023-10-27 - Hoisting Loop-Invariant Computations
**Learning:** In text processing pipelines (like `keywordScorer.ts`), regex operations inside iterations (e.g., inside `.some()`) are a hidden source of O(N*M) CPU overhead.
**Action:** Always scan iteration bodies for computations that only depend on variables from outer loops, and hoist them out to reduce redundant execution.
