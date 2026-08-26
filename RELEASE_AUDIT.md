# Motorsport Hub — Release Audit

## Current decision
- Branch: `hardening/v9.3-codex-handoff`
- Audited base: `a09d16e11aa0f65104ba895b74e09124d30b487b`
- Current branch is a **hardening candidate, not a release-approved build**.
- `main` has not been modified by this hardening work.
- No public release / Store action has been performed.

Current status:

**AUTOMATED GATES PASS + LOADER V6 DEVICE QA PASS / CODEX RE-AUDIT PENDING**

---

## Architecture status
The current Router is a direct category-module Router for 11 categories + QA.

Original seven:
- F1 → `f1-widget-flat-v1000.js`
- WEC → `wec-widget-flat-v1000.js`
- WRC → `wrc-widget-flat-v1000.js`
- SUPER GT → `supergt-widget-flat-v1000.js`
- MotoGP → `motogp-widget-flat-v1000.js`
- FDJ → `fdj-widget-flat-v1000.js`
- D1GP → `d1gp-widget-flat-v1000.js`

Expansion:
- SUPER FORMULA → `superformula-widget.js`
- INDYCAR → `indycar-widget.js`
- NASCAR → `nascar-widget.js`
- GTWC Europe → `gtwc-europe-widget.js`

QA:
- `motorsport-diagnostics-v890.js`

Current Router has:
- no v8.9 reliability-wrapper runtime path;
- no nested category-wrapper waterfall;
- no runtime source rewriting;
- explicit invalid-parameter failure;
- Router schema/manifest handshake;
- optional immutable SHA-256 release integrity enforcement.

---

## Audit finding status
| Finding | Current hardening status |
| --- | --- |
| RC-01 stale Router/LKG routing | Loader v6 uses release-namespaced candidate/LKG/quarantine; stale/mismatched release caches are not accepted; device candidate + offline LKG path PASS |
| RC-02 historical event shown as next race | All 11 modules implement explicit lifecycle; deterministic boundary/lifecycle gates PASS |
| RC-03 serial wrapper waterfall | **Structurally removed from current Router**; direct modules enforced by CI |
| RC-04 mutable/unverified release source | Immutable commit + byte length + SHA-256 Router/module verification implemented; automated tamper tests PASS; online candidate + fully offline verified-LKG iPhone QA PASS; Codex hostile re-audit remains |
| RC-05 incomplete Hero inventory | Runtime-only Hero manifest + exact URL-set gate PASS |
| RC-06 unsafe data cache | Schema-1 validated cache implemented for all 11 categories; cache gate PASS |
| RC-08 silent runtime source rewrite | **Closed in current architecture**; Router source transform removed and expansion lifecycle baked into modules |
| RC-09/16 season lifecycle/boundaries | Half-open lifecycle and finale behavior enforced by deterministic gates |
| RC-10 invalid parameter → F1 | Explicit invalid-parameter error path implemented and Router gate PASS |

---

## Immutable release hardening
Release packaging tool:
- `tools/generate-release-package.mjs`

Release descriptor contains:
- immutable 40-char commit SHA;
- Router SHA-256 + byte length;
- all 11 category modules + QA SHA-256 + byte length;
- Router schema;
- category manifest;
- release namespace.

Generated Loader v6:
- fetches Router from immutable commit SHA, not mutable `main`;
- validates syntax, markers, byte length and SHA-256 before execution;
- passes integrity descriptor to Router;
- Router validates the selected module byte length and SHA-256;
- release-namespaces candidate/LKG/quarantine caches;
- offline fallback runs only verified immutable LKG;
- tampered Router/module/sourceRef mismatch fails closed.

Automated evidence:
- `tests/integrity-gate.mjs`: PASS
- `tests/release-package-generator-gate.mjs`: PASS

### iPhone / Scriptable Loader v6 evidence — 2026-08-26
Fixed sourceRef:
- `1f22919dc2a89053bff60f96b4c173ba6fb49076`

