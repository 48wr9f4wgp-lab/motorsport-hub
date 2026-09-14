# Motorsport Hub — Development Handoff

Updated: 2026-09-14 JST

This is the current operational handoff for Motorsport Hub. When chat/history or older documents disagree, re-fetch GitHub and prefer current repository state. `COMPLETION_AUDIT.md` is the completion/release-status snapshot; `GA_READINESS.md` tracks the remaining broad-public-release gates.

## 1. Product

Motorsport Hub is an iPhone home-screen motorsport widget system built for Scriptable. One installed `scriptable-loader-v7.js` serves:

`F1, WEC, WRC, SUPERGT, MOTOGP, FDJ, D1GP, SUPERFORMULA, INDYCAR, NASCAR, GTWCEU, DAKAR` + `QA`.

Current product stage:

- **Public RC approved**.
- **Stable v9.5.29 / sequence 7**.
- Stable WEC / SUPER GT device parser repair: **USER-CONFIRMED physical iPhone PASS**.
- No known reproducible P0 startup/routing/current-data blocker.
- Broad GA/public distribution is **not yet authorized**.

## 2. Canonical baseline

### Main

Before the current GA-docs branch was created, `main` HEAD was:

`f8fc6398b76a0cea250da113734c12cd3ebfaadd`

Its tree is `0b0fecebeffe3e06be66ce7b8259f117239890d3`, identical to the PR #46 merge tree. A temporary `GA_READINESS.md` placeholder was accidentally added directly to `main` and immediately removed; the two commits changed history but left the repository tree exactly back at the PR #46 content. No runtime, Stable descriptor or Hero content changed in that correction.

Relevant merged work after Stable v9.5.29:

- PR #45 → `51e6b75c52a191869035ef74dc3083355ba2a276`: Dakar 2027 season-aware ranking-cache rollover hardening + deterministic rollover tests.
- PR #46 → `2f297407c2a0ed57b9e6cc88b04af52e2867110f`: GA workflow hygiene; current Hardening CI is read-only and old v9.3 branch mutation paths were removed.

These later `main` changes are **not** part of current Stable v9.5.29.

### Stable

Current `release-channel.json`:

- version: **9.5.29**
- sequence: **7**
- sourceRef: `7f3fc1eb6fa93c619c1def732b18d091c9e949ce`
- releaseId: `mh-7f3fc1eb6fa9`
- routerSchema: `5`
- validation releaseRef: `b8df2430607161f8bb2a560174ac3c36dcd7b4a3`
- RC validation run: `34837876868` / RC CI #256 — SUCCESS

Stable source `7f3fc1eb...` is PR #42, the physical-device WEC / SUPER GT parser repair.

### Active Hero

At this handoff audit, `hero-live` HEAD is:

`b81553a164c76620d69b94477f823bb777ff4af6`

Hero refresh is independent and automated; always re-fetch `hero-live` before making current asset claims.

## 3. Architecture contract

```text
Scriptable Loader v7
        ↓
release-channel.json
        ↓
GitHub-verified immutable source commit
        ↓
SHA-256 / byte-length integrity
        ↓
Router schema 5
        ↓
exactly one category module
        ↓
data/cache + approved hero-live channel
        ↓
Small / Medium / Large widget
```

Important invariants:

- Loader v7 never treats mutable `main` as the Stable executable source.
- Stable sequence is monotonic and rollback/fork updates are rejected.
- Release source + successful RC evidence + byte length/SHA-256 are verified before promotion.
- Loader keeps a release-namespaced local last-known-good release.
- All 12 category modules use schema-1 local data caches/fallback behavior.
- Router routes exactly one selected category module.
- Visual v1 is locked unless a reproduced defect or materially better compliant asset justifies reopening it.

## 4. QA / reliability state

Implemented:

- 36 deterministic render smoke cases = 12 categories × Small/Medium/Large.
- Hardening CI and Release Candidate CI.
- Scheduled/manual 12-category Live Parser Monitor; fresh schema-1 cache is required for live success.
- Loader v7 online/offline recovery has physical-iPhone evidence.
- Local bounded observability: `motorsport-hub-observability-v1.json`, latest 200 events.
- No automatic external analytics/crash transport.
- `support-observability-export.js` has deterministic CI coverage but the share-sheet interaction itself has not yet been physically exercised.

Physical device remains required for device-sensitive Loader/parser/renderer/Hero changes.

## 5. WEC / SUPER GT incident — resolved in Stable

Stable v9.5.28 passed server/CI parser hardening but the real iPhone still showed `更新待ち` for WEC and SUPER GT. The same device's QA showed 12/12 LIVE, isolating the failure to production parsing rather than network/channel propagation.

PR #42 added device-safe normalized-text fallback parsers while preserving structured parsers, including no-table/device-shaped regression fixtures. Stable v9.5.29 was then published and the user supplied iPhone screenshots confirming:

