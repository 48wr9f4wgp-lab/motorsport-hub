# Changelog

## v9.0.0 — SUPER FORMULA expansion build

### Category expansion
- Added **SUPER FORMULA** as the eighth Motorsport Hub category.
- New Widget Parameter: `SUPERFORMULA` (`SF` alias also accepted).
- Existing seven-category v8.9.6 reliability/visual path is preserved; SUPER FORMULA runs as an isolated dedicated module.

### Data / calendar
- Official standings source: `https://superformula.net/sf2/race2026/standings`.
- Added the complete configured 2026 event-weekend calendar through Rd.11/12 Suzuka.
- Current fallback standings snapshot:
  - 太田 格之進 — 95 pts
  - 岩佐 歩夢 — 44.5 pts
  - イゴール・オオムラ・フラガ — 39 pts
- Current next-event fallback: 第9・10戦 富士, 2026/10/9–11.
- Uses explicit weekend start/end boundaries so double-header events do not switch to the next round midway through the weekend.

### Visuals
- Added dedicated Small and Medium layouts matching the accepted Motorsport Hub visual language.
- Hero: `Igor Fraga Super Formula Round 5 Suzuka Post-Race 2026.jpg`.
- Author: **BWard 1997**.
- License: **CC BY 4.0**; exact Commons file page verified.
- New hero cache namespace prevents cross-category image reuse.

### QA / release gates
- QA diagnostics expanded from 7 to **8** data routes.
- `tests/boundary-gate.mjs` now checks SUPER FORMULA double-header weekend retention and season-final transition.
- `tests/release-gate.mjs` now syntax-checks and validates the SUPER FORMULA module, router, official standings source, calendar, hero and attribution record.

### Status
- Code / repository integration: implemented.
- Licensing gate: PASS.
- **iPhone Small/Medium visual + live-parser QA: pending.**
- v8.9.6 remains the last fully device-reviewed Release Candidate until this new category passes real-device QA.
- No public deployment, Store submission or release action performed.

---

## v8.9.6 — Release Candidate

### Licensing / hero assets
- Closed the final public-distribution attribution blocker.
- Replaced the previously unverified SUPER GT action hero with:
  - `Osaka Auto Messe 2025 (1) - No.36 au TOM'S GR Supra in 2024 SUPER GT.jpg`
  - Author: **Tokumeigakarinoaoshima**
  - License: **CC0 1.0 Universal**
  - Exact Wikimedia Commons file page directly verified.
- Added a fresh SUPER GT hero cache key so devices do not keep the old unverified image.

### Reliability
- v8.9.5 event-boundary guards remain active.
- Official 2026 WEC naming guard remains active: `TR010 Hybrid / TOYOTA RACING`.
- SUPER GT machine/team metadata fallback remains active.

### QA / release gates
- Router moved to `motorsport-reliability-v896.js`.
- `tests/release-gate.mjs` updated to require the verified SUPER GT CC0 asset and reject the stale public-release blocker.
- `ATTRIBUTION.md`, `RC_QA.md`, `RELEASE_AUDIT.md`, and `README.md` updated to v8.9.6.

### Release status
- **Release Candidate: PASS.**
- Technical, runtime-reviewed, boundary and hero-attribution gates are closed.
- No public deployment, Store submission or release action performed. Explicit owner approval is still required before public release.

---

## v8.9.5 — Technical Release Candidate

### Reliability
- Added event-boundary guards so active events do not switch to the next round at the scheduled start instant.
  - WEC: 10-hour active-event hold
  - SUPER GT: 8-hour active-event hold
  - MotoGP: 4-hour active-event hold
- Retained existing active-event handling:
  - WRC: multi-day rally hold
  - FDJ: 40-hour weekend hold
  - D1GP: 40-hour weekend hold
  - F1: race-start retention window
- Preserved atomic F1 schedule/standings refresh and cache fallback behavior.
- Preserved future-leader metadata fallbacks for WEC and SUPER GT.

### Data correctness
- Confirmed official 2026 Toyota WEC display naming as `TR010 Hybrid / TOYOTA RACING`.
- Added a reliability guard so legacy HQ source strings cannot regress that 2026 naming.
- SUPER GT secondary vehicle/team metadata hotfix from v8.9.2 remains active.

### QA
- iPhone one-tap diagnostics: 7/7 data routes LIVE.
- Home-screen Small regression: all seven categories passed.
- Medium regression reviewed across F1 / WEC / WRC / SUPER GT / MotoGP / FDJ / D1GP.
- Added deterministic `tests/boundary-gate.mjs`; boundary simulation passed during the v8.9.5 audit.

### Visuals
- No intentional layout changes after the v8.7.1 visual lock.
- Universal readability / PTS / countdown treatment remains frozen.

### Release status at v8.9.5
- Technical RC passed for private/personal use.
- Public distribution remained blocked by the then-unverified SUPER GT hero; this was resolved in v8.9.6.

---

## v8.9.4
- Added official 2026 WEC Toyota naming guard: `TR010 Hybrid / TOYOTA RACING`.

## v8.9.2
- Restored SUPER GT machine/team secondary lines using car-number + driver-name metadata fallback.

## v8.9.1
- Added one-tap QA diagnostics for all seven data routes.

## v8.9.0
- Reliability pass: atomic F1 refresh, FIA WRC standings route, 2026 season-tail calendars, parser fallbacks and multi-day event handling.

## v8.8.x
- Added D1GP as the seventh category and completed D1GP Small/Medium visual QA.

## v8.7.1
- Final visual polish / universal readability baseline locked.
