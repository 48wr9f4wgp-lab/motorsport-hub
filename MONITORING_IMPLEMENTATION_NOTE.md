# Parser monitoring implementation note

Branch: `monitor/parser-drift-detection`

This branch adds GA-preparation parser monitoring and the two minimal runtime parser repairs discovered by that monitoring. The first full live run found HTTP-200-but-unparseable responses for WEC and SUPER GT; those failures were reproduced and encoded as deterministic regressions before repair.

Runtime scope is intentionally narrow:

- WEC: perform table-identity checks against cleaned visible text so harmless heading markup does not invalidate the official manufacturers table; refresh the evidence-backed fallback top three.
- SUPER GT: stop using the first page-level `GT500`/`GT300` occurrence as table boundaries; identify the real driver-ranking header and total-points column before parsing rows.
- No renderer/layout, Hero, Loader, Router contract, category manifest, Stable descriptor, or device telemetry behavior is changed.

Validation expectations before merge:

- WEC and SUPER GT deterministic regression gates PASS;
- deterministic parser-monitor contract PASS;
- live-upstream monitor executes all 12 RELEASED categories and records a sanitized report with 12/12 PASS;
- normal Hardening CI and Release Candidate CI remain green on the final PR head;
- no Stable channel publication, Hero publication, Store action, public distribution, or external analytics service is performed.
