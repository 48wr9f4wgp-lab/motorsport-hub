# Motorsport Hub — Codex Handoff / Hardening Branch

## Branch contract
- Branch: `hardening/v9.3-codex-handoff`
- Audited base: `a09d16e11aa0f65104ba895b74e09124d30b487b`
- Base = exact `main` commit audited by Codex on 2026-08-25 JST.
- `main` has not been modified by this hardening work.
- Current hardening HEAD recorded here: `e3fd5a4c68272d709d643a341aa35fd1837647a5`.
- Dakar remains intentionally blocked until P0 hardening is reviewed and device-regressed.
- No public deployment / release / Store action.

## Codex audit baseline
Verdict at base: **FAIL**.
- Critical 0 / High 5 / Medium 8 / Low 3.

Primary items being addressed:
- RC-01 stale Loader/router cache can misroute newer categories to F1.
- RC-02 season-final behavior can show historical events as `次戦`.
- RC-03 legacy wrapper waterfall causes repeated remote waits.
- RC-04 remote candidate/LKG promotion is not transactional/immutable.
- RC-05 hero fallback inventory is incomplete.
- RC-06 data cache has no schema/category/season/freshness validation.
- RC-08 source rewriting can silently no-op.
- RC-09/16 expansion season-end UI and end-boundary inconsistency.
- RC-10 invalid parameter silently becomes F1.

## Completed branch work

### H1 — Router / Loader integrity
Implemented:
- Unknown Widget Parameter no longer enters default F1 path.
- Explicit configuration-error Widget on invalid parameter.
- `GT World Challenge Europe` full-name alias maps to `GTWCEU`.
- Router schema marker = 5.
- Exact manifest marker = `F1,WEC,WRC,SUPERGT,MOTOGP,FDJ,D1GP,SUPERFORMULA,INDYCAR,NASCAR,GTWCEU,QA`.
- Runtime schema/manifest/boot handshake.
- `__MH_SOURCE_REF` support for later immutable release pinning.

Loader v5 candidate added as `scriptable-loader-v5.js` while v4 remains untouched/installed:
- candidate / last-known-good / quarantine separated.
- syntax preflight via `new Function`.
- stale v8.6 router cache is invalid under schema 5.
- candidate is promoted only after successful runtime handshake.
- bad candidate is quarantined instead of replacing LKG.
- LKG execution enters repo-offline mode.
- Router fetch timeout = 8 s.

Key commits:
- `51c499a59d9a90a8d1f7f8726970856a5c528256`
- `299161c3491a978ef1a323a7d3e6c71893752adc`
- `0c4274560e094dc6d8b3db889b20320b030ec758`
- `70a25e767cdcfc9ba1f628cfb3690054671ba925`

Still open under RC-04:
- immutable release SHA/tag and content hash manifest are not finalized.
- Loader v5 has not been installed/device-tested.

### H4 bridge — outage performance circuit breaker
Router now opens a repo-raw circuit after the first failed Motorsport Hub GitHub Raw request during one execution. Nested legacy wrappers then fail locally and fall to their caches instead of each consuming another network timeout.

Commit:
- `6edeb5cc4051999fc8c5ff89fd7d9a3edf4af369`

This is only an interim bridge. **RC-03 is still open** because normal online execution still uses the wrapper waterfall. Final target remains a flattened completed module/bundle.

### H2 — Data cache integrity for expansion modules
Applied to:
- SUPER FORMULA — `bbac1d9d5a37c77518fe6b180890058b425fb7df`
- INDYCAR — `81db621605ac57d0b97bd06606edfc87a21312a3`
- NASCAR — `d5c71884e33466db433e7462daacb1b47219ff1c`
- GTWC Europe — `add80c10b6734685b96b8fdc7672ae3146a40de3`

All four now use cache envelope schema 1 with:
- `schemaVersion`
- `category`
- `season`
- `fetchedAt`
- `source`
- `ranking`
- `event`
- `data`

Rules:
- seven-day max age.
- category/season/source/schema must match.
- ranking must be an array with at least 3 valid rows.
- event timestamps/data shape must validate.
- malformed, old-format, future-dated, or stale cache is removed and not rendered as validated data.
- existing cache filenames are retained; old payload format migrates safely on the next successful live refresh, otherwise falls to built-in snapshot.

Added `tests/cache-hardening-gate.mjs` at commit:
- `261e6701bd951bff4de3f4f771777a27b8f93acc`

The test reproduces Codex RC-06 `{"ranking":{}}`, old pre-envelope cache, and an 8-day stale envelope for all four modules.

**This new gate has not been executed in this environment.** Container GitHub DNS is unavailable.
Legacy seven-category data caches are not yet migrated; RC-06 is therefore only partially closed.

### H5 — Hero inventory / runtime policy
Added machine-readable `hero-assets.json`:
- commit `f8a0507e2462054276080a7e31be361dadb869a2`.
- records active/fallback hero variants for F1, WRC, MotoGP, WEC, SUPER GT, FDJ, D1GP, SUPER FORMULA, INDYCAR, NASCAR, GTWC Europe.
- includes runtime URL, exact source page, author, license, and modification-notice obligation.

