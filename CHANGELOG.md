# Changelog

## v9.3.0 — GT World Challenge Europe expansion build

### Category expansion
- Added **GT World Challenge Europe** as the eleventh Motorsport Hub category.
- New Widget Parameter: `GTWCEU` (`GTWC` and `GTWC EUROPE` aliases accepted).
- Existing ten category paths remain isolated.

### Data / calendar
- Official overall driver standings: `https://www.gt-world-challenge-europe.com/standings?filter_standing_type=0_0_drivers`.
- Drivers sharing the same championship position/car are grouped into one Medium row to avoid duplicate-position clutter.
- Current fallback TOP3: Lucas Auer / Maro Engel 114.5; Ricardo Feller / Bastian Buus 77; Kelvin Van Der Linde / Charles Weerts 74.
- Current next race: Nürburgring Endurance Cup Main Race, 2026-08-30 15:00 CEST.
- Remaining configured events: Zandvoort / Barcelona / Portimão finale.
- Exact Nürburgring main-race end window prevents early event switching; later rounds use event-weekend windows until detailed session clocks are locked.

### Visuals / licensing
- Added dedicated Small and Medium GTWC Europe layouts.
- Hero: `GT World Challenge Europe 2024 Nürburg Nr. 48 Auer, Engel, Morad (1).jpg`.
- Author: **Lukas Raich**.
- License: **CC BY-SA 4.0**; exact Commons file page verified.

### QA / release gates
- QA diagnostics expanded from 10 to **11** routes.
- Boundary gate covers Nürburgring active race → Zandvoort and Zandvoort weekend retention.
- Release gate validates the GTWC Europe module, official source, grouped TOP3 snapshot, hero and attribution.
- **GTWC Europe 11/11 route + Small/Medium device QA pending.**

---

## v9.2.0 — NASCAR Cup expansion build

### Category expansion
- Added **NASCAR Cup Series** as the tenth category (`NASCAR`, aliases `CUP` / `NASCAR CUP`).
- Primary standings source: official NASCAR public CDN `https://cf.nascar.com/cacher/2026/1/points-feed.json`.
- Remaining Cup calendar encoded from Daytona through Homestead-Miami.
- Hero: TaurusEmerald / CC BY-SA 4.0.

### QA status
- iPhone Small/Medium visual QA: **PASS** on 2026-08-25 00:03 JST.
- Medium rendered fresh standings without `更新待ち`, confirming the direct NASCAR live-widget parser path succeeded.
- A separate 10/10 diagnostics screenshot was not captured before v9.3.0 and is not claimed.
- NASCAR is **LOCKED**.

---

## v9.1.0 — INDYCAR expansion build

### Category expansion
- Added **INDYCAR** as the ninth category (`INDYCAR`, alias `INDY`).
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
