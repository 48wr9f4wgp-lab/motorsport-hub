import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const router=fs.readFileSync(path.join(root,'motorsport-hub.js'),'utf8');
const moduleSrc=fs.readFileSync(path.join(root,'dakar-widget.js'),'utf8');
const heroPolicy=JSON.parse(fs.readFileSync(path.join(root,'hero-selection-policy.json'),'utf8'));
new Function(moduleSrc);
for(const token of ['DAKAR dedicated rally-raid module','MH_LIFECYCLE_BAKED=1','CACHE_SCHEMA=1','SEASON=2027','PROLOGUE','STAGE 13','2027-01-15T00:00:00+03:00','dakar.com/fr/webview/rankings/stage-13/auto?year=2026','Dacia%20Sandrider%20GIMS%202024%201X7A2026.jpg','HERO_CROP_BASELINE','HERO_CROPS','cropRect(img,W,H,crop)','motorsport-hero-v954-','総合 CAR','GAP'])assert(moduleSrc.includes(token),`Dakar invariant missing: ${token}`);
assert(!moduleSrc.includes('raw.githubusercontent.com'),'Dakar module must not fetch nested repo source');
assert(!/\beval\s*\(/.test(moduleSrc),'Dakar module must not eval remote source');

const baselineVersion=moduleSrc.match(/const HERO_CROP_BASELINE='([^']+)'/)?.[1];
assert.equal(baselineVersion,heroPolicy.visualRegression?.baselineVersion,'Dakar runtime Hero baseline version drift');
const cropLiteral=moduleSrc.match(/const HERO_CROPS=(\{[\s\S]*?\});\nconst HERO_VARIANTS=/)?.[1];
assert(cropLiteral,'Dakar runtime Hero crop map missing');
const runtimeCrops=JSON.parse(cropLiteral);
const baselineAssets=heroPolicy.visualRegression?.assets||{};
for(const [assetId,baseline] of Object.entries(baselineAssets)){
 const runtime=runtimeCrops[assetId];assert(runtime,`Dakar runtime Hero crop missing ${assetId}`);
 assert.deepEqual(runtime.small,baseline.smallCrop,`Dakar Small crop drift ${assetId}`);
 assert.deepEqual(runtime.medium,baseline.mediumCrop,`Dakar Medium crop drift ${assetId}`);
}
assert.equal(Object.keys(runtimeCrops).length,Object.keys(baselineAssets).length,'Dakar runtime Hero crop count drift');

const FIXTURE=`<table><tr><th>P.</th><th>N°</th><th>Exp.</th><th>Pilote/Véhicule</th><th>Équipe</th><th>Temps</th><th>Écart</th></tr>
<tr><td>1</td><td>299</td><td></td><td>The Dacia Sandriders (qat) NASSER AL-ATTIYAH (bel) FABIAN LURQUIN</td><td>The Dacia Sandriders</td><td>48h 56' 53''</td><td></td></tr>
<tr><td>2</td><td>227</td><td></td><td>FORD RACING (esp) NANI ROMA (esp) ALEX HARO</td><td>FORD RACING</td><td>49h 06' 35''</td><td>+ 00h 09' 42''</td></tr>
<tr><td>3</td><td>226</td><td></td><td>FORD RACING (swe) MATTIAS EKSTRÖM (swe) EMIL BERGKVIST</td><td>FORD RACING</td><td>49h 11' 26''</td><td>+ 00h 14' 33''</td></tr></table>`;

class Text{constructor(v,s){this.value=String(v);s.push(this.value)}rightAlignText(){}}
class Stack{constructor(s){this.s=s}addText(v){return new Text(v,this.s)}addSpacer(){}addStack(){return new Stack(this.s)}setPadding(){}layoutHorizontally(){}centerAlignContent(){}}
class ListWidget extends Stack{constructor(s){super(s);this.refreshAfterDate=null}}
class Color{constructor(){}static white(){return new Color()}}
class LinearGradient{constructor(){this.colors=[];this.locations=[]}}
class Size{constructor(w,h){this.width=w;this.height=h}}
class Rect{constructor(x,y,width,height){this.x=x;this.y=y;this.width=width;this.height=height}}
const Font={heavySystemFont(){},boldSystemFont(){},semiboldSystemFont(){},systemFont(){}};
function FixedDateFactory(ms){return class FixedDate extends Date{constructor(...a){super(...a)}static now(){return ms}static parse(s){return Date.parse(s)}}}
const HERO_IMAGE_SIZES=[{width:3840,height:2562},{width:3840,height:2555},{width:3840,height:2560}];

