# Changelog

## Unreleased — main only

These changes are merged to `main` but are **not** part of Stable v9.5.29 unless/until a later Stable descriptor is explicitly published:

- Dakar 2027 rollover hardening: season-aware cache/LKG behavior prevents a cached 2026 final ranking from being treated as the 2027 live-ranking LKG after 2027 standings are expected; deterministic tests cover pre-start, Stage 1 rollover, stale-2026 rejection and valid-2027 LKG recovery.
- GA workflow hygiene: Hardening CI is read-only; obsolete v9.3 branch mutation paths and the consumed WRC one-shot write workflow were removed; a workflow-hygiene regression gate protects the new permission boundary.
- Public GA documentation/onboarding work is being prepared separately and does not change Stable runtime behavior.

## v9.5.29 — Stable device parser repair

- Current Stable: **sequence 7**.
- Stable sourceRef: `7f3fc1eb6fa93c619c1def732b18d091c9e949ce`.
- Added device-safe WEC standings text fallback while preserving the structured-table parser.
- Added device-safe SUPER GT GT500 text fallback with overlapping rank-marker parsing so score-column numbers cannot consume the next legitimate rank/car marker.
- Added no-table/device-shaped regression fixtures for WEC and SUPER GT.
- Physical iPhone validation: WEC and SUPER GT no longer showed `更新待ち`; both displayed Top 5, including SUPER GT positions 4–5; no visible Large-layout regression was observed.

## v9.5.28 — Stable parser-monitor hardening

- Added scheduled/manual 12-category Live Parser Monitor.
- Monitor requires fresh schema-1 cache generation rather than HTTP 200 alone.
- Repaired server/CI-visible WEC and SUPER GT parser drift.
- Physical iPhone testing then exposed an additional device-response parser shape difference, addressed in v9.5.29.

## v9.5.24 — Public RC baseline

- Public RC baseline before the WEC / SUPER GT parser incident.
- Loader v7 stable-channel delivery, local observability, immutable release verification and 36-case render smoke were in place.

---

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
