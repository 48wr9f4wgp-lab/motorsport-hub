# Motorsport Hub — Hero Image Attribution

Updated: 2026-09-14 JST
Scope: current hardening builds

Motorsport Hub uses licensed motorsport imagery as widget Hero backgrounds. Images may be cropped, resized, recomposed into contained derivatives, and darkened/veiled for text readability. Where a source license requires attribution, ShareAlike, or modification notice, those obligations remain applicable to the redistributed derivative.

## Attribution sources of truth

Motorsport Hub has two distinct Hero surfaces and they must not be confused.

### 1. Active `hero-live` channel

The active Hero channel changes independently from executable Stable. Its machine-readable source of truth is:

`hero-live/hero-channel/channel.json`

The GA attribution publisher generates a human-readable companion from that exact channel:

`hero-live/hero-channel/ATTRIBUTION.md`

Each published active/pool asset records at least:

- category;
- asset identifier/version;
- exact Wikimedia Commons `sourcePage`;
- source title;
- author;
- license;
- source year/date where available;
- role/quality metadata;
- published derivative URLs and dimensions.

The runtime accepts only approved license identifiers and requires Commons source-page provenance for live Hero entries. CI validates channel publication. The public attribution generator/validator additionally requires a non-empty source title, author, supported license, exact Commons source page, license link, and a modification notice for every unique currently publishable pool asset.

Because `hero-live` is dynamic, the generated `hero-live/hero-channel/ATTRIBUTION.md` is the preferred public credit surface for the live pool. A static list in `main` must **not** be treated as an exhaustive list of images a user can see at an arbitrary later time.

### Current live-pool audit snapshot — 2026-09-14

The current `hero-live` channel contains five live categories:

- WEC — CC BY-SA 4.0 pool;
- WRC — CC BY 4.0 pool;
- Formula 1 — CC BY-SA 4.0 pool;
- SUPER FORMULA — CC BY 4.0 pool;
- NASCAR — CC BY-SA 4.0 pool.

All current live-pool entries inspected in this audit carry source-page, author and license metadata. This snapshot is evidence only; the generated live attribution file remains the ongoing source for dynamic public credits.

### 2. Embedded/static fallback Hero inventory

The executable runtime also carries audited fallback Hero assets. The machine-readable fallback inventory is `hero-assets.json`, and equality/provenance expectations are enforced by Hero manifest/runtime gates.

The following audit identities are intentionally retained because release gates use them to prove the embedded/fallback attribution baseline has not been silently erased:

- Formula 1: **Lewis Hamilton / Ferrari SF-25 FP1**, **Oscar Piastri / McLaren MCL39 FP1**, and **George Russell / Mercedes W16 FP3**. Author: **Liauzh**. License: **CC BY-SA 4.0**.
- WRC: Toyota GR Yaris Rally 1 fallback set. Author: **TTTNIS**. License: **CC0 1.0 Universal**.
- WEC: Toyota GR010 Hybrid fallback set. Author: **MarcelX42**. License: **CC BY-SA 4.0**.
- MotoGP: audited 2025 Malaysia fallback assets. Author: **Liauzh**. License: **CC BY-SA 4.0**.
- Formula Drift Japan: audited drift fallback. License: **CC0 1.0 Universal**.
- D1GP: `D1GP (5679098995).jpg`. Author: **Rick Flores (Flickr: Ricky Flores)**. License: **CC BY 2.0 Generic**. Runtime derivative uses the accepted subject-aware Small/Medium crop.
- SUPER GT: `MOTUL AUTECH Z 2024 rd.2 FUJI.jpg`. Author: **Abarabone1206**. License: **CC BY 4.0**. Runtime derivative uses the accepted subject-aware Small/Medium crop.
- SUPER FORMULA: audited Suzuka fallback. Author: **BWard 1997**. License: **CC BY 4.0**.
- INDYCAR: audited Alex Palou fallback. Author: **Ben Goyette**. License: **CC BY-SA 4.0**.
- NASCAR Cup: audited Denny Hamlin fallback. Author: **TaurusEmerald**. License: **CC BY-SA 4.0**.
- GT World Challenge Europe: audited Nürburgring No.48 fallback. Author: **Lukas Raich**. License: **CC BY-SA 4.0**.
- Dakar: audited Dacia Sandrider identity fallback. Author: **Alexander-93**. License: **CC BY-SA 4.0**; Dakar action fallbacks include **CC BY 2.0** assets.

These records describe the audited fallback/runtime baseline. They do not replace the current `hero-live` attribution for dynamically published imagery.

## Modification notice

Motorsport Hub presentation can include the following modifications to source imagery:

- subject-aware crop;
- resize/downscale;
- square or wide derivative generation;
- contained-source recomposition for Large widgets;
- dark overlay / gradient veil for text readability;
- selection/rotation among an approved category pool.

These are presentation modifications; Motorsport Hub does not claim ownership of third-party source photographs and does not imply creator endorsement.

## License handling

The Hero pipeline currently accepts the approved Creative Commons license set enforced in runtime/CI, including CC BY, CC BY-SA and CC0 variants used by the audited assets.

For CC BY / CC BY-SA assets, preserve the recorded source page, author, license and modification notice when redistributing the derivative. ShareAlike obligations remain applicable to adaptations where required by the source license. CC0 assets do not require attribution, but retaining source metadata remains useful provenance practice.

## Distribution-level GA gate

The technical attribution path is considered **implementation-ready** when all of the following are true:

1. `tools/build-hero-public-attribution.mjs` and `tools/validate-hero-public-attribution.mjs` are merged;
2. the `Motorsport Hub Hero Public Attribution` workflow has successfully published `hero-live/hero-channel/ATTRIBUTION.md` from the current live channel;
3. the public install/README path points users to the attribution surface;
4. the exact file is checked once immediately before broad GA.

This document does not itself approve broad public distribution or replace the underlying Creative Commons license terms.
