# Motorsport Hub

Motorsport Hub is an iPhone home-screen motorsport widget system for [Scriptable](https://scriptable.app/). One installed loader serves 12 championships plus QA diagnostics, with Small / Medium / Large layouts, live/current standings, event context, resilient local fallback, and licensed Hero imagery.

## Current status

- Public Release Candidate: **approved**.
- Current Stable: **v9.5.29 / sequence 7**.
- Stable source: immutable sourceRef `7f3fc1eb6fa93c619c1def732b18d091c9e949ce`.
- WEC / SUPER GT Stable v9.5.29 parser repair: **physical iPhone PASS**.
- Production surface: **12 categories + QA diagnostics**.
- Installed production loader: **`scriptable-loader-v7.js`**.
- Centralized analytics: **none**; bounded local observability only.

Repository `main` can be newer than Stable. Loader v7 does not execute mutable `main` directly.

## Install

Start with **[INSTALL.md](INSTALL.md)**.

Use `scriptable-loader-v7.js` as the installed production loader.

The short version:

1. Install Scriptable on the iPhone.
2. Create a Scriptable script named `Motorsport Hub` and paste the complete contents of `scriptable-loader-v7.js`.
3. Run it once in Scriptable.
4. Add a Scriptable home-screen widget, select `Motorsport Hub`, and set the widget **Parameter** to the championship you want.
5. Run the `QA` parameter once to verify the device/data path.

Future approved Stable releases are discovered by Loader v7 automatically; the installed loader normally does not need to be replaced for each release.

## Widget Parameters

| Championship | Parameter | Alias examples |
| --- | --- | --- |
| Formula 1 | `F1` | `FORMULA1` |
| FIA WEC | `WEC` | — |
| FIA WRC | `WRC` | — |
| SUPER GT | `SUPERGT` | — |
| MotoGP | `MOTOGP` | — |
| Formula Drift Japan | `FDJ` | `FORMULADRIFTJAPAN` |
| D1 Grand Prix | `D1GP` | `D1`, `D1GRANDPRIX` |
| SUPER FORMULA | `SUPERFORMULA` | `SF` |
| INDYCAR | `INDYCAR` | `INDY` |
| NASCAR Cup Series | `NASCAR` | `CUP`, `NASCARCUP` |
| GT World Challenge Europe | `GTWCEU` | `GTWC`, `GTWCEUROPE` |
| Dakar Rally | `DAKAR` | `DAKARRALLY` |
| Diagnostics | `QA` | — |

A blank widget Parameter currently defaults to F1. An invalid non-empty Parameter renders a configuration error instead of silently routing to another category.

## What the widget shows

Circuit-racing categories generally provide:

- Small: next/current event, countdown and venue/context;
- Medium: event context plus top-three standings;
- Large: event context, top five, `MORE STANDINGS`, and lower season/round context.

Dakar uses rally-raid-specific stage, route, SS distance and GAP semantics rather than forcing circuit-racing labels.

## Reliability and updates

The production path is:

```text
Scriptable Loader v7
        ↓
release-channel.json
        ↓
GitHub-verified immutable source commit
        ↓
SHA-256 / byte-length integrity
        ↓
Motorsport Hub Router
        ↓
exactly one selected category module
        ↓
data/cache + approved Hero channel
        ↓
Small / Medium / Large widget
```

Loader v7 requires a monotonic Stable sequence, verified immutable source, successful Release Candidate CI evidence, and exact integrity metadata before promoting an update. It retains local last-known-good release state for recovery. Category modules also use validated local caches/fallback data when a live refresh cannot be trusted.

All 12 categories are covered by deterministic Small / Medium / Large render smoke tests (36 cases total). A scheduled live parser monitor checks the production category parsers separately from ordinary PR CI.

## Hero imagery and attribution

Hero assets are CI-gated for provenance, licensing, image validity and category relevance. The active `hero-live` channel carries per-asset source page, author and license metadata. See **[ATTRIBUTION.md](ATTRIBUTION.md)** for the distribution attribution baseline.

Do not strip attribution/license metadata from redistributed Hero assets.

## Privacy and support

- Privacy behavior: **[PRIVACY.md](PRIVACY.md)**
- Troubleshooting / bug reports: **[SUPPORT.md](SUPPORT.md)**
- Broad-public-release gate: **[GA_READINESS.md](GA_READINESS.md)**

Motorsport Hub has no user account/backend and no automatic external analytics. Loader v7 stores bounded local observability for troubleshooting.

## Development / release references

- `HANDOFF.md` — current development handoff and canonical operational state.
- `COMPLETION_AUDIT.md` — current completion/release assessment.
- `DEVICE_QA_POLICY.md` — physical-device QA policy.
- `RC_FIELD_VALIDATION.md` — evidence-driven field validation procedure.
- `PARSER_MONITORING.md` — live parser-monitoring design.
- `CHANGELOG.md` — release/runtime history.
- `.github/workflows/hardening-ci.yml` — deterministic hardening gates.
- `.github/workflows/release-candidate-ci.yml` — immutable Release Candidate validation.

Visual v1 is locked unless a concrete regression or materially better compliant asset justifies reopening it.

## Stable release rule

Merging code to `main` is **not** the same as publishing Stable. Stable publication is a separate approved operation: runtime source is fixed, validated on a `release/*` ref, packaged with immutable integrity evidence, and only then referenced by a monotonically increasing `release-channel.json` descriptor.

## Distribution license status

The repository is publicly visible, but an explicit software distribution license has **not yet been selected**. Broad GA/redistribution remains gated on an owner-approved software-license decision; public repository visibility should not be interpreted as a blanket redistribution grant.

No Store submission, paid distribution, broad public launch, external analytics contract, or Stable publication is authorized merely because CI is green.
