# Motorsport Hub — Completion Audit

Updated: 2026-09-27 JST
Status: **v9.5.34 STABLE / REPRESENTATIVE GA SMOKE PASS / BROAD GA LIVE VIA GITHUB**

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
- Stable v9.5.34 SUPER GT Medium verified label render: **PASS**.
- Stable v9.5.34 SUPER GT Large verified label render: **PASS**.
- Stable v9.5.34 SUPER GT Small viewing-label omission: **PASS**.
- Stable v9.5.34 Dakar Medium viewing-label omission while `UNVERIFIED`: **PASS**.
- No visible viewing-label header crowding, truncation, standings misalignment or new vertical overflow in the validated cases.
- Stable v9.5.34 QA diagnostics: **PASS — 12/12 LIVE / データ経路OK**.
- Stable v9.5.34 online refresh: **PASS across all 12 QA routes**.
- Exact immutable source prefix on device: **`edff3d301033`**.
- No visible startup/routing/clipping blocker in the representative Small/Medium/Large + QA evidence.
- Stable v9.5.34 offline/LKG recovery: **PASS** in airplane mode; cached SUPER GT Medium rendered with expected `更新待ち`, verified viewing label/standings/Hero/layout intact.
- canonical Loader v7 copy path: **PASS** on physical iPhone; duplicated Scriptable script executed and reached `12/12 LIVE — データ経路OK` on exact Stable prefix `edff3d301033`.
- representative exact-Stable v9.5.34 physical GA smoke: **COMPLETE / PASS**.

## Current decision

No known reproducible P0 startup/routing/current-data blocker on the verified Stable baseline.
v9.5.34 is automation-validated for Stable publication and the owner explicitly approved the current release path.
The JP viewing-platform v1 feature is complete for its defined v9.5.34 scope after physical iPhone PASS.
All defined representative physical GA smoke checks for v9.5.34 are PASS.

Broad GA/public distribution was explicitly approved and executed on 2026-09-27 for:
- exact Stable v9.5.34 / sequence 12;
- sourceRef `edff3d301033ada18134429fb6f4c9016c6653f6`;
- destination: public GitHub repository `48wr9f4wgp-lab/motorsport-hub`;
- action: official broad-public self-service distribution through the repository README / INSTALL / support surfaces.

Store submission, paid distribution, external analytics/contracts and future Stable publications are outside this approval scope.
