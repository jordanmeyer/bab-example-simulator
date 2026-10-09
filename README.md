# Seasonal order lab

An original synthetic classroom app for choosing a one-season inventory order. Compare three quantities by expected contribution, loss risk, downside percentiles, leftovers and missed demand. A visible seed reproduces10,000 common demand/cost draws, while an analytic cross-check and certainty preset help inspect the model.

## Use

Edit the native assumption form and select “Run10,000 scenarios.” Results stay tied to the last completed run until submission; unrun edits are labeled. Default demand is a nonnegative-conditioned normal with underlying mean500/SD120, cost is an independent uniform$18–$24, and order options400/500/600. Choose a smaller risk limit to see options excluded;1% gives no qualifying default option. “Try the certainty check” fixes demand at500 and cost at$21; exact contributions are$5,600/$8,000/$6,900, so500 leads. Inspect inventory per quantity, expand exact-value tables and copy last-run assumptions for class. Copied currency fields use integer USD cents, labeled explicitly. Clipboard failure exposes a readonly manual-copy fallback. Nothing is uploaded or retained after reload.

## Model

Contribution = min(order,demand)×price + unsold×recovery −order×landed unit cost −fixed launch cost. Loss means strictly below zero; break-even is not a loss. Every unsold unit clears at the recovery amount. Missed demand disappears without backorders or penalty. Mean/SD inputs belong to the underlying normal; conditioning and rounding change the realized moments near zero. One cost applies to the entire order in each trial. Demand/cost independence excludes real shared shocks.

The risk screen uses the upper endpoint of a two-sided95% Wilson interval for the simulated loss fraction. Choose highest mean contribution among passing options; equal means favor the smaller order. No passing options means no recommendation. Both inputs fixed means exact results with no sampling interval. The mean interval uses sample variance and a normal approximation for Monte Carlo error; it is not a business outcome interval or a guarantee. Curves display201 percentile points and numerical comparisons use all10,000 outcomes. Percentiles use nearest rank. Group means may be fractional even when every trial has integer units/cents.

The app compares only your three quantities; it does not optimize all quantities, estimate demand from real data, price products, model correlated shocks or authorize a purchase. It is a fictional class exercise, not a certified operating decision.

## Run

Use Node22.19.0/npm10.9.3. `npm ci` installs locked dependencies; this host uses `npm ci --cache /private/tmp/bab-npm-cache-simulator`. `npm run dev -- --port 9504` previews source. `npm run test:browser -- --port 9505` serves http://127.0.0.1:9505/tests/. `python3 tests/reference.py` reproduces the independent standard-library expected values. `npm run build` retains notices and creates only the application in ignored `dist/`. `npm run preview -- --port 9506` serves http://127.0.0.1:9506/bab-example-simulator/. Fixed-width production frames are under tests/desktop.html and tests/narrow.html.

## Provenance and libraries

All product facts and assumptions are invented for this example; no actual customers/employers are represented. Browser App Builder's bundled Campus Designer supplies unchanged Duke navy/royal and solid supporting colors, system Georgia headings and Arial as the body fallback for Open Sans. No institutional logos, remote fonts, affiliation or endorsement. The tote sketch is authored CSS.

jStat1.9.6 handles normal CDF/inverse, sample summaries and uncertainty; seedrandom3.0.5 supplies a local deterministic random stream; ECharts6.1.0 renders downside and risk/return charts. Vite8.3.4 is build-only. Libraries are bundled locally; no runtime service, font, telemetry or data API is configured. License notices are generated from installed packages and the bundled seedrandom supplemental notice. [Notices](app/public/THIRD-PARTY-NOTICES.txt) remain in source and production.

Independent references use the [seedrandom upstream sequence](https://github.com/davidbau/seedrandom#script-tag-usage) and [jStat distribution API](https://jstat.github.io/distributions.html), read2026-10-09. Seed sequence checks establish reproducibility; hand arithmetic and Python math.erf enumeration separately establish the implemented probability/payoff model. These references do not validate the business assumptions.

## Publication

Prepared source: https://github.com/jordanmeyer/bab-example-simulator

Prepared site: https://jordanmeyer.github.io/bab-example-simulator/

Coordinator owns publication after independent review. See DEPLOYMENT.md for actual status; prepared destinations are not deployment claims. Only dist/ is deployed using ordinary main commits. Git history publicly attributes the authorized Jordan Meyer <jordanmeyer@protonmail.com> identity.
