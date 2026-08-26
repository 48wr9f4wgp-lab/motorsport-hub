import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const router=fs.readFileSync(path.join(root,'motorsport-hub.js'),'utf8');
const sourceRef='0123456789abcdef0123456789abcdef01234567';
const releaseId='integrity-test';
const moduleFile='f1-widget-flat-v1000.js';
const original=`// Motorsport Hub flattened F1 pilot module\n// UTF-8 integrity fixture: 日本語 ✓\n(async()=>{globalThis.__INTEGRITY_EXECUTED=true;Script.complete()})();\n`;
const digest=s=>crypto.createHash('sha256').update(s,'utf8').digest('hex');
const entry={sha256:digest(original),bytes:Buffer.byteLength(original,'utf8')};
const descriptor={schemaVersion:1,releaseId,sourceRef,files:{[moduleFile]:entry}};

class Text{constructor(value,sink){this.value=String(value);sink.push(this.value)}}
class Stack{constructor(sink){this.sink=sink}addText(v){return new Text(v,this.sink)}addSpacer(){}addStack(){return new Stack(this.sink)}setPadding(){}}
class ListWidget extends Stack{constructor(sink){super(sink);this.refreshAfterDate=null}}
class Color{constructor(){}static white(){return new Color()}}
const Font={boldSystemFont(){},systemFont(){}};
function fmWith(seed={}){const files=new Map(Object.entries(seed));return{files,documentsDirectory:()=>'/docs',joinPath:(a,b)=>`${a}/${b}`,fileExists:p=>files.has(p),readString:p=>{if(!files.has(p))throw Error('missing');return files.get(p)},writeString:(p,s)=>files.set(p,String(s)),remove:p=>files.delete(p)}}

async function run({response=original,integrity=descriptor,ref=sourceRef,offline=false,seed={}}={}){
 const sink=[],fm=fmWith(seed);let requests=0,complete=0,setWidget=0;
 class Request{constructor(url){this.url=url;this.headers={};requests++}async loadString(){if(response instanceof Error)throw response;return response}}
 const CtxListWidget=class extends ListWidget{constructor(){super(sink)}};
 const ctx={args:{widgetParameter:'F1'},config:{runsInWidget:true,widgetFamily:'small'},FileManager:{local:()=>fm},Request,ListWidget:CtxListWidget,Color,Font,Date,Math,Map,Set,JSON,Number,String,Array,Object,RegExp,Error,Promise,decodeURIComponent,isFinite,Script:{complete(){complete++},setWidget(){setWidget++}},__MH_SOURCE_REF:ref,__MH_RELEASE_INTEGRITY:integrity};
 if(offline)ctx.__MH_REMOTE_OFFLINE=true;ctx.globalThis=ctx;vm.createContext(ctx);await vm.runInContext(router,ctx,{timeout:5000});return{ctx,sink,fm,requests,complete,setWidget};
}

assert(router.includes('sha256Hex'),'Router SHA-256 implementation missing');
assert(router.includes('__MH_RELEASE_INTEGRITY'),'Router integrity descriptor support missing');
assert(router.includes('integrityEntry.bytes'),'Router byte-length verification missing');

{
 const r=await run();
 assert.equal(r.ctx.__INTEGRITY_EXECUTED,true,'valid SHA-256 candidate must execute');
 assert.equal(r.complete,1);assert.equal(r.setWidget,0);assert.equal(r.requests,1);
 const cache='/docs/motorsport-hub-module-f1-flat-v1000-integrity-test.js';
 assert.equal(r.fm.files.get(cache),original,'verified candidate should be cached under release namespace');
}
{
 const r=await run({response:original+'// tampered\n'});
 assert.equal(r.ctx.__INTEGRITY_EXECUTED,undefined,'tampered module must never execute');
 assert.equal(r.setWidget,1,'tampered module should fail closed');assert.equal(r.complete,1);
 assert(r.sink.some(x=>x.includes('安全に実行できません')),'tamper failure message missing');
}
{
 const wrong={...descriptor,sourceRef:'ffffffffffffffffffffffffffffffffffffffff'};
 const r=await run({integrity:wrong});
 assert.equal(r.requests,0,'sourceRef mismatch must fail before network fetch');
 assert.equal(r.ctx.__INTEGRITY_EXECUTED,undefined);assert.equal(r.setWidget,1);
}
{
 const cache='/docs/motorsport-hub-module-f1-flat-v1000-integrity-test.js';
 const r=await run({offline:true,response:new Error('offline'),seed:{[cache]:original}});
 assert.equal(r.requests,0,'offline integrity mode should use verified release cache without network');
 assert.equal(r.ctx.__INTEGRITY_EXECUTED,true);assert.equal(r.complete,1);
}
{
 const cache='/docs/motorsport-hub-module-f1-flat-v1000-integrity-test.js';
 const r=await run({offline:true,seed:{[cache]:original+'corrupt'}});
 assert.equal(r.ctx.__INTEGRITY_EXECUTED,undefined,'corrupt integrity cache must never execute');
 assert.equal(r.fm.files.has(cache),false,'corrupt integrity cache must be removed');
 assert.equal(r.setWidget,1);
}

console.log('Motorsport Hub immutable integrity gate: PASS');
