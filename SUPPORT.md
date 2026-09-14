# Motorsport Hub — Support

Use GitHub Issues for reproducible Motorsport Hub problems:

https://github.com/48wr9f4wgp-lab/motorsport-hub/issues

Before filing an issue, keep the installed Loader v7 in place and gather evidence. Reinstalling first can erase the distinction between a release/channel problem and an upstream/parser/cache problem.

## What to include

- Championship/category, e.g. `WEC` or `SUPERGT`.
- Widget size: Small / Medium / Large.
- What you expected and what appeared instead.
- A screenshot when the issue is visual or device-specific.
- Whether the widget shows `更新待ち`.
- The result of running the `QA` category, including the `LIVE / PARSE / NET` status and the source/release suffix shown at the bottom.
- Approximate local time when the issue occurred.

Do not post private information, credentials, or unrelated device data.

## Diagnostic interpretation

- `LIVE`: the coarse upstream/network route is reachable. A failing production widget can still indicate a production parser/runtime-path issue.
- `PARSE`: the request succeeded but the diagnostic page/content identity check did not match the expected source shape.
- `NET`: the request itself failed or timed out.
- `更新待ち`: the production category module is serving validated cached/fallback data instead of claiming a fresh update succeeded.

## Local observability

Loader v7 keeps a bounded local observability file (`motorsport-hub-observability-v1.json`) with at most 200 sanitized events. It is not automatically uploaded anywhere.

The repository includes `support-observability-export.js`, which exports only allowlisted support fields after explicit user action. Its data-shaping behavior is covered by deterministic CI. The export interaction itself should not be treated as a required public-support step until its physical-iPhone interaction has been separately verified.

## Urgent failures

For startup failure, blank/unusable widgets across multiple categories, or a suspected bad Stable release, include a `QA` screenshot and the affected category/size first. The release pipeline keeps immutable Stable identity and local LKG state specifically so these failures can be isolated without guessing.
