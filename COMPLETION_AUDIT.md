# Motorsport Hub — Current Completion Audit

Updated: 2026-09-14 JST
Status: **PUBLIC RC APPROVED**

This document is the current product-completion snapshot for Motorsport Hub and supersedes the release-status conclusions in the historical 2026-08-28 `RC_QA.md` and `RELEASE_AUDIT.md`. Those files remain useful as hardening history but must not be read as the current release state.

## Current baseline

- Canonical repository: `48wr9f4wgp-lab/motorsport-hub`
- Current stable: **v9.5.24**
- Stable sequence: **5**
- Stable sourceRef: `bd677ba4ae20a95501cbc043b34a6ca1a1ca8c39`
- Stable releaseId: `mh-bd677ba4ae20`
- Stable-channel publication merge: `e982fca2129f84f7ff30c1182db72639db22388c`
- Product surface: **12 motorsport categories + QA diagnostics**
- Installed production loader: **Loader v7 with local observability**

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

**Visual v1 remains locked for the current RC path.**

Accepted current direction:
- Large typography scale: 1.12× across all 12 categories;
- Large lower information panel: adaptive flex spacing / bottom-weighted composition across all 12 categories;
- representative iPhone Large verification: accepted after v9.5.24 publication;
- Hero publication remains CI-gated with provenance/license checks, pool rotation, LKG and fail-closed policy.

Do not reopen per-category Hero or spacing micro-tuning without a concrete regression or materially better source asset. Remaining visual differences are backlog polish, not a reason for another screenshot loop.

## Public RC gates

### P1-A — Large automated rendering coverage

**PASS.**

The deterministic render smoke covers all 12 categories across all three widget families:

- Small: 12
- Medium: 12
- Large: 12
- **Total: 36 deterministic render cases**

Large checks include event identity, standings surface, `MORE STANDINGS`, and the lower `SEASON` / Dakar `STAGE` context panel. The completion-hardening PR passed both Hardening CI and Release Candidate CI before merge.

### P1-B — exact-current iPhone resilience check

**PASS.**

The final test-device session completed successfully against the current Loader v7 path:

1. updated Loader v7 installed on the test iPhone;
2. online execution completed successfully;
3. network was then removed and the same Loader executed successfully from verified local fallback/LKG behavior;
4. no new Large renderer regression was reported in the final session.

This closes the consolidated device-resilience gate without reopening 12×manual screenshot iteration.

### P1-C — observability / analytics decision

**PASS FOR PUBLIC RC.**

The codebase includes a privacy-safe local Loader v7 observability layer. It writes only to the device-local `motorsport-hub-observability-v1.json` file, keeps at most 200 events, and records release identity, category, widget family, Loader execution path, success/failure and elapsed time. It does not transmit analytics externally and does not collect device identifiers, email, latitude/longitude or advertising identifiers.

For the initial Public RC, **local-only diagnostics are accepted as sufficient**. This is a deliberate RC-stage scope decision: the goal is to validate real-world stability, routing, data freshness, fallback behavior and supportability without introducing a new external telemetry/privacy dependency immediately before RC.

Centralized production telemetry remains a **GA / broader-public-distribution gate**, not an RC blocker. Before general availability at meaningful user scale, explicitly decide whether aggregate crash-free rate, OS/device-class distribution and fleet-wide upstream/API failure monitoring justify an external telemetry service and the associated privacy/retention policy.

No external analytics/crash service is approved or introduced by this RC decision.

## P2 — backlog / post-RC polish

- raise Hero quality only when a clearly superior policy-compliant source passes existing gates;
- season-rollover automation and fixture refresh maintenance;
- stale historical documentation cleanup;
- broader performance/latency budgets if real-device evidence shows a problem;
- optional richer tap/deep-link interactions beyond the current supported behavior;
- centralized telemetry/privacy architecture before GA if the release expands beyond limited RC distribution.

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
- bounded local Loader observability with deterministic contract coverage;
- final online + fully-offline physical-iPhone verification.

## Current decision

**Internal/personal stable operation: ACCEPTED at v9.5.24.**

**Public Release Candidate: APPROVED.**

The product may now proceed to a limited Public RC distribution phase. This approval does **not** authorize Store submission, paid distribution, external analytics contracts, public launch at scale, or any other irreversible/external-impact release action. Those remain separate approval gates.

The next product phase is RC field validation: observe real user/runtime failures, upstream-data breakage, cache/LKG behavior, and support friction. Only regressions with concrete evidence should reopen Visual v1 or Hero/layout work.