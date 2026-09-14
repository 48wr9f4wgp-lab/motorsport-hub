# Motorsport Hub — Current Completion Audit

Updated: 2026-09-14 JST
Status: **PUBLIC RC APPROVED / STABLE v9.5.29 PHYSICAL IPHONE PASS / GA NOT YET AUTHORIZED**

This is the current completion/release snapshot. `GA_READINESS.md` contains the remaining broad-public-release gates.

## Current baseline

- Repository: `48wr9f4wgp-lab/motorsport-hub`.
- Current Stable: **v9.5.29**.
- Stable sequence: **7**.
- Stable sourceRef: `7f3fc1eb6fa93c619c1def732b18d091c9e949ce`.
- Stable releaseId: `mh-7f3fc1eb6fa9`.
- Validation releaseRef: `b8df2430607161f8bb2a560174ac3c36dcd7b4a3`.
- Validation run: RC CI #256 / `34837876868` — SUCCESS.
- Product surface: **12 categories + QA**.
- Installed production loader: **Loader v7 with local observability**.
- Active Hero head at this audit: `b81553a164c76620d69b94477f823bb777ff4af6`.

Main contains later work that is not yet in Stable:

- PR #45: Dakar 2027 season-aware rollover/cache hardening.
- PR #46: GA workflow hygiene/read-only Hardening CI.

Before the current GA-docs branch, `main` HEAD was `f8fc6398b76a0cea250da113734c12cd3ebfaadd`. Its tree is identical to the PR #46 merge tree; a temporary documentation placeholder had been accidentally added and immediately removed, with no net repository-tree/runtime/Stable change.

## P0 — startup/routing/current-data blockers

**No currently known reproducible P0 blocker.**

Evidence includes:

- direct Router → exactly one selected category module;
- explicit invalid-parameter handling;
- verified immutable Stable source + SHA-256/byte-length checks;
- successful RC evidence required before Loader v7 promotion;
- monotonic Stable sequence and rollback/fork rejection;
- release-namespaced Loader LKG;
- schema-1 category caches across all 12 categories;
- Hero channel cache/LKG/fail-closed behavior;
- category/lifecycle/cache/integrity gates;
- 12-category scheduled live parser monitoring;
- WEC / SUPER GT device-shaped parser regression coverage.

This does not claim upstream sources can never fail; it means no reproducible core blocker is known now.

## Visual / rendering

**Visual v1 remains locked.**

Accepted production contract:

- Small / Medium / Large across all 12 categories;
- 36 deterministic render smoke cases;
- Large typography 1.12×;
- Large Top 3 + positions 4–5 under `MORE STANDINGS`;
- adaptive bottom-weighted lower context panel;
- Dakar stage/route/SS/GAP semantics;
- CI-gated Hero provenance/license/quality pipeline.

Do not reopen broad UI/Hero retuning without a concrete regression or materially better compliant source.

## Loader / release resilience

**PASS.**

Loader v7:

- discovers approved Stable through `release-channel.json`;
- verifies source commit, RC evidence, integrity and release ancestry contract;
- promotes only after Router boot;
- keeps a local last-known-good release;
- writes bounded local observability.

Physical iPhone online/offline Loader recovery is USER-CONFIRMED PASS.

## WEC / SUPER GT v9.5.29

**PASS — USER-CONFIRMED.**

The v9.5.28 server/CI repair did not fully match the real iPhone response shape. QA on-device still showed 12/12 LIVE, isolating the issue to production parsing rather than network/release propagation.

PR #42 added device-safe normalized-text fallbacks for WEC and SUPER GT plus no-table/device-shaped regression fixtures. Stable v9.5.29 then shipped that source.

The user supplied physical-iPhone Large screenshots confirming:

- WEC: no `更新待ち`, Top 5 visible;
- SUPER GT: no `更新待ち`, positions 4–5 visible;
- no visible layout/typography regression in the supplied screenshots.

Treat **Stable v9.5.29 WEC / SUPER GT Physical iPhone Validation = PASS**.

## Dakar 2027 readiness

PR #45 is merged to `main` and deterministically covers:

- pre-start 2026 FINAL fallback;
- 2027 Stage 1 ranking-source rollover after Stage 1;
- rejection of cached 2026 rankings once 2027 standings are expected;
- continued use of matching 2027 LKG during temporary live-source failure.

This hardening is not yet in Stable v9.5.29. Actual 2027 live-page/parser behavior remains empirically untestable until the 2027 standings surface exists.

## Monitoring / observability

**PASS for Public RC.**

- Live Parser Monitor checks all 12 categories on scheduled/manual paths and requires fresh schema-1 cache generation.
- PR monitor runs deterministic contract checks; live upstream execution is separated from ordinary PR checks.
- Loader local observability retains at most 200 sanitized events.
- No automatic external analytics/crash transport is currently enabled.
- `support-observability-export.js` has deterministic CI coverage, but its physical iPhone share-sheet interaction is not yet independently verified.

Centralized telemetry is not considered a GA blocker by itself for the current architecture; adding it would be a separate privacy/service decision.

## GA workflow hygiene

**PASS on main.**

PR #46 removed the obsolete v9.3 write/mutation path from current Hardening CI, removed the consumed one-shot WRC source-fix workflow, made Hardening CI read-only, and added a workflow-hygiene regression gate to Hardening + Release Candidate CI.

This changed CI/repository safety only; it did not publish a new Stable or modify runtime UI/data behavior.

## Public self-service readiness

Current GA-docs work adds or updates:

- `INSTALL.md` — Loader v7 installation and widget Parameter setup;
- `SUPPORT.md` — evidence-first GitHub Issues workflow;
- `PRIVACY.md` — current local data/network/observability disclosure;
- `GA_READINESS.md` — GA decision matrix;
- public bug-report template;
- README/CHANGELOG current Stable state;
- deterministic `public-ga-docs` CI gate.

These docs are not considered merged until their PR is explicitly approved and merged.

## Remaining broad-GA gates

### Required

1. **Software license decision.** Repository metadata currently reports `license: null`; broad redistribution should not proceed without an explicit owner-selected license/terms.
2. **Final Hero distribution-attribution review.** Runtime and `hero-live` carry source/author/license metadata, but broad distribution should confirm the attribution surface satisfies the current pool's applicable licenses.
3. **Explicit broad-public/GA approval.** Green CI/merged code is not release authorization.

### Recommended

- physically verify the support observability-export Share Sheet before advertising it as the standard support collection path;
- publish the Dakar 2027 hardening in a tested Stable before 2027 live standings are expected;
- run a final representative physical-device smoke session against the exact Stable selected for GA.

### Not blockers by themselves

- centralized telemetry;
- new categories;
- broad Visual v1 retuning;
- richer tap/deep links;
- Hero replacement without a concrete quality/compliance improvement;
- performance-budget work without real-device evidence.

## Decision

**Internal/personal Stable operation: ACCEPTED at v9.5.29.**

**Public Release Candidate: APPROVED.**

**Stable v9.5.29 WEC / SUPER GT parser repair: PHYSICAL IPHONE PASS.**

**Runtime maturity: GA-capable candidate.**

**Broad GA/public distribution: NOT YET AUTHORIZED.**

The remaining hard work is now mostly self-service distribution/compliance/approval rather than a known core-runtime defect.
