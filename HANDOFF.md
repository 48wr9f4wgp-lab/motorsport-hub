# Motorsport Hub — Development Handoff

Updated: 2026-09-14 JST

This file is the current handoff entry point for the Motorsport Hub product. When this file and older chat/history disagree, re-fetch GitHub and prefer the current code/state. `COMPLETION_AUDIT.md` is the current completion/release-status document. `RC_QA.md`, `RELEASE_AUDIT.md`, and `CODEX_HANDOFF.md` are historical references and contain obsolete assumptions from earlier hardening work.

## Certainty labels

- **CONFIRMED** — verified from current GitHub code/state.
- **USER-CONFIRMED** — reported/provided from the physical iPhone; not independently machine-verifiable from GitHub.
- **PENDING** — not yet merged/published/implemented.
- **BACKLOG** — intentionally deferred; not a current Public RC blocker.

---

## 1. Purpose and current product stage

**CONFIRMED.** Motorsport Hub is an iPhone home-screen motorsport widget system built for Scriptable. One installed Loader v7 serves 12 motorsport categories plus QA diagnostics through the Scriptable widget Parameter.

Production categories:

`F1, WEC, WRC, SUPERGT, MOTOGP, FDJ, D1GP, SUPERFORMULA, INDYCAR, NASCAR, GTWCEU, DAKAR` + `QA`.

The finished-product contract includes:

- reliable next/current-event lifecycle information;
- category-appropriate live/current standings;
- Small / Medium / Large layouts;
- licensed, provenance-tracked Hero imagery;
- resilient local category cache and Loader LKG behavior;
- safe immutable Stable delivery rather than executing mutable `main`;
- diagnostics sufficient to isolate release regressions;
- deterministic CI plus physical-iPhone verification for device-sensitive changes.

Current stage: **Public RC approved; Stable v9.5.29 is physically validated on the user's iPhone for the repaired WEC / SUPER GT data path.**

This does **not** authorize Store submission, paid distribution, broad public launch, external analytics contracts/services, or other irreversible/external-impact actions.

---

## 2. Current canonical baseline

### Main / runtime baseline

Before this docs-only handoff sync branch was created:

- `main` HEAD: `bb1c8ef8b6f57c1413ae0a8fcbef2284c83d4bf6`
- commit: merge of PR #43, `Publish Stable v9.5.29 device parser fallback`
- GitHub commit signature: verified.

The executable Stable source is not the publication merge itself. Stable v9.5.29 points to:

- sourceRef: `7f3fc1eb6fa93c619c1def732b18d091c9e949ce`
- source commit: merge of PR #42, `Fix device-side WEC and SUPER GT standings parsing`

### Stable channel

**CONFIRMED.** Current `release-channel.json`:

- version: **9.5.29**
- sequence: **7**
- sourceRef: `7f3fc1eb6fa93c619c1def732b18d091c9e949ce`
- releaseId: `mh-7f3fc1eb6fa9`
- routerSchema: `5`
- validation releaseRef: `b8df2430607161f8bb2a560174ac3c36dcd7b4a3`
- validation workflow: `Motorsport Hub Release Candidate CI`
- validation run: `34837876868` / RC CI #256 — SUCCESS

Runtime hash/byte changes from Stable v9.5.28 to v9.5.29 are limited to WEC and SUPER GT. Router, other ten categories, diagnostics, Loader, Hero policy/runtime surface, visual layout and analytics behavior were not changed by v9.5.29.

### Active Hero

At this handoff sync, `hero-live` HEAD is:

`b81553a164c76620d69b94477f823bb777ff4af6`

Hero refresh is independently automated/gated, so always re-fetch `hero-live` before making current-asset claims.

---

## 3. Technology and external dependencies

### Runtime

**CONFIRMED.**

- JavaScript executed by iOS Scriptable.
- Main Scriptable APIs include `ListWidget`, `FileManager.local()`, `Request`, `DrawContext`, `Font`, `Color`, `DateFormatter`, `Alert` and related APIs.
- No backend application/database.
- No user authentication.

### Build/test/tooling

