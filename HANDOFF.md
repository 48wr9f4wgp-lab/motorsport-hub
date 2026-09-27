# Motorsport Hub — Development Handoff

Updated: 2026-09-27 JST
Scope: title-local / iPhone Scriptable non-game product.

## CURRENT CONTROLLING DECISION

- PRODUCT_INTENT: **PERSONAL-ONLY / OWNER-ONLY**
- PUBLIC_DISTRIBUTION_DECISION: **NO**
- BROAD_GA_STATUS: **WITHDRAWN**
- REPOSITORY_PRIVATE_MIGRATION: **PENDING**
- Current Stable: **v9.5.34 / sequence 12**
- Stable sourceRef: `edff3d301033ada18134429fb6f4c9016c6653f6`

The owner's latest instruction supersedes the earlier GitHub Broad GA approval. The product is not to be publicly distributed.

## WHY REPOSITORY IS NOT YET PRIVATE

Loader v7 and the current runtime fetch release/channel/runtime assets through public GitHub/raw URLs. Making the repository private immediately can break the owner's current iPhone installation.

Therefore repository visibility must change only after a private-compatible runtime/update path is implemented and physically validated.

## VERIFIED BASELINE

- immutable RC #299 / `36285958234`: SUCCESS
- physical QA: `12/12 LIVE — データ経路OK`
- exact Stable prefix: `edff3d301033`
- Small / Medium / Large representative UI: PASS
- JP viewing-platform v1: PASS
- Dakar viewing omission while UNVERIFIED: PASS
- offline/LKG recovery: PASS
- Loader v7 copy path: PASS
- current Hero attribution revalidated at `7bd8e3e4fcf616b90fbded4911ac0ec8000ad225`

## LOCKED PRODUCT CONTRACT

- canonical installed loader = `scriptable-loader-v7.js`
- 12 categories + QA
- Small / Medium / Large
- local observability only
- no automatic external analytics
- JP viewing rights fail closed
- Small does not show viewing labels
- Medium/Large use compact viewing label
- public distribution is not a product goal
- future public release requires a new explicit direction change

## HISTORICAL PUBLIC GA

A GitHub Broad GA action for v9.5.34 occurred earlier on 2026-09-27. It was later superseded by the owner's personal-only decision.

Status: **WITHDRAWN / HISTORICAL ONLY**

Do not use that historical action as authorization for future public distribution.

## NEXT

Design the private-compatible runtime/update path first. After it passes online + offline/LKG physical validation, change the repository to private without interrupting the owner's iPhone widgets.
