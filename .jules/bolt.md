## 2024-06-18 - Set Similarity in Hot Loops
**Learning:** Found multiple instances of `jaccard` similarity manually spreading Sets into arrays (`[...a].filter()`) and creating entirely new Sets for unions (`new Set([...a, ...b])`). In an evidence retrieval engine doing heavy string tokenization, this causes massive GC churn.
**Action:** Always check `Set` operations in NLP/text processing. Replace allocation-heavy union logic with mathematical `union = a.size + b.size - intersection` and iterate over the smaller set.