- GitHub + GitHub Actions.
- Node.js 22 for main Hardening / Release Candidate CI.
- Hero pipeline uses Node.js-based tooling and build-time image ML where needed.
- Build-time Hero subject detection uses TensorFlow/COCO-SSD packages in CI only.
- Do not move image ML into Scriptable runtime without measured justification.

### Runtime data/image services

Current category sources include:

- F1: Jolpica / Ergast-compatible JSON;
- WEC: official FIA WEC manufacturers classification;
- WRC: official FIA WRC standings;
- SUPER GT: official SUPER GT GT500 driver ranking;
- MotoGP: official MotoGP world standings;
- FDJ: official Formula Drift Japan standings;
- D1GP: official D1GP standings;
- SUPER FORMULA: official SUPER FORMULA standings;
- INDYCAR: official INDYCAR standings;
- NASCAR: NASCAR public CDN points feed;
- GTWC Europe: official GT World Challenge Europe standings;
- Dakar: current 2027 module uses official 2026 final CAR classification as its pre-start overall fallback while carrying the embedded 2027 route/schedule.

Hero discovery/publication uses licensed Wikimedia Commons sources and the separate `hero-live` branch.

No external analytics/crash service is currently used.

---

## 4. Important repository structure

```text
motorsport-hub/
├─ .github/workflows/
│  ├─ hardening-ci.yml
│  ├─ release-candidate-ci.yml
│  ├─ parser-monitor.yml
│  ├─ release-readiness.yml
│  ├─ hero-discovery.yml
│  └─ historical/pilot Hero workflows
├─ .release/
│  └─ immutable validation/publication evidence
├─ tests/
│  ├─ render-smoke-gate.mjs
│  ├─ parser-monitor-gate.mjs
│  ├─ observability-support-export-gate.mjs
│  ├─ stable-loader-v7-gate.mjs
│  ├─ router/cache/lifecycle/integrity/release/category/Hero gates...
│  └─ fixtures/
├─ tools/
│  ├─ live-parser-monitor.mjs
│  ├─ generate-release-package.mjs
│  ├─ prepare-main-release.mjs
│  └─ Hero/runtime helper scripts
├─ motorsport-hub.js
├─ scriptable-loader-v7.js
├─ release-channel.json
├─ category-registry.json
├─ f1-widget-flat-v1000.js
├─ wec-widget-flat-v1000.js
├─ wrc-widget-flat-v1000.js
├─ supergt-widget-flat-v1000.js
├─ motogp-widget-flat-v1000.js
├─ fdj-widget-flat-v1000.js
├─ d1gp-widget-flat-v1000.js
├─ superformula-widget.js
├─ indycar-widget.js
├─ nascar-widget.js
├─ gtwc-europe-widget.js
├─ dakar-widget.js
├─ motorsport-diagnostics-v890.js
├─ support-observability-export.js
├─ RC_FIELD_VALIDATION.md
├─ hero-assets.json
├─ hero-refresh-sources.json
├─ hero-selection-policy.json
├─ hero-rollout-policy.json
├─ ATTRIBUTION.md
├─ README.md
├─ COMPLETION_AUDIT.md
└─ HANDOFF.md
```

The repository also contains co-located Club Pulse files under `scriptable/`. Treat Club Pulse as a separate product and do not modify it while working on Motorsport Hub unless explicitly required.

Legacy loaders/wrappers and historical documents remain for compatibility/history. They are not the current production path.

---

## 5. Implemented production functionality

### Router / categories

- Router schema 5.
- Direct Router → exactly one selected category module.
- Explicit parameter aliases and invalid-parameter handling.
- No Router-time runtime source rewriting.
- All 12 categories + QA are `RELEASED`; registry `planned` is empty.

### Data resilience

- Schema-1 local category data caches across all 12 categories.
- Static SNAP fallback data.
- Upcoming / active / season-ended lifecycle handling.
- Cache validation and stale/corrupt cache rejection.
- Loader release LKG plus category-level data fallback.

### Widget UI

Visual v1 is locked for the current RC path:

- Small / Medium / Large layouts for all 12 categories;
- Large typography multiplier: `1.12`;
- Large Top 3 + positions 4–5 under `MORE STANDINGS`;
- adaptive/bottom-weighted lower information block;
- Dakar-specific stage/route/SS/GAP semantics rather than forcing circuit-racing labels.

