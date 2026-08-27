import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const router=fs.readFileSync(path.join(root,'motorsport-hub.js'),'utf8');
const dakar=fs.readFileSync(path.join(root,'dakar-widget.js'),'utf8');

assert(router.includes('args.queryParameters?.mhCategory'),'Router must accept tap-action category query');
for(const token of ['Tap Action v2','motorsport-ui-v1-dakar.json','HERO_VARIANTS','1X7A2026.jpg','1X7A2028.jpg','1X7A2029.jpg','mhAction=cycleHero','URLScheme.forRunningScript','heroVariant'])assert(dakar.includes(token),`Dakar tap invariant missing: ${token}`);

class Text{constructor(v,s){this.value=String(v);s.push(this.value)}rightAlignText(){}}
class Stack{constructor(s){this.s=s;this.url=null}addText(v){return new Text(v,this.s)}addSpacer(){}addStack(){return new Stack(this.s)}setPadding(){}layoutHorizontally(){}centerAlignContent(){}}
class ListWidget extends Stack{constructor(s){super(s);this.refreshAfterDate=null}}
class Color{constructor(){}static white(){return new Color()}}
class LinearGradient{constructor(){this.colors=[];this.locations=[]}}
class Size{constructor(w,h){this.width=w;this.height=h}}
const Font={heavySystemFont(){},boldSystemFont(){},semiboldSystemFont(){},systemFont(){}};
function FixedDateFactory(ms){return class FixedDate extends Date{constructor(...a){super(...a)}static now(){return ms}static parse(s){return Date.parse(s)}}}
const FIXTURE=`<table><tr><th>P.</th><th>N°</th><th>Exp.</th><th>Pilote/Véhicule</th><th>Équipe</th><th>Temps</th><th>Écart</th></tr>
<tr><td>1</td><td>299</td><td></td><td>The Dacia Sandriders (qat) NASSER AL-ATTIYAH (bel) FABIAN LURQUIN</td><td>The Dacia Sandriders</td><td>48h 56' 53''</td><td></td></tr>
<tr><td>2</td><td>227</td><td></td><td>FORD RACING (esp) NANI ROMA (esp) ALEX HARO</td><td>FORD RACING</td><td>49h 06' 35''</td><td>+ 00h 09' 42''</td></tr>
<tr><td>3</td><td>226</td><td></td><td>FORD RACING (swe) MATTIAS EKSTRÖM (swe) EMIL BERGKVIST</td><td>FORD RACING</td><td>49h 11' 26''</td><td>+ 00h 14' 33''</td></tr></table>`;

// Router query parameter must bypass the picker and go directly to Dakar.
{
 const requests=[];let complete=0;
 class Request{constructor(url){this.url=url;this.headers={};requests.push(url)}async loadString(){return`// Motorsport Hub DAKAR dedicated rally-raid module\n(async()=>{globalThis.__TAP_ROUTED=true;Script.complete()})();`}}
 const fm={documentsDirectory:()=>'/docs',joinPath:(a,b)=>`${a}/${b}`,fileExists:()=>false,writeString(){},readString(){throw Error('missing')},remove(){}};
 const ctx={args:{widgetParameter:'',queryParameters:{mhCategory:'DAKAR'}},config:{runsInWidget:false,widgetFamily:null},FileManager:{local:()=>fm},Request,ListWidget:class extends ListWidget{constructor(){super([])}},Color,Font,Date,Math,Map,Set,JSON,Number,String,Array,Object,RegExp,Error,Promise,decodeURIComponent,isFinite,Script:{complete(){complete++},setWidget(){}}};ctx.globalThis=ctx;
 vm.createContext(ctx);await vm.runInContext(router,ctx,{timeout:5000});
 assert.equal(ctx.__TAP_ROUTED,true,'query-category route did not execute Dakar');
 assert.equal(requests.length,1,'tap query should fetch exactly one module');
 assert(requests[0].includes('dakar-widget.js'),'tap query routed to wrong module');
 assert.equal(complete,1);
}

async function runTap(files){
 const sink=[];let widget=null,complete=0;
 const fm={
  documentsDirectory:()=>'/docs',joinPath:(a,b)=>`${a}/${b}`,
  fileExists:p=>p.includes('motorsport-hero-v952-')||files.has(p),
  readImage:()=>({size:{width:1800,height:1200}}),writeImage(){},
  readString:p=>{if(!files.has(p))throw Error('missing');return files.get(p)},
  writeString:(p,s)=>files.set(p,String(s)),remove:p=>files.delete(p)
 };
 class Request{constructor(url){this.url=url;this.headers={}}async loadString(){return FIXTURE}async loadImage(){throw Error('hero cache expected')}async loadJSON(){throw Error('unexpected json')}}
 const CtxListWidget=class extends ListWidget{constructor(){super(sink)}};
 const DateClass=FixedDateFactory(Date.parse('2026-08-26T12:00:00+09:00'));
 const ctx={
  args:{widgetParameter:'DAKAR',queryParameters:{mhCategory:'DAKAR',mhAction:'cycleHero'}},
  config:{runsInWidget:true,widgetFamily:'medium'},
  FileManager:{local:()=>fm},Request,ListWidget:CtxListWidget,Color,LinearGradient,Size,Font,Date:DateClass,Math,Map,Set,JSON,Number,String,Array,Object,RegExp,Error,Promise,isFinite,
  URLScheme:{forRunningScript:()=> 'scriptable:///run/Motorsport%20Hub%20HARDENING'},
  Script:{setWidget(w){widget=w},complete(){complete++}}
 };
 ctx.globalThis=ctx;vm.createContext(ctx);await vm.runInContext(dakar,ctx,{timeout:5000});
 assert(widget,'tap action did not render widget');assert.equal(complete,1);
 return{widget,sink};
}

const files=new Map();
{
 const r=await runTap(files),state=JSON.parse(files.get('/docs/motorsport-ui-v1-dakar.json'));
 assert.equal(state.heroVariant,1,'first tap must advance hero 0→1');
 assert(r.widget.url.includes('mhCategory=DAKAR&mhAction=cycleHero'),'widget tap URL missing action query');
 assert(r.sink.includes('H2/3'),'first tap preview should expose Hero 2/3');
}
{
 const r=await runTap(files),state=JSON.parse(files.get('/docs/motorsport-ui-v1-dakar.json'));
 assert.equal(state.heroVariant,2,'second tap must advance hero 1→2');
 assert(r.sink.includes('H3/3'),'second tap preview should expose Hero 3/3');
}
{
 const r=await runTap(files),state=JSON.parse(files.get('/docs/motorsport-ui-v1-dakar.json'));
 assert.equal(state.heroVariant,0,'third tap must wrap hero 2→0');
 assert(r.sink.includes('H1/3'),'third tap preview should wrap to Hero 1/3');
}

console.log('Motorsport Hub tap action gate: PASS');
