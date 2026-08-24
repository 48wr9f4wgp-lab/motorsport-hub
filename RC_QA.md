# Motorsport Hub — Release Candidate QA

## v9.2.0 expansion status
- Current `main`: **10-category expansion build**.
- SUPER FORMULA (`SUPERFORMULA` / alias `SF`): **LOCKED / PASS**.
  - iPhone route QA: PASS.
  - iPhone Small/Medium visual QA: PASS.
- INDYCAR (`INDYCAR` / alias `INDY`): **LOCKED / PASS**.
  - Hero licensing: Ben Goyette / CC BY-SA 4.0 — exact Commons page verified.
  - Milwaukee transition coverage: PASS.
  - iPhone route QA at 2026-08-24 23:47 JST: **9/9 LIVE — PASS**; INDYCAR 1188 ms.
  - iPhone Small/Medium visual QA at 2026-08-24 23:50 JST: **PASS**.
  - Medium displayed Alex Palou 553 / Kyle Kirkwood 462 / Christian Lundgaard 443 correctly.
- NASCAR Cup (`NASCAR` / aliases `CUP`, `NASCAR CUP`): **IMPLEMENTED / DEVICE QA PENDING**.
  - Primary standings source: official NASCAR public CDN `https://cf.nascar.com/cacher/2026/1/points-feed.json`.
  - Current fallback standings after New Hampshire: Denny Hamlin 1001 / Ryan Blaney 924 / Ty Gibbs 880.
  - Remaining 2026 calendar encoded from Daytona through Homestead-Miami championship.
  - Daytona six-hour event-retention boundary coverage added.
  - Hero licensing: TaurusEmerald / CC BY-SA 4.0 — exact Commons page verified.
  - QA diagnostics expanded to **10 routes**.
- Pending v9.2.0 gate: **NASCAR 10/10 live-route QA + Small/Medium iPhone visual QA**.

---

## Stable seven-category baseline
- Version: **v8.9.6 Release Candidate**
- Date: 2026-08-24 JST
- Scope: Scriptable iPhone widget, Small / Medium, 7 baseline categories
- Visual baseline: v8.7.1 locked.

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
- INDYCAR explicit race windows / Milwaukee double-header transition
- NASCAR Daytona six-hour active-event window → Darlington transition

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
- NASCAR — TaurusEmerald — CC BY-SA 4.0

## RC decision
- **v8.9.6 seven-category Release Candidate: PASS**
- **SUPER FORMULA v9.0.0: PASS / LOCKED**
- **INDYCAR v9.1.0: PASS / LOCKED**
- **NASCAR v9.2.0: PENDING DEVICE QA**
- No public deployment, Store submission or release action has been performed; explicit owner approval is required before release.
