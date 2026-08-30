import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {buildDescriptor,buildLoader} from '../tools/generate-release-package.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const sourceRef='1234567890abcdef1234567890abcdef12345678';
const registry=JSON.parse(fs.readFileSync(path.join(root,'category-registry.json'),'utf8'));
const descriptor=buildDescriptor(sourceRef);
const sha=s=>crypto.createHash('sha256').update(s,'utf8').digest('hex');

assert.equal(descriptor.schemaVersion,1);assert.equal(descriptor.sourceRef,sourceRef);assert.equal(descriptor.routerSchema,5);
assert.equal(Object.keys(descriptor.files).length,registry.categories.length+1,'release descriptor must include 12 category modules + QA');
assert(descriptor.files['dakar-widget.js'],'immutable release descriptor must include Dakar module');
const router=fs.readFileSync(path.join(root,'motorsport-hub.js'),'utf8');assert.equal(descriptor.router.sha256,sha(router));assert.equal(descriptor.router.bytes,Buffer.byteLength(router,'utf8'));
for(const c of registry.categories){const src=fs.readFileSync(path.join(root,c.module),'utf8');assert.equal(descriptor.files[c.module].sha256,sha(src),`${c.id}: release hash mismatch`);assert.equal(descriptor.files[c.module].bytes,Buffer.byteLength(src,'utf8'));}

const generated=buildLoader(descriptor);new Function(generated);assert(generated.includes(sourceRef));assert(generated.includes(descriptor.router.sha256));assert(generated.includes('__MH_RELEASE_INTEGRITY'));assert(generated.includes('dakar-widget.js'));assert(!generated.includes('/main/motorsport-hub.js'));

const manifest='F1,WEC,WRC,SUPERGT,MOTOGP,FDJ,D1GP,SUPERFORMULA,INDYCAR,NASCAR,GTWCEU,DAKAR,QA';
const synthetic=`// Motorsport Hub immutable fixture module router\n// MH_ROUTER_SCHEMA=5\n// MH_CATEGORY_MANIFEST=${manifest}\n// UTF-8: 日本語 ✓\n(async()=>{globalThis.__SYNTHETIC_ROUTER_EXECUTED=true;globalThis.__MH_ROUTER_SCHEMA=5;globalThis.__MH_ROUTER_MANIFEST='${manifest}';globalThis.__MH_ROUTER_BOOT_OK=true;Script.complete()})();\n`;
const syntheticDescriptor={schemaVersion:1,releaseId:'mh-synthetic',sourceRef,routerSchema:5,categoryManifest:manifest,router:{path:'motorsport-hub.js',sha256:sha(synthetic),bytes:Buffer.byteLength(synthetic,'utf8')},files:{}};
const loader=buildLoader(syntheticDescriptor);new Function(loader);

class Text{constructor(v,s){this.value=String(v);s.push(this.value)}}
class Stack{constructor(s){this.s=s}addText(v){return new Text(v,this.s)}addSpacer(){}addStack(){return new Stack(this.s)}setPadding(){}}
class ListWidget extends Stack{constructor(s){super(s);this.refreshAfterDate=null}}
class Color{constructor(){}static white(){return new Color()}}
const Font={boldSystemFont(){},systemFont(){}};
function fmWith(seed={}){const files=new Map(Object.entries(seed));return{files,documentsDirectory:()=>'/docs',joinPath:(a,b)=>`${a}/${b}`,fileExists:p=>files.has(p),readString:p=>{if(!files.has(p))throw Error('missing');return files.get(p)},writeString:(p,s)=>files.set(p,String(s)),remove:p=>files.delete(p)}}
async function run({response=synthetic,seed={}}={}){const sink=[],fm=fmWith(seed);let requests=0,complete=0,setWidget=0;class Request{constructor(url){this.url=url;this.headers={};requests++}async loadString(){if(response instanceof Error)throw response;return response}}const CtxListWidget=class extends ListWidget{constructor(){super(sink)}};const ctx={config:{runsInWidget:true,widgetFamily:'small'},FileManager:{local:()=>fm},Request,ListWidget:CtxListWidget,Color,Font,Date,Math,JSON,String,Number,Array,Object,RegExp,Error,Promise,Script:{complete(){complete++},setWidget(){setWidget++}}};ctx.globalThis=ctx;vm.createContext(ctx);await vm.runInContext(loader,ctx,{timeout:5000});return{ctx,sink,fm,requests,complete,setWidget};}

{const r=await run();assert.equal(r.ctx.__SYNTHETIC_ROUTER_EXECUTED,true);assert.equal(r.complete,1);assert.equal(r.setWidget,0);assert.equal(r.requests,1);const lkg='/docs/motorsport-hub-router-v6-mh-synthetic-lkg.js';assert.equal(r.fm.files.get(lkg),synthetic)}
{const r=await run({response:synthetic+'// tamper'});assert.equal(r.ctx.__SYNTHETIC_ROUTER_EXECUTED,undefined);assert.equal(r.setWidget,1);assert.equal(r.complete,1);assert(r.sink.some(x=>x.includes('固定Releaseを取得できません')))}
{const lkg='/docs/motorsport-hub-router-v6-mh-synthetic-lkg.js';const r=await run({response:new Error('offline'),seed:{[lkg]:synthetic}});assert.equal(r.ctx.__SYNTHETIC_ROUTER_EXECUTED,true);assert.equal(r.complete,1)}
console.log('Motorsport Hub immutable release package generator gate: PASS');
