import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const router=fs.readFileSync(path.join(root,'motorsport-hub.js'),'utf8');
const loader=fs.readFileSync(path.join(root,'scriptable-loader-v5.js'),'utf8');

class Text { constructor(value){this.value=value;} }
class Stack {addText(value){return new Text(value)} addSpacer(){} addStack(){return new Stack()} setPadding(){}}
class ListWidget extends Stack { constructor(){super();this.refreshAfterDate=null;} }
class Color { constructor(){} static white(){return new Color()} }
const Font={boldSystemFont(){},systemFont(){}};
function makeFM(seed={}){const files=new Map(Object.entries(seed));return{files,documentsDirectory:()=>'/docs',joinPath:(a,b)=>`${a}/${b}`,fileExists:p=>files.has(p),writeString:(p,s)=>files.set(p,String(s)),readString:p=>{if(!files.has(p))throw new Error('missing');return files.get(p)},remove:p=>files.delete(p)}}

async function runRouter(parameter){
 const requests=[];let completed=0,setWidget=0;
 class Request{
  constructor(url){this.url=url;this.headers={};requests.push(url)}
  async loadString(){
   if(this.url.includes('f1-widget-flat-v1000.js'))return"// Motorsport Hub flattened F1 pilot module\n(async()=>{Script.complete()})();";
   if(this.url.includes('wrc-widget-flat-v1000.js'))return"// Motorsport Hub flattened WRC module\n(async()=>{Script.complete()})();";
   if(this.url.includes('fdj-widget-flat-v1000.js'))return"// Motorsport Hub flattened Formula Drift Japan module\n(async()=>{Script.complete()})();";
   if(this.url.includes('motogp-widget-flat-v1000.js'))return"// Motorsport Hub flattened MotoGP module\n(async()=>{Script.complete()})();";
   if(this.url.includes('gtwc-europe-widget.js'))return"// Motorsport Hub GT World Challenge Europe module\n(async()=>{Script.complete()})();";
   if(this.url.includes('motorsport-reliability-v896.js'))return"// Motorsport Hub Reliability Pass\n(async()=>{Script.complete()})();";
   return"// Motorsport Hub QA diagnostics\n(async()=>{Script.complete()})();";
  }
 }
 const fm=makeFM(),ctx={args:{widgetParameter:parameter},config:{runsInWidget:true,widgetFamily:'medium'},FileManager:{local:()=>fm},Request,ListWidget,Color,Font,Date,Math,Script:{complete(){completed++},setWidget(){setWidget++}}};ctx.globalThis=ctx;vm.createContext(ctx);await vm.runInContext(router,ctx);return{requests,completed,setWidget,ctx};
}

for(const [parameter,file] of [
 ['F1','f1-widget-flat-v1000.js'],['Formula 1','f1-widget-flat-v1000.js'],
 ['WRC','wrc-widget-flat-v1000.js'],
 ['FDJ','fdj-widget-flat-v1000.js'],['Formula Drift Japan','fdj-widget-flat-v1000.js'],
 ['MotoGP','motogp-widget-flat-v1000.js'],
 ['GT World Challenge Europe','gtwc-europe-widget.js'],['GTWC Europe','gtwc-europe-widget.js']
]){
 const r=await runRouter(parameter);assert.equal(r.requests.length,1,`${parameter} should make exactly one module request`);assert(r.requests[0].includes(file),`${parameter} must route to ${file}`);
 if(['F1','WRC','FDJ','MotoGP','Formula 1','Formula Drift Japan'].includes(parameter))assert.doesNotMatch(r.requests[0],/motorsport-reliability-v896/);
}
{
 const r=await runRouter('INDYCARR');assert.equal(r.requests.length,0,'unknown widget parameter must not fetch a module');assert.equal(r.setWidget,1,'unknown widget parameter should render an explicit configuration error widget');
}
assert.match(router,/MH_ROUTER_SCHEMA=5/);assert.match(router,/MH_CATEGORY_MANIFEST=F1,WEC,WRC,SUPERGT,MOTOGP,FDJ,D1GP,SUPERFORMULA,INDYCAR,NASCAR,GTWCEU,QA/);
assert.match(loader,/motorsport-hub-router-v5-candidate\.js/);assert.match(loader,/motorsport-hub-router-v5-lkg\.js/);assert.match(loader,/motorsport-hub-router-v5-quarantine\.js/);assert.match(loader,/new Function/);

{
 const stale=`// Motorsport Hub v8.6.2 — module router\n// v8.6.0 motorsport-core-v841.js motorsport-hq-core.js fdj-widget.js\nglobalThis.__STALE_EXECUTED=true; Script.complete();`,lkg='/docs/motorsport-hub-router-v5-lkg.js',fm=makeFM({[lkg]:stale});let completed=0,setWidget=0;
 class Request{constructor(){this.headers={}}async loadString(){throw new Error('offline')}}
 const ctx={args:{widgetParameter:'SUPERFORMULA'},config:{runsInWidget:true,widgetFamily:'small'},FileManager:{local:()=>fm},Request,ListWidget,Color,Font,Date,Math,Script:{complete(){completed++},setWidget(){setWidget++}}};ctx.globalThis=ctx;vm.createContext(ctx);await vm.runInContext(loader,ctx);
 assert.equal(ctx.__STALE_EXECUTED,undefined);assert.equal(fm.files.has(lkg),false);assert.equal(setWidget,1);assert.equal(completed,1);
}

// Circuit breaker remains relevant for WEC / SUPER GT while they stay on the legacy wrapper path.
{
 let repoNetworkCalls=0,completed=0;
 const nestedModule=`// Motorsport Hub Reliability Pass\n(async()=>{for(let i=0;i<3;i++){try{const r=new Request('https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/main/legacy-'+i+'.js');await r.loadString()}catch(_){}}Script.complete()})();`;
 class Request{constructor(url){this.url=url;this.headers={}}async loadString(){if(this.url.includes('motorsport-reliability-v896.js'))return nestedModule;if(this.url.includes('raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/')){repoNetworkCalls++;throw new Error('repo raw outage')}return''}}
 const fm=makeFM(),ctx={args:{widgetParameter:'WEC'},config:{runsInWidget:true,widgetFamily:'medium'},FileManager:{local:()=>fm},Request,ListWidget,Color,Font,Date,Math,Script:{complete(){completed++},setWidget(){}}};ctx.globalThis=ctx;vm.createContext(ctx);await vm.runInContext(router,ctx);
 assert.equal(repoNetworkCalls,1);assert.equal(completed,1);
}
console.log('Motorsport Hub router hardening gate: PASS');
