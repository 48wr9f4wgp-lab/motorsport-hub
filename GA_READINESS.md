# Motorsport Hub — Distribution / Readiness State

Updated: 2026-09-27 JST

## Current decision

**PUBLIC_DISTRIBUTION_DECISION: NO**

**OWNER-ONLY / PERSONAL USE: LOCKED**

The owner changed the product direction after the earlier GitHub Broad GA action. The current controlling decision is that Motorsport Hub is **not intended for public distribution** and is to remain for the owner's personal use.

The brief Broad GA state on 2026-09-27 is retained only as historical audit evidence. It is **WITHDRAWN** and must not be treated as current authorization.

## Current Stable

- Stable: **v9.5.34 / sequence 12**
- sourceRef: `edff3d301033ada18134429fb6f4c9016c6653f6`
- RC: **#299 / 36285958234 SUCCESS**
- representative physical iPhone smoke: **PASS**
- JP viewing-platform v1 physical validation: **PASS**
- QA: `12/12 LIVE — データ経路OK`
- offline/LKG recovery: **PASS**
- Loader v7 copy path: **PASS**
- Hero attribution at `hero-live` head `7bd8e3e4fcf616b90fbded4911ac0ec8000ad225`: revalidated 2026-09-27 JST

## Private-operation migration

The repository cannot be switched to private safely yet because the current Loader v7 / runtime path fetches immutable runtime files through public GitHub raw URLs.

Therefore:

1. public distribution intent is revoked immediately;
2. no additional public launch/promotion/release action is authorized;
3. current runtime remains unchanged while a private-compatible source path is prepared;
4. after private runtime validation, repository visibility can be changed to private;
5. private migration must preserve immutable verification, LKG/offline recovery, viewing-rights fail-closed behavior and Hero/source integrity.

## Historical public GA

A GitHub Broad GA action was executed earlier on 2026-09-27 for v9.5.34, then superseded by the owner's later instruction to keep the product private/personal-only.

Status: **WITHDRAWN**

This history is retained for auditability and does not constitute ongoing authorization.

## Locked exclusions

Unless the owner explicitly changes direction again:

- no broad public GA;
- no public marketing launch;
- no App Store submission;
- no paid distribution;
- no external analytics;
- no paid hosting/service contracts;
- no public release workflow optimization as a product goal.

## Next

Prepare and validate a private-compatible runtime/update path, then transition repository visibility without breaking the owner's iPhone installation.
