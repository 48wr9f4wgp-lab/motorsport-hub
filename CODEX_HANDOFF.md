# Motorsport Hub — Codex Final Quality Pass Handoff

Updated: 2026-08-28 JST

## Start here
- Repository: `48wr9f4wgp-lab/motorsport-hub`
- Working branch: `hardening/v9.3-codex-handoff`
- Main baseline: `a09d16e11aa0f65104ba895b74e09124d30b487b`
- `main` has **not** been modified by this hardening line.
- Product scope: **12 motorsport categories + QA**.
- Public release / main merge: **not authorized / not performed**.
- Latest runtime-equivalent automated-green evidence before documentation synchronization: `596794c7cd1dd28af026c420c6ac6a4f9f063442`, Hardening CI #180 + Release Readiness #1.
- On start, resolve the actual branch HEAD and confirm current CI before changing anything.

**Current verdict: RELEASE-CANDIDATE PREP — AUTOMATED HARDENING GREEN / FINAL HOSTILE AUDIT + ONE FINAL EXACT-PACKAGE DEVICE CHECK PENDING**

Read in order:
1. `CODEX_HANDOFF.md`
2. `RC_QA.md`
3. `RELEASE_AUDIT.md`
4. `category-registry.json`
5. `DEVICE_QA_POLICY.md`
6. `motorsport-hub.js`
7. `.github/workflows/hardening-ci.yml`
8. `.github/workflows/release-readiness.yml`
9. `tools/prepare-main-release.mjs`
10. `hero-assets.json`

---

## Non-negotiable repository rules
1. **Do not reset this branch to `main`.** The hardening line is intentionally hundreds of commits ahead of the original baseline.
2. **Do not run destructive `git reset --hard` / `git clean` against unknown local work.** Inspect `git status`, `git diff`, fetch, then reconcile.
3. Preserve the direct runtime architecture unless a measured defect proves a change is necessary.
4. Do not reintroduce the historical multi-wrapper waterfall or runtime source rewriting.
5. Do not treat `main` as the current product source while auditing; audit the hardening branch.
6. Do not merge or publish. Final `main` transformation and merge require explicit user approval after all gates.
7. Do not weaken a deterministic gate merely to make CI green. Determine whether the gate or product contract is stale, then update the correct side with evidence.
8. Do not casually redesign categories already accepted by risk-based Visual QA.
9. Any runtime modification must finish with syntax/build/gates, render regression and relevant targeted verification.

---

## Current runtime architecture
Router: `motorsport-hub.js`, schema 5.

Manifest:
`F1,WEC,WRC,SUPERGT,MOTOGP,FDJ,D1GP,SUPERFORMULA,INDYCAR,NASCAR,GTWCEU,DAKAR,QA`

Direct modules:
- F1 → `f1-widget-flat-v1000.js`
- WEC → `wec-widget-flat-v1000.js`
- WRC → `wrc-widget-flat-v1000.js`
- SUPER GT → `supergt-widget-flat-v1000.js`
- MotoGP → `motogp-widget-flat-v1000.js`
- FDJ → `fdj-widget-flat-v1000.js`
- D1GP → `d1gp-widget-flat-v1000.js`
- SUPER FORMULA → `superformula-widget.js`
- INDYCAR → `indycar-widget.js`
- NASCAR → `nascar-widget.js`
- GTWC Europe → `gtwc-europe-widget.js`
- Dakar → `dakar-widget.js`
- QA → `motorsport-diagnostics-v890.js`

The Router currently has a **hardening-only direct-device default source of `hardening-live`**. This was introduced after a physical-device defect proved that a hardening outer loader could otherwise end up loading a stale category module from `main`.

### Critical release warning
**Do not merge the current Router to main unchanged.**

The final approved release must use `tools/prepare-main-release.mjs`, whose release transform changes only the intended release-sensitive state:
- default Router source `hardening-live` → `main`;
- category + QA registry statuses → final release status.

`tests/main-release-readiness-gate.mjs` and `.github/workflows/release-readiness.yml` exercise this as a **non-mutating dry-run**. Normal CI must never call write mode.

---

## Automated evidence to preserve
Current Hardening CI includes:
- full JS/MJS syntax audit;
- release, boundary, Router and Registry gates;
- cache schema gate;
- Hero manifest / discovery / image probe / subject crop / selection / rollout / runtime crop gates;
- lifecycle and immutable-integrity gates;
- release-package generator gate;
- diagnostics Loader-path gate;
- **24/24 render smoke = 12 categories × Small/Medium**;
- category-specific flat gates;
- Dakar dedicated gate;
- Tap Action gate;
- immutable package build/upload;
- synchronization of tested runtime to `hardening-live` only after green gates.

Release Readiness is read-only and re-runs the critical release contract plus the main finalizer dry-run.

Latest known immutable artifact before docs-only synchronization:
- Run: Hardening CI #180 / ID `33159393582`
- Artifact ID: `9680972571`
- Artifact: `motorsport-hub-immutable-33159393582`
- Digest: `sha256:a2bcc498869dff20e76bd342147c5a8f1e0a0dde9e26e017a540be148b672ad0`

Do not assume this remains the final release artifact after Codex changes. Regenerate after the final fix commit.

---

## Hero / visual architecture already implemented
This is not future work anymore. Current branch includes build-time tooling for:
- approved Hero provenance / licensing catalog;
- Wikimedia candidate discovery;
- HTTP, MIME and real-dimension validation;
- role scoring (`IDENTITY`, `ACTION`, `ENVIRONMENT`);
- subject-aware Small/Medium crop generation;
- text-safe / veil-aware scoring;
- horizontal-car `BALANCED_OVERSIZE` Small cropping;
- MotoGP-scoped `RIDER_FALLBACK`;
- Dakar environment/LKG fallback;
- visual regression baselines;
- rejection/LKG behavior instead of blindly adopting a new image.

