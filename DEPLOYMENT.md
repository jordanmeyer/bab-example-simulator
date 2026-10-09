# Deployment

Prepared; not yet published by developer. Authorized repository https://github.com/jordanmeyer/bab-example-simulator and Pages destination https://jordanmeyer.github.io/bab-example-simulator/. Vite base is `/bab-example-simulator/`, source footer names that repository, notices use the local prefix. The copied managed Pages workflow installs locked packages with Node22.19.0, builds and uploads only dist/, and runs on main. Tests/reports/source and node_modules are not website assets.

Coordinator creates/pushes after independent PASS, waits for actual deployed revision and verifies live known-answer/interaction/source/notices. Record evaluated source, report-only published descendant, Actions URL/outcome and live findings here when available. A local prefix check or queued workflow is not a live deployment.

Ordinary update: edit source and agreed plan; install/check dependencies; build notices; commit intended source/tests/workflow; evaluate affected behavior at that commit; verify freshness; push main; wait for exact workflow revision; verify a returning browser loads fingerprinted assets and current results. Verbatim notice updates require an explicit live-content check. Do not force push or deploy another branch.
