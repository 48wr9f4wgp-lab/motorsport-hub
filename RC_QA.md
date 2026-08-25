# Motorsport Hub — Release Candidate QA

## Current branch status
- Branch: `hardening/v9.3-codex-handoff`
- Audited base: `a09d16e11aa0f65104ba895b74e09124d30b487b`
- Current architecture: 11 categories + QA, direct category modules.
- **Current hardening build verdict: NOT YET RC PASS.**
- Reason: the post-flatten repository gates and the full iPhone Small/Medium regression matrix have not yet been executed.
- No public release action is authorized from this branch.

## What changed after the previously accepted device build
The earlier iPhone QA remains useful as a visual/data baseline, but it does **not** prove the current hardening branch because the runtime architecture changed substantially.

Original seven categories now route directly:
- F1 → `f1-widget-flat-v1000.js`
- WEC → `wec-widget-flat-v1000.js`
- WRC → `wrc-widget-flat-v1000.js`
- SUPER GT → `supergt-widget-flat-v1000.js`
- MotoGP → `motogp-widget-flat-v1000.js`
- FDJ → `fdj-widget-flat-v1000.js`
- D1GP → `d1gp-widget-flat-v1000.js`

Expansion modules:
- SUPER FORMULA
- INDYCAR
- NASCAR Cup
- GTWC Europe

Router no longer uses the legacy reliability-wrapper waterfall for the original seven.

## Current data/cache QA contract
All 11 categories are now recorded in `category-registry.json` with `dataCacheSchema: 1`.

Validated cache contract includes:
- schema version
- category
- season
- fetched timestamp
- source
- ranking structure
- event structure
- stale/future timestamp rejection

Malformed/old/stale cache must not be rendered as validated current data.

## Current event lifecycle contract
- F1: 4h race retention; Abu Dhabi explicit offline finale fallback.
- WEC: 10h.
- WRC: 4 days.
- SUPER GT: 8h.
- MotoGP: 4h.
- FDJ: 40h.
- D1GP: 40h.
- SUPER FORMULA / INDYCAR / NASCAR / GTWC Europe: explicit start/end ranges with Router fail-closed lifecycle transform.

Event active windows are half-open: `[start,end)`.
After the finale the Widget must show `シーズン終了` / `SEASON END`, not a historical event as `次戦`.

## Data-source invariants to verify
### F1
- schedule + standings must both succeed before a live refresh is promoted.
- partial live refresh must not overwrite valid cache.

### WEC
- manufacturer classification source must parse the intended manufacturer table.
- Toyota must render **TR010 Hybrid / TOYOTA RACING**.

### WRC
- FIA table identity must be `2026 FIA World Rally Championship for Drivers`.
- WRC3/Masters/other tables must not be accepted.

### SUPER GT
- GT500 driver ranking only; GT300 must not be accepted.
- expected current metadata:
  - #36 坪井 翔 / 山下 健太 — `TOYOTA · GR Supra ｜ au TOM'S`
  - #16 野尻 智紀 / 佐藤 蓮 — `HONDA · PRELUDE-GT ｜ ARTA`
  - #14 福住 仁嶺 / 大嶋 和也 — `TOYOTA · GR Supra ｜ ROOKIE`
- verified CC0 #36 Hero only.

### MotoGP
- Riders' Championship + MotoGP table identity required.

### FDJ / D1GP
- FDJ duplicate RYUMA normalization retained.
- D1GP driver ranking isolated from single-run ranking.

## Current hardening device evidence
### 2026-08-26 — QA diagnostic
- iPhone / Scriptable hardening path: **11/11 LIVE — PASS**.
- WEC parser false-negative was reproduced at 10/11, fixed, then retested to 11/11 LIVE.

