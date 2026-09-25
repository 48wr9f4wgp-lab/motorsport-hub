# Motorsport Hub — Development Handoff

Updated: 2026-09-26 JST
Scope: title-local / iPhone Scriptable non-game product.
Re-fetch GitHub main, release-channel.json, hero-live and open PRs before protected actions.

## WORKING_HEAD / VERIFIED_BASELINE / RECOVERY_STATE

- Audit base main: `5a5dd46722556ca71d20beb50f752be8a12e3f0a` (PR #54).
- Audit repair branch: `monitor/audit-2026-09-26-ops-readiness`; resolve its current SHA from GitHub. Branch changes are not deployed until approved and merged.
- Stable: **v9.5.31 / sequence 9**, releaseId `mh-02e9c199611f`.
- Stable sourceRef: `02e9c199611fd32153f4a5f220e9d1165c31ad2f`.
- Validation releaseRef: `f746a2730c6f05b21ce35d296ac8bfd1bf8811a2`; RC run `36012972754` SUCCESS (re-fetched in this audit).
- Hero head: `57e0c7019b681239deba81627eddba6b6c622acf`; 12 pool credits validate against the channel.
- Recovery: original main and hero-live remain unchanged by this audit; repair branch contains proposed tools/tests/docs changes. No Stable publication performed.
- Legacy draft PR #2 (Loader v6 observability) remains separate; do not merge it as part of this repair.

## Product / locked decisions

- Canonical installed loader: `scriptable-loader-v7.js`; immutable Stable + hash/byte verification + RC evidence + release-namespaced local LKG.
- Router schema 5, category cache schema 1; 12 categories + QA; Small / Medium / Large.
- Categories: F1,WEC,WRC,SUPERGT,MOTOGP,FDJ,D1GP,SUPERFORMULA,INDYCAR,NASCAR,GTWCEU,DAKAR,QA.
- Visual v1 remains locked; no broad retuning without a concrete regression/material improvement.
- Software MPL-2.0; third-party Hero images retain their own Creative Commons terms.
- Club Pulse is a separate product/repository; migration is complete.
- Local observability only, latest 200 events; no automatic external analytics.
- Do not add user-facing scheduled automations. Existing repository parser/Hero workflows are retained.
- Branch/test/doc/PR preparation is authorized development work. Main merge, Stable update, manual Hero publication, broad GA, Store/paid distribution, contracts/costs and external analytics need explicit action-specific approval.
- Public RC was approved; broad GA is NOT AUTHORIZED. Previous Stable publication approval was consumed.

## Accepted Stable repairs and physical evidence

v9.5.31 includes WEC Fuji 11:00 JST, Tokyo calendar-day countdown, Dakar GAP/index and 2027 rollover hardening, WRC Sardegna finale, full-14 SUPER GT META and width-hardened SUPER GT Small.

Owner-supplied `MOTORSPORT_HUB_HANDOFF_2026-09-25.md` records SUPER GT Small physical PASS at 2026-09-25 07:46 JST (IMG_2843.jpeg: AUTOPOLIS, 10/18, no black/clipped widget). This audit imported that user-confirmed result; it did not re-inspect the screenshot or run an iPhone. Earlier WEC/Dakar v9.5.30 PASS remains scoped historical evidence. Exact hardware/OS is not recorded.

Visual baseline: IMG_2843.jpeg; CURRENT, REATTACH required before layout work, verified_access=NO in this audit. No visual/layout edits were made.

## Audit findings / current operations

See `COMPLETION_AUDIT.md` for evidence and verification scope.
- Hero refresh run 36192726244 failed: publish validator rejected inherited ATTRIBUTION.md. Repair regenerates candidate credits and requires exact agreement before publication; regression tests cover stale credits and unexpected files.
- Parser monitor run 36192066389: 11/12 PASS, DAKAR NO_FRESH_DATA_CACHE. A deterministic Dakar fixture passes; actual upstream cause remains unresolved. Monitor repair exposes normalized transport/JSON errors and safe request status/byte counts without response bodies.
- Current live credit publication proof is satisfied; refresh health is a separate issue.
- README, GA readiness/checklist, completion audit, handoff, migration status and DEV_STATUS had drifted; repair reconciles them.

## Remaining validation / release limits

- After approved merge: confirm Hero workflow recovery and investigate Dakar using the improved monitor output. Do not suppress its failure.
- Final representative exact-Stable physical smoke (fresh Loader path, QA, Small/Medium/Large, online refresh, relevant offline/LKG) remains pending.
- Optional support export Share Sheet remains physically unverified.
- Actual Dakar 2027 live endpoint behavior is not verified before real upstream standings exist.
- Broad GA requires explicit owner approval for destination/action.

## NEXT

Review and approve the audit repair PR for main merge, then reverify operational failures. Afterward, resume the Japan viewing-platform specification: region + season/event + platforms + verifiedAt + official source + expiry; hide unverified/stale rights. Medium/Large viewing row and omission on Small are hypotheses, not locked/implemented features. Do not add monitoring automations.
