# Motorsport Hub

iPhone home-screen motorsport widget for Scriptable.

## Current build
- Expansion build: **v9.1.0**
- Stable seven-category baseline: **v8.9.6 Release Candidate**
- Current categories: **9**
- SUPER FORMULA v9.0.0: **8/8 route QA + Small/Medium iPhone visual QA PASS**
- INDYCAR v9.1.0: **implemented; live-route + Small/Medium iPhone QA pending**
- Public release/deployment: **not performed**; explicit owner approval is required before any public release action.

## Categories / Widget Parameter
- `F1` — Formula 1
- `WEC` — FIA World Endurance Championship
- `WRC` — FIA World Rally Championship
- `SUPERGT` — SUPER GT
- `MOTOGP` — MotoGP
- `FDJ` — Formula Drift Japan
- `D1GP` — D1 Grand Prix
- `SUPERFORMULA` — SUPER FORMULA (`SF` alias)
- `INDYCAR` — NTT INDYCAR SERIES (`INDY` alias)

The same Scriptable loader is used for every category. Set the category in the widget's **Parameter** field; no loader repaste is required for v9.1.0.

## Architecture
Scriptable contains only the short loader. The loader fetches `main/motorsport-hub.js`, which routes to isolated category/reliability modules. The accepted seven-category v8.9.6 path remains unchanged; SUPER FORMULA and INDYCAR are isolated in dedicated modules so expansion work does not rewrite the existing visual lock.

Network failure falls back only to validated local module/data caches; invalid modules are not silently accepted.

## Widget sizes
- Small: next event / countdown / venue
- Medium: next event / countdown / TOP 3 / PTS

## QA diagnostics
Run `Motorsport Hub` directly in Scriptable and choose **QA診断**. v9.1.0 checks all **9** current data routes without replacing the home-screen widget configuration.

## Reliability rules
- F1 rejects partial schedule/standings refreshes.
- WRC / FDJ / D1GP retain the current multi-day/weekend event while it is active.
- WEC / SUPER GT / MotoGP include explicit active-event hold windows so they do not advance at the scheduled start instant.
- SUPER FORMULA uses official event-weekend start/end windows, so double-header weekends remain visible until the event weekend ends.
- INDYCAR keeps each race visible through a four-hour active-race window; the Milwaukee double-header advances from Race 1 to Race 2 only after Race 1's hold ends.
- Unknown future leaders should still display rank/points even when optional local vehicle/team metadata is missing.
- Current 2026 Toyota WEC naming is `TR010 Hybrid / TOYOTA RACING`.

## SUPER FORMULA v9.0.0
- Official standings: `https://superformula.net/sf2/race2026/standings`
- 2026 calendar encoded through Rd.11/12 Suzuka.
- iPhone route QA + Small/Medium visual QA: **PASS**.
- Hero source/license recorded in `ATTRIBUTION.md`.

## INDYCAR v9.1.0
- Official standings: `https://www.indycar.com/standings/`
- Remaining 2026 events encoded: Milwaukee Race 1 / Milwaukee Race 2 / Laguna Seca finale.
- Current snapshot fallback: Alex Palou / Kyle Kirkwood / Christian Lundgaard.
- Current next event at build time: Milwaukee Race 1, 2026-08-29.
- Hero: Alex Palou at Laguna Seca 2025 — Ben Goyette / CC BY-SA 4.0.
- Device QA: **pending**.

## Asset / licensing status
All current hero assets have exact source/license records in `ATTRIBUTION.md`.

## Release gates
See:
- `RC_QA.md`
- `RELEASE_AUDIT.md`
- `ATTRIBUTION.md`
- `tests/release-gate.mjs`
- `tests/boundary-gate.mjs`

## Release control
SUPER FORMULA is locked after device QA. The current v9.1.0 expansion must pass INDYCAR live-route and Small/Medium device QA before the nine-category build can be considered expansion-RC complete. No public deployment, Store submission, publication or other external release action should occur without explicit owner approval.
