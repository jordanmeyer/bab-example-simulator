# Decisions

2026-10-09, simulated student: insulated picnic tote, price$45, recovery$10, fixed$4,000, quantities400/500/600 and20% loss tolerance. Demand normal500/120 conditioned nonnegative then rounded; cost uniform$18–$24 independently drawn for the whole order. No backorders/extra stockout penalty. These are classroom assumptions, not fitted estimates.

2026-10-09, simulated student: screen with upper end of95% Wilson loss interval, choose highest mean among passing options, explicitly say none when none pass. Variability and sampling uncertainty must remain distinct. Certainty preset requested; developer disclosed exact-risk handling when both random inputs are fixed.

2026-10-09, implementation: inverse conditional CDF is distribution-equivalent to redrawing negative normal values and consumes one uniform per demand. Consume two uniforms every trial even in deterministic limits. Common draws are reused across quantities; no global RNG mutation. Currency uses integer cents and unit demand rounds only after conditioning.

2026-10-09, implementation: independent analytic enumeration provides a visible cross-check without random draws. Native form/table/clipboard APIs suffice; only jStat, seedrandom and ECharts are selected. No import/persistence/extra comparison abstraction. Authored CSS tote and system fonts avoid remote assets. Explicit last-run state prevents edited-but-unrun assumptions from being mistaken for current results.

## 2026-10-09 live revision (user-authorized)

Extend to an exhaustive allowed-integer quantity comparison; rank analytic expectations and use common simulated losses for the existing conservative screen. Set default risk to 3%, since 5% does not exclude the true q558 peak. Preserve the fixed launch commitment; do not imply that q1 avoids its cost. Replace triple comparison repetition with one table and add an optional histogram. Bundle licensed fonts and public build provenance. These are revisions authorized by the user's new request, not a new simulated student approval.
