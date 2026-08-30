import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const router=fs.readFileSync(path.join(root,'motorsport-hub.js'),'utf8');
const loader=fs.readFileSync(path.join(root,'scriptable-loader-v5.js'),'utf8');

class Text{constructor(value){this.value=value}}
class Stack{addText(value){return new Text(value)}addSpacer(){}addStack(){return new Stack()}setPadding(){}}
class ListWidget extends Stack{constructor(){super();this.refreshAfterDate=null}}
class Color{constructor(){}static white(){return new Color()}}
const Font={boldSystemFont(){},systemFont(){}};
function makeFM(seed={}){const files=new Map(Object.entries(seed));return{files,documentsDirectory:()=>'/docs',joinPath:(a,b)=>`${a}/${b}`,fileExists:p=>files.has(p),writeString:(p,s)=>files.set(p,String(s)),readString:p=>{if(!files.has(p))throw new Error('missing');return files.get(p)},remove:p=>files.delete(p)}}

const markerByFile={
 'f1-widget-flat-v1000.js':'flattened F1 pilot module','wec-widget-flat-v1000.js':'flattened WEC module','wrc-widget-flat-v1000.js':'flattened WRC module','supergt-widget-flat-v1000.js':'flattened SUPER GT module','motogp-widget-flat-v1000.js':'flattened MotoGP module','fdj-widget-flat-v1000.js':'flattened Formula Drift Japan module','d1gp-widget-flat-v1000.js':'flattened D1GP module','superformula-widget.js':'SUPER FORMULA module','indycar-widget.js':'INDYCAR module','nascar-widget.js':'NASCAR Cup Series module','gtwc-europe-widget.js':'GT World Challenge Europe module','dakar-widget.js':'DAKAR dedicated rally-raid module','motorsport-diagnostics-v890.js':'QA diagnostics'
};
async function runRouter(parameter){
 const requests=[];let completed=0,setWidget=0;
 class Request{
  constructor(url){this.url=url;this.headers={};requests.push(url)}
  async loadString(){for(const[file,marker]of Object.entries(markerByFile))if(this.url.includes(file))return`// Motorsport Hub ${marker}\n(async()=>{Script.complete()})();`;throw new Error('unexpected string request')}
  async loadJSON(){if(this.url.includes('/hero-live/hero-channel/channel.json'))return{schemaVersion:1,generatedAt:new Date().toISOString(),categories:{}};throw new Error('unexpected json request')}
 }
 const fm=makeFM(),ctx={args:{widgetParameter:parameter},config:{runsInWidget:true,widgetFamily:'medium'},FileManager:{local:()=>fm},Request,ListWidget,Color,Font,Date,Math,Script:{complete(){completed++},setWidget(){setWidget++}}};ctx.globalThis=ctx;vm.createContext(ctx);await vm.runInContext(router,ctx);return{requests,completed,setWidget,ctx};
}

const directCases=[
 ['F1','f1-widget-flat-v1000.js'],['Formula 1','f1-widget-flat-v1000.js'],['WEC','wec-widget-flat-v1000.js'],['WRC','wrc-widget-flat-v1000.js'],['SUPERGT','supergt-widget-flat-v1000.js'],['SUPER GT','supergt-widget-flat-v1000.js'],['MotoGP','motogp-widget-flat-v1000.js'],['FDJ','fdj-widget-flat-v1000.js'],['Formula Drift Japan','fdj-widget-flat-v1000.js'],['D1GP','d1gp-widget-flat-v1000.js'],['D1 Grand Prix','d1gp-widget-flat-v1000.js'],['SUPERFORMULA','superformula-widget.js'],['SF','superformula-widget.js'],['INDYCAR','indycar-widget.js'],['INDY','indycar-widget.js'],['NASCAR','nascar-widget.js'],['NASCAR Cup Series','nascar-widget.js'],['GT World Challenge Europe','gtwc-europe-widget.js'],['GTWC Europe','gtwc-europe-widget.js'],['DAKAR','dakar-widget.js'],['Dakar Rally','dakar-widget.js']
];
for(const[parameter,file]of directCases){
 const r=await runRouter(parameter),moduleRequests=r.requests.filter(x=>x.includes(file)),heroRequests=r.requests.filter(x=>x.includes('/hero-live/hero-channel/channel.json'));
 assert.equal(moduleRequests.length,1,`${parameter} should make exactly one category-module request`);
 if(file==='dakar-widget.js')assert.equal(heroRequests.length,0,'Dakar must keep its dedicated Hero runtime and skip the generic channel');
 else assert.equal(heroRequests.length,1,`${parameter} should make exactly one allowlisted Hero-channel manifest request`);
 assert(r.requests.every(x=>x.includes('raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/')),`${parameter}: unexpected network origin`);
}
{
 const r=await runRouter('INDYCARR');assert.equal(r.requests.length,0,'unknown widget parameter must not fetch a module or Hero channel');assert.equal(r.setWidget,1,'unknown widget parameter should render an explicit configuration error widget');
}

assert.match(router,/MH_ROUTER_SCHEMA=5/);assert.match(router,/MH_CATEGORY_MANIFEST=F1,WEC,WRC,SUPERGT,MOTOGP,FDJ,D1GP,SUPERFORMULA,INDYCAR,NASCAR,GTWCEU,DAKAR,QA/);
assert.doesNotMatch(router,/motorsport-reliability-v896\.js/);assert.doesNotMatch(router,/Request\.prototype\.loadString\s*=/);assert.doesNotMatch(router,/hardenExpansionLifecycle/);assert.doesNotMatch(router,/HARDENING_PATCH_MISMATCH/);assert.doesNotMatch(router,/replaceExact\s*\(/);
for(const file of Object.keys(markerByFile))assert(router.includes(file),`Router missing direct module ${file}`);
assert.match(loader,/motorsport-hub-router-v5-candidate\.js/);assert.match(loader,/motorsport-hub-router-v5-lkg\.js/);assert.match(loader,/motorsport-hub-router-v5-quarantine\.js/);assert.match(loader,/new Function/);

{
 const stale=`// Motorsport Hub v8.6.2 — module router\n// v8.6.0 motorsport-core-v841.js motorsport-hq-core.js fdj-widget.js\nglobalThis.__STALE_EXECUTED=true; Script.complete();`,lkg='/docs/motorsport-hub-router-v5-lkg.js',fm=makeFM({[lkg]:stale});let completed=0,setWidget=0;
 class Request{constructor(){this.headers={}}async loadString(){throw new Error('offline')}}
 const ctx={args:{widgetParameter:'DAKAR'},config:{runsInWidget:true,widgetFamily:'small'},FileManager:{local:()=>fm},Request,ListWidget,Color,Font,Date,Math,Script:{complete(){completed++},setWidget(){setWidget++}}};ctx.globalThis=ctx;vm.createContext(ctx);await vm.runInContext(loader,ctx);
 assert.equal(ctx.__STALE_EXECUTED,undefined);assert.equal(fm.files.has(lkg),false);assert.equal(setWidget,1);assert.equal(completed,1);
}
console.log('Motorsport Hub router hardening gate: PASS');
