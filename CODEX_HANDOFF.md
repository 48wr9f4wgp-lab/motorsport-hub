# Motorsport Hub — Codex Handoff / Hardening Branch

## Start here
- Repository: `48wr9f4wgp-lab/motorsport-hub`
- Branch: `hardening/v9.3-codex-handoff`
- Codex-audited base: `a09d16e11aa0f65104ba895b74e09124d30b487b`
- `main` has not been modified by this hardening line.
- Public release / Store action: **not performed**.
- Dakar: **intentionally blocked** until this hardening line is re-audited and merged/accepted.

Current branch verdict:

**HARDENING CANDIDATE — DETERMINISTIC CI PASS / FINAL CODEX + LOADER REVIEW PENDING**

Read in this order:
1. `CODEX_HANDOFF.md`
2. `category-registry.json`
3. `RC_QA.md`
4. `DEVICE_QA_POLICY.md`
5. `POST_CODEX_VISUAL_AUTOMATION.md`

---

## What Codex originally found
The audited base was rated **FAIL** with:
- Critical: 0
- High: 5
- Medium: 8
- Low: 3

Primary issues targeted by this branch:
- RC-01 stale Router/LKG could misroute new categories to F1.
- RC-02 / RC-09 / RC-16 season-final and event-boundary bugs.
- RC-03 deep serial remote wrapper waterfall.
- RC-04 mutable remote source + unsafe candidate/LKG promotion.
- RC-05 incomplete reachable Hero attribution inventory.
- RC-06 unvalidated/stale/cross-category data cache.
- RC-08 runtime source rewriting could silently no-op.
- RC-10 invalid Widget Parameter silently became F1.

---

## Current architecture
`motorsport-hub.js` is a direct category module Router.

Original seven now route directly:
- F1 → `f1-widget-flat-v1000.js`
- WEC → `wec-widget-flat-v1000.js`
- WRC → `wrc-widget-flat-v1000.js`
- SUPER GT → `supergt-widget-flat-v1000.js`
- MotoGP → `motogp-widget-flat-v1000.js`
- FDJ → `fdj-widget-flat-v1000.js`
- D1GP → `d1gp-widget-flat-v1000.js`

Expansion modules:
- SUPER FORMULA → `superformula-widget.js`
- INDYCAR → `indycar-widget.js`
- NASCAR → `nascar-widget.js`
- GTWC Europe → `gtwc-europe-widget.js`

QA:
- `motorsport-diagnostics-v890.js`

Current Router no longer references the old `motorsport-reliability-v896.js` / D1 reliability path for the original seven.

Legacy wrapper files remain only as historical/rollback artifacts.

---

## H1 — Router / Loader hardening
Implemented:
- invalid Widget Parameter → explicit configuration-error Widget;
- full-name aliases including GT World Challenge Europe;
- Router schema = 5;
- exact category manifest;
- Router boot/schema/manifest handshake;
- `__MH_SOURCE_REF` support;
- Loader v5 candidate / LKG / quarantine split;
- syntax preflight;
- stale v8.6-style Router rejection;
- candidate promotion only after successful Router boot handshake.

Still open under RC-04:
- final public Loader must pin an immutable release commit/tag rather than a mutable branch;
- final integrity/content-hash policy still needs a release decision;
- Loader v5 candidate/LKG/quarantine/offline behavior still needs real Scriptable migration QA.

Do not replace the user's installed normal Loader during review until migration behavior is accepted.

---

## H2 — Data cache integrity
All 11 categories are recorded with `dataCacheSchema: 1`.

Cache envelope contract:
- schemaVersion
- category
- season
- fetchedAt
- source
- ranking
- event
- data

Malformed, old-format, stale, future-dated, wrong-category or wrong-season payloads are rejected instead of treated as current data.

`tests/cache-hardening-gate.mjs` is green in CI.

---

## H3 — Event lifecycle
Original seven flat modules directly implement:
- `UPCOMING`
- `ACTIVE`
- `SEASON_ENDED`

Event windows use half-open `[start,end)` semantics.
Finale UI uses `シーズン終了` / `SEASON END` rather than resurrecting a historical `次戦`.

Current retention windows:
- F1: 4h + explicit Abu Dhabi offline finale fallback
- WEC: 10h
- WRC: 4 days
- SUPER GT: 8h
- MotoGP: 4h
- FDJ: 40h
- D1GP: 40h

