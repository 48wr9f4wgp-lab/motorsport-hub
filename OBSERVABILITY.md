# Motorsport Hub Observability v1

Scope: production loader health only. No external analytics and no PII.

The production loader records up to 200 local events in `motorsport-hub-observability-v1.json` under Scriptable local documents.

Recorded fields:
- timestamp
- releaseId
- category parameter
- widget family
- path: CANDIDATE / LKG / FAIL
- boot result
- elapsed milliseconds

Explicitly excluded:
- device identifiers
- account identifiers
- email addresses
- location
- IP addresses
- arbitrary exception strings or response bodies

The log is diagnostic-only and must never alter routing, cache validation, integrity checks, Hero selection, or fallback behavior.
