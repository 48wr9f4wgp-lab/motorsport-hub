# Motorsport Hub — Final GA Launch Checklist

Updated: 2026-09-26 JST

Use this checklist only when preparing the actual broad public General Availability release. Completing repository work does not itself authorize public launch.

## A. Distribution/legal

- [x] Software license explicitly approved by owner: **MPL-2.0**.
- [x] Club Pulse destination repository populated and verified before Motorsport Hub split/removal merge; see `CLUB_PULSE_MIGRATION.md`.
- [x] Root `LICENSE` and `LICENSE_SCOPE.md` prepared for product-pure Motorsport Hub.
- [x] Current `hero-live/hero-channel/ATTRIBUTION.md` exists and validates against the current live Hero pool at `57e0c7019b681239deba81627eddba6b6c622acf` (12 assets). Recheck if the pool changes.
- [x] Public install path distinguishes software-license terms from third-party Hero attribution.
- [x] No claim of endorsement by image creators/licensors.

## B. Exact release identity

- [ ] Exact Stable version, sequence and sourceRef chosen for GA.
- [ ] Release Candidate CI for that source is green.
- [ ] Stable descriptor hashes/byte lengths validated.
- [x] Dakar season-aware rollover hardening is already included in Stable v9.5.31 (shipped in v9.5.30). Actual 2027 live parser behavior remains unverified.
- [ ] Resolve/reverify Hero refresh and Dakar upstream failures recorded in `COMPLETION_AUDIT.md`.

## C. Physical iPhone smoke

Run on the exact Stable intended for distribution:

- [ ] canonical Loader v7 fresh-install/copy path;
- [ ] QA diagnostics healthy;
- [ ] one Small widget;
- [ ] one Medium widget;
- [ ] one Large widget;
- [ ] online refresh;
- [ ] LKG/offline recovery if the GA Stable changes runtime/Loader-sensitive behavior;
- [ ] no visible startup, routing or clipping blocker.

Record physical-device evidence as user-confirmed evidence; do not represent it as GitHub-verifiable automation.

## D. Public support surface

- [x] `INSTALL.md` current.
- [x] `SUPPORT.md` current.
- [x] `PRIVACY.md` current.
- [x] GitHub bug-report template active.
- [x] Public README names the current Stable.
- [ ] Optional observability export is not advertised as mandatory until its iPhone Share Sheet interaction has been physically exercised.

## E. Final authorization

- [ ] Owner explicitly authorizes broad GA/public distribution and names the intended distribution channel.
- [ ] Any Store submission, paid distribution, external analytics, paid hosting/service contract or marketing launch receives separate approval if applicable.

## Current state

Motorsport Hub is technically a GA-capable candidate. The MPL-2.0/software-license decision is complete. **Broad GA is not authorized.**

Club Pulse cutover and live attribution proof are complete. Remaining work: operational failure resolution/reverification, exact-Stable physical iPhone smoke, and explicit GA authorization. The historical SUPER GT Small PASS does not complete the representative GA session.
