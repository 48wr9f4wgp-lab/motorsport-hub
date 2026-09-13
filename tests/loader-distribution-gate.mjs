import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {buildDescriptor,buildLoader} from '../tools/generate-release-package.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const expected='F1,WEC,WRC,SUPERGT,MOTOGP,FDJ,D1GP,SUPERFORMULA,INDYCAR,NASCAR,GTWCEU,DAKAR,QA';

const v4=read('scriptable-loader.js');
const v5=read('scriptable-loader-v5.js');
const v7=read('scriptable-loader-v7.js');
const retired=read('scriptable-loader-v6-qa.js');
const readme=read('README.md');

assert(v4.includes('loader v4'),'legacy v4 marker missing');
assert(v5.includes('legacy transactional Router compatibility loader'),'v5 must be clearly marked legacy compatibility');
assert(v5.includes("const ROUTER_REF='main'"),'v5 production compatibility source must be main');
assert(v5.includes(`const CATEGORY_MANIFEST='${expected}'`),'v5 must validate the complete 12-category + QA manifest');

assert(retired.includes('RETIRED. DO NOT USE FOR RELEASE OR DEVICE QA'),'static v6 QA snapshot must be explicitly retired');
assert(retired.includes('intentionally refuses to execute'),'retired v6 QA snapshot must be fail-closed');
assert(!retired.includes('1f22919dc2a89053bff60f96b4c173ba6fb49076'),'retired v6 QA snapshot must not embed the historical executable release SHA');
assert(!retired.includes('const RELEASE='),'retired v6 QA snapshot must not remain an executable immutable release loader');

assert(v7.includes('loader v7 — stable release channel + immutable SHA-256 verification'),'v7 stable loader marker missing');
assert(v7.includes('release-channel.json'),'v7 must discover the stable release channel');
assert(v7.includes('ROLLBACK_OR_FORK'),'v7 must reject rollback/fork channel updates');
assert(v7.includes("c?.commit?.verification?.verified!==true"),'v7 must require a GitHub-verified immutable source commit');
assert(v7.includes('/actions/runs/${v.runId}'),'v7 must verify release CI evidence');
assert(v7.includes("startsWith('.release/')"),'v7 validation ref may only add release-marker metadata');
assert(v7.includes('__MH_RELEASE_INTEGRITY=release'),'v7 must pass the immutable descriptor to Router');

for(const token of [
  'Use `scriptable-loader-v7.js` as the installed production loader.',
  '`scriptable-loader-v7.js` — **canonical installed production loader**',
  '`scriptable-loader-v6.js` remains the per-release immutable CI artifact',
  '`scriptable-loader.js` — **legacy v4 compatibility loader**',
  '`scriptable-loader-v5.js` — **legacy transactional compatibility loader**',
  '`scriptable-loader-v6-qa.js` — **retired historical QA snapshot**'
]) assert(readme.includes(token),`README loader distribution contract missing: ${token}`);

const fakeSha='a'.repeat(40);
const descriptor=buildDescriptor(fakeSha);
assert.equal(descriptor.categoryManifest,expected,'generated immutable descriptor manifest drift');
assert.equal(Object.keys(descriptor.files).length,13,'immutable release must protect 12 category modules + QA');
assert(descriptor.files['dakar-widget.js'],'immutable release must include Dakar');
const generated=buildLoader(descriptor);
assert(generated.includes(`"categoryManifest":"${expected}"`),'generated v6 validation loader missing full manifest');
assert(generated.includes(`"sourceRef":"${fakeSha}"`),'generated v6 validation loader must pin exact release SHA');
assert(generated.includes('__MH_RELEASE_INTEGRITY=RELEASE'),'generated v6 validation loader must provide immutable integrity contract to Router');

console.log('Motorsport Hub loader distribution gate: PASS');
