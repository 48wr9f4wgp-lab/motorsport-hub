import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const router=fs.readFileSync(path.join(root,'motorsport-hub.js'),'utf8');
const moto=fs.readFileSync(path.join(root,'motogp-widget-flat-v1000.js'),'utf8');
assert.match(moto,/flattened MotoGP module/);
assert.match(moto,/CACHE_SCHEMA=1/);
assert.match(moto,/CACHE_MAX_AGE=7\*86400000/);
assert(moto.includes("Riders'? Championship|RIDERS'? CHAMPIONSHIP"),'MotoGP parser identity guard missing');
assert.doesNotMatch(moto,/eval\s*\(/,'flat MotoGP must not eval remote source');
assert.doesNotMatch(moto,/raw\.githubusercontent\.com/,'flat MotoGP must not fetch nested repo modules');

class Text {constructor(v,s){this.value=String(v);s.push(this.value)} rightAlignText(){}}
class Stack {constructor(s){this.s=s} addText(v){return new Text(v,this.s)} addSpacer(){} addStack(){return new Stack(this.s)} setPadding(){} layoutHorizontally(){} centerAlignContent(){}}
class ListWidget extends Stack {constructor(s){super(s);this.refreshAfterDate=null}}
class Color {constructor(){} static white(){return new Color()}}
class LinearGradient {constructor(){this.colors=[];this.locations=[]}}
class Size {constructor(w,h){this.width=w;this.height=h}}
class DateFormatter {constructor(){this.locale='';this.timeZone='';this.dateFormat=''} string(){return 'DATE'}}
const Font={heavySystemFont(){},boldSystemFont(){},semiboldSystemFont(){},systemFont(){}};
function FixedDateFactory(ms){return class FixedDate extends Date{constructor(...a){super(...a)}static now(){return ms}static parse(s){return Date.parse(s)}}}

async function run({now,seedCache=null,html=null}){
  const sink=[],files=new Map();
  const cachePath='/docs/motorsport-data-v1000-motogp.json';if(seedCache!==null)files.set(cachePath,seedCache);
  const DateClass=FixedDateFactory(Date.parse(now));
  let repoRequests=0,dataCalls=0,setWidget=0,complete=0;
  const fm={documentsDirectory:()=>'/docs',joinPath:(a,b)=>`${a}/${b}`,fileExists:p=>p.includes('motorsport-hero-v1000-')||files.has(p),readImage:()=>({size:{width:1600,height:900}}),writeImage(){},readString:p=>{if(!files.has(p))throw Error('missing');return files.get(p)},writeString:(p,s)=>files.set(p,String(s)),remove:p=>files.delete(p)};
  class Request{
    constructor(url){this.url=url;this.headers={}}
    async loadString(){
      if(this.url.includes('motogp-widget-flat-v1000.js')){repoRequests++;return moto}
      if(this.url.includes('stats.motogp.com/en/world-standing')){dataCalls++;if(html instanceof Error)throw html;if(typeof html==='string')return html;throw Error('offline standings')}
      throw Error('unexpected string request')
    }
    async loadImage(){throw Error('hero should use seeded image cache')}
  }
  const CtxListWidget=class extends ListWidget{constructor(){super(sink)}};
  const ctx={args:{widgetParameter:'MOTOGP'},config:{runsInWidget:true,widgetFamily:'medium'},FileManager:{local:()=>fm},Request,ListWidget:CtxListWidget,Color,LinearGradient,Size,DateFormatter,Font,Date:DateClass,Math,Map,Set,JSON,Number,String,Array,Object,RegExp,Error,decodeURIComponent,isFinite,Script:{setWidget(){setWidget++},complete(){complete++}}};ctx.globalThis=ctx;
  vm.createContext(ctx);await vm.runInContext(router,ctx,{timeout:5000});
  return{sink,files,cachePath,repoRequests,dataCalls,setWidget,complete};
}

{
  const active=await run({now:'2026-08-30T17:59:00+02:00'});
  assert.equal(active.repoRequests,1,'MotoGP flattened path must use one repo module request');
  assert.equal(active.dataCalls,1);
  assert(active.sink.includes('アラゴンGP'));
  assert(active.sink.includes('開催中'),'MotoGP must remain ACTIVE inside the 4h race window');
}
{
  const atEnd=await run({now:'2026-08-30T18:00:00+02:00'});
  assert(atEnd.sink.includes('サンマリノGP'),'exact 4h end boundary must advance to San Marino');
  assert(!atEnd.sink.includes('開催中'),'half-open boundary must not keep Aragon active at exact end');
}
{
  const finale=await run({now:'2026-11-29T16:00:00+01:00'});
  assert(finale.sink.includes('バレンシアGP'),'post-finale identity must remain Valencia');
  assert(finale.sink.includes('シーズン終了'));
  assert(finale.sink.includes('SEASON END'));
  assert(!finale.sink.includes('次戦'),'post-finale MotoGP must not claim a next race');
}

{
  const r=await run({now:'2026-11-29T16:00:00+01:00',seedCache:JSON.stringify({ranking:{}})});
  assert.equal(r.files.has(r.cachePath),false,'malformed MotoGP cache must be removed');
  assert.equal(r.setWidget,1);assert.equal(r.complete,1);
}

const validHtml=`<html><body><h1>Riders' Championship MotoGP 2026</h1><table>
<tr><th>Pos.</th><th>Rider</th><th>Nation</th><th>Team</th><th>Bike</th><th>Points</th><th>Gap</th></tr>
<tr><td>1</td><td>89Jorge Martin</td><td>ES</td><td>Aprilia Racing</td><td>Aprilia</td><td>240</td><td></td></tr>
<tr><td>2</td><td>72Marco Bezzecchi</td><td>IT</td><td>Aprilia Racing</td><td>Aprilia</td><td>209</td><td>-31</td></tr>
<tr><td>3</td><td>79Ai Ogura</td><td>JP</td><td>Trackhouse MotoGP Team</td><td>Aprilia</td><td>203</td><td>-37</td></tr>
</table></body></html>`;
{
  const r=await run({now:'2026-08-26T12:00:00+09:00',html:validHtml});
  const payload=JSON.parse(r.files.get(r.cachePath));
  assert.equal(payload.schemaVersion,1);assert.equal(payload.category,'motogp');assert.equal(payload.season,2026);
  assert.equal(payload.ranking[0].name,'Jorge Martin');assert.equal(payload.ranking[2].maker,'APRILIA');
}

{
  const wrong=`<html><body><h1>MotoGP Teams Championship</h1><table>
  <tr><td>1</td><td>Fake Rider</td><td>ES</td><td>Fake Team</td><td>Aprilia</td><td>999</td></tr>
  <tr><td>2</td><td>Fake Rider 2</td><td>IT</td><td>Fake Team</td><td>Ducati</td><td>998</td></tr>
  <tr><td>3</td><td>Fake Rider 3</td><td>JP</td><td>Fake Team</td><td>Honda</td><td>997</td></tr>
  </table></body></html>`;
  const r=await run({now:'2026-08-26T12:00:00+09:00',html:wrong});
  assert.equal(r.files.has(r.cachePath),false,'wrong MotoGP table identity must never be cached');
  assert(r.sink.includes('• 更新待ち'),'rejected table must leave the widget visibly non-fresh');
}

console.log('Motorsport Hub flattened MotoGP gate: PASS');
