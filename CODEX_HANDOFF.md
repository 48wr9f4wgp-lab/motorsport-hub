# Motorsport Hub — Codex Handoff / Hardening Branch

## Purpose
This branch exists so development can continue while Codex is rate-limited without creating merge ambiguity when Codex returns.

## Branch
- Branch: `hardening/v9.3-codex-handoff`
- Base commit: `a09d16e11aa0f65104ba895b74e09124d30b487b`
- Base meaning: exact `main` commit audited by Codex on 2026-08-25 JST.
- `main` must remain untouched by this hardening work until review/merge.
- Current recorded hardening HEAD after H1/performance bridge: `70a25e767cdcfc9ba1f628cfb3690054671ba925`.

## Audit baseline
Codex verdict at the base commit: **FAIL**.
- Critical: 0
- High: 5
- Medium: 8
- Low: 3

Highest-priority findings to close before adding Dakar:
1. RC-01 stale Loader v4 router cache can silently route newer categories to F1.
2. RC-02 legacy seven-category season-end behavior can show old events as `次戦`.
3. RC-03 legacy six-category network path uses a deep serial remote-wrapper chain.
4. RC-04 remote source validation/LKG promotion is not transactional or immutable.
5. RC-05 not every runtime-reachable hero fallback is represented in the attribution inventory.
6. RC-06 data cache lacks schema/category/season/timestamp/TTL validation.

## Development rules on this branch
- No public deployment/release/Store action.
- No Dakar implementation until the P0 hardening gates are closed.
- Do not intentionally change accepted Small/Medium visual design.
- One concern per commit where practical.
- Every behavior-changing commit must document:
  - RC finding addressed
  - files changed
  - compatibility/migration effect
  - tests actually run
  - tests still pending
- Never claim an unrun test passed.
- Preserve the audited base SHA so Codex can compare `a09d16e...` → branch HEAD directly.

## Merge strategy when Codex returns
1. Codex checks out/fetches this branch.
2. Compare base `a09d16e11aa0f65104ba895b74e09124d30b487b` to branch HEAD.
3. Re-run full audit and all repository tests.
4. Review commits individually; avoid wholesale replacement of `main`.
5. Fix/revert any disputed commit on this branch.
6. Merge only after device regression gates and Codex review pass.

## Work completed while Codex is unavailable

### H1 — Router parameter integrity
Implemented on the hardening branch only.

Changes:
- Unknown widget parameters no longer enter the legacy default path / F1 fallback.
- Unknown values render an explicit `Widget Parameterが不正です` widget.
- Added full display-name alias `GT World Challenge Europe` → `GTWCEU`.
- Added additional explicit aliases for D1GP / NASCAR without changing canonical parameters.
- Added router schema marker:
  - `MH_ROUTER_SCHEMA=5`
- Added exact current category manifest marker:
  - `F1,WEC,WRC,SUPERGT,MOTOGP,FDJ,D1GP,SUPERFORMULA,INDYCAR,NASCAR,GTWCEU,QA`
- Added loader/router runtime handshake globals for v5 validation.
- Added loader-selected source ref support so a future release can pin an immutable commit SHA without rewriting the Router.

Key commits:
- `51c499a59d9a90a8d1f7f8726970856a5c528256` — reject unknown parameters / add full GTWC alias.
- `299161c3491a978ef1a323a7d3e6c71893752adc` — schema + manifest + runtime handshake.
- `3b00b6848044653578caa2a58711e06e61f7ff00` — loader-selected source ref support.

### H1 — Loader v5 migration candidate
Added new `scriptable-loader-v5.js`; existing `scriptable-loader.js` v4 is intentionally untouched.

Current v5 behavior:
- Separate `candidate`, `last-known-good`, and `quarantine` files.
- Candidate must pass schema 5, exact category manifest, required router markers, and `new Function()` syntax preflight.
- Candidate is not promoted to LKG until router execution returns the expected runtime handshake.
- Stale v4/v8.6 router cache is not valid under v5.
- Failed candidate is quarantined rather than replacing the LKG.
- LKG execution is intentionally repo-offline so it cannot immediately re-enter the same bad/slow remote chain.
- Router fetch timeout reduced to 8 s for the v5 migration candidate.

