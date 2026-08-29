import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const expected=['F1','WEC','WRC','SUPERGT','MOTOGP','FDJ','D1GP','SUPERFORMULA','INDYCAR','NASCAR','GTWCEU','DAKAR'];
const src=JSON.parse(fs.readFileSync(path.join(root,'hero-refresh-sources.json'),'utf8'));
assert.equal(src.schemaVersion,1);
assert.equal(src.cadence,'WEEKLY');
assert.equal(src.publicationPolicy,'DISCOVERY_AND_VALIDATION_ONLY_NO_RUNTIME_MUTATION');
assert.deepEqual(Object.keys(src.categories),expected);
assert.deepEqual(Object.keys(src.relevance),expected);
assert(Number(src.minSourceLongEdge)>=2048);
assert(Number(src.maxCandidatesPerCategory)>=1&&Number(src.maxCandidatesPerCategory)<=6);
assert(Array.isArray(src.allowedLicenses)&&src.allowedLicenses.includes('CC BY-SA 4.0')&&src.allowedLicenses.includes('CC0 1.0'));
assert(Array.isArray(src.globalForbiddenContext)&&src.globalForbiddenContext.includes('museum')&&src.globalForbiddenContext.includes('replica'));

for(const id of expected){
  const qs=src.categories[id],rel=src.relevance[id];
  assert(Array.isArray(qs)&&qs.length>=3,`${id}: refresh queries missing`);
  assert(rel&&Array.isArray(rel.requiredAny)&&rel.requiredAny.length>=1,`${id}: required relevance terms missing`);
  assert(Array.isArray(rel.forbiddenAny),`${id}: forbidden relevance terms missing`);
  const tmp=path.join(os.tmpdir(),`mh-hero-refresh-${id.toLowerCase()}.json`);
  execFileSync(process.execPath,[path.join(root,'tools/build-hero-refresh-config.mjs'),`--category=${id}`,`--output=${tmp}`],{cwd:root,stdio:'pipe'});
  const cfg=JSON.parse(fs.readFileSync(tmp,'utf8'));
  assert.equal(cfg.category,id);
  assert.equal(cfg.cadence,'WEEKLY');
  assert.equal(cfg.publicationPolicy,'DISCOVERY_AND_VALIDATION_ONLY_NO_RUNTIME_MUTATION');
  assert(cfg.searchQueries.every(q=>!q.includes('{year}')&&!q.includes('{prevYear}')));
  assert.deepEqual(cfg.relevance.requiredAny,rel.requiredAny);
  assert(cfg.relevance.forbiddenAny.length>=src.globalForbiddenContext.length);
  fs.rmSync(tmp,{force:true});
  if(id==='DAKAR')assert(fs.existsSync(path.join(root,'hero-selection-policy.json')),'DAKAR policy missing');
  else assert(fs.existsSync(path.join(root,'hero-pilot-policies',`${id.toLowerCase()}.json`)),`${id}: pilot policy missing`);
}

const workflow=fs.readFileSync(path.join(root,'.github/workflows/hero-discovery.yml'),'utf8');
assert(/schedule:\s*[\s\S]*cron:/.test(workflow),'scheduled Hero refresh cron missing');
assert(workflow.includes('workflow_dispatch:'),'manual refresh entry missing');
for(const id of expected)assert(workflow.includes(id),`workflow matrix missing ${id}`);
assert(workflow.includes('build-hero-refresh-config.mjs'));
assert(workflow.includes('commons-hero-discovery.mjs'));
assert(workflow.includes('validate-discovered-hero-images.mjs'));
assert(workflow.includes('detect-hero-subjects.mjs'));
assert(!/contents:\s*write/.test(workflow),'discovery workflow must not directly mutate runtime');
console.log('Motorsport Hub hero refresh schedule gate: PASS');
