# Motorsport Hub — Completion Audit

Updated: 2026-09-27 JST
Status: **v9.5.36 STABLE PUBLISHED / PERSONAL COCKPIT DEVICE VALIDATION PENDING / OWNER-ONLY**

## Controlling decision

- PRODUCT_INTENT: PERSONAL-ONLY / OWNER-ONLY
- PUBLIC_DISTRIBUTION_DECISION: NO
- previous GitHub Broad GA: WITHDRAWN / historical only
- repository visibility: public during optional private-runtime migration

## Verified owner-use baseline

Stable v9.5.36 is the current Stable; the physically verified owner-use baseline remains the pre-Personal-Cockpit surfaces until new MY/CONFIG evidence is captured:
- 12-category runtime verified;
- QA 12/12 LIVE on prior exact-Stable smoke;
- JP viewing-platform v1 physical PASS;
- offline/LKG recovery PASS;
- Loader v7 remains canonical installed loader.

## v9.5.36 integrated Personal Cockpit candidate

- target Stable: **v9.5.36 / sequence 14**
- sourceRef: `e6f92c73630da329c581d169b76f9d94e33378c8`
- validation ref: `99afe7a4311eb3c9d3480728d685cd4151860bba`
- RC #319 / `36304630990`: SUCCESS
- artifact digest: `sha256:6eb2e60f34ba8401d21956a06050f5f1dd80d8df6026df8ce83d65f6d44a4fd8`
- Router SHA-256: `c7668a2e969cae62aed23d57e0e66febbbafa13387508623b83fac4c521e3093`
- Router bytes: **19833**
- category module hashes: unchanged from v9.5.35
- category manifest: unchanged
- Loader v7 release contract: unchanged

## Personal Cockpit contract

User-facing Scriptable count remains one:

- `MY` → MY RACE DAY
- aliases: `RACEDAY`, `MYRACEDAY`
- `CONFIG` → Personal Config utility
- alias: `SETTINGS`
- interactive config is selected by running the existing Motorsport Hub script in Scriptable

Internal personal modules:
- `motorsport-personal-cockpit.js`
- `motorsport-personal-config.js`

The Router pins their exact SHA-256 + UTF-8 byte length and only loads them from the immutable Stable sourceRef. MY RACE DAY itself reads existing local category/viewing caches and does not introduce a second live upstream implementation.

## Remaining hard gates

1. physical MY Small validation;
2. physical MY Large validation;
3. offline MY validation after at least one successful online load.

## Decision

Automation evidence is green and Stable v9.5.36 is published via PR #72. Personal Cockpit must not be called physically complete until the remaining device gates pass.


## New physical evidence — 2026-09-27

- MY Medium: PASS.
- CONFIG flow from the same Motorsport Hub Scriptable: PASS.
- Current config summary: 12カテゴリ / 14日.
- No obvious Medium clipping/overflow observed.
- Personal Cockpit remains PARTIAL PASS until Small / Large / offline checks complete.
