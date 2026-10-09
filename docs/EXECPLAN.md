# Build a reproducible seasonal-order decision lab

This living ExecPlan follows the host PLANS.md requirements. Keep progress, discoveries, decisions and outcomes current; all needed model assumptions are repeated here and in PLAN.md.

## Purpose / Big Picture

A fictional campus-store buyer chooses one order for a seasonal tote. The app shows upside, downside and leftover stock for three quantities, with a strict loss-risk screen and a reproducible seed. A certainty preset and analytic cross-check let the class audit it before discussing uncertain results.

## Progress

- [x] (2026-10-09) Read workflow, managed/freshness, selected library and bundled design guidance.
- [x] (2026-10-09) Record simulated agreement on payoff, conditional demand, independence, risk screen and certainty test.
- [x] (2026-10-09) Implement model, native controls, charts, evidence tables and copy fallback.
- [x] (2026-10-09) Derive independent references and observe17/17 preliminary browser tests; production renders.
- [x] (2026-10-09) Reinstall and freeze first source checkpoint;17/17 final model checks and production product interactions passed.
- [x] (2026-10-09) Preserve failed independent-review rounds; fix bfcache lifecycle and narrow maximum-money chart labels.
- [x] (2026-10-09) Freeze8dbb6ab30ef959c008e058169af41c561d41fc6a and repeat17/17 model, revised narrow charts and native navigation/rerun checks; source/PLAN comparisons clean before/after.
- [ ] Complete persistent independent review and revisions, then hand off publication to coordinator.

## Surprises & Discoveries

Conditioning a normal distribution is materially different from clipping negative values to zero, especially when mean is near zero. The half-normal independent reference protects this boundary. Rounding uniform unit cost to cents also changes a threshold's endpoint probability:50–52 cents with51-cent revenue has25% loss probability. The UI's native hidden label needed an explicit hidden CSS rule because generic label styling otherwise competes with the browser rule. No numerical browser test has failed so far. Independent review identified bfcache teardown and a maximum-money narrow chart-label collision; both required implementation revisions. The local production review harness is generated from tracked tests/ and removed by a fresh build.

## Decision Log

The simulated student chose price45, recovery10, fixed4000, mean500/SD120, cost18–24, quantities400/500/600 and20% loss limit. Follow-up explicitly chose normal demand conditioned nonnegative then rounded, the Wilson95% upper endpoint for screening and no forced recommendation. The developer disclosed exact deterministic handling and an8000-dollar certainty result for500 units. The selected libraries have distinct roles: jStat probability/summary functions, seedrandom local repeatable draws and ECharts chart rendering. Native controls and tables avoid a needless framework.

## Outcomes & Retrospective

Full product behavior and17-case suite passed at the first checkpoint. Production keyboard, error, seed, copy and narrow flows passed. Independent-review lifecycle and edge-chart revisions are ready for another clean checkpoint. Independent review and live publication remain outstanding. Coordinator owns publication and this developer must not alter course files or push.

## Context and Orientation

`app/model.js` contains validation, outcome arithmetic, sampling, Wilson intervals, analytic enumeration and option comparison. `app/app.js` reads the native form, maintains the completed run, renders cards/charts/tables and copies assumptions. `app/index.html` holds the form and semantic sections. `app/style.css` applies responsive design. `tests/tests.js` imports real model functions; `tests/reference.py` independently derives probability fixtures using Python standard-library math. Managed package manifests, notices and workflow complete the project. dist/ and node_modules are generated/ignored.

## Plan of Work

Complete source review and simplification, build from a clean locked installation, commit intended source and plan, then exercise model and product boundaries in browser. Send exact checkpoint to the persistent reviewer. Fix implementation defects directly, preserve failed rounds, and ask simulated student only for consequential model changes. Rerun affected checks at a new checkpoint before requesting another review. Pass source and report-only descendant to coordinator for ordinary main publication.

## Concrete Steps

Work from the simulator project root. Use Node22.19.0/npm10.9.3 and `npm ci --cache /private/tmp/bab-npm-cache-simulator`. Run the installed Browser App Builder dependency checker with this absolute root, then `npm run build`. Reuse test port9505 via `npm run test:browser -- --port 9505` and production9506 via `npm run preview -- --port 9506`. Browser tests are http://127.0.0.1:9505/tests/ and actual production path is http://127.0.0.1:9506/bab-example-simulator/. `python3 tests/reference.py` must reproduce the expected values recorded in PLAN.md without importing application code.

## Validation and Acceptance

Tests must report17/17 pass. Certainty button must show400/500/600 contributions5600/8000/6900 dollars and recommend500. Default mean comparison should select600 within20%; changing the limit to5% should prefer500;1% should yield none. Invalid inputs keep old results with labeled errors. Same seed/inputs reproduce output; changed seed differs. Copy contains last-run cent amounts, seed and10000 draw count, even when form edits remain unrun. Browser review checks desktop1440 and narrow320 frames without changing the shared viewport, keyboard form submission/errors/disclosures/order focus, contrast and source/notices links. Do not substitute source review for rendered checks. Git source/plan comparisons must be clean before and after evaluation.

## Idempotence and Recovery

npm ci restores locked dependencies; build recreates only dist and regenerates notice deterministically. Restart only owned servers if a file watcher misses changes. Preserve ordinary Git history, exact simulated conversation and failed evaluation/review rounds. No live service credentials or user data enter this project. No publication until independent pass.

## Artifacts and Notes

PLAN.md defines exact formulas, input bounds, statistical conventions and references; PLANNING-CONVERSATION.md preserves the simulated exchange. README/SETUP document reproducibility and provenance. EVALUATION records developer checks; reviewer owns REVIEW. DEPLOYMENT remains prepared until coordinator verifies live state.

## Interfaces and Dependencies

`validate(input)` returns field-specific errors. `outcome(input,quantity,demand,cost)` uses integer cents/units and returns sold/leftover/missed/contribution. `draws(input,n)` returns shared seeded pairs. `analytical(input,q)` independently integrates rounded sales/cost probabilities under the same assumptions. `simulate(input,n)` returns per-option summary/intervals/percentiles plus a qualifying choice or null. The UI calls only with validated input and10000 draws. Exact approved dependencies are pinned with registry lockfile and bundled notices.

Revision note: initialized after full initial implementation and exploratory checks; final/independent stages remain explicit.

Follow-up2026-10-09: after independentPASS and initial live publication, reviewer requested checking native Back BEFORE rerun. Confirmed restored certainty controls with default results; prior tests had only required successful rerun. Disable form native restoration and verify both appliedcertainty and pendingseed navigation return consistently. Preserve initial PASS/deployment and send a new source checkpoint for a reviewed ordinary update.

Follow-up: independently reproduced native restoration mismatch also affected outside-form selects. Disable restoration on the affected selectors, verify actual Back before interaction, and freeze a new source checkpoint.
