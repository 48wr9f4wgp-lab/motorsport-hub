# Motorsport Hub — Completion Audit

Updated: 2026-09-27 JST
Status: **v9.5.37 PERSONAL COCKPIT FIX RC PASS / STABLE PUBLICATION PENDING / OWNER-ONLY**

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

1. publish Stable v9.5.37 after owner approval;
2. physical MY Large revalidation;
3. offline MY widget validation.

## Decision

Automation evidence is green for v9.5.37. Personal Cockpit must not be called fully verified until Large revalidation and offline MY pass.
