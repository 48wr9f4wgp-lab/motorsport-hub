# Motorsport Hub — Completion Audit

Updated: 2026-09-27 JST
Status: **v9.5.32 CANDIDATE RC PASS / HERO RECOVERED / GA NOT AUTHORIZED**

## Baselines

- Main source selected for candidate: `273c582da42b02d1bcb5aa805bf7e2c77626a4a8`.
- Stable target: **v9.5.32 / sequence 10**.
- Validation ref: `18d823d1c740a554d1d75fa95f811006f99ec965`.
- RC validation: **#288 / 36253970101 SUCCESS**.
- Immutable artifact: `motorsport-hub-release-18d823d1c740a554d1d75fa95f811006f99ec965`.
- Artifact digest: `sha256:484dc243792236fa598433a2b078e18433b0a7ef0ccea8eaa26ede9a3be0585e`.

## Runtime finding closed in candidate

Dakar official standings markup used encoded/typographic time units that the prior Stable parser did not accept consistently. PR #55 normalizes those units and preserves explicit hour GAP formatting.

Evidence:
- repair branch live monitor: **12/12 PASS**;
- scheduled main parser monitor #93: SUCCESS;
- scheduled #94 first attempt: SUPER GT and D1GP transport TIMEOUT only, Dakar PASS;
- rerun of failed #94 jobs: **12/12 PASS**, showing the two TIMEOUTs were transient and not parser drift;
- v9.5.32 RC #288: SUCCESS.

## Hero operations

The prior inherited-ATTRIBUTION publish failure is repaired and production recovery is now demonstrated:
- Hero Active Refresh #123 / #124: SUCCESS;
- Public Attribution #46 / #47: SUCCESS;
- hero-live advanced to `7bd8e3e4fcf616b90fbded4911ac0ec8000ad225`.

This closes the Hero refresh-health blocker. Current credits still require revalidation against the then-current pool immediately before broad GA.

## Device evidence

- Stable v9.5.31 SUPER GT Small: user-confirmed physical iPhone PASS.
- Prior v9.5.30 WEC/Dakar display fixes: scoped historical physical PASS.
- v9.5.32 Dakar fresh-data physical confirmation: **PENDING after Stable promotion**.
- Final representative exact-Stable GA smoke: **PENDING**.

## Current decision

No known reproducible P0 startup/routing/layout blocker.
v9.5.32 is technically validated as a Stable candidate, but publication remains a separate protected action.
Broad GA/public distribution remains NOT AUTHORIZED.
