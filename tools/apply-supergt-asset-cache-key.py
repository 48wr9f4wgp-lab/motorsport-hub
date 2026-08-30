#!/usr/bin/env python3
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
p = ROOT / 'supergt-widget-flat-v1000.js'
s = p.read_text()
old = "const small=(config.widgetFamily||'medium')==='small',p=fm.joinPath(DOC,`motorsport-hero-v1000-crop3-${small?'small':'medium'}-supergt.jpg`);"
new = "const small=(config.widgetFamily||'medium')==='small',heroAssetId=HERO.sources[0]?.assetId||'supergt',p=fm.joinPath(DOC,`motorsport-hero-v1000-${small?'small':'medium'}-supergt-${heroAssetId}.jpg`);"
if new in s:
    print('SUPER GT asset-aware Hero cache already applied.')
elif old in s:
    s = s.replace(old, new, 1)
    p.write_text(s)
    print('SUPER GT asset-aware Hero cache applied.')
else:
    raise SystemExit('SUPER GT Hero cache marker mismatch; refusing unsafe patch')
