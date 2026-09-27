# Motorsport Hub — GA Readiness

Updated: 2026-09-27 JST

This file tracks what is still required before **broad public General Availability (GA)**. Stable publication and broad GA are separate protected actions.

## Current product state

- Public RC: **APPROVED**.
- Current Stable: **v9.5.34 / sequence 12**.
- Stable sourceRef: `edff3d301033ada18134429fb6f4c9016c6653f6`.
- Stable v9.5.29 WEC / SUPER GT device parser repair: **physical iPhone PASS**.
- Stable v9.5.30 temporal/Dakar hardening: **physical iPhone PASS for WEC 11:00 and Dakar GAP/index fixes**.
- Stable v9.5.31 WRC/SUPER GT hardening: **SUPER GT Small physical iPhone PASS**.
- Stable v9.5.33 Dakar production-equivalent diagnostic + fresh-data path: **physical iPhone PASS on 2026-09-27**; QA `R155 C80 P5 T80 G5 V1`, Medium fresh render, no `更新待ち`.
- Stable v9.5.34 JP viewing-platform labels: **RC #299 / 36285958234 SUCCESS + physical iPhone PASS** (Medium/Large verified label, Small omission, Dakar omission, no visible layout regression).
- No known reproducible P0 startup/routing/current-data blocker on the previously verified Stable path.
- Centralized production telemetry: **not enabled**.

## Resolved GA preparation items

### Self-service installation/support documentation

**READY.**

Public install, support, privacy, README/changelog and bug-report surfaces are present and CI-gated.

### Software-license decision

**Software-license decision: APPROVED — MPL-2.0.**

The owner approved Mozilla Public License 2.0 for Motorsport Hub and approved separating Club Pulse into its own repository. Third-party Hero imagery remains governed by its own Creative Commons terms and attribution.

### 1. Club Pulse migration cutover

**RESOLVED.**

Club Pulse is preserved in its dedicated repository, its migration/cutover is complete, and historical migration controls remain documented in `CLUB_PULSE_MIGRATION.md`.

### 2. Public Hero attribution publication

**VERIFIED / CURRENT LIVE POOL REVALIDATED 2026-09-27 JST.**

The current Hero pipeline publishes machine-readable source/license metadata and human-readable attribution on `hero-live`. Hero Active Refresh #124 and downstream Public Attribution #47 were successful. Current `hero-live` head `7bd8e3e4fcf616b90fbded4911ac0ec8000ad225` was revalidated on 2026-09-27 JST: `channel.json` and `ATTRIBUTION.md` share generation timestamp `2026-09-26T11:34:17.941Z`, the current live entries carry source/author/license metadata, and the human-readable attribution reports 12 credited pool assets.

## Must be resolved before broad GA

### 3. Final physical-device GA smoke

**REQUIRED on the exact Stable intended for GA.**

The v9.5.34 viewing-label device gate is **CLOSED / PASS**:
- Medium verified label: PASS;
- Large verified label: PASS;
- Small omission: PASS;
- Dakar omission while `UNVERIFIED`: PASS;
- no visible header crowding, truncation, alignment break or new vertical overflow.

Representative exact-Stable smoke now has physical PASS for:
- QA diagnostics: `12/12 LIVE — データ経路OK`;
- exact immutable Stable source prefix: `edff3d301033`;
- one Small, one Medium and one Large representative widget;
- online refresh across all 12 category routes;
- no visible startup, routing or clipping blocker in the validated surfaces.

Offline/LKG recovery is now **CLOSED / PASS**:
- airplane mode visibly active on the physical iPhone;
- SUPER GT Medium rendered from cached/LKG data;
- explicit `更新待ち` appeared as expected;
- verified `視聴 J SPORTS` label, standings, Hero and layout remained intact.

Remaining physical check:
- canonical Loader v7 fresh-install/copy path.

Physical-device evidence must be recorded as user-confirmed evidence.

### 4. Explicit GA/public-distribution approval

**BLOCKER by project policy.**

The owner approved the current v9.5.34 Stable publication path on 2026-09-27. That does not by itself satisfy the separate scoped broad-GA approval requirement because broad GA must match an exact validated Stable, distribution channel and action after the final physical smoke.

## Should be completed before or at GA

### Support export physical verification

`support-observability-export.js` has deterministic CI coverage but its Share Sheet interaction is still optional/unverified on iPhone.

### Dakar 2027 live verification

Dakar 2027 cache/LKG rollover hardening is present. Actual 2027 upstream standings/parser behavior cannot be empirically proven until the live 2027 surface exists.

### Viewing-rights freshness

v9.5.34 carries the JP viewing-rights snapshot verified on 2026-09-27. Rights changes require fresh official-source verification and a new immutable Stable publication; stale/unverified records fail closed.

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

1. close the remaining Loader v7 fresh-install/copy physical check;
2. if `hero-live` changes before GA, revalidate credits again;
3. obtain exact scoped owner authorization for the broad-GA distribution action/channel.

No Store submission, paid distribution, broad public launch, external analytics contract or later Stable publication is authorized by this document.
