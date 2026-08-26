# Motorsport Hub — Release Candidate QA

## Current verdict
- Branch: `hardening/v9.3-codex-handoff`
- Audited base: `a09d16e11aa0f65104ba895b74e09124d30b487b`
- Architecture: 11 categories + QA, one direct category module per route.
- Legacy reliability-wrapper waterfall: **removed from current Router path**.
- Runtime source rewriting in Router: **removed**.
- Deterministic repository CI: **PASS**.
- Automated 11 categories × Small/Medium render smoke: **22/22 PASS**.
- iPhone live data diagnostic: **11/11 LIVE — PASS**.
- Immutable release integrity path: **automated PASS; device migration QA pending**.
- Public release: **NOT authorized / NOT performed**.

Current status:

**HARDENING CANDIDATE — AUTOMATED GATES PASS / FINAL DEVICE + CODEX REVIEW PENDING**

This branch is not yet promoted to final RC PASS because the generated Loader v6 path still needs targeted Scriptable device migration/offline QA, Codex re-audit remains pending, and the final risk-based visual spot checks have not been completed.

---

## Automated hardening evidence

### GitHub Actions Hardening CI
Workflow: `.github/workflows/hardening-ci.yml`

Key green milestones:
- Run #3 / ID `32949810775`: first full hardening green after MotoGP gate correction.
- Run #5 / ID `32950012839`: 22-case Small/Medium render smoke added and green.
- Run #25 / ID `32952305230`: immutable integrity gate + release-package generator gate green.
- Run #26 / ID `32952423421`: immutable release candidate package generation + artifact upload green.

Latest immutable package run:
- Head: `30faaae959835d4342a0f23594b4b667d1923cda`
- Result: **SUCCESS**
- Artifact: `motorsport-hub-immutable-30faaae959835d4342a0f23594b4b667d1923cda`
- Artifact ID: `9600650504`
- Artifact digest: `sha256:5147bb874c7635b5d07da582dfa39a947eda2c8eb16a72a9f74cab3a4f32dd8f`
- Contents: generated `release-integrity.json` + generated `scriptable-loader-v6.js`

The workflow runs the full syntax audit, executes all deterministic gates without stopping at the first failure, generates an immutable RC package only after the gates pass, and syncs only green runtime files to `hardening-live`.

### Deterministic gates currently green
- `tests/release-gate.mjs`
- `tests/boundary-gate.mjs`
- `tests/router-hardening-gate.mjs`
- `tests/registry-gate.mjs`
- `tests/cache-hardening-gate.mjs`
- `tests/hero-manifest-gate.mjs`
- `tests/lifecycle-hardening-gate.mjs`
- `tests/integrity-gate.mjs`
- `tests/release-package-generator-gate.mjs`
- `tests/render-smoke-gate.mjs`
- `tests/f1-flat-gate.mjs`
- `tests/wec-flat-gate.mjs`
- `tests/wrc-flat-gate.mjs`
- `tests/supergt-flat-gate.mjs`
- `tests/motogp-flat-gate.mjs`
- `tests/fdj-flat-gate.mjs`
- `tests/d1gp-flat-gate.mjs`

### Automated 22-case render smoke
`tests/render-smoke-gate.mjs` renders all **11 categories × Small/Medium** through the real Router in a Scriptable VM mock with live data forced offline.

For every case it verifies:
- exactly one category module is fetched;
- `Script.setWidget()` is called once;
- `Script.complete()` is called once;
- snapshot/cache fallback renders instead of an error Widget;
- expected event identity is present;
- Medium exposes the standings/points surface;
- no data-failure, Router safety-error, or invalid-parameter state appears.

This replaces routine human repetition of all 22 functional render cases. It does **not** replace pixel-level iPhone visual judgement.

---

