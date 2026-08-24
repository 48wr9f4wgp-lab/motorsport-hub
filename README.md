# Motorsport Hub

iPhone home-screen motorsport widget for Scriptable.

## Release Candidate
- Current candidate: **v8.9.6**
- Visual baseline: v8.7.1
- Status: **Release Candidate — technical and attribution gates closed**
- Public release/deployment: **not performed**; explicit owner approval is still required before any public release action.

## Categories / Widget Parameter
- `F1` — Formula 1
- `WEC` — FIA World Endurance Championship
- `WRC` — FIA World Rally Championship
- `SUPERGT` — SUPER GT
- `MOTOGP` — MotoGP
- `FDJ` — Formula Drift Japan
- `D1GP` — D1 Grand Prix

The same Scriptable script is used for every category. Set the category in the widget's **Parameter** field.

## Architecture
Scriptable contains only the short loader. The loader fetches `main/motorsport-hub.js`, which routes to the current reliability/visual modules. Network failure falls back only to validated local module/data caches; invalid or obsolete modules are not silently accepted.

## Widget sizes
- Small: next event / countdown / venue
- Medium: next event / countdown / TOP 3 / PTS

## QA diagnostics
Run `Motorsport Hub` directly in Scriptable and choose **QA診断**. It checks the seven data routes without replacing the home-screen widget configuration.

## Reliability rules
- F1 rejects partial schedule/standings refreshes.
- WRC / FDJ / D1GP retain the current multi-day/weekend event while it is active.
- WEC / SUPER GT / MotoGP include explicit active-event hold windows so they do not advance at the scheduled start instant.
- Unknown future leaders should still display rank/points even when optional local vehicle metadata is missing.
- Current 2026 Toyota WEC naming is `TR010 Hybrid / TOYOTA RACING`.

## Asset / licensing status
All current hero assets have source/license records in `ATTRIBUTION.md`.
The SUPER GT hero was replaced in v8.9.6 with an exact-page verified **CC0 1.0** au TOM'S #36 image by Tokumeigakarinoaoshima, closing the previous public-distribution attribution blocker.

## Release gates
See:
- `RC_QA.md`
- `RELEASE_AUDIT.md`
- `ATTRIBUTION.md`
- `tests/release-gate.mjs`
- `tests/boundary-gate.mjs`

## Release control
The repository is **RC-ready**, but no public deployment, Store submission, publication or other external release action should occur without explicit owner approval.
