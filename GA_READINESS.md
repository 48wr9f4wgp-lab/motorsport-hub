# Motorsport Hub — GA Readiness

Updated: 2026-09-26 JST

This file tracks what is still required before **broad public General Availability (GA)**. It does not itself authorize public distribution, Store submission, paid distribution, Stable publication, or an external service contract.

## Current product state

- Public RC: **APPROVED**.
- Current Stable: **v9.5.32 / sequence 10**.
- Stable sourceRef: `273c582da42b02d1bcb5aa805bf7e2c77626a4a8`.
- Stable v9.5.29 WEC / SUPER GT device parser repair: **physical iPhone PASS**.
- Stable v9.5.30 temporal/Dakar hardening: **physical iPhone PASS for WEC 11:00 and Dakar GAP/index fixes**.
- Stable v9.5.31 WRC/SUPER GT hardening: **SUPER GT Small user-confirmed physical iPhone PASS on 2026-09-25 07:46 JST**.
- Stable v9.5.32 Dakar live-parser repair: **RC validated; live parser monitor 12/12 PASS; focused Dakar physical iPhone fresh-data confirmation pending**.
- No known reproducible P0 startup/routing/current-data blocker.
- Stable v9.5.30 includes Dakar 2027 rollover hardening plus the 2026-09-20 temporal-accuracy/Dakar presentation repairs.
- Centralized production telemetry: **not enabled**.

## Resolved GA preparation items

### Self-service installation/support documentation

**READY.**

Public install, support, privacy, README/changelog and bug-report surfaces are present and CI-gated.

### Software-license decision

**APPROVED: MPL-2.0.**

The owner approved Mozilla Public License 2.0 for Motorsport Hub and approved separating Club Pulse into its own repository. The merged product-pure repository includes root `LICENSE` and `LICENSE_SCOPE.md`.

Third-party Hero imagery is not relicensed under MPL-2.0; its Creative Commons obligations remain separate in `ATTRIBUTION.md` and the live Hero attribution surface.

## Must be resolved before broad GA

### 1. Club Pulse migration cutover

**RESOLVED.**

Club Pulse is preserved in its dedicated repository, its migration PR was merged, destination CI passed before and after merge, and Motorsport Hub's product-pure/MPL cutover is merged.

Canonical export source and migration evidence remain recorded in `CLUB_PULSE_MIGRATION.md`.

### 2. Public Hero attribution publication

**PUBLICATION PROOF VERIFIED at hero-live `57e0c7019b681239deba81627eddba6b6c622acf`.**

The current Hero pipeline carries source page, author and license metadata. Motorsport Hub now has a generated human-readable attribution builder, validator, deterministic CI coverage and an attribution-only `hero-live` publisher.

The pinned `hero-live/hero-channel/ATTRIBUTION.md` validates against `channel.json`: 12 credited pool assets, matching generation timestamp `2026-09-14T02:23:06.396Z`. Revalidate against the then-current pool before GA. This proves current credits exist; it does not prove refresh health.

The 2026-09-26 audit repair is now deployed. Scheduled Hero Active Refresh #123 and #124 succeeded on main, and downstream Public Attribution #46 and #47 also succeeded. Current Hero refresh health is therefore **RECOVERED**; revalidate the then-current live pool before GA.

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

### Dakar 2027 live verification

Stable v9.5.30 now contains the season-aware Dakar cache/LKG rollover hardening.

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

1. confirm focused Dakar fresh-data behavior on physical iPhone under Stable v9.5.32;
2. perform the final representative exact-Stable GA smoke and revalidate current live credits;
3. obtain explicit owner authorization for broad GA.

No Store submission, paid distribution, broad public launch, external analytics contract or new Stable publication is authorized by this document.
