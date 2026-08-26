# Motorsport Hub — Codex Handoff / Hardening Branch

## Start here
- Repository: `48wr9f4wgp-lab/motorsport-hub`
- Branch: `hardening/v9.3-codex-handoff`
- Codex-audited base: `a09d16e11aa0f65104ba895b74e09124d30b487b`
- `main` has not been modified by this hardening line.
- Public release / Store action: **not performed**.
- Dakar: **intentionally blocked** until this hardening line is re-audited and accepted.

Current branch verdict:

**HARDENING CANDIDATE — AUTOMATED GATES PASS / FINAL CODEX + DEVICE REVIEW PENDING**

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
`motorsport-hub.js` is now a direct category module Router.

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

Current Router:
- no legacy `motorsport-reliability-v896.js` / D1 reliability runtime path;
- no nested wrapper waterfall;
- no runtime module source rewriting;
- one Router fetch + one selected category module path;
- Router schema = 5;
- exact category manifest;
- invalid parameters fail explicitly instead of silently becoming F1.

Legacy wrapper files remain only as historical/rollback artifacts and are not current runtime dependencies.

---

## Closed / structurally resolved items

### RC-03 — wrapper waterfall
The old chain similar to:

`Router → v896 → v895 → v894 → v892 → v890 → universal → leaf`

is no longer used by current routes.

Verified by:
- `tests/router-hardening-gate.mjs`
- category-specific flat gates
- `tests/render-smoke-gate.mjs`

Treat RC-03 as structurally resolved unless re-audit finds a new reachable dependency path.

### RC-08 — Router runtime source rewriting
SUPER FORMULA / INDYCAR / NASCAR / GTWC Europe now own lifecycle logic directly and contain `MH_LIFECYCLE_BAKED=1`.

Router no longer performs `String.replace`, `replaceExact`, or lifecycle source transforms before execution.

`tests/lifecycle-hardening-gate.mjs` and `tests/release-gate.mjs` enforce this architecture.

Treat RC-08 as **closed in current hardening code**, subject to re-audit.

### RC-06 — cache envelope
All 11 categories use `dataCacheSchema: 1` and validate:
- schemaVersion
- category
- season
- fetchedAt
- source
- ranking
- event
- data

Malformed, stale, future-dated, wrong-category and wrong-season payloads are rejected.

`tests/cache-hardening-gate.mjs` is green.

---

## RC-04 — immutable release hardening
This area has materially changed since the original audit.

### Current implementation
Router `v9.4.4-hardening` supports release integrity mode using:
- immutable 40-char Git commit `sourceRef`;
- byte-length verification;
- SHA-256 verification;
- release-namespaced module cache;
- fail-closed sourceRef mismatch handling.

Release package generator:
- `tools/generate-release-package.mjs`

Generated descriptor contains:
- Router SHA-256 + byte count;
- every 11 category module + QA SHA-256 + byte count;
- Router schema;
- category manifest;
- immutable sourceRef;
- release ID.

Generated Loader v6:
- hard-pins immutable commit SHA;
- verifies Router syntax/markers/bytes/SHA-256 before execution;
- passes the release integrity descriptor into Router;
- Router verifies the selected category module bytes/SHA-256 before execution;
- uses release-namespaced candidate/LKG/quarantine;
- offline fallback runs only a previously verified immutable LKG;
- tampered Router/module fails closed.

### Automated tests
- `tests/integrity-gate.mjs`
  - valid candidate executes;
  - tampered module rejected;
  - sourceRef mismatch rejected before fetch;
  - verified offline cache executes;
  - corrupt cache removed/rejected.
- `tests/release-package-generator-gate.mjs`
  - descriptor hashes/byte counts match Node crypto;
  - generated Loader contains immutable sourceRef;
  - mutable `/main/` Router URL forbidden;
  - valid generated Loader fixture executes/promotes LKG;
  - tampered Router rejected;
  - offline verified LKG executes.

