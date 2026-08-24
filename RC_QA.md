# Motorsport Hub — Release Candidate QA

## Candidate
- Version: v8.9.1
- Date: 2026-08-24 JST
- Scope: Scriptable iPhone widget, Small / Medium, 7 motorsport categories

## Automated / static checks
- Release gate script: PASS
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
- This diagnostic verifies network reachability and first-pass parsing only. Final RC still requires home-screen Small / Medium regression confirmation.

## Visual status
Previously accepted / visually locked:
- F1
- WEC
- WRC
- MotoGP
- SUPER GT
- FDJ
- D1GP

Universal readability system is locked at v8.7.1. Reliability work after that version must not intentionally alter visual layout.

## Remaining RC gates
1. Final home-screen regression after v8.9.1 reliability changes
   - confirm no blank/error widget
   - confirm next event/date/countdown sensible
   - confirm ranking and PTS visible
   - confirm Small layout for representative long-title categories
   - confirm Medium layout for all seven categories or representative pages with no regression
2. SUPER GT hero image attribution: verify exact Wikimedia Commons author and license before any public distribution.

## RC decision
Status: **RC CANDIDATE — NOT YET RELEASED**

Do not mark release-ready until the remaining RC gates above are closed.
