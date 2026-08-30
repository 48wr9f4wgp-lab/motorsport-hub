# Motorsport Hub — Hardening iPhone QA

## Purpose
Test the hardening architecture on iPhone/Scriptable **without overwriting or contaminating the normal Motorsport Hub loader/cache**.

## Test checkpoint
Hardening test loader:
- `scriptable-loader-hardening-v5.js`
- immutable Router/module source ref: `c941311d2a969c3095017ceebf5a936090fbb9fc`
- separate cache namespace: `motorsport-hub-hardening-*`

The normal Scriptable loader and its cache files are not used by this test loader.

## Setup
1. In Scriptable create a **new** script named `Motorsport Hub HARDENING`.
2. Do not edit/delete the normal Motorsport Hub script.
3. Paste the contents of `scriptable-loader-hardening-v5.js` into the new script.
4. Run the new script directly once with network available.

## Phase A — smoke / live-data QA
Run `Motorsport Hub HARDENING` directly and choose `QA診断`.

Expected:
- `11/11 LIVE — データ経路OK` under normal network/source conditions.
- No configuration-error Widget.
- No `Hardening検証Routerを取得できません` message.

Capture a screenshot of the diagnostics result.

If QA is not 11/11, stop the visual matrix and record which category says `NET` or `PARSE` plus its latency.

## Phase B — flat original-seven regression
For each category below, test both Small and Medium using the hardening script as the Scriptable Widget and the category ID as Widget Parameter:
- `F1`
- `WEC`
- `WRC`
- `SUPERGT`
- `MOTOGP`
- `FDJ`
- `D1GP`

Check each:
1. Widget completes; no generic error card.
2. Hero loads or intentional safe fallback is visually acceptable.
3. Current/next event is correct.
4. Date/location is readable.
5. Countdown/state is correct.
6. Medium shows 3 standings rows and readable PTS.
7. Metadata line is non-empty where applicable.
8. No clipping/overlap compared with accepted baseline.

Critical content checks:
- WEC Toyota: `TR010 Hybrid ｜ TOYOTA RACING`.
- SUPER GT #36: `TOYOTA · GR Supra ｜ au TOM'S`.
- SUPER GT #16: `HONDA · PRELUDE-GT ｜ ARTA`.
- SUPER GT #14: `TOYOTA · GR Supra ｜ ROOKIE`.
- No old/unverified SUPER GT Hero appears.

## Phase C — expansion regression
Test Small + Medium:
- `SUPERFORMULA`
- `INDYCAR`
- `NASCAR`
- `GTWCEU`

Existing accepted visuals for SUPER FORMULA / INDYCAR / NASCAR must not regress.
GTWC Europe still requires its first complete device QA.

## Phase D — cache/offline/LKG smoke
Do this only after each category you intend to test has been opened successfully online once, so its module/data cache exists.

1. Open F1, WEC and SUPER GT online once.
2. Turn on Airplane Mode / otherwise remove network access.
3. Re-run those Widgets.

Expected:
- no crash.
- no fallback to normal/main loader.
- validated cached module/data can render if present.
- stale/invalid data is not silently presented as fresh.
- network recovery message is acceptable when no valid category cache exists.

Re-enable network after this test.

## Phase E — Loader isolation
Confirm the normal Motorsport Hub script still runs unchanged after hardening testing.

The hardening loader uses separate candidate/LKG/quarantine names and must not replace normal loader state.

## Evidence to retain
- QA 11/11 screenshot.
- Small + Medium screenshot for each category after flatten/direct routing.
- any `更新待ち`, `PARSE`, `NET`, generic error, clipping or wrong-event screenshot.
- approximate first-load latency for F1/WEC/SUPER GT and one expansion category.
- offline/LKG result.

## Pass criteria
Hardening device QA is PASS only when:
- 11/11 live diagnostic passes under normal source availability.
- all 11 Small/Medium Widgets pass regression.
- original seven flat modules show no visual/content regressions.
- offline/LKG smoke does not crash or silently route to normal/main code.
- GTWC Europe receives explicit Small/Medium approval.

Until these conditions and repository gates pass, the hardening branch remains **NOT RELEASE APPROVED**.
