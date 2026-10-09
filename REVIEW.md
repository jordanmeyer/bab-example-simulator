# Independent review — Seasonal order lab

Reviewer: persistent independent recipe reviewer. Status: **PASS for source 8dbb6ab30ef959c008e058169af41c561d41fc6a**. Developer owns implementation and other reports; reviewer owns this file. Publication requires the normal clean build from this unchanged source.

## Round 1 — source checkpoint d99a7b8e1941d6252b2bf3472dd4ca6c4a1aacff

Read the agreed PLAN, exact simulated planning exchange, evaluation/setup/decisions/deployment/README, whole application/model/styles/tests, workflow and dependency configuration. The simulated-student assumptions and choice rule are explicit; the product compares three orders and does not claim full optimization or forecast validation. jStat and seedrandom are used for their documented purposes with a local random stream and actual distribution transforms. User/seed text is rendered as text; HTML interpolation uses authored or validated numeric values.

**Required source fix:** `app/app.js` unconditionally disposes ECharts instances and disconnects their ResizeObserver on `pagehide`. A page restored from the back-forward cache resumes with disposed instances; submitting assumptions cannot redraw those instances. Preserve chart resources when `event.persisted`, or recreate them on restoration. Sent directly to developer; developer accepted and applied a guard. Final source checkpoint and independent UI recheck remain pending. This is a source-established lifecycle failure, not a reviewer-observed browser reproduction.

Independent model checks through the actual module:

- Recomputed supplied Python standard-library references and obtained default analytic contribution cents 512434.6045545513 / 632470.5983907643 / 642440.0136420537 and corresponding loss fractions 0.01624302237272553 / 0.03099309108054615 / 0.05536815419465702. The half-normal conditional example gives capped sales 39.04458284869684 and loss 0.6778258809783382.
- Additional reviewer case, derived before running: demand exactly 1, price 1 cent, recovery/fixed 0, raw cost uniform 0–1 cent then rounded. Cost is 0 or 1 with equal probability. For quantities 1/2/3 the mean contributions are 0.5/0/−0.5 cents, and loss probabilities 0/50%/50%. Actual analytic results match exactly. The shared seeded sample gives means 0.5067/0.0134/−0.4799 and loss fractions 0/0.4933/0.4933, consistent with that same discrete cost draw.
- At valid maximum economics (price/recovery/cost all $500, fixed $1,000,000, quantities 4998/4999/5000, demand mean/SD 5000), every payoff is −$1,000,000 by conservation. The actual module validates inputs and returns that exact simulated and analytic mean with loss 1; no nonfinite output.
- Variable demand with all-zero economics returns zero contribution and zero observed loss. At a 0% limit the Wilson upper endpoint remains 0.0003839983706765959 and rejects all options. This follows the expressly agreed policy that only fixed demand plus fixed cost invokes the exact-risk exception; it is not silently reported as a model error.

The dependency checker accepted the exact approved packages and registry lockfile. Base/source/notices/workflow agree on `/bab-example-simulator/` and dist-only publication. Reviewer did not repeat the developer's clean reinstall or claim its browser test suite as an independent run.

## Browser evidence limitation

The reviewer browser was unavailable at this round. Documented recovery used `cua_repl` reset, the required initial `cua.getState()` (returned no browsers), then a fresh `cua.createBrowserTab('iab', production URL)` with and without optional visibility settings. Both returned browser unavailable. No alternate runtime, browser backend or hidden API was used. Root and developer were informed; the developer's working browser evidence is kept separate.

Pending independent UI checks: current production checkpoint, 17-case browser test page, default/5%/1%/certainty scenarios, invalid input preservation, keyboard/copy, actual 1440/320 rendering including maximum money values, chart tooltip/state, chart survival after away/back/rerun, source/notices links and console observations. Developer was asked to inspect a source-suspected large-number overflow at 320px; this is not yet recorded as a verified rendering defect.

## Round 2 — source 8dbb6ab30ef959c008e058169af41c561d41fc6a

Re-read the source diff. The persisted-pagehide guard preserves the two chart instances and observer. A developer production boundary fixture reproduced touching/overlapping axis ticks and coincident point labels; this was a real developer-observed rendering failure discovered by the reviewer's boundary request. The revised source uses compact currency ticks with overlap suppression and one combined letter label for coincident points. Calculation/model source is unchanged. No remaining required source correction found; independent UI witness still pending.

Root supplied a dedicated IAB tab for reviewer handoff, but the documented `cua.getTab` also returned browser unavailable. Root therefore agreed to execute the reviewer's explicit checklist as a separate independent witness. Final PASS must identify that division of evidence and the actual checked source/assets, not imply this reviewer personally controlled the unavailable browser.

## Final independent reconciliation — PASS

Coordinator independently executed the reviewer's production checklist against8dbb6ab, separate from the developer. Durable evidence is in the course repository at `evidence/browser-app-builder/recipe-examples/2026-10-09/simulator/UI-WITNESS.md` with desktop, narrow default, maximum-money cards and maximum-money chart screenshots. This reviewer read that witness, inspected the saved images and rechecked the relevant source diff, which is empty. Report-only edits remain separate from the executable checkpoint. The developer identifies production assets as `index-DGqVuOtK.js` and `index-DFO-hmno.css`.

The independent witness observed17/17 browser cases; default600/$6,439.05;5% selects500;1% explicitly selects none; certainty500/$8,000 even at0% risk. Invalid price focuses its associated field and preserves results. Editing a seed without Run marks assumptions stale and copies the last completed seed and cents; Run updates the copied seed and repeating it reproduces the ledger. Keyboard inventory inspection focuses the selector with a visible outline, and the percentile disclosure opens by keyboard.

Production1440/320 frames measured1439/319 client and scroll widths with no document overflow. The default charts, headings and cards are readable; the ledger scrolls inside its container. The maximum-money case returns exactly−$1,000,000 for all options and the cards fit. A follow-up independent observation explicitly closed the earlier chart defect: compact CDF/frontier ticks are readable, the coincident frontier symbols have one A/B/C label, and the20% risk line label does not collide. Saved `narrow-boundary-charts.png` shows that corrected region.

Away/Back/Run retains correct results and two chart SVGs; captured warnings/errors are empty. This does not establish persisted bfcache use, so the persisted-pagehide claim remains limited to the reviewed source guard. Source/notices links are correct. Frame rendering is CSS-layout evidence, not a physical-device claim; host iframe-control limits are documented in the witness.

All required findings are closed. The product makes its conditional distribution, rounded economics, shared draws, limited three-option search, Wilson screening and stale/completed-run distinction explicit. The model, interface and supported boundary behavior now agree. No additional feature is required for this agreed scope. The known bundle advisory and untested clipboard-permission-denial branch remain honestly disclosed limitations. The clean publication build must remove the temporary ignored-dist visual harness; it must not change reviewed application source.
