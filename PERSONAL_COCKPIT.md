# Motorsport Hub Personal Cockpit v1

Scope: owner-only sidecar. It does not change the Stable Router or the 12 existing category widgets.

## Files

- `motorsport-personal-config.js`
  - stores local config in `motorsport-personal-config-v1.json`;
  - lets the owner choose category order / visibility;
  - sets the Race Day horizon;
  - toggles viewing platform, leader and cache-age details.

- `motorsport-personal-cockpit.js`
  - reads the existing category caches already written by Motorsport Hub;
  - reads the existing locally cached JP viewing-rights manifest;
  - makes **no external network requests**;
  - shows active and upcoming events across categories;
  - supports Small / Medium / Large.

## v1 data contract

The cockpit treats each category module as the source of truth and only consumes its local cache. It does not duplicate standings parsers or introduce another upstream API.

Normalized fields:
- event name: `race` or `stage`;
- event time: `start` or `date`;
- location: `circuit` or `route`;
- state: `lifecycle` / `seasonEnded`;
- leader: first cached ranking row;
- viewing: existing verified local JP viewing-rights cache.

## Default config

- all 12 categories enabled;
- existing canonical category order;
- 14-day horizon;
- viewing platform ON;
- leader ON;
- cache age ON.

## Install / test

1. Create a Scriptable script named `Motorsport Personal Config` from `motorsport-personal-config.js`.
2. Run it once and adjust category order if desired.
3. Create a Scriptable script named `Motorsport Race Day` from `motorsport-personal-cockpit.js`.
4. Run it in Scriptable.
5. Add a Scriptable home-screen widget and select `Motorsport Race Day`.
6. Test Medium first, then Small / Large.

If a category has no cache yet, run the existing Motorsport Hub category once. The cockpit intentionally fails quiet instead of making a second live-data implementation.
