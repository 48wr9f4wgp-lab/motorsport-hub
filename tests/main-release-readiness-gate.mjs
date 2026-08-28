import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {execFileSync,spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const routerPath=path.join(root,'motorsport-hub.js');
const registryPath=path.join(root,'category-registry.json');
const router=fs.readFileSync(routerPath,'utf8');
const registryText=fs.readFileSync(registryPath,'utf8');
const registry=JSON.parse(registryText);

assert(router.includes("const SOURCE_REF=String(globalThis.__MH_SOURCE_REF||'hardening-live');"),'hardening branch must keep hardening-live as direct-device default before release approval');
assert(!registry.categories.some(x=>x.releaseStatus==='RELEASED'),'hardening branch must not present categories as RELEASED');
assert.notEqual(registry.qa?.releaseStatus,'RELEASED','hardening QA must not be RELEASED');

const out=execFileSync(process.execPath,[path.join(root,'tools/prepare-main-release.mjs'),'--check','--status=RELEASE_CANDIDATE'],{cwd:root,encoding:'utf8'}).trim();
const report=JSON.parse(out.split(/\n/).filter(Boolean).at(-1));
assert.equal(report.mode,'DRY_RUN');
assert.equal(report.targetStatus,'RELEASE_CANDIDATE');
assert.equal(report.routerDefault,'main');
assert.equal(report.categories,12);
assert.equal(report.qa,true);
assert.equal(report.supergtCacheKey,'supergt-flat-v1003');
assert.deepEqual(new Set(report.changed),new Set(['motorsport-hub.js','category-registry.json']));

const blocked=spawnSync(process.execPath,[path.join(root,'tools/prepare-main-release.mjs'),'--write','--status=RELEASED'],{
  cwd:root,
  encoding:'utf8',
  env:{...process.env,GITHUB_REF_NAME:'hardening/v9.3-codex-handoff'}
});
assert.notEqual(blocked.status,0,'write mode must be rejected on the hardening branch');
assert.match(`${blocked.stdout}\n${blocked.stderr}`,/restricted to a dedicated release\/\* branch/);
assert.equal(fs.readFileSync(routerPath,'utf8'),router,'blocked write must not mutate Router');
assert.equal(fs.readFileSync(registryPath,'utf8'),registryText,'blocked write must not mutate Registry');

console.log('Motorsport Hub main-release readiness gate: PASS');
