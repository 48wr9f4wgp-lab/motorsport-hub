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
assert.match(sgt,/MOTUL%20AUTECH%20Z%202024%20rd\.2%20FUJI/,'verified SUPER GT action hero missing');assert.doesNotMatch(sgt,/Osaka%20Auto%20Messe%202025|Fujimaki|front%20three-quarter/,'superseded or unverified SUPER GT hero must not return');

function extractFunction(src,name){const i=src.indexOf(`function ${name}(`);assert(i>=0,`${name} renderer missing`);const b=src.indexOf('{',i);let depth=0;for(let j=b;j<src.length;j++){if(src[j]==='{')depth++;else if(src[j]==='}'){depth--;if(depth===0)return src.slice(i,j+1)}}assert.fail(`${name} renderer unterminated`)}
const smallSrc=extractFunction(sgt,'small');
assert(!smallSrc.includes("d.lifecycle==='SEASON_ENDED'?'終了':'次戦'"),'SUPER GT Small must not pack the extra 次戦 label into its top row');
assert(smallSrc.includes("pill(top,'SUPER GT',true);top.addSpacer();const cp=top.addStack()"),'SUPER GT Small top row must reserve flexible space between brand and countdown');
assert(smallSrc.includes("cp.setPadding(2,5,2,5)"),'SUPER GT Small countdown pill must keep compact horizontal padding');
assert(smallSrc.includes("T(cp,ci.label,10.8"),'SUPER GT Small countdown font must stay within the compact width budget');


const metaMatch=sgt.match(/const META=(\{[\s\S]*?\n\});/);
assert(metaMatch,'SUPER GT META object missing');
const META=vm.runInNewContext('('+metaMatch[1]+')');
const expectedMeta={
 '8':['太田 格之進 / 大津 弘樹','HONDA','PRELUDE-GT','Team HRC ARTA MUGEN'],
 '12':['平峰 一貴 / ベルトラン・バゲット','NISSAN','Z NISMO GT500','TEAM IMPUL'],
 '14':['福住 仁嶺 / 大嶋 和也','TOYOTA','GR Supra','TGR TEAM ENEOS ROOKIE'],
 '16':['野尻 智紀 / 佐藤 蓮','HONDA','PRELUDE-GT','ARTA MUGEN'],
 '17':['塚越 広大 / 野村 勇斗','HONDA','PRELUDE-GT','Astemo REAL RACING'],
 '19':['国本 雄資 / 阪口 晴南','TOYOTA','GR Supra','TGR TEAM WedsSport BANDOH'],
 '23':['千代 勝正 / 高星 明誠','NISSAN','Z NISMO GT500','NISMO'],
 '24':['名取 鉄平 / 三宅 淳詞','NISSAN','Z NISMO GT500','KONDO RACING'],
 '36':['坪井 翔 / 山下 健太','TOYOTA','GR Supra',"TGR TEAM au TOM'S"],
 '37':['笹原 右京 / ジュリアーノ・アレジ','TOYOTA','GR Supra',"TGR TEAM Deloitte TOM'S"],
 '38':['大湯 都史樹 / 小林 利徠斗','TOYOTA','GR Supra','TGR TEAM KeePer CERUMO'],
 '39':['関口 雄飛 / サッシャ・フェネストラズ','TOYOTA','GR Supra','TGR TEAM SARD'],
 '64':['大草 りき / イゴール・オオムラ・フラガ','HONDA','PRELUDE-GT','Modulo Nakajima Racing'],
 '100':['山本 尚貴 / 牧野 任祐','HONDA','PRELUDE-GT','STANLEY TEAM KUNIMITSU']
};
assert.deepEqual(Object.keys(META).sort((a,b)=>Number(a)-Number(b)),Object.keys(expectedMeta).sort((a,b)=>Number(a)-Number(b)),'META must cover all 14 GT500 entries');
for(const [no,[name,maker,machine,team]] of Object.entries(expectedMeta)){
 assert.equal(META[no]?.name,name,`No.${no} driver metadata drift`);
 assert.equal(META[no]?.maker,maker,`No.${no} maker metadata drift`);
 assert.equal(META[no]?.machine,machine,`No.${no} machine metadata drift`);
 assert.equal(META[no]?.team,team,`No.${no} team metadata drift`);
}


