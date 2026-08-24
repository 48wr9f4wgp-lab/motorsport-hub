# Motorsport Hub

iPhone home-screen motorsport widget for Scriptable.

## Current build
- Expansion build: **v9.2.0**
- Stable seven-category baseline: **v8.9.6 Release Candidate**
- Current categories: **10**
- SUPER FORMULA v9.0.0: **LOCKED / iPhone QA PASS**
- INDYCAR v9.1.0: **LOCKED / iPhone QA PASS**
- NASCAR Cup v9.2.0: **implemented; 10/10 route + Small/Medium iPhone QA pending**
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

The same Scriptable loader is used for every category. Set the category in the widget's **Parameter** field; no loader repaste is required for v9.2.0.

## Architecture
Scriptable contains only the short loader. The loader fetches `main/motorsport-hub.js`, which routes to isolated category/reliability modules. The accepted baseline path remains unchanged; SUPER FORMULA, INDYCAR and NASCAR run in dedicated modules so expansion work does not rewrite the existing visual lock.

Network failure falls back only to validated local module/data caches; invalid modules are not silently accepted.

## Widget sizes
- Small: next event / countdown / venue
- Medium: next event / countdown / TOP 3 / PTS

## QA diagnostics
Run `Motorsport Hub` directly in Scriptable and choose **QA診断**. v9.2.0 checks all **10** current data routes without replacing the home-screen widget configuration.

## Reliability rules
- F1 rejects partial schedule/standings refreshes.
- WRC / FDJ / D1GP retain the current multi-day/weekend event while it is active.
- WEC / SUPER GT / MotoGP include explicit active-event hold windows so they do not advance at the scheduled start instant.
- SUPER FORMULA uses explicit event-weekend start/end windows.
- INDYCAR uses explicit active-race windows, including the Milwaukee double-header transition.
- NASCAR uses the official NASCAR public CDN `points-feed.json` for Cup standings and six-hour race windows for event transition safety.
- Unknown future leaders should still display rank/points even when optional local vehicle/team metadata is missing.
- Current 2026 Toyota WEC naming is `TR010 Hybrid / TOYOTA RACING`.

## SUPER FORMULA v9.0.0
- Official standings: `https://superformula.net/sf2/race2026/standings`
- 2026 calendar encoded through Rd.11/12 Suzuka.
- iPhone route + Small/Medium visual QA: **PASS / LOCKED**.

## INDYCAR v9.1.0
- Official standings: `https://www.indycar.com/standings/`
- Remaining 2026 events: Milwaukee Race 1 / Milwaukee Race 2 / Laguna Seca finale.
- iPhone 9/9 route QA + Small/Medium visual QA: **PASS / LOCKED**.

## NASCAR Cup v9.2.0
- Official standings JSON: `https://cf.nascar.com/cacher/2026/1/points-feed.json`
- Remaining 2026 calendar encoded from Daytona through the Homestead-Miami championship.
- Current fallback standings after New Hampshire: Denny Hamlin 1001 / Ryan Blaney 924 / Ty Gibbs 880.
- Current next event at build time: Daytona, 2026-08-29 19:30 ET.
- Hero: Denny Hamlin No.11 Toyota at Las Vegas 2025 — TaurusEmerald / CC BY-SA 4.0.
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
SUPER FORMULA and INDYCAR are locked after device QA. v9.2.0 must pass NASCAR 10/10 route and Small/Medium iPhone QA before the ten-category expansion can be locked. No public deployment, Store submission, publication or other external release action should occur without explicit owner approval.
