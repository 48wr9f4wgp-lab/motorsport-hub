# Motorsport Hub — Completion Audit

Updated: 2026-09-27 JST
Status: **v9.5.35 PRIVATE FOUNDATION RC PASS / STABLE PUBLICATION APPROVAL PENDING / OWNER-ONLY**

## Current controlling decision

- PRODUCT_INTENT: PERSONAL-ONLY / OWNER-ONLY
- PUBLIC_DISTRIBUTION_DECISION: NO
- previous GitHub Broad GA: WITHDRAWN / historical only
- repository visibility: public only during safe private-runtime migration

## Verified owner-use baseline

Stable v9.5.34 remains the physically proven baseline:
- QA 12/12 LIVE;
- Small/Medium/Large representative UI PASS;
- JP viewing-platform v1 PASS;
- offline/LKG recovery PASS;
- Loader v7 copy-path PASS.

## v9.5.35 private foundation candidate

- sourceRef: `7bfd260947ca091376b4e7c033661ecfcb94ffed`
- sequence target: **13**
- validation ref: `b259908a986be695bc9a382249a6ccac85ab02c5`
- RC #311 / `36299105721`: SUCCESS
- immutable artifact digest: `sha256:d23a0d84d74835825351684fb0cd0d3e940fba431fc1faa5c66fa1f7e227da85`
- Router: private-capable repository transport
- Loader v8: Keychain-backed GitHub authentication
- setup: secure token entry + connection test
- category module hashes: unchanged from v9.5.34
- visible racing UI/data behavior: unchanged

## Security model

The iPhone runtime token is not committed to source.
Intended fine-grained permissions:
- Contents: read
- Actions: read
- repository-scoped only
- no write/admin permission

## Remaining hard gates

1. explicit approval to publish Stable v9.5.35;
2. store read-only token in Scriptable Keychain;
3. physical authenticated online QA;
4. physical offline/LKG recovery on Loader v8;
5. only then change repository visibility to private;
6. repeat online QA after privatization.

## Decision

Private-runtime engineering is automation-verified and ready for staged device validation. Repository privatization is not yet safe and is not executed by this candidate.
