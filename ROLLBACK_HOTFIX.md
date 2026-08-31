# Motorsport Hub Rollback / Hotfix Runbook

## Goal
Restore a known-good immutable production baseline without discarding history, weakening integrity checks, or bypassing device/CI gates.

## Current known-good baseline
- Product: Motorsport Hub v9.5.3
- `main` release merge: `afa07784d6de7b038f0f4ba802bd1b708f95488d`
- Validated RC source: `314a662a257a0c44fc45d80ed5c568d223af2a63`

Do not use `git reset --hard`, `git clean`, force-push `main`, or rewrite release history as a rollback mechanism.

## When to rollback
Rollback is preferred when a newly released version causes any P0/P1 regression such as:
- widget cannot boot;
- category routing is broken;
- verified LKG cannot boot;
- immutable integrity rejects the shipped release unexpectedly;
- broad data path failure affecting multiple categories;
- severe visual/render failure that makes core information unreadable.

For a narrowly scoped fix with low blast radius, prefer a hotfix release instead.

## Rollback procedure
1. Confirm the incident and record the failing release SHA.
2. Create a new branch from current `main`: `rollback/<bad-version>-to-v9.5.3`.
3. Revert the bad release commit(s) with normal revert commits. Preserve history; do not move `main` backwards by force.
4. Confirm the resulting tree matches the intended known-good product state except for the explicit rollback metadata/changelog if any.
5. Run syntax + deterministic release gates + immutable package generation.
6. Generate a new immutable Loader v6 from the rollback candidate SHA. Do not reuse a stale loader file merely because the code resembles v9.5.3.
7. Perform the consolidated iPhone gate:
   - online Candidate boot;
   - 12-category routing sanity;
   - fully-offline verified LKG;
   - obvious visual regression check.
8. Obtain explicit owner approval.
9. Merge the rollback PR to `main`.
10. Verify `main` HEAD and production Loader identity after merge.

## Hotfix procedure
1. Branch from current production `main`: `hotfix/<version>-<scope>`.
2. Make the smallest corrective change possible. Do not mix feature work into a hotfix.
3. Add a deterministic regression test that fails on the incident and passes with the fix whenever practical.
4. Run hardening/release-readiness gates.
5. Create `release/<hotfix-version>-rc1` and run transformed release CI.
6. Generate a fresh immutable Loader v6 from the exact hotfix RC SHA.
7. Run the consolidated iPhone Candidate + offline LKG gate.
8. Obtain explicit owner approval.
9. Merge through a PR to `main`.

## Hero Channel incidents
Hero publication is intentionally decoupled from runtime-code release.

If a new Hero is bad but runtime code is healthy:
- do not rollback the whole app first;
- stop/promote no further Hero assets;
- restore/retain the previous `hero-live` LKG through the Hero publication process;
- keep the immutable runtime SHA unchanged;
- verify device Hero Channel LKG and embedded Hero fallback.

If `hero-live` is unreachable, runtime must fall back in this order:
1. device Hero Channel LKG;
2. embedded module Hero.

## Never do
- no direct unreviewed `main` edit for incident convenience;
- no force-push/rewrite of production history;
- no blind latest-image promotion;
- no disabling SHA-256/byte-length integrity to make a broken release boot;
- no claiming recovery before build/test/device verification;
- no deletion of caches or user data as a default rollback technique.
