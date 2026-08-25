# Motorsport Hub — Codex Handoff / Hardening Branch

## Purpose
This branch exists so development can continue while Codex is rate-limited without creating merge ambiguity when Codex returns.

## Branch
- Branch: `hardening/v9.3-codex-handoff`
- Base commit: `a09d16e11aa0f65104ba895b74e09124d30b487b`
- Base meaning: exact `main` commit audited by Codex on 2026-08-25 JST.
- `main` must remain untouched by this hardening work until review/merge.

## Audit baseline
Codex verdict at the base commit: **FAIL**.
- Critical: 0
- High: 5
- Medium: 8
- Low: 3

Highest-priority findings to close before adding Dakar:
1. RC-01 stale Loader v4 router cache can silently route newer categories to F1.
2. RC-02 legacy seven-category season-end behavior can show old events as `次戦`.
3. RC-03 legacy six-category network path uses a deep serial remote-wrapper chain.
4. RC-04 remote source validation/LKG promotion is not transactional or immutable.
5. RC-05 not every runtime-reachable hero fallback is represented in the attribution inventory.
6. RC-06 data cache lacks schema/category/season/timestamp/TTL validation.

## Development rules on this branch
- No public deployment/release/Store action.
- No Dakar implementation until the P0 hardening gates are closed.
- Do not intentionally change accepted Small/Medium visual design.
- One concern per commit where practical.
- Every behavior-changing commit must document:
  - RC finding addressed
  - files changed
  - compatibility/migration effect
  - tests actually run
  - tests still pending
- Never claim an unrun test passed.
- Preserve the audited base SHA so Codex can compare `a09d16e...` → branch HEAD directly.

## Merge strategy when Codex returns
1. Codex checks out/fetches this branch.
2. Compare base `a09d16e11aa0f65104ba895b74e09124d30b487b` to branch HEAD.
3. Re-run full audit and all repository tests.
4. Review commits individually; avoid wholesale replacement of `main`.
5. Fix/revert any disputed commit on this branch.
6. Merge only after device regression gates and Codex review pass.

## Planned sequence
### H1 — Router/Loader integrity
- Explicit category registry/alias handling.
- Invalid parameter must show configuration error, never silently become F1.
- Full-name alias `GT World Challenge Europe`.
- New transactional Loader v5 design with candidate vs last-known-good separation and current manifest/schema validation.
- Loader v4 remains a migration artifact until v5 is device-tested.

### H2 — Cache integrity
- Add schema/category/season/fetchedAt validation.
- Reject/quarantine malformed cache.
- Mark stale data explicitly.

### H3 — Season lifecycle
- Common `UPCOMING / ACTIVE / SEASON_ENDED` contract.
- Half-open `[start, end)` boundaries.
- No historical snapshot returning as `次戦` after the finale.

### H4 — Performance / legacy flattening
- Remove runtime patch-wrapper waterfall from the legacy path.
- Build/test one completed module path rather than serial remote source rewriting.
- Preserve golden visual output.

### H5 — Asset manifest / parser hardening
- Inventory every runtime-reachable hero fallback.
- Strengthen table identity and fixtures for WRC / SUPER FORMULA / GTWC Europe.

### H6 — Codex rejoin gate
- Update this file with branch HEAD, commits, tests, unresolved items and device checks.
- Codex re-runs audit before any merge to `main`.

## Current status
- Branch created from audited base.
- No runtime behavior changes have been made yet on this branch.
- Next implementation target: H1 Router/Loader integrity.
