import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const router=fs.readFileSync(path.join(root,'motorsport-hub.js'),'utf8');
const wrc=fs.readFileSync(path.join(root,'wrc-widget-flat-v1000.js'),'utf8');
assert.match(wrc,/flattened WRC module/);
assert.match(wrc,/CACHE_SCHEMA=1/);
assert.match(wrc,/2026 FIA World Rally Championship for Drivers/);
assert.match(wrc,/hold=4\*86400000/);
assert.doesNotMatch(wrc,/eval\s*\(/,'flat WRC must not eval remote source');
assert.doesNotMatch(wrc,/raw\.githubusercontent\.com/,'flat WRC must not fetch nested repo modules');

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
 const sink=[],files=new Map(),cachePath='/docs/motorsport-data-v1000-wrc.json';if(seedCache!==null)files.set(cachePath,seedCache);
 const DateClass=FixedDateFactory(Date.parse(now));let repoRequests=0,dataCalls=0,setWidget=0,complete=0;
 const fm={documentsDirectory:()=>'/docs',joinPath:(a,b)=>`${a}/${b}`,fileExists:p=>p.includes('motorsport-hero-v1000-')||files.has(p),readImage:()=>({size:{width:1600,height:900}}),writeImage(){},readString:p=>{if(!files.has(p))throw Error('missing');return files.get(p)},writeString:(p,s)=>files.set(p,String(s)),remove:p=>files.delete(p)};
 class Request{
  constructor(url){this.url=url;this.headers={}}
  async loadString(){
   if(this.url.includes('wrc-widget-flat-v1000.js')){repoRequests++;return wrc}
   if(this.url.includes('fia.com/events/world-rally-championship/season-2026/standings')){dataCalls++;if(html instanceof Error)throw html;if(typeof html==='string')return html;throw Error('offline standings')}
   throw Error('unexpected string request')
  }
  async loadImage(){throw Error('hero should use seeded cache')}
 }
 const CtxListWidget=class extends ListWidget{constructor(){super(sink)}};
 const ctx={args:{widgetParameter:'WRC'},config:{runsInWidget:true,widgetFamily:'medium'},FileManager:{local:()=>fm},Request,ListWidget:CtxListWidget,Color,LinearGradient,Size,DateFormatter,Font,Date:DateClass,Math,Map,Set,JSON,Number,String,Array,Object,RegExp,Error,decodeURIComponent,isFinite,Script:{setWidget(){setWidget++},complete(){complete++}}};ctx.globalThis=ctx;
 vm.createContext(ctx);await vm.runInContext(router,ctx,{timeout:5000});return{sink,files,cachePath,repoRequests,dataCalls,setWidget,complete};
}

{
 const active=await run({now:'2026-08-31T08:59:00-03:00'});
 assert.equal(active.repoRequests,1,'WRC flattened path must use one repo module request');assert.equal(active.dataCalls,1);
 assert(active.sink.includes('ラリー・パラグアイ'));assert(active.sink.includes('開催中'),'Paraguay must remain active inside the 96h hold');
}
{
 const atEnd=await run({now:'2026-08-31T09:00:00-03:00'});
 assert(atEnd.sink.includes('ラリー・チリ'),'exact 96h boundary must advance to Chile');assert(!atEnd.sink.includes('開催中'));
}
{
 const finale=await run({now:'2026-11-15T09:00:00+03:00'});
 assert(finale.sink.includes('ラリー・サウジアラビア'));assert(finale.sink.includes('シーズン終了'));assert(finale.sink.includes('SEASON END'));assert(!finale.sink.includes('次戦'));
}
{
 const r=await run({now:'2026-11-15T09:00:00+03:00',seedCache:JSON.stringify({ranking:{}})});
 assert.equal(r.files.has(r.cachePath),false,'malformed WRC cache must be removed');assert.equal(r.setWidget,1);assert.equal(r.complete,1);
}

const validHtml=`<html><body><h2>2026 FIA World Rally Championship for Drivers</h2><table>
<tr><th>Pos</th><th>Drivers</th><th>MON</th><th>Pts</th></tr>
<tr><td>1</td><td>Elfyn EVANS Image GBR</td><td>x</td><td>201</td></tr>
<tr><td>2</td><td>Sami PAJARI Image FIN</td><td>x</td><td>171</td></tr>
<tr><td>3</td><td>Takamoto KATSUTA Image JPN</td><td>x</td><td>160</td></tr>
</table><h2>2026 FIA WRC Masters Cup</h2></body></html>`;
{
 const r=await run({now:'2026-08-26T12:00:00+09:00',html:validHtml});const p=JSON.parse(r.files.get(r.cachePath));
 assert.equal(p.schemaVersion,1);assert.equal(p.category,'wrc');assert.equal(p.season,2026);assert.equal(p.ranking[0].name,'Elfyn Evans');assert.equal(p.ranking[2].maker,'TOYOTA');
}
{
 const wrong=`<html><body><h2>2026 FIA WRC3 Championship for Drivers</h2><table><tr><td>1</td><td>Fake Driver</td><td>999</td></tr><tr><td>2</td><td>Fake Driver 2</td><td>998</td></tr><tr><td>3</td><td>Fake Driver 3</td><td>997</td></tr></table></body></html>`;
 const r=await run({now:'2026-08-26T12:00:00+09:00',html:wrong});assert.equal(r.files.has(r.cachePath),false,'wrong FIA table must not be promoted');assert(r.sink.includes('• 更新待ち'));
}

console.log('Motorsport Hub flattened WRC gate: PASS');
