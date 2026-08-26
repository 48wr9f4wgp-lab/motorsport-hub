# Motorsport Hub — Release Candidate QA

## Current verdict
- Branch: `hardening/v9.3-codex-handoff`
- Codex-audited base: `a09d16e11aa0f65104ba895b74e09124d30b487b`
- Architecture: **12 categories + QA**, one direct category module per route.
- Legacy wrapper waterfall: **removed**.
- Router runtime source rewriting: **removed**.
- Cache schema: **1 for all 12 categories**.
- Deterministic Hardening CI: **PASS**.
- Automated render smoke: **24/24 PASS** = 12 categories × Small/Medium.
- Existing iPhone dependency diagnostic before Dakar: **11/11 LIVE — PASS**.
- Immutable Loader v6 online Candidate + fully-offline verified LKG: **iPhone PASS**.
- Dakar code/CI integration: **PASS**.
- Dakar live dependency + Small/Medium iPhone visual QA: **PENDING**.
- Codex final re-audit / Final Quality Pass: **PENDING**.
- Public release: **NOT authorized / NOT performed**.

**Current status: HARDENING CANDIDATE — 12-CATEGORY AUTOMATED GATES PASS / DAKAR TARGETED DEVICE QA + CODEX FINAL PASS PENDING**

---

## Latest 12-category automated evidence
Hardening CI latest Dakar integration run:
- Run: `#53`
- Run ID: `32960344219`
- Head: `f8ccb14b69adeb538a59f061425fe73bc2ee582d`
- Result: **SUCCESS**

The run includes:
- full JS/MJS syntax audit;
- release gate;
- boundary gate;
- Router hardening gate;
- Registry drift gate;
- cache hardening gate;
- Hero manifest exact-set gate;
- lifecycle gate;
- immutable integrity gate;
- immutable release-package generator gate;
- diagnostics Loader-path gate;
- **24-case Small/Medium render smoke**;
- original-seven flat-module gates;
- **Dakar dedicated gate**.

### Immutable 12-category artifact
Artifact:
- Name: `motorsport-hub-immutable-f8ccb14b69adeb538a59f061425fe73bc2ee582d`
- Artifact ID: `9603606992`
- Digest: `sha256:2928a4b750bb66c752b5e7dbb046ddca97907f784db3dff347065c32bd660a98`

Artifact content was inspected after CI:
- category manifest: `F1,WEC,WRC,SUPERGT,MOTOGP,FDJ,D1GP,SUPERFORMULA,INDYCAR,NASCAR,GTWCEU,DAKAR,QA`
- protected runtime files: **13** = 12 category modules + QA
- `dakar-widget.js` SHA-256: `4422b4ae4f6ebb3cb4e9bf0af1121833312b902985f9943dd417f8d1e007389a`
- `dakar-widget.js` bytes: `15704`

Therefore Dakar is included in immutable Loader v6 release integrity, not an unhashed side route.

---

## Current Router / runtime architecture
Current Router: `v9.5.0-hardening`.

Manifest:
`F1,WEC,WRC,SUPERGT,MOTOGP,FDJ,D1GP,SUPERFORMULA,INDYCAR,NASCAR,GTWCEU,DAKAR,QA`

Direct routes:
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

No current route uses the historical v8.9 reliability wrapper chain.

`hardening-live` receives only runtime files from a green Hardening CI commit. Dakar is present in its 12-category Registry.

---

## Dakar product contract
Dakar deliberately uses a rally-raid-specific information hierarchy rather than the circuit-racing `next race + PTS` template.

### Small
- DAKAR badge
- next stage
- countdown
- stage name
- date + special-stage distance
- route
- no standings

### Medium
- DAKAR badge
- next stage
- countdown
- stage name / route / SS distance
- **overall CAR TOP3**
- **GAP** column rather than PTS
- bib / machine / team secondary metadata

### 2027 lifecycle
- Prologue: 2027-01-01
- Stage 1: 2027-01-02
- Stage 13 / finish: 2027-01-15
- explicit half-open `[start,end)` stage windows
- final UI: `2027 FINISH` / `FINISH`, never a phantom next stage

Before 2027 Stage 1, Medium uses the official **2026 FINAL CAR** classification as the last completed overall reference:
1. Nasser Al-Attiyah — `—`
2. Nani Roma — `+9:42`
3. Mattias Ekström — `+14:33`

After completed 2027 stages, the module switches its overall source to the completed 2027 stage classification URL.

Dakar dedicated deterministic gate verifies parser fixture, cache envelope, pre-start overall, Small specialization, Prologue→Stage1 exact boundary, and finale behavior.

---

## Hero/legal status
Dakar current Hero:
- `Dacia Sandrider GIMS 2024 1X7A2026.jpg`
- Author: **Alexander-93**
- License: **CC BY-SA 4.0**
- original resolution: 5378 × 3588
- exact Commons page recorded in `hero-assets.json` / `ATTRIBUTION.md`

Hero manifest Gate enforces exact runtime/manifest URL-set equality across all 12 Registry modules.

The current Dakar Hero is legally verified and functionally acceptable as the initial asset. Dynamic higher-quality action imagery / auto-crop is intentionally deferred to the post-Codex Hero Rendering Engine rather than manually tuning every image update.

---

## Immutable Loader v6 device evidence — previous 11-category candidate
On 2026-08-26 the immutable Loader v6 architecture was verified on a real iPhone using fixed sourceRef `1f22919dc2a89053bff60f96b4c173ba6fb49076`.

Online:
- `11/11 LIVE — データ経路OK`
- `IMMUTABLE ✓ · CANDIDATE · 1f22919dc2a8`
- PASS

Fully offline, airplane mode + Wi-Fi off:
- `0/11 LIVE`
- external routes `NET`, expected
- `IMMUTABLE ✓ · LKG · 1f22919dc2a8`
- PASS

This proves fixed Router acquisition, integrity verification, LKG promotion, release namespace isolation, and verified offline LKG execution on Scriptable/iPhone. Dakar extends the same automated integrity descriptor and does not introduce a separate Loader architecture.

---

## Existing pixel-level visual locks
Current hardening visual locks already completed:
- F1 Small/Medium — PASS
- WRC Small/Medium — PASS
- MotoGP Small/Medium — PASS
- FDJ Small/Medium — PASS

Historical accepted visuals for SUPER FORMULA / INDYCAR / NASCAR remain baseline evidence.

Routine manual 12 × 2 regression is **retired**. See `DEVICE_QA_POLICY.md`.

Dakar is a new renderer/information hierarchy and therefore requires exactly one targeted Small + Medium real-device visual review before handoff to Codex.

---

## Remaining gates before Codex Final Quality Pass
1. iPhone `hardening-live` QA diagnostic should show **12/12 LIVE** including Dakar.
2. One Dakar Small + Medium visual screenshot review.
3. Correct any Dakar-only live parser or layout defect found by those checks.
4. Update final docs/current status.
5. Hand the complete 12-category branch to Codex for hostile re-audit, performance profiling, architecture review and overall quality polish.

Post-Codex visual automation remains specified in `POST_CODEX_VISUAL_AUTOMATION.md`:
- high-resolution Hero Asset Manager;
- subject-aware automatic crop;
- text-safe areas;
- automatic veil;
- image-quality rejection;
- LKG Hero;
- visual regression automation.

## RC decision
**NOT RELEASE APPROVED.**

The 12-category code line is automated-green, but Dakar targeted device QA and Codex Final Quality Pass are still required. Public release additionally requires explicit user approval.
