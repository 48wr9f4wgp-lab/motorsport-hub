# Motorsport Hub — Current Completion Audit

Updated: 2026-09-14 JST
Status: **CURRENT AUDIT**

This document is the current product-completion snapshot for Motorsport Hub and supersedes the release-status conclusions in the historical 2026-08-28 `RC_QA.md` and `RELEASE_AUDIT.md`. Those files remain useful as hardening history but must not be read as the current release state.

## Current baseline

- Canonical repository: `48wr9f4wgp-lab/motorsport-hub`
- Current stable: **v9.5.24**
- Stable sequence: **5**
- Stable sourceRef: `bd677ba4ae20a95501cbc043b34a6ca1a1ca8c39`
- Stable releaseId: `mh-bd677ba4ae20`
- Stable-channel publication merge: `e982fca2129f84f7ff30c1182db72639db22388c`
- Product surface: **12 motorsport categories + QA diagnostics**
- Installed production loader: **Loader v7**

## Product state

### P0 — launch / routing / unusable-state blockers

**No currently observed P0 blocker.**

Evidence in the current architecture includes:
- direct Router → exactly one category module;
- explicit invalid-parameter handling;
- immutable release descriptor with SHA-256 + byte-length verification;
- GitHub-verified source commit and Release Candidate CI evidence before Loader v7 promotion;
- monotonic stable sequence / rollback-fork protection;
- release-namespaced Loader LKG;
- schema-1 category data cache across all 12 categories;
- Active Hero cache/LKG/fail-closed behavior;
- category/lifecycle/cache/integrity deterministic gates.

This is not a claim that future upstream data-source failures cannot occur. It means no reproducible launch/routing/progress-equivalent blocker is known at this audit point.

### Visual / layout lock

**Visual v1 is locked for the current RC path.**

Accepted current direction:
- Large typography scale: 1.12× across all 12 categories;
- Large lower information panel: adaptive flex spacing / bottom-weighted composition across all 12 categories;
- representative iPhone Large verification: accepted after v9.5.24 publication;
- Hero publication remains CI-gated with provenance/license checks, pool rotation, LKG and fail-closed policy.

Do not reopen per-category Hero or spacing micro-tuning without a concrete regression or materially better source asset. Remaining visual differences are backlog polish, not a reason for another screenshot loop.

## P1 — required before public Release Candidate approval

### P1-A — Large automated rendering coverage

The historical render smoke covered only 12 categories × Small/Medium = 24 cases. Since Large is now a first-class family across all 12 categories, the completion-hardening change extends this to:

- Small: 12
- Medium: 12
- Large: 12
- **Total: 36 deterministic render cases**

Large checks include event identity, standings surface, `MORE STANDINGS`, and the lower `SEASON` / Dakar `STAGE` context panel.

### P1-B — final exact-current device resilience check

Before calling the product public-RC-ready, perform one consolidated physical-iPhone session against the exact final release package:

1. online Loader v7 / immutable Candidate path boots;
2. representative routing across the 12-category manifest remains healthy;
3. fully offline verified LKG boots after network is removed;
4. no obvious Large renderer regression on the final package.

This is one consolidated risk-based device session, not a return to 12×manual screenshot iteration.

### P1-C — observability / analytics decision for public distribution

The repository currently has local QA diagnostics and deterministic CI, but no identified production analytics / crash telemetry integration.

For a private/personal Scriptable install this can remain intentionally absent. For general public distribution, the release plan must explicitly decide how to observe at minimum:
- release version;
- device / OS class where permitted;
- runtime exception / stack information;
- upstream/API failure class;
- crash-free or successful-run rate proxy;
- privacy-safe breadcrumbs sufficient to diagnose release regressions.

No external analytics/crash service is added by this audit. Choosing or contracting an external service, transmitting user/device data, and defining retention/privacy disclosure require a separate explicit approval and privacy review.

## P2 — backlog / polish, not current release blockers

- raise Hero quality only when a clearly superior policy-compliant source passes existing gates;
- season-rollover automation and fixture refresh maintenance;
- stale historical documentation cleanup after the current audit is merged;
- broader performance/latency budgets if real-device evidence shows a problem;
- optional richer tap/deep-link interactions beyond the current supported behavior.

## QA / release engineering state

Current release engineering already provides:
- short-lived branches + PR review;
- Hardening CI and Release Candidate CI;
- syntax and deterministic product gates;
- immutable per-release package generation;
- stable-channel sequence/version/source pinning;
- Loader v7 validation and LKG rollback safety;
- retained release metadata and artifact evidence.

The current completion-hardening pass adds Large to the render regression matrix. CI must be green before this audit is treated as accepted.

## Current decision

**Internal/personal stable operation: ACCEPTED at v9.5.24.**

**Public Release Candidate approval: NOT YET.**

The remaining public-RC gates are intentionally narrow:
1. 36-case render smoke green in CI;
2. one consolidated exact-current online + fully-offline iPhone verification;
3. explicit observability/privacy decision appropriate to the intended public distribution model.

Do not resume broad Hero/UI polishing until one of those gates produces evidence requiring a visual change.
