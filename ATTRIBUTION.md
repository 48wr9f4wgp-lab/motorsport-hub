# Motorsport Hub — Hero Image Attribution

Last audited: 2026-08-26 JST
Scope: current v9.5.0 hardening build / 12 category hero assets used by the Scriptable widget.

All hero images are cropped/resized and darkened for widget presentation. Where the source license requires attribution or ShareAlike, redistribution must preserve those obligations. The machine-readable runtime inventory is `hero-assets.json` and is enforced by `tests/hero-manifest-gate.mjs`.

## Formula 1 (F1)
- Primary: **Andrea Kimi Antonelli 2025 Italian Grand Prix FP3.jpg** — Author **Eustace Bagge** — **CC BY 4.0 International**.
- Additional current manufacturer fallbacks: 2025 Japan GP Mercedes W16 / Ferrari SF-25 / McLaren MCL39 — Author **Liauzh** — **CC BY-SA 4.0 International**.
- Primary file page: https://commons.wikimedia.org/wiki/File:Andrea_Kimi_Antonelli_2025_Italian_Grand_Prix_FP3.jpg

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

## Dakar Rally
- **Dacia Sandrider GIMS 2024 1X7A2026.jpg**.
- Depiction: Dacia Sandrider, current-generation Ultimate T1+ rally-raid car model.
- Source: Wikimedia Commons.
- Author: **Alexander-93**.
- License: **CC BY-SA 4.0 International**.
- Original resolution: 5,378 × 3,588.
- File page: https://commons.wikimedia.org/wiki/File:Dacia_Sandrider_GIMS_2024_1X7A2026.jpg
- Public redistribution requirement: credit Alexander-93, link CC BY-SA 4.0, indicate crop/resize/darkening, and preserve applicable ShareAlike obligations.

## Audit decision
- All runtime hero URLs reachable from the current 12-category Registry must have an exact `hero-assets.json` record.
- Runtime/manifest set equality is enforced automatically.
- Former SUPER GT public-distribution blocker remains closed.
- Dakar v9.5.0 hero licensing: **PASS**.
- Licensing/attribution audit: **PASS for the current 12-category hardening build**.
