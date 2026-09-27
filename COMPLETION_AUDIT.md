# Motorsport Hub — Completion Audit

Updated: 2026-09-27 JST
Status: **v9.5.34 RC PASS / STABLE PUBLICATION APPROVED / VIEWING UI DEVICE PASS PENDING / GA NOT AUTHORIZED**

## Baselines

- Stable sourceRef: `edff3d301033ada18134429fb6f4c9016c6653f6`.
- Stable target: **v9.5.34 / sequence 12**.
- Validation ref: `45eb720a53438e2dbcd6e01be7529a90f4bea275`.
- RC validation: **#299 / 36285958234 SUCCESS**.
- Immutable artifact: `motorsport-hub-release-45eb720a53438e2dbcd6e01be7529a90f4bea275`.
- Artifact digest: `sha256:765563cf124673f55f888faec97cd11c1c1d6e49571435e4f307083af59c6def`.
- Validation ref differs from Stable source only by `.release/v9.5.34.md`.

## Previously closed device issue

Dakar fresh-data behavior is no longer an open v9.5.33 blocker.

Evidence recorded from the physical iPhone validation on 2026-09-27:
- QA DAKAR production-equivalent counters: **`R155 C80 P5 T80 G5 V1`**;
- Dakar Medium fresh-data render: **PASS**;
- `更新待ち`: absent.

## v9.5.34 viewing-platform implementation

Runtime contract:
- JP-only immutable rights dataset;
- official-source verification snapshot;
- exact Stable sourceRef fetch;
- Router-pinned SHA-256 + UTF-8 byte length;
- fail closed on invalid/stale/unverified/wrong-region/season mismatch;
- Small omitted;
- Medium/Large compact `視聴 <platform>` inside the existing standings header;
- Dakar 2027 hidden while Japan rights are `UNVERIFIED`.

Automated evidence:
- PR #59 Hardening CI #539: SUCCESS;
- PR #59 Release Candidate CI #297: SUCCESS;
- PR #59 Live Parser Monitor #100 deterministic contract: SUCCESS;
- 36-case render smoke: PASS;
- v9.5.34 immutable RC #299 / 36285958234: SUCCESS.

## Hero operations

Hero Active Refresh #124 and Public Attribution #47 are successful. Current live credits still require revalidation immediately before broad GA.

## Device evidence

- Stable v9.5.31 SUPER GT Small: physical iPhone PASS.
- Stable v9.5.30 WEC/Dakar display fixes: scoped physical PASS.
- Stable v9.5.33 Dakar fresh-data/diagnostic path: physical iPhone PASS.
- Stable v9.5.34 Medium/Large viewing-label render: **PENDING**.
- Stable v9.5.34 Small omission and Dakar viewing-label omission: **PENDING physical confirmation**.
- Final representative exact-Stable GA smoke: **PENDING**.

## Current decision

No known reproducible P0 startup/routing/current-data blocker on the verified Stable baseline.
v9.5.34 is automation-validated for Stable publication and the owner explicitly approved the current release path.
The new visible viewing-label UI remains incomplete until physical iPhone validation passes.
Broad GA/public distribution remains a separate protected action and is **NOT AUTHORIZED** for an exact distribution scope by this audit.
