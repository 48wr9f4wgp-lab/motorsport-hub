# Motorsport Hub — Current Completion Audit

Updated: 2026-09-14 JST
Status: **PUBLIC RC APPROVED / STABLE v9.5.29 PHYSICAL IPHONE PASS**

This document is the current product-completion snapshot for Motorsport Hub and supersedes the release-status conclusions in the historical 2026-08-28 `RC_QA.md` and `RELEASE_AUDIT.md`. Those files remain useful as hardening history but must not be read as the current release state.

## Current baseline

- Canonical repository: `48wr9f4wgp-lab/motorsport-hub`
- Runtime baseline merge on `main`: `7f3fc1eb6fa93c619c1def732b18d091c9e949ce` (PR #42)
- Stable publication merge on `main`: `bb1c8ef8b6f57c1413ae0a8fcbef2284c83d4bf6` (PR #43)
- Current stable: **v9.5.29**
- Stable sequence: **7**
- Stable sourceRef: `7f3fc1eb6fa93c619c1def732b18d091c9e949ce`
- Stable releaseId: `mh-7f3fc1eb6fa9`
- Validation releaseRef: `b8df2430607161f8bb2a560174ac3c36dcd7b4a3`
- Validation workflow: `Motorsport Hub Release Candidate CI`
- Validation run: **#256 / `34837876868` — SUCCESS**
- Product surface: **12 motorsport categories + QA diagnostics**
- Installed production loader: **Loader v7 with local observability**
- Active Hero head at this audit: `b81553a164c76620d69b94477f823bb777ff4af6`

## Product state

### P0 — launch / routing / unusable-state blockers

**No currently observed P0 blocker.**

Evidence in the current architecture includes:
- direct Router → exactly one category module;
- explicit invalid-parameter handling;
- immutable release descriptor with SHA-256 + byte-length verification;
- GitHub-verified source commit and successful Release Candidate CI evidence before Loader v7 promotion;
- monotonic stable sequence / rollback-fork protection;
- release-namespaced Loader LKG;
- schema-1 category data cache across all 12 categories;
- Active Hero cache/LKG/fail-closed behavior;
- category/lifecycle/cache/integrity deterministic gates;
- scheduled live parser monitoring for all 12 production categories;
- evidence-backed device parser fallback coverage for WEC and SUPER GT.

This is not a claim that future upstream data-source failures cannot occur. It means no reproducible launch/routing/current-data blocker is known at this audit point.

### Visual / layout lock

**Visual v1 remains locked for the current RC path.**

Accepted current direction:
- Large typography scale: 1.12× across all 12 categories;
- Large lower information panel: adaptive flex spacing / bottom-weighted composition across all 12 categories;
- Large displays Top 3 + positions 4–5 under `MORE STANDINGS`;
- representative physical-iPhone Large verification accepted;
- Hero publication remains CI-gated with provenance/license checks, pool rotation, LKG and fail-closed policy.

Do not reopen per-category Hero or spacing micro-tuning without a concrete regression or materially better source asset. Remaining visual differences are backlog polish, not a reason for another broad screenshot loop.

## Public RC gates

### P1-A — automated rendering coverage

**PASS.**

The deterministic render smoke covers all 12 categories across all three widget families:

- Small: 12
- Medium: 12
- Large: 12
- **Total: 36 deterministic render cases**

Large checks include event identity, standings surface, `MORE STANDINGS`, and the lower `SEASON` / Dakar `STAGE` context panel.

### P1-B — Loader v7 online/offline resilience

**PASS — USER-CONFIRMED.**

The physical-iPhone resilience session completed successfully against Loader v7:

1. Loader v7 installed on the test iPhone;
2. online execution completed successfully;
3. network was removed;
4. the same Loader executed successfully from verified local fallback/LKG behavior;
5. no new Large renderer regression was reported.

This evidence is user-confirmed from the physical device and is not independently machine-verifiable from GitHub.

### P1-C — local observability / analytics decision

**PASS FOR PUBLIC RC.**

Loader v7 writes privacy-safe local observability to `motorsport-hub-observability-v1.json`, retaining at most 200 events. The event schema records release identity, category, widget family, Loader path, success/failure, elapsed time and normalized error code. It does not transmit analytics externally and does not collect device ID, email, latitude/longitude or advertising ID.

The RC support utility `support-observability-export.js` sanitizes and shares only allowlisted observability fields after explicit user action. Its deterministic support-export gate is in CI. The utility itself has **not yet been separately physically exercised on the iPhone**, so that interaction remains unverified device behavior.

For the initial Public RC, local-only diagnostics remain accepted as sufficient. Centralized production telemetry remains a **GA / broader-public-distribution decision**, not an RC blocker.

No external analytics/crash service is approved or introduced by this decision.

### P1-D — upstream parser monitoring

**PASS / IMPLEMENTED.**

A dedicated live parser monitor now checks all 12 categories on a scheduled/manual path and requires successful fresh schema-1 cache generation rather than treating HTTP success alone as sufficient. The monitor's contract is deterministic in PR CI; live-upstream execution is intentionally separated from ordinary PR checks to avoid transient third-party availability turning every PR red.

The monitor immediately proved useful: it detected real WEC and SUPER GT parser drift despite HTTP 200 responses, which triggered the repairs now shipped in Stable v9.5.29.

### P1-E — Stable v9.5.29 physical iPhone validation

**PASS — USER-CONFIRMED.**

Incident chain:

1. Stable v9.5.28 was published after server/CI parser hardening.
2. Physical iPhone QA still showed `更新待ち` for WEC and SUPER GT.
3. QA diagnostics on the same iPhone showed **12/12 LIVE** and candidate/source `938cc2e646ac`, proving Loader propagation and network reachability were healthy while the production standings extraction still failed on the device response.
4. PR #42 added device-safe fallback parsing for WEC and SUPER GT, plus device-shaped/no-table regression fixtures and runtime-version contract updates.
5. Final PR #42 head `eb85d64d6f53ff505d03cad082e4ed62df7874a3` passed Hardening CI #465 and Release Candidate CI #254 before merge.
6. PR #42 merged to runtime source `7f3fc1eb6fa93c619c1def732b18d091c9e949ce`.
7. Stable v9.5.29 / sequence 7 was validated by RC CI #256 and published by PR #43.
8. The user then reran Loader v7 on the physical iPhone and supplied screenshots confirming:
   - WEC no longer showed `更新待ち` and displayed Top 5 standings;
   - SUPER GT no longer showed `更新待ち` and displayed positions 4–5 in `MORE STANDINGS`;
   - no visible layout/typography regression was observed in the supplied WEC/SUPER GT Large widgets.

Therefore **Stable v9.5.29 Physical iPhone Validation = PASS** for the repaired WEC / SUPER GT data path and the observed Large rendering state.

## RC field-validation outcome to date

The first evidence-backed field issue was not treated as a generic visual or network problem. QA proved the Loader/channel/network path healthy, and the defect was isolated to production parser behavior on the real device. The repair was then protected with regression tests and re-published through the normal immutable Stable process.

This is the intended operating model for the remaining RC phase: reproduce, identify the failing layer, make the smallest defensible change, pass deterministic/RC gates, then perform physical-device verification when the change is device-sensitive.

## P2 — backlog / before GA or wider scale

- decide whether centralized telemetry is required for aggregate crash-free rate, OS/device-class distribution and fleet-wide upstream/API failure monitoring;
- if centralized telemetry is chosen, perform explicit privacy/retention/service review and obtain approval before any external data transmission, contract or cost;
- season-rollover automation and fixture refresh maintenance, especially Dakar 2027 live standings/source rollover;
- historical documentation and stale hardening-specific workflow-condition cleanup;
- performance/latency budgets if real-device evidence shows a problem;
- optional richer tap/deep-link interactions;
- Hero upgrades only when a clearly superior policy-compliant asset passes existing gates;
- physically exercise the observability export support utility if/when RC support collection is needed.

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
- scheduled live parser monitoring with deterministic contract coverage;
- bounded local Loader observability and privacy-safe support export tooling;
- online + fully-offline Loader physical-iPhone verification;
- WEC / SUPER GT Stable v9.5.29 physical-iPhone verification after a real parser regression repair.

## Current decision

**Internal/personal stable operation: ACCEPTED at v9.5.29.**

**Public Release Candidate: APPROVED.**

**Stable v9.5.29 WEC / SUPER GT device parser repair: PHYSICAL IPHONE PASS.**

The product remains eligible for a limited Public RC distribution phase. This approval does **not** authorize Store submission, paid distribution, external analytics contracts, broad public launch, or any other irreversible/external-impact release action. Those remain separate approval gates.

The next product phase remains evidence-driven RC field validation plus GA-readiness work. Only concrete regressions should reopen Visual v1, Hero/layout work or runtime parser changes.