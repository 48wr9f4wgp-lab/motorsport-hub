import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
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

// Loader v7 is install-once. Its embedded BOOTSTRAP is a permanent recovery anchor,
// while release-channel.json advances independently through monotonically increasing
// stable sequences. Never force the Loader source to change merely because the channel
// moves forward.
assert.equal(bootstrap.schemaVersion,1);
assert.equal(bootstrap.channel,'stable');
assert.equal(bootstrap.sequence,1,'Loader v7 bootstrap sequence must remain the initial release');
assert.equal(bootstrap.version,'9.5.10','Loader v7 bootstrap version is the permanent initial recovery anchor');
assert.equal(bootstrap.sourceRef,'b62fc2bf73b1afbe0eb7d84402a082a1e275b518','Loader v7 bootstrap sourceRef must remain immutable');
assert.equal(bootstrap.releaseId,'mh-b62fc2bf73b1');
assert.equal(bootstrap.routerSchema,5);
assert.equal(bootstrap.categoryManifest,expected);
assert.equal(bootstrap.router.path,'motorsport-hub.js');
assert.deepEqual(Object.keys(bootstrap.files).sort(),[...required].sort());
assert(bootstrap.sequence<=channel.sequence,'stable channel must never precede Loader bootstrap');
if(bootstrap.sequence===channel.sequence)assert.equal(bootstrap.sourceRef,channel.sourceRef,'equal sequence cannot point to a different stable source');

const bootstrapRouter=readAt(bootstrap.sourceRef,bootstrap.router.path);
assert.equal(bytes(bootstrapRouter),bootstrap.router.bytes,'Loader bootstrap Router byte count drift');
assert.equal(sha(bootstrapRouter),bootstrap.router.sha256,'Loader bootstrap Router SHA-256 drift');
for(const p of required){
  const src=readAt(bootstrap.sourceRef,p),e=bootstrap.files[p];
  assert.equal(bytes(src),e.bytes,`${p}: Loader bootstrap byte count drift`);
  assert.equal(sha(src),e.sha256,`${p}: Loader bootstrap SHA-256 drift`);
}

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
  'motorsport-hub-observability-v1.json',
  'motorsport-hub-router-v7-${d.releaseId}-lkg.js',
  'sha256Hex(s)===String(d.router.sha256).toLowerCase()',
  '__MH_RELEASE_INTEGRITY=release',
  "writeObs('CANDIDATE',true,candidate)",
  "writeObs('TRUSTED_LKG',true,trusted)",
  "writeObs('BOOTSTRAP_LKG',true,BOOTSTRAP)"
]) assert(loader.includes(token),`Loader v7 contract missing: ${token}`);

assert(!loader.includes("globalThis.__MH_SOURCE_REF='main'"),'Loader v7 must never execute mutable main as a code source');
for(const token of ['deviceId','email','latitude','longitude','advertisingId'])assert(!loader.includes(token),`Loader v7 local observability must not collect ${token}`);

// Deterministic local-observability smoke: execute a valid cached Router under a fresh
// trusted state so no network is required, then verify the bounded privacy-safe event.
const syntheticSourceRef='a'.repeat(40);
const syntheticRouter=`// Motorsport Hub synthetic module router\n// MH_ROUTER_SCHEMA=5\n// MH_CATEGORY_MANIFEST=${expected}\n(async()=>{globalThis.__MH_ROUTER_BOOT_OK=true;globalThis.__MH_ROUTER_SCHEMA=5;globalThis.__MH_ROUTER_MANIFEST='${expected}';Script.complete()})();\n`;
const syntheticRelease={
  schemaVersion:1,channel:'stable',sequence:7,version:'9.9.9',releasedAt:new Date(Date.now()-60000).toISOString(),
  sourceRef:syntheticSourceRef,releaseId:`mh-${syntheticSourceRef.slice(0,12)}`,routerSchema:5,categoryManifest:expected,
  router:{path:'motorsport-hub.js',sha256:sha(syntheticRouter),bytes:bytes(syntheticRouter)},
  files:Object.fromEntries(required.map(p=>[p,{sha256:'b'.repeat(64),bytes:1}])),
  validatedBy:{releaseRef:'c'.repeat(40),workflow:'Motorsport Hub Release Candidate CI',runId:1}
};
const statePath='/docs/motorsport-hub-loader-v7-state.json';
const lkgPath=`/docs/motorsport-hub-router-v7-${syntheticRelease.releaseId}-lkg.js`;
const obsPath='/docs/motorsport-hub-observability-v1.json';
const oldObs={schemaVersion:1,events:Array.from({length:200},(_,i)=>({ts:String(i),releaseId:'old',category:'F1',family:'small',path:'TRUSTED_LKG',ok:true,ms:1}))};
const files=new Map([[statePath,JSON.stringify({checkedAt:Date.now(),release:syntheticRelease})],[lkgPath,syntheticRouter],[obsPath,JSON.stringify(oldObs)]]);
const fm={documentsDirectory:()=>'/docs',joinPath:(a,b)=>`${a}/${b}`,fileExists:p=>files.has(p),readString:p=>{if(!files.has(p))throw Error('missing');return files.get(p)},writeString:(p,s)=>files.set(p,String(s)),remove:p=>files.delete(p)};
let requests=0,completed=0,setWidget=0;
class Request{constructor(){requests++;this.headers={}}async loadJSON(){throw Error('network forbidden')}async loadString(){throw Error('network forbidden')}}
class Stack{addText(){return{}}addSpacer(){}setPadding(){}}
class ListWidget extends Stack{}
class Color{constructor(){}static white(){return new Color()}}
const Font={boldSystemFont(){},systemFont(){}};
const ctx={args:{widgetParameter:'SUPER GT',queryParameters:{}},config:{runsInWidget:true,widgetFamily:'large'},FileManager:{local:()=>fm},Request,ListWidget,Color,Font,Date,Math,JSON,String,Number,Array,Object,RegExp,Error,Promise,Script:{complete(){completed++},setWidget(){setWidget++}}};
ctx.globalThis=ctx;vm.createContext(ctx);await vm.runInContext(loader,ctx,{timeout:5000});
assert.equal(requests,0,'fresh trusted Loader v7 LKG path must not make a network request');
assert.equal(completed,1,'synthetic Router should complete once');
assert.equal(setWidget,0,'successful synthetic Router should not render Loader failure UI');
const obs=JSON.parse(files.get(obsPath));
assert.equal(obs.schemaVersion,1);assert.equal(obs.events.length,200,'local observability must remain bounded to 200 events');
const last=obs.events.at(-1);assert.equal(last.releaseId,syntheticRelease.releaseId);assert.equal(last.version,'9.9.9');assert.equal(last.sourceRef,syntheticSourceRef.slice(0,12));assert.equal(last.sequence,7);assert.equal(last.category,'SUPERGT');assert.equal(last.family,'large');assert.equal(last.path,'TRUSTED_LKG');assert.equal(last.ok,true);assert(Number.isFinite(last.ms)&&last.ms>=0);
for(const key of ['deviceId','email','latitude','longitude','advertisingId'])assert(!(key in last),`observability event must not contain ${key}`);

console.log('Motorsport Hub stable Loader v7 gate: PASS');
