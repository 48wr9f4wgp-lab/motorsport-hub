import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const router=fs.readFileSync(path.join(root,'motorsport-hub.js'),'utf8');
const sgt=fs.readFileSync(path.join(root,'supergt-widget-flat-v1000.js'),'utf8');
assert.match(sgt,/flattened SUPER GT module/);assert.match(sgt,/CACHE_SCHEMA=1/);assert.match(sgt,/hold=8\*3600000/);
assert.doesNotMatch(sgt,/eval\s*\(/,'flat SUPER GT must not eval remote source');assert.doesNotMatch(sgt,/raw\.githubusercontent\.com/,'flat SUPER GT must not fetch nested repo modules');
assert.match(sgt,/Osaka%20Auto%20Messe%202025/,'verified CC0 hero missing');assert.doesNotMatch(sgt,/Fujimaki|MOTUL%20AUTECH|front%20three-quarter/,'unverified historical hero must not return');

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
 const sink=[],files=new Map(),cachePath='/docs/motorsport-data-v1000-supergt.json';if(seedCache!==null)files.set(cachePath,seedCache);const DateClass=FixedDateFactory(Date.parse(now));let repoRequests=0,dataCalls=0,setWidget=0,complete=0;
 const fm={documentsDirectory:()=>'/docs',joinPath:(a,b)=>`${a}/${b}`,fileExists:p=>p.includes('motorsport-hero-v1000-')||files.has(p),readImage:()=>({size:{width:1600,height:900}}),writeImage(){},readString:p=>{if(!files.has(p))throw Error('missing');return files.get(p)},writeString:(p,s)=>files.set(p,String(s)),remove:p=>files.delete(p)};
 class Request{constructor(url){this.url=url;this.headers={}}async loadString(){if(this.url.includes('supergt-widget-flat-v1000.js')){repoRequests++;return sgt}if(this.url.includes('supergt.net/driver_ranking')){dataCalls++;if(html instanceof Error)throw html;if(typeof html==='string')return html;throw Error('offline ranking')}throw Error('unexpected string request')}async loadImage(){throw Error('hero should use seeded cache')}}
 const CtxListWidget=class extends ListWidget{constructor(){super(sink)}};const ctx={args:{widgetParameter:'SUPERGT'},config:{runsInWidget:true,widgetFamily:'medium'},FileManager:{local:()=>fm},Request,ListWidget:CtxListWidget,Color,LinearGradient,Size,DateFormatter,Font,Date:DateClass,Math,Map,Set,JSON,Number,String,Array,Object,RegExp,Error,isFinite,Script:{setWidget(){setWidget++},complete(){complete++}}};ctx.globalThis=ctx;vm.createContext(ctx);await vm.runInContext(router,ctx,{timeout:5000});return{sink,files,cachePath,repoRequests,dataCalls,setWidget,complete};
}

{
 const active=await run({now:'2026-09-20T19:59:00+09:00'});assert.equal(active.repoRequests,1,'SUPER GT flat route must use one repo module request');assert.equal(active.dataCalls,1);assert(active.sink.includes('第6戦 SUGO'));assert(active.sink.includes('開催中'));
}
{
 const atEnd=await run({now:'2026-09-20T20:00:00+09:00'});assert(atEnd.sink.includes('第7戦 AUTOPOLIS'),'exact 8h boundary must advance to AUTOPOLIS');assert(!atEnd.sink.includes('開催中'));
}
{
 const finale=await run({now:'2026-11-08T20:00:00+09:00'});assert(finale.sink.includes('第8戦 MOTEGI'));assert(finale.sink.includes('シーズン終了'));assert(finale.sink.includes('SEASON END'));assert(!finale.sink.includes('次戦'));
}
{
 const r=await run({now:'2026-11-08T20:00:00+09:00',seedCache:JSON.stringify({ranking:{}})});assert.equal(r.files.has(r.cachePath),false,'malformed SUPER GT cache must be removed');assert.equal(r.setWidget,1);assert.equal(r.complete,1);
}

const row=(p,no,name,total,behind='',sw='')=>`<tr><td>${p}</td><td>${no}</td><td>${name}</td><td>1</td><td>1</td><td>－</td><td>1</td><td>1</td><td></td><td></td><td></td><td>${total}</td><td>${behind}</td><td>${sw}</td></tr>`;
const validHtml=`<html><body><h1>GT500 ドライバーランキング</h1><table><tr><th>順位</th><th>No.</th><th>ドライバー</th><th>Rd1</th><th>Rd2</th><th>Rd3</th><th>Rd4</th><th>Rd5</th><th>Rd6</th><th>Rd7</th><th>Rd8</th><th>合計</th><th>差</th><th>SW</th></tr>${row(1,36,'坪井　翔 山下　健太',50,'',100)}${row(2,16,'野尻　智紀 佐藤　蓮',33,-17,66)}${row(3,14,'福住　仁嶺 大嶋　和也',31,-19,62)}</table><h1>GT300 ドライバーランキング</h1></body></html>`;
{
 const r=await run({now:'2026-08-26T12:00:00+09:00',html:validHtml}),p=JSON.parse(r.files.get(r.cachePath));assert.equal(p.schemaVersion,1);assert.equal(p.category,'supergt');assert.equal(p.season,2026);assert.equal(p.ranking[0].name,'坪井 翔 / 山下 健太');assert.equal(p.ranking[1].machine,'PRELUDE-GT');assert.equal(p.ranking[2].team,'ROOKIE');assert(r.sink.some(x=>x.includes("TOYOTA · GR Supra")&&x.includes("au TOM'S")));assert(r.sink.some(x=>x.includes('HONDA · PRELUDE-GT')&&x.includes('ARTA')));
}
{
 const wrong=`<html><body><h1>GT300 ドライバーランキング</h1><table>${row(1,56,'Fake',999)}${row(2,777,'Fake2',998)}${row(3,7,'Fake3',997)}</table></body></html>`;const r=await run({now:'2026-08-26T12:00:00+09:00',html:wrong});assert.equal(r.files.has(r.cachePath),false,'GT300 table must never be promoted as GT500');assert(r.sink.includes('• 更新待ち'));
}
console.log('Motorsport Hub flattened SUPER GT gate: PASS');