Do not reopen general Hero/spacing/UI tuning without a concrete regression or materially better compliant asset.

### Hero system

- Separate `hero-live` branch.
- CI-gated provenance/license validation.
- Wikimedia Commons discovery.
- MIME/dimension checks.
- build-time subject detection and subject-aware crops.
- Large contained derivatives where relevant gates pass.
- pool rotation / recent-display cooldown.
- local manifest/image cache, LKG and fail-closed behavior.
- embedded audited Hero fallback.

### Release engineering

- Canonical installed production loader: `scriptable-loader-v7.js`.
- Loader v7 does not execute mutable `main` directly.
- Stable descriptor enforces monotonic sequence, rollback/fork rejection, source commit verification, successful RC evidence, validation ancestry/metadata-only contract, SHA-256 and byte-length integrity.
- Release-namespaced local Router LKG.
- Immutable bootstrap recovery anchor remains available.
- `tools/generate-release-package.mjs` produces immutable release evidence/artifacts.
- Stable publication remains a separately approved action from ordinary `main` merge.

### Local observability / support

- Loader writes `motorsport-hub-observability-v1.json` locally.
- Maximum retained events: 200.
- Allowlisted event context includes release identity, category, widget family, execution path, success/failure, elapsed time and normalized error code.
- No automatic external telemetry transport.
- No device ID, email, latitude/longitude or advertising ID collection.
- `support-observability-export.js` is a user-triggered, sanitized support export path with deterministic CI coverage.
- The support export utility itself has not yet been physically exercised on the iPhone; do not call that interaction verified until device evidence exists.

### QA / monitoring

- 36 deterministic render smoke cases = 12 categories × Small/Medium/Large.
- Hardening CI + Release Candidate CI.
- Scheduled/manual Live Parser Monitor across all 12 categories.
- Live monitor success requires fresh schema-1 cache generation, not merely HTTP 200.
- PR parser-monitor job runs deterministic contract checks; external live-upstream execution is intentionally separated/skipped on ordinary PRs.
- Physical device remains required for device-sensitive renderer/Loader/Hero/parser behavior.

---

## 6. Evidence-backed WEC / SUPER GT incident and resolution

This incident is important because it defines the preferred RC debugging workflow.

### Detection

After live parser monitoring was added, the monitor detected WEC and SUPER GT parser drift even though the upstream pages returned HTTP 200. Server/CI-side parser repairs were shipped in Stable v9.5.28.

### Physical-device discrepancy

**USER-CONFIRMED.** On Stable v9.5.28, the real iPhone still showed `更新待ち` for WEC and SUPER GT; SUPER GT also lacked positions 4–5.

The user then ran QA on the same iPhone. QA showed:

- **12/12 LIVE**;
- candidate/source suffix `938cc2e646ac`.

That proved Stable propagation and network reachability were healthy while the production standings extraction still failed on the device response.

### Repair

PR #42 added device-safe fallback parsing while preserving the existing structured table parsers:

- WEC: normalized standings-text fallback when `<tr>/<td>` extraction is unavailable;
- SUPER GT: normalized GT500 standings-text fallback using validated car numbers and sequential rank markers;
- SUPER GT uses overlapping marker lookahead so score-column values do not consume the next legitimate `rank + car number` marker;
- device-shaped/no-table regression fixtures protect both paths;
- WEC / SUPER GT runtime version contracts were aligned to `10.0.5-hardening`.

Final PR #42 head:

`eb85d64d6f53ff505d03cad082e4ed62df7874a3`

Validation before merge:

- Hardening CI #465 — PASS;
- Release Candidate CI #254 — PASS;
- parser monitor deterministic contract — PASS.

PR #42 merged as:

`7f3fc1eb6fa93c619c1def732b18d091c9e949ce`

### Stable v9.5.29 publication

A metadata-only validation release was created from the runtime source and passed RC CI #256 (`34837876868`). Stable publication PR #43 then passed:

- Hardening CI #466 — PASS;
- Release Candidate CI #257 — PASS.

PR #43 merged as:

`bb1c8ef8b6f57c1413ae0a8fcbef2284c83d4bf6`

