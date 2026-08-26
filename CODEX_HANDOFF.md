# Motorsport Hub — Codex Final Quality Pass Handoff

## Start here
- Repository: `48wr9f4wgp-lab/motorsport-hub`
- Branch: `hardening/v9.3-codex-handoff`
- Original Codex-audited base: `a09d16e11aa0f65104ba895b74e09124d30b487b`
- `main` has not been modified by this hardening line.
- Current product scope: **12 motorsport categories + QA**.
- Public release: **not performed / not authorized**.

**Current verdict: 12-CATEGORY HARDENING CANDIDATE — AUTOMATED GREEN / DAKAR TARGETED DEVICE QA + CODEX FINAL QUALITY PASS PENDING**

Read first:
1. `CODEX_HANDOFF.md`
2. `category-registry.json`
3. `RC_QA.md`
4. `RELEASE_AUDIT.md`
5. `DEVICE_QA_POLICY.md`
6. `POST_CODEX_VISUAL_AUTOMATION.md`

---

## Current direct-runtime architecture
Router `motorsport-hub.js`, schema 5.

Manifest:
`F1,WEC,WRC,SUPERGT,MOTOGP,FDJ,D1GP,SUPERFORMULA,INDYCAR,NASCAR,GTWCEU,DAKAR,QA`

Direct category modules:
- F1 → `f1-widget-flat-v1000.js`
- WEC → `wec-widget-flat-v1000.js`
- WRC → `wrc-widget-flat-v1000.js`
- SUPER GT → `supergt-widget-flat-v1000.js`
- MotoGP → `motogp-widget-flat-v1000.js`
- FDJ → `fdj-widget-flat-v1000.js`
- D1GP → `d1gp-widget-flat-v1000.js`
- SUPER FORMULA → `superformula-widget.js`
- INDYCAR → `indycar-widget.js`
- NASCAR → `nascar-widget.js`
- GTWC Europe → `gtwc-europe-widget.js`
- Dakar Rally → `dakar-widget.js`
- QA → `motorsport-diagnostics-v890.js`

No current route uses the historical v8.9 wrapper waterfall and Router no longer rewrites module source.

---

## Original Codex audit
Base `a09d16e...` verdict: FAIL.
- Critical 0
- High 5
- Medium 8
- Low 3

Original targets included stale Router fallback, season-final bugs, deep remote wrapper waterfall, mutable remote code, Hero attribution gaps, unsafe caches, parser fragility, runtime source patches and silent invalid-parameter fallback.

Re-audit current reachable code rather than assuming historical findings still reproduce.

---

## Structurally resolved / materially changed areas
### Wrapper waterfall
Removed from current Router; direct per-category modules are enforced by CI.

### Runtime source rewriting
Removed. Category lifecycle is module-owned.

### Cache integrity
All 12 Registry categories use cache schema 1 with schema/category/season/fetchedAt/source/ranking/event/data validation and invalid/stale rejection.

### Lifecycle
All categories have explicit stage/race lifecycle and half-open `[start,end)` active windows. Finale does not produce a historical phantom next event.

### Parameter routing
Unknown parameter fails explicitly; full-name aliases are machine-tested.

### Hero inventory
`hero-assets.json` represents runtime-reachable Wikimedia Hero URLs and exact set equality is CI-enforced.

---

## Immutable release / RC-04 hardening
Tool: `tools/generate-release-package.mjs`.

Generated descriptor pins:
- immutable 40-character commit SHA;
- Router byte count + SHA-256;
- every category module + QA byte count + SHA-256;
- Router schema and exact category manifest;
- release namespace.

Loader v6:
- fixed release never fetches mutable `main`;
- verifies Router syntax/markers/bytes/SHA-256;
- Router verifies selected module bytes/SHA-256;
- candidate/LKG/quarantine are release-namespaced;
- corrupt/tampered/sourceRef mismatch fails closed;
- offline path executes only verified immutable LKG.

Real-device Scriptable proof already completed on the 11-category predecessor using sourceRef `1f22919dc2a89053bff60f96b4c173ba6fb49076`:
- online `IMMUTABLE ✓ · CANDIDATE · 1f22919dc2a8` — PASS
- fully offline `IMMUTABLE ✓ · LKG · 1f22919dc2a8` — PASS

The Dakar route uses exactly the same Registry-derived integrity packaging; no special unverified Loader path was introduced.

