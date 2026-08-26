# Motorsport Hub — Codex Handoff / Hardening Branch

## Start here
- Repository: `48wr9f4wgp-lab/motorsport-hub`
- Branch: `hardening/v9.3-codex-handoff`
- Codex-audited base: `a09d16e11aa0f65104ba895b74e09124d30b487b`
- `main` has not been modified by this hardening line.
- Public release / Store action: **not performed**.
- Dakar: **intentionally blocked** until this hardening line is re-audited and accepted.

Current branch verdict:

**HARDENING CANDIDATE — AUTOMATED GATES + LOADER V6 DEVICE QA PASS / CODEX RE-AUDIT PENDING**

Read in this order:
1. `CODEX_HANDOFF.md`
2. `category-registry.json`
3. `RC_QA.md`
4. `DEVICE_QA_POLICY.md`
5. `POST_CODEX_VISUAL_AUTOMATION.md`

---

## Original Codex audit
Base `a09d16e...` was rated **FAIL**:
- Critical: 0
- High: 5
- Medium: 8
- Low: 3

Primary findings targeted by this branch:
- RC-01 stale Router/LKG could misroute categories to F1.
- RC-02 / RC-09 / RC-16 season-final and event-boundary bugs.
- RC-03 serial remote wrapper waterfall.
- RC-04 mutable remote source + unsafe candidate/LKG promotion.
- RC-05 incomplete reachable Hero attribution inventory.
- RC-06 unvalidated/stale/cross-category data cache.
- RC-08 runtime source rewriting could silently no-op.
- RC-10 invalid Widget Parameter silently became F1.

---

## Current architecture
`motorsport-hub.js` is a direct category-module Router.

Original seven:
- F1 → `f1-widget-flat-v1000.js`
- WEC → `wec-widget-flat-v1000.js`
- WRC → `wrc-widget-flat-v1000.js`
- SUPER GT → `supergt-widget-flat-v1000.js`
- MotoGP → `motogp-widget-flat-v1000.js`
- FDJ → `fdj-widget-flat-v1000.js`
- D1GP → `d1gp-widget-flat-v1000.js`

Expansion four:
- SUPER FORMULA → `superformula-widget.js`
- INDYCAR → `indycar-widget.js`
- NASCAR → `nascar-widget.js`
- GTWC Europe → `gtwc-europe-widget.js`

QA:
- `motorsport-diagnostics-v890.js`

Current Router guarantees:
- no legacy reliability-wrapper runtime path;
- no nested wrapper waterfall;
- no Router runtime source rewriting;
- one Router + one selected category module path;
- explicit invalid-parameter failure;
- Router schema/manifest handshake;
- optional immutable release integrity enforcement.

Legacy wrapper files remain only as historical/rollback artifacts and are not current runtime dependencies.

---

## Structurally resolved findings

### RC-03 — wrapper waterfall
Old multi-hop runtime chain is no longer reachable from current Router.

Enforced by:
- `tests/router-hardening-gate.mjs`
- flat-module gates
- `tests/render-smoke-gate.mjs`

### RC-08 — runtime source rewriting
All four expansion modules own lifecycle directly and carry `MH_LIFECYCLE_BAKED=1`.

Router no longer transforms module source before execution.

Enforced by:
- `tests/lifecycle-hardening-gate.mjs`
- `tests/release-gate.mjs`

### RC-06 — data cache integrity
All 11 categories use `dataCacheSchema: 1` and validate schema/category/season/fetchedAt/source/ranking/event/data.

Malformed, stale, future-dated, wrong-category and wrong-season payloads are rejected.

### RC-05 — Hero inventory
`hero-assets.json` is scoped to URLs reachable from current Registry modules.

`tests/hero-manifest-gate.mjs` enforces runtime URL-set equality.

SUPER GT current runtime uses only the exact-page verified CC0 #36 asset.

---

## RC-04 — immutable release hardening
This is the main area Codex should attack-test on return.

### Current implementation
Release packaging tool:
- `tools/generate-release-package.mjs`

Generated descriptor pins:
- immutable 40-char Git commit `sourceRef`;
- Router byte length + SHA-256;
- every 11 category modules + QA byte length + SHA-256;
- Router schema;
- category manifest;
- release ID / cache namespace.

Generated Loader v6:
- never uses mutable `main` for the fixed release;
- verifies Router syntax, markers, bytes and SHA-256 before execution;
- passes the immutable release descriptor into Router;
- Router verifies the selected module bytes/SHA-256;
- candidate / LKG / quarantine are release-namespaced;
- tampered Router/module/sourceRef mismatch fails closed;
- offline fallback executes only previously verified immutable LKG.

### Automated coverage
- `tests/integrity-gate.mjs`: PASS.
- `tests/release-package-generator-gate.mjs`: PASS.

These cover valid candidate, tampered Router/module, wrong sourceRef, corrupt cache, and verified offline LKG behavior.

### Real-device Scriptable evidence — PASS
Fixed immutable sourceRef tested on iPhone:
- `1f22919dc2a89053bff60f96b4c173ba6fb49076`

Online candidate run:
- `11/11 LIVE — データ経路OK`
- `IMMUTABLE ✓ · CANDIDATE · 1f22919dc2a8`
- verdict: **PASS**