Stable became v9.5.29 / sequence 7 / sourceRef `7f3fc1eb...`.

### Physical iPhone result

**USER-CONFIRMED PASS.** After running Loader v7 against Stable v9.5.29, the user supplied iPhone screenshots showing:

- WEC: `更新待ち` absent; Top 5 standings visible;
- SUPER GT: `更新待ち` absent; positions 4–5 visible in `MORE STANDINGS`;
- no visible layout/typography regression in the supplied Large widgets.

Treat **Stable v9.5.29 WEC / SUPER GT Physical iPhone Validation = PASS**.

---

## 7. Current status and immediate work

### Current blockers

**CONFIRMED: no known reproducible P0 launch/routing/current-data blocker.**

The WEC / SUPER GT device parser regression that was reproduced on v9.5.28 is resolved in Stable v9.5.29 and has physical-iPhone confirmation.

### Current active implementation

There is **no half-written runtime implementation that must be resumed**. This handoff update is docs-only.

The next development work should be evidence-driven RC field validation and GA-readiness work, not speculative feature expansion or broad UI retuning.

### Next priorities

P1 / RC operations:

- continue observing concrete source/parser/cache/LKG/support failures;
- use QA + local observability to identify the failing layer before changing runtime;
- fix only reproduced regressions;
- physically verify device-sensitive changes after CI.

P2 / before GA or wider distribution:

- decide whether centralized telemetry is necessary for aggregate crash-free rate, device/OS distribution and fleet-wide upstream/API failure monitoring;
- if centralized telemetry is chosen, perform privacy/retention/service review and obtain explicit approval before external transmission, contract or cost;
- season rollover / fixture refresh automation, especially Dakar 2027 live standings/source rollover;
- historical documentation / stale workflow-condition cleanup;
- performance/latency budgets only if real-device evidence justifies them;
- optional richer tap/deep-link interactions;
- Hero upgrades only when a clearly superior policy-compliant source passes existing gates;
- physically exercise `support-observability-export.js` when support collection is actually needed.

---

## 8. Known technical risks / gaps

- External APIs/HTML can change without notice; parsers remain a continuous reliability risk even with scheduled monitoring.
- Dakar's 2027 module still uses the official 2026 final CAR classification as the pre-start overall fallback; 2027 live standings/source rollover remains future maintenance.
- No centralized production telemetry exists; population-level crash/success metrics cannot currently be observed.
- Several historical docs/workflow conditions still describe older hardening branches or pre-release states. Do not treat them as current truth.
- Physical-iPhone results are **USER-CONFIRMED**, not independently observable from GitHub.
- GitHub state cannot prove arbitrary local developer workstation uncommitted files.

---

## 9. Important design decisions

1. **Direct Router → one category module.** Avoids historical wrapper waterfalls, serial network work and hidden source rewriting.
2. **Mutable Stable descriptor → immutable source.** Allows approved updates without executing mutable `main`.
3. **Monotonic sequence + verified source + RC evidence + hashes.** Protects against rollback/fork/stale mismatches.
4. **Local LKG fallback.** Keeps the widget usable through temporary network/source failures.
5. **Separate category modules.** Parser/lifecycle/semantics differ enough that isolation is preferable to a monolith.
6. **Local-only observability for Public RC.** Improves supportability without adding privacy/service dependencies immediately before wider validation.
7. **Hero ML at build time only.** Keeps Scriptable runtime lightweight and deterministic.
8. **Separate `hero-live`.** Allows image refresh without changing executable runtime while retaining provenance/quality gates.
9. **Shared visual contract across duplicated modules.** Global layout changes must be applied consistently and protected by regression gates, not category hacks.
10. **Stable publication is separate from `main` merge.** Green CI or a runtime merge does not itself publish executable Stable code.
11. **Device QA diagnoses layers, not just appearance.** A green network/QA path plus a failing production widget should be treated as a parser/runtime-path signal rather than guessed as a connectivity problem.

---

## 10. Rejected approaches / changes to avoid