- WEC fresh Top 5 without `更新待ち`;
- SUPER GT fresh Top 5 including positions 4–5;
- no visible Large-layout regression in the supplied screenshots.

Treat **Stable v9.5.29 WEC / SUPER GT Physical iPhone Validation = PASS**.

## 6. Dakar 2027 status

Current Stable still uses the 2026 final CAR classification as the pre-start fallback for the embedded 2027 Dakar schedule.

PR #45 is merged on `main` and hardens the future live rollover:

- pre-start continues to use 2026 FINAL;
- once 2027 standings are expected, cached 2026 ranking data is rejected as LKG;
- a matching 2027 LKG remains usable during a temporary source failure;
- deterministic fixed-time tests cover pre-start and Stage 1 rollover.

The actual 2027 live endpoint/parser cannot be empirically proven until the 2027 standings surface exists. There is no reason to rush a September Stable solely for this future-season hardening, but a tested Stable containing it should be published before 2027 live standings are expected.

## 7. GA readiness

The runtime is a **GA-capable candidate**, but broad GA is not yet approved. `GA_READINESS.md` is the checklist.

Current hard gates before broad public distribution:

1. Merge/validate self-service `INSTALL.md`, `SUPPORT.md`, `PRIVACY.md`, public README/changelog and issue template.
2. Make an explicit software-license decision. The public repository currently reports `license: null`; do not silently choose a license.
3. Perform a final distribution-level Hero attribution/compliance review for the current `hero-live` pool.
4. Obtain explicit owner approval for the actual broad-public/GA distribution action.

Centralized telemetry is **not** a GA blocker by itself for the current architecture. Do not introduce external telemetry without explicit privacy/service review and approval.

## 8. Public support / onboarding contract

After the GA-docs work is merged, public-facing sources are:

- `README.md` — product overview/current Stable.
- `INSTALL.md` — Loader v7 installation + widget Parameter setup.
- `SUPPORT.md` — QA-first evidence collection and GitHub Issues path.
- `PRIVACY.md` — current local storage/network/observability behavior.
- `GA_READINESS.md` — broad-public release gates.
- `ATTRIBUTION.md` + `hero-live/hero-channel/channel.json` metadata — Hero source/license evidence.

The Router behavior to document accurately:

- running the script in-app without a valid category shows the category preview sheet;
- a blank home-screen widget Parameter currently defaults to F1;
- an invalid non-empty Parameter shows a configuration error.

## 9. Release engineering rules

Normal development:

- short-lived branch → PR → Hardening CI + RC CI as applicable → explicit merge approval.

Stable publication is separate:

1. merge desired runtime to `main`;
2. fix the exact immutable `sourceRef`;
3. create a `release/*` validation ref with only `.release/` metadata added;
4. require successful Release Candidate CI;
5. build/verify descriptor hashes and byte counts;
6. create Stable publication PR;
7. obtain explicit approval for Stable publication/merge;
8. perform risk-based physical-device verification when the shipped change is device-sensitive.

Never interpret generic development approval as authorization for Store submission, paid distribution, broad public launch, external telemetry/service contracts, or Stable publication.

## 10. Known remaining risks

- Upstream APIs/HTML can change without notice.
- `hero-live` changes independently from runtime Stable.
- Population-level crash/success metrics are unavailable without centralized telemetry.
- The support export Share Sheet interaction is not yet physically verified.
- Actual Dakar 2027 live standings parsing remains future empirical validation.
- Historical docs/workflows can contain old assumptions; current `HANDOFF.md`, `COMPLETION_AUDIT.md`, `GA_READINESS.md`, and live GitHub state take precedence.

## 11. Next task

If there is no reproduced runtime regression:

1. finish the GA self-service documentation PR and CI;
2. do **not** merge it without explicit user approval;
3. after merge, ask the owner to choose the software distribution-license direction before broad GA;
4. then perform the final attribution/distribution review and decide the exact Stable intended for public launch.

If a runtime issue is reported, diagnose with QA + parser monitor + local observability before changing code.

## Next-chat start prompt

> Motorsport Hubを引き継いでください。Repositoryは `48wr9f4wgp-lab/motorsport-hub`。最初にGitHubの現在の `main`、`release-channel.json`、`hero-live`、open PRを再取得し、`HANDOFF.md`、`COMPLETION_AUDIT.md`、`GA_READINESS.md` を読んでください。Stable v9.5.29 / sequence 7 のWEC・SUPER GT parser repairはPhysical iPhone PASS済み。`main`にはStable未配布のDakar 2027 rollover hardeningとGA workflow hygieneがある。未確認を完成済みと言わず、公開・Stable更新・main merge・Store/有料配布・外部サービス契約は明示承認なしに実行しないでください。
