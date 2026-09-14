# Motorsport Hub — Development Handoff

Updated: 2026-09-14 JST

This file is the current handoff entry point for the Motorsport Hub product. When this file and older chat/history disagree, re-check GitHub and prefer the current code. `COMPLETION_AUDIT.md` is the current completion/release-status document. `RC_QA.md`, `RELEASE_AUDIT.md`, and `CODEX_HANDOFF.md` are historical references and contain obsolete assumptions from the old hardening branch.

## Certainty labels

- **CONFIRMED** — verified from current GitHub code/state.
- **USER-CONFIRMED** — reported by the user on the physical iPhone; not independently machine-verifiable from GitHub.
- **PENDING** — not yet merged/published/implemented.
- **BACKLOG** — intentionally deferred; not a current Public RC blocker.

---

## 1. Purpose and target completion state

**CONFIRMED.** Motorsport Hub is an iPhone home-screen motorsport widget system built for Scriptable. One installed loader serves 12 motorsport categories plus QA diagnostics. The user selects the category through the Scriptable widget Parameter.

Production categories:

`F1, WEC, WRC, SUPERGT, MOTOGP, FDJ, D1GP, SUPERFORMULA, INDYCAR, NASCAR, GTWCEU, DAKAR` + `QA`.

The intended finished product is not merely a working widget. It should provide:

- reliable next-event / current-event lifecycle information;
- current standings with category-appropriate semantics;
- Small / Medium / Large layouts;
- licensed, provenance-tracked motorsport Hero imagery;
- resilient local cache and last-known-good behavior;
- safe update delivery without executing mutable `main` directly;
- diagnostics sufficient to support release regressions;
- deterministic CI and physical-iPhone verification for release-sensitive changes.

Current product stage: **limited Public Release Candidate approved in the working audit branch**. This does **not** authorize Store submission, paid distribution, broad public launch, external analytics contracts, or other irreversible/external-impact actions.

---

## 2. Technology, libraries, external services

### Runtime

**CONFIRMED.**

- JavaScript executed by **iOS Scriptable**.
- Scriptable APIs used include `ListWidget`, `FileManager.local()`, `Request`, `DrawContext`, `Font`, `Color`, `DateFormatter`, `Alert`, etc.
- No server-side application or application database is part of the Motorsport Hub runtime.
- No user authentication is implemented.

### Build/test/tooling

**CONFIRMED.**

- GitHub + GitHub Actions.
- Node.js 22 for main Hardening / Release Candidate CI; Hero pipeline uses Node.js 20 in places.
- Test and build tooling is mainly `.mjs` plus some Python utilities.
- Build-time Hero subject detection installs, only inside CI:
  - `@tensorflow/tfjs-node@4.22.0`
  - `@tensorflow-models/coco-ssd@2.2.3`
- Image ML is **build-time only**. Do not move TensorFlow/COCO-SSD into Scriptable runtime without strong measured justification.
- No root `package.json` is present in the current tree; CI installs the build-time ML packages ad hoc.

### Runtime data/image services

**CONFIRMED from current modules.**

- F1: Jolpica/Ergast-compatible JSON:
  - `https://api.jolpi.ca/ergast/f1/2026.json?limit=100`
  - `https://api.jolpi.ca/ergast/f1/2026/driverstandings.json`
- WEC: FIA WEC manufacturers classification page.
- WRC: FIA WRC standings page.
- SUPER GT: official SUPER GT GT500 driver ranking.
- MotoGP: official MotoGP world standing page.
- FDJ: official Formula Drift Japan standings.
- D1GP: official D1GP 2026 ranking page.
- SUPER FORMULA: official SUPER FORMULA standings.
- INDYCAR: official INDYCAR standings.
- NASCAR: NASCAR public CDN points feed.
- GTWC Europe: official GT World Challenge Europe standings.
- Dakar: Dakar 2026 final CAR classification is currently used as the pre-start overall source for the 2027 module.
- Hero discovery/publication uses licensed **Wikimedia Commons** sources and GitHub raw assets on the separate `hero-live` branch.

No external analytics/crash service is currently used.

---

## 3. Directory structure and important files

Current important structure:

