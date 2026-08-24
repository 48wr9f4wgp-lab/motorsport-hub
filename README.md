# Motorsport Hub

iPhone home-screen motorsport widget for Scriptable.

## Current build
- Expansion build: **v9.0.0**
- Stable seven-category baseline: **v8.9.6 Release Candidate**
- Current categories: **8**
- v9.0.0 status: **SUPER FORMULA implemented; iPhone Small/Medium visual QA pending**
- Public release/deployment: **not performed**; explicit owner approval is required before any public release action.

## Categories / Widget Parameter
- `F1` — Formula 1
- `WEC` — FIA World Endurance Championship
- `WRC` — FIA World Rally Championship
- `SUPERGT` — SUPER GT
- `MOTOGP` — MotoGP
- `FDJ` — Formula Drift Japan
- `D1GP` — D1 Grand Prix
- `SUPERFORMULA` — SUPER FORMULA

The same Scriptable loader is used for every category. Set the category in the widget's **Parameter** field. `SF` is also accepted as an alias for SUPER FORMULA.

## Architecture
Scriptable contains only the short loader. The loader fetches `main/motorsport-hub.js`, which routes to the current reliability/visual modules. The accepted seven-category v8.9.6 path remains unchanged; SUPER FORMULA is isolated in `superformula-widget.js` so the expansion can be tested without rewriting the existing visual lock.

Network failure falls back only to validated local module/data caches; invalid modules are not silently accepted.

## Widget sizes
- Small: next event / countdown / venue
- Medium: next event / countdown / TOP 3 / PTS

## QA diagnostics
Run `Motorsport Hub` directly in Scriptable and choose **QA診断**. It checks all **8** current data routes without replacing the home-screen widget configuration.

## Reliability rules
- F1 rejects partial schedule/standings refreshes.
- WRC / FDJ / D1GP retain the current multi-day/weekend event while it is active.
- WEC / SUPER GT / MotoGP include explicit active-event hold windows so they do not advance at the scheduled start instant.
- SUPER FORMULA uses official event-weekend start/end windows, so double-header weekends remain visible until the event weekend ends.
- Unknown future leaders should still display rank/points even when optional local vehicle/team metadata is missing.
- Current 2026 Toyota WEC naming is `TR010 Hybrid / TOYOTA RACING`.

## SUPER FORMULA v9.0.0
- Official standings: `https://superformula.net/sf2/race2026/standings`
- Official 2026 calendar encoded through Rd.11/12 Suzuka.
- Current snapshot fallback: 太田格之進 / 岩佐歩夢 / イゴール・オオムラ・フラガ.
- Next configured event as of the v9.0.0 build: 第9・10戦 富士, 2026/10/9–11.
- Hero source/license recorded in `ATTRIBUTION.md`.

## Asset / licensing status
All current hero assets have source/license records in `ATTRIBUTION.md`.

## Release gates
See:
- `RC_QA.md`
- `RELEASE_AUDIT.md`
- `ATTRIBUTION.md`
- `tests/release-gate.mjs`
- `tests/boundary-gate.mjs`

## Release control
v8.9.6 remains the last fully device-reviewed Release Candidate. v9.0.0 must pass SUPER FORMULA Small/Medium device QA before the expanded build can inherit RC status. No public deployment, Store submission, publication or other external release action should occur without explicit owner approval.
