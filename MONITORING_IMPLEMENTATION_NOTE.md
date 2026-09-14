# Parser monitoring implementation note

Branch: `monitor/parser-drift-detection`

This branch intentionally adds no production runtime changes. It only adds CI/support tooling that executes the existing Router/category modules in a Node VM to detect upstream parser drift.

Validation expectations before merge:

- deterministic monitor contract PASS;
- live-upstream monitor executes all 12 RELEASED categories and records a sanitized report;
- normal Hardening CI and Release Candidate CI remain green on the PR;
- no Stable channel, Hero publication, Store action, public distribution, or external analytics service is changed.
