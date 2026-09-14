# Motorsport Hub — Live Parser Monitoring

Status: GA-preparation support tooling. This does not publish Stable, change the installed Loader, transmit device telemetry, or authorize public distribution.

## Purpose

The production category modules depend on third-party JSON/HTML sources that can change without repository changes. A simple HTTP reachability check is insufficient because an upstream can still return `200` while the runtime parser rejects the new structure and silently falls back to SNAP/cache data.

`tools/live-parser-monitor.mjs` therefore executes the real Router and each of the 12 RELEASED category modules in a Node VM with Scriptable UI/FileManager mocks while allowing the category's real data `Request` calls to reach the live upstream.

A category passes only when all of the following are true:

- the Router loads exactly one selected category module;
- Scriptable lifecycle calls complete normally;
- at least one real upstream data request occurs;
- the real category parser accepts the live response strongly enough to write a new schema-1 local data cache;
- the rendered surface does not report fallback/update-wait/error state.

This means a `200 OK` response with an incompatible HTML/JSON structure is a monitoring failure, not a false pass.

## Workflow

`.github/workflows/parser-monitor.yml` runs:

- every 6 hours on the default branch after merge;
- manually through `workflow_dispatch`;
- on `monitor/**` branch pushes so monitoring changes can be exercised before merge;
- deterministic contract checks on relevant pull requests, without depending on live network state.

Live upstream checks use two attempts. The workflow fails if any production category still cannot produce a fresh accepted cache. A sanitized JSON report is uploaded for 14 days.

## Privacy and retained evidence

The report contains only operational metadata needed to identify parser/source failures, including category, URL, HTTP status, response byte count, content type, elapsed time, normalized error code, and fresh-cache metadata.

It does **not** retain upstream response bodies, raw exception messages, device identifiers, email, location, advertising identifiers, or end-user telemetry.

## Triage

When the scheduled monitor fails:

1. Identify the failed category and request from the workflow summary/report.
2. Distinguish transport failure (`HTTP_*`, timeout, connection failure) from `NO_FRESH_DATA_CACHE`/`FALLBACK_UI`.
3. For HTTP-success + no-fresh-cache failures, compare the current upstream shape with the parser in that category module.
4. Reproduce with a captured minimal fixture where licensing/terms allow; do not commit full third-party pages unnecessarily.
5. Apply the smallest parser/source correction.
6. Run deterministic gates, render smoke, Hardening CI and Release Candidate CI.
7. Perform physical-iPhone verification if the fix changes runtime rendering, Loader behavior, Hero handling, or other device-sensitive behavior.
8. Stable publication remains a separate explicit approval action.

## Non-goals

- No automatic parser rewriting.
- No automatic Stable publication.
- No automatic switch to unofficial substitute sources.
- No centralized device analytics.
- No broad visual retuning.
