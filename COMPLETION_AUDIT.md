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

**Completed.**

The deterministic render smoke now covers all 12 categories across all three widget families:

- Small: 12
- Medium: 12
- Large: 12
- **Total: 36 deterministic render cases**

Large checks include event identity, standings surface, `MORE STANDINGS`, and the lower `SEASON` / Dakar `STAGE` context panel. The completion-hardening PR passed both Hardening CI and Release Candidate CI before merge.

### P1-B — final exact-current device resilience check

Before calling the product public-RC-ready, perform one consolidated physical-iPhone session against the exact final release package:

1. online Loader v7 / immutable Candidate path boots;
2. representative routing across the 12-category manifest remains healthy;
3. fully offline verified LKG boots after network is removed;
4. no obvious Large renderer regression on the final package.

This is one consolidated risk-based device session, not a return to 12×manual screenshot iteration.

### P1-C — observability / analytics decision for public distribution

The codebase now includes a **privacy-safe local Loader v7 observability layer**. It writes only to the device-local `motorsport-hub-observability-v1.json` file, keeps at most 200 events, and records release identity, category, widget family, Loader execution path, success/failure and elapsed time. It does not transmit analytics externally and does not collect device identifiers, email, latitude/longitude or advertising identifiers.

Loader execution paths include Candidate, trusted release LKG/fetch, bootstrap LKG/fetch and terminal failure. This materially improves supportability without adding an external service or privacy surface.

Because Loader v7 is intentionally install-once, devices that installed Loader v7 before this observability change must reinstall the updated Loader once to receive the instrumentation. Stable-channel advancement updates the immutable runtime release, not the Loader source itself.

For general public distribution, one policy decision remains: whether local-only diagnostics are sufficient for the initial release, or whether centralized production telemetry is required for aggregate crash/success-rate monitoring. An external service would be needed to observe population-level metrics such as crash-free rate, OS/device-class distribution or fleet-wide API failure rates.

No external analytics/crash service is added by this pass. Choosing or contracting an external service, transmitting user/device data, and defining retention/privacy disclosure require a separate explicit approval and privacy review.

## P2 — backlog / polish, not current release blockers

- raise Hero quality only when a clearly superior policy-compliant source passes existing gates;
- season-rollover automation and fixture refresh maintenance;
- stale historical documentation cleanup after the current audit is merged;
- broader performance/latency budgets if real-device evidence shows a problem;
- optional richer tap/deep-link interactions beyond the current supported behavior.

## QA / release engineering state

Current release engineering provides:
- short-lived branches + PR review;
- Hardening CI and Release Candidate CI;
- syntax and deterministic product gates;
- immutable per-release package generation;
- stable-channel sequence/version/source pinning;
- Loader v7 validation and LKG rollback safety;
- retained release metadata and artifact evidence;
- 36-case Small/Medium/Large render regression coverage;
- bounded local Loader observability with deterministic contract coverage.

## Current decision

**Internal/personal stable operation: ACCEPTED at v9.5.24.**

**Public Release Candidate approval: NOT YET.**

The remaining public-RC gates are intentionally narrow:
1. merge and validate the local-observability pass, then reinstall the updated Loader v7 once on the test device;
2. one consolidated exact-current online + fully-offline iPhone verification;
3. explicitly decide whether local-only diagnostics are sufficient for initial public distribution or whether centralized telemetry is required.

Do not resume broad Hero/UI polishing until one of those gates produces evidence requiring a visual change.
