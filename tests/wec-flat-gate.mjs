import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const router=fs.readFileSync(path.join(root,'motorsport-hub.js'),'utf8');
const wec=fs.readFileSync(path.join(root,'wec-widget-flat-v1000.js'),'utf8');
assert.match(wec,/flattened WEC module/);
assert.match(wec,/CACHE_SCHEMA=1/);
assert.match(wec,/hold=10\*3600000/);
assert.match(wec,/TR010 Hybrid/,'WEC canonical Toyota model must be TR010 Hybrid');
assert.match(wec,/TOYOTA RACING/,'WEC canonical Toyota team must be TOYOTA RACING');
assert.match(wec,/fam==='large'\?large/,'WEC must route Large family to its dedicated layout');
assert.match(wec,/presentLarge\(\)/,'WEC interactive preview must support Large');
assert.doesNotMatch(wec,/eval\s*\(/,'flat WEC must not eval remote source');
assert.doesNotMatch(wec,/raw\.githubusercontent\.com/,'flat WEC must not fetch nested repo modules');

class Text{constructor(v,s){this.value=String(v);s.push(this.value)}rightAlignText(){}}
class Stack{constructor(s){this.s=s}addText(v){return new Text(v,this.s)}addSpacer(){}addStack(){return new Stack(this.s)}setPadding(){}layoutHorizontally(){}layoutVertically(){}centerAlignContent(){}}
class ListWidget extends Stack{constructor(s){super(s);this.refreshAfterDate=null}}
class Color{constructor(){}static white(){return new Color()}}
class LinearGradient{constructor(){this.colors=[];this.locations=[]}}
class Size{constructor(w,h){this.width=w;this.height=h}}
class DateFormatter{constructor(){this.locale='';this.timeZone='';this.dateFormat=''}string(){return'DATE'}}
const Font={heavySystemFont(){},boldSystemFont(){},semiboldSystemFont(){},systemFont(){}};
function FixedDateFactory(ms){return class FixedDate extends Date{constructor(...a){super(...a)}static now(){return ms}static parse(s){return Date.parse(s)}}}

async function run({now,seedCache=null,html=null,family='medium'}){
 const sink=[],files=new Map(),cachePath='/docs/motorsport-data-v1000-wec.json';if(seedCache!==null)files.set(cachePath,seedCache);const DateClass=FixedDateFactory(Date.parse(now));let repoRequests=0,dataCalls=0,setWidget=0,complete=0;
 const fm={documentsDirectory:()=>'/docs',joinPath:(a,b)=>`${a}/${b}`,fileExists:p=>p.includes('motorsport-hero-v1000-')||files.has(p),readImage:()=>({size:{width:1600,height:900}}),writeImage(){},readString:p=>{if(!files.has(p))throw Error('missing');return files.get(p)},writeString:(p,s)=>files.set(p,String(s)),remove:p=>files.delete(p)};
 class Request{constructor(url){this.url=url;this.headers={}}async loadString(){if(this.url.includes('wec-widget-flat-v1000.js')){repoRequests++;return wec}if(this.url.includes('fiawec.com/en/page/manufacturers-classification/34')){dataCalls++;if(html instanceof Error)throw html;if(typeof html==='string')return html;throw Error('offline standings')}throw Error('unexpected string request')}async loadImage(){throw Error('hero should use seeded cache')}}
 const CtxListWidget=class extends ListWidget{constructor(){super(sink)}};
 const ctx={args:{widgetParameter:'WEC'},config:{runsInWidget:true,widgetFamily:family},FileManager:{local:()=>fm},Request,ListWidget:CtxListWidget,Color,LinearGradient,Size,DateFormatter,Font,Date:DateClass,Math,Map,Set,JSON,Number,String,Array,Object,RegExp,Error,isFinite,Script:{setWidget(){setWidget++},complete(){complete++}}};ctx.globalThis=ctx;vm.createContext(ctx);await vm.runInContext(router,ctx,{timeout:5000});return{sink,files,cachePath,repoRequests,dataCalls,setWidget,complete};
}

{
 const active=await run({now:'2026-09-06T22:59:00-05:00'});assert.equal(active.repoRequests,1,'WEC flattened path must use one repo module request');assert.equal(active.dataCalls,1);assert(active.sink.includes('ローンスター・ル・マン'));assert(active.sink.includes('開催中'),'COTA must remain active inside the 10h hold');
}
{
 const atEnd=await run({now:'2026-09-06T23:00:00-05:00'});assert(atEnd.sink.includes('富士6時間'),'exact 10h boundary must advance to Fuji');assert(!atEnd.sink.includes('開催中'));
}
{
 const finale=await run({now:'2026-11-08T22:00:00+01:00'});assert(finale.sink.includes('モンツァ6時間'));assert(finale.sink.includes('シーズン終了'));assert(finale.sink.includes('SEASON END'));assert(!finale.sink.includes('次戦'));
}
{
 const r=await run({now:'2026-11-08T22:00:00+01:00',seedCache:JSON.stringify({ranking:{}})});assert.equal(r.files.has(r.cachePath),false,'malformed WEC cache must be removed');assert.equal(r.setWidget,1);assert.equal(r.complete,1);
}

const validHtml=`<html><body><h1><span>Manufacturers'</span><br><span>standings</span></h1><h2>FIA Hypercar <span>World Endurance</span> Manufacturers Championship</h2><table>
<tr><th>Pos.</th><th>Manufacturer</th><th>Points</th></tr>
<tr><td>1</td><td>TOYOTA</td><td>132</td></tr>
<tr><td>2</td><td>BMW</td><td>127</td></tr>
<tr><td>3</td><td>FERRARI</td><td>88</td></tr>
</table></body></html>`;
{
 const r=await run({now:'2026-08-26T12:00:00+09:00',html:validHtml}),p=JSON.parse(r.files.get(r.cachePath));assert.equal(p.schemaVersion,1);assert.equal(p.category,'wec');assert.equal(p.season,2026);assert.equal(p.ranking[0].name,'TOYOTA');assert.equal(p.ranking[0].machine,'TR010 Hybrid');assert.equal(p.ranking[0].team,'TOYOTA RACING');
}
{
 const wrong=`<html><body><h1>Teams standings</h1><h2>FIA Hypercar World Endurance Teams</h2><table><tr><td>1</td><td>FAKE</td><td>999</td></tr><tr><td>2</td><td>FAKE2</td><td>998</td></tr><tr><td>3</td><td>FAKE3</td><td>997</td></tr></table></body></html>`;const r=await run({now:'2026-08-26T12:00:00+09:00',html:wrong});assert.equal(r.files.has(r.cachePath),false,'wrong WEC table must not be promoted');assert(r.sink.includes('• 更新待ち'));
}

// Large v1 must reuse the same official standings request and expose positions 4-5 plus schedule context.
{
 const html=`<html><body><h1>Manufacturers' standings</h1><h2>FIA Hypercar World Endurance Manufacturers Championship</h2><table>
 <tr><th>Pos.</th><th>Manufacturer</th><th>Points</th></tr>
 <tr><td>1</td><td>TOYOTA</td><td>140</td></tr><tr><td>2</td><td>BMW</td><td>131</td></tr><tr><td>3</td><td>FERRARI</td><td>114</td></tr><tr><td>4</td><td>CADILLAC</td><td>101</td></tr><tr><td>5</td><td>ALPINE</td><td>86</td></tr>
 </table></body></html>`;
 const r=await run({now:'2026-09-20T12:00:00+09:00',html,family:'large'});
 assert.equal(r.dataCalls,1,'Large must not add another WEC network source');
 for(const label of ['MORE STANDINGS','SEASON','2026','PREVIOUS','NEXT','CADILLAC','ALPINE','ローンスター・ル・マン','バルセロナ6時間'])assert(r.sink.includes(label),`WEC Large missing ${label}`);
}

// Regression: device-shaped no-table WEC response must parse from normalized text.
{
 const html="<html><body><div>Manufacturers' standings</div><div>FIA Hypercar World Endurance Manufacturers Championship Pos. Manufacturer Race pts Total points 1 TOYOTA 8 140 2 BMW 4 131 3 FERRARI 25 +1 114 4 CADILLAC 20 80 5 ALPINE 25 66 FIA Hypercar World Endurance Drivers Championship</div></body></html>";
 const r=await run({now:'2026-09-20T12:00:00+09:00',html}),p=JSON.parse(r.files.get(r.cachePath));assert.equal(p.ranking.length,5,'device-shaped no-table WEC must keep top five');assert.deepEqual(p.ranking.map(x=>x.points),['140 pts','131 pts','114 pts','80 pts','66 pts']);assert(!r.sink.includes('• 更新待ち'));
}

console.log('Motorsport Hub flattened WEC gate: PASS');
