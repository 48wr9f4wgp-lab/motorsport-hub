import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const readAt=(ref,p)=>execFileSync('git',['show',`${ref}:${p}`],{cwd:root,encoding:'utf8',maxBuffer:4*1024*1024});
const sha=s=>crypto.createHash('sha256').update(s,'utf8').digest('hex');
const bytes=s=>Buffer.byteLength(s,'utf8');

const channel=JSON.parse(read('release-channel.json'));
const loader=read('scriptable-loader-v7.js');
const expected='F1,WEC,WRC,SUPERGT,MOTOGP,FDJ,D1GP,SUPERFORMULA,INDYCAR,NASCAR,GTWCEU,DAKAR,QA';
const required=[
  'f1-widget-flat-v1000.js','wec-widget-flat-v1000.js','wrc-widget-flat-v1000.js',
  'supergt-widget-flat-v1000.js','motogp-widget-flat-v1000.js','fdj-widget-flat-v1000.js',
  'd1gp-widget-flat-v1000.js','superformula-widget.js','indycar-widget.js',
  'nascar-widget.js','gtwc-europe-widget.js','dakar-widget.js','motorsport-diagnostics-v890.js'
];

assert.equal(channel.schemaVersion,1);
assert.equal(channel.channel,'stable');
assert(Number.isInteger(channel.sequence)&&channel.sequence>=1);
assert.match(channel.version,/^\d+\.\d+\.\d+(?:[-+][A-Za-z0-9.-]+)?$/);
assert.match(channel.sourceRef,/^[0-9a-f]{40}$/);
assert.equal(channel.releaseId,`mh-${channel.sourceRef.slice(0,12)}`);
assert.equal(channel.routerSchema,5);
assert.equal(channel.categoryManifest,expected);
assert.equal(channel.router.path,'motorsport-hub.js');
assert.equal(Object.keys(channel.files).length,13);
assert.deepEqual(Object.keys(channel.files).sort(),[...required].sort());
assert.match(channel.validatedBy.releaseRef,/^[0-9a-f]{40}$/);
assert.equal(channel.validatedBy.workflow,'Motorsport Hub Release Candidate CI');
assert(Number.isInteger(channel.validatedBy.runId)&&channel.validatedBy.runId>0);

// The stable channel intentionally lags mutable development/main until an explicit
// release publication. Validate the descriptor against its pinned immutable sourceRef,
// not against the current PR working tree. This keeps ordinary runtime PRs testable
// without weakening the production integrity contract.
const router=readAt(channel.sourceRef,channel.router.path);
assert.equal(bytes(router),channel.router.bytes,'stable channel Router byte count drift at pinned sourceRef');
assert.equal(sha(router),channel.router.sha256,'stable channel Router SHA-256 drift at pinned sourceRef');
for(const p of required){
  const src=readAt(channel.sourceRef,p),e=channel.files[p];
  assert.equal(bytes(src),e.bytes,`${p}: byte count drift at stable sourceRef`);
  assert.equal(sha(src),e.sha256,`${p}: SHA-256 drift at stable sourceRef`);
}

const marker='const BOOTSTRAP=';
const start=loader.indexOf(marker);
const end=loader.indexOf(';\nconst fm=',start);
assert(start>=0&&end>start,'Loader v7 bootstrap descriptor missing');
const bootstrap=JSON.parse(loader.slice(start+marker.length,end));
assert.deepEqual(bootstrap,channel,'installed Loader v7 bootstrap must match initial stable channel exactly');

for(const token of [
  'loader v7 — stable release channel + immutable SHA-256 verification',
  "CHANNEL_REF='main'",
  'CHANNEL_TTL=15*60000',
  'release-channel.json',
  "c?.commit?.verification?.verified!==true",
  '/compare/${previous.sourceRef}...${candidate.sourceRef}',
  '/actions/runs/${v.runId}',
  "startsWith('release/')",
  "startsWith('.release/')",
  'ROLLBACK_OR_FORK',
  'VALIDATION_REF_MUTATES_RUNTIME',
  'motorsport-hub-loader-v7-state.json',
  'motorsport-hub-router-v7-${d.releaseId}-lkg.js',
  'sha256Hex(s)===String(d.router.sha256).toLowerCase()',
  '__MH_RELEASE_INTEGRITY=release'
]) assert(loader.includes(token),`Loader v7 contract missing: ${token}`);

assert(!loader.includes("globalThis.__MH_SOURCE_REF='main'"),'Loader v7 must never execute mutable main as a code source');
console.log('Motorsport Hub stable Loader v7 gate: PASS');