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

## Resolved GA preparation items

### Self-service installation/support documentation

**READY.**

The public self-service surfaces are present and CI-gated:

- `INSTALL.md` — first installation, widget Parameter setup, QA verification and updates;
- `SUPPORT.md` — reproducible issue evidence and diagnostic interpretation;
- `PRIVACY.md` — current local-storage/network/observability behavior;
- current README and changelog;
- public bug-report issue template;
- `GA_LAUNCH_CHECKLIST.md` for the final release operation.

## Must be resolved before broad GA

### 1. Software distribution license + repository scope

**BLOCKER — owner decision required.**

The GitHub repository is public but currently reports `license: null`. Public visibility is not a substitute for an explicit software redistribution/use license.

The licensing audit found an additional scope problem: this repository also contains Club Pulse implementation/workflow files such as `scriptable/club-pulse*`. A root license must not be added casually because it could be read as licensing Club Pulse under the same terms.

Current product recommendation:

- preferred Motorsport Hub license: **MPL-2.0**;
- preferred repository architecture before applying it: **move Club Pulse to its own repository**, then license the product-pure Motorsport Hub repository;
- permissive fallback if maximum ecosystem adoption is preferred over reciprocity: Apache-2.0.

See `LICENSE_DECISION.md`. No license is granted by this recommendation. The owner must explicitly approve both the license and the scope/migration approach before a real `LICENSE` file is added.

### 2. Public Hero attribution publication

**TECHNICALLY PREPARED; one live publication proof remains before GA.**

The current `hero-live` audit found five live categories (WEC, WRC, F1, SUPER FORMULA, NASCAR). Their current live/pool entries carry source page, author and license metadata. The observed live licenses are CC BY-SA 4.0 and CC BY 4.0.

This GA hardening adds:

- `tools/build-hero-public-attribution.mjs`;
- `tools/validate-hero-public-attribution.mjs`;
- deterministic attribution CI coverage;
- `Motorsport Hub Hero Public Attribution`, which publishes only `hero-live/hero-channel/ATTRIBUTION.md` after a successful Hero refresh (or an explicitly dispatched run).

The generated file covers every unique currently publishable Hero pool asset, includes the exact Commons source page, author, license/link and modification notice, and is kept separate from the software license.

Before broad GA, confirm one successful generated attribution publication exists at `hero-live/hero-channel/ATTRIBUTION.md` and validate it against the then-current `channel.json`.

### 3. Final physical-device GA smoke

**REQUIRED immediately before broad GA.**

Run a short representative session on the exact Stable intended for public distribution:

- canonical Loader v7 fresh-install/copy path;
- QA diagnostics;
- one Small, one Medium and one Large widget;
- online refresh;
- LKG/offline recovery if the GA Stable changes Loader/runtime-sensitive behavior;
- no visible startup, routing or clipping blocker.

Risk-based testing remains preferred over a full 36-screenshot manual loop.

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

The remaining hard path is now narrow:

1. resolve software-license/repository scope and add the approved license;
2. confirm the generated live Hero attribution publication;
3. perform the final physical iPhone smoke on the exact GA Stable;
4. obtain explicit owner authorization for broad GA.

No Store submission, paid distribution, broad public launch, external analytics contract or new Stable publication is authorized by this document.
