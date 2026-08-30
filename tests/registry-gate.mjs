import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const registry=JSON.parse(fs.readFileSync(path.join(root,'category-registry.json'),'utf8'));
const router=fs.readFileSync(path.join(root,'motorsport-hub.js'),'utf8');
const norm=v=>String(v||'').trim().toUpperCase().replace(/[\s_-]+/g,'');

assert.equal(registry.schemaVersion,1);
assert.equal(registry.routerSchema,5);
assert.equal(registry.categories.length,12,'registry category count drift');
assert.equal(registry.planned?.length,0,'planned categories should be empty after Dakar integration');

const ids=new Set(),tokens=new Map();
for(const c of registry.categories){
  assert(c.id&&c.displayName&&c.module&&c.moduleMarker&&c.moduleCacheKey,`incomplete category record ${c.id||'unknown'}`);
  assert(!ids.has(c.id),`duplicate category id ${c.id}`);ids.add(c.id);
  assert(fs.existsSync(path.join(root,c.module)),`missing module ${c.module} for ${c.id}`);
  const src=fs.readFileSync(path.join(root,c.module),'utf8');assert(src.includes(c.moduleMarker),`${c.id} module marker drift`);
  for(const token of [c.id,c.displayName,...(c.aliases||[])]){
    const n=norm(token);const previous=tokens.get(n);assert(!previous||previous===c.id,`alias collision ${token}: ${previous} vs ${c.id}`);tokens.set(n,c.id);
  }
}

const expectedManifest=[...registry.categories.map(x=>x.id),registry.qa.id].join(',');
assert(router.includes(`MH_CATEGORY_MANIFEST=${expectedManifest}`),'Router manifest differs from category-registry.json');
assert(router.includes(`const ROUTER_SCHEMA=${registry.routerSchema}`),'Router schema differs from registry');
for(const c of registry.categories){
  assert(router.includes(`'${c.id}'`)||router.includes(`selected==='${c.id}'`)||router.includes(`${c.id}:{`),`Router missing category ${c.id}`);
  assert(router.includes(c.module),`Router missing module ${c.module}`);
  assert(router.includes(c.moduleCacheKey),`Router missing cache key ${c.moduleCacheKey}`);
}
assert(router.includes(registry.qa.module),'Router missing QA module');
assert(router.includes(registry.qa.moduleCacheKey),'Router missing QA cache key');

for(const [alias,id] of [['Formula 1','F1'],['Formula Drift Japan','FDJ'],['GT World Challenge Europe','GTWCEU'],['NASCAR Cup Series','NASCAR'],['D1 Grand Prix','D1GP'],['Dakar Rally','DAKAR']]){
  const n=norm(alias);assert.equal(tokens.get(n),id,`registry missing full-name alias ${alias}`);
}

console.log('Motorsport Hub category registry gate: PASS');