- Do not reintroduce the historical multi-wrapper reliability waterfall.
- Do not restore Router-time source rewriting.
- Do not execute mutable `main` as installed production source.
- Do not weaken deterministic tests merely to obtain green CI.
- Do not use invented factual fallback data to hide parser failures.
- Do not collapse all categories into one giant file only for deduplication.
- Do not move TensorFlow / COCO-SSD inference into Scriptable runtime.
- Do not manually retune every Hero/category layout without a concrete defect.
- Do not return to a 12-category manual screenshot loop unless a risk-based change specifically requires it.
- Do not touch Club Pulse while working Motorsport Hub unless explicitly required.
- Do not merge, publish Stable, distribute publicly, submit to a Store, start paid distribution or contract an external service without the appropriate explicit approval.

---

## 11. DB / API / auth / environment configuration

### Database

**CONFIRMED: none.** Runtime persistence is local Scriptable files/images via `FileManager.local()`.

Important local data includes:

- category caches `motorsport-data-v1000-*.json`;
- Loader state `motorsport-hub-loader-v7-state.json`;
- observability `motorsport-hub-observability-v1.json`;
- release-namespaced Router LKG;
- Hero manifest/image caches and LKG;
- category-specific UI state where needed.

### API/auth

Runtime sources are public HTTP(S) endpoints/pages. No user login/authentication layer is implemented.

### Secrets/environment

No external-service credential is part of the current product contract. GitHub Actions uses normal repository/workflow permissions for repository operations.

---

## 12. Exact first task for the next chat

Before changing code:

1. Fetch current `main` HEAD.
2. Fetch current `release-channel.json` and confirm Stable version/sequence/sourceRef.
3. Fetch current `hero-live` HEAD.
4. Read `HANDOFF.md` and `COMPLETION_AUDIT.md` from `main`.
5. Check whether any docs-only handoff sync PR is still open; do not create a duplicate.
6. If the user is reporting a runtime problem, reproduce/diagnose it before broad changes. Use QA, observability and parser monitoring to identify whether the failing layer is Loader/channel, network, parser, cache/LKG or renderer.
7. If there is no reproduced regression, prioritize RC field validation / GA-readiness rather than speculative runtime or Visual v1 changes.
8. Do not merge, publish Stable, begin public distribution, submit to a Store or contract an external service without explicit approval for that protected action.

---

## 13. Branch / work state at this handoff

### Runtime main baseline

Before this docs-only branch:

`bb1c8ef8b6f57c1413ae0a8fcbef2284c83d4bf6`

Message: `Merge pull request #43 ... Publish Stable v9.5.29 device parser fallback`.

### Stable

- v9.5.29
- sequence 7
- sourceRef `7f3fc1eb6fa93c619c1def732b18d091c9e949ce`
- releaseId `mh-7f3fc1eb6fa9`
- validation ref `b8df2430607161f8bb2a560174ac3c36dcd7b4a3`
- RC CI #256 / run `34837876868` — SUCCESS

### Active Hero

`b81553a164c76620d69b94477f823bb777ff4af6`

### Current docs branch

`docs/v9.5.29-physical-pass`

Purpose: synchronize `HANDOFF.md` and `COMPLETION_AUDIT.md` with the already-published/physically-validated Stable v9.5.29 state. This branch is docs-only and must not be used to change Runtime/Stable/Hero.

No runtime implementation is intentionally in progress on this branch.

---

# Next-chat start prompt

> Motorsport Hubの開発を引き継いでください。Repositoryは `48wr9f4wgp-lab/motorsport-hub` です。まず会話履歴を前提にせず、GitHubの現在状態を確認してください。`HANDOFF.md` と `COMPLETION_AUDIT.md` を現行の引き継ぎ正本として読み、`main`、`release-channel.json`、`hero-live`、未解決PRの最新状態を再取得してください。Stable v9.5.29 / sequence 7 のWEC・SUPER GT device parser repairはユーザー提供のiPhoneスクリーンショットでPhysical iPhone PASS済みですが、コードと文書が矛盾する場合は実コード/GitHub状態を優先してください。未確認を完成済みと言わず、変更後は可能な範囲でbuild/test/CI/実動作回帰を確認してください。再現する不具合がない場合はVisual v1をむやみに再調整せず、RC field validationとGA readinessを優先してください。main merge、Stable publication、公開配布、Store申請、外部サービス契約・費用発生など外部影響のある操作は明示承認なしに実行しないでください。