#!/usr/bin/env python3
import json
from pathlib import Path

ROOT=Path(__file__).resolve().parent.parent


def replace_if_present(text, old, new):
    return text.replace(old,new,1) if old in text else text

router_path=ROOT/'motorsport-hub.js'
router=router_path.read_text()

# Preserve the newest accepted Router contract. Older hardening versions may be
# migrated forward, but this applicator must never downgrade a newer Router.
for old in [
    '// Motorsport Hub v9.5.1-hardening — direct category module router',
    '// Motorsport Hub v9.5.2-hardening — direct category module router',
]:
    router=replace_if_present(router,old,'// Motorsport Hub v9.5.3-hardening — direct category module router')
if '// Motorsport Hub v9.5.3-hardening — direct category module router' not in router:
    raise RuntimeError('unrecognized Router version contract')

router=replace_if_present(router,"const SOURCE_REF=String(globalThis.__MH_SOURCE_REF||'main');","const SOURCE_REF=String(globalThis.__MH_SOURCE_REF||'hardening-live');")
if "const SOURCE_REF=String(globalThis.__MH_SOURCE_REF||'hardening-live');" not in router:
    raise RuntimeError('hardening default source contract missing')

router=replace_if_present(router,"SUPERGT:{file:'supergt-widget-flat-v1000.js',key:'supergt-flat-v1000',marker:'flattened SUPER GT module'},","SUPERGT:{file:'supergt-widget-flat-v1000.js',key:'supergt-flat-v1003',marker:'flattened SUPER GT module'},")
if "SUPERGT:{file:'supergt-widget-flat-v1000.js',key:'supergt-flat-v1003',marker:'flattened SUPER GT module'}," not in router:
    raise RuntimeError('SUPER GT module cache-key contract missing')

for old in ['?v=951&t=${Date.now()}-${Math.random()}','?v=952&t=${Date.now()}-${Math.random()}']:
    router=replace_if_present(router,old,'?v=953&t=${Date.now()}-${Math.random()}')
if '?v=953&t=${Date.now()}-${Math.random()}' not in router:
    raise RuntimeError('Router request cache-buster contract missing')

for old in ["'User-Agent':'MotorsportHubRouter/9.5.1-hardening'","'User-Agent':'MotorsportHubRouter/9.5.2-hardening'"]:
    router=replace_if_present(router,old,"'User-Agent':'MotorsportHubRouter/9.5.3-hardening'")
if "'User-Agent':'MotorsportHubRouter/9.5.3-hardening'" not in router:
    raise RuntimeError('Router user-agent contract missing')

router_path.write_text(router)

registry_path=ROOT/'category-registry.json'
registry=json.loads(registry_path.read_text())
found=False
for category in registry.get('categories',[]):
    if category.get('id')=='SUPERGT':
        category['moduleCacheKey']='supergt-flat-v1003'
        found=True
        break
if not found:
    raise RuntimeError('SUPERGT registry entry missing')
registry_path.write_text(json.dumps(registry,ensure_ascii=False,separators=(',',':'))+'\n')

loader_path=ROOT/'scriptable-loader-hardening-v5.js'
loader=loader_path.read_text()
old_manifest="const CATEGORY_MANIFEST='F1,WEC,WRC,SUPERGT,MOTOGP,FDJ,D1GP,SUPERFORMULA,INDYCAR,NASCAR,GTWCEU,QA';"
new_manifest="const CATEGORY_MANIFEST='F1,WEC,WRC,SUPERGT,MOTOGP,FDJ,D1GP,SUPERFORMULA,INDYCAR,NASCAR,GTWCEU,DAKAR,QA';"
loader=replace_if_present(loader,old_manifest,new_manifest)
if new_manifest not in loader:
    raise RuntimeError('hardening loader 12-category manifest missing')
loader_path.write_text(loader)

print('Hardening-live Router default source fix applied or already current')
