# Changelog

## v9.2.0 — NASCAR Cup expansion build

### Category expansion
- Added **NASCAR Cup Series** as the tenth Motorsport Hub category.
- New Widget Parameter: `NASCAR` (`CUP` and `NASCAR CUP` aliases accepted).
- Existing nine device-reviewed category paths remain isolated.

### Data / calendar
- Primary standings source: official NASCAR public CDN `https://cf.nascar.com/cacher/2026/1/points-feed.json`.
- Current fallback standings after New Hampshire: Denny Hamlin 1001 / Ryan Blaney 924 / Ty Gibbs 880.
- Remaining 2026 Cup calendar encoded from Daytona through the Homestead-Miami championship.
- Six-hour race windows prevent the widget from advancing immediately at the scheduled start or during normal red-flag delays.

### Visuals / licensing
- Added dedicated Small and Medium NASCAR layouts.
- Hero: `Denny Hamlin 11 Las Vegas 2025.jpg`.
- Author: **TaurusEmerald**.
- License: **CC BY-SA 4.0**; exact Commons file page verified.

### QA / release gates
- QA diagnostics expanded from 9 to **10** routes.
- Boundary gate covers Daytona active-race retention and Daytona → Darlington transition.
- Release gate validates the NASCAR module, official JSON source, calendar, hero and attribution.
- **NASCAR 10/10 route + Small/Medium device QA pending.**

---

## v9.1.0 — INDYCAR expansion build

### Category expansion
- Added **INDYCAR** as the ninth Motorsport Hub category (`INDYCAR`, alias `INDY`).
- Official standings source: `https://www.indycar.com/standings/`.
- Remaining calendar: Milwaukee Race 1 / Milwaukee Race 2 / Laguna Seca finale.
- Hero: Ben Goyette / CC BY-SA 4.0.

### QA status
- iPhone route QA: **9/9 LIVE PASS** on 2026-08-24.
- iPhone Small/Medium visual QA: **PASS**.
- INDYCAR is **LOCKED**.

---

## v9.0.0 — SUPER FORMULA expansion build

### Category expansion
- Added **SUPER FORMULA** as the eighth category (`SUPERFORMULA`, alias `SF`).
- Official standings source: `https://superformula.net/sf2/race2026/standings`.
- Explicit weekend start/end boundaries protect double-header transitions.
- Hero: BWard 1997 / CC BY 4.0.

### QA status
- iPhone route QA: **8/8 LIVE PASS**.
- iPhone Small/Medium visual QA: **PASS**.
- SUPER FORMULA is **LOCKED**.

---

## v8.9.6 — Release Candidate
- Seven-category technical/runtime/attribution RC passed.
- SUPER GT hero replaced with verified CC0 asset.
- No public release action performed.

## v8.9.5
- Event-boundary guards for WEC / SUPER GT / MotoGP plus existing WRC / FDJ / D1GP / F1 protections.

## v8.9.4
- Official 2026 WEC Toyota naming guard: `TR010 Hybrid / TOYOTA RACING`.

## v8.9.2
- Restored SUPER GT machine/team secondary lines.

## v8.9.1
- Added one-tap QA diagnostics.

## v8.9.0
- Reliability pass: atomic F1 refresh, FIA WRC source, season-tail calendars, parser fallbacks and event handling.

## v8.8.x
- Added D1GP as the seventh category.

## v8.7.1
- Final visual polish / universal readability baseline locked.
