import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const router=fs.readFileSync(path.join(root,'motorsport-hub.js'),'utf8');
const registry=JSON.parse(fs.readFileSync(path.join(root,'category-registry.json'),'utf8'));

assert(router.includes("const SOURCE_REF=String(globalThis.__MH_SOURCE_REF||'main');"),'release Router must default to main');
assert(!router.includes("const SOURCE_REF=String(globalThis.__MH_SOURCE_REF||'hardening-live');"),'release Router must not default to hardening-live');
assert.match(router,/MH_ROUTER_SCHEMA=5/);
assert.match(router,/MH_CATEGORY_MANIFEST=F1,WEC,WRC,SUPERGT,MOTOGP,FDJ,D1GP,SUPERFORMULA,INDYCAR,NASCAR,GTWCEU,DAKAR,QA/);

const expected=['F1','WEC','WRC','SUPERGT','MOTOGP','FDJ','D1GP','SUPERFORMULA','INDYCAR','NASCAR','GTWCEU','DAKAR'];
assert.deepEqual(registry.categories.map(x=>x.id),expected,'release registry category set/order drift');
assert.equal(registry.categories.length,12);
for(const c of registry.categories){
  assert.equal(c.releaseStatus,'RELEASED',`${c.id}: transformed release status must be RELEASED`);
  assert.equal(c.dataCacheSchema,1,`${c.id}: cache schema drift`);
  assert(router.includes(c.module),`${c.id}: Router missing release module`);
}
assert.equal(registry.qa?.releaseStatus,'RELEASED','QA transformed release status must be RELEASED');
assert.equal(registry.categories.find(x=>x.id==='SUPERGT')?.moduleCacheKey,'supergt-flat-v1003','SUPER GT cache key drift');

console.log('Motorsport Hub transformed main release gate: PASS');