### 2026-08-26 07:48 JST — F1 flat visual regression
- Module: `f1-widget-flat-v1000.js`
- Small: **PASS**
- Medium: **PASS**
- Event shown: `イタリアGP` / `9/6(日) 22:00` / `Monza`
- Countdown: `あと12日` — consistent with device date/time.
- Medium TOP3 rendered correctly and without clipping:
  1. Andrea Kimi Antonelli — 242
  2. George Russell — 183
  3. Lewis Hamilton — 183
- Hero framing: PASS
- Left-side readability veil: PASS
- PTS pills/alignment: PASS
- Small information hierarchy: PASS
- No visible flat-migration regression observed in the supplied device screenshot.

F1 is therefore **device-visual LOCKED for the current hardening path**, subject to the still-pending repository gates, cache/offline regression and Codex re-audit.

### 2026-08-26 07:53 JST — WRC flat visual regression
- Module: `wrc-widget-flat-v1000.js`
- Small: **PASS**
- Medium: **PASS**
- Event shown: `ラリー・パラグアイ` / `8/27(木)・時刻未定` / `Paraguay`
- Countdown: `あと2日` — consistent with device date/time.
- Medium TOP3 rendered correctly and without clipping:
  1. Elfyn Evans — 201
  2. Sami Pajari — 171
  3. Takamoto Katsuta — 160
- Metadata sublines rendered for all three: `TOYOTA · GR Yaris Rally1 ｜ TOYOTA GAZOO Racing WRT`.
- Hero framing: PASS
- Left-side readability veil: PASS
- PTS pills/alignment: PASS
- Small information hierarchy: PASS
- No visible flat-migration regression observed in the supplied device screenshot.

WRC is therefore **device-visual LOCKED for the current hardening path**, subject to the still-pending repository gates, cache/offline regression and Codex re-audit.

## Historical device evidence — baseline only
Previously observed before the full flatten:
- original seven: 7/7 live diagnostic PASS.
- original seven Small/Medium visual regression: PASS.
- SUPER FORMULA Small/Medium: PASS / LOCKED.
- INDYCAR Small/Medium: PASS / LOCKED.
- NASCAR Small/Medium: previously visually accepted.
- GTWC Europe: device QA remained pending.

These results are **not promoted to current hardening PASS** without rerunning the affected paths.

## Mandatory repository gates before RC PASS
Run from a real checkout:
- full `.js/.mjs` syntax audit
- `node tests/release-gate.mjs`
- `node tests/boundary-gate.mjs`
- `node tests/router-hardening-gate.mjs`
- `node tests/registry-gate.mjs`
- `node tests/cache-hardening-gate.mjs`
- `node tests/hero-manifest-gate.mjs`
- `node tests/lifecycle-hardening-gate.mjs`
- `node tests/f1-flat-gate.mjs`
- `node tests/wec-flat-gate.mjs`
- `node tests/wrc-flat-gate.mjs`
- `node tests/supergt-flat-gate.mjs`
- `node tests/motogp-flat-gate.mjs`
- `node tests/fdj-flat-gate.mjs`
- `node tests/d1gp-flat-gate.mjs`

Current ChatGPT container cannot run these from checkout because `github.com` DNS resolution fails. No unrun gate is considered PASS.

## Mandatory iPhone / Scriptable regression
For every 11 categories:
1. Medium Widget opens and completes.
2. Small Widget opens and completes.
3. Hero loads or safe background fallback is acceptable.
4. Event title/date/location are correct.
5. Medium TOP3 and PTS are readable.
6. metadata subline is correct/non-empty where applicable.
7. cache/offline behavior does not crash or resurrect stale historical event.
8. no visible regression against accepted layout.

Additionally:
- QA diagnostic must show 11/11 LIVE under normal network conditions.
- Loader v5 migration candidate/LKG/quarantine/offline paths must be device-tested.
- cold-network and GitHub-outage latency should be compared with audited base.

## RC decision
**HARDENING CANDIDATE — VERIFICATION PENDING.**

Do not mark this branch Release Candidate PASS until repository gates, device regression, Loader v5 migration QA and Codex re-audit are complete.