async function render(now,family='medium',heroVariant=0){
 const sink=[],files=new Map(),DateClass=FixedDateFactory(Date.parse(now)),heroRects=[];let setWidget=0,complete=0,repoRequests=0,rankingRequests=0,imageRequests=0;
 files.set('/docs/motorsport-ui-v1-dakar.json',JSON.stringify({schemaVersion:1,heroVariant}));
 const fm={documentsDirectory:()=>'/docs',joinPath:(a,b)=>`${a}/${b}`,fileExists:p=>files.has(p),readImage:p=>files.get(p),writeImage:(p,img)=>files.set(p,img),readString:p=>files.get(p),writeString:(p,s)=>files.set(p,String(s)),remove:p=>files.delete(p)};
 class Request{constructor(url){this.url=url;this.headers={}}async loadString(){if(this.url.includes('dakar-widget.js')){repoRequests++;return moduleSrc}rankingRequests++;return FIXTURE}async loadImage(){imageRequests++;return{size:HERO_IMAGE_SIZES[heroVariant]}}async loadJSON(){throw Error('unexpected json')}}
 class DrawContext{constructor(){this.size=new Size(0,0);this.opaque=false;this.respectScreenScale=false}setFillColor(){}fillRect(){}drawImageInRect(_img,rect){heroRects.push(rect)}getImage(){return{size:{width:this.size.width,height:this.size.height}}}}
 const CtxListWidget=class extends ListWidget{constructor(){super(sink)}};
 const ctx={args:{widgetParameter:'DAKAR',queryParameters:{}},config:{runsInWidget:true,widgetFamily:family},FileManager:{local:()=>fm},Request,ListWidget:CtxListWidget,DrawContext,Rect,Color,LinearGradient,Size,Font,Date:DateClass,Math,Map,Set,JSON,Number,String,Array,Object,RegExp,Error,Promise,isFinite,Script:{setWidget(){setWidget++},complete(){complete++}}};ctx.globalThis=ctx;
 vm.createContext(ctx);await vm.runInContext(router,ctx,{timeout:5000});
 assert.equal(repoRequests,1);assert.equal(setWidget,1);assert.equal(complete,1);assert(rankingRequests>=1);assert.equal(imageRequests,1);assert.equal(heroRects.length,1);
 return{sink,text:sink.join(' | '),files,heroRect:heroRects[0]};
}

function recoveredCrop(rect,family){const W=family==='small'?720:1380,H=family==='small'?720:640;return{x:-rect.x/rect.width,y:-rect.y/rect.height,w:W/rect.width,h:H/rect.height}}
function assertCropClose(actual,expected,label,tol=.002){for(const k of ['x','y','w','h'])assert(Math.abs(actual[k]-expected[k])<=tol,`${label} ${k} drift: ${actual[k]} vs ${expected[k]}`)}

{
 const r=await render('2026-08-26T12:00:00+09:00','medium');
 for(const token of ['DAKAR','PROLOGUE','2026 FINAL','Nasser Al-Attiyah','Nani Roma','Mattias Ekström','+9:42','+14:33','GAP'])assert(r.text.includes(token),`pre-start Medium missing ${token}: ${r.text}`);
 const cache=[...r.files.entries()].find(([p])=>p.endsWith('motorsport-data-v950-dakar.json'));assert(cache,'Dakar cache not written');const payload=JSON.parse(cache[1]);assert.equal(payload.schemaVersion,1);assert.equal(payload.category,'dakar');assert.equal(payload.season,2027);assert.equal(payload.ranking.length,3);
}
{
 const r=await render('2026-08-26T12:00:00+09:00','small');assert(r.text.includes('PROLOGUE'));assert(r.text.includes('KAEC → KAEC'));assert(!r.text.includes('Nasser Al-Attiyah'),'Small should remain next-stage focused');
}
{
 const r=await render('2027-01-02T00:00:00+03:00','medium');assert(r.text.includes('STAGE 1'),'exact Prologue end must advance to Stage 1');assert(!r.text.includes('PROLOGUE'));
}
{
 const r=await render('2027-01-16T00:00:00+03:00','medium');assert(r.text.includes('2027 FINISH'));assert(r.text.includes('FINISH'));assert(!r.text.includes('次ステージ'),'post-finale must not claim another stage');
}
{
 const assetIds=['dakar-dacia-sandrider-gims-2024','dakar-2021-stage05-action','dakar-2021-stage10-action'];
 for(let heroVariant=0;heroVariant<assetIds.length;heroVariant++)for(const family of ['small','medium']){
  const r=await render('2026-08-26T12:00:00+09:00',family,heroVariant),actual=recoveredCrop(r.heroRect,family),expected=runtimeCrops[assetIds[heroVariant]][family];
  assertCropClose(actual,expected,`H${heroVariant+1} ${family}`);
 }
}
console.log('Motorsport Hub Dakar gate: PASS');