Fully offline run (airplane mode + Wi-Fi off):
- `0/11 LIVE — 要確認`
- dependencies correctly reported `NET`;
- `IMMUTABLE ✓ · LKG · 1f22919dc2a8`
- verdict: **PASS**

This proves on real Scriptable/iPhone:
1. immutable candidate acquisition;
2. Router integrity validation;
3. selected-module integrity path;
4. release-namespaced LKG promotion;
5. fully offline verified-LKG recovery;
6. no fallback to mutable `main` or unrelated historical Router cache.

### What remains for Codex on RC-04
Do **not** redesign this from scratch unless a concrete flaw is found.

Attack-test:
1. Scriptable SHA-256 implementation correctness;
2. sourceRef propagation Loader → Router → category module;
3. cache namespace isolation between releases;
4. candidate/LKG/quarantine transitions;
5. downgrade/rollback semantics;
6. any bypass where mutable code can still execute in integrity mode;
7. failure behavior under truncated/altered payloads.

Device migration/offline QA is no longer pending; it passed on 2026-08-26.

---

## Event lifecycle
All 11 modules own lifecycle directly.

States:
- `UPCOMING`
- `ACTIVE`
- `SEASON_ENDED`

Active windows use half-open `[start,end)` semantics. Finale UI uses `シーズン終了` / `SEASON END` rather than a historical `次戦`.

Retention/ranges:
- F1: 4h + explicit Abu Dhabi offline finale fallback
- WEC: 10h
- WRC: 4 days
- SUPER GT: 8h
- MotoGP: 4h
- FDJ: 40h
- D1GP: 40h
- SUPER FORMULA / INDYCAR / NASCAR / GTWC Europe: module-owned explicit start/end ranges

---

## Current CI
Workflow:
- `.github/workflows/hardening-ci.yml`

Current suite includes:
- full JS/MJS syntax audit;
- release gate;
- boundary gate;
- Router hardening gate;
- Registry gate;
- cache hardening gate;
- Hero manifest gate;
- lifecycle gate;
- integrity gate;
- release-package generator gate;
- all original-seven flat gates;
- 11 categories × Small/Medium = 22 render smoke cases.

After all gates succeed, CI:
1. generates immutable Loader v6 + integrity manifest artifact;
2. syncs only tested runtime files to `hardening-live`.

This prevents iPhone testing against intermediate broken commits.

---

## Current device evidence
- live dependency diagnostic: **11/11 LIVE — PASS**.
- immutable Loader v6 online candidate: **PASS**.
- immutable Loader v6 fully offline verified LKG: **PASS**.

Pixel-level visual locks on current hardening paths:
- F1 Small/Medium: PASS
- WRC Small/Medium: PASS
- MotoGP Small/Medium: PASS
- FDJ Small/Medium: PASS

Routine 11×Small/Medium manual regression is retired. Canonical policy: `DEVICE_QA_POLICY.md`.

---

## Data invariants that must not regress

### F1
- schedule + standings both required before live promotion;
- partial refresh cannot overwrite valid cache.

### WEC
- intended manufacturer table only;
- Toyota naming: **TR010 Hybrid / TOYOTA RACING**.

### WRC
- FIA identity: `2026 FIA World Rally Championship for Drivers`;
- unrelated WRC tables cannot become fresh driver standings.

### SUPER GT
- GT500 only;
- #36: `TOYOTA · GR Supra ｜ au TOM'S`
- #16: `HONDA · PRELUDE-GT ｜ ARTA`
- #14: `TOYOTA · GR Supra ｜ ROOKIE`

### MotoGP
- Riders' Championship + MotoGP table identity.

### FDJ
- duplicate RYUMA normalization.

### D1GP
- driver standings isolated from single-run ranking.

---

## What Codex should do immediately on return
1. Fetch `hardening/v9.3-codex-handoff`.
2. Compare audited base `a09d16e11aa0f65104ba895b74e09124d30b487b` → current branch tip.
3. Confirm latest Hardening CI is green before editing anything.
4. Re-evaluate original RC-01 through RC-16 against **current reachable code**, not historical wrappers.
5. Attack-test RC-04 immutable Loader/Router path, downgrade semantics and cache isolation.
6. Benchmark runtime/network behavior vs audited base where useful.
7. Preserve accepted visual locks unless a verified defect requires change.
8. Review `POST_CODEX_VISUAL_AUTOMATION.md` after release hardening is stable.
9. Do not start Dakar until the re-audit says this hardening line is mergeable/acceptable.

---

## Post-Codex visual automation
`POST_CODEX_VISUAL_AUTOMATION.md` is a committed next-phase requirement:
- high-resolution Hero Asset Manager;
- automatic subject-aware Small/Medium crop;
- text-safe-area reservation;
- automatic veil generation;
- image-quality rejection;
- LKG Hero fallback;
- automated visual regression.

Target: **Hero changes must not require manual crop tuning every update.**

---

## Merge protocol
- Never overwrite `main` wholesale.
- Fix disputed findings only on the hardening branch.
- Require green CI after every hardening fix.
- Merge only after Codex re-audit + risk-based device QA decision.
- Public release still requires explicit user approval.
