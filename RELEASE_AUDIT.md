# Motorsport Hub — Release Audit

## Current decision
- Branch: `hardening/v9.3-codex-handoff`
- Audited base: `a09d16e11aa0f65104ba895b74e09124d30b487b`
- Current branch is a **hardening candidate, not a release-approved build**.
- `main` has not been modified by this hardening work.
- No public release / Store action has been performed.

## Architecture status
### Current Router
The current Router is a direct category module router.

Original seven:
- F1 → flat module
- WEC → flat module
- WRC → flat module
- SUPER GT → flat module
- MotoGP → flat module
- FDJ → flat module
- D1GP → flat module

Expansion:
- SUPER FORMULA → dedicated module
- INDYCAR → dedicated module
- NASCAR → dedicated module
- GTWC Europe → dedicated module

QA is a dedicated diagnostics module.

The Router no longer references the v8.9 reliability wrapper path for current category execution. Runtime wrapper waterfall removal is therefore structurally complete on this branch, subject to verification.

## Audit finding status
| Finding | Current hardening status |
| --- | --- |
| RC-01 stale Router/LKG routing | Loader v5 candidate architecture implemented; device migration still pending |
| RC-02 historical event shown as next race | Direct original modules implement explicit season lifecycle; tests/device pending |
| RC-03 serial wrapper waterfall | **Structurally removed from current Router**; performance verification pending |
| RC-04 mutable/unverified release source | Transactional Loader v5 implemented; immutable SHA/hash pin still open |
| RC-05 incomplete Hero inventory | Runtime-only schema-2 Hero manifest + exact module URL gate implemented; test pending |
| RC-06 unsafe data cache | Schema-1 validated cache implemented for all 11 categories; test pending |
| RC-08 silent runtime source rewrite | Original seven no longer source-rewritten; expansion four still use strict fail-closed Router lifecycle transform |
| RC-09/16 season lifecycle/boundaries | Original seven direct; expansion transform strict; tests pending |
| RC-10 invalid parameter → F1 | Explicit invalid-parameter error path implemented |

## Current data-source audit
- F1: Jolpica/Ergast 2026 schedule + driver standings; atomic promotion.
- WEC: FIA WEC manufacturers classification; canonical Toyota naming `TR010 Hybrid / TOYOTA RACING`.
- WRC: FIA 2026 World Rally Championship for Drivers table.
- SUPER GT: official GT500 driver ranking, 2026 series.
- MotoGP: official stats world standings, Riders' Championship identity.
- FDJ: Formula Drift Japan 2026 standings.
- D1GP: official 2026 D1 Grand Prix driver ranking.
- SUPER FORMULA: official 2026 standings.
- INDYCAR: official championship standings.
- NASCAR: official NASCAR public points CDN.
- GTWC Europe: official overall driver standings.

QA diagnostics now checks these same dependency groups rather than stale legacy endpoints. F1 requires both schedule and standings checks.

## Cache audit
`category-registry.json` records `dataCacheSchema: 1` for all 11 categories.

Common acceptance requirements:
- matching schema
- matching category
- matching season
- matching source
- finite/fresh `fetchedAt`
- valid ranking structure
- valid event/data structure

Invalid cache is removed rather than treated as current live data.

## Lifecycle audit
Original seven direct modules use:
- F1 4h
- WEC 10h
- WRC 4d
- SUPER GT 8h
- MotoGP 4h
- FDJ 40h
- D1GP 40h

Active windows are half-open `[start,end)`.
Final state is `SEASON_ENDED` with `シーズン終了 / SEASON END`.

Expansion modules use explicit event start/end ranges and currently receive a strict Router finalization transform.

## Hero/legal audit
`hero-assets.json` schema 2 is scoped to image URLs reachable from current Registry modules.

`tests/hero-manifest-gate.mjs` requires exact set equality between:
1. Wikimedia image URLs found in all current category modules, and
2. runtime URLs recorded in Hero manifest.

Important current protections:
- SUPER GT direct runtime uses only the exact-page verified Tokumeigakarinoaoshima CC0 No.36 image variants.
- old Fujimaki/MOTUL/front-three-quarter fallbacks are not current direct-runtime Hero assets.
- D1GP direct runtime uses the verified Rowan Harrison action image; old S14 base fallback is not a current Router asset.

## Test status
### Historical tests/evidence
Earlier baseline/device tests passed for several pre-flatten paths. They are retained as comparison evidence only.

### Current post-flatten verification
**Not yet executed from a full repository checkout.**

The current execution container still reports:
`Could not resolve host: github.com`
for GitHub checkout attempts.

Therefore no newly added/rewritten hardening gate is considered PASS yet.

Mandatory repository test set:
- syntax audit for all JS/MJS
- release gate
- boundary gate
- Router hardening gate
- Registry gate
- cache hardening gate
- Hero manifest gate
- lifecycle gate
- F1 flat gate
- WEC flat gate
- WRC flat gate
- SUPER GT flat gate
- MotoGP flat gate
- FDJ flat gate
- D1GP flat gate

## Device audit still required
- all 11 categories Small + Medium
- current QA diagnostics 11/11
- offline/cache recovery paths
- Loader v5 candidate → LKG → quarantine behavior
- cold-load and outage latency comparison against audited base

## Open blockers before release approval
1. Execute/fix full post-flatten test suite.
2. Run full iPhone regression.
3. Device-test Loader v5 migration.
4. Remove remaining expansion Router source transform by absorbing lifecycle into four expansion modules, or explicitly re-audit/accept it.
5. Pin release source to immutable commit/tag and add content hash verification.
6. Codex re-audit audited base → hardening tip.

## Release decision
**NOT RELEASE APPROVED.**

The architectural hardening is materially advanced, but verification gates remain open. Public distribution must wait for repository tests, device regression, Loader migration QA and Codex review.
