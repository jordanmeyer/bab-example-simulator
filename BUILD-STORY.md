# How Seasonal Order Lab was built

The opening request was a limited product launch: choose quantity before demand is known; explore demand, price, landed cost, clearance recovery, contribution distribution, downside and missed sales in a reproducible classroom run.

[The original planning record](PLANNING-CONVERSATION.md) is explicitly simulated. It established a conditioned normal demand model, independent uncertain costs and a conservative loss screen. [The current plan](PLAN.md) gives all units, equations, boundaries and acceptance cases. [Decisions](DECISIONS.md) distinguish that original record from the user-authorized revision.

The first version compared three orders. The 2026-10-09 revision restores the full quantity lesson: exact expected contribution across all 1–5,000 integers, the critical-ratio benchmark, a binding 3% default risk limit and a histogram of the chosen order. It retains the seeded simulation, independent analytic checks, certainty preset and browser-only boundary. No empirical demand or student approval was invented.

Browser App Builder's Build, Evaluate, jStat, seedrandom and ECharts recipes guided the implementation; Campus Designer supplied public color/type/layout guidance. jStat supplies distribution math, seedrandom reproduces draws, ECharts draws local charts. Licensed EB Garamond/Open Sans are bundled. No remote runtime data or backend is used.

[Evaluation](EVALUATION.md) retains earlier and revised results, failed rounds and exact tested commits. [Independent review](REVIEW.md) and [deployment](DEPLOYMENT.md) distinguish reviewed code from what is live. A successful build alone is not numerical or visual evidence.

## Try the experiment

Work through these tasks before revealing their answers. Keep each copied completed-run record with your explanation; reload restores the example.

1. **Predict the price of caution.** Reset. Predict whether raising the maximum chance of loss from 3% to 20% increases the chosen order. Enter 20, run, and compare the circle with the unscreened diamond. Then enter 0 and run. Explain why no qualifying order differs from a recommendation to launch.

   **Answer:** At 3%, 469 units gives $6,068 expected contribution; without the screen, 558 gives $6,510. The roughly $442 difference buys a lower modeled chance of loss. At 469, the simulated loss share is 2.66%; its 95% Wilson upper endpoint is 2.9940218%, which passes 3%. At 558, the loss share is 4.49% and the upper endpoint is 4.9136521%, so 20% admits it. Under uncertainty a finite sample's Wilson upper endpoint is positive even with no observed losses, so 0% admits none. The interval addresses sampling error; it does not establish that the assumed demand/cost model is realistic.

2. **Prove the certainty case.** Before choosing “Try the certainty check,” calculate 400, 500 and 600 units using price $45, landed cost $21, recovery $10, fixed cost $4,000 and exactly 500 sales opportunities. Explain why both smaller and larger orders lose contribution.

   **Answer:** 400 × ($45 − $21) − $4,000 = $5,600. At 500, contribution is $8,000. At 600, only 500 sell at full price and 100 recover $10: 500 × $45 + 100 × $10 − 600 × $21 − $4,000 = $6,900. The search chooses 500. Zero demand deviation with equal cost endpoints is genuine certainty; zero deviation alone still permits cost uncertainty.

3. **See conditioning change the forecast.** Reset; set underlying mean to 0 and deviation to 50. Before running, predict whether mean realized demand will be zero. Read the demand preview, then run and inspect the curve and downside.

   **Answer:** Conditioning discards negative demand and renormalizes the positive half of the normal distribution; it does not clip half of the observations to zero. The continuous mean is 50 × √(2/π) = 39.8942 units. Seed `tote-2026` produces a rounded sample mean of 39.8634, fifth percentile 3, median 34 and 95th percentile 97. A nonnegative mean input is a distribution parameter, not automatically the realized demand mean.

4. **Hold the world fixed.** Reset and open “Model, statistical checks and reproducibility.” Inspect shared scenario 1. Predict contribution for an order of 500; then compare it with 400 and 558 using the table. Choose another scenario and explain why all quantities must receive that same new world.

   **Answer:** Scenario 1 has demand 424 and landed cost $19.64. An order of 500 gives 424 × $45 + 76 × $10 − 500 × $19.64 − $4,000 = $6,020. An order of 400 gives $6,144; 558 gives $5,460.88 (rounded to $5,461 in the table). One scenario need not favor the expected-profit optimum. Independent redraws for each quantity would add simulation noise to the effect of quantity; this app pairs all orders, including the full search, on common demand/cost draws.

5. **Inspect the decision boundary.** Reset; enter a loss limit of 2.994% and run, then 2.995% and run. Inspect the displayed upper endpoint, copy each record and reconcile the one-unit change. Finally try certainty, set fixed cost to $100,000 and risk limit to 100%, then run.

   **Answer:** The first limit chooses 468; the second admits 469 because its upper endpoint is 2.9940218%. Display rounding is not the comparison rule. In the final case the best order is still 500, but expected contribution is −$88,000. It is only the best quantity **if proceeding**; no-launch is outside this model. The fifth percentile is a simulated tail summary, never a worst-case guarantee.

## Optional extension: dependent demand and cost

Before adding code, specify a business reason that demand and landed cost move together, choose a joint model with explicit marginal distributions and dependence, and predict which orders change risk. Compare independent and dependent worlds using common random inputs. Validate the joint draws and hand-check payoff accounting before trusting a new recommendation. The shipped model deliberately retains independent demand and cost; no correlation control or learning outcome is claimed.