Online immutable candidate:
- `11/11 LIVE — データ経路OK`
- `IMMUTABLE ✓ · CANDIDATE · 1f22919dc2a8`
- verdict: **PASS**

Fully offline verified LKG:
- airplane mode enabled;
- Wi-Fi disabled;
- `0/11 LIVE — 要確認` with dependency `NET` failures as expected;
- `IMMUTABLE ✓ · LKG · 1f22919dc2a8`
- verdict: **PASS**

This confirms on real Scriptable:
- immutable Router acquisition/integrity path works;
- verified candidate can be promoted to release-namespaced LKG;
- fully offline boot uses only verified LKG;
- QA Router still executes locally while external dependencies correctly fail;
- no mutable `main` or historical unrelated Router fallback was observed.

**RC-04 is materially mitigated in code, automated tests and real-device migration/offline behavior. Remaining closure work is Codex attack-testing, downgrade semantics review and reachable-path re-audit.**

---

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

QA diagnostics checks the same dependency groups. F1 requires both schedule and standings checks.

---

## Cache audit
`category-registry.json` records `dataCacheSchema: 1` for all 11 categories.

Acceptance requirements include:
- matching schema/category/season/source;
- finite and fresh `fetchedAt`;
- valid ranking structure;
- valid event/data structure.

Invalid cache is removed rather than treated as current live data.

---

## Lifecycle audit
All 11 modules own lifecycle directly.

Original-seven retention:
- F1 4h
- WEC 10h
- WRC 4d
- SUPER GT 8h
- MotoGP 4h
- FDJ 40h
- D1GP 40h

Expansion modules use explicit event start/end ranges directly in their own module code.

Active windows are half-open `[start,end)`.
Final state is `SEASON_ENDED` with `シーズン終了 / SEASON END`.

---

## Hero/legal audit
`hero-assets.json` is scoped to image URLs reachable from current Registry modules.

`tests/hero-manifest-gate.mjs` requires exact set equality between:
1. Wikimedia image URLs found in all current category modules; and
2. runtime URLs recorded in Hero manifest.

Important protections:
- SUPER GT direct runtime uses only the exact-page verified CC0 No.36 image variants.
- old unverified historical SUPER GT fallback images are not current direct-runtime assets.
- D1GP direct runtime uses the verified action image.

---

## Test status
Current GitHub Actions hardening suite is **GREEN**.

It includes:
- syntax audit for all JS/MJS;
- release gate;
- boundary gate;
- Router hardening gate;
- Registry gate;
- cache hardening gate;
- Hero manifest gate;
- lifecycle gate;
- immutable integrity gate;
- release-package generator gate;
- all original-seven flat gates;
- 11 categories × Small/Medium = 22 automated render smoke cases.

After green CI it also:
- creates immutable Loader v6 + integrity manifest artifact;
- synchronizes only tested runtime files to `hardening-live`.

---

## Device evidence
- current hardening dependency diagnostic: **11/11 LIVE — PASS**.
- immutable Loader v6 online candidate: **PASS**.
- immutable Loader v6 fully offline verified LKG: **PASS**.
- current hardening pixel-level locks: F1, WRC, MotoGP, FDJ Small/Medium PASS.

Routine 22-widget human regression is retired. Canonical policy: `DEVICE_QA_POLICY.md`.

---

## Remaining blockers before final RC approval
1. Codex re-audit audited base → current hardening tip, especially RC-04 hostile review, downgrade semantics, cache isolation and any reachable bypass.
2. Final risk-based iPhone visual spot checks only for paths whose renderer/Hero changed since accepted evidence.
3. Final README / CHANGELOG synchronization after Codex decision.
4. Explicit user approval before public release.

Dakar remains blocked until the hardening line is accepted.

---

## Release decision
**NOT RELEASE APPROVED.**

Automated hardening is green and Loader v6 migration/offline device QA has passed. Public distribution still waits for Codex re-audit, any required risk-based visual confirmation, final documentation synchronization and explicit user approval.
