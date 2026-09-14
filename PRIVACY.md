# Motorsport Hub — Privacy

This document describes the current Motorsport Hub Scriptable runtime behavior. It is a product-behavior disclosure, not a promise about unrelated third-party services.

## No Motorsport Hub account or backend

Motorsport Hub currently has:

- no user account or login;
- no Motorsport Hub backend/database;
- no automatic external analytics or crash-reporting service;
- no advertising identifier collection;
- no collection of email address, device identifier, or latitude/longitude by Motorsport Hub runtime code.

## Data stored locally on the iPhone

Scriptable stores Motorsport Hub runtime state locally, including:

- the Loader v7 release state and local last-known-good release;
- category data caches and fallback state;
- Hero image/manifest caches;
- category-specific UI state where applicable;
- `motorsport-hub-observability-v1.json`.

The observability file is bounded to the latest 200 events. Its allowlisted fields describe release identity, selected category, widget family, execution path, success/failure, elapsed time, and a normalized error code when present.

## Network requests

To provide live motorsport data and approved imagery, the device makes HTTPS requests directly to public services used by Motorsport Hub, including GitHub/raw GitHub resources, championship/data-source websites, and the CI-published Hero channel backed by licensed Wikimedia Commons sources.

Those third-party services operate under their own privacy policies and may receive ordinary network connection metadata when your device contacts them.

## Support export

`support-observability-export.js` is an explicit, user-triggered support utility. It does not upload automatically. It sanitizes and allowlists the exported event fields before presenting the iOS share sheet. The user chooses whether and where to share the resulting file.

## Removing local data

Motorsport Hub does not maintain a remote user profile to delete. Removing its Scriptable scripts and Motorsport Hub local files/caches removes the product's locally stored state from that Scriptable installation. Reinstalling may create new local caches during subsequent use.

## Future telemetry

Centralized telemetry is not currently enabled. If a future release proposes automatic external telemetry, that is a separate product/privacy decision requiring review before introduction; this document must be updated before such behavior is shipped.
