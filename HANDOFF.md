# Motorsport Hub — Development Handoff

Updated: 2026-09-27 JST
Scope: title-local / iPhone Scriptable non-game product.

## CURRENT CONTROLLING DECISION

- PRODUCT_INTENT: **PERSONAL-ONLY / OWNER-ONLY**
- PUBLIC_DISTRIBUTION_DECISION: **NO**
- BROAD_GA_STATUS: **WITHDRAWN**
- REPOSITORY_PRIVATE_MIGRATION: **PENDING**
- Current Stable: **v9.5.37 / sequence 15**
- Stable sourceRef: `1d331a79bebf55579242be40969061f788bd5182`
- Validation ref: `99afe7a4311eb3c9d3480728d685cd4151860bba`; RC #319 / `36304630990` SUCCESS

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

Stable v9.5.36 is published. Private repo migration remains paused by choice while the current v7 path is stable. The active product-development next step is Personal Cockpit v1 physical validation; private Loader v8 auth can resume later.


## v9.5.35 PRIVATE FOUNDATION EVIDENCE

- Stable sourceRef: `7bfd260947ca091376b4e7c033661ecfcb94ffed`
- validation ref: `b259908a986be695bc9a382249a6ccac85ab02c5`
- RC #311 / `36299105721`: SUCCESS
- Hardening #549 on implementation PR: SUCCESS
- private transport gate: PASS
- category module bytes/hashes: unchanged from v9.5.34
- Router hash: `30216a94684439e059c187c9215848fb4866ad1d774e8199c4e4b53f5686e10e`
- Loader v8 token storage: Scriptable Keychain only
- repository visibility: still public
- physical authenticated validation: PENDING


## PERSONAL COCKPIT v1

- user-facing model: **one existing Scriptable only**.
- Router utility Parameter `MY` = MY RACE DAY.
- Router utility Parameter `CONFIG` = Personal Config; interactive editor is selected when running Motorsport Hub in Scriptable.
- aliases: `RACEDAY`, `MYRACEDAY`, `SETTINGS`.
- internal modules: `motorsport-personal-cockpit.js`, `motorsport-personal-config.js`.
- personal modules are sourceRef-pinned and Router-verified by exact SHA-256 + UTF-8 bytes before execution.
- config file: `motorsport-personal-config-v1.json` in Scriptable local documents.
- data source: existing 12 category local caches.
- viewing source: existing local verified JP viewing-rights cache.
- cockpit network behavior: no new external requests.
- layouts: Small / Medium / Large.
- Stable v9.5.36 exposes `MY` / `CONFIG` through the existing Motorsport Hub Router; publication PR #72 is merged.
- physical state: **PENDING**.
- next device gate: MY Medium visual/density/content validation → CONFIG flow → MY Small → MY Large → offline MY.


## PERSONAL COCKPIT PHYSICAL EVIDENCE — 2026-09-27

- Stable: v9.5.36 / sequence 14
- MY Medium: **PASS**
  - cross-series rows visible;
  - active/upcoming ordering visible;
  - viewing platform / leader / cache age fit the Medium layout;
  - no obvious clipping or overflow in the captured surface.
- Personal Config flow: **PASS**
  - launched from the same existing `Motorsport Hub` Scriptable;
  - current summary showed `12カテゴリ / 14日`;
  - controls visible: 表示カテゴリ・優先順 / 表示期間 / 表示項目 / 現在設定を見る / 初期設定へ戻す / 完了.
- Separate user-installed Scriptable required: **NO**.
- Remaining physical gates: MY Small / MY Large / offline MY.


## PERSONAL COCKPIT SMALL PHYSICAL EVIDENCE — 2026-09-27

- Stable: v9.5.36 / sequence 14
- MY Small: **PASS**
  - single highest-priority event surface rendered;
  - category pill, event name, date, venue, state and viewing platform visible;
  - no obvious clipping / overflow;
  - visual hierarchy is clear and distinct from Medium.
- Minor polish candidate: lower whitespace could support slightly larger text, but no change is required before Large validation.
- Remaining physical gates: MY Large / offline MY.


## PERSONAL COCKPIT LARGE / OFFLINE-CONFIG EVIDENCE — 2026-09-27

- Stable: v9.5.36 / sequence 14
- MY Large visual/layout: **PASS**
  - six event rows fit without obvious clipping/overflow;
  - hierarchy is clear across D1GP / WEC / NASCAR / WRC / FDJ / MotoGP;
  - viewing platform / leader / cache age remain readable.
- Logic issues found from physical evidence:
  - header reported `8 EVENTS` while Large intentionally rendered only six rows;
  - WEC `6 Hours of Fuji` still showed `開催中` after the expected six-hour finish because MY trusted cached `lifecycle=ACTIVE` before checking an event end.
- Airplane-mode Personal Config: **PASS**
  - CONFIG reopened while airplane mode was visibly active;
  - this validates local fallback for the personal utility module/config path.
- Offline MY widget itself: **PENDING**.
- Large status: **VISUAL PASS / LOGIC FIX PENDING**.


## v9.5.37 PERSONAL COCKPIT FIX CANDIDATE

- sourceRef target: `1d331a79bebf55579242be40969061f788bd5182`
- validation ref: `149b645d07e6e0b10339ce29d214e80992227987`
- RC #330 / `36308093798`: SUCCESS
- artifact digest: `sha256:e6093bc4cc7f25e8cd56db8abdc368dea3c3e5864695e127f005b7e43de06c49`
- Router hash: `dabb3a3abe887611357b63d91fe6060bb976d065c3fd317504bdddb864803e8d`
- fixes:
  - Large event counter uses visible / total semantics when rows are capped;
  - MY end-window logic supersedes stale cached ACTIVE state;
  - WEC duration is inferred from race-name hours when available;
  - ended events are filtered from MY.
- 12-category module hashes: unchanged.
- physical revalidation after promotion: Large → offline MY.


## v9.5.37 PUBLICATION STATE

- publication PR: #78
- status: **MERGED / STABLE LIVE**
- current Stable: v9.5.37 / sequence 15
- current sourceRef: `1d331a79bebf55579242be40969061f788bd5182`
- remaining physical gate: MY Large revalidation → offline MY.


## PERSONAL COCKPIT v1 FINAL STATE

Status: **COMPLETE / PHYSICAL PASS**

Stable: **v9.5.37 / sequence 15**

Physical evidence:
- MY Medium: PASS
- Personal Config: PASS
- MY Small: PASS
- MY Large: PASS
- offline CONFIG: PASS
- offline MY: PASS
- Large visible/total counter: PASS (`6 / 7 EVENTS` observed)
- stale WEC ACTIVE removal: PASS

F1 identity review:
- `Bahrain Grand Prix in Malaysia` at Sepang was initially flagged for review.
- Current official Formula 1/FIA sources confirm the 2026 Bahrain Grand Prix is being staged at Sepang, Malaysia.
- Result: **VERIFIED / NOT A BUG**.

No remaining Personal Cockpit v1 Gate is open.
