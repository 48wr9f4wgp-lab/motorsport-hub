# Motorsport Hub — Japan Viewing Rights Contract

Updated: 2026-09-27 JST

## Purpose

`viewing-rights-jp.json` is the canonical in-release dataset for the compact `視聴 <platform>` label shown in Medium/Large widgets.

The dataset is intentionally tied to the same immutable Stable `sourceRef` as Router/category code. It is not fetched from mutable `main` at runtime.

## Runtime contract

1. Router fetches `viewing-rights-jp.json` from the exact release `sourceRef`.
2. Router verifies exact UTF-8 byte length and SHA-256 pinned inside the immutable Router source.
3. Root schema, region, policy and verification timestamp are validated.
4. A category is exposed through `globalThis.__MH_VIEWING_JP` only when:
   - `status === "VERIFIED"`;
   - category id matches;
   - source is HTTPS;
   - platform list and compact label are present;
   - `validUntil` has not passed.
5. Category modules additionally require the rights `season` to match their own `SEASON` when available.
6. Small widgets never show viewing labels.
7. Missing, stale, unverified or invalid rights fail closed: the viewing label is omitted.

## UI v1

- Small: no viewing label.
- Medium: standings header contains a compact label such as `視聴 J SPORTS`.
- Large: same compact label; no new vertical row is introduced.
- Existing event/standings spacing is preserved.

This avoids reopening the Small-width regression surface and minimizes Medium/Large vertical-layout risk.

## 2026 JP verification snapshot

Primary compact labels:
- F1: フジNEXT
- WEC: J SPORTS
- WRC: J SPORTS
- SUPER GT: J SPORTS
- MotoGP: Hulu
- FDJ: YouTube
- D1GP: YouTube
- SUPER FORMULA: SFgo
- INDYCAR: GAORA
- NASCAR: ABEMA
- GTWC Europe: GT World
- Dakar 2027: hidden / UNVERIFIED

Source URLs and fuller platform/coverage metadata are stored in `viewing-rights-jp.json`.

Dakar is deliberately hidden because the currently available official broadcaster material does not establish 2027 Japan rights with enough specificity. Historical/2026 broadcaster evidence must not be projected forward.

## Update rule

A rights change requires:
- current official-source verification;
- dataset update;
- Router hash/byte update;
- deterministic gates;
- new immutable Stable publication;
- physical iPhone verification if the visible label/layout changes.

Do not add a user-facing monitoring automation for viewing rights.
