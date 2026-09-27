# Motorsport Hub — Development Handoff

Updated: 2026-09-27 JST
Scope: title-local / iPhone Scriptable non-game product.

## CURRENT CONTROLLING DECISION

- PRODUCT_INTENT: **PERSONAL-ONLY / OWNER-ONLY**
- PUBLIC_DISTRIBUTION_DECISION: **NO**
- BROAD_GA_STATUS: **WITHDRAWN**
- REPOSITORY_PRIVATE_MIGRATION: **PENDING**
- Stable publication target: **v9.5.35 / sequence 13**
- Stable sourceRef target: `7bfd260947ca091376b4e7c033661ecfcb94ffed`
- Validation ref: `b259908a986be695bc9a382249a6ccac85ab02c5`; RC #311 / `36299105721` SUCCESS

The owner's latest instruction supersedes the earlier GitHub Broad GA approval. The product is not to be publicly distributed.

## WHY REPOSITORY IS NOT YET PRIVATE

v9.5.35 adds a private-capable Router transport plus `scriptable-loader-v8-private.js`, but the owner iPhone has not yet physically validated authenticated private transport. Making the repository private before that device PASS is still unsafe.

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

Publish v9.5.35 only after explicit Stable approval. Then configure a repository-scoped read-only token through `motorsport-private-setup.js`, validate Loader v8 online + offline/LKG on iPhone, and only after that change repository visibility to private.


## v9.5.35 PRIVATE FOUNDATION EVIDENCE

- sourceRef target: `7bfd260947ca091376b4e7c033661ecfcb94ffed`
- validation ref: `b259908a986be695bc9a382249a6ccac85ab02c5`
- RC #311 / `36299105721`: SUCCESS
- Hardening #549 on implementation PR: SUCCESS
- private transport gate: PASS
- category module bytes/hashes: unchanged from v9.5.34
- Router hash: `30216a94684439e059c187c9215848fb4866ad1d774e8199c4e4b53f5686e10e`
- Loader v8 token storage: Scriptable Keychain only
- repository visibility: still public
- physical authenticated validation: PENDING
