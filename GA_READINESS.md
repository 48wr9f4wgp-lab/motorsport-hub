# Motorsport Hub — GA Readiness

Updated: 2026-09-14 JST

This file tracks what is still required before **broad public General Availability (GA)**. It does not itself authorize public distribution, Store submission, paid distribution, Stable publication, or an external service contract.

## Current product state

- Public RC: **APPROVED**.
- Current Stable: **v9.5.29 / sequence 7**.
- Stable sourceRef: `7f3fc1eb6fa93c619c1def732b18d091c9e949ce`.
- Stable WEC / SUPER GT device parser repair: **physical iPhone PASS**.
- No known reproducible P0 startup/routing/current-data blocker.
- `main` contains later, not-yet-published Dakar 2027 rollover hardening and GA/release-engineering hardening.
- Centralized production telemetry: **not enabled**.

## Resolved GA preparation items

### Self-service installation/support documentation

**READY.**

Public install, support, privacy, README/changelog and bug-report surfaces are present and CI-gated.

### Software-license decision

**APPROVED: MPL-2.0.**

The owner approved Mozilla Public License 2.0 for Motorsport Hub and approved separating Club Pulse into its own repository. The prepared split branch includes root `LICENSE` and `LICENSE_SCOPE.md`.

Third-party Hero imagery is not relicensed under MPL-2.0; its Creative Commons obligations remain separate in `ATTRIBUTION.md` and the live Hero attribution surface.

## Must be resolved before broad GA

### 1. Club Pulse migration cutover

**BLOCKER UNTIL DESTINATION COPY IS VERIFIED.**

The prepared Motorsport Hub split removes the Club Pulse `scriptable/` tree and `.github/workflows/club-pulse-contract.yml`, but that removal must not be merged until Club Pulse has been preserved and tested in its own repository.

Canonical export source and verification requirements are recorded in `CLUB_PULSE_MIGRATION.md`.

### 2. Public Hero attribution publication

**TECHNICALLY PREPARED; one live publication proof remains before GA.**

The current Hero pipeline carries source page, author and license metadata. Motorsport Hub now has a generated human-readable attribution builder, validator, deterministic CI coverage and an attribution-only `hero-live` publisher.

Before broad GA, confirm one successful generated attribution publication exists at `hero-live/hero-channel/ATTRIBUTION.md` and validate it against the then-current `channel.json`.

### 3. Final physical-device GA smoke

**REQUIRED immediately before broad GA.**

Run a representative session on the exact Stable intended for public distribution:

- canonical Loader v7 fresh-install/copy path;
- QA diagnostics;
- one Small, one Medium and one Large widget;
- online refresh;
- LKG/offline recovery if the GA Stable changes Loader/runtime-sensitive behavior;
- no visible startup, routing or clipping blocker.

Physical-device evidence must be recorded as user-confirmed evidence.

### 4. Explicit GA/public-distribution approval

**BLOCKER by project policy.**

A green repository/CI state is not authorization to begin broad public distribution. Obtain explicit owner approval for the actual GA/publication action and its distribution channel.

## Should be completed before or at GA

### Support export physical verification

`support-observability-export.js` has deterministic CI coverage but its Share Sheet interaction has not yet been physically exercised on iPhone. QA screenshot + issue evidence remains sufficient as the primary public support path until that optional flow is verified.

### Dakar 2027 Stable timing

`main` contains season-aware Dakar cache rollover hardening that is not in Stable v9.5.29. There is no need to rush a September Stable solely for this future-season protection, but a tested Stable containing it should be published before 2027 live standings are expected to take over.

Actual Dakar 2027 live endpoint/parser behavior cannot be empirically proven until the live 2027 standings surface exists.

## Not a GA blocker by itself

- centralized telemetry;
- new categories;
- broad Visual v1 retuning;
- richer tap/deep-link features;
- Hero replacement without a concrete quality/compliance improvement;
- performance-budget work without real-device latency evidence.

## Current GA decision

**Runtime maturity: GA-capable candidate.**

**Software-license decision: APPROVED — MPL-2.0.**

**Broad GA authorization: NOT YET.**

Remaining hard path:

1. preserve/verify Club Pulse in its destination repository, then merge the product-pure Motorsport Hub/MPL cutover;
2. confirm generated live Hero attribution publication;
3. select the exact GA Stable and perform final physical iPhone smoke;
4. obtain explicit owner authorization for broad GA.

No Store submission, paid distribution, broad public launch, external analytics contract or new Stable publication is authorized by this document.
