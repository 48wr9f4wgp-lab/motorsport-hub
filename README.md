# Motorsport Hub

iPhone home-screen motorsport widget for Scriptable.

## Current status
- Production baseline: **12 categories + QA diagnostics** on `main`.
- Direct Router architecture: one selected category → one category module.
- Small / Medium production layouts across all categories.
- F1 / WEC Large-family v1 is merged and covered by deterministic gates.
- Active Hero: CI-gated live channel with pool rotation and local LKG.
- Immutable release packaging: **implemented**.
- Stable installed Loader v7 with approved-release auto-update: **implemented on the current release-candidate branch**.

`main` remains the canonical production code baseline. A release is not considered approved merely because code is merged or CI is green; stable-channel publication remains an explicit release action.

## Categories / Widget Parameter
- `F1` — Formula 1
- `WEC` — FIA World Endurance Championship
- `WRC` — FIA World Rally Championship
- `SUPERGT` — SUPER GT
- `MOTOGP` — MotoGP
- `FDJ` — FDJ
- `D1GP` — D1 Grand Prix
- `SUPERFORMULA` — SUPER FORMULA (`SF` alias)
- `INDYCAR` — NTT INDYCAR SERIES (`INDY` alias)
- `NASCAR` — NASCAR Cup Series (`CUP` / `NASCAR CUP` aliases)
- `GTWCEU` — GT World Challenge Europe (`GTWC` / `GTWC EUROPE` aliases)
- `DAKAR` — Dakar Rally
- `QA` — diagnostics when launched directly / selected through the Router UI

One Scriptable loader is shared by every category. Set only the widget **Parameter**; category-specific scripts are not installed separately.

---

## Canonical Scriptable loader
### Installed production loader
**Use `scriptable-loader-v7.js` as the installed production loader.**

Loader v7 is installed once. It does not execute mutable `main` code directly. Instead it:

1. reads `release-channel.json` from the stable channel;
2. requires a monotonic release sequence and rejects rollback/fork updates;
3. requires the immutable source commit to be GitHub-verified;
4. requires successful `Motorsport Hub Release Candidate CI` evidence from a `release/*` validation ref;
5. requires that validation ref to differ from the source commit only by `.release/` metadata;
6. verifies Router byte length + SHA-256;
7. passes the full immutable 12-category + QA integrity descriptor to the Router;
8. promotes only after the Router boots successfully;
9. keeps a local last-known-good release for fallback.

The initial bootstrap is the validated v9.5.10 runtime. Future approved releases change `release-channel.json`; the installed Loader v7 itself does not need to be replaced.

### Release validation artifact
`scriptable-loader-v6.js` remains the per-release immutable CI artifact generated from an exact release validation commit.

It is produced by `tools/generate-release-package.mjs` together with `release-integrity.json`. v6 remains useful as immutable release evidence and device-isolation QA, but is no longer the canonical installed loader after v7 rollout.

### Repository loader files
- `scriptable-loader-v7.js` — **canonical installed production loader**; stable-channel discovery + immutable verification + LKG.
- `scriptable-loader-v6.js` — generated per-release immutable validation artifact.
- `scriptable-loader.js` — **legacy v4 compatibility loader**.
- `scriptable-loader-v5.js` — **legacy transactional compatibility loader**.
- `scriptable-loader-v6-qa.js` — **retired historical QA snapshot**.
- `scriptable-loader-hardening-v5.js` — hardening/device-test utility only.

---

## Architecture

```text
Scriptable stable Loader v7
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
data/cache + approved Active Hero
        ↓
Small / Medium / supported Large Widget
```

The Loader channel pointer is mutable; executable release code is not. A channel update is accepted only after sequence, ancestry, GitHub commit verification, Release Candidate CI evidence, and integrity checks pass.

Current architecture deliberately avoids:
- the historical serial reliability-wrapper waterfall;
- Router-time source rewriting;
- silent fallback from an invalid widget parameter to F1;
- executing mutable `main` as the production code source;
- accepting a channel rollback or release fork;
- promoting code that does not match its immutable SHA-256 descriptor.

All 12 category data caches use schema version 1.

---

## Widget information model
Circuit-racing categories generally use:
- Small: next event / countdown / venue;
- Medium: next event / countdown / top three / points.

F1 / WEC Large v1 extends the Hero-first layout with:
- top three;
- positions 4–5;
- previous / next event context;
- season / round context where available.

Dakar deliberately uses a rally-raid hierarchy:
- Small: next stage / countdown / stage / SS distance / route;
- Medium: stage information + overall CAR top three / GAP.

---

## Hero / licensing pipeline
All runtime Hero assets must be approved by the Hero publication pipeline and retain source/license metadata.

The production line includes build/CI tools for:
- approved-source provenance and licensing;
- Wikimedia candidate discovery;
- HTTP / MIME / actual image-dimension checks;
- subject detection;
- `IDENTITY`, `ACTION`, `ENVIRONMENT` roles;
- Small / Medium subject-aware crop generation;
- text-safe / veil-aware checks;
- Hero Pool Rotation and recent-display cooldown;
- scoped fallback handling;
- LKG/rejection behavior;
- visual-regression artifacts.

Image ML runs at build/CI time, **not inside Scriptable runtime**.

---

## QA and release gates
Primary references:
- `RC_QA.md`
- `RELEASE_AUDIT.md`
- `CODEX_HANDOFF.md`
- `DEVICE_QA_POLICY.md`
- `ATTRIBUTION.md`
- `.github/workflows/hardening-ci.yml`
- `.github/workflows/release-readiness.yml`
- `.github/workflows/release-candidate-ci.yml`

Automated coverage includes syntax, Router/Registry consistency, caches, lifecycle, Hero provenance/selection, immutable integrity, Loader v7 stable-channel policy, release-package generation, diagnostics, category-specific invariants and render smoke.

Physical-device QA remains risk-based. Large layout changes require an actual Large-family screenshot check before being treated as visually complete.

---

## Stable release process
1. Merge the desired runtime changes to `main` after their own review and CI.
2. Record that verified `main` merge commit as the immutable `sourceRef`.
3. Create a dedicated `release/*` branch from that exact source commit.
4. Add only `.release/` metadata to trigger Release Candidate CI.
5. Require `Motorsport Hub Release Candidate CI` to pass.
6. Generate the immutable v6 validation artifact and retain its run ID / validation ref.
7. Update `release-channel.json` with:
   - a strictly increasing sequence;
   - the verified immutable `sourceRef`;
   - Router/module SHA-256 + byte counts;
   - the successful release validation ref and run ID.
8. Run Loader v7 / stable-channel deterministic gates.
9. Obtain explicit owner approval before merging the channel publication change.
10. After publication, installed Loader v7 clients discover the approved release automatically; no Scriptable code replacement is required.

No Store submission, public distribution, deployment or stable-channel publication is authorized merely because automated gates are green.