```text
motorsport-hub/
├─ .github/workflows/
│  ├─ hardening-ci.yml
│  ├─ release-candidate-ci.yml
│  ├─ release-readiness.yml
│  ├─ hero-discovery.yml
│  └─ other historical/pilot Hero workflows
├─ .release/
│  └─ stable publication evidence, e.g. v9.5.24-channel.md
├─ tests/
│  ├─ render-smoke-gate.mjs
│  ├─ stable-loader-v7-gate.mjs
│  ├─ router-hardening-gate.mjs
│  ├─ lifecycle-hardening-gate.mjs
│  ├─ cache-hardening-gate.mjs
│  ├─ integrity/release/category/Hero gates...
│  └─ fixtures/
├─ tools/
│  ├─ generate-release-package.mjs
│  ├─ prepare-main-release.mjs
│  ├─ commons-hero-discovery.mjs
│  ├─ detect-hero-subjects.mjs
│  ├─ build-hero-channel.mjs
│  ├─ build-large-hero-derivatives.mjs
│  ├─ validate-hero-channel-publish.mjs
│  └─ Hero/runtime helper scripts
├─ hero-pilot-policies/
├─ hero-pilot-manifests/
├─ hero-runtime-baselines/
├─ scriptable/
│  └─ Club Pulse files/tests — separate co-located product; do not modify while working Motorsport Hub unless explicitly required
├─ motorsport-hub.js                 # schema-5 direct Router
├─ scriptable-loader-v7.js           # canonical installed production loader
├─ release-channel.json              # mutable stable pointer to immutable runtime
├─ category-registry.json            # category/module/cache registry
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
├─ hero-assets.json
├─ hero-refresh-sources.json
├─ hero-selection-policy.json
├─ hero-rollout-policy.json
├─ ATTRIBUTION.md
├─ README.md
├─ COMPLETION_AUDIT.md               # current release/completion status
└─ HANDOFF.md                        # this file
```

Legacy loaders, reliability wrappers, older core/universal files remain in the repository for compatibility/history. They are **not** the current production path.

---

## 4. Implemented functionality

**CONFIRMED unless otherwise noted.**

### Routing / category runtime

- Router schema 5.
- Direct Router → exactly one selected category module.
- Explicit parameter aliases and invalid-parameter handling.
- No runtime source rewriting.
- All 12 categories + QA are marked `RELEASED` in `category-registry.json`; `planned` is empty.

Module mapping:

| Category | Runtime module | Cache key |
|---|---|---|
| F1 | `f1-widget-flat-v1000.js` | `f1-flat-v1000` |
| WEC | `wec-widget-flat-v1000.js` | `wec-flat-v1000` |
| WRC | `wrc-widget-flat-v1000.js` | `wrc-flat-v1000` |
| SUPER GT | `supergt-widget-flat-v1000.js` | `supergt-flat-v1003` |
| MotoGP | `motogp-widget-flat-v1000.js` | `motogp-flat-v1000` |
| FDJ | `fdj-widget-flat-v1000.js` | `fdj-flat-v1000` |
| D1GP | `d1gp-widget-flat-v1000.js` | `d1gp-flat-v1000` |
| SUPER FORMULA | `superformula-widget.js` | `superformula-v900` |
| INDYCAR | `indycar-widget.js` | `indycar-v910` |
| NASCAR | `nascar-widget.js` | `nascar-v920` |
| GTWC Europe | `gtwc-europe-widget.js` | `gtwceu-v930` |
| Dakar | `dakar-widget.js` | `dakar-v950` |
| QA | `motorsport-diagnostics-v890.js` | `diagnostics-v890` |

### Data resilience

- Local schema-1 category data caches across all 12 categories.
- Static SNAP fallback data in category modules.
- Lifecycle handling for upcoming / active / season-ended states.
- Cache validation and stale/corrupt cache rejection.
- Most category cache max-age values are 7 days; F1 is 72 hours.

### Widget UI

- Small / Medium / Large production layouts for all 12 categories.
- Large typography multiplier: `1.12`.
- Large shows Top 3 plus positions 4–5 under `MORE STANDINGS`.
- Large lower context block uses adaptive flex spacing / bottom-weighted composition.
- Dakar has rally-raid-specific hierarchy (stage, route, SS distance, CAR overall, GAP) rather than forcing generic circuit-racing semantics.

### Hero system

