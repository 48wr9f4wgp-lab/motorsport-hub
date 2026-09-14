# Motorsport Hub — GA Readiness

Updated: 2026-09-14 JST

This file tracks what is still required before **broad public General Availability (GA)**. It does not itself authorize public distribution, Store submission, paid distribution, Stable publication, or an external service contract.

## Current product state

- Public RC: **APPROVED**.
- Current Stable: **v9.5.29 / sequence 7**.
- Stable sourceRef: `7f3fc1eb6fa93c619c1def732b18d091c9e949ce`.
- Stable WEC / SUPER GT device parser repair: **physical iPhone PASS**.
- No known reproducible P0 startup/routing/current-data blocker.
- `main` contains later, not-yet-published hardening for Dakar 2027 rollover plus GA workflow-permission cleanup.
- Centralized production telemetry: **not enabled**.

## Must be resolved before broad GA

### 1. Self-service installation/support documentation

**In progress in this docs branch.**

Required public surfaces:

- `INSTALL.md` — first installation, widget Parameter setup, QA verification, updates;
- `SUPPORT.md` — reproducible issue evidence and diagnostic interpretation;
- `PRIVACY.md` — current local-storage/network/observability behavior;
- current README and changelog that do not advertise obsolete Stable state;
- public issue template that asks for the evidence needed to diagnose device/source/parser failures.

### 2. Software distribution license decision

**BLOCKER — owner decision required.**

The GitHub repository is public but currently reports `license: null`. Public visibility is not a substitute for an explicit software redistribution/use license. Before broad public distribution, choose and add the intended software license after explicit owner approval.

This audit does not choose MIT, Apache-2.0, GPL, proprietary terms, or any other license on the owner's behalf.

### 3. Public Hero attribution/compliance surface

**REVIEW REQUIRED before broad GA.**

The runtime/CI already validates Hero source pages, author/license metadata and approved licenses. The live Hero channel also carries per-asset `sourcePage`, `author`, and `license` metadata. `ATTRIBUTION.md` documents modification treatment and the audited baseline.

Before broad GA, perform one final distribution-level review that the attribution surface delivered with the product is sufficient for the currently published `hero-live` pool and its applicable CC BY / CC BY-SA obligations. Do not weaken or strip this metadata.

### 4. Explicit GA/public-distribution approval

**BLOCKER by project policy.**

A green repository/CI state is not authorization to begin broad public distribution. Obtain explicit owner approval for the actual GA/publication action and its distribution channel.

## Should be completed before or at GA

### Support export physical verification

`support-observability-export.js` has deterministic CI coverage but its share-sheet interaction has not yet been physically exercised on the iPhone. Either:

- physically verify it before advertising it as the standard support path; or
- keep QA screenshot + issue evidence as the public support path and leave observability export optional until verified.

This is not a runtime blocker for the widget itself.

### Dakar 2027 Stable timing

`main` now contains season-aware Dakar cache rollover hardening. Stable v9.5.29 does not contain that later change. There is no need to rush a Stable update in September solely for this future-season protection, but a tested Stable containing the hardening should be published before 2027 live standings are expected to take over.

Actual Dakar 2027 live endpoint/parser behavior cannot be empirically proven until the live 2027 standings surface exists.

### Final public smoke session

Immediately before broad GA, run a short representative physical-device session using the exact Stable intended for distribution:

- Loader v7 fresh install/update path;
- at least one Small, Medium and Large widget;
- QA diagnostics;
- one online refresh and one validated LKG/offline recovery check when the release changes Loader/runtime-sensitive behavior.

Risk-based testing remains preferred over a full 36-screenshot manual loop.

## Not a GA blocker by itself

- Centralized telemetry. Local observability + scheduled live parser monitoring are acceptable for the current architecture unless scale/support evidence demonstrates a need for fleet-wide telemetry.
- Broad Visual v1 retuning.
- New categories.
- Richer tap/deep-link features.
- Hero replacement without a concrete quality/compliance improvement.
- Performance budget work without real-device latency evidence.

## Current GA decision

**Runtime maturity: GA-capable candidate.**

**Broad GA authorization: NOT YET.**

The remaining hard gates are primarily distribution/onboarding/compliance decisions rather than a known core-runtime defect. The highest-value next steps are to merge the self-service documentation after CI, make the software-license decision, complete the final attribution/distribution review, then prepare the exact Stable/public-release approval when the owner is ready.
