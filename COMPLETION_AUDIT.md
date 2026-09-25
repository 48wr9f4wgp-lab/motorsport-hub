# Motorsport Hub — Completion Audit

Updated: 2026-09-26 JST
Status: **AUDIT REPAIR PREPARED / STABLE v9.5.31 / GA NOT AUTHORIZED**

## Baselines and method

Repository main `5a5dd46722556ca71d20beb50f752be8a12e3f0a`, Stable source `02e9c199611fd32153f4a5f220e9d1165c31ad2f`, sequence 9, releaseId `mh-02e9c199611f`. RC validation run [36012972754](https://github.com/48wr9f4wgp-lab/motorsport-hub/actions/runs/36012972754) was re-fetched: SUCCESS at releaseRef `f746a2730c6f05b21ce35d296ac8bfd1bf8811a2`.

The audit retrieved the repository text snapshot through the GitHub connector, inspected release/CI/runtime/docs, ran deterministic gates locally, and checked recent operational job logs. Local Node is v24.19.0; repository CI uses Node 22 for release gates. The local snapshot is not a full historical clone; the pinned-history Loader gate requires GitHub CI. Never substitute a fabricated source commit for it.

## Findings and repairs

| Priority | Finding | Repair / disposition |
| --- | --- | --- |
| P1 | Hero scheduled refresh cannot publish because inherited ATTRIBUTION.md is rejected as an unexpected file | Builder regenerates exact candidate credits, allowlist admits that one file, validator compares full generated content; negative regression tests retain rejection of wrong credits and unrelated files |
| P1 | Dakar live monitor has no fresh accepted cache | Unresolved upstream cause; deterministic fixture passes. Improve monitor classification for HTTP/transport/invalid JSON and log status/byte counts, without logging response bodies. Keep monitor failure active |
| P2 | Current docs incorrectly say SUPER GT Small physical confirmation / Hero credit proof are pending | Import scoped user-confirmed physical evidence; independently validate pinned live credits |
| P2 | Handoff/audit/checklist/migration/status describe old releases or incomplete completed work | Reconcile current state, retain pending GA/device gates, mark legacy Codex handoff historical |

Hero evidence: [run 36192726244](https://github.com/48wr9f4wgp-lab/motorsport-hub/actions/runs/36192726244), job 108261614760: `AssertionError: unexpected publish file: ATTRIBUTION.md`. Build and existing fixture gates succeeded; candidate publication validation failed. This is a pipeline integration gap, not an image quality exception. The repair does not change Hero selection/quality thresholds or publish any assets.

Dakar evidence: [run 36192066389](https://github.com/48wr9f4wgp-lab/motorsport-hub/actions/runs/36192066389), job 108259324941: 11 categories PASS, DAKAR `NO_FRESH_DATA_CACHE`. The current environment could not retrieve the official page (proxy timeout / search fetch unavailable). Thus no live parser repair or live recovery is claimed. Next scheduled monitor after merge must supply the now-visible failure classification.

## Attribution / migration evidence

Hero head `57e0c7019b681239deba81627eddba6b6c622acf`: channel and human-readable credits share `2026-09-14T02:23:06.396Z`; local official repository validator PASS for 12 pool assets. Credit existence and refresh pipeline health are separate claims.

Club Pulse destination PR [#1](https://github.com/48wr9f4wgp-lab/club-pulse/pull/1) merged at `cf27ee7a81301a195072fd85164504628317ff00`; current Motorsport Hub contains MPL-2.0 and no Club Pulse product tree. Historical migration procedure remains in `CLUB_PULSE_MIGRATION.md`.

## Validation boundaries

- Stable Router + 13 module hash/byte checks: 14/14 PASS against the fetched main snapshot and Stable descriptor.
- Local deterministic baseline: 41/42 workflow-listed gates PASS; stable-loader-v7 gate cannot run without pinned historical Git objects. This is an environment limit, not evidence of a Loader defect.
- Render smoke: 36 cases PASS; this is mocked Scriptable, not an iPhone display inspection.
- Repair verification: Hero promotion/large/public-attribution and live-monitor positive/negative regressions PASS. Full post-repair results and exact repair commit CI are recorded in the PR.
- No runtime module/loader, Stable descriptor, selection policy, visual layout or schedule was changed.

## Device evidence and remaining gates

SUPER GT Small v9.5.31: owner-confirmed PASS on 2026-09-25 07:46 JST according to attached handoff, screenshot IMG_2843.jpeg. Screenshot was not re-inspected here; exact device/OS remains unrecorded. Prior v9.5.30 WEC/Dakar PASS is historical and scoped.

Required before broad GA: resolve/reverify current operational failures; one representative exact-Stable physical smoke; current Hero credit revalidation; explicit owner GA authorization. Optional Share Sheet export and actual 2027 Dakar live behavior remain unverified.

Main merge, Stable publication and broad GA are separate actions. This audit prepares repairs; it authorizes none of those actions.
