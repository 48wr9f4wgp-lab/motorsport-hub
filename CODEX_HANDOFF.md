# Motorsport Hub — Codex Handoff / Hardening Branch

## Branch contract
- Branch: `hardening/v9.3-codex-handoff`
- Audited base: `a09d16e11aa0f65104ba895b74e09124d30b487b`
- Base = exact `main` commit audited by Codex on 2026-08-25 JST.
- `main` has not been modified by this hardening work.
- Implementation checkpoint immediately before this handoff-only update: `7af718898950fd2812cfd5aa9d6d0a3ae719121a`.
- Latest compare before this handoff refresh: branch was **68 commits ahead / 0 behind** audited base.
- Dakar remains intentionally blocked until hardening gates + device regression + Codex review.
- No public deployment / release / Store action has been performed.

## Audit baseline
Codex verdict at audited base: **FAIL** — Critical 0 / High 5 / Medium 8 / Low 3.

Primary findings addressed by this branch:
- RC-01 stale Loader/router cache can misroute categories.
- RC-02 / RC-09 / RC-16 season-end and event-boundary behavior.
- RC-03 deep serial wrapper waterfall / outage latency.
- RC-04 unsafe candidate/LKG promotion and mutable release source.
- RC-05 incomplete runtime Hero attribution inventory.
- RC-06 malformed/stale/cross-category data cache acceptance.
- RC-08 runtime source rewriting can silently no-op.
- RC-10 invalid Widget Parameter silently falls back to F1.

## Current architecture
### Router
`motorsport-hub.js` is now a **direct category module router**.

Current original seven paths:
- F1 → `f1-widget-flat-v1000.js`
- WEC → `wec-widget-flat-v1000.js`
- WRC → `wrc-widget-flat-v1000.js`
- SUPER GT → `supergt-widget-flat-v1000.js`
- MotoGP → `motogp-widget-flat-v1000.js`
- FDJ → `fdj-widget-flat-v1000.js`
- D1GP → `d1gp-widget-flat-v1000.js`

Expansion paths remain direct dedicated modules:
- SUPER FORMULA → `superformula-widget.js`
- INDYCAR → `indycar-widget.js`
- NASCAR → `nascar-widget.js`
- GTWC Europe → `gtwc-europe-widget.js`
- QA → `motorsport-diagnostics-v890.js`

**Important:** current Router no longer references `motorsport-reliability-v896.js` or `d1gp-reliability-v890.js`, and no longer installs the nested GitHub Raw request circuit-breaker shim. The legacy wrapper files remain in the branch only as historical/rollback artifacts and are not current Router runtime paths.

Loader v4 compatibility markers are intentionally preserved in Router, including the literal `module router` marker. A temporary change to `direct category router` would have broken Loader v4/v5 validation and was corrected in implementation checkpoint `7af7188...` by using `direct category module router`.

## H1 — Router / Loader integrity
Implemented:
- invalid parameters render explicit configuration error instead of F1.
- full-name aliases for Formula 1, Formula Drift Japan, D1 Grand Prix, NASCAR, GTWC Europe, etc.
- `MH_ROUTER_SCHEMA=5`.
- exact manifest `F1,WEC,WRC,SUPERGT,MOTOGP,FDJ,D1GP,SUPERFORMULA,INDYCAR,NASCAR,GTWCEU,QA`.
- Loader/Router runtime handshake.
- `__MH_SOURCE_REF` path selection for future immutable pinning.

`scriptable-loader-v5.js` exists as migration candidate while installed v4 remains untouched:
- candidate / LKG / quarantine split.
- syntax preflight.
- schema + exact category manifest validation.
- candidate promotes only after Router runtime handshake.
- stale v8.6-style Router is invalid.
- LKG executes repo-offline.

Still open under RC-04:
- release ref is not yet pinned to immutable commit SHA/tag.
- no SHA-256 module/content manifest yet.
- Loader v5 has not been pasted/device-tested.

## H2 / RC-06 — Data cache integrity
**All 11 current categories now use cache schema 1.**

Common contract:
- `schemaVersion`
- `category`
- `season`
- `fetchedAt`
- `source`
- `ranking`
- `event`
- `data`

Rules include category/season/source validation, ranking shape checks, event/data validation, future-date rejection and TTL. Malformed/old/stale cache is removed instead of trusted.

Expansion module hardening commits:
- SUPER FORMULA `bbac1d9d5a37c77518fe6b180890058b425fb7df`
- INDYCAR `81db621605ac57d0b97bd06606edfc87a21312a3`
- NASCAR `d5c71884e33466db433e7462daacb1b47219ff1c`
- GTWC Europe `add80c10b6734685b96b8fdc7672ae3146a40de3`

