# Motorsport Hub — Release Audit

## Current decision
- Branch: `hardening/v9.3-codex-handoff`
- Original Codex-audited base: `a09d16e11aa0f65104ba895b74e09124d30b487b`
- Current scope: **12 categories + QA**.
- `main` has not been modified by this hardening line.
- Public release / Store action: **not performed**.

**Decision: NOT RELEASE APPROVED — 12-CATEGORY AUTOMATED GREEN / DAKAR TARGETED DEVICE QA + CODEX FINAL QUALITY PASS PENDING**

---

## Current architecture
Direct Router routes exactly one category module per selected category:
- F1, WEC, WRC, SUPER GT, MotoGP, FDJ, D1GP
- SUPER FORMULA, INDYCAR, NASCAR, GTWC Europe
- **Dakar Rally**
- QA

Current Router:
- no legacy v8.9 wrapper waterfall;
- no runtime source rewriting;
- explicit invalid-parameter error;
- schema/manifest handshake;
- optional immutable SHA-256 release integrity enforcement.

Manifest:
`F1,WEC,WRC,SUPERGT,MOTOGP,FDJ,D1GP,SUPERFORMULA,INDYCAR,NASCAR,GTWCEU,DAKAR,QA`

---

## Original audit finding status
| Finding | Current state |
| --- | --- |
| RC-01 stale Router/LKG misrouting | release-namespaced immutable Loader v6 candidate/LKG/quarantine; old mismatched Router not accepted; prior iPhone candidate/LKG PASS |
| RC-02 historical next-event display | explicit lifecycle / deterministic boundaries for current modules |
| RC-03 serial wrapper waterfall | **structurally removed** |
| RC-04 mutable/unverified release source | immutable SHA/bytes verification implemented, automated tamper tests PASS, previous real iPhone Candidate+LKG PASS; Codex hostile re-audit remains |
| RC-05 Hero inventory | exact runtime/manifest URL-set Gate PASS; Dakar added with exact Commons license record |
| RC-06 unsafe data cache | schema-1 cache across all 12 categories |
| RC-07 parser false positives | series-specific identity/parsing gates materially improved; Codex should re-attack current pages |
| RC-08 runtime source rewrite | **closed in current Router architecture** |
| RC-09/16 lifecycle/end-boundary inconsistency | half-open contracts; Dakar has dedicated stage boundary Gate |
| RC-10 invalid parameter → F1 | explicit fail path + alias tests |
| RC-11 docs drift | current RC/Handoff/Audit being synchronized to 12 categories |
| RC-12 duplicated category integration | Registry + CI-generated manifest/integrity packaging reduce integration drift; architectural consolidation still a Codex quality-review topic |
| RC-13 timezone compatibility | still suitable for Codex/device compatibility review |
| RC-14 preview exception edge | low-priority Codex review |
| RC-15 long/unknown metadata | risk-based visual/fixture review remains useful |

---

## Latest automated evidence
Hardening CI Dakar integration run:
- Run #53 / ID `32960344219`
- Head `f8ccb14b69adeb538a59f061425fe73bc2ee582d`
- **SUCCESS**

Global functional smoke:
- **24/24 PASS = 12 categories × Small/Medium**

Dakar dedicated Gate covers:
- CAR ranking parser fixture;
- schema-1 cache;
- pre-start `2026 FINAL` overall;
- Small next-stage-only hierarchy;
- Medium `総合 CAR / GAP` hierarchy;
- exact Prologue→Stage1 boundary;
- final Stage13 behavior.

CI only synchronizes runtime to `hardening-live` after all deterministic gates pass.

---

## Immutable 12-category packaging
Latest code-run artifact:
- `motorsport-hub-immutable-f8ccb14b69adeb538a59f061425fe73bc2ee582d`
- Artifact ID `9603606992`
- digest `sha256:2928a4b750bb66c752b5e7dbb046ddca97907f784db3dff347065c32bd660a98`

Inspected release manifest:
- includes `DAKAR`
- 13 integrity-protected runtime files = 12 categories + QA
- `dakar-widget.js` SHA-256 `4422b4ae4f6ebb3cb4e9bf0af1121833312b902985f9943dd417f8d1e007389a`
- bytes `15704`

Therefore Dakar is inside the same immutable release trust boundary as every other category.

Previous Loader v6 architecture was already verified on iPhone:
- online immutable Candidate — PASS
- fully offline verified LKG — PASS

Dakar does not create a separate Loader/fallback path.

---

## Dakar audit contract
Dakar uses a rally-raid-specific model instead of fake championship points.

### Small
- next stage / countdown
- stage name
- date + SS distance
- route

### Medium
- next stage / route / SS distance
- overall **CAR TOP3**
- **GAP** column
- bib / machine / team metadata

2027 encoded lifecycle:
- Prologue Jan 1
- Stage 1 Jan 2
- Stage 13 Jan 15
- half-open stage ranges
- finale `2027 FINISH / FINISH`.

Pre-start completed-overall baseline:
1. Nasser Al-Attiyah
2. Nani Roma +9:42
3. Mattias Ekström +14:33

After completed 2027 stages, source rolls to the completed 2027 stage CAR overall endpoint.

Hero:
- Dacia Sandrider GIMS 2024
- Alexander-93
- CC BY-SA 4.0
- exact source page / redistribution obligations recorded.

---

## Data/cache/legal status
All 12 Registry categories record `dataCacheSchema: 1`.

Hero runtime URLs are checked against `hero-assets.json` by exact set equality.

Current Dakar Hero is legally verified but is intentionally only the initial asset. Higher-quality action imagery and automatic framing are deferred to the post-Codex Hero Rendering Engine rather than manual recurring crop fixes.

---

## Device evidence
Previously passed on hardening direct-runtime:
- 11/11 dependency diagnostic before Dakar
- F1 Small/Medium
- WRC Small/Medium
- MotoGP Small/Medium
- FDJ Small/Medium
- immutable Loader v6 online Candidate
- immutable Loader v6 fully-offline verified LKG

Routine 24-widget manual QA is retired by `DEVICE_QA_POLICY.md`.

Because Dakar is new, remaining targeted checks are:
1. `hardening-live` dependency diagnostic → **12/12 LIVE**.
2. one Dakar Small + Medium visual review.

---

## Final blockers before RC approval
1. Dakar targeted iPhone live + visual checks.
2. Codex final hostile re-audit / performance / architecture / total-quality pass over all 12 categories.
3. Post-Codex fixes must return CI to green.
4. Final README / CHANGELOG synchronization.
5. Explicit user approval before any public release.

## Release decision
**NOT RELEASE APPROVED.**
