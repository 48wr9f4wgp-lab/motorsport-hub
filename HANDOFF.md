# Motorsport Hub — Development Handoff

Updated: 2026-09-14 JST

This is the current operational handoff for Motorsport Hub. Re-fetch GitHub before protected actions and prefer current repository state over older chat/history. `COMPLETION_AUDIT.md` is the completion snapshot; `GA_READINESS.md` and `GA_LAUNCH_CHECKLIST.md` control broad-public readiness.

## 1. Product state

Motorsport Hub is an iPhone home-screen motorsport widget system for Scriptable. One installed `scriptable-loader-v7.js` serves:

`F1, WEC, WRC, SUPERGT, MOTOGP, FDJ, D1GP, SUPERFORMULA, INDYCAR, NASCAR, GTWCEU, DAKAR` + `QA`.

Current state:

- Public RC: **APPROVED**.
- Stable: **v9.5.29 / sequence 7**.
- Stable sourceRef: `7f3fc1eb6fa93c619c1def732b18d091c9e949ce`.
- WEC / SUPER GT v9.5.29 repair: **USER-CONFIRMED physical iPhone PASS**.
- No known reproducible P0 startup/routing/current-data blocker.
- Runtime maturity: **GA-capable candidate**.
- Broad GA/public distribution: **NOT AUTHORIZED**.

## 2. Current GitHub baselines

### main

Before the current GA-compliance branch:

`79e7771ccc867655418f1e7e3c87840c88842d2f`

This is PR #47, which merged self-service GA onboarding/support documentation and public GA documentation gates.

Relevant merged post-Stable work on `main`:

- PR #45 → `51e6b75c52a191869035ef74dc3083355ba2a276`: Dakar 2027 season-aware cache rollover hardening.
- PR #46 → `2f297407c2a0ed57b9e6cc88b04af52e2867110f`: workflow hygiene / read-only Hardening CI cleanup.
- PR #47 → `79e7771ccc867655418f1e7e3c87840c88842d2f`: self-service install/support/privacy/GA docs and related CI contract.

A temporary GA placeholder was accidentally added directly to `main` before PR #47 work and immediately removed. The correction left no runtime/Stable/Hero content change; do not repeat direct-to-main writes.

### Stable

`release-channel.json` remains:

- version: **9.5.29**
- sequence: **7**
- sourceRef: `7f3fc1eb6fa93c619c1def732b18d091c9e949ce`
- releaseId: `mh-7f3fc1eb6fa9`
- routerSchema: `5`
- validation releaseRef: `b8df2430607161f8bb2a560174ac3c36dcd7b4a3`
- RC validation: run `34837876868` / RC CI #256 — SUCCESS

Post-v9.5.29 `main` work is not automatically Stable.

### hero-live

At the GA compliance audit, `hero-live` HEAD was:

`b81553a164c76620d69b94477f823bb777ff4af6`

The current channel contains five dynamically published categories: WEC, WRC, F1, SUPER FORMULA and NASCAR. Re-fetch `hero-live` before making current asset claims because Hero publication is independent from runtime Stable.

## 3. Architecture contract

```text
Scriptable Loader v7
        ↓
release-channel.json
        ↓
verified immutable source + RC evidence + hashes
        ↓
Router schema 5
        ↓
exactly one category module
        ↓
data/cache + hero-live/fallback Hero
        ↓
Small / Medium / Large widget
```

Invariants:

- Loader v7 does not execute mutable `main` as Stable runtime.
- Stable sequence is monotonic; rollback/fork updates are rejected.
- Loader retains release-namespaced local LKG.
- Category caches are schema-1 and validate before use.
- Visual v1 is locked unless a concrete regression or materially better compliant source justifies reopening it.

## 4. QA / reliability evidence

Implemented and currently accepted:

- 36 deterministic render smoke cases (12 categories × Small/Medium/Large).
- Hardening CI + Release Candidate CI.
- scheduled/manual 12-category live parser monitor.
- Loader v7 online/offline physical-iPhone evidence.
- local Loader observability capped at latest 200 events.
- no automatic external analytics transport.
- support observability export has deterministic CI coverage but its Share Sheet interaction has not been physically exercised.

Device-sensitive Loader/parser/renderer/Hero changes still require representative physical-iPhone evidence.

## 5. Resolved device parser incident

Stable v9.5.28 still showed `更新待ち` for WEC and SUPER GT on the physical iPhone despite server-side parser checks. Device QA showed 12/12 LIVE, isolating the issue to production extraction rather than network/channel propagation.

PR #42 added device-safe normalized-text fallbacks. Stable v9.5.29 was published and user-supplied screenshots confirmed WEC and SUPER GT fresh Top 5 data without `更新待ち`, including SUPER GT positions 4–5, with no visible Large-layout regression.

Treat **Stable v9.5.29 Physical iPhone Validation = PASS** for that repair scope.

## 6. Dakar 2027

Stable v9.5.29 still uses 2026 FINAL as the pre-start ranking fallback for the embedded 2027 Dakar schedule.

