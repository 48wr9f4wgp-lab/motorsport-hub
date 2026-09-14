# Motorsport Hub — Install Guide

Motorsport Hub is an iPhone home-screen widget that runs inside [Scriptable](https://scriptable.app/). You install one loader script once; approved Motorsport Hub releases are then discovered automatically through the Stable channel.

## Requirements

- iPhone with Scriptable installed.
- Internet access for first installation and normal live-data refresh.
- A home-screen Scriptable widget slot.

## 1. Install the canonical loader

Use **only** `scriptable-loader-v7.js` from this repository as the installed production script.

### Copy/paste method

1. Open `scriptable-loader-v7.js` in this repository.
2. Copy the entire file.
3. Open Scriptable and create a new script.
4. Name it `Motorsport Hub`.
5. Paste the loader code and save.
6. Run `Motorsport Hub` once inside Scriptable. When run in the app without a category parameter, the Router presents a category picker for preview/testing.

Scriptable's official URL-scheme documentation is available at https://docs.scriptable.app/urlscheme/.

## 2. Add a home-screen widget

1. Add a Scriptable widget to the iPhone home screen.
2. Choose the desired size: Small, Medium, or Large.
3. Edit the widget and select the `Motorsport Hub` script.
4. Set **Parameter** to one of the category values below.

| Category | Parameter | Accepted alias examples |
| --- | --- | --- |
| Formula 1 | `F1` | `FORMULA1` |
| WEC | `WEC` | — |
| WRC | `WRC` | — |
| SUPER GT | `SUPERGT` | — |
| MotoGP | `MOTOGP` | — |
| Formula Drift Japan | `FDJ` | `FORMULADRIFTJAPAN` |
| D1 Grand Prix | `D1GP` | `D1`, `D1GRANDPRIX` |
| SUPER FORMULA | `SUPERFORMULA` | `SF` |
| INDYCAR | `INDYCAR` | `INDY` |
| NASCAR Cup | `NASCAR` | `CUP`, `NASCARCUP` |
| GT World Challenge Europe | `GTWCEU` | `GTWC`, `GTWCEUROPE` |
| Dakar Rally | `DAKAR` | `DAKARRALLY` |
| Diagnostics | `QA` | — |

A blank widget Parameter currently defaults to F1. An unrecognized non-empty Parameter shows a configuration error instead of silently routing to another category.

## 3. Verify the installation

Run the `QA` category once. A healthy current device should show the category data paths and release/source identity. For normal use, switch the widget Parameter back to the desired championship after the check.

## Updates

Do **not** replace the installed loader for every release. Loader v7 reads the approved Stable descriptor, verifies the immutable release source and integrity metadata, and promotes only verified releases. It also retains a local last-known-good release for fallback.

The current Stable version is recorded in `release-channel.json`; repository `main` can be newer than Stable and is not executed directly by Loader v7.

## Hero credits and redistribution

Motorsport Hub uses licensed third-party Hero imagery. The fallback attribution policy is documented in `ATTRIBUTION.md`, and the current dynamic Hero pool is designed to publish a generated human-readable credit file at `hero-live/hero-channel/ATTRIBUTION.md` alongside its machine-readable `channel.json`.

Do not remove source/author/license information when redistributing Hero derivatives.

The repository is public, but the Motorsport Hub software license has **not yet been finally approved**. Public visibility is not itself permission to redistribute or commercially package the software. See `LICENSE_DECISION.md` and `GA_READINESS.md` before redistribution.

## Troubleshooting

See `SUPPORT.md`. If a widget shows `更新待ち`, do not immediately reinstall: the local fallback may be protecting you from an upstream/parser failure. Run `QA` first so the failing layer can be identified.