Original seven now implement the same contract directly inside the flat modules.

## H3 — Season lifecycle
Original seven flat modules directly implement `UPCOMING / ACTIVE / SEASON_ENDED` and half-open active windows.

Current hold contracts:
- F1: 4h race retention; live schedule; explicit Abu Dhabi 2026 finale fallback for offline/no-cache post-season.
- WEC: 10h.
- WRC: 4 days.
- SUPER GT: 8h.
- MotoGP: 4h.
- FDJ: 40h.
- D1GP: 40h.

Finale UI uses `シーズン終了` / `SEASON END` rather than historical `次戦`.

Expansion four still receive a **strict fail-closed Router lifecycle transform**. The transform requires exact replacement hit counts + postconditions and fails closed on source-format drift. This mitigates RC-08 but runtime source rewriting still exists for these four categories and should preferably be absorbed into their modules before final RC.

## H4 / RC-03 — Wrapper waterfall flattening
The audited runtime had a deep chain such as Router → v896 → v895 → v894 → v892 → v890 → v871 → core/HQ.

On this hardening branch, **all seven original categories now use one completed module directly from Router.**

Flat module creation commits:
- F1 `a78f8fbec85e53e1e9b887b1d0f03d810a5380cf`
- FDJ `c2e8fecfe29d235067d15f3be7665133d5b89be8`
- MotoGP `12c310bfa256f71a9dc81b2610c188ab7815626c`
- WRC `0a13762d2a1a104ed8ae5472218bf8ae3d4afe17`
- D1GP `5ba9a95ff791e1b57095bc441b3968ff64aac3a2`
- WEC `efb5397143cbd0bb9e5f183ea06744c4901cbce1`
- SUPER GT `1d3674e798c65905cf544c9edab0c9c48818aae4`

Router direct-runtime transition:
- WEC direct `54838dfb84c222ad99830cc0b686ba4cb79d45ba`
- final SUPER GT direct + wrapper-route removal `8fef303588cff02a9745fd27a07aac9039e049c5`
- loader `module router` contract restored `7af718898950fd2812cfd5aa9d6d0a3ae719121a`

RC-03 is **structurally resolved on branch but not verification-closed** until repository tests and device latency/regression checks run.

## Direct-module data invariants
### F1
- Jolpica/Ergast 2026 schedule + standings fetched concurrently and promoted atomically.
- explicit Abu Dhabi finale fallback prevents Italian GP snapshot resurrection after season end.

### WEC
- current manufacturer source: `https://www.fiawec.com/en/page/manufacturers-classification/34`.
- 2026 tail: COTA → Fuji → Barcelona → Monza.
- canonical Toyota naming is directly stored as **TR010 Hybrid / TOYOTA RACING**; no runtime correction wrapper is required.

### WRC
- FIA Drivers table: `https://www.fia.com/events/world-rally-championship/season-2026/standings`.
- table identity is `2026 FIA World Rally Championship for Drivers`.
- tail: Paraguay → Chile → Sardegna → Saudi Arabia.
- current official WRC event page showed Saudi 11–14 Nov; module uses Nov 11 start + 96h hold.

### SUPER GT
- current official GT500 driver ranking source: `https://supergt.net/driver_ranking?gt_class=gt500&series=2026`.
- Malaysia 2026 was postponed; current season is domestic seven events.
- remaining: SUGO → AUTOPOLIS → MOTEGI.
- current top3 metadata preserved exactly:
  - #36 坪井 翔 / 山下 健太 — `TOYOTA · GR Supra ｜ au TOM'S`
  - #16 野尻 智紀 / 佐藤 蓮 — `HONDA · PRELUDE-GT ｜ ARTA`
  - #14 福住 仁嶺 / 大嶋 和也 — `TOYOTA · GR Supra ｜ ROOKIE`
- unknown future leader falls back to non-empty `GT500 / No.xx` metadata rather than being discarded.

### MotoGP
- official stats standings source.
- Riders' Championship + MotoGP identity required.
- current 2026 tail through Valencia.

### FDJ / D1GP
- official ranking sources retained.
- duplicate RYUMA normalization retained for FDJ.
- D1GP parser isolates driver ranking from single-run ranking.

## H5 / RC-05 — Hero asset inventory
`hero-assets.json` is now schema 2 and scoped **only to hero image URLs reachable from current modules in `category-registry.json`**.

The prior historical fallback inventory was removed from the active manifest. `tests/hero-manifest-gate.mjs` now:
- scans every current Registry module for Wikimedia runtime image URLs.
- requires exact URL-set equality with `hero-assets.json`.
- requires category match for every URL.
- rejects stale/unreviewed historical SUPER GT / D1 fallback tokens.