Key commits:
- `0c4274560e094dc6d8b3db889b20320b030ec758` — initial transactional v5 loader.
- `70a25e767cdcfc9ba1f628cfb3690054671ba925` — LKG execution forced repo-offline.

Not yet complete:
- v5 has **not** been pasted to / device-tested in Scriptable.
- v4 remains the installed compatibility path until explicit migration testing.
- Immutable release SHA / SHA-256 content manifest is still pending; current v5 `ROUTER_REF` remains `main` until the release pinning design is reviewed.

### H4 bridge — repeated remote-timeout circuit breaker
This is a bridge, not a replacement for the Codex-recommended legacy flattening.

Router behavior during module execution now wraps `Request.prototype.loadString` only for the scope of the routed module:
- repo-raw requests are monitored.
- after the first failed `raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/` request, the repo circuit opens.
- later nested legacy-wrapper repo requests fail locally and can immediately use their existing caches.
- non-repo data endpoints are not intentionally blocked by the circuit breaker.
- the original `Request.prototype.loadString` is restored in `finally`.

This targets RC-03 worst-case outage latency without changing the accepted visual code or rewriting every legacy wrapper before Codex can review the flattening strategy.

Key commit:
- `6edeb5cc4051999fc8c5ff89fd7d9a3edf4af369` — Router repo-raw circuit breaker.

Important: **RC-03 is not closed yet.** The runtime wrapper waterfall still exists in normal online operation and must still be flattened later.

## Tests actually run during this hardening session
The ChatGPT execution container has no GitHub DNS access, so the repository could not be cloned there. Exact branch file contents were mirrored locally for the focused H1 tests below.

Actually executed:
- `node --check` on the hardening Router source: **PASS**.
- `node --check` on `scriptable-loader-v5.js`: **PASS**.
- Node VM router test:
  - `GT World Challenge Europe` routes to `gtwc-europe-widget.js`: **PASS**.
  - `GTWC Europe` routes to `gtwc-europe-widget.js`: **PASS**.
  - invalid `INDYCARR` makes zero module requests and renders a configuration-error widget: **PASS**.
- Loader v5 stale-router simulation:
  - v8.6-style LKG without schema 5 is not executed: **PASS**.
  - stale invalid LKG is removed and safe failure widget is rendered: **PASS**.
- Repo-raw circuit-breaker simulation:
  - nested legacy code attempted three repo-raw loads.
  - only the first failed call reached the underlying network stub; later calls failed locally: **PASS**.
- Focused gate output: `Motorsport Hub router hardening gate: PASS`.

Repository test added:
- `tests/router-hardening-gate.mjs`

Not run after these branch changes:
- `node tests/release-gate.mjs`
- `node tests/boundary-gate.mjs`
- full repository-wide `node --check`
- real Scriptable/iPhone device matrix

Those remain mandatory when Codex or another environment with a checkout is available.

## Planned sequence from here
### H2 — Cache integrity
- Add schema/category/season/fetchedAt validation.
- Reject/quarantine malformed cache.
- Mark stale data explicitly.
- Prefer beginning with the four dedicated expansion modules, then migrate legacy paths after golden regression coverage.

### H3 — Season lifecycle
- Common `UPCOMING / ACTIVE / SEASON_ENDED` contract.
- Half-open `[start, end)` boundaries.
- No historical snapshot returning as `次戦` after the finale.

### H4 — Performance / legacy flattening
- Final target remains removal of the runtime patch-wrapper waterfall.
- Build/test one completed module path rather than serial remote source rewriting.
- Preserve golden visual output.
- The current circuit breaker is only an interim resilience/performance improvement.

### H5 — Asset manifest / parser hardening
- Inventory every runtime-reachable hero fallback.
- Strengthen table identity and fixtures for WRC / SUPER FORMULA / GTWC Europe.

### H6 — Codex rejoin gate
- Update this file with the latest branch HEAD, commits, tests, unresolved items and device checks.
- Codex re-runs the full audit before any merge to `main`.

## Current status
- `main`: untouched by this hardening session.
- Hardening branch: active.
- H1 parameter safety: implemented + focused Node VM PASS.
- Loader v5: implemented as migration candidate; device QA pending.
- RC-03 performance: worst-case repeated timeout path reduced by circuit breaker, but full flatten pending.
- H2/H3/H5: not yet implemented.
- Dakar: intentionally not started.
