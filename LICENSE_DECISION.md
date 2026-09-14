# Motorsport Hub — Software License Decision

Updated: 2026-09-14 JST

This document records the recommended licensing direction for Motorsport Hub. It does **not** grant a license and does not authorize public GA by itself.

## Recommendation

**Preferred software license: Mozilla Public License 2.0 (MPL-2.0), after the repository scope problem below is resolved.**

Why MPL-2.0 is the best fit for the current product direction:

- it permits public use, modification, distribution and commercial use;
- modifications to MPL-covered source files must remain available under MPL-2.0 when distributed;
- it is weaker than GPL-style whole-work copyleft, so unrelated larger works can remain under other terms;
- it provides a better reciprocity/defensibility balance than MIT or Apache-2.0 for a public source-distributed Scriptable product;
- it avoids inventing a custom source-available license.

This is a product recommendation, not legal advice.

## Why MIT / Apache-2.0 are not the first choice

MIT and Apache-2.0 are excellent permissive licenses, but they allow a third party to copy, modify, redistribute and commercially package the software with relatively few obligations. That maximizes adoption but offers little source-level reciprocity.

Apache-2.0 adds an express patent grant and notice/change obligations, but remains permissive. If the strategic priority changes to maximum ecosystem adoption over reciprocity, Apache-2.0 would be the preferred permissive alternative.

## Why GPLv3 is not the first choice

GPLv3 provides stronger copyleft than is currently needed. For this Scriptable/widget distribution model, MPL-2.0 is the cleaner middle ground: modified covered files stay open while unrelated larger-work files can use other terms.

## Repository-scope blocker

The repository is named `motorsport-hub`, but it also contains Club Pulse implementation/workflow files, including `scriptable/club-pulse*`.

A root `LICENSE` should therefore **not** be added casually, because it could be read as licensing Club Pulse under the same terms. The project rule is also to keep title-specific decisions isolated.

Before adding the actual software license, choose one of these approaches:

1. **Preferred:** move Club Pulse into its own repository, leaving this repository product-pure for Motorsport Hub; or
2. deliberately license both products under the same license with explicit owner approval; or
3. use a carefully scoped per-product licensing structure reviewed for clarity before distribution.

Option 1 is the cleanest long-term repository/product architecture. The move itself is a separate external/destructive operation and requires explicit approval and migration planning.

## Decision required from owner

No license file should be added until the owner explicitly approves both:

- the intended license (`MPL-2.0` recommended); and
- the repository scope/migration approach.

Until then, the existing repository remains under default copyright rules for software code that has no explicit license.
