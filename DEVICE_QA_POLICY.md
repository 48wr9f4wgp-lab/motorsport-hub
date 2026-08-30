# Motorsport Hub — Device QA Policy

Effective: 2026-08-26
Status: **ACTIVE POLICY**

This policy supersedes any older wording that implies every development iteration requires manual iPhone Small + Medium screenshots for all categories.

## Principle
Manual real-device QA is a scarce human verification step, not the primary regression system.

Use:
- repository gates for data/cache/parser/lifecycle/router/asset integrity;
- deterministic fixtures and automated visual checks for repeatable regressions;
- iPhone/Scriptable only where native rendering or device behavior is materially relevant.

## Manual device QA is required when
- a category renderer/layout changes;
- font size, line limit, safe area, spacing, PTS alignment, badge/countdown placement changes;
- Hero source/crop/rendering policy changes;
- a new category has no accepted real-device baseline;
- Loader/Scriptable-specific behavior changes;
- final RC needs representative native spot-checking.

## Manual device QA is NOT repeated merely because
- standings data changed;
- cache schema/parser/internal architecture changed without renderer output change;
- another unrelated category changed;
- the same renderer/visual baseline was already accepted and no visual code changed.

## Current hardening evidence
Confirmed on current hardening path:
- QA diagnostic: 11/11 LIVE.
- F1 Small + Medium: PASS.
- WRC Small + Medium: PASS.
- MotoGP Small + Medium: PASS.
- FDJ Small + Medium: PASS.

These four current flat-module checks provide representative evidence for the accepted visual language. They do not automatically mark untested category-specific content as PASS.

## Current remaining manual priority
Do **not** continue the old full 11×2 matrix now.

Before final RC, prioritize only category-specific/high-risk spot checks that cannot be established by automated gates. Current likely candidates:
- SUPER GT Medium: GT500 secondary metadata + verified #36 Hero.
- WEC Medium: TR010 Hybrid / TOYOTA RACING metadata and manufacturer ranking presentation.
- GTWC Europe Medium: first current-hardening visual baseline for paired drivers.

D1GP and already-locked expansion visuals do not need immediate repeated Small+Medium testing unless their renderer/Hero changes or automated gates expose a risk.

## Post-Codex target
`POST_CODEX_VISUAL_AUTOMATION.md` is the required next-phase plan:
- shared Hero Rendering Engine;
- automated crop/focus/text-safe-area handling;
- deterministic preview artifacts;
- automated visual fixtures;
- one-time re-baseline under the new pipeline;
- future iPhone QA reduced to targeted spot checks.

## Release rule
Automated checks do not eliminate final real-device verification entirely. They reduce it to the smallest set necessary to validate native Scriptable/iOS behavior that cannot be reproduced reliably elsewhere.
