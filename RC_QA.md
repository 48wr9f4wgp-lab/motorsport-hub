# Motorsport Hub — Release Candidate QA

## Current verdict
- Branch: `hardening/v9.3-codex-handoff`
- Audited base: `a09d16e11aa0f65104ba895b74e09124d30b487b`
- Architecture: 11 categories + QA, direct category modules.
- Legacy runtime wrapper waterfall for the original seven: **removed from current Router path**.
- Deterministic repository CI: **PASS**.
- iPhone live data diagnostic: **11/11 LIVE — PASS**.
- Public release: **NOT authorized / NOT performed**.

Current status:

**HARDENING CANDIDATE — CI PASS / FINAL REVIEW PENDING**

This is not yet promoted to Release Candidate PASS because Codex re-audit, final Loader v5 release pinning/migration checks, and the remaining high-risk visual spot checks are still pending.

---

## Automated hardening evidence

### GitHub Actions Hardening CI
Workflow: `.github/workflows/hardening-ci.yml`

First full green run after fixing the MotoGP test assertion:
- Run: **#3**
- Run ID: `32949810775`
- Head: `553ddfdae5069152054bb2f5d52a3be850460660`
- Result: **SUCCESS**

Expanded CI with the automated Small/Medium render smoke:
- Run: **#5**
- Run ID: `32950012839`
- Head: `f734b2239bfffd23912fd9c27ef2afc7d97ab1f5`
- Result: **SUCCESS**

The workflow now runs a full syntax audit plus every deterministic gate, and it does not stop at the first gate failure.

### Deterministic gates currently green
- `tests/release-gate.mjs`
- `tests/boundary-gate.mjs`
- `tests/router-hardening-gate.mjs`
- `tests/registry-gate.mjs`
- `tests/cache-hardening-gate.mjs`
- `tests/hero-manifest-gate.mjs`
- `tests/lifecycle-hardening-gate.mjs`
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

It verifies for every case:
- exactly one category module is fetched;
- `Script.setWidget()` is called once;
- `Script.complete()` is called once;
- snapshot/cache fallback renders instead of an error Widget;
- expected event identity is present;
- Medium exposes the standings/points surface;
- no `データ取得失敗`, Router safety-error, or invalid-parameter state appears.

This replaces routine human repetition of all 22 functional render cases. It does **not** replace pixel-level iPhone visual judgement.

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
Original seven flat modules directly implement `UPCOMING / ACTIVE / SEASON_ENDED`.

Current hold windows:
- F1: 4h; explicit Abu Dhabi offline finale fallback.
- WEC: 10h.
- WRC: 4 days.
- SUPER GT: 8h.
- MotoGP: 4h.
- FDJ: 40h.
- D1GP: 40h.

Expansion four currently retain the strict fail-closed Router lifecycle transform. Absorbing that logic into each expansion module remains a pre-RC cleanup item.

Event windows are half-open: `[start,end)`.
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
- WEC initially reproduced a `10/11` parse false-negative, parser/diagnostic identity was corrected, and the device retest reached **11/11 LIVE**.

### Pixel-level spot checks completed on the current hardening path

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
- Scriptable-native behavior that cannot be represented by the VM mocks;
- a failure or suspicious result from automated CI.

Routine data/parser/cache/calendar changes are primarily covered by deterministic gates + the 22-case render smoke + 11/11 live diagnostics.

Before public RC, perform a **small risk-based visual spot-check set**, not a mandatory 22-widget manual matrix.

---

## Remaining blockers before RC PASS
1. Codex re-audit of audited base → hardening branch.
2. Absorb lifecycle behavior into SUPER FORMULA / INDYCAR / NASCAR / GTWC Europe so Router no longer rewrites module source at runtime.
3. Finalize immutable Loader/Router/module release pinning and integrity policy for RC-04.
4. Device-test Loader v5 candidate/LKG/quarantine/offline migration behavior.
5. Perform only the final high-risk visual spot checks required by `DEVICE_QA_POLICY.md`.
6. Synchronize final README / CHANGELOG / RELEASE_AUDIT wording after the above is complete.

## Post-Codex visual automation
`POST_CODEX_VISUAL_AUTOMATION.md` is the retained roadmap for:
- high-resolution Hero Asset Manager;
- automatic subject-aware Small/Medium crop;
- text-safe-area preservation;
- automatic veil generation;
- LKG Hero fallback;
- visual regression automation.

Goal: **future Hero/data updates must not require manual crop correction or repetitive per-category visual QA.**

## RC decision
**HARDENING CANDIDATE — CI PASS / FINAL REVIEW PENDING.**