- Separate `hero-live` branch for Active Hero publication.
- Current fetched `hero-live` head at handoff preparation: `b81553a164c76620d69b94477f823bb777ff4af6`.
- CI-gated provenance/license validation.
- Wikimedia Commons candidate discovery.
- MIME/image dimension checks.
- Build-time subject detection.
- subject-aware Small/Medium crop candidates.
- 1600×1600 Large contained derivatives when Large-specific gates pass.
- Hero pool rotation and recent-display cooldown.
- local manifest/image cache, LKG and fail-closed behavior.
- fallback to embedded audited Hero when no valid active image is available.

### Release engineering

- Canonical installed loader: `scriptable-loader-v7.js`.
- Loader v7 does not execute mutable `main` directly.
- Stable descriptor validation includes monotonic sequence, rollback/fork rejection, GitHub source-commit verification, successful Release Candidate CI evidence, source/validation ancestry and metadata-only release ref, byte length and SHA-256 integrity.
- Release-namespaced local Router LKG.
- Immutable initial bootstrap recovery anchor remains v9.5.10.
- `tools/generate-release-package.mjs` generates immutable v6 validation artifacts/evidence.
- Current stable channel is v9.5.24 / sequence 5.

### Local observability

- Loader v7 writes `motorsport-hub-observability-v1.json` locally.
- Retains at most 200 events.
- Records release identity, category, widget family, Loader execution path, success/failure, elapsed time and normalized error code.
- No external telemetry transmission.
- Does not collect device ID, email, latitude/longitude or advertising ID.

### QA

- 36 deterministic render smoke cases = 12 categories × Small/Medium/Large.
- Deterministic gates for Router/registry/cache/lifecycle/integrity/release packaging/Loader/diagnostics/Hero/category-specific invariants.
- Hardening CI + Release Candidate CI.
- Physical-device verification remains required for renderer/layout/Hero/Loader changes.

---

## 5. Currently in progress and progress state

### Public RC decision documentation

**PENDING merge; implementation itself is docs-only.**

Working branch: `audit/v9.5.27-public-rc-decision`.

The branch contains a docs-only commit that updates `COMPLETION_AUDIT.md` to:

- mark the 36-case render gate PASS;
- record the physical-iPhone online/offline resilience check as PASS;
- accept local-only diagnostics as sufficient for a limited Public RC;
- defer centralized fleet telemetry to GA / broader public distribution;
- mark **Public Release Candidate: APPROVED** while explicitly withholding authorization for Store submission, paid distribution, external analytics contracts or broad public launch.

The device QA evidence is **USER-CONFIRMED**. It was reported via the user’s iPhone session; it is not independently machine-verifiable from GitHub.

This `HANDOFF.md` is being committed on the same branch. There is no active runtime implementation in progress.

---

## 6. Not implemented / future work in priority order

### P1 — immediate next-chat / RC workflow

1. Re-fetch `main`, the working branch, its PR, `release-channel.json`, and `hero-live`; do not trust stale SHA values from this file if GitHub moved.
2. Review the existing PR for `audit/v9.5.27-public-rc-decision` to `main`. The PR already exists; do not create a duplicate.
3. Confirm Hardening CI and Release Candidate CI for that PR are green after this HANDOFF commit.
4. Merge the docs/handoff PR **only with explicit user approval** if it is still open.
5. Do **not** advance `release-channel.json` merely to publish documentation. Stable stays v9.5.24 unless runtime/source changes justify a new stable release.
6. Do **not** begin broad public distribution automatically. Limited RC distribution is an external-impact action and requires explicit approval.

### P1 — RC field validation

- Observe concrete user/runtime failures, parser breakage, stale-cache behavior, LKG behavior and support friction.
- Build a support procedure for obtaining the local observability JSON from affected devices if needed.
- Fix only evidence-backed regressions; do not reopen general visual tuning by default.

### P2 — before GA / wider scale

- Decide whether centralized telemetry is required for aggregate crash-free rate, device/OS distribution and fleet-wide upstream/API failures.
- If centralized telemetry is chosen, perform explicit privacy/retention/service review and obtain approval before any external data transmission or contract/cost.
- Season rollover / fixture refresh automation, especially Dakar’s 2027 live-data path.
- Parser monitoring for upstream HTML/API changes.
- Historical documentation and stale hardening-specific workflow-condition cleanup.
- Performance/latency budgets if real-device evidence shows a problem.
- Optional richer deep-link/tap interactions.
- Hero upgrades only when a clearly superior policy-compliant asset passes existing gates.

---

## 7. Known bugs and technical issues

### Current blockers

**CONFIRMED: no known reproducible P0 launch/routing blocker.**

No runtime bug is currently reproduced on the Public-RC decision branch.

