# Motorsport Hub — Development Handoff

Updated: 2026-09-27 JST
Scope: title-local / iPhone Scriptable non-game product.

## WORKING_HEAD / VERIFIED_BASELINE / RECOVERY_STATE

- Main before v9.5.32 publication: `273c582da42b02d1bcb5aa805bf7e2c77626a4a8` (PR #55 merged).
- Stable target: **v9.5.32 / sequence 10**, sourceRef `273c582da42b02d1bcb5aa805bf7e2c77626a4a8`.
- Validation releaseRef: `18d823d1c740a554d1d75fa95f811006f99ec965`; RC #288 / run `36253970101` SUCCESS.
- Current hero-live observed before publication prep: `7bd8e3e4fcf616b90fbded4911ac0ec8000ad225`.
- Hero production recovery: Active Refresh #124 SUCCESS; Public Attribution #47 SUCCESS.
- Live Parser Monitor #94 first attempt hit transient SUPER GT/D1GP TIMEOUTs; failed-job rerun returned **12/12 PASS**, including Dakar.
- Legacy draft PR #2 remains obsolete/separate; do not merge it into current release work.

## LOCKED PRODUCT CONTRACT

- Canonical installed loader: `scriptable-loader-v7.js`.
- Stable source is immutable and separately approved; main merge is not Stable publication.
- Router schema 5; category cache schema 1; 12 categories + QA; Small/Medium/Large.
- Visual v1 locked except concrete regression/material improvement.
- MPL-2.0 software license; third-party Hero licenses remain separate.
- Club Pulse is separate repo/product.
- Local observability only; no automatic external analytics.
- No new user-facing schedule/monitor automations unless explicitly requested.
- Broad GA/public distribution is NOT AUTHORIZED.

## VERIFIED PRODUCT EVIDENCE

- v9.5.31 SUPER GT Small black-widget repair: user-confirmed physical iPhone PASS.
- v9.5.30 WEC Fuji 11:00 + Dakar GAP/index fixes: scoped historical physical PASS.
- PR #55 Dakar live parser repair: deterministic CI PASS and live 12/12 PASS.
- v9.5.32 candidate RC #288: SUCCESS.
- Hero refresh and attribution workflows: production SUCCESS after PR #55.

## REMAINING

1. Publish v9.5.32 only after explicit Stable approval.
2. Confirm Dakar fresh-data path on physical iPhone after promotion; `更新待ち` should not be treated as fresh PASS.
3. Run final representative exact-Stable GA smoke: Loader v7 path, QA, Small/Medium/Large, online refresh and relevant recovery.
4. Revalidate current live Hero credits at GA time.
5. Broad GA requires explicit owner approval and named distribution action/channel.
6. Support observability export Share Sheet remains optional/unverified.
7. Actual Dakar 2027 live standings/parser remains unverified until that upstream exists.

## NEXT

After v9.5.32 device confirmation, resume Japan viewing-platform specification:
`region + season/event + platforms + verifiedAt + official source + expiry`, fail closed when unverified/stale. Avoid adding viewing data to Small until width safety is demonstrated.
