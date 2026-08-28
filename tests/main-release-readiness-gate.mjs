import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const router=fs.readFileSync(path.join(root,'motorsport-hub.js'),'utf8');
const registry=JSON.parse(fs.readFileSync(path.join(root,'category-registry.json'),'utf8'));

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

console.log('Motorsport Hub main-release readiness gate: PASS');
