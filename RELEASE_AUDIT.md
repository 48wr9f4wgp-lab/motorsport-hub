# Motorsport Hub — Release Audit

## Current expansion
- Current `main`: **v9.2.0 / 10 categories**.
- Stable baseline RC: **v8.9.6 / 7 categories**.
- SUPER FORMULA v9.0.0: **device QA PASS / LOCKED**.
- INDYCAR v9.1.0: **device QA PASS / LOCKED**.
- NASCAR Cup v9.2.0: **implemented; device QA pending**.
- Scriptable loader: v4 — no repaste required.

## Runtime QA completed
Baseline seven categories:
- One-tap iPhone diagnostic: **7/7 LIVE**.
- Small + Medium home-screen regression: PASS.

Expansion categories:
- SUPER FORMULA: 8/8 route QA + Small/Medium visual QA PASS.
- INDYCAR: 9/9 route QA + Small/Medium visual QA PASS.
- NASCAR: pending 10/10 route QA + Small/Medium visual QA.

## Reliability gates
- F1 refresh is atomic across schedule + standings.
- WRC / FDJ / D1GP preserve active multi-day/weekend events.
- WEC / SUPER GT / MotoGP use active-event hold windows.
- SUPER FORMULA uses explicit weekend start/end boundaries.
- INDYCAR uses explicit race windows including Milwaukee double-header transition.
- NASCAR uses official NASCAR CDN points JSON and six-hour race windows.
- Season-tail calendar coverage is configured through each supported 2026 finale.

## Deterministic boundary QA
`tests/boundary-gate.mjs` covers:
- WEC / SUPER GT / MotoGP event hold transitions
- WRC active-rally retention
- FDJ / D1GP weekend retention
- F1 post-start retention
- SUPER FORMULA Fuji double-header weekend
- INDYCAR Milwaukee Race 1 → Race 2 → Laguna Seca
- NASCAR Daytona active window → Darlington transition

## Static release gate
`tests/release-gate.mjs` validates:
- JS syntax for category/router/reliability modules
- Loader v4 compatibility markers
- all current category routes + QA selector
- data source markers and 2026 calendars
- event-boundary protections
- hero source/license markers
- current expansion modules: SUPER FORMULA / INDYCAR / NASCAR

## Hero asset legal audit
Verified individually:
- F1: Eustace Bagge — CC BY 4.0
- WRC: TTTNIS — CC0 1.0
- MotoGP: Liauzh — CC BY-SA 4.0
- WEC: MarcelX42 — CC BY-SA 4.0
- FDJ: CC0 1.0
- D1GP: Rowan Harrison — CC BY-SA 2.0
- SUPER GT: Tokumeigakarinoaoshima — CC0 1.0
- SUPER FORMULA: BWard 1997 — CC BY 4.0
- INDYCAR: Ben Goyette — CC BY-SA 4.0
- NASCAR: TaurusEmerald — CC BY-SA 4.0

## Release decision
- **v8.9.6 seven-category Release Candidate: PASS**.
- **SUPER FORMULA v9.0.0: PASS / LOCKED**.
- **INDYCAR v9.1.0: PASS / LOCKED**.
- **NASCAR v9.2.0: PENDING DEVICE QA**.
- No public deployment, Store submission, publication or other external release action has been performed. Explicit owner approval is required before release.
