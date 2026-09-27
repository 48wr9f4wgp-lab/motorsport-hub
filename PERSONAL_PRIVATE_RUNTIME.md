# Motorsport Hub — Personal / Private Runtime

Status: implementation v1
Scope: owner-only

## Goal

Keep Motorsport Hub for the owner's personal use while allowing the GitHub repository to become private without breaking the Scriptable runtime.

## Authentication model

- Token is **not committed to GitHub**.
- Token is stored only in Scriptable Keychain under:
  `motorsport-hub-github-token-v1`
- Use a fine-grained GitHub personal access token restricted to this repository.
- Required repository permissions:
  - **Contents: read**
  - **Actions: read**
  - Metadata read is supplied/required by GitHub for repository access as applicable.
- Do not grant write/admin permissions to the iPhone runtime token.

GitHub REST repository contents supports fine-grained tokens with Contents read permission. Workflow-run verification on a private repository requires Actions read permission.

## Runtime design

`scriptable-loader-v8-private.js`:
- reads the token from Keychain;
- fetches `release-channel.json` and immutable runtime files via authenticated GitHub REST Contents API;
- authenticates commit/compare/Actions validation requests;
- injects a narrow repository transport helper into the verified Router;
- keeps existing SHA-256 + byte-length integrity checks and Loader LKG behavior.

The Router uses the injected helper for:
- category modules;
- `viewing-rights-jp.json`;
- `hero-live/hero-channel/channel.json`;
- Hero image bytes.

When the helper is absent, the existing public transport remains available during migration.

## Migration order

1. deploy private-capable Loader/Router while repo is still public;
2. save a read-only fine-grained token using `motorsport-private-setup.js`;
3. physically verify authenticated online QA;
4. verify offline/LKG again;
5. only then change repository visibility to private;
6. repeat physical online QA after privatization.

## Security

- Never paste the token into committed source or screenshots.
- Keep the token repo-scoped and read-only.
- Rotate/revoke it if the phone is lost or the credential is exposed.
- The runtime must fail to LKG rather than downgrade integrity checks.
