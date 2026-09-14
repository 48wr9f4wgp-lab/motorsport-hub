# Motorsport Hub — RC Field Validation Runbook

Status: pre-merge support tooling for limited Public RC validation.

This runbook does **not** authorize public distribution, Stable publication, Store submission, paid distribution, or any external analytics service. It only defines how to collect and triage evidence when a device reports a Motorsport Hub failure.

## 1. Evidence order

Use the narrowest evidence needed to reproduce the problem:

1. category + widget family (`small`, `medium`, `large`);
2. what the user saw and the approximate time;
3. whether the device was online or offline;
4. sanitized Loader v7 observability export;
5. screenshot only when the failure is visual/layout/Hero related;
6. exact reproducible steps if known.

Do not request arbitrary device dumps, account data, location, or unrelated Scriptable files.

## 2. Safe local observability export

Repository utility: `support-observability-export.js`.

The utility:

- reads only `motorsport-hub-observability-v1.json` from Scriptable local documents;
- accepts only schema version 1;
- keeps at most the latest 200 events;
- exports only the allowlisted Loader fields;
- drops arbitrary extra fields rather than forwarding them;
- makes no network request;
- opens the iOS share sheet only after the user explicitly chooses **Share sanitized JSON**;
- supports Cancel without sharing anything.

Current allowlisted event fields:

- `ts`
- `releaseId`
- `version`
- `sourceRef`
- `sequence`
- `category`
- `family`
- `path`
- `ok`
- `ms`
- `errorCode`

The support export intentionally does not include device identifiers, email, location, advertising identifiers, free-form exception strings, response bodies, or arbitrary fields.

## 3. Device-side collection procedure

1. Reproduce the Motorsport Hub problem once if it is safe to do so.
2. Run the installed Loader v7 once more in the same category/family if the failure did not create a visible result.
3. Open Scriptable and run `support-observability-export.js` manually.
4. Confirm the event count shown by the utility.
5. Choose **Share sanitized JSON** only if support evidence should be exported.
6. Send/save the JSON through the iOS share sheet using the channel agreed for that support case.
7. Do not edit the original local observability file during collection.

If the utility reports that no observability file exists, run Loader v7 at least once and retry. If it reports an unreadable/unsupported schema, record that fact; do not repair or overwrite the file before the issue is understood.

## 4. Loader path interpretation

Use Loader observability as a routing/release-health signal, not as a complete crash report.

Typical paths:

- successful current/verified release fetch or execution: healthy online path;
- trusted release LKG / bootstrap LKG success: fallback path worked;
- fetch path failure followed by successful LKG: upstream/network problem is more likely than a total runtime failure;
- terminal failure: inspect release verification, local LKG availability, network state, and normalized `errorCode` before changing runtime code.

Do not infer a parser/category-module failure solely from a Loader success event. Loader success proves the release path booted; category data/render behavior still needs category-specific evidence.

## 5. Triage priority

### P0 — stop RC expansion / fix first

- Loader cannot boot and no verified LKG succeeds;
- routing consistently selects the wrong category or becomes unusable;
- broad multi-category runtime breakage;
- integrity verification rejects the approved Stable release unexpectedly;
- a regression makes primary widget information unreadable across affected devices.

### P1 — urgent targeted fix

- one category parser is reproducibly broken against its upstream source;
- stale/corrupt cache prevents useful output despite available fallback paths;
- Hero/LKG behavior repeatedly fails for a category;
- Large/Medium/Small layout regression blocks key information;
- repeated terminal Loader failures limited to a reproducible environment/path.

### P2 — collect evidence before changing product

- isolated slow execution;
- one-off upstream timeout with working LKG;
- non-blocking visual polish difference;
- subjective Hero preference with no readability/provenance defect;
- optional interaction requests.

## 6. Minimum incident record

For each RC defect, record:

- observed time (JST or UTC, clearly labeled);
- category;
- widget family;
- Stable version / releaseId if available in export;
- online/offline state;
- Loader path + `ok` + `errorCode` if present;
- screenshot only if relevant;
- reproduction steps;
- expected behavior;
- actual behavior;
- reproducibility: always / intermittent / once;
- severity: P0 / P1 / P2;
- fix commit / PR if changed;
- verification performed after the fix.

## 7. Fix gate

Do not patch from a single ambiguous symptom.

Preferred loop:

1. reproduce or obtain concrete evidence;
2. identify whether the failure is Loader/release, Router, category parser/data, cache/LKG, Hero, or renderer/layout;
3. make the smallest corrective change;
4. add/update a deterministic regression gate where practical;
5. run syntax/build-equivalent checks + deterministic tests;
6. require the relevant GitHub CI to pass;
7. perform physical-iPhone regression only when the change touches Loader, renderer/layout/font, Hero, or another device-sensitive path;
8. do not merge to `main`, publish Stable, or distribute externally without the applicable explicit approval.

## 8. RC success signal

Limited RC validation is successful when field evidence shows:

- release/Loader boot remains reliable online and through intended LKG fallback;
- upstream parser changes are detected and corrected without broad regressions;
- no recurring P0/P1 routing or readability blocker appears;
- support cases can be classified from bounded, privacy-safe evidence;
- product changes remain evidence-backed instead of reopening broad Hero/UI tuning.
