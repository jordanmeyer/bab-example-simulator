# Seasonal Order Lab — revised product plan

## Purpose and opening brief

“Our team is planning a limited product launch. We need to choose a production quantity before we know demand. I want to explore how demand uncertainty, price, unit cost and unsold-stock recovery change the profit distribution, downside risk and missed sales. I want a reproducible run we can discuss in class, not a false promise of the optimal real-world decision.” The original planning exchange is simulated, not a student interview. The 2026-10-09 revision is authorized by the user's request to update the live apps to the revised guidance.

Learn why the quantity maximizing expected contribution can differ from an order meeting a loss limit. Preserve the tote-launch model, extend the search from three options to every allowed whole quantity 1–5,000, and retain three editable comparison orders. A curve shows analytic expected contribution, the exact integer peak and the screened choice. A primary accessible table replaces repeating cards and scatter values. An optional histogram and inventory summary explain downside, leftovers and missed sales. Secondary assumptions, methods and checks are disclosures.

## Inputs, scope and economics

Price $45, recovery $10, launch cost $4,000, normal demand underlying mean 500 and deviation 120 conditioned nonnegative then rounded to units; independent uniform order-level unit cost $18–$24 rounded to cents. Default seed tote-2026; 10,000 shared scenarios. The default loss limit is 3% because 5% admits the exact quantity peak. Price/recovery/cost allow 0–500 USD with two decimals; recovery≤price and low≤high. Fixed cost 0–1,000,000 USD; demand mean/deviation finite 0–5,000; quantities distinct integers 1–5,000; risk 0–100%; seed 1–60 characters.

Contribution cents = min(Q,D) × price + max(Q−D,0) × recovery − Q × cost − fixed. Loss is strictly below zero. Missed demand disappears; all leftovers clear. The fixed launch cost is paid for every allowed quantity, including the smallest order. A no-launch alternative avoiding fixed cost is outside this comparison. No empirical demand fitting, correlation, backorders, taxes, financing or disposal uncertainty. Synthetic inputs do not establish commercial advice.

## Quantity benchmark and selection

Compute exact expected sales cumulatively: E[min(Q,D)]−E[min(Q−1,D)] = P(D≥Q), respecting conditioned and rounded demand. Independent cost makes midpoint expected cost exact. Scan all integers 1–5,000; ties favor the smaller order. When price > mean cost > recovery, the critical ratio (price−mean cost)/(price−recovery) gives a continuous conditioned-demand quantile; distinguish it from the exact integer peak. Other economics still use the full bounded integer scan, with the usual ratio marked inapplicable.

For each quantity reuse the identical 10,000 demand/cost draws. Screen with the two-sided 95% Wilson interval's upper endpoint ≤ loss limit, or the exact loss rate for fully deterministic inputs. Among passing quantities choose maximum analytic expected contribution. No passing quantity means no recommendation. Simulated loss is the primary label; explain the conservative sampling cushion beside the result and its technical method in details. Percentiles are nearest-rank sample outcomes. Mean intervals use normal z(.975) × sample SD/√n and describe sampling error only. Curve sampling affects drawing only; selection checks every integer.

## Interaction, design and dependencies

Run applies the complete costly experiment; pending edits label both form and previous results. Reset restores and runs default; certainty fixes demand at 500 and cost at $21. Returning history resets inputs to the retained completed run when persisted, and fresh loads consistently set defaults. Copy includes last-run assumptions, currency cents, seed and results with a visible fallback.

Use unchanged local ECharts 6.1.0, jStat 1.9.6 and seedrandom 3.0.5, Vite 8.3.4. The histogram serves the profit-distribution brief; the table gives chart equivalents. Wait for local OFL-licensed EB Garamond/Open Sans before chart initialization. Retain published stacks, lining figures, solid navy/magnolia/copper colors and no institutional marks. Whole-dollar totals; unit-cost inputs keep cents. The public BUILD-STORY.md links original planning and actual evaluation.

## Independent expectations and acceptance

Python math.erf enumeration of rounded conditioned demand yields q558 expected contribution 650972.663918949 cents, with adjacent integer orders lower. Critical quantile approximately 558.0503 units. The three original orders 400/500/600 have expected cents 512434.6045545513 / 632470.5983907643 / 642440.0136420537; analytic loss .0162430223727 / .0309930910805 / .0553681541947. Monte Carlo tolerance is five independently derived sampling standard errors.

Certainty gives $5,600/$8,000/$6,900 for 400/500/600, global peak q500, and exact zero loss. $0 contribution never counts as loss; equal objectives prefer q1 in the full scan. Huge fixed costs yield no eligible quantity. Default risk must displace the peak; 20% must restore it. Arithmetic, seed, conditioning, validation and analytic tests remain.

Run npm ci with a writable temporary cache, dependency checker, npm run build, browser tests on 9701 and production preview on 9702 at /bab-example-simulator/. Inspect 320/390/1440px fixed-width frames, fonts, chart labels, keyboard edit/reset/copy, invalid/pending states and Back before interaction. Keep failed rounds, checkpoint source and PLAN before final evaluation, and require independent review before publication.
