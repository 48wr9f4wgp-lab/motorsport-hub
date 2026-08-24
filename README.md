# Motorsport Hub

iPhone home-screen motorsport widget for Scriptable.

## Current build
- Expansion build: **v9.3.0**
- Stable seven-category baseline: **v8.9.6 Release Candidate**
- Current categories: **11**
- SUPER FORMULA v9.0.0: **LOCKED / iPhone QA PASS**
- INDYCAR v9.1.0: **LOCKED / iPhone QA PASS**
- NASCAR Cup v9.2.0: **LOCKED / direct live-widget + Small/Medium iPhone QA PASS**
- GT World Challenge Europe v9.3.0: **implemented; 11/11 route + Small/Medium iPhone QA pending**
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
- `NASCAR` — NASCAR Cup Series (`CUP` / `NASCAR CUP` aliases)
- `GTWCEU` — GT World Challenge Europe (`GTWC` / `GTWC EUROPE` aliases)

The same Scriptable loader is used for every category. Set the category in the widget's **Parameter** field; no loader repaste is required for v9.3.0.

## Architecture
Scriptable contains only the short loader. The loader fetches `main/motorsport-hub.js`, which routes to isolated category/reliability modules. The accepted baseline path remains unchanged; SUPER FORMULA, INDYCAR, NASCAR and GTWC Europe run in dedicated modules so expansion work does not rewrite the existing visual lock.

Network failure falls back only to validated local module/data caches; invalid modules are not silently accepted.

## Widget sizes
- Small: next event / countdown / venue
- Medium: next event / countdown / TOP 3 / PTS

## QA diagnostics
Run `Motorsport Hub` directly in Scriptable and choose **QA診断**. v9.3.0 checks all **11** current data routes without replacing the home-screen widget configuration.

## Reliability rules
- F1 rejects partial schedule/standings refreshes.
- WRC / FDJ / D1GP retain the current multi-day/weekend event while it is active.
- WEC / SUPER GT / MotoGP include explicit active-event hold windows so they do not advance at the scheduled start instant.
- SUPER FORMULA uses explicit event-weekend start/end windows.
- INDYCAR uses explicit active-race windows, including the Milwaukee double-header transition.
- NASCAR uses the official NASCAR public CDN `points-feed.json` and six-hour race windows.
- GTWC Europe uses the official overall-driver standings page. Drivers sharing the same championship position/car are grouped into one row, and the exact Nürburgring main-race window is used before switching to later event-weekend windows.
- Unknown future leaders should still display rank/points even when optional local vehicle/team metadata is missing.
- Current 2026 Toyota WEC naming is `TR010 Hybrid / TOYOTA RACING`.

## SUPER FORMULA v9.0.0
- Official standings: `https://superformula.net/sf2/race2026/standings`
- iPhone route + Small/Medium visual QA: **PASS / LOCKED**.

## INDYCAR v9.1.0
- Official standings: `https://www.indycar.com/standings/`
- iPhone 9/9 route + Small/Medium visual QA: **PASS / LOCKED**.

## NASCAR Cup v9.2.0
- Official standings JSON: `https://cf.nascar.com/cacher/2026/1/points-feed.json`
- Remaining calendar encoded from Daytona through Homestead-Miami.
- iPhone Small/Medium QA at 2026-08-25 00:03 JST: **PASS**; Medium rendered fresh standings without `更新待ち`, confirming the direct NASCAR live parser path succeeded on-device.
- A standalone 10/10 diagnostics screenshot was not captured before the v9.3.0 expansion; this is not recorded as having occurred.
- Status: **LOCKED**.

## GT World Challenge Europe v9.3.0
- Official overall standings: `https://www.gt-world-challenge-europe.com/standings?filter_standing_type=0_0_drivers`
- Current next event: Nürburgring Endurance Cup, Main Race 2026-08-30 15:00 CEST (3 hours).
- Remaining configured events: Zandvoort / Barcelona / Portimão finale.
- Current fallback TOP3 grouped by shared championship position/car:
  - Lucas Auer / Maro Engel — 114.5
  - Ricardo Feller / Bastian Buus — 77
  - Kelvin Van Der Linde / Charles Weerts — 74
- Hero: No.48 Mercedes-AMG GT3 EVO at Nürburgring 2024 — Lukas Raich / CC BY-SA 4.0.
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
SUPER FORMULA, INDYCAR and NASCAR are locked after device QA. v9.3.0 must pass GTWC Europe 11/11 route and Small/Medium iPhone QA before the eleven-category expansion can be locked. No public deployment, Store submission, publication or other external release action should occur without explicit owner approval.
