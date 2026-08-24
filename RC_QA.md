# Motorsport Hub — Release Candidate QA

## Candidate
- Version: v8.9.4
- Date: 2026-08-24 JST
- Scope: Scriptable iPhone widget, Small / Medium, 7 motorsport categories

## Automated / static checks
- Release gate script: PASS before final 2026 WEC naming guard
- Router syntax: PASS
- Reliability wrapper syntax: PASS
- D1GP reliability wrapper syntax: PASS
- Loader v4 compatibility markers: PASS

## Manual diagnostics — iPhone / Scriptable
Observed at 2026-08-24 21:32 JST.

- F1: LIVE — 131 ms
- WEC: LIVE — 3475 ms
- WRC: LIVE — 240 ms
- MotoGP: LIVE — 2950 ms
- SUPER GT: LIVE — 1014 ms
- FDJ: LIVE — 673 ms
- D1GP: LIVE — 588 ms

Result: **7/7 LIVE — data routes PASS**

Notes:
- WEC and MotoGP are slower than the other feeds but remain below the 10 s request timeout and are not currently release blockers.
- This diagnostic verifies network reachability and first-pass parsing.

## Home-screen regression — iPhone
Observed at 2026-08-24 21:38–22:05 JST.

PASS:
- Small widgets: all 7 categories render with no blank/error state.
- D1GP Medium: PASS.
- FDJ Medium: PASS.
- WEC Medium: PASS visually. 2026 official FIA WEC naming is **TR010 Hybrid / TOYOTA RACING**. A mistaken attempted correction to the pre-2026 GR010 / TOYOTA GAZOO Racing naming was identified and reverted in v8.9.4. The v8.9.4 naming guard normalizes the legacy HQ source to the official 2026 names at load time.
- WRC Medium: PASS.
- MotoGP Medium: PASS.
- F1 Medium: PASS.
- SUPER GT Medium: initial regression lost machine/team sublines; v8.9.2 hotfix restored `TOYOTA · GR Supra ｜ au TOM'S`, `HONDA · PRELUDE-GT ｜ ARTA`, and `TOYOTA · GR Supra ｜ ROOKIE`. Re-test at 21:51 JST: PASS.
- Countdown, ranking, PTS readability and background contrast: PASS across reviewed pages.

Universal readability system remains visually locked at v8.7.1. Reliability work after that version must not intentionally alter layout.

## Remaining RC gates
1. Public-distribution legal gate: verify exact author/license for the currently selected SUPER GT Wikimedia Commons hero image, or replace it with an asset whose exact file-page license is verified before public distribution.

## RC decision
Status: **TECHNICAL RC — PRIVATE USE PASS — NOT PUBLIC-RELEASE READY**

Technical RC is accepted for private use. Do not mark public-release ready until the remaining licensing gate above is closed.
