# Motorsport Hub — Development Handoff

Updated: 2026-09-27 JST
Scope: title-local / iPhone Scriptable non-game product.

## WORKING_HEAD / VERIFIED_BASELINE / RECOVERY_STATE

- Integrated feature source / Stable sourceRef: `edff3d301033ada18134429fb6f4c9016c6653f6` (PR #59 merged).
- Stable target/publication: **v9.5.34 / sequence 12**.
- Validation releaseRef: `45eb720a53438e2dbcd6e01be7529a90f4bea275`; RC **#299 / 36285958234 SUCCESS**.
- Immutable RC artifact: `motorsport-hub-release-45eb720a53438e2dbcd6e01be7529a90f4bea275`.
- Artifact digest: `sha256:765563cf124673f55f888faec97cd11c1c1d6e49571435e4f307083af59c6def`.
- Validation ref differs from sourceRef only by `.release/v9.5.34.md`.
- Current hero-live known head: `7bd8e3e4fcf616b90fbded4911ac0ec8000ad225`.
- Legacy draft PR #2 remains obsolete/separate; do not merge it into current release work.
- No known uncommitted/unpushed/local recovery artifact is required for PR #59 work.

## LOCKED PRODUCT CONTRACT

- Canonical installed loader: `scriptable-loader-v7.js`.
- Stable source is immutable and separately approved; main merge is not Stable publication.
- Router schema 5; category cache schema 1; 12 categories + QA; Small/Medium/Large.
- Visual v1 locked except concrete regression/material improvement.
- MPL-2.0 software license; third-party Hero licenses remain separate.
- Club Pulse is a separate repo/product.
- Local observability only; no automatic external analytics.
- Viewing-platform region v1 = JP.
- Viewing rights fail closed when invalid/stale/unverified/wrong-region/season-mismatched.
- Small never shows viewing labels in v1.
- Medium/Large use compact standings-header `視聴 <platform>`; no new vertical row.
- Dakar 2027 viewing label remains hidden while Japan rights are `UNVERIFIED`.
- Broad GA/public distribution remains a separate exact-scope protected action.

## VERIFIED PRODUCT EVIDENCE

- Stable v9.5.31 SUPER GT Small black-widget repair: physical iPhone PASS.
- Stable v9.5.30 WEC Fuji 11:00 + Dakar GAP/index fixes: scoped physical PASS.
- Stable v9.5.33 Dakar production-equivalent QA: physical iPhone PASS, `R155 C80 P5 T80 G5 V1`.
- Stable v9.5.33 Dakar Medium fresh-data render: PASS, `更新待ち` absent.
- PR #59 automated evidence: Hardening #539 SUCCESS; RC #297 SUCCESS; Live Parser Monitor #100 deterministic SUCCESS; 36-case render smoke PASS.
- v9.5.34 immutable RC: **#299 / 36285958234 SUCCESS**.

## CURRENT FEATURE STATE

JP viewing-platform runtime is implemented and Stable-packaged:

- exact immutable `viewing-rights-jp.json`;
- Router pins rights SHA-256 + UTF-8 byte length;
- Medium/Large compact verified label;
- Small omitted;
- Dakar 2027 omitted while UNVERIFIED;
- offline/no-cache rights path safely omits the label.

The visible v9.5.34 label change is **not yet physically validated**, so the feature is not called complete.

## REMAINING

1. On physical iPhone, confirm at least one Medium verified label.
2. Confirm at least one Large verified label.
3. Confirm Small is unchanged / no viewing label.
4. Confirm Dakar remains hidden while `UNVERIFIED`.
5. Confirm no header crowding, truncation, standings misalignment or new vertical overflow.
6. Run final representative exact-Stable GA smoke and revalidate current Hero credits.
7. Broad GA requires separate exact Stable + destination/action approval.
8. Actual Dakar 2027 live standings/parser and Japan rights remain unverified until current upstream evidence exists.

## NEXT

Physical iPhone validation of Stable v9.5.34 viewing-platform UI. Do not call the feature complete until that evidence passes.
