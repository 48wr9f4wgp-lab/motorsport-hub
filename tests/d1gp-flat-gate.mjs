import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const router=fs.readFileSync(path.join(root,'motorsport-hub.js'),'utf8');
const d1=fs.readFileSync(path.join(root,'d1gp-widget-flat-v1000.js'),'utf8');
assert.match(d1,/flattened D1GP module/);assert.match(d1,/CACHE_SCHEMA=1/);assert.match(d1,/hold=40\*3600000/);assert.doesNotMatch(d1,/eval\s*\(/);assert.doesNotMatch(d1,/raw\.githubusercontent\.com/);

class Text{constructor(v,s){this.value=String(v);s.push(this.value)}rightAlignText(){}}
class Stack{constructor(s){this.s=s}addText(v){return new Text(v,this.s)}addSpacer(){}addStack(){return new Stack(this.s)}setPadding(){}layoutHorizontally(){}centerAlignContent(){}}
class ListWidget extends Stack{constructor(s){super(s);this.refreshAfterDate=null}}
class Color{constructor(){}static white(){return new Color()}}
class LinearGradient{constructor(){this.colors=[];this.locations=[]}}
class Size{constructor(w,h){this.width=w;this.height=h}}
class DateFormatter{constructor(){this.locale='';this.timeZone='';this.dateFormat=''}string(){return'DATE'}}
const Font={heavySystemFont(){},boldSystemFont(){},semiboldSystemFont(){},systemFont(){}};
function FixedDateFactory(ms){return class FixedDate extends Date{constructor(...a){super(...a)}static now(){return ms}static parse(s){return Date.parse(s)}}}

async function run({now,seedCache=null,html=null}){
 const sink=[],files=new Map(),cachePath='/docs/motorsport-data-v1000-d1gp.json';if(seedCache!==null)files.set(cachePath,seedCache);const DateClass=FixedDateFactory(Date.parse(now));let repoRequests=0,dataCalls=0,setWidget=0,complete=0;
 const fm={documentsDirectory:()=>'/docs',joinPath:(a,b)=>`${a}/${b}`,fileExists:p=>p.includes('motorsport-hero-v1000-')||files.has(p),readImage:()=>({size:{width:1600,height:900}}),writeImage(){},readString:p=>{if(!files.has(p))throw Error('missing');return files.get(p)},writeString:(p,s)=>files.set(p,String(s)),remove:p=>files.delete(p)};
 class Request{constructor(url){this.url=url;this.headers={}}async loadString(){if(this.url.includes('d1gp-widget-flat-v1000.js')){repoRequests++;return d1}if(this.url.includes('d1gp.co.jp/2026d1')){dataCalls++;if(html instanceof Error)throw html;if(typeof html==='string')return html;throw Error('offline ranking')}throw Error('unexpected string request')}async loadImage(){throw Error('hero should use cache')}}
 const CtxListWidget=class extends ListWidget{constructor(){super(sink)}};const ctx={args:{widgetParameter:'D1GP'},config:{runsInWidget:true,widgetFamily:'medium'},FileManager:{local:()=>fm},Request,ListWidget:CtxListWidget,Color,LinearGradient,Size,DateFormatter,Font,Date:DateClass,Math,Map,Set,JSON,Number,String,Array,Object,RegExp,Error,isFinite,Script:{setWidget(){setWidget++},complete(){complete++}}};ctx.globalThis=ctx;vm.createContext(ctx);await vm.runInContext(router,ctx,{timeout:5000});return{sink,files,cachePath,repoRequests,dataCalls,setWidget,complete};
}

{
 const active=await run({now:'2026-09-28T00:59:00+09:00'});assert.equal(active.repoRequests,1);assert(active.sink.includes('RD.5&6 EBISU'));assert(active.sink.includes('開催中'));
}
{
 const atEnd=await run({now:'2026-09-28T01:00:00+09:00'});assert(atEnd.sink.includes('RD.7&8 AUTOPOLIS'));assert(!atEnd.sink.includes('開催中'));
}
{
 const finale=await run({now:'2026-11-16T01:00:00+09:00'});assert(finale.sink.includes('RD.9&10'));assert(finale.sink.includes('シーズン終了'));assert(finale.sink.includes('SEASON END'));assert(!finale.sink.includes('次戦'));
}
{
 const r=await run({now:'2026-11-16T01:00:00+09:00',seedCache:JSON.stringify({ranking:{}})});assert.equal(r.files.has(r.cachePath),false);assert.equal(r.setWidget,1);assert.equal(r.complete,1);
}

const validHtml=`<html><body><h1>2026年D1グランプリシリーズランキング</h1><h4>2026年ドライバーズランキング</h4><table>
<tr><th>Rank.</th><th>No.</th><th>Driver</th><th>Team</th><th>Car</th><th>Total</th></tr>
<tr><td>1</td><td>70</td><td>横井 昌志</td><td>Mind Control Racing SHIBATIRE</td><td>S14</td><td>79</td></tr>
<tr><td>2</td><td>99</td><td>中村 直樹</td><td>TEAM VALINO WORKS</td><td>ZN8</td><td>74</td></tr>
<tr><td>3</td><td>31</td><td>蕎麦切 広大</td><td>SHIBATA RACING TEAM</td><td>ZN8</td><td>73</td></tr>
</table><h4>2026年単走シリーズランキング</h4></body></html>`;
{
 const r=await run({now:'2026-08-26T12:00:00+09:00',html:validHtml}),p=JSON.parse(r.files.get(r.cachePath));assert.equal(p.schemaVersion,1);assert.equal(p.category,'d1gp');assert.equal(p.ranking[0].name,'横井 昌志');assert.equal(p.ranking[0].car,'#70 · S14');
}
{
 const wrong=`<html><body><h4>2026年単走シリーズランキング</h4><table><tr><td>1</td><td>99</td><td>中村 直樹</td><td>TEAM</td><td>ZN8</td><td>999</td></tr><tr><td>2</td><td>31</td><td>Fake</td><td>TEAM</td><td>S15</td><td>998</td></tr><tr><td>3</td><td>70</td><td>Fake2</td><td>TEAM</td><td>S14</td><td>997</td></tr></table></body></html>`;const r=await run({now:'2026-08-26T12:00:00+09:00',html:wrong});assert.equal(r.files.has(r.cachePath),false);assert(r.sink.includes('• 更新待ち'));
}
console.log('Motorsport Hub flattened D1GP gate: PASS');
