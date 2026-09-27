# Motorsport Hub Personal Cockpit v1

Scope: owner-only personal utility integrated into the normal `Motorsport Hub` Router path.

## User-facing model

Only one Scriptable installation is required:

- Script name: `Motorsport Hub`
- Widget Parameter `MY`: **MY RACE DAY**
- Alias: `RACEDAY`, `MYRACEDAY`
- Interactive settings: run `Motorsport Hub` inside Scriptable and choose **⚙ PERSONAL CONFIG**
- Utility Parameter `CONFIG`: recognized, but a home-screen CONFIG widget only shows guidance because Alert-based settings must run inside Scriptable.

The owner does **not** need to create separate `Motorsport Personal Config` or `Motorsport Race Day` scripts.

## Internal personal modules

The Router uses:

- `motorsport-personal-config.js`
- `motorsport-personal-cockpit.js`

These are internal utility modules, not separate install targets.

For the integrated release the Router pins each file by:
- immutable Stable `sourceRef`;
- exact SHA-256;
- exact UTF-8 byte length;
- required source marker;
- JavaScript syntax validation.

A validated copy is cached locally for offline reuse.

## Personal Config

Local config file:

`motorsport-personal-config-v1.json`

Controls:
- category visibility / priority order;
- Race Day horizon;
- viewing-platform detail;
- cached championship leader;
- cache-age display.

Default:
- all 12 categories enabled;
- canonical order;
- 14-day horizon;
- viewing platform ON;
- leader ON;
- cache age ON.

## MY RACE DAY data model

The cockpit consumes the existing local category caches already written by the normal Motorsport Hub categories.

Normalized fields:
- event name: `race` or `stage`;
- event time: `start` or `date`;
- location: `circuit` or `route`;
- state: `lifecycle` / `seasonEnded`;
- leader: first cached ranking row;
- viewing: existing verified local JP viewing-rights cache.

The cockpit itself makes **no external network requests**.

Layouts: Small / Medium / Large.

If a category has no cache yet, run that ordinary category once. The cockpit intentionally fails quiet instead of introducing another standings/calendar parser.

## Device validation

After the integrated Router is promoted to Stable:

1. keep the existing Scriptable `Motorsport Hub`;
2. add a Medium Scriptable widget using the same script;
3. set Parameter to `MY`;
4. verify chronological cross-series events, viewing labels, leader text and cache age;
5. run `Motorsport Hub` inside Scriptable, choose **⚙ PERSONAL CONFIG**, change the horizon or category order;
6. confirm the same MY widget reflects the local config;
7. validate Small, then Large;
8. validate MY while offline to confirm the pinned personal module cache + data caches fail safely.

Do not call Personal Cockpit complete until physical Medium / Small / Large evidence passes.
