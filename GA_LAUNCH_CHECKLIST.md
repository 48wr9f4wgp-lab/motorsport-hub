# Motorsport Hub — Final GA Launch Checklist

Updated: 2026-09-27 JST

Use this checklist only when preparing the actual broad public General Availability release. Stable publication does not itself authorize broad GA.

## A. Distribution/legal

- [x] Software license explicitly approved by owner: **MPL-2.0**.
- [x] Club Pulse destination repository populated and verified before Motorsport Hub split/removal; see `CLUB_PULSE_MIGRATION.md`.
- [x] Root `LICENSE` and `LICENSE_SCOPE.md` prepared for product-pure Motorsport Hub.
- [x] Current `hero-live/hero-channel/ATTRIBUTION.md` revalidated at head `7bd8e3e4fcf616b90fbded4911ac0ec8000ad225` on 2026-09-27 JST; `channel.json` / attribution generation timestamp matches and the live attribution surface reports 12 credited pool assets. Recheck only if `hero-live` changes before GA.
- [x] Public install path distinguishes software-license terms from third-party Hero attribution.
- [x] No claim of endorsement by image creators/licensors.

## B. Exact release identity

- [ ] Exact final GA Stable remains provisional until the **v9.5.34 representative GA smoke** passes.
- [x] Stable v9.5.34 source selected: `edff3d301033ada18134429fb6f4c9016c6653f6`.
- [x] v9.5.34 Release Candidate CI: **#299 / 36285958234 SUCCESS**.
- [x] Descriptor hashes/byte lengths taken from immutable RC artifact `motorsport-hub-release-45eb720a53438e2dbcd6e01be7529a90f4bea275`.
- [x] Stable v9.5.33 Dakar fresh-data physical iPhone verification: **PASS**.
- [x] Dakar 2027 viewing rights remain fail-closed / hidden while `UNVERIFIED`.
- [x] Production Hero refresh recovered: Hero Active Refresh #124 SUCCESS; Public Attribution #47 SUCCESS.

## C. Physical iPhone smoke

Run on the exact Stable intended for distribution:

- [ ] canonical Loader v7 fresh-install/copy path;
- [x] QA diagnostics healthy — physical iPhone `12/12 LIVE — データ経路OK`, exact Stable source prefix `edff3d301033`;
- [x] one Small widget;
- [x] one Medium widget with expected verified viewing label;
- [x] one Large widget with expected verified viewing label;
- [x] Small viewing-label omission confirmed;
- [x] Dakar viewing-label omission confirmed while UNVERIFIED;
- [x] no header crowding/truncation/alignment/overflow regression;
- [x] online refresh — all 12 category routes reported `LIVE` in physical QA;
- [x] LKG/offline recovery — physical iPhone airplane-mode test rendered SUPER GT Medium from cached/LKG data with explicit `更新待ち`, verified viewing label preserved, standings/Hero/layout intact;
- [x] no visible startup, routing or clipping blocker in the validated QA + Small/Medium/Large representative surfaces.

Record physical-device evidence as user-confirmed evidence; do not represent it as GitHub-verifiable automation.

## D. Public support surface

- [x] `INSTALL.md` current.
- [x] `SUPPORT.md` current.
- [x] `PRIVACY.md` current.
- [x] GitHub bug-report template active.
- [x] Public README names the current Stable.
- [ ] Optional observability export is not advertised as mandatory until its iPhone Share Sheet interaction has been physically exercised.

## E. Final authorization

- [ ] Owner explicitly authorizes broad GA/public distribution for the exact validated Stable and names the intended distribution channel/action.
- [ ] Any Store submission, paid distribution, external analytics, paid hosting/service contract or marketing launch receives separate approval if applicable.

## Current state

Motorsport Hub is technically a GA-capable candidate. Stable v9.5.34 is validated and its JP viewing-label UI has physical iPhone PASS. Broad GA remains blocked until that exact-Stable smoke, current Hero-credit revalidation and scoped GA authorization are complete.