Newly verified historical fallbacks include:
- F1 Mercedes / Ferrari / McLaren Japan 2025 — Liauzh / CC BY-SA 4.0.
- WRC Ogier cropped — TTTNIS / CC0 1.0.
- MotoGP Bagnaia — Liauzh / CC BY-SA 4.0.
- WEC Toyota No.8 — MarcelX42 / CC BY-SA 4.0.
- D1 base S14 — crash71100 / CC0 1.0.

SUPER GT hardening:
- exact license for the old `front three-quarter view` fallback was not directly retrievable.
- instead of inferring it, active `motorsport-reliability-v896.js` now rewrites **all effective SUPER GT HQ hero candidates** to the previously exact-page verified CC0 No.36 asset.
- commit `1986aa5ddfb1c82bdae9b95728235b651b4ed67d`.

Added `tests/hero-manifest-gate.mjs`:
- commit `9d0d843cd40116ea40360a4720c3ae0ab8b5a2e3`.
- checks direct active hero URLs against the manifest and checks the effective SUPER GT policy rather than accepting historical raw HQ URLs as public runtime candidates.

**This new gate has not been executed in this environment.**

### H3 — Season lifecycle
Expansion categories now receive a strict fail-closed final Router transform:
- explicit `UPCOMING / ACTIVE / SEASON_ENDED` lifecycle.
- half-open `[start,end)` boundary.
- finale header changes from `次戦` to `シーズン終了`.
- source transform requires exact hit counts and postconditions; format drift fails closed instead of silently running old logic.
- Router commit: `3f50d73410b4c3e6304260d73b6b1702a29efb5c`.

Added production-linked VM gate `tests/lifecycle-hardening-gate.mjs`:
- commit `9ee0b719a79e08ea431449d8d791fb5c36dc9d36`.
- routes through the real Router and real module source.
- tests exact event-end transition and post-finale UI for SUPER FORMULA / INDYCAR / NASCAR / GTWC Europe.
- includes a deliberately broken `nextEvent` source to verify patch mismatch fails closed.

Legacy lifecycle hardening:
- D1GP lifecycle + source-ref propagation: `1da1599d25aa02cd0d97d650360d8f7a9b81ccee`.
- WEC / SUPER GT / MotoGP lifecycle in v8.9.5 layer: `dfb9ed70eac5575dd661d3c482f7f76fd345fcc1`.
- source-ref propagation through v8.9.4: `7f7f40e02b09fc79889053cba6a98f3570a369b6`.
- F1 / WRC / FDJ final lifecycle hook injected after v8.9.0 leaf patching: `e3fd5a4c68272d709d643a341aa35fd1837647a5`.

Remaining H3 issue:
- F1 online season-final behavior is handled by the final hook, but **offline + no valid cache after the finale still needs an explicit Abu Dhabi final-event fallback** so the built-in Italian snapshot cannot reappear.
- legacy cache validation is also still pending, so lifecycle work must not yet be considered fully closed.

## Tests actually executed vs pending

Actually executed earlier in this hardening session:
- focused Router syntax check — PASS.
- Loader v5 syntax check — PASS.
- VM routing: full GTWC name → GTWC — PASS.
- invalid `INDYCARR` → zero module requests + error Widget — PASS.
- stale v8.6 Router LKG rejected by Loader v5 — PASS.
- repo-raw circuit-breaker focused simulation — PASS.
- `tests/router-hardening-gate.mjs` focused mirrored run — PASS at that stage.

Environment limitation:
- container cannot resolve `github.com`, so the branch cannot currently be cloned to run the full repository directly.

Added but **not yet executed after the latest branch changes**:
- `tests/cache-hardening-gate.mjs`
- `tests/hero-manifest-gate.mjs`
- `tests/lifecycle-hardening-gate.mjs`

Also mandatory before merge:
- `node tests/release-gate.mjs`
- `node tests/boundary-gate.mjs`
- full `.js/.mjs` `node --check`
- all new hardening gates from a real checkout
- iPhone/Scriptable Small + Medium regression matrix
- Loader v5 migration/offline/LKG device test

## Next work order
1. Close F1 offline post-finale fallback.
2. Migrate legacy seven-category data cache integrity or implement it in the flattened replacement.
3. Flatten the legacy wrapper waterfall without visual changes; current circuit breaker is not the final architecture.
4. Harden WRC / SUPER FORMULA / GTWC table identity and add fixtures.
5. Add category registry/build-time source of truth for Router/diagnostics/tests/docs before Dakar.
6. Synchronize README / CHANGELOG / RC_QA / RELEASE_AUDIT / ATTRIBUTION after behavior stabilizes.
7. Codex re-audit base → branch HEAD, then device regression, then merge decision.

## Merge protocol when Codex returns
1. Fetch `hardening/v9.3-codex-handoff`.
2. Compare `a09d16e11aa0f65104ba895b74e09124d30b487b` → branch HEAD.
3. Read this file before modifying anything.
4. Run every repository/hardening gate and full syntax audit.
5. Review commits individually; disputed changes are fixed/reverted on this branch, never by overwriting `main` wholesale.
6. Merge only after Codex audit + device regression pass.
