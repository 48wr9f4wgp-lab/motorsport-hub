# Motorsport Hub — Release Audit

Updated: 2026-08-28 JST

## Current decision
- Branch: `hardening/v9.3-codex-handoff`
- Main baseline: `a09d16e11aa0f65104ba895b74e09124d30b487b`
- Current verified hardening line: 12 categories + QA.
- `main` remains unchanged by this hardening line.
- Public release / Store action: not performed.

**Decision: NOT RELEASE APPROVED — AUTOMATED HARDENING + RELEASE-TRANSFORM DRY-RUN GREEN / CODEX FINAL AUDIT + FINAL CURRENT-PACKAGE DEVICE CHECK PENDING**

---

## Architecture state
The current Router selects exactly one direct category module:
- F1
- WEC
- WRC
- SUPER GT
- MotoGP
- FDJ
- D1GP
- SUPER FORMULA
- INDYCAR
- NASCAR Cup
- GTWC Europe
- Dakar Rally
- QA diagnostics

Current architecture properties:
- no historical v8.9 wrapper waterfall;
- no runtime source rewriting;
- explicit invalid-parameter failure;
- schema/manifest handshake;
- optional immutable SHA-256 / byte-length release integrity enforcement;
- schema-1 category data cache across all 12 categories;
- green runtime files are the only files synchronized to `hardening-live`.

Manifest:
`F1,WEC,WRC,SUPERGT,MOTOGP,FDJ,D1GP,SUPERFORMULA,INDYCAR,NASCAR,GTWCEU,DAKAR,QA`

---

## Original hardening finding status
| Finding | Current state |
| --- | --- |
| RC-01 stale Router / LKG misrouting | immutable release-namespaced Loader + current hardening source-path regression gate; stale main fallback found on device and corrected |
| RC-02 historical next-event display | explicit lifecycle and deterministic boundaries in current modules |
| RC-03 serial wrapper waterfall | **closed structurally** |
| RC-04 mutable/unverified release source | SHA-256 + byte-length immutable package, Candidate/LKG architecture, tamper gates; final current-package device repetition still pending |
| RC-05 Hero inventory/provenance | exact runtime/manifest gate + author/license/source metadata; expanded build-time selection tooling |
| RC-06 unsafe data cache | schema-1 cache across all 12 categories |
| RC-07 parser false positives | category-specific identity/parsing gates materially improved; Codex should still attack live-source failure modes |
| RC-08 runtime source rewrite | **closed** |
| RC-09/16 lifecycle/end-boundary inconsistency | explicit lifecycle contracts; Dakar stage boundaries separately gated |
| RC-10 invalid parameter → F1 | explicit configuration error + aliases tested |
| RC-11 docs drift | RC / Audit being synchronized in this finalization pass |
| RC-12 duplicated integration drift | Registry, direct modules, immutable package and rollout inventory reduce drift; Codex architecture review still required |
| RC-13 timezone compatibility | remains in final Codex/device compatibility scope |
| RC-14 preview exception edge | remains low-priority final Codex review scope |
| RC-15 long/unknown metadata | automated render smoke + risk-based device review; final audit should still attack pathological strings |

---

## Latest automated evidence
### Hardening CI
- Run #180
- Run ID `33159393582`
- Head `596794c7cd1dd28af026c420c6ac6a4f9f063442`
- Result: **SUCCESS**
- Global render smoke: **24/24 PASS**

### Release Readiness
- Run #1
- Run ID `33159393670`
- Same head: `596794c7cd1dd28af026c420c6ac6a4f9f063442`
- Result: **SUCCESS**
- Repository permission: **read-only**
- Final main transformation is tested in dry-run and working-tree mutation is forbidden in this workflow.

### Immutable package
- Artifact: `motorsport-hub-immutable-33159393582`
- Artifact ID: `9680972571`
- Digest: `sha256:a2bcc498869dff20e76bd342147c5a8f1e0a0dde9e26e017a540be148b672ad0`
- Source/head: `596794c7cd1dd28af026c420c6ac6a4f9f063442`

---

## Release-source safety
Hardening direct-device Router intentionally defaults to `hardening-live`, not `main`. This was introduced after a real-device defect showed that an outer hardening loader could still end up executing a stale `main` category module.

Therefore the current hardening Router **must never be merged to main unchanged**.

`tools/prepare-main-release.mjs` provides the only intended final transform:
- Router default `hardening-live` → `main`;
- all category + QA registry statuses → final release state.

The transform is currently exercised only in dry-run by `tests/main-release-readiness-gate.mjs` and `.github/workflows/release-readiness.yml`.

Normal CI does not run write mode. Final write mode is intentionally restricted to explicit `--write --status=RELEASED` execution after user approval.

---

## Hero / visual hardening status
The hardening line now contains a build-time Hero Selection/QA foundation rather than recurring manual-only image tuning:
- provenance and license catalog;
- candidate discovery;
- HTTP/MIME/real-dimension validation;
- subject detection and role scoring;
- text-safe / veil-aware checks;
- balanced horizontal-vehicle Small crop;
- MotoGP rider fallback;
- Dakar environment/LKG fallback;
- Small/Medium derived preview artifacts;
- visual regression baselines;
- runtime fixed approved crop metadata;
- asset-aware cache invalidation where required.

Notable corrected runtime assets:
- F1 action set for Ferrari / McLaren / Mercedes;
- WRC high-resolution Ogier fallback;
- SUPER GT real 2024 Fuji MOTUL action Hero rather than showroom imagery;
- D1GP actual D1 Grand Prix Hero rather than King of Europe imagery.

A separate read-only Locked Hero Audit reviewed SUPER FORMULA, INDYCAR, NASCAR and GTWC Europe. No runtime mutation was justified.

---

## Real-device evidence and incident closure
Physical iPhone evidence currently includes:
- Dakar Tap Action/persistence and current visual path — PASS;
- D1GP Small+Medium — PASS;
- FDJ Small+Medium — PASS;
- SUPER GT current MOTUL Hero — PASS after end-to-end investigation;
- prior F1/WRC/MotoGP and older locked-category visual evidence;
- previous immutable Loader v6 Candidate + fully-offline LKG PASS on the 11-category package.

The SUPER GT incident exposed several independent freshness layers:
1. Hero image cache;
2. category module cache;
3. Router source default;
4. Scriptable common loader source;
5. iOS Widget snapshot cache.

The runtime path was corrected, the Router now has a dedicated hardening source gate, SUPER GT has a bumped module cache key, and the user ultimately observed the current red MOTUL Action Hero on-device.

The only deliberately retained device blocker is a **single consolidated verification of the final 12-category immutable package after Codex fixes**, including online Candidate and fully-offline verified LKG.

---

## Remaining release blockers
1. Codex final hostile audit over the exact current branch and release-finalizer contract.
2. Any resulting fixes must return Hardening CI + Release Readiness to green.
3. Generate the exact final immutable package.
4. Perform one consolidated iPhone Candidate / 12-category routing / offline LKG verification against that package.
5. Synchronize final docs/changelog after the final tested SHA is known.
6. Obtain explicit user approval.
7. Only then run the main finalizer, re-run final tests on the transformed release commit, and merge to `main`.

## Release decision
**NOT RELEASE APPROVED.**

No current blocker justifies more per-category manual screenshot work before Codex. The next quality gate is the final hostile code/architecture audit, followed by one final exact-package device session and explicit merge approval.