SUPER GT direct module contains only the exact-page verified CC0 No.36 image in 2048/1280 variants. Old Fujimaki/MOTUL/front-three-quarter fallbacks are not current runtime assets.

## Category registry
`category-registry.json` is the hardening source-of-truth inventory for IDs, display names, aliases, module, marker, module cache key and data-cache schema.

All 11 category entries now have `dataCacheSchema: 1`.
Dakar is explicitly recorded as `BLOCKED_UNTIL_HARDENING_REVIEW`.

`tests/registry-gate.mjs` checks collisions, module existence/marker drift, Router manifest/schema and Router module/cache-key alignment.

## QA diagnostics
`motorsport-diagnostics-v890.js` was aligned with the current direct-module data dependencies:
- F1 requires both schedule + standings route checks.
- WEC uses current manufacturer classification endpoint + identity.
- SUPER GT uses GT500 driver-ranking endpoint + identity.
- WRC/MotoGP/D1GP identities match flat parsers.
- still reports category-level `11/11 LIVE` when all dependency groups pass.

## Test suite added/updated
Current hardening gates include:
- `tests/router-hardening-gate.mjs`
- `tests/registry-gate.mjs`
- `tests/cache-hardening-gate.mjs`
- `tests/hero-manifest-gate.mjs`
- `tests/lifecycle-hardening-gate.mjs`
- `tests/f1-flat-gate.mjs`
- `tests/wec-flat-gate.mjs`
- `tests/wrc-flat-gate.mjs`
- `tests/supergt-flat-gate.mjs`
- `tests/motogp-flat-gate.mjs`
- `tests/fdj-flat-gate.mjs`
- `tests/d1gp-flat-gate.mjs`
- rebuilt `tests/release-gate.mjs`
- normalized `tests/boundary-gate.mjs`

The direct flat gates cover malformed cache, source/table identity, event boundaries, post-finale behavior and selected category-specific invariants.

## Tests actually executed vs pending
### Actually executed earlier in this hardening session
These were run against an earlier mirrored hardening state, before the full flatten:
- focused Router syntax — PASS.
- Loader v5 syntax — PASS.
- GTWC full-name routing — PASS.
- invalid `INDYCARR` zero-module-request + explicit error Widget — PASS.
- stale v8.6-style LKG rejection — PASS.
- old repo-raw circuit-breaker simulation — PASS.

### Current environment limitation
A fresh check still returns:
`Could not resolve host: github.com`
when attempting `git ls-remote` from the execution container.

Therefore **none of the current post-flatten gates are being claimed PASS**.

Mandatory current-checkout run before merge:
1. full `.js/.mjs` syntax check.
2. `node tests/release-gate.mjs`.
3. `node tests/boundary-gate.mjs`.
4. every hardening/flat gate listed above.
5. Scriptable/iPhone Small + Medium regression for all 11 categories.
6. QA diagnostics 11/11 live run.
7. Loader v5 candidate/LKG/quarantine/offline migration test on device.
8. latency comparison for legacy audited base vs direct-module branch, especially cold-network and GitHub outage cases.

## Remaining engineering work before Dakar
1. Run the full checkout test suite and fix any failures. This is the immediate blocker.
2. Absorb lifecycle handling into SUPER FORMULA / INDYCAR / NASCAR / GTWC modules so Router no longer performs source rewriting at all.
3. Pin Loader/Router/modules to immutable release SHA/tag and add content/hash manifest for RC-04.
4. Device-regress accepted visuals. Flat modules intentionally preserve the accepted design, but visual equivalence is not yet device-verified.
5. Synchronize README / CHANGELOG / RC_QA / RELEASE_AUDIT / ATTRIBUTION wording after test results are known.
6. Codex re-audits audited base → hardening branch; disputed commits are fixed/reverted on this branch.
7. Only after all above: decide whether hardening branch is mergeable, then begin Dakar as a Registry-first dedicated module.

## Merge protocol when Codex returns
1. Fetch `hardening/v9.3-codex-handoff`.
2. Compare audited base `a09d16e11aa0f65104ba895b74e09124d30b487b` → branch tip.
3. Read this file and `category-registry.json` first.
4. Run every repository/hardening gate and syntax audit before changing architecture.
5. Review flat modules category-by-category against accepted visuals and data behavior.
6. Fix/revert disputed changes only on this branch; do not overwrite `main` wholesale.
7. Merge only after Codex audit + iPhone regression + Loader v5 migration gate pass.