class Text{constructor(v,s){this.value=String(v);s.push(this.value)}rightAlignText(){}}
class Stack{constructor(s){this.s=s}addText(v){return new Text(v,this.s)}addSpacer(){}addStack(){return new Stack(this.s)}setPadding(){}layoutHorizontally(){}centerAlignContent(){}}
class ListWidget extends Stack{constructor(s){super(s);this.refreshAfterDate=null}}
class Color{constructor(){}static white(){return new Color()}}
class LinearGradient{constructor(){this.colors=[];this.locations=[]}}
class Size{constructor(w,h){this.width=w;this.height=h}}
class DateFormatter{constructor(){this.locale='';this.timeZone='';this.dateFormat=''}string(){return'DATE'}}
const Font={heavySystemFont(){},boldSystemFont(){},semiboldSystemFont(){},systemFont(){}};
function FixedDateFactory(ms){return class FixedDate extends Date{constructor(...a){super(...a)}static now(){return ms}static parse(s){return Date.parse(s)}}}

async function run({now,seedCache=null,html=null,family='medium'}){
 const sink=[],files=new Map(),cachePath='/docs/motorsport-data-v1000-supergt.json';if(seedCache!==null)files.set(cachePath,seedCache);const DateClass=FixedDateFactory(Date.parse(now));let repoRequests=0,dataCalls=0,setWidget=0,complete=0;
 const fm={documentsDirectory:()=>'/docs',joinPath:(a,b)=>`${a}/${b}`,fileExists:p=>p.includes('motorsport-hero-v1000-')||files.has(p),readImage:()=>({size:{width:1600,height:900}}),writeImage(){},readString:p=>{if(!files.has(p))throw Error('missing');return files.get(p)},writeString:(p,s)=>files.set(p,String(s)),remove:p=>files.delete(p)};
 class Request{constructor(url){this.url=url;this.headers={}}async loadString(){if(this.url.includes('supergt-widget-flat-v1000.js')){repoRequests++;return sgt}if(this.url.includes('supergt.net/driver_ranking')){dataCalls++;if(html instanceof Error)throw html;if(typeof html==='string')return html;throw Error('offline ranking')}throw Error('unexpected string request')}async loadImage(){throw Error('hero should use seeded cache')}}
 const CtxListWidget=class extends ListWidget{constructor(){super(sink)}};const ctx={args:{widgetParameter:'SUPERGT'},config:{runsInWidget:true,widgetFamily:family},FileManager:{local:()=>fm},Request,ListWidget:CtxListWidget,Color,LinearGradient,Size,DateFormatter,Font,Date:DateClass,Math,Map,Set,JSON,Number,String,Array,Object,RegExp,Error,isFinite,Script:{setWidget(){setWidget++},complete(){complete++}}};ctx.globalThis=ctx;vm.createContext(ctx);await vm.runInContext(router,ctx,{timeout:5000});return{sink,files,cachePath,repoRequests,dataCalls,setWidget,complete};
}

{
 const active=await run({now:'2026-09-20T19:59:00+09:00'});assert.equal(active.repoRequests,1,'SUPER GT flat route must use one repo module request');assert.equal(active.dataCalls,1);assert(active.sink.includes('第6戦 SUGO'));assert(active.sink.includes('開催中'));
}
{
 const atEnd=await run({now:'2026-09-20T20:00:00+09:00'});assert(atEnd.sink.includes('第7戦 AUTOPOLIS'),'exact 8h boundary must advance to AUTOPOLIS');assert(!atEnd.sink.includes('開催中'));
}
{
 const small=await run({now:'2026-09-24T21:58:00+09:00',family:'small'});
 assert(small.sink.includes('SUPER GT'),'Small brand missing');
 assert(small.sink.includes('第7戦 AUTOPOLIS'),'Small must render the current AUTOPOLIS event');
 assert(small.sink.includes('あと24日'),'Small must render the current Tokyo-calendar countdown');
 assert(!small.sink.includes('データ取得失敗'),'Small must not fall into the error widget');
}
{
 const finale=await run({now:'2026-11-08T20:00:00+09:00'});assert(finale.sink.includes('第8戦 MOTEGI'));assert(finale.sink.includes('シーズン終了'));assert(finale.sink.includes('SEASON END'));assert(!finale.sink.includes('次戦'));
}
{
 const r=await run({now:'2026-11-08T20:00:00+09:00',seedCache:JSON.stringify({ranking:{}})});assert.equal(r.files.has(r.cachePath),false,'malformed SUPER GT cache must be removed');assert.equal(r.setWidget,1);assert.equal(r.complete,1);
}

