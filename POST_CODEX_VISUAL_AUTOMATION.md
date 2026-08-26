# Motorsport Hub — Post-Codex Visual Automation Plan

Status: **FORMALLY PLANNED / DO NOT IMPLEMENT DURING CURRENT HARDENING UNLESS NEEDED FOR A BLOCKER**

This file is a required post-Codex work item. It exists because manual per-category Small/Medium visual QA and manual Hero recropping do not scale to 11–12+ categories.

## Objective
After Codex re-audits and merges the hardening architecture, replace manual Hero maintenance and broad manual visual QA with an automated image/render pipeline.

The user requirement is explicit:
- higher Hero image quality is desirable;
- Hero updates must not require manual crop/focus tuning every time;
- category/data updates must not cause random Hero reframing;
- manual iPhone QA should be reduced to targeted release gates, not 11 categories × 2 sizes after every change.

## Required Hero Rendering Engine
Create one shared Hero Rendering Engine used by all categories.

Pipeline target:
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
A generated record should be equivalent to:

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

Exact schema can change after implementation research, but the concepts must remain machine-readable and deterministic.

## Hero update policy
Separate standings/event refresh from Hero refresh.

- Standings/event data: normal frequent refresh cadence.
- Hero: replace only when a newly approved asset is objectively better or the current asset becomes invalid.
- A standings change must not automatically force a new Hero.
- A Hero source change alone triggers crop regeneration.
- Stable Hero composition is preferred over frequent novelty.

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
The image pipeline must integrate with `hero-assets.json` (or its successor):
- exact source page;
- author;
- license;
- modification notice obligation;
- runtime/derived asset identity.

Unverified assets must never enter the automatic candidate pool.

## Automated Visual QA target
Replace the current broad manual matrix with automated/static checks wherever possible.

Automate at minimum:
- missing Hero/source asset;
- invalid image decode;
- crop outside source bounds;
- subject clipped below defined threshold;
- text-safe-area violation where deterministically measurable;
- category accent/badge/data-field presence;
- Small/Medium renderer completion;
- long title/name fixture overflow risks;
- malformed metadata separators;
- cache/data/season/parser/boundary tests already covered by repository gates.

Investigate a Visual QA harness that can generate deterministic preview artifacts for all categories and sizes in one run. It does not have to replace final real-device QA, but it should make iPhone testing a spot-check rather than the primary regression system.

## Reduced real-device QA policy
Until the automated visual pipeline exists, use risk-based device QA:

### Required manually
- a renderer/module whose layout code changed;
- a new category with no prior device baseline;
- a new Hero/crop policy;
- changes involving safe areas, font sizing, line limits, PTS alignment or countdown placement;
- final RC representative spot-check.

### Do not repeat manually after every unrelated change
- categories whose renderer/Hero/layout did not change;
- Small+Medium for every category when only data/cache/parser logic changed;
- previously locked expansion categories when current changes do not touch renderer output.

## Current hardening evidence relevant to risk-based QA
As of 2026-08-26, current hardening device evidence includes:
- QA diagnostics: 11/11 LIVE after WEC parser fix;
- F1 Small/Medium: PASS;
- WRC Small/Medium: PASS;
- MotoGP Small/Medium: PASS;
- FDJ Small/Medium: PASS.

Do not convert untested categories to PASS from this note. It only supports reducing redundant retests where no renderer-level risk exists.

## Post-Codex execution order
After Codex returns:
1. Codex re-audits `hardening/v9.3-codex-handoff` against audited base.
2. Run/fix all repository gates.
3. Complete merge decision for hardening architecture.
4. Remove remaining Router lifecycle source transforms by moving lifecycle into expansion modules.
5. Implement Hero Rendering Engine + derived-asset pipeline.
6. Implement automated Visual QA harness/fixtures.
7. Re-baseline current categories once under the new pipeline.
8. Only then expand Hero automation to Dakar/new categories.

## Non-goal
Do not turn Hero selection into uncontrolled AI-generated or constantly changing visual output. The result must remain deterministic, licensed, cacheable, auditable, and visually stable.