## Router / runtime architecture
Current Router marker on `hardening-live`:
- `v9.4.4-hardening`
- `MH_ROUTER_SCHEMA=5`
- direct category modules only
- no legacy wrapper runtime
- no Router source rewriting
- optional immutable release integrity enforcement

All four expansion categories now own their lifecycle directly and carry `MH_LIFECYCLE_BAKED=1`:
- SUPER FORMULA
- INDYCAR
- NASCAR
- GTWC Europe

**RC-08 runtime source-rewrite concern is closed in the current hardening architecture.**

`hardening-live` is automatically synchronized only after Hardening CI succeeds, so iPhone testing follows the latest known-green runtime instead of intermediate branch states.

---

## Immutable release / RC-04 hardening
Release packaging tool: `tools/generate-release-package.mjs`.

Generated release descriptor pins:
- immutable 40-character Git commit SHA (`sourceRef`);
- Router byte length + SHA-256;
- every one of the 11 category modules plus QA byte length + SHA-256;
- Router schema;
- category manifest;
- release namespace.

Generated Loader v6 behavior:
- never fetches mutable `main` for the fixed release;
- validates Router syntax, markers, byte length, and SHA-256 before execution;
- passes the immutable release integrity descriptor into Router;
- Router validates category module byte length + SHA-256 before execution;
- candidate / LKG / quarantine are release-namespaced;
- offline fallback executes only a previously verified immutable LKG;
- tampered Router/module or sourceRef mismatch fails closed.

Automated coverage:
- `tests/integrity-gate.mjs` verifies valid, tampered, wrong-sourceRef, offline-LKG, and corrupt-cache behavior.
- `tests/release-package-generator-gate.mjs` verifies generated descriptor hashes/bytes and executes a generated Loader v6 against valid, tampered, and offline-LKG fixtures.

**RC-04 is substantially mitigated in code and automated tests.** Remaining closure item: targeted real-device Loader v6 migration/offline QA using a generated immutable candidate package.

---

## Current data/cache contract
All 11 categories are recorded in `category-registry.json` with `dataCacheSchema: 1`.

Validated cache envelope includes:
- `schemaVersion`
- `category`
- `season`
- `fetchedAt`
- `source`
- `ranking`
- `event`
- `data`

Malformed, old-format, stale, future-dated, wrong-category, or wrong-season cache must not be rendered as validated current data.

---

## Current lifecycle contract
All 11 category modules directly implement their event lifecycle. Event windows are half-open: `[start,end)`.

Current hold/range behavior includes:
- F1: 4h; explicit Abu Dhabi offline finale fallback.
- WEC: 10h.
- WRC: 4 days.
- SUPER GT: 8h.
- MotoGP: 4h.
- FDJ: 40h.
- D1GP: 40h.
- SUPER FORMULA / INDYCAR / NASCAR / GTWC Europe: explicit start/end ranges in their own modules.

After the finale the UI must show `シーズン終了` / `SEASON END`, never a historical race as `次戦`.

---

## Current data-source invariants

### F1
- schedule + standings are fetched concurrently;
- both must succeed before a live refresh is promoted;
- partial refresh cannot overwrite valid cache.

### WEC
- manufacturer classification parser must resolve the intended manufacturer table;
- Toyota naming is **TR010 Hybrid / TOYOTA RACING**.

### WRC
- FIA table identity must be `2026 FIA World Rally Championship for Drivers`;
- WRC3 / Masters / unrelated tables must not be promoted.

### SUPER GT
- GT500 driver ranking only;
- current metadata contract:
  - #36 坪井 翔 / 山下 健太 — `TOYOTA · GR Supra ｜ au TOM'S`
  - #16 野尻 智紀 / 佐藤 蓮 — `HONDA · PRELUDE-GT ｜ ARTA`
  - #14 福住 仁嶺 / 大嶋 和也 — `TOYOTA · GR Supra ｜ ROOKIE`
- only the verified CC0 #36 Hero is current runtime policy.

### MotoGP
- Riders' Championship + MotoGP identity required.

