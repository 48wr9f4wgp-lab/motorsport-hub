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

Loader v7 copy path is now **CLOSED / PASS**:
- the canonical Scriptable script was duplicated on the physical iPhone;
- the copied script executed successfully online;
- QA reported `12/12 LIVE — データ経路OK`;
- exact immutable Stable source prefix remained `edff3d301033`.

The representative exact-Stable v9.5.34 physical GA smoke is therefore **COMPLETE / PASS**. This validates the supported copy/install path; it is not a destructive wipe of Scriptable's shared local storage.

Physical-device evidence must be recorded as user-confirmed evidence.

### 4. Explicit GA/public-distribution approval

**RESOLVED / EXECUTED 2026-09-27 JST.**

The owner explicitly authorized Broad GA after the representative exact-Stable smoke completed. Scope is fixed to:
- product: Motorsport Hub;
- Stable: **v9.5.34 / sequence 12**;
- sourceRef: `edff3d301033ada18134429fb6f4c9016c6653f6`;
- destination: public GitHub repository `48wr9f4wgp-lab/motorsport-hub`;
- action: make the validated Stable and its existing self-service install/support path the official broad-public GA distribution route.

This approval does **not** include App Store submission, paid distribution, external analytics contracts, paid services or future Stable publications.

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

**Runtime maturity: GA / publicly available via GitHub.**

**Software-license decision: APPROVED — MPL-2.0.**

**Broad GA authorization: APPROVED — GITHUB PUBLIC REPOSITORY.**

Broad GA hard gates are complete for v9.5.34.

Post-GA rule:
1. if `hero-live` changes, keep attribution synchronized;
2. rights/source/parser drift is handled as maintenance evidence, not silently ignored;
3. future Stable publication, Store submission, paid distribution, external analytics or contracts require their own approval.

Broad GA via the public GitHub repository is live.
