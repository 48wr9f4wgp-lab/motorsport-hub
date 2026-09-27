# Motorsport Hub — Completion Audit

Updated: 2026-09-27 JST
Status: **v9.5.37 STABLE PUBLISHED / PERSONAL COCKPIT REVALIDATION PENDING / OWNER-ONLY**

## Controlling decision

- PRODUCT_INTENT: PERSONAL-ONLY / OWNER-ONLY
- PUBLIC_DISTRIBUTION_DECISION: NO
- previous GitHub Broad GA: WITHDRAWN / historical only
- Loader v7 remains canonical
- repository visibility unchanged

## Current physical evidence

Stable v9.5.36:
- MY Medium: PASS
- Personal Config: PASS
- MY Small: PASS
- MY Large visual/layout: PASS
- airplane-mode CONFIG: PASS
- offline MY widget: PENDING

Physical evidence exposed two logic issues:
- Large displayed total event count while only six rows were visible;
- stale cached ACTIVE could outlive an expected event end, observed with WEC Fuji.

## v9.5.37 candidate

- target Stable: **v9.5.37 / sequence 15**
- sourceRef: `1d331a79bebf55579242be40969061f788bd5182`
- validation ref: `149b645d07e6e0b10339ce29d214e80992227987`
- RC #330 / `36308093798`: SUCCESS
- artifact digest: `sha256:e6093bc4cc7f25e8cd56db8abdc368dea3c3e5864695e127f005b7e43de06c49`
- Router SHA-256: `dabb3a3abe887611357b63d91fe6060bb976d065c3fd317504bdddb864803e8d`
- Router bytes: **19833**
- category module hashes: unchanged
- category manifest: unchanged

## Fix scope

- visible / total Large event count semantics;
- event-end windows override stale ACTIVE state;
- WEC duration inference from race name;
- ended events removed from MY Race Day rows.

## Remaining hard gates

No remaining Personal Cockpit physical gates.

## Decision

Stable v9.5.37 Personal Cockpit physical validation is complete: Medium / CONFIG / Small / Large / offline MY all PASS. A separate F1 event-identity audit remains open.


## Final Personal Cockpit physical evidence — 2026-09-27

- MY Large revalidation: PASS.
- `6 / 7 EVENTS` correctly matched six visible rows out of seven eligible events.
- WEC Fuji stale-active row was removed after the v9.5.37 end-window fix.
- Offline MY widget: PASS while airplane mode was visibly active.
- Personal Cockpit physical gate: COMPLETE / PASS.
- Separate data-quality issue candidate: F1 `Bahrain Grand Prix in Malaysia` at Sepang. This is not treated as a cockpit-layout failure; F1 source/cache identity needs focused verification.