const row=(p,no,name,total,behind='',sw='')=>`<tr><td>${p}</td><td>${no}</td><td>${name}</td><td>1</td><td>1</td><td>－</td><td>1</td><td>1</td><td></td><td></td><td></td><td>${total}</td><td>${behind}</td><td>${sw}</td></tr>`;
const validHtml=`<html><body><nav>GT500 GT300</nav><h1>GT500 ドライバーランキング</h1><table><tr><th>順位</th><th>No.</th><th>ドライバー</th><th>Rd1</th><th>Rd2</th><th>Rd3</th><th>Rd4</th><th>Rd5</th><th>Rd6</th><th>Rd7</th><th>Rd8</th><th>合計</th><th>差</th><th>SW</th></tr>${row(1,36,'坪井　翔 山下　健太',50,'',100)}${row(2,16,'野尻　智紀 佐藤　蓮',33,-17,66)}${row(3,14,'福住　仁嶺 大嶋　和也',31,-19,62)}</table><h1>GT300 ドライバーランキング</h1></body></html>`;
{
 const r=await run({now:'2026-08-26T12:00:00+09:00',html:validHtml}),p=JSON.parse(r.files.get(r.cachePath));assert.equal(p.schemaVersion,1);assert.equal(p.category,'supergt');assert.equal(p.season,2026);assert.equal(p.ranking[0].name,'坪井 翔 / 山下 健太');assert.equal(p.ranking[1].machine,'PRELUDE-GT');assert.equal(p.ranking[2].team,'TGR TEAM ENEOS ROOKIE');assert(r.sink.some(x=>x.includes("TOYOTA · GR Supra")&&x.includes("au TOM'S")));assert(r.sink.some(x=>x.includes('HONDA · PRELUDE-GT')&&x.includes('ARTA')));
}

{
 const metaHtml=`<html><body><nav>GT500 GT300</nav><h1>GT500 ドライバーランキング</h1><table><tr><th>順位</th><th>No.</th><th>ドライバー</th><th>Rd1</th><th>Rd2</th><th>Rd3</th><th>Rd4</th><th>Rd5</th><th>Rd6</th><th>Rd7</th><th>Rd8</th><th>合計</th><th>差</th><th>SW</th></tr>${row(1,36,'坪井　翔 山下　健太',58,'',100)}${row(2,17,'塚越　広大 野村　勇斗',45,-13,90)}${row(3,100,'山本　尚貴 牧野　任祐',38,-20,76)}</table><h1>GT300 ドライバーランキング</h1></body></html>`;
 const r=await run({now:'2026-09-24T21:01:00+09:00',html:metaHtml}),p=JSON.parse(r.files.get(r.cachePath));
 assert.equal(p.ranking[1].name,'塚越 広大 / 野村 勇斗');assert.equal(p.ranking[1].machine,'PRELUDE-GT');assert.equal(p.ranking[1].team,'Astemo REAL RACING');
 assert.equal(p.ranking[2].name,'山本 尚貴 / 牧野 任祐');assert.equal(p.ranking[2].machine,'PRELUDE-GT');assert.equal(p.ranking[2].team,'STANLEY TEAM KUNIMITSU');
 assert(r.sink.some(x=>x.includes('HONDA · PRELUDE-GT')&&x.includes('Astemo REAL RACING')),'No.17 secondary metadata must render');
 assert(r.sink.some(x=>x.includes('HONDA · PRELUDE-GT')&&x.includes('STANLEY TEAM KUNIMITSU')),'No.100 secondary metadata must render');
}

{
 const wrong=`<html><body><h1>GT300 ドライバーランキング</h1><table>${row(1,56,'Fake',999)}${row(2,777,'Fake2',998)}${row(3,7,'Fake3',997)}</table></body></html>`;const r=await run({now:'2026-08-26T12:00:00+09:00',html:wrong});assert.equal(r.files.has(r.cachePath),false,'GT300 table must never be promoted as GT500');assert(r.sink.includes('• 更新待ち'));
}
// Regression: device-shaped no-table SUPER GT response must parse from normalized text.
{
 const html="<html><body><div>GT500 ドライバーランキング</div><div>順位 No. ドライバー Rd1 Rd2 Rd3 Rd4 Rd5 Rd6 Rd7 Rd8 合計 差 SW 1 36 坪井　翔 山下　健太 20 20 － 8 2 50 100 2 16 野尻　智紀 佐藤　蓮 5 6 － 2 20 33 -17 66 3 14 福住　仁嶺 大嶋　和也 8 16 － 4 3 31 -19 62 4 100 山本　尚貴 牧野　任祐 4 3 － 20 27 -23 54 5 8 太田　格之進 大津　弘樹 16 11 27 -23 54 決勝順位 1位 2位</div></body></html>";
 const r=await run({now:'2026-09-14T19:49:00+09:00',html}),p=JSON.parse(r.files.get(r.cachePath));assert.equal(p.ranking.length,5,'device-shaped no-table SUPER GT must keep top five');assert.deepEqual(p.ranking.map(x=>x.points),['50 pts','33 pts','31 pts','27 pts','27 pts']);assert.equal(p.ranking[3].no,'100');assert.equal(p.ranking[4].no,'8');assert(!r.sink.includes('• 更新待ち'));
}

console.log('Motorsport Hub flattened SUPER GT gate: PASS');
