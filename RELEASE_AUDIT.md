# Motorsport Hub — Release Audit

## Candidate
- Current candidate: **v8.9.0 Reliability Pass**
- Visual baseline: **v8.7.1 Final Visual Polish** (locked)
- Categories: F1 / WEC / WRC / SUPER GT / MotoGP / FDJ / D1GP
- Scriptable loader: v4 (no repaste required for v8.9)

## Reliability changes in v8.9
- F1 schedule + standings refresh is atomic. A partial network/API success is treated as stale and falls back to cache/snapshot with the existing update-waiting indicator.
- WRC standings source is switched to the FIA static official standings page.
- WRC remaining 2026 calendar includes Paraguay, Chile, Rally Italia Sardegna and Saudi Arabia.
- MotoGP remaining 2026 calendar is complete through Valencia; unverified race-start clock times are explicitly treated as TBD.
- WEC remaining 2026 calendar uses the current official COTA → Fuji → Barcelona → Monza sequence.
- WEC standings no longer discard an unknown manufacturer merely because local metadata is absent.
- SUPER GT calendar includes the Motegi finale.
- SUPER GT standings no longer discard an unknown GT500 car number merely because local metadata is absent.
- FDJ and D1GP retain their existing official standings sources and complete calendars.

## Static QA performed
- `motorsport-hub.js`: JavaScript syntax check passed.
- `motorsport-reliability-v890.js`: JavaScript syntax check passed.
- Loader-v4 compatibility markers are present in the v8.9 router.
- All seven Widget Parameters are present in the router.
- Reliability source contains the season-tail events and parser fallbacks expected by the release gate.
- `tests/release-gate.mjs` is committed for repeatable repository-level static verification.

## Runtime QA still required
The Scriptable runtime cannot be fully executed in repository/static QA. Before Release Candidate is declared, verify on iPhone:
1. F1 Medium + Small
2. WEC Medium + Small
3. WRC Medium + Small
4. SUPER GT Medium + Small
5. MotoGP Medium + Small
6. FDJ Medium + Small
7. D1GP Medium + Small
8. Confirm `更新待ち` appears when a data source fails instead of silently presenting partial fresh data.
9. Confirm no widget falls back to an old router/module after a network failure.

## Public-release legal gate
- **SUPER GT hero image attribution is not yet fully resolved.** `ATTRIBUTION.md` intentionally keeps this as a release blocker until the exact Commons file-page author and license are verified and recorded.
- Other credited/adapted hero assets must continue to satisfy their stated CC/CC0 terms when distributed.

## Release decision
- **Do not mark Release Candidate yet.**
- v8.9 is ready for iPhone regression testing; RC follows only after the runtime checks above pass and the SUPER GT attribution gate is closed.