TensorFlow / COCO-SSD is **build-time only**. Do not move ML inference into Scriptable runtime without strong measured justification.

Notable current runtime Hero corrections:
- F1: action set for Hamilton / Piastri / Russell;
- WEC: approved crops for existing Toyota assets;
- WRC: high-resolution Ogier fallback;
- MotoGP: Bagnaia rider fallback + Bezzecchi direct crop;
- SUPER GT: real 2024 Fuji MOTUL AUTECH Z action Hero, replacing showroom image;
- FDJ: retained drift action Hero with approved crop;
- D1GP: actual D1 Grand Prix action Hero, replacing unrelated King of Europe asset;
- Dakar: persisted tap roles, subject-aware crop and safe environment fallback.

Read-only locked-category audit also reviewed SUPER FORMULA / INDYCAR / NASCAR / GTWC Europe. No runtime mutation was justified.

---

## Important real-device history
Treat device findings as evidence, not anecdote.

Passed/current evidence includes:
- Dakar Tap Action + persisted state + visual path;
- D1GP Small+Medium;
- FDJ Small+Medium;
- SUPER GT current red MOTUL Action Hero;
- prior F1/WRC/MotoGP visual locks;
- prior SUPER FORMULA/INDYCAR/NASCAR accepted visuals;
- previous immutable Loader v6 online Candidate and fully-offline LKG on the older 11-category package.

### SUPER GT incident that must not regress
The user saw a stale white/orange showroom image even after the repository had the new MOTUL Hero. Root causes exposed independent freshness layers:
1. Hero image cache;
2. category module cache;
3. Router source default;
4. user common Scriptable loader source;
5. iOS Widget snapshot cache.

Fixes now include:
- asset-aware SUPER GT Hero cache;
- SUPER GT Router module cache key `supergt-flat-v1003`;
- hardening Router source default `hardening-live`;
- hardening source regression gate;
- current common device loader using the hardening source;
- physical re-add proved the current red MOTUL Hero.

Do not revert these freshness protections while simplifying code.

---

## What Codex must do
Perform a hostile final audit, not a cosmetic pass.

### A. Architecture / release engineering
- Inspect direct Router/module architecture for unnecessary coupling, duplicate logic and hidden serial fetches.
- Verify no historical wrapper chain is reachable.
- Verify hardening source selection cannot accidentally read stale `main` during device QA.
- Attack `prepare-main-release.mjs`; prove the main transform is minimal, deterministic and cannot silently ship `hardening-live` as the production default.
- Review immutable Loader v6 Candidate/LKG/quarantine contract and package integrity generation.
- Check all release-generated hashes/byte lengths and cache namespaces for stale-content hazards.

### B. Runtime reliability / Scriptable compatibility
- Profile or reason about memory and network usage for Small and Medium widget execution.
- Look for Scriptable API compatibility problems, unhandled timeouts, repeated large-image decoding and avoidable allocations.
- Verify offline behavior, cache corruption handling, source failure isolation and refresh scheduling.
- Attack date/timezone transitions, lifecycle boundaries and season final states.

### C. Data correctness
For every category, review parser identity assumptions and failure behavior. Prioritize false-positive parsing over cosmetic output.
- F1
- WEC
- WRC
- SUPER GT
- MotoGP
- FDJ
- D1GP
- SUPER FORMULA
- INDYCAR
- NASCAR
- GTWC Europe
- Dakar

Do not replace official/factual data with invented fallback values to make tests pass.

### D. Hero / visual reliability
- Audit Hero provenance and exact runtime/manifest correspondence.
- Verify crop metadata cannot produce invalid Rects or text collisions under source-dimension variation.
- Check cache invalidation semantics when a Hero asset changes.
- Ensure fallback paths cannot reintroduce superseded/unrelated imagery.
- Preserve accepted Visual Locks unless a concrete defect is found.

### E. Tests
- Search for stale assertions that verify yesterday's implementation rather than today's product contract.
- Add regression tests for any defect found.
- Keep 24-case render smoke passing.
- Run the full deterministic gate suite after every final runtime change.
- Run Release Readiness after final fixes.

---

## What Codex should NOT do
- Do not reset to `main`.
- Do not delete hardening work because it looks large.
- Do not flatten all category modules into one giant file.
- Do not reintroduce remote source rewriting or wrapper waterfalls.
- Do not move TensorFlow to Scriptable runtime.
- Do not manually retune every Hero without evidence.
- Do not demand another 12×2 manual screenshot pass from the user.
- Do not mark Release Approved.
- Do not run the release finalizer in write mode.
- Do not merge `main`.

---

## Exit criteria for Codex final pass
Codex may declare its audit/fix pass complete only when:
1. Findings are explicitly listed with severity and resolution.
2. No known P0/P1 launch/control/data-integrity blocker remains.
3. All changed runtime files pass syntax and deterministic gates.
4. 24/24 render smoke remains green.
5. Hardening CI is green on the final fix SHA.
6. Release Readiness is green on the same final fix SHA.
7. A new immutable 12-category artifact is generated from that SHA.
8. `RC_QA.md`, `RELEASE_AUDIT.md` and this handoff are updated to the final tested SHA if code changed.
9. The branch remains unmerged and `main` remains unchanged pending explicit approval.

After Codex completes, the only planned manual gate should be **one consolidated physical-iPhone session on the exact final immutable artifact**: online Candidate / 12-category routing sanity / fully-offline verified LKG / obvious visual regression check. Then request explicit user approval before main finalization and merge.
