# Motorsport Hub — Hero Image Attribution

Updated: 2026-09-14 JST

Motorsport Hub uses licensed motorsport imagery as widget Hero backgrounds. Images may be cropped, resized, recomposed into contained derivatives, and darkened/veiled for text readability. Where a source license requires attribution, ShareAlike, or modification notice, those obligations remain applicable to the redistributed derivative.

## Attribution sources of truth

Motorsport Hub has two distinct Hero surfaces and they must not be confused.

### 1. Active `hero-live` channel

The active Hero channel changes independently from executable Stable. Its current machine-readable source of truth is:

`hero-live/hero-channel/channel.json`

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

The runtime accepts only approved license identifiers and requires Commons source-page provenance for live Hero entries. CI validates channel publication before `hero-live` is updated.

Because `hero-live` is dynamic, a static list in `main` must **not** be treated as an exhaustive list of the images a user can see at an arbitrary later time. Re-fetch the current `hero-live/hero-channel/channel.json` for current live-pool attribution.

### 2. Embedded/static fallback Hero inventory

The executable runtime also carries audited fallback Hero assets. The machine-readable fallback inventory is `hero-assets.json`, and equality/provenance expectations are enforced by Hero manifest/runtime gates.

Historical named fallback examples include licensed assets for F1, WEC, WRC, SUPER GT, MotoGP, FDJ, D1GP, SUPER FORMULA, INDYCAR, NASCAR, GT World Challenge Europe, and Dakar. Earlier detailed asset-by-asset audit history remains available in Git history and the machine-readable inventory.

## Modification notice

Motorsport Hub presentation can include the following modifications to source imagery:

- subject-aware crop;
- resize/downscale;
- square or wide derivative generation;
- contained-source recomposition for Large widgets;
- dark overlay / gradient veil for text readability;
- selection/rotation among an approved category pool.

These are presentation modifications; Motorsport Hub does not claim ownership of third-party source photographs.

## License handling

The Hero pipeline currently accepts the approved Creative Commons license set enforced in runtime/CI, including CC BY, CC BY-SA and CC0 variants used by the audited assets.

For CC BY / CC BY-SA assets, preserve the recorded source page, author, license, and modification notice when redistributing the derivative. CC BY-SA obligations may also apply to the redistributed derivative according to the source license terms.

## Distribution-level GA gate

Runtime/CI provenance checks are implemented, and the live channel carries the metadata needed to trace current images. However, before **broad GA distribution**, perform one final distribution-level review that the public attribution surface delivered with Motorsport Hub is sufficient for the then-current `hero-live` pool and its applicable licenses.

That final legal/compliance review is tracked in `GA_READINESS.md`. This document does not itself approve broad public distribution or replace the underlying Creative Commons license terms.
