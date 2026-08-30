# Motorsport Hub — Visual Automation Plan

Status: **PHASE 1 ACTIVE — DAKAR SELECTION GATE**

2026-08-27: the user explicitly approved starting Hero automation before Codex returns. This supersedes the earlier hold instruction for the limited Phase 1 scope below. It does **not** authorize main merge, public release, broad architecture rewrite, or uncontrolled automatic image publication.

## Objective
Replace manual Hero maintenance and broad manual Small/Medium visual QA with a deterministic, licensed, auditable image/render pipeline.

User requirements:
- use higher-quality and more recent Hero images where they improve the widget;
- do not require manual crop/focus tuning every time an image changes;
- standings/data refresh must not randomly reframe the Hero;
- bad new images must not replace a known-good Hero;
- iPhone QA should become a targeted release gate rather than the primary regression system.

## Phase 1 — Dakar deterministic Hero Selection Gate
Implemented scope:
1. Approved Hero candidates continue to come from `hero-assets.json`.
2. `hero-selection-policy.json` adds deterministic machine-readable quality observations and role thresholds for Dakar.
3. `tools/hero-selection-engine.mjs` evaluates license/source integrity, source resolution, subject visibility, text-safe score, composition, recency and role fit.
4. Three explicit Hero roles are used: `IDENTITY`, `ACTION`, `ENVIRONMENT`.
5. Distinct variants are required for the three Tap Action slots.
6. A candidate below hard quality thresholds is not automatically promoted.
7. If no better eligible distinct candidate exists, the role stays on its LKG (last-known-good) asset.
8. `tests/hero-selection-gate.mjs` proves deterministic selection, license rejection, LKG hold and future promotion behavior.
9. CI emits `hero-selection-report.json` into the immutable hardening artifact.

Current Dakar device evidence from 2026-08-27 is intentionally encoded as pilot metadata, not represented as computer-vision output. In particular, the current H3 environmental shot has a very small vehicle in both Small and Medium. Under the new policy it is **not eligible for fresh automatic promotion**; it is retained only as the current LKG until a better approved ENVIRONMENT candidate exists.

## What Phase 1 does not yet claim
The following remain unimplemented and must not be described as complete:
- automatic discovery of recent source images;
- automatic license scraping/approval;
- computer-vision subject detection;
- automatic crop rectangle generation;
- automatic veil generation from image statistics;
- generated Small/Medium image derivatives at build time;
- full visual regression image comparison;
- 12-category rollout.

## Required Hero Rendering Engine
The full shared Hero Rendering Engine target remains:
1. Hero candidate is selected from approved/licensed asset inventory.
2. Fetch highest practical source resolution (prefer >= 2048 px, use larger source when justified).
3. Validate image dimensions, decode success and minimum quality threshold.
4. Detect/estimate primary race subject position (car/bike) and important visual bounds.
5. Calculate stable Small and Medium crop automatically.
6. Reserve text-safe region, especially left-side information area and right-side PTS/countdown area.
7. Generate standard dark/readability veil automatically.
8. Produce versioned Small/Medium derived assets/cache.
9. Update machine-readable asset metadata.
10. If any validation step fails, keep the last-known-good Hero instead of publishing a poor crop.

Do not run expensive subject analysis on every Scriptable widget refresh. Prefer build/update-time preprocessing and store lightweight crop metadata or derived images for Scriptable consumption.

## Crop metadata target
A generated record should remain equivalent in concept to:

```json
{
  "assetId": "example-current-hero",
  "sourceVersion": "...",
  "focusX": 0.63,
  "focusY": 0.51,
  "smallCrop": {"x":0,"y":0,"w":0,"h":0},
  "mediumCrop": {"x":0,"y":0,"w":0,"h":0},
  "textSafeLeft": 0.42,
  "qualityScore": 0.0
}
```

Exact schema can evolve, but the concepts must remain machine-readable and deterministic.

## Hero update policy
Separate standings/event refresh from Hero refresh.

- Standings/event data: normal frequent refresh cadence.
- Hero: replace only when a newly approved asset is objectively better or the current asset becomes invalid.
- A standings change must not automatically force a new Hero.
- A Hero source change alone triggers crop regeneration.
- Stable Hero composition is preferred over frequent novelty.
- "Recent" is a ranking signal, not a bypass around quality or licensing gates.

## Image quality target
Do not improve perceived quality by blindly increasing final bitmap size.

Preferred flow:
**high-resolution source -> validated crop -> high-quality downsample -> exact widget derivative**.

Goals:
- preserve sponsor/logo/body detail;
- avoid overcompressed/scaled-up source assets;
- avoid unnecessary Scriptable memory/network cost;
- keep Small/Medium visually sharper than current implementation where source quality allows it.

## License integration
The image pipeline must remain integrated with `hero-assets.json` (or a documented successor):
- exact source page;
- author;
- license;
- modification notice obligation;
- runtime/derived asset identity.

Unverified assets must never enter the automatic candidate pool.

## Automated Visual QA target
Automate at minimum:
- missing Hero/source asset;
- invalid image decode;
- crop outside source bounds;
- subject clipped/below defined threshold;
- text-safe-area violation where deterministically measurable;
- category accent/badge/data-field presence;
- Small/Medium renderer completion;
- long title/name fixture overflow risks;
- malformed metadata separators;
- existing cache/data/season/parser/boundary gates.

Investigate deterministic preview artifacts for all categories and sizes. They do not replace final device QA, but should make iPhone testing a spot-check.

## Reduced real-device QA policy
Required manually:
- renderer/module layout changes;
- a new category with no device baseline;
- a new Hero/crop policy;
- safe-area/font/line-limit/alignment changes;
- representative final RC spot-check.

Do not repeat manually after unrelated data/cache/parser changes for categories whose renderer/Hero/layout is unchanged.

## Execution order from current state
1. Dakar Phase 1 selection gate and CI report.
2. Add automatic candidate-source discovery for recent licensed images, without auto-publishing them.
3. Add build-time image validation and dimension/decode checks.
4. Add deterministic subject/crop analysis and text-safe metrics.
5. Generate Small/Medium derived Hero assets and LKG metadata.
6. Add visual regression preview artifacts.
7. Re-baseline Dakar once under the generated crop pipeline.
8. Expand the proven engine to the other 11 categories.
9. Codex final attack audit: architecture, performance, failure isolation and visual pipeline.
10. Release Candidate gate; main/public release only after explicit approval.

## Non-goal
Do not turn Hero selection into uncontrolled AI-generated or constantly changing output. The result must remain deterministic, licensed, cacheable, auditable and visually stable.
