# Motorsport Hub — Release Audit

## Candidate
- Technical RC: **v8.9.5**
- Visual baseline: **v8.7.1 Final Visual Polish** (locked)
- Categories: F1 / WEC / WRC / SUPER GT / MotoGP / FDJ / D1GP
- Scriptable loader: v4 (no repaste required)
- Scope: iPhone / Scriptable / Small + Medium

## Runtime QA completed
- One-tap QA diagnostic on iPhone: **7/7 LIVE**.
- Home-screen Small widgets: all seven categories rendered without blank/error state.
- Medium regression: F1 / WEC / WRC / SUPER GT / MotoGP / FDJ / D1GP reviewed on-device.
- SUPER GT machine/team subline regression was found and fixed in v8.9.2, then re-tested successfully.
- WEC 2026 Toyota naming was re-verified after an incorrect attempted correction: official 2026 display is **TR010 Hybrid / TOYOTA RACING**. v8.9.4 guards that naming.
- Readability, countdown, ranking and PTS presentation passed the reviewed home-screen pages.

## Reliability gates
- F1 schedule + standings refresh is atomic; partial refresh is not accepted as fully fresh.
- WRC uses the FIA static official standings route and holds the active rally through its multi-day window.
- FDJ and D1GP hold the current event through their weekend window.
- WEC / SUPER GT / MotoGP receive explicit event-boundary holds in v8.9.5 so the widget does not advance to the next round at the scheduled start instant.
- WEC and SUPER GT preserve useful standings even when a future leader lacks local metadata.
- Season-tail calendar coverage is present through each configured 2026 finale.

## Deterministic boundary QA
`tests/boundary-gate.mjs` covers:
- WEC: pre-start / active race / end-of-hold / next-round transition
- SUPER GT: same boundary sequence
- MotoGP: same boundary sequence
- WRC: four-day active-rally retention
- FDJ / D1GP: weekend retention
- F1: four-hour race-start retention window

The deterministic boundary test was executed during the v8.9.5 audit and returned **PASS**.

## Static release gate
`tests/release-gate.mjs` now checks:
- syntax for the router and reliability modules
- seven category parameters + QA selector
- Loader v4 compatibility markers
- 2026 tail calendars
- standings fallbacks
- WRC / FDJ / D1GP / WEC / SUPER GT / MotoGP event-hold guards
- 2026 WEC TR010 / TOYOTA RACING guard
- visual-lock source
- hero attribution audit markers

## Hero asset legal audit
Verified individually:
- F1: CC BY 4.0 — Eustace Bagge
- WRC: CC0 1.0 — TTTNIS
- MotoGP: CC BY-SA 4.0 — Liauzh
- WEC: CC BY-SA 4.0 — MarcelX42
- FDJ: CC0 1.0
- D1GP: CC BY-SA 2.0 — Rowan Harrison

### Remaining public-release blocker
**SUPER GT hero image exact author/license is not yet independently verified.**
`ATTRIBUTION.md` records the exact file and the hard gate.

## Release decision
- **TECHNICAL RC: PASS for private/personal use.**
- **PUBLIC DISTRIBUTION: BLOCKED** until the SUPER GT hero attribution/license is verified or the hero is replaced with a fully verified asset.
- No App Store/public deployment/release action has been performed.
