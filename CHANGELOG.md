# Changelog

## v9.1.0 — INDYCAR expansion build

### Category expansion
- Added **INDYCAR** as the ninth Motorsport Hub category.
- New Widget Parameter: `INDYCAR` (`INDY` alias also accepted).
- Existing v8.9.6 seven-category path and the locked SUPER FORMULA v9.0.0 module remain isolated.

### Data / calendar
- Official standings source: `https://www.indycar.com/standings/`.
- Remaining 2026 calendar configured for Milwaukee Race 1, Milwaukee Race 2 and Laguna Seca finale.
- Current fallback standings: Alex Palou 553 / Kyle Kirkwood 462 / Christian Lundgaard 443.
- Explicit race end windows prevent the Milwaukee double-header from switching races early.

### Visuals / licensing
- Added dedicated Small and Medium INDYCAR layouts.
- Hero: `Alex Palou (54686833932).jpg`, action at Laguna Seca.
- Author: **Ben Goyette**.
- License: **CC BY-SA 4.0**; exact Commons file page verified.

### QA / release gates
- QA diagnostics expanded from 8 to **9** routes.
- Boundary gate now covers Milwaukee Race 1 → Race 2 → Laguna Seca transitions.
- Release gate validates the INDYCAR module, official source, calendar, hero and attribution.
- **INDYCAR device QA pending.**

---

## v9.0.0 — SUPER FORMULA expansion build

### Category expansion
- Added **SUPER FORMULA** as the eighth category (`SUPERFORMULA`, alias `SF`).
- Official standings source: `https://superformula.net/sf2/race2026/standings`.
- Explicit weekend start/end boundaries protect double-header transitions.
- Hero: BWard 1997 / CC BY 4.0.

### QA status
- iPhone route QA: **8/8 LIVE PASS**.
- iPhone Small/Medium visual QA: **PASS** on 2026-08-24.
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
