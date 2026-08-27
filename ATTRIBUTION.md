# Motorsport Hub — Hero Image Attribution

Last audited: 2026-08-27 JST
Scope: current v10.0.2 hardening build / 12 category hero assets used by the Scriptable widget.

All hero images are cropped/resized and darkened for widget presentation. Where the source license requires attribution or ShareAlike, redistribution must preserve those obligations. The machine-readable runtime inventory is `hero-assets.json` and is enforced by `tests/hero-manifest-gate.mjs`.

## Formula 1 (F1)
- Current Action Hero set: **Lewis Hamilton / Ferrari SF-25 FP1**, **Oscar Piastri / McLaren MCL39 FP1**, and **George Russell / Mercedes W16 FP3** from the 2025 Japanese Grand Prix.
- Author: **Liauzh**.
- License: **CC BY-SA 4.0 International** for all three current runtime assets.
- Runtime treatment: subject-aware crop, resize, and darkening; modification notice and ShareAlike obligations remain applicable.
- File pages:
  - https://commons.wikimedia.org/wiki/File:2025_Japan_GP_-_Ferrari_-_Lewis_Hamilton_-_FP1.jpg
  - https://commons.wikimedia.org/wiki/File:2025_Japan_GP_-_McLaren_-_Oscar_Piastri_-_FP1.jpg
  - https://commons.wikimedia.org/wiki/File:2025_Japan_GP_-_Mercedes_-_George_Russell_-_FP3.jpg

## FIA World Rally Championship (WRC)
- **2025 Toyota GR Yaris Rally 1 Katsuta.jpg** and Ogier fallback.
- Author: **TTTNIS**.
- License: **CC0 1.0 Universal**.
- File page: https://commons.wikimedia.org/wiki/File:2025_Toyota_GR_Yaris_Rally_1_Katsuta.jpg

## MotoGP
- Aprilia Bezzecchi and Ducati Bagnaia 2025 Malaysian GP runtime assets.
- Author: **Liauzh**.
- License: **CC BY-SA 4.0 International**.
- Primary file page: https://commons.wikimedia.org/wiki/File:MotoGP_2025_Malaysian_Grand_Prix_-_Aprilia_Racing_-_Marco_Bezzecchi.jpg

## FIA World Endurance Championship (WEC)
- Toyota No.7 / No.8 Spa 2024 runtime assets.
- Author: **MarcelX42**.
- License: **CC BY-SA 4.0 International**.
- Primary file page: https://commons.wikimedia.org/wiki/File:2024_6_Hours_of_Spa-Francorchamps_Toyota_Gazoo_Racing_Toyota_GR010_Hybrid_No.7_(DSC04523).jpg

## Formula Drift Japan (FDJ)
- **DRIFT-0ae1a2ba-2d7b-4d51-b082-b698f2fbb2f1.jpg**.
- Source: Wikimedia Commons / Pixabay.
- License: **CC0 1.0 Universal**.
- File page: https://commons.wikimedia.org/wiki/File:DRIFT-0ae1a2ba-2d7b-4d51-b082-b698f2fbb2f1.jpg

## D1 GRAND PRIX (D1GP)
- **King of Europe Round 3 Lydden Hill 2014 (14356011899).jpg**.
- Author: **Rowan Harrison**.
- License: **CC BY-SA 2.0 Generic**.
- File page: https://commons.wikimedia.org/wiki/File:King_of_Europe_Round_3_Lydden_Hill_2014_(14356011899).jpg

## SUPER GT
- **Osaka Auto Messe 2025 (1) - No.36 au TOM'S GR Supra in 2024 SUPER GT.jpg**.
- Author: **Tokumeigakarinoaoshima**.
- License: **CC0 1.0 Universal**.
- File page: https://commons.wikimedia.org/wiki/File:Osaka_Auto_Messe_2025_(1)_-_No.36_au_TOM%27S_GR_Supra_in_2024_SUPER_GT.jpg
- Current direct runtime exposes no unverified historical SUPER GT fallback.

## SUPER FORMULA
- **Igor Fraga Super Formula Round 5 Suzuka Post-Race 2026.jpg**.
- Author: **BWard 1997**.
- License: **CC BY 4.0 International**.
- File page: https://commons.wikimedia.org/wiki/File:Igor_Fraga_Super_Formula_Round_5_Suzuka_Post-Race_2026.jpg

## INDYCAR
- **Alex Palou (54686833932).jpg**.
- Author: **Ben Goyette**.
- License: **CC BY-SA 4.0 International**.
- File page: https://commons.wikimedia.org/wiki/File:Alex_Palou_(54686833932).jpg

## NASCAR Cup Series
- **Denny Hamlin 11 Las Vegas 2025.jpg**.
- Author: **TaurusEmerald**.
- License: **CC BY-SA 4.0 International**.
- File page: https://commons.wikimedia.org/wiki/File:Denny_Hamlin_11_Las_Vegas_2025.jpg

## GT World Challenge Europe
- **GT World Challenge Europe 2024 Nürburg Nr. 48 Auer, Engel, Morad (1).jpg**.
- Author: **Lukas Raich**.
- License: **CC BY-SA 4.0 International**.
- File page: https://commons.wikimedia.org/wiki/File:GT_World_Challenge_Europe_2024_N%C3%BCrburg_Nr._48_Auer,_Engel,_Morad_(1).jpg

## Dakar Rally — Tap Action v2.1
The widget cycles three visually distinct Hero photos: one current Dacia Sandrider design reference plus two real Dakar action frames.

### Hero 1 — current car identity
- **Dacia Sandrider GIMS 2024 1X7A2026.jpg**.
- Author: **Alexander-93**.
- License: **CC BY-SA 4.0 International** — exact file page verified.
- Original resolution: 5,378 × 3,588.
- File page: https://commons.wikimedia.org/wiki/File:Dacia_Sandrider_GIMS_2024_1X7A2026.jpg

### Hero 2 — action
- **Dakar Rally 2021 - Stage 05 (50810898083).jpg**.
- Commons author: **EKSRX**; source metadata credits **Eric Vargiolu / DPPI**.
- License: **CC BY 2.0 Generic** — exact Commons file page verified; Flickr license review recorded by Commons.
- Original resolution: 4,800 × 3,194.
- File page: https://commons.wikimedia.org/wiki/File:Dakar_Rally_2021_-_Stage_05_(50810898083).jpg

### Hero 3 — action / environmental variation
- **Dakar Rally 2021 - Stage 10 (50832314671).jpg**.
- Commons author: **EKSRX**; source metadata credits **Antonin Vincent / DPPI**.
- License: **CC BY 2.0 Generic** — exact Commons file page verified; Flickr license review recorded by Commons.
- Original resolution: 4,800 × 3,200.
- File page: https://commons.wikimedia.org/wiki/File:Dakar_Rally_2021_-_Stage_10_(50832314671).jpg

All three widget variants are cropped/resized and darkened for presentation. Attribution and modification notice obligations remain applicable where required.

## Audit decision
- All runtime hero URLs reachable from the current 12-category Registry have a `hero-assets.json` record and runtime/manifest set equality is enforced automatically.
- Former SUPER GT public-distribution blocker remains closed.
- Dakar Tap Action v2.1 runtime inventory: **PASS**.
- Dakar Hero 1/2/3 exact-page license metadata verification: **PASS**.
- Dakar Tap Action v2.1 device visual confirmation: **PENDING**.
- Public release remains blocked by the overall Release/QA process; the selected Dakar Hero records no longer carry a pending exact-page-license check.