### Known technical risks / gaps

- External APIs and HTML pages can change without notice; parsers are a continuous reliability risk.
- Dakar’s module is season 2027 but currently uses the official 2026 final CAR classification as pre-start overall fallback and an embedded 2027 route/schedule. 2027 live standings/source rollover remains future maintenance.
- Centralized production telemetry is absent by design; population-level crash/success metrics cannot currently be observed.
- Several historical docs still describe the old `hardening/v9.3-codex-handoff`, old 24-case render smoke and pre-release state. Do not use them as current status.
- Some workflow code still contains historical branch-specific `hardening/v9.3-codex-handoff` push conditions. Scheduled/manual `hero-live` publication is the relevant current Hero path; clean up old branch-specific automation only after confirming it does not affect live Hero refresh.
- The current Public-RC approval commit on the work branch was created directly through the API and is unsigned. Runtime `main` merge `53360a34...` is GitHub-verified; the docs branch being unsigned is not a runtime-integrity claim.
- The final online/offline iPhone pass is **USER-CONFIRMED**, not independently observable in the repository.
- The GitHub connector cannot prove the state of any developer workstation working tree. Remote branch state is committed, but arbitrary local uncommitted files cannot be certified from this handoff.

---

## 8. Important design decisions and rationale

1. **Direct Router → one category module.** Chosen to avoid the old wrapper waterfall, serial network work, hidden fallbacks, source rewriting and unnecessary coupling.
2. **Mutable stable channel pointing to immutable source.** Users can follow explicitly approved releases without executing mutable `main`.
3. **Monotonic sequence + verified commit + RC evidence + hashes.** Protects against rollback/fork updates, stale mismatches and unvalidated executable source.
4. **Local LKG fallback.** Keeps the widget usable offline and isolates temporary source/network failures.
5. **Separate category modules.** Parsers, semantics and lifecycle differ materially between series; isolation is preferable to a giant monolithic renderer/runtime.
6. **Local-only observability for Public RC.** Improves supportability without adding an external privacy/retention/service dependency immediately before RC. Central telemetry is a GA decision.
7. **Hero ML at build time only.** Scriptable runtime remains lightweight and deterministic; image selection/cropping complexity lives in CI.
8. **Separate `hero-live` channel.** Hero imagery can refresh independently from runtime releases, while CI provenance/license/quality gates and LKG prevent unsafe visual updates.
9. **Shared Large visual contract across duplicated modules.** The repository does not currently have one shared Large renderer. Global Large changes must be applied consistently to all 12 modules and protected with deterministic gates instead of category-by-category hacks.
10. **Stable publication is a separate approval action.** A `main` merge or green CI does not itself publish executable stable code.

---

## 9. Rejected approaches / changes to avoid

- Do not reintroduce the historical multi-wrapper reliability waterfall.
- Do not restore Router-time source rewriting.
- Do not execute mutable `main` as the installed production code source.
- Do not weaken deterministic tests merely to obtain green CI.
- Do not use invented factual fallback data to hide parser failures.
- Do not collapse all categories into one giant file solely for deduplication.
- Do not move TensorFlow / COCO-SSD inference into Scriptable runtime.
- Do not manually retune every Hero or category layout without a concrete defect.
- Do not return to a 12-category manual screenshot loop unless a risk-based change specifically requires it.
- Do not alter Small/Medium while performing a Large-only pass unless required by a concrete cross-family defect.
- Do not touch the co-located Club Pulse implementation while working Motorsport Hub unless explicitly required.
- Do not use destructive resets/cleans against unknown local work.
- Do not merge, publish stable, distribute publicly, submit to a Store, start paid distribution or contract an external service without the appropriate explicit approval.

---

## 10. UI/UX policy

**Visual v1 is locked for the current RC path.**

Accepted layout principles:

- clear event identity at the top;
- countdown/venue readable at a glance;
- rankings hierarchy prioritizes Top 3;
- Large adds positions 4–5 as `MORE STANDINGS`;
- Large lower context block is anchored through adaptive flex spacing instead of leaving meaningless bottom dead space;
- Large typography is 1.12× the shared text sizes;
- intentional Hero breathing space is acceptable; accidental unused bottom space is not;
- long names/context should compress with existing line limits/minimum scale rather than overlap;
- Dakar uses `STAGE`/`GAP`/route semantics appropriate to rally raid;
- Hero image source relevance, provenance and legibility matter more than visual novelty.

