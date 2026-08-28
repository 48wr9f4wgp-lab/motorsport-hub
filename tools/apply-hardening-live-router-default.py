#!/usr/bin/env python3
import json
from pathlib import Path

ROOT=Path(__file__).resolve().parent.parent


def replace_exact(text, old, new, label):
    if new in text:
        return text
    if old not in text:
        raise RuntimeError(f'missing expected token for {label}: {old}')
    return text.replace(old,new,1)

router_path=ROOT/'motorsport-hub.js'
router=router_path.read_text()
router=replace_exact(router,'// Motorsport Hub v9.5.1-hardening — direct category module router','// Motorsport Hub v9.5.2-hardening — direct category module router','router version')
router=replace_exact(router,"const SOURCE_REF=String(globalThis.__MH_SOURCE_REF||'main');","const SOURCE_REF=String(globalThis.__MH_SOURCE_REF||'hardening-live');",'hardening default source')
router=replace_exact(router,"SUPERGT:{file:'supergt-widget-flat-v1000.js',key:'supergt-flat-v1000',marker:'flattened SUPER GT module'},","SUPERGT:{file:'supergt-widget-flat-v1000.js',key:'supergt-flat-v1003',marker:'flattened SUPER GT module'},",'SUPER GT module cache key')
router=replace_exact(router,'?v=951&t=${Date.now()}-${Math.random()}','?v=952&t=${Date.now()}-${Math.random()}','router request cache buster')
router=replace_exact(router,"'User-Agent':'MotorsportHubRouter/9.5.1-hardening'","'User-Agent':'MotorsportHubRouter/9.5.2-hardening'",'router user agent')
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
loader=replace_exact(loader,"const CATEGORY_MANIFEST='F1,WEC,WRC,SUPERGT,MOTOGP,FDJ,D1GP,SUPERFORMULA,INDYCAR,NASCAR,GTWCEU,QA';","const CATEGORY_MANIFEST='F1,WEC,WRC,SUPERGT,MOTOGP,FDJ,D1GP,SUPERFORMULA,INDYCAR,NASCAR,GTWCEU,DAKAR,QA';",'hardening loader manifest')
loader_path.write_text(loader)

print('Hardening-live Router default source fix applied or already current')
