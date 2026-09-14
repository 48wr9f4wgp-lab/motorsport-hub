# Motorsport Hub — Final GA Launch Checklist

Updated: 2026-09-14 JST

Use this checklist only when preparing the actual broad public General Availability release. Completing repository work does not itself authorize public launch.

## A. Distribution/legal

- [ ] Software license explicitly approved by owner.
- [ ] Repository scope is clean enough that the license does not unintentionally cover Club Pulse.
- [ ] Root/product license file added only after that approval.
- [ ] Current `hero-live/hero-channel/ATTRIBUTION.md` exists and validates against the current live Hero pool.
- [ ] Public install path links to both software-license terms and Hero attribution.
- [ ] No claim of endorsement by image creators/licensors.

## B. Exact release identity

- [ ] Exact Stable version, sequence and sourceRef chosen for GA.
- [ ] Release Candidate CI for that source is green.
- [ ] Stable descriptor hashes/byte lengths validated.
- [ ] If GA occurs before Dakar 2027 live takeover, v9.5.29 remains acceptable for current operation; publish the season-aware Dakar hardening before 2027 live standings are expected to take over.

## C. Physical iPhone smoke

Run on the exact Stable intended for distribution:

- [ ] canonical Loader v7 fresh-install/copy path;
- [ ] QA diagnostics healthy;
- [ ] one Small widget;
- [ ] one Medium widget;
- [ ] one Large widget;
- [ ] online refresh;
- [ ] LKG/offline recovery if the GA Stable changes runtime/Loader-sensitive behavior;
- [ ] no visible startup, routing, clipping or progression blocker.

Record physical-device evidence as user-confirmed evidence; do not represent it as GitHub-verifiable automation.

## D. Public support surface

- [ ] `INSTALL.md` current.
- [ ] `SUPPORT.md` current.
- [ ] `PRIVACY.md` current.
- [ ] GitHub bug-report template active.
- [ ] Public README names the current Stable.
- [ ] Optional observability export is not advertised as mandatory until its iPhone Share Sheet interaction has been physically exercised.

## E. Final authorization

- [ ] Owner explicitly authorizes broad GA/public distribution and names the intended distribution channel.
- [ ] Any Store submission, paid distribution, external analytics, paid hosting/service contract or marketing launch receives separate approval if applicable.

## Current state

As of 2026-09-14, Motorsport Hub is technically a GA-capable candidate but **broad GA is not authorized**. The remaining hard owner decision is software-license/repository scope, followed by the final physical smoke and explicit launch approval.
