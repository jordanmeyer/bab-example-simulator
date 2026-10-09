# Restore the seasonal quantity lesson

This living ExecPlan follows the supplied ~/.codex/PLANS.md rules.

## Purpose / Big Picture

A buyer can see the full expected-profit peak, then see how downside tolerance changes the feasible choice. Open the app and compare its peak and screened markers, change the loss limit to 20%, run and observe the markers coincide.

## Progress

- [x] 2026-10-09: Read original plan, brief, review and current recipes; inspect clean repositories and fetch origin.
- [x] 2026-10-09: Extend the model, build the quantity curve and histogram, consolidate comparison and methods, bundle fonts and provenance.
- [x] 2026-10-09: Checkpoint and complete developer browser/production evaluation.
- [ ] 2026-10-09: Independent review and authorized publication.

## Surprises & Discoveries

A 5% limit excludes the old q600 comparison but admits the true q558 peak. The default must be lower to teach the actual optimization tradeoff.

## Decision Log

2026-10-09: Use 3% default and analytic expected-profit ranking over all allowed integers, preserving common seeded draws and the conservative loss screen. This avoids making random mean noise determine the curve peak. Keep no-launch out of scope because the current model pays the fixed launch cost for every comparison.

## Outcomes & Retrospective

Implementation and developer browser checks complete; independent approval remains. Retain earlier evaluation evidence rather than relabeling it.

## Context and Orientation

app/model.js owns sampling, analytic values and quantityStudy; app/app.js handles controls and ECharts; app/index.html and style.css own the page. tests/tests.js imports the actual model; tests/reference.py is an independent Python calculation. scripts/notices.mjs builds local package/font notices; vite.config.js owns the Pages prefix.

## Plan of Work

Add a bounded integer expected-sales scan and a loss screen using the shared sample. Replace repeating options/scatter with one curve and table. Keep full outcomes available in a histogram disclosure. Update PLAN, DECISIONS and BUILD-STORY for actual scope and provenance. Validate and checkpoint before final browser evidence.

## Concrete Steps

From this repository run npm ci --cache /private/tmp/bab-npm-cache, node /Users/jordan/Projects/decision-999/plugins/browser-app-builder/scripts/check-dependencies.mjs "$PWD", npm run build. Run npm run test:browser -- --port 9701 and npm run preview -- --port 9702; open /tests/ and /bab-example-simulator/ respectively. Run Python tests/reference.py for independent expected calculations. Source checkpoint covers app, tests, config/workflow, tooling, licenses and PLAN.

## Validation and Acceptance

Browser tests must all pass. Expected peak q558 is $6,509.726639; default constrained quantity must be smaller and 20% restores q558. Certainty peak is q500/$8,000; no feasible loss screen never forces a recommendation. Test edited pending inputs, invalid fields, keyboard controls/copy, history consistency before rerunning, font requests and 320/390/1440 frames. Production assets must load at the repository prefix. Record observations, not only source review.

## Idempotence and Recovery

Commands use locked packages and regenerate notices deterministically; dist is ignored. Reset restores the synthetic default. Preserve prior history and failed evidence; do not push until independent review passes and root authorizes publication.

## Artifacts and Notes

EVALUATION.md records tests and commits; BUILD-STORY links public records. Course evidence belongs only in the assigned simulator revision folder.

## Interfaces and Dependencies

quantityStudy(input, sample) returns rows, best, choice, ratio and critical; existing simulate remains available for outcome distributions. No new dependencies or services. Fonts are licensed local assets and notices are retained.

Revision note: expanded the original three-option experiment because it omitted the requested decision lesson; the new plan documents the consequential model and presentation choices.