Latest generated immutable package evidence:
- Hardening CI run #26
- Run ID: `32952423421`
- Head: `30faaae959835d4342a0f23594b4b667d1923cda`
- Result: **SUCCESS**
- Artifact: `motorsport-hub-immutable-30faaae959835d4342a0f23594b4b667d1923cda`
- Artifact ID: `9600650504`
- Artifact digest: `sha256:5147bb874c7635b5d07da582dfa39a947eda2c8eb16a72a9f74cab3a4f32dd8f`

### Remaining RC-04 work for Codex
Do **not** redesign this from scratch unless a concrete flaw is found.

Re-audit the implementation for:
1. hash implementation correctness in Scriptable JS;
2. immutable sourceRef propagation Loader → Router → category module fetch;
3. cache namespace isolation between releases;
4. candidate/LKG/quarantine failure behavior;
5. any bypass where mutable remote code could still execute in release mode;
6. downgrade/rollback semantics.

Real-device Loader v6 migration/offline QA remains pending and should be targeted, not a full 22-widget visual matrix.

---

## Event lifecycle
All 11 modules own their lifecycle directly.

States:
- `UPCOMING`
- `ACTIVE`
- `SEASON_ENDED`

Event windows use half-open `[start,end)` semantics.
Finale UI uses `シーズン終了` / `SEASON END` rather than a historical `次戦`.

Retention/ranges:
- F1: 4h + explicit Abu Dhabi offline finale fallback
- WEC: 10h
- WRC: 4 days
- SUPER GT: 8h
- MotoGP: 4h
- FDJ: 40h
- D1GP: 40h
- SUPER FORMULA / INDYCAR / NASCAR / GTWC Europe: explicit module-owned start/end ranges

---

## Hero assets
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

## Current deterministic CI
Workflow:
- `.github/workflows/hardening-ci.yml`

Current gates:
- syntax audit for all `.js/.mjs`;
- `release-gate`;
- `boundary-gate`;
- `router-hardening-gate`;
- `registry-gate`;
- `cache-hardening-gate`;
- `hero-manifest-gate`;
- `lifecycle-hardening-gate`;
- `integrity-gate`;
- `release-package-generator-gate`;
- `render-smoke-gate`;
- all original-seven flat gates.

`render-smoke-gate` covers **11 categories × Small/Medium = 22 functional renders**.

After all gates succeed on the hardening branch, CI:
1. generates immutable Loader v6 + integrity manifest as a 14-day workflow artifact;
2. syncs only the tested runtime files to `hardening-live`.

This prevents iPhone testing against intermediate broken commits.

---

## Current device evidence
Hardening Scriptable dependency diagnostic:
- **11/11 LIVE — PASS** on iPhone.

Current pixel-level visual locks on hardening paths:
- F1 Small/Medium: PASS
- WRC Small/Medium: PASS
- MotoGP Small/Medium: PASS
- FDJ Small/Medium: PASS

Previously accepted expansion visuals remain baseline evidence, but do not manually rerun all 11 × Small/Medium after every non-visual change.

Canonical QA policy: `DEVICE_QA_POLICY.md`.

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
4. Re-evaluate original RC-01 through RC-16 against current reachable code.
5. Specifically attack-test RC-04 immutable release mode rather than redoing already-green parser/layout work.
6. Benchmark runtime/network behavior vs audited base where useful.
7. Run targeted Scriptable Loader v6 migration/offline QA or provide precise steps for the iPhone checks that cannot be automated.
8. Preserve accepted visual locks unless a verified defect requires change.
9. Review `POST_CODEX_VISUAL_AUTOMATION.md` only after release hardening is stable.
10. Do not start Dakar until the re-audit says this hardening line is mergeable/acceptable.

---

## Merge protocol
- Never overwrite `main` wholesale.
- Fix disputed findings only on the hardening branch.
- Require green CI after every hardening fix.
- Merge only after Codex re-audit + Loader v6 migration/offline decision + risk-based device QA.
- Public release still requires explicit user approval.
