# Motorsport Hub — Release Candidate QA

## Candidate
- Version: **v8.9.5 Technical RC**
- Date: 2026-08-24 JST
- Scope: Scriptable iPhone widget, Small / Medium, 7 motorsport categories
- Visual baseline: v8.7.1 (locked)

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

WEC and MotoGP are slower than the other feeds but remain below the configured request timeout and are not current blockers.

## Home-screen regression — iPhone
Observed at 2026-08-24 21:38–22:05 JST.

PASS:
- Small widgets: all seven categories render with no blank/error state.
- Medium widgets: F1 / WEC / WRC / SUPER GT / MotoGP / FDJ / D1GP reviewed.
- SUPER GT machine/team secondary lines restored after the v8.9.2 regression hotfix.
- Countdown, rankings, PTS and readability passed the reviewed pages.
- D1GP Small/Medium action hero passed visual QA.
- WEC display `TR010 Hybrid / TOYOTA RACING` is correct for the 2026 Toyota entry; an attempted GR010 correction was identified as wrong and reverted at the reliability layer in v8.9.4.

## Boundary / transition QA
A deterministic boundary suite was added at `tests/boundary-gate.mjs` and executed during the v8.9.5 audit.

Covered:
- WEC active-event hold: 10 h
- SUPER GT active-event hold: 8 h
- MotoGP active-event hold: 4 h
- WRC active-rally hold: 4 days
- FDJ active-weekend hold: 40 h
- D1GP active-weekend hold: 40 h
- F1 race-start retention: 4 h

Result: **PASS**

## Static / repository gates
- Router uses `motorsport-reliability-v895.js`.
- Loader v4 compatibility markers retained.
- Seven Widget Parameters + QA selector retained.
- Season-tail calendar coverage and standings fallbacks retained.
- v8.9.4 official 2026 WEC naming guard retained.
- `tests/release-gate.mjs` updated for v8.9.5 and attribution markers.

## Hero asset audit
Verified:
- F1 — Eustace Bagge — CC BY 4.0
- WRC — TTTNIS — CC0 1.0
- MotoGP — Liauzh — CC BY-SA 4.0
- WEC — MarcelX42 — CC BY-SA 4.0
- FDJ — CC0 1.0
- D1GP — Rowan Harrison — CC BY-SA 2.0

Unresolved public-distribution gate:
- SUPER GT hero exact author/license is not yet independently verified. See `ATTRIBUTION.md`.

## RC decision
- **TECHNICAL RC: PASS — PRIVATE/PERSONAL USE OK**
- **PUBLIC RELEASE: BLOCKED by SUPER GT hero attribution/license only**
- No public deployment, Store submission or release action performed.
