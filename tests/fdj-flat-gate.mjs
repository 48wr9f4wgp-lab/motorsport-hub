import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const router=fs.readFileSync(path.join(root,'motorsport-hub.js'),'utf8');
const fdj=fs.readFileSync(path.join(root,'fdj-widget-flat-v1000.js'),'utf8');
assert.match(fdj,/flattened Formula Drift Japan module/);
assert.match(fdj,/CACHE_SCHEMA=1/);
assert.match(fdj,/CACHE_MAX_AGE=7\*86400000/);
assert.doesNotMatch(fdj,/eval\s*\(/,'flat FDJ must not eval remote source');
assert.doesNotMatch(fdj,/raw\.githubusercontent\.com/,'flat FDJ must not fetch nested repo modules');
assert.match(fdj,/hold=40\*3600000/,'FDJ must preserve the two-day event hold');

class Text {constructor(v,s){this.value=String(v);s.push(this.value)} rightAlignText(){}}
class Stack {constructor(s){this.s=s} addText(v){return new Text(v,this.s)} addSpacer(){} addStack(){return new Stack(this.s)} setPadding(){} layoutHorizontally(){} centerAlignContent(){}}
class ListWidget extends Stack {constructor(s){super(s);this.refreshAfterDate=null}}
class Color {constructor(){} static white(){return new Color()}}
class LinearGradient {constructor(){this.colors=[];this.locations=[]}}
class Size {constructor(w,h){this.width=w;this.height=h}}
class DateFormatter {constructor(){this.locale='';this.timeZone='';this.dateFormat=''} string(){return 'DATE'}}
const Font={heavySystemFont(){},boldSystemFont(){},semiboldSystemFont(){},systemFont(){}};
function FixedDateFactory(ms){return class FixedDate extends Date{constructor(...a){super(...a)}static now(){return ms}static parse(s){return Date.parse(s)}}}

async function run({now,seedCache=null,standingsHtml=null}){
  const sink=[],files=new Map();
  const cachePath='/docs/motorsport-data-v1000-fdj.json';if(seedCache!==null)files.set(cachePath,seedCache);
  const DateClass=FixedDateFactory(Date.parse(now));
  let repoRequests=0,dataCalls=0,setWidget=0,complete=0;
  const fm={documentsDirectory:()=>'/docs',joinPath:(a,b)=>`${a}/${b}`,fileExists:p=>p.includes('motorsport-hero-v1000-')||files.has(p),readImage:()=>({size:{width:1600,height:900}}),writeImage(){},readString:p=>{if(!files.has(p))throw Error('missing');return files.get(p)},writeString:(p,s)=>files.set(p,String(s)),remove:p=>files.delete(p)};
  class Request{
    constructor(url){this.url=url;this.headers={}}
    async loadString(){
      if(this.url.includes('fdj-widget-flat-v1000.js')){repoRequests++;return fdj}
      if(this.url.includes('formulad.jp/2026-fdj-standings/')){dataCalls++;if(standingsHtml instanceof Error)throw standingsHtml;if(typeof standingsHtml==='string')return standingsHtml;throw Error('offline standings')}
      throw Error('unexpected string request')
    }
    async loadImage(){throw Error('hero should use seeded image cache')}
  }
  const CtxListWidget=class extends ListWidget{constructor(){super(sink)}};
  const ctx={args:{widgetParameter:'FDJ'},config:{runsInWidget:true,widgetFamily:'medium'},FileManager:{local:()=>fm},Request,ListWidget:CtxListWidget,Color,LinearGradient,Size,DateFormatter,Font,Date:DateClass,Math,Map,Set,JSON,Number,String,Array,Object,RegExp,Error,decodeURIComponent,Script:{setWidget(){setWidget++},complete(){complete++}}};ctx.globalThis=ctx;
  vm.createContext(ctx);await vm.runInContext(router,ctx,{timeout:5000});
  return{sink,files,cachePath,repoRequests,dataCalls,setWidget,complete};
}

// Event start + 39h59m is ACTIVE. Exact +40h boundary advances to the next event or season end.
{
  const active=await run({now:'2026-10-04T00:59:00+09:00'});
  assert.equal(active.repoRequests,1,'FDJ flattened path must use one repo module request');
  assert.equal(active.dataCalls,1);
  assert(active.sink.includes('第6戦 岡山'));
  assert(active.sink.includes('開催中'),'FDJ must remain ACTIVE inside the 40h hold');
}
{
  const ended=await run({now:'2026-10-05T01:00:00+09:00'});
  assert(ended.sink.includes('第6戦 岡山'),'FDJ finale identity must remain the final event');
  assert(ended.sink.includes('シーズン終了'),'FDJ finale must switch header after the 40h hold');
  assert(ended.sink.includes('SEASON END'));
  assert(!ended.sink.includes('次戦'),'FDJ finale must not claim a historical next event');
}

// Codex RC-06 reproduction: invalid ranking shape must be removed and never rendered as validated cache.
{
  const r=await run({now:'2026-10-05T01:00:00+09:00',seedCache:JSON.stringify({ranking:{}})});
  assert.equal(r.files.has(r.cachePath),false,'malformed FDJ cache must be removed');
  assert.equal(r.setWidget,1);assert.equal(r.complete,1);
}

// A valid live table should promote a schema envelope.
{
  const html=`<table>
    <tr><td>1</td><td>18</td><td>CONNOR XIA</td><td>x</td><td>x</td><td>x</td><td>x</td><td>x</td><td>x</td><td>231</td></tr>
    <tr><td>2</td><td>131</td><td>RYUMA RYUMA</td><td>x</td><td>x</td><td>x</td><td>x</td><td>x</td><td>x</td><td>230</td></tr>
    <tr><td>3</td><td>36</td><td>KAZUMI TAKAHASHI</td><td>x</td><td>x</td><td>x</td><td>x</td><td>x</td><td>x</td><td>226</td></tr>
  </table>`;
  const r=await run({now:'2026-09-01T00:00:00+09:00',standingsHtml:html});
  assert.equal(r.repoRequests,1);assert.equal(r.dataCalls,1);
  const payload=JSON.parse(r.files.get(r.cachePath));
  assert.equal(payload.schemaVersion,1);assert.equal(payload.category,'fdj');assert.equal(payload.season,2026);
  assert(Array.isArray(payload.ranking)&&payload.ranking.length>=3);
  assert.equal(payload.ranking[1].name,'RYUMA','duplicate RYUMA text must normalize');
}

console.log('Motorsport Hub flattened FDJ gate: PASS');
