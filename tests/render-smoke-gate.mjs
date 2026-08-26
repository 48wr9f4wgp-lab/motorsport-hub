import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const router=fs.readFileSync(path.join(root,'motorsport-hub.js'),'utf8');
const registry=JSON.parse(fs.readFileSync(path.join(root,'category-registry.json'),'utf8'));

const expected={
  F1:/イタリアGP|Italian/i,
  WEC:/COTA|ローンスター|Lone Star/i,
  WRC:/パラグアイ|Paraguay/i,
  SUPERGT:/SUGO/i,
  MOTOGP:/アラゴン|Aragon/i,
  FDJ:/奥伊吹/i,
  D1GP:/EBISU|エビス/i,
  SUPERFORMULA:/富士/i,
  INDYCAR:/Milwaukee|ミルウォーキー/i,
  NASCAR:/Daytona|デイトナ/i,
  GTWCEU:/Nürburgring|ニュルブルクリンク/i,
  DAKAR:/PROLOGUE|KAEC|King Abdullah/i,
};

class Text {constructor(v,s){this.value=String(v);s.push(this.value)} rightAlignText(){}}
class Stack {constructor(s){this.s=s} addText(v){return new Text(v,this.s)} addSpacer(){} addStack(){return new Stack(this.s)} setPadding(){} layoutHorizontally(){} centerAlignContent(){}}
class ListWidget extends Stack {constructor(s){super(s);this.refreshAfterDate=null}}
class Color {constructor(){} static white(){return new Color()}}
class LinearGradient {constructor(){this.colors=[];this.locations=[]}}
class Size {constructor(w,h){this.width=w;this.height=h}}
class DateFormatter {constructor(){this.locale='';this.timeZone='';this.dateFormat=''} string(){return 'DATE'}}
const Font={heavySystemFont(){},boldSystemFont(){},semiboldSystemFont(){},systemFont(){}};
function FixedDateFactory(ms){return class FixedDate extends Date{constructor(...a){super(...a)}static now(){return ms}static parse(s){return Date.parse(s)}}}

async function render(category,family){
  const record=registry.categories.find(x=>x.id===category);assert(record,`registry missing ${category}`);
  const moduleSource=fs.readFileSync(path.join(root,record.module),'utf8');
  const sink=[],files=new Map(),DateClass=FixedDateFactory(Date.parse('2026-08-26T12:00:00+09:00'));
  let repoRequests=0,setWidget=0,complete=0;
  const fm={documentsDirectory:()=>'/docs',joinPath:(a,b)=>`${a}/${b}`,fileExists:p=>p.includes('motorsport-hero-')||files.has(p),readImage:()=>({size:{width:1800,height:1200}}),writeImage(){},readString:p=>{if(!files.has(p))throw Error('missing');return files.get(p)},writeString:(p,s)=>files.set(p,String(s)),remove:p=>files.delete(p)};
  class Request {constructor(url){this.url=url;this.headers={}} async loadString(){if(this.url.includes(record.module)){repoRequests++;return moduleSource}throw Error('offline data source')} async loadJSON(){throw Error('offline data source')} async loadImage(){throw Error('hero cache should be used')}}
  const CtxListWidget=class extends ListWidget{constructor(){super(sink)}};
  const ctx={args:{widgetParameter:category},config:{runsInWidget:true,widgetFamily:family},FileManager:{local:()=>fm},Request,ListWidget:CtxListWidget,Color,LinearGradient,Size,DateFormatter,Font,Date:DateClass,Math,Map,Set,JSON,Number,String,Array,Object,RegExp,Error,Promise,decodeURIComponent,isFinite,Script:{setWidget(){setWidget++},complete(){complete++}}};
  ctx.globalThis=ctx;vm.createContext(ctx);await vm.runInContext(router,ctx,{timeout:5000});
  assert.equal(repoRequests,1,`${category}/${family}: must fetch exactly one category module`);assert.equal(setWidget,1,`${category}/${family}: setWidget count`);assert.equal(complete,1,`${category}/${family}: Script.complete count`);
  const text=sink.join(' | ');assert(!/データ取得失敗|安全に実行できません|Widget Parameterが不正/.test(text),`${category}/${family}: rendered error state: ${text}`);assert(expected[category]?.test(text),`${category}/${family}: expected event identity missing: ${text}`);
  if(family==='medium')assert(category==='DAKAR'?/GAP|総合 CAR/.test(text):/PTS|ポイント/.test(text),`${category}/medium: standings surface missing`);
  return text;
}

for(const c of registry.categories){for(const family of ['small','medium'])await render(c.id,family)}
console.log('Motorsport Hub 24-case render smoke gate: PASS');