Latest 12-category immutable artifact:
- Hardening CI run #53 / ID `32960344219`
- head `f8ccb14b69adeb538a59f061425fe73bc2ee582d`
- SUCCESS
- artifact ID `9603606992`
- digest `sha256:2928a4b750bb66c752b5e7dbb046ddca97907f784db3dff347065c32bd660a98`
- manifest includes `DAKAR`
- 13 protected runtime files = 12 categories + QA
- Dakar SHA-256 `4422b4ae4f6ebb3cb4e9bf0af1121833312b902985f9943dd417f8d1e007389a`, 15704 bytes.

Codex should attack-test this implementation instead of replacing it without evidence. Focus on encoding/hash correctness, immutable ref propagation, cache isolation, downgrade semantics, candidate/LKG/quarantine and any bypass to mutable code.

---

## Dakar — 12th category
Module: `dakar-widget.js`, v9.5.0-hardening.

Product hierarchy is deliberately rally-raid specific.

Small:
- next stage
- countdown
- stage name
- date + special distance
- route

Medium:
- next stage + route + special distance
- **overall CAR TOP3**
- **GAP** rather than PTS
- bib / machine / team metadata

2027 lifecycle:
- Prologue Jan 1
- Stage 1 Jan 2
- Stage 13 Jan 15
- stage ranges are all-day until official exact start times are published
- finale is `2027 FINISH / FINISH`.

Before Stage 1, Medium uses the last completed official 2026 final CAR classification:
1. Nasser Al-Attiyah
2. Nani Roma +9:42
3. Mattias Ekström +14:33

After completed 2027 stages, the overall source moves to the completed 2027 stage CAR classification endpoint.

Hero:
- Dacia Sandrider GIMS 2024
- Alexander-93
- CC BY-SA 4.0
- exact Commons source recorded.

Dakar automated coverage includes:
- Router/alias
- parser fixture
- cache schema
- Prologue→Stage1 exact boundary
- Stage13 finale
- specialized Small/Medium surface
- Hero inventory
- immutable release descriptor inclusion
- global 24-case render smoke.

Targeted real-device checks still required before Codex starts:
- `hardening-live` QA → 12/12 LIVE
- one Dakar Small + Medium screenshot.

---

## Current CI
Workflow `.github/workflows/hardening-ci.yml`.

Latest 12-category code run #53 is green.
CI runs full syntax plus deterministic release/boundary/router/registry/cache/Hero/lifecycle/integrity/package/diagnostic/render gates, original-seven flat gates and Dakar dedicated gate.

Global render smoke is now **24 cases = 12 categories × Small/Medium**.

Only after every gate passes does CI:
1. generate immutable Loader v6 + release-integrity artifact;
2. sync tested runtime to `hardening-live`.

Routine 24-widget manual regression is retired.

---

## Existing iPhone evidence
Current direct-runtime visual locks:
- F1 Small/Medium PASS
- WRC Small/Medium PASS
- MotoGP Small/Medium PASS
- FDJ Small/Medium PASS

Historical accepted SUPER FORMULA / INDYCAR / NASCAR visuals remain useful baselines.

Dakar is a new information hierarchy, so it gets one targeted Small+Medium check only.

---

## Codex Final Quality Pass — requested role
Once Dakar targeted device QA passes, Codex should treat the 12-category product as one release candidate system.

### Phase 1 — hostile final re-audit
- compare audited base → current branch;
- re-evaluate RC-01 through RC-16 on reachable code;
- attack immutable release/downgrade/cache behavior;
- stress parser false positives, lifecycle boundaries, corrupted caches and simultaneous Widget refreshes.

### Phase 2 — performance / architecture
- profile Scriptable startup/network/memory;
- identify useful shared runtime extraction without reintroducing fragile wrappers;
- reduce request/CPU/image cost;
- improve failure isolation/observability.

### Phase 3 — total product polish
Review all 12 categories for premium quality:
- information hierarchy consistency;
- typography/spacing/readability;
- long-name resilience;
- data freshness semantics;
- accessibility;
- series-specific UI where it improves comprehension.

### Phase 4 — Hero Rendering Engine
Follow `POST_CODEX_VISUAL_AUTOMATION.md`, not manual crop tuning:
- high-resolution Hero Asset Manager;
- automatic subject-aware Small/Medium crop;
- text-safe-area reservation;
- automatic veil;
- image-quality rejection;
- LKG Hero fallback;
- visual regression automation.

Goal: Hero updates require no manual crop correction.

---

## Merge / release rules
- Never overwrite `main` wholesale.
- Keep fixes on hardening branch until green and reviewed.
- Require CI green after Codex changes.
- Public release/tag/Store action requires explicit user approval.

## Immediate remaining pre-Codex checks
1. iPhone QA diagnostic → **12/12 LIVE**.
2. Dakar Small + Medium screenshot → targeted visual review.
3. Fix only defects found there.
4. Then begin Codex Final Quality Pass.
