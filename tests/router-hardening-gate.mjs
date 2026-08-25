import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const router=fs.readFileSync(path.join(root,'motorsport-hub.js'),'utf8');
const loader=fs.readFileSync(path.join(root,'scriptable-loader-v5.js'),'utf8');

class Text { constructor(value){this.value=value;} }
class Stack {
  addText(value){return new Text(value)}
  addSpacer(){}
  addStack(){return new Stack()}
  setPadding(){}
}
class ListWidget extends Stack { constructor(){super();this.refreshAfterDate=null;} }
class Color { constructor(){} static white(){return new Color()} }
const Font={boldSystemFont(){},systemFont(){}};

function makeFM(seed={}){
  const files=new Map(Object.entries(seed));
  return {
    files,
    documentsDirectory:()=>'/docs',
    joinPath:(a,b)=>`${a}/${b}`,
    fileExists:p=>files.has(p),
    writeString:(p,s)=>files.set(p,String(s)),
    readString:p=>{if(!files.has(p))throw new Error('missing');return files.get(p)},
    remove:p=>files.delete(p),
  };
}

async function runRouter(parameter){
  const requests=[];
  let completed=0,setWidget=0;
  class Request {
    constructor(url){this.url=url;this.headers={};requests.push(url)}
    async loadString(){
      if(this.url.includes('gtwc-europe-widget.js'))return "// Motorsport Hub GT World Challenge Europe module\n(async()=>{Script.complete()})();";
      if(this.url.includes('motorsport-reliability-v896.js'))return "// Motorsport Hub Reliability Pass\n(async()=>{Script.complete()})();";
      return "// Motorsport Hub QA diagnostics\n(async()=>{Script.complete()})();";
    }
  }
  const fm=makeFM();
  const ctx={
    args:{widgetParameter:parameter},config:{runsInWidget:true,widgetFamily:'medium'},
    FileManager:{local:()=>fm},Request,ListWidget,Color,Font,Date,Math,
    Script:{complete(){completed++},setWidget(){setWidget++}},
  };
  ctx.globalThis=ctx;
  vm.createContext(ctx);
  await vm.runInContext(router,ctx);
  return {requests,completed,setWidget,ctx};
}

{
  const r=await runRouter('GT World Challenge Europe');
  assert.equal(r.requests.length,1,'full GTWC display name should make exactly one module request');
  assert.match(r.requests[0],/gtwc-europe-widget\.js/,'full GTWC display name must route to GTWC module');
}

{
  const r=await runRouter('GTWC Europe');
  assert.equal(r.requests.length,1);
  assert.match(r.requests[0],/gtwc-europe-widget\.js/);
}

{
  const r=await runRouter('INDYCARR');
  assert.equal(r.requests.length,0,'unknown widget parameter must not fetch the legacy/F1 path');
  assert.equal(r.setWidget,1,'unknown widget parameter should render an explicit configuration error widget');
}

assert.match(router,/MH_ROUTER_SCHEMA=5/,'router schema marker missing');
assert.match(router,/MH_CATEGORY_MANIFEST=F1,WEC,WRC,SUPERGT,MOTOGP,FDJ,D1GP,SUPERFORMULA,INDYCAR,NASCAR,GTWCEU,QA/,'router manifest marker missing');
assert.match(loader,/motorsport-hub-router-v5-candidate\.js/);
assert.match(loader,/motorsport-hub-router-v5-lkg\.js/);
assert.match(loader,/motorsport-hub-router-v5-quarantine\.js/);
assert.match(loader,/new Function/,'loader must syntax-preflight router candidates');

// A real v4/v8.6-style cached router can contain the old compatibility markers but lacks schema 5.
// Loader v5 must refuse to execute it while offline instead of silently restoring it.
{
  const stale=`// Motorsport Hub v8.6.2 — module router\n// v8.6.0 motorsport-core-v841.js motorsport-hq-core.js fdj-widget.js\nglobalThis.__STALE_EXECUTED=true; Script.complete();`;
  const lkg='/docs/motorsport-hub-router-v5-lkg.js';
  const fm=makeFM({[lkg]:stale});
  let completed=0,setWidget=0;
  class Request {
    constructor(){this.headers={}}
    async loadString(){throw new Error('offline')}
  }
  const ctx={
    args:{widgetParameter:'SUPERFORMULA'},config:{runsInWidget:true,widgetFamily:'small'},
    FileManager:{local:()=>fm},Request,ListWidget,Color,Font,Date,Math,
    Script:{complete(){completed++},setWidget(){setWidget++}},
  };
  ctx.globalThis=ctx;
  vm.createContext(ctx);
  await vm.runInContext(loader,ctx);
  assert.equal(ctx.__STALE_EXECUTED,undefined,'stale v4 router cache must never execute under loader v5');
  assert.equal(fm.files.has(lkg),false,'invalid stale LKG should be removed');
  assert.equal(setWidget,1,'loader should render a safe failure widget when no current LKG exists');
  assert.equal(completed,1);
}

// When the first nested repo-raw request fails, later legacy-wrapper repo requests should fail locally
// without reaching the underlying network implementation again.
{
  let repoNetworkCalls=0,completed=0;
  const nestedModule=`// Motorsport Hub Reliability Pass\n(async()=>{for(let i=0;i<3;i++){try{const r=new Request('https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/main/legacy-'+i+'.js');await r.loadString()}catch(_){}}Script.complete()})();`;
  class Request {
    constructor(url){this.url=url;this.headers={}}
    async loadString(){
      if(this.url.includes('motorsport-reliability-v896.js'))return nestedModule;
      if(this.url.includes('raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/')){repoNetworkCalls++;throw new Error('repo raw outage')}
      return'';
    }
  }
  const fm=makeFM();
  const ctx={
    args:{widgetParameter:'F1'},config:{runsInWidget:true,widgetFamily:'medium'},
    FileManager:{local:()=>fm},Request,ListWidget,Color,Font,Date,Math,
    Script:{complete(){completed++},setWidget(){}},
  };
  ctx.globalThis=ctx;
  vm.createContext(ctx);
  await vm.runInContext(router,ctx);
  assert.equal(repoNetworkCalls,1,'only the first failed nested repo request should hit the underlying network');
  assert.equal(completed,1);
}

console.log('Motorsport Hub router hardening gate: PASS');
