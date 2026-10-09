# How Seasonal Order Lab was built

The opening request was a limited product launch: choose quantity before demand is known; explore demand, price, landed cost, clearance recovery, contribution distribution, downside and missed sales in a reproducible classroom run.

[The original planning record](PLANNING-CONVERSATION.md) is explicitly simulated. It established a conditioned normal demand model, independent uncertain costs and a conservative loss screen. [The current plan](PLAN.md) gives all units, equations, boundaries and acceptance cases. [Decisions](DECISIONS.md) distinguish that original record from the user-authorized revision.

The first version compared three orders. The 2026-10-09 revision restores the full quantity lesson: exact expected contribution across all 1–5,000 integers, the critical-ratio benchmark, a binding 3% default risk limit and a histogram of the chosen order. It retains the seeded simulation, independent analytic checks, certainty preset and browser-only boundary. No empirical demand or student approval was invented.

Browser App Builder's Build, Evaluate, jStat, seedrandom and ECharts recipes guided the implementation; Campus Designer supplied public color/type/layout guidance. jStat supplies distribution math, seedrandom reproduces draws, ECharts draws local charts. Licensed EB Garamond/Open Sans are bundled. No remote runtime data or backend is used.

[Evaluation](EVALUATION.md) retains earlier and revised results, failed rounds and exact tested commits. [Independent review](REVIEW.md) and [deployment](DEPLOYMENT.md) distinguish reviewed code from what is live. A successful build alone is not numerical or visual evidence.
