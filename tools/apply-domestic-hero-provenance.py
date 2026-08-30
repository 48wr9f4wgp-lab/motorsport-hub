#!/usr/bin/env python3
from pathlib import Path

ROOT=Path(__file__).resolve().parent.parent
replacements={
 'supergt-widget-flat-v1000.js':[
  ('// Completed GT500 runtime: official driver ranking + 2026 domestic tail + verified CC0 hero only + validated cache.','// Completed GT500 runtime: official driver ranking + 2026 domestic tail + verified 2024 race-action Hero + validated cache.'),
  ('// Exact Commons page verified: Tokumeigakarinoaoshima / CC0 1.0. No unattributed fallback is allowed.','// Exact Commons page verified: Abarabone1206 / CC BY 4.0. 2024 SUPER GT Rd.2 Fuji action Hero.')
 ],
 'fdj-widget-flat-v1000.js':[
  ('// Completed FDJ runtime: accepted v8.7.1 visual treatment + 40h event lifecycle + validated cache. No remote source rewriting.','// Completed FDJ runtime: accepted subject-aware action Hero crop + 40h event lifecycle + validated cache. No remote source rewriting.')
 ],
 'd1gp-widget-flat-v1000.js':[
  ('// Completed D1GP runtime: official 2026 ranking + accepted action hero + 40h lifecycle + validated cache.','// Completed D1GP runtime: official 2026 ranking + verified D1 Grand Prix action Hero + 40h lifecycle + validated cache.')
 ]
}
for rel,pairs in replacements.items():
 p=ROOT/rel
 s=p.read_text()
 for old,new in pairs:
  if old in s:s=s.replace(old,new,1)
 p.write_text(s)
print('Domestic Hero provenance patch: applied or already current')