### FDJ / D1GP
- FDJ duplicate-RYUMA normalization retained;
- D1GP driver ranking isolated from single-run ranking.

---

## iPhone / Scriptable evidence

### 2026-08-26 — live dependency diagnostic
- Hardening path: **11/11 LIVE — PASS**.
- WEC initially reproduced a `10/11` parser false-negative, was corrected, then retested to **11/11 LIVE**.

### Pixel-level spot checks completed on the hardening path

#### F1 — PASS / Visual LOCK
- Small: PASS
- Medium: PASS
- Event: `イタリアGP` / `9/6(日) 22:00` / `Monza`
- TOP3: Antonelli 242 / Russell 183 / Hamilton 183
- Hero framing, veil, PTS pills, typography and Small hierarchy: PASS.

#### WRC — PASS / Visual LOCK
- Small: PASS
- Medium: PASS
- Event: `ラリー・パラグアイ` / `8/27(木)・時刻未定` / `Paraguay`
- TOP3: Evans 201 / Pajari 171 / Katsuta 160
- metadata, Hero, veil, PTS and layout: PASS.

#### MotoGP — PASS / Visual LOCK
- Small: PASS
- Medium: PASS
- Event: `アラゴンGP` / `8/30(日) 21:00` / `モーターランド・アラゴン`
- TOP3: Martin 240 / Bezzecchi 209 / Ogura 203
- long Trackhouse metadata remains readable; Hero / veil / PTS: PASS.

#### FDJ — PASS / Visual LOCK
- Small: PASS
- Medium: PASS
- Event: `第5戦 奥伊吹` / `9/5(土)・時刻未定` / `グランスノー奥伊吹`
- TOP3: CONNOR XIA 231 / RYUMA 230 / KAZUMI TAKAHASHI 226
- duplicate-RYUMA artifact absent; Hero / veil / PTS: PASS.

Historical accepted visuals for SUPER FORMULA / INDYCAR / NASCAR remain useful baselines, but future human retests follow the risk-based policy below rather than automatically repeating every category.

---

## Device QA policy
Canonical policy: `DEVICE_QA_POLICY.md`.

The previous practice of manually checking every category × Small/Medium after routine non-visual changes is retired.

Human iPhone QA is required when one of these changes:
- renderer/layout code;
- typography, spacing, safe areas or PTS geometry;
- Hero/crop/veil logic;
- a new category;
- Scriptable-native behavior that cannot be represented by VM mocks;
- a failure or suspicious result from automated CI.

Routine data/parser/cache/calendar changes are primarily covered by deterministic gates + 22-case render smoke + 11/11 live diagnostics.

Before public RC, perform a **small risk-based visual spot-check set**, not a mandatory 22-widget manual matrix.

---

## Remaining blockers before final RC PASS
1. Codex re-audit of audited base → current hardening branch.
2. Targeted iPhone / Scriptable QA of generated Loader v6: fresh install/candidate, verified LKG, tampered rejection where reproducible, and offline fallback.
3. Final risk-based visual spot checks required by `DEVICE_QA_POLICY.md`, especially any categories whose runtime/hero changed since their last visual lock.
4. Synchronize final README / CHANGELOG / RELEASE_AUDIT wording after those checks.

No public release, tag, Store submission, or external publication is authorized by this document.

## Post-Codex visual automation
`POST_CODEX_VISUAL_AUTOMATION.md` remains the roadmap for:
- high-resolution Hero Asset Manager;
- automatic subject-aware Small/Medium crop;
- text-safe-area preservation;
- automatic veil generation;
- LKG Hero fallback;
- visual regression automation.

Goal: **future Hero/data updates must not require manual crop correction or repetitive per-category visual QA.**

## RC decision
**HARDENING CANDIDATE — AUTOMATED GATES PASS / FINAL DEVICE + CODEX REVIEW PENDING.**