Only evidence of regression or a materially better compliant source should reopen Visual v1.

---

## 11. DB / API / auth / environment configuration

### Database

**CONFIRMED: none.** Runtime persistence is local Scriptable files/images via `FileManager.local()`.

Important local files include:

- category data caches such as `motorsport-data-v1000-*.json`;
- Loader state `motorsport-hub-loader-v7-state.json`;
- local observability `motorsport-hub-observability-v1.json`;
- release-namespaced Router LKG files;
- Hero manifest/image caches and Hero LKG files;
- category-specific UI state where needed, e.g. Dakar.

### API/auth

**CONFIRMED.** Runtime sources currently use public HTTP(S) endpoints/pages. No user login/authentication layer is implemented.

### Environment variables/secrets

**CONFIRMED by current repository search:** no `.env`, `process.env`, `Authorization` or explicit `secrets.*` dependency was found for Motorsport Hub runtime/build configuration.

GitHub Actions relies on normal repository/workflow permissions for repository operations. No external service credential is part of the current product contract.

---

## 12. Exact first task for the next chat

Do this before changing code:

1. Fetch current `main` HEAD.
2. Fetch `audit/v9.5.27-public-rc-decision` HEAD.
3. Find the already-existing PR from that branch to `main` and inspect its current state/checks.
4. Fetch `release-channel.json` from `main` and confirm stable version/sequence/sourceRef.
5. Fetch `hero-live` HEAD.
6. Read `HANDOFF.md`, `COMPLETION_AUDIT.md`, `README.md`, `motorsport-hub.js`, `scriptable-loader-v7.js`.
7. If the PR is green, report the exact state. Merge only if the user explicitly authorizes it.
8. Do not perform stable publication or Public RC distribution unless separately authorized.

After the handoff/docs PR is resolved, the development focus should move to **RC field validation**, not another broad Hero/UI pass.

---

## 13. Branch / commit / work state at handoff

### Main

At handoff preparation, confirmed `main` HEAD:

`53360a34c123f2efdb66d58d399b20453985bef4`

Message: `Merge PR #37: local Loader v7 observability`.

This merge is GitHub-verified.

### Stable release

At handoff preparation:

- version: `9.5.24`
- sequence: `5`
- sourceRef: `bd677ba4ae20a95501cbc043b34a6ca1a1ca8c39`
- releaseId: `mh-bd677ba4ae20`
- validation ref: `3e4b2b64cd51a91c0a85e81a728f3be291b3de3c`
- Release Candidate workflow run: `34807835159`

### Active Hero

At handoff preparation, confirmed `hero-live` HEAD:

`b81553a164c76620d69b94477f823bb777ff4af6`

Because Hero refresh is automated, always re-fetch before making claims about the current asset/channel.

### Working branch

Branch:

`audit/v9.5.27-public-rc-decision`

Before adding this `HANDOFF.md`, the branch HEAD was:

`18791f1024642f73fd44e217c3d5ba5caed5379f`

That commit is docs-only and changes `COMPLETION_AUDIT.md` to Public RC approved. Adding this file advances the branch HEAD, so **the next chat must re-fetch the actual current HEAD rather than relying on `18791...`**.

An open PR for this branch already exists. Do not create a duplicate.

No runtime implementation is currently half-written on this branch. Remote changes are committed. Local workstation uncommitted state cannot be verified via the GitHub connector.

---

# Next-chat start prompt

Paste this at the start of the next chat:

> Motorsport Hubの開発を引き継いでください。Repositoryは `48wr9f4wgp-lab/motorsport-hub` です。まず会話履歴を前提にせず、GitHubの現在状態を確認してください。`HANDOFF.md` と `COMPLETION_AUDIT.md` を現行の引き継ぎ正本として読み、`main`、`audit/v9.5.27-public-rc-decision`、その既存PR、`release-channel.json`、`hero-live` の最新HEAD/状態を再取得してください。コードと文書が矛盾する場合は実コード/GitHub状態を優先してください。未確認を完成済みと言わず、変更後は可能な範囲で build/test/CI/実動作回帰を確認してください。まず現在地と次の最優先タスクを短く報告し、その後は合理的に判断できる範囲で確認を挟まず開発を継続してください。main merge、Stable publication、公開配布、Store申請、外部サービス契約・費用発生など外部影響のある操作は明示承認なしに実行しないでください。
