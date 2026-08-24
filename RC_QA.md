# Motorsport Hub — Release Candidate QA

## v9.1.0 expansion status
- Current `main`: **9-category expansion build**.
- SUPER FORMULA (`SUPERFORMULA` / alias `SF`): **LOCKED / PASS**.
  - Official 2026 standings/calendar source review: complete.
  - Hero licensing: BWard 1997 / CC BY 4.0 — exact Commons page verified.
  - Weekend-boundary simulation: PASS.
  - iPhone route QA at 2026-08-24 23:19 JST: 8/8 LIVE; SUPER FORMULA 409 ms.
  - iPhone Small/Medium visual QA at 2026-08-24 23:35 JST: **PASS**.
  - Live standings observed on-device: 太田格之進 105 / 岩佐歩夢 59.5 / 福住仁嶺 58.
- INDYCAR (`INDYCAR` / alias `INDY`): **LOCKED / PASS**.
  - Official 2026 standings/schedule source review: complete.
  - Hero licensing: Ben Goyette / CC BY-SA 4.0 — exact Commons page verified.
  - Milwaukee double-header deterministic transition coverage: PASS.
  - iPhone route QA at 2026-08-24 23:47 JST: **9/9 LIVE — PASS**; INDYCAR 1188 ms.
  - iPhone Small/Medium visual QA at 2026-08-24 23:50 JST: **PASS**.
  - Medium snapshot displayed correctly: Alex Palou 553 / Kyle Kirkwood 462 / Christian Lundgaard 443.

## v9.2.0 expansion next gate
- NASCAR Cup Series is the next category scheduled for integration.
- Existing nine categories are device-reviewed and locked before NASCAR work begins.

---

## Stable seven-category baseline
- Version: **v8.9.6 Release Candidate**
- Date: 2026-08-24 JST
- Scope: Scriptable iPhone widget, Small / Medium, 7 baseline categories
- Visual baseline: v8.7.1 (locked); SUPER GT hero replaced in v8.9.6 for verified licensing.

## Baseline manual diagnostics — iPhone / Scriptable
Observed at 2026-08-24 21:32 JST.
- F1: LIVE — 131 ms
- WEC: LIVE — 3475 ms
- WRC: LIVE — 240 ms
- MotoGP: LIVE — 2950 ms
- SUPER GT: LIVE — 1014 ms
- FDJ: LIVE — 673 ms
- D1GP: LIVE — 588 ms
Result: **7/7 LIVE — PASS**

## Baseline home-screen regression
Observed at 2026-08-24 21:38–22:05 JST.
PASS:
- Small widgets: all seven baseline categories render with no blank/error state.
- Medium widgets: F1 / WEC / WRC / SUPER GT / MotoGP / FDJ / D1GP reviewed.
- SUPER GT machine/team secondary lines restored after the v8.9.2 hotfix.
- Countdown, rankings, PTS and readability passed.
- D1GP Small/Medium action hero passed.
- WEC display `TR010 Hybrid / TOYOTA RACING` is correct for the 2026 Toyota entry.

## Boundary / transition QA
Covered:
- WEC active-event hold: 10 h
- SUPER GT active-event hold: 8 h
- MotoGP active-event hold: 4 h
- WRC active-rally hold: 4 days
- FDJ active-weekend hold: 40 h
- D1GP active-weekend hold: 40 h
- F1 race-start retention: 4 h
- SUPER FORMULA explicit weekend end boundaries
- INDYCAR explicit race windows, including Milwaukee Race 1 → Race 2 transition

## Hero asset audit
Verified:
- F1 — Eustace Bagge — CC BY 4.0
- WRC — TTTNIS — CC0 1.0
- MotoGP — Liauzh — CC BY-SA 4.0
- WEC — MarcelX42 — CC BY-SA 4.0
- FDJ — CC0 1.0
- D1GP — Rowan Harrison — CC BY-SA 2.0
- SUPER GT — Tokumeigakarinoaoshima — CC0 1.0
- SUPER FORMULA — BWard 1997 — CC BY 4.0
- INDYCAR — Ben Goyette — CC BY-SA 4.0

## RC decision
- **v8.9.6 seven-category Release Candidate: PASS**
- **SUPER FORMULA v9.0.0 expansion gate: PASS / LOCKED**
- **INDYCAR v9.1.0 expansion gate: PASS / LOCKED**
- No public deployment, Store submission or release action has been performed; explicit owner approval is required before release.
