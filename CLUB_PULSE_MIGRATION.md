# Club Pulse repository migration

Status: **COMPLETED — historical migration procedure retained below.**

Verified 2026-09-26: destination PR [#1](https://github.com/48wr9f4wgp-lab/club-pulse/pull/1) merged at `cf27ee7a81301a195072fd85164504628317ff00` on 2026-09-14. Current Motorsport Hub main has no `scriptable/` tree or Club Pulse workflow.

Historical pre-cutover gate: **DO NOT MERGE REMOVAL UNTIL DESTINATION REPOSITORY IS VERIFIED**

Approved direction: split Club Pulse out of `48wr9f4wgp-lab/motorsport-hub`, then keep Motorsport Hub product-pure under MPL-2.0.

## Source snapshot

Canonical export source before removal:

- repository: `48wr9f4wgp-lab/motorsport-hub`
- main commit: `9e869fdae85e9ee352234b925c733065eb7c24fd`
- Club Pulse implementation/tests/docs: entire `scriptable/` directory
- Club Pulse CI workflow: `.github/workflows/club-pulse-contract.yml`

Git history remains available in the source repository even after the split PR is eventually merged.

## Destination (cutover completed)

Preferred repository: `48wr9f4wgp-lab/club-pulse`.

The destination must be created and populated from the exact source snapshot above before the removal PR is merged.

## Historical verification required before cutover

1. Destination repository exists and is writable.
2. Every file from source `scriptable/` is present in the destination without content drift.
3. `.github/workflows/club-pulse-contract.yml` is migrated and paths are adapted for the new repository layout.
4. Club Pulse contract tests pass in the destination repository.
5. Any raw GitHub URLs or repository-name assumptions in Club Pulse runtime/tests are updated and regression-tested.
6. Only after 1–5 pass may the Motorsport Hub removal branch be merged.

## Motorsport Hub side

The prepared split branch:

- removes `scriptable/` and the Club Pulse workflow;
- removes Club Pulse-specific syntax exceptions from Motorsport Hub CI;
- adds the standard Mozilla Public License 2.0 text at root;
- keeps Motorsport Hub Stable publication unchanged.

This migration does not itself authorize broad GA or Stable publication.
