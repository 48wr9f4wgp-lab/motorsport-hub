# Motorsport Hub — Release Candidate QA

## v9.0.0 expansion status
- Current `main`: **8-category expansion build**.
- Added category: **SUPER FORMULA** (`SUPERFORMULA` / alias `SF`).
- Code integration: complete.
- Official 2026 standings/calendar source review: complete.
- Hero licensing: **BWard 1997 / CC BY 4.0 — exact Commons page verified**.
- SUPER FORMULA deterministic weekend-boundary simulation: **PASS**.
- QA diagnostics expanded to **8 routes**.
- **Pending gate:** SUPER FORMULA live-parser + Small/Medium iPhone visual QA.
- Until that device gate passes, **v8.9.6 remains the last fully device-reviewed Release Candidate**.

---

## Stable baseline candidate
- Version: **v8.9.6 Release Candidate**
- Date: 2026-08-24 JST
- Scope: Scriptable iPhone widget, Small / Medium, 7 motorsport categories
- Visual baseline: v8.7.1 (locked); SUPER GT hero asset replaced in v8.9.6 for verified licensing.

## Manual diagnostics — iPhone / Scriptable
Observed at 2026-08-24 21:32 JST.

- F1: LIVE — 131 ms
- WEC: LIVE — 3475 ms
- WRC: LIVE — 240 ms
- MotoGP: LIVE — 2950 ms
- SUPER GT: LIVE — 1014 ms
- FDJ: LIVE — 673 ms
- D1GP: LIVE — 588 ms

Result: **7/7 LIVE — stable-baseline data routes PASS**

## Home-screen regression — iPhone
Observed at 2026-08-24 21:38–22:05 JST.

PASS:
- Small widgets: all seven baseline categories render with no blank/error state.
- Medium widgets: F1 / WEC / WRC / SUPER GT / MotoGP / FDJ / D1GP reviewed.
- SUPER GT machine/team secondary lines restored after the v8.9.2 regression hotfix.
- Countdown, rankings, PTS and readability passed the reviewed pages.
- D1GP Small/Medium action hero passed visual QA.
- WEC display `TR010 Hybrid / TOYOTA RACING` is correct for the 2026 Toyota entry.

## Boundary / transition QA — baseline
Covered and passed:
- WEC active-event hold: 10 h
- SUPER GT active-event hold: 8 h
- MotoGP active-event hold: 4 h
- WRC active-rally hold: 4 days
- FDJ active-weekend hold: 40 h
- D1GP active-weekend hold: 40 h
- F1 race-start retention: 4 h

## Hero asset audit — baseline
Verified:
- F1 — Eustace Bagge — CC BY 4.0
- WRC — TTTNIS — CC0 1.0
- MotoGP — Liauzh — CC BY-SA 4.0
- WEC — MarcelX42 — CC BY-SA 4.0
- FDJ — CC0 1.0
- D1GP — Rowan Harrison — CC BY-SA 2.0
- SUPER GT — Tokumeigakarinoaoshima — CC0 1.0

## RC decision
- **v8.9.6 RELEASE CANDIDATE: PASS**
- **v9.0.0 EXPANSION RC: PENDING SUPER FORMULA DEVICE QA**
- No public deployment, Store submission or release action has been performed; explicit owner approval is required before release.
