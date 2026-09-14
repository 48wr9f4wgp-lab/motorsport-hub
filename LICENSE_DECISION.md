# Motorsport Hub — Software License Decision

Updated: 2026-09-14 JST

## Decision

**APPROVED: Mozilla Public License 2.0 (MPL-2.0).**

The owner explicitly approved both:

- separating Club Pulse from the Motorsport Hub repository; and
- applying MPL-2.0 to Motorsport Hub software source code after that product split is safely completed.

The standard MPL-2.0 text is included in root `LICENSE` on the prepared split branch. `LICENSE_SCOPE.md` clarifies that third-party Hero imagery and other third-party materials are not relicensed by the software license.

## Why MPL-2.0

MPL-2.0 fits the product because it permits use, modification, distribution and commercial use while retaining file-level source reciprocity for modified covered files. It is less expansive than whole-work GPL copyleft and provides more reciprocity than permissive MIT/Apache-2.0 licensing.

This is a product decision, not legal advice.

## Club Pulse separation requirement

Club Pulse is a separate product. Before the Motorsport Hub split/removal PR is merged:

1. create the intended Club Pulse destination repository;
2. copy the complete source snapshot identified in `CLUB_PULSE_MIGRATION.md`;
3. migrate/adapt the Club Pulse CI workflow;
4. verify Club Pulse contract tests in the destination;
5. update and test any source-repository URL assumptions.

Only after those checks pass may `scriptable/` and `.github/workflows/club-pulse-contract.yml` be removed from Motorsport Hub main.

## Third-party material

MPL-2.0 is the software license. It does not replace Creative Commons or other licenses governing third-party Hero photographs. Those obligations remain documented in `ATTRIBUTION.md` and the generated live Hero attribution surface.

## Release authorization

The licensing decision does **not** itself authorize broad GA, Store submission, paid distribution, Stable publication, external analytics, or any paid service contract. Those remain separate release decisions.
