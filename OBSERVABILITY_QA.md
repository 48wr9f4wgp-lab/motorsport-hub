# Observability QA

Acceptance criteria for v1:

- Production loader still enforces immutable Router SHA-256 and byte-length validation.
- Candidate success records one `CANDIDATE` event.
- Offline fallback success records one `LKG` event.
- Terminal boot failure records one `FAIL` event.
- Event history is capped at 200 entries.
- Category and widget family are sanitized and bounded.
- No device identifier, account identifier, email, location, IP address, arbitrary exception string, or response body is persisted.
- Logging failure is fail-open for diagnostics only: it must never block widget boot.
