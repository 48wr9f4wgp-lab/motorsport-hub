# Changelog

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
