# Motorsport Hub — Release Candidate QA

Updated: 2026-08-28 JST

## Current verdict
- Development branch: `hardening/v9.3-codex-handoff`
- Main baseline: `a09d16e11aa0f65104ba895b74e09124d30b487b`
- Current verified hardening head: `596794c7cd1dd28af026c420c6ac6a4f9f063442`
- Architecture: **12 categories + QA**, one direct category module per route.
- Legacy wrapper waterfall: **removed**.
- Router runtime source rewriting: **removed**.
- Data cache schema: **1 across all 12 categories**.
- Hardening CI: **PASS**.
- Release Readiness dry-run: **PASS**.
- Automated render smoke: **24/24 PASS** = 12 categories × Small/Medium.
- Hero provenance / exact runtime URL manifest gates: **PASS**.
- Hero build-time subject/crop pipeline: **implemented and piloted**.
- Public release / `main` merge: **NOT authorized / NOT performed**.

**Current status: RELEASE-CANDIDATE PREP — AUTOMATED GATES GREEN / CODEX FINAL AUDIT + ONE CONSOLIDATED CURRENT-PACKAGE DEVICE CHECK PENDING**

---

## Latest automated evidence
### Hardening CI
- Run: `#180`
- Run ID: `33159393582`
- Head: `596794c7cd1dd28af026c420c6ac6a4f9f063442`
- Result: **SUCCESS**

The run includes:
- JS/MJS syntax audit;
- release / boundary / Router / Registry gates;
- cache schema gate;
- Hero manifest, discovery, image probe, subject crop, selection, rollout and runtime-crop gates;
- lifecycle gate;
- immutable integrity gate;
- release-package generator gate;
- diagnostics Loader-path gate;
- **24-case Small/Medium render smoke**;
- category-specific gates including Dakar and Tap Action;
- immutable package build/upload;
- sync of tested runtime files to `hardening-live` only after green gates.

### Release Readiness
- Run: `#1`
- Run ID: `33159393670`
- Head: `596794c7cd1dd28af026c420c6ac6a4f9f063442`
- Result: **SUCCESS**
- Workflow has **read-only repository permission**.
- It dry-runs the final main transformation and verifies that the working tree remains unchanged.

### Latest immutable package
- Artifact: `motorsport-hub-immutable-33159393582`
- Artifact ID: `9680972571`
- Digest: `sha256:a2bcc498869dff20e76bd342147c5a8f1e0a0dde9e26e017a540be148b672ad0`
- Head/source: `596794c7cd1dd28af026c420c6ac6a4f9f063442`
- Manifest includes **12 categories + QA**, including Dakar.

---

## Current Router / release-source contract
Hardening Router: `v9.5.2-hardening`.

Manifest:
`F1,WEC,WRC,SUPERGT,MOTOGP,FDJ,D1GP,SUPERFORMULA,INDYCAR,NASCAR,GTWCEU,DAKAR,QA`

Current hardening direct-device default intentionally resolves to:
`hardening-live`

This exists only so iPhone hardening tests cannot silently fall back to stale `main` modules.

**The hardening Router must not be merged to `main` as-is.**
`tools/prepare-main-release.mjs` exists specifically to transform only the release-sensitive values at final approval:
- Router default source: `hardening-live` → `main`;
- Registry statuses → final release status.

`tests/main-release-readiness-gate.mjs` verifies this transformation in dry-run mode without writing files. Write mode is deliberately restricted to `--status=RELEASED` and is not executed during normal CI.

---

## Hero automation status
Hero work is no longer a deferred post-release concept. The current hardening line includes build-time tooling for:
- approved-source catalog and provenance (`hero-assets.json`);
- Commons candidate discovery;
- HTTP / MIME / real image dimension validation;
- license and source metadata checks;
- `IDENTITY`, `ACTION`, `ENVIRONMENT` roles;
- subject-aware crop generation;
- Small / Medium text-safe scoring;
- horizontal-car `BALANCED_OVERSIZE` Small crop;
- MotoGP-scoped `RIDER_FALLBACK`;
- Dakar environment fallback / LKG behavior;
- visual-regression baseline checks;
- rejection / LKG behavior rather than blindly adopting a recent image.

ML/image analysis remains **build-time only**. Scriptable runtime receives fixed approved crop metadata and does not execute TensorFlow.

### Current accepted Hero changes
- F1: action Heroes for Hamilton / Piastri / Russell.
- WEC: existing Toyota No.7 / No.8 assets with accepted crop metadata.
- WRC: Katsuta + high-resolution Ogier CC0 source; broken low-resolution fallback removed.
- MotoGP: Bezzecchi direct vehicle detection; Bagnaia approved rider fallback.
- SUPER GT: old showroom Hero replaced with 2024 Fuji MOTUL AUTECH Z race-action Hero.
- FDJ: existing drift Hero retained with accepted crop.
- D1GP: unrelated King of Europe image replaced with actual D1 Grand Prix action image.
- Dakar: Tap Action + persisted Hero roles, environment fallback and generated crop baseline.

### Locked-category audit
A read-only `Motorsport Hub Locked Hero Audit` analyzed current SUPER FORMULA, INDYCAR, NASCAR and GTWC Europe assets. All four generated analysis artifacts successfully. Visual review concluded **no runtime mutation is justified**:
- INDYCAR: strong action Hero;
- NASCAR: strong action Hero;
- GTWC Europe: Small is tight but acceptable; Medium strong;
- SUPER FORMULA: less action-oriented, but not a release defect worth destabilizing the accepted Visual Lock.

---

## Device evidence
Current direct hardening/device evidence includes:
- Dakar Tap Action / persistence / Small+Medium visual path — **PASS**;
- D1GP Small+Medium — **PASS**;
- FDJ Small+Medium — **PASS**;
- SUPER GT new MOTUL race-action Hero on iPhone after Router/module/cache path correction — **PASS**;
- previous F1, WRC, MotoGP visual locks — **PASS at their earlier accepted runtime**;
- previous SUPER FORMULA / INDYCAR / NASCAR accepted visuals — retained, runtime Hero unchanged in the locked audit;
- immutable Loader v6 architecture online Candidate + fully offline LKG — **previous real-iPhone PASS on the 11-category package**.

Routine manual `12 × 2` screenshot regression remains retired under `DEVICE_QA_POLICY.md`.

### Important remaining device check
The current **12-category** immutable artifact has not yet repeated the physical Candidate + fully-offline LKG verification that was previously proven on the 11-category package. Because the release artifact and multiple Hero/runtime modules have changed, this must be rechecked once on the final post-Codex package.

To minimize manual burden, this should be **one consolidated final device session**, not per-category screenshot QA.

---

## Remaining blockers before Release Approval
1. **Codex final hostile re-audit** of the current 12-category branch: architecture, performance, parser failure modes, cache/integrity paths, Scriptable compatibility, regression risks and release transformation.
2. Any fixes from that audit must return Hardening CI + Release Readiness to green.
3. Generate the final immutable 12-category package after those fixes.
4. Perform **one consolidated iPhone verification** on that exact package:
   - online immutable Candidate boots correctly;
   - 12-category/QA routing is healthy;
   - fully offline verified LKG boots correctly;
   - no obvious renderer regression in the categories changed by the final audit.
5. Synchronize final release docs / changelog.
6. Obtain explicit user approval before running the release finalizer or merging `main`.

## RC decision
**NOT RELEASE APPROVED YET.**

Automated hardening and main-release dry-run gates are green. Remaining blockers are Codex final audit and one final current-package device verification, followed by explicit approval for the reversible-to-final `main` transformation/merge.
