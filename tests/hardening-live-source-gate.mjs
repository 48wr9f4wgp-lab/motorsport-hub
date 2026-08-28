import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const router=read('motorsport-hub.js');
const registry=JSON.parse(read('category-registry.json'));
const hardeningLoader=read('scriptable-loader-hardening-v5.js');

assert(router.includes("const SOURCE_REF=String(globalThis.__MH_SOURCE_REF||'hardening-live');"),'hardening Router must default direct device tests to hardening-live');
assert(router.includes("SUPERGT:{file:'supergt-widget-flat-v1000.js',key:'supergt-flat-v1003'"),'SUPER GT Router module cache key must invalidate pre-v10.0.3 code');
assert(router.includes('?v=952&t=${Date.now()}-${Math.random()}'),'Router request cache buster drift');
const sgt=registry.categories.find(c=>c.id==='SUPERGT');
assert(sgt,'SUPERGT registry entry missing');
assert.equal(sgt.moduleCacheKey,'supergt-flat-v1003','SUPER GT registry cache key drift');
assert(hardeningLoader.includes("const ROUTER_REF='hardening-live';"),'hardening loader must target hardening-live');
assert(hardeningLoader.includes("GTWCEU,DAKAR,QA"),'hardening loader manifest must include Dakar');
assert(hardeningLoader.includes('globalThis.__MH_SOURCE_REF=ROUTER_REF'),'hardening loader must inject the live hardening source into Router');

console.log('Motorsport Hub hardening-live source gate: PASS');