PR #45 on `main` adds season-aware rollover safety:

- pre-start 2026 FINAL remains allowed;
- once 2027 standings are expected, stale 2026 cache is rejected;
- matching 2027 LKG remains usable during temporary source failure;
- deterministic fixed-time tests protect the transition.

Do not claim live 2027 parser proof before the 2027 standings surface exists. Publish a tested Stable containing this hardening before 2027 live standings are expected to take over.

## 7. GA self-service surfaces

Merged in PR #47:

- `README.md`
- `INSTALL.md`
- `SUPPORT.md`
- `PRIVACY.md`
- `GA_READINESS.md`
- structured GitHub bug-report template
- current changelog / attribution guidance
- public GA documentation CI gate

The product is no longer blocked on basic onboarding/support documentation.

## 8. Current GA compliance branch

Branch:

`ga/final-distribution-compliance`

Purpose: close the remaining distribution/compliance design gaps without publishing GA or changing Stable runtime.

Work on this branch includes:

- `LICENSE_DECISION.md`: narrows the preferred software license to **MPL-2.0**, but grants no license.
- repository-scope audit: Club Pulse code (`scriptable/club-pulse*`) shares this repository, so a root license must not be added until scope is explicitly resolved.
- preferred architecture: move Club Pulse to its own repository before applying a root Motorsport Hub license; this move requires separate explicit approval and migration planning.
- `GA_LAUNCH_CHECKLIST.md`: exact final launch checklist.
- `tools/build-hero-public-attribution.mjs` + validator: generate a human-readable attribution surface from current `hero-live` pool metadata.
- `Motorsport Hub Hero Public Attribution` workflow: after successful scheduled/manual Hero refresh, update **only** `hero-live/hero-channel/ATTRIBUTION.md` with scoped write permissions.
- deterministic attribution + workflow-hygiene CI coverage.

No software license has been granted, no broad GA has been authorized, and no Stable publication is included in this branch.

## 9. Hero attribution compliance state

The current live-pool audit found:

- WEC: CC BY-SA 4.0 pool;
- WRC: CC BY 4.0 pool;
- F1: CC BY-SA 4.0 pool;
- SUPER FORMULA: CC BY 4.0 pool;
- NASCAR: CC BY-SA 4.0 pool.

Current inspected live/pool entries include exact Commons source pages, authors and license identifiers. The new public attribution generator is intended to turn that machine-readable metadata into a human-readable credit file including license links and modification notice.

Before broad GA, require one successful publication of `hero-live/hero-channel/ATTRIBUTION.md` and validate it against the then-current `channel.json`.

## 10. Remaining GA hard path

1. Merge/validate the current GA-compliance PR only after explicit approval.
2. Resolve software-license **and repository scope**. Recommended license: MPL-2.0; do not add it until owner approval.
3. Confirm the generated live Hero attribution file has published successfully.
4. Run the final physical iPhone smoke on the exact Stable chosen for GA.
5. Obtain explicit owner approval for broad GA and its distribution channel.

Centralized telemetry is not a GA blocker by itself. Do not add external telemetry, paid services, Store submission or public launch without the corresponding explicit approval.

## 11. Protected-action boundary

Creating branches/tests/docs/PRs is reversible development work. The following require fresh explicit approval:

- merge to `main`;
- Stable publication/update;
- `hero-live` manual publication outside an already-approved automated workflow change;
- software-license grant;
- moving/deleting Club Pulse files or creating a migration with destructive effects;
- broad public GA/distribution;
- Store submission, paid distribution, external service contract/cost, external analytics.

## 12. Next task

If the current GA-compliance PR is still open:

- verify final changed-file scope;
- require Hardening CI and Release Candidate CI PASS;
- stop before merge and request explicit approval.

After it is merged, do **not** immediately launch. Next owner decision is license + repository scope. Once that is approved and implemented, validate live Hero attribution publication, run the exact-Stable iPhone smoke, then request explicit GA authorization.

## Next-chat start prompt

> Motorsport Hubを引き継いでください。Repositoryは `48wr9f4wgp-lab/motorsport-hub`。最初にGitHubの現在の `main`、`release-channel.json`、`hero-live`、open PRを再取得し、`HANDOFF.md`、`COMPLETION_AUDIT.md`、`GA_READINESS.md`、`LICENSE_DECISION.md`、`GA_LAUNCH_CHECKLIST.md` を読んでください。Stable v9.5.29 / sequence 7 のWEC・SUPER GT parser repairはユーザー提供スクリーンショットでPhysical iPhone PASS済み。`main`にはStable未配布のDakar 2027 rollover hardeningがある。GA前の主要論点はsoftware license/repository scope、generated Hero attribution publication、exact-Stable physical smoke、explicit GA approvalです。未確認を完成済みと言わず、main merge、Stable更新、software license grant、Club Pulse移動、公開配布、Store/有料配布、外部サービス契約は明示承認なしに実行しないでください。