Remaining cleanup:
SUPER FORMULA / INDYCAR / NASCAR / GTWC Europe still receive a strict fail-closed Router lifecycle source transform. It has exact hit-count/postcondition checks and is covered by `tests/lifecycle-hardening-gate.mjs`, but **the final architecture should absorb the lifecycle code directly into those four modules and remove Router source rewriting entirely**.

---

## H4 — Wrapper waterfall
The audited base used a deep remote chain similar to:

`Router → v896 → v895 → v894 → v892 → v890 → universal → leaf`

That path is no longer used by the original seven on this branch.

Each original category now receives one direct module from Router.

This is structurally verified by:
- `tests/router-hardening-gate.mjs`
- category-specific flat gates
- `tests/render-smoke-gate.mjs`

RC-03 is therefore structurally resolved on the branch, subject to Codex re-audit and final performance comparison.

---

## H5 — Hero assets
`hero-assets.json` is scoped to assets reachable from current Registry modules.

`tests/hero-manifest-gate.mjs` checks runtime URL-set equality against the manifest.

SUPER GT current policy:
- verified CC0 #36 au TOM'S asset only;
- unverified historical fallback images are not current runtime candidates.

Post-Codex work is intentionally separated into `POST_CODEX_VISUAL_AUTOMATION.md`:
- high-resolution Hero Asset Manager;
- automatic subject-aware crop for Small/Medium;
- text-safe-area reservation;
- veil generation;
- image-quality rejection;
- LKG Hero fallback;
- automated visual regression.

Target: **Hero changes must not require manual crop tuning every update.**

---

## Current deterministic CI status
Workflow:
- `.github/workflows/hardening-ci.yml`

First complete green run:
- Run #3
- Run ID `32949810775`
- Head `553ddfdae5069152054bb2f5d52a3be850460660`
- Conclusion: **SUCCESS**

Expanded green run including 22-case render smoke:
- Run #5
- Run ID `32950012839`
- Head `f734b2239bfffd23912fd9c27ef2afc7d97ab1f5`
- Conclusion: **SUCCESS**

The CI performs:
- every `.js/.mjs` syntax check;
- release gate;
- boundary gate;
- Router hardening gate;
- Registry gate;
- cache gate;
- Hero manifest gate;
- lifecycle gate;
- all original-seven flat gates;
- 11 categories × Small/Medium automated render smoke.

The CI intentionally runs all gates even if one fails, so one push reports the full failure set.

Important history:
- initial CI failures were both a faulty MotoGP **test assertion**, not the MotoGP implementation;
- the assertion was corrected;
- subsequent full CI is green.

---

## Current device evidence
Hardening Scriptable dependency diagnostic:
- **11/11 LIVE — PASS** on iPhone.

WEC initially showed `10/11` due to an over-strict parser/diagnostic identity check. That issue was reproduced, corrected, and retested to `11/11 LIVE`.

Current pixel-level visual locks on the hardening path:
- F1 Small/Medium: PASS
- WRC Small/Medium: PASS
- MotoGP Small/Medium: PASS
- FDJ Small/Medium: PASS

Do **not** require a human to manually rerun all 11 × Small/Medium after every non-visual change.

Canonical QA policy is `DEVICE_QA_POLICY.md`:
- deterministic CI covers routine functional render regressions;
- `tests/render-smoke-gate.mjs` covers 22 Small/Medium functional render cases;
- iPhone manual QA is risk-based and used for pixel/layout/Scriptable-native behavior.

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
2. Compare audited base `a09d16e11aa0f65104ba895b74e09124d30b487b` → branch tip.
3. Confirm latest Hardening CI is green before editing anything.
4. Review architecture/security changes category-by-category rather than replacing the branch wholesale.
5. Re-evaluate original RC-01 through RC-16 against current code.
6. Prioritize remaining items:
   - remove expansion-four Router source rewrite;
   - finalize immutable release pin/integrity policy;
   - verify Loader v5 migration/offline behavior on Scriptable;
   - performance comparison vs audited base;
   - only risk-based final iPhone visual spot checks.
7. Preserve the accepted visual locks unless a verified defect requires change.
8. Do not start Dakar until the re-audit says this hardening line is mergeable.

---

## Merge protocol
- Never overwrite `main` wholesale.
- Fix or revert disputed commits only on this hardening branch.
- Require green CI after every disputed fix.
- Merge only after Codex re-audit + Loader migration decision + risk-based device QA.
- Public release still requires explicit user approval.
