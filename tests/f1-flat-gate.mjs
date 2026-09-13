import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const router=fs.readFileSync(path.join(root,'motorsport-hub.js'),'utf8');
const f1=fs.readFileSync(path.join(root,'f1-widget-flat-v1000.js'),'utf8');
assert.match(f1,/flattened F1 pilot module/);
assert.match(f1,/CACHE_SCHEMA=1/);
assert.match(f1,/CACHE_MAX_AGE=72\*3600000/);
assert.match(f1,/Promise\.all\(\[json\(SCHEDULE_SOURCE\),json\(STANDINGS_SOURCE\)\]\)/,'F1 live refresh must remain atomic/concurrent');
assert.match(f1,/fam==='large'\?large/,'F1 must route Large family to its dedicated layout');
assert.match(f1,/presentLarge\(\)/,'F1 interactive preview must support Large');
assert.doesNotMatch(f1,/eval\s*\(/,'flat F1 must not eval remote source');
assert.doesNotMatch(f1,/raw\.githubusercontent\.com/,'flat F1 must not fetch nested repo modules');

class Text {constructor(v,s){this.value=String(v);s.push(this.value)} rightAlignText(){}}
class Stack {constructor(s){this.s=s} addText(v){return new Text(v,this.s)} addSpacer(){} addStack(){return new Stack(this.s)} setPadding(){} layoutHorizontally(){} layoutVertically(){} centerAlignContent(){}}
class ListWidget extends Stack {constructor(s){super(s);this.refreshAfterDate=null}}
class Color {constructor(){} static white(){return new Color()}}
class LinearGradient {constructor(){this.colors=[];this.locations=[]}}
class Size {constructor(w,h){this.width=w;this.height=h}}
class DateFormatter {string(){return '12/7(月) 00:00'}}
const Font={heavySystemFont(){},boldSystemFont(){},semiboldSystemFont(){},systemFont(){}};
function FixedDateFactory(ms){return class FixedDate extends Date{constructor(...a){super(...a)}static now(){return ms}static parse(s){return Date.parse(s)}}}

async function run({now='2026-12-07T00:00:00Z',seedCache=null,schedule=null,standings=null,family='medium'}){
 const sink=[],files=new Map();
 const cachePath='/docs/motorsport-data-v1000-f1.json';if(seedCache!==null)files.set(cachePath,seedCache);
 const DateClass=FixedDateFactory(Date.parse(now));
 let repoRequests=0,setWidget=0,complete=0,scheduleCalls=0,standingsCalls=0;
 const fm={documentsDirectory:()=>'/docs',joinPath:(a,b)=>`${a}/${b}`,fileExists:p=>p.includes('motorsport-hero-v1000-')||files.has(p),readImage:()=>({size:{width:1600,height:900}}),writeImage(){},readString:p=>{if(!files.has(p))throw Error('missing');return files.get(p)},writeString:(p,s)=>files.set(p,String(s)),remove:p=>files.delete(p)};
 class Request{
  constructor(url){this.url=url;this.headers={}}
  async loadString(){if(this.url.includes('f1-widget-flat-v1000.js')){repoRequests++;return f1}throw Error('unexpected string request')}
  async loadJSON(){
   if(this.url.includes('/2026.json')){scheduleCalls++;if(schedule instanceof Error)throw schedule;return schedule??(()=>{throw Error('offline schedule')})()}
   if(this.url.includes('/driverstandings.json')){standingsCalls++;if(standings instanceof Error)throw standings;return standings??(()=>{throw Error('offline standings')})()}
   throw Error('unexpected json request')
  }
  async loadImage(){throw Error('hero should use cache')}
 }
 const CtxListWidget=class extends ListWidget{constructor(){super(sink)}};
 const ctx={args:{widgetParameter:'F1'},config:{runsInWidget:true,widgetFamily:family},FileManager:{local:()=>fm},Request,ListWidget:CtxListWidget,Color,LinearGradient,Size,DateFormatter,Font,Date:DateClass,Math,Map,Set,JSON,Number,String,Array,Object,RegExp,Error,Promise,Script:{setWidget(){setWidget++},complete(){complete++}}};ctx.globalThis=ctx;
 vm.createContext(ctx);await vm.runInContext(router,ctx,{timeout:5000});
 return{sink,files,cachePath,repoRequests,setWidget,complete,scheduleCalls,standingsCalls};
}

{
 const r=await run({seedCache:JSON.stringify({ranking:{}})});
 assert.equal(r.repoRequests,1,'F1 flattened path must use one repo module request');
 assert.equal(r.scheduleCalls,1);assert.equal(r.standingsCalls,1);
 assert.equal(r.setWidget,1);assert.equal(r.complete,1);
 assert(r.sink.includes('シーズン終了'),'offline post-finale header must show season end');
 assert(r.sink.includes('アブダビGP'),'offline post-finale fallback must be Abu Dhabi, not Italian GP');
 assert(r.sink.includes('SEASON END'));
 assert(!r.sink.includes('イタリアGP'),'historical snapshot must not reappear after finale');
 assert.equal(r.files.has(r.cachePath),false,'malformed F1 cache must be removed');
}

// If schedule succeeds but standings fails, atomic refresh must not save a partial cache.
{
 const schedule={MRData:{RaceTable:{Races:[{raceName:'Abu Dhabi Grand Prix',date:'2026-12-06',time:'13:00:00Z',Circuit:{circuitName:'Yas Marina Circuit'}}]}}};
 const r=await run({now:'2026-12-05T00:00:00Z',schedule,standings:new Error('standings down')});
 assert.equal(r.files.has(r.cachePath),false,'partial F1 refresh must never be promoted to cache');
 assert(r.sink.includes('• 更新待ち'),'partial refresh must be visibly non-fresh');
}

// Large v1 must add schedule context and positions 4-5 without adding another network source.
{
 const schedule={MRData:{RaceTable:{Races:[
  {round:'1',raceName:'Bahrain Grand Prix',date:'2026-03-15',time:'15:00:00Z',Circuit:{circuitName:'Bahrain International Circuit'}},
  {round:'2',raceName:'Spanish Grand Prix',date:'2026-09-13',time:'13:00:00Z',Circuit:{circuitName:'Circuit de Barcelona-Catalunya'}},
  {round:'3',raceName:'Azerbaijan Grand Prix',date:'2026-09-27',time:'12:00:00Z',Circuit:{circuitName:'Baku City Circuit'}}
 ]}}};
 const mk=(position,givenName,familyName,points,constructor)=>({position:String(position),points:String(points),Driver:{givenName,familyName},Constructors:[{name:constructor}]});
 const standings={MRData:{StandingsTable:{StandingsLists:[{DriverStandings:[
  mk(1,'Andrea Kimi','Antonelli',267,'Mercedes'),mk(2,'George','Russell',201,'Mercedes'),mk(3,'Lewis','Hamilton',191,'Ferrari'),mk(4,'Oscar','Piastri',184,'McLaren'),mk(5,'Max','Verstappen',171,'Red Bull')
 ]}]}}};
 const r=await run({now:'2026-09-13T12:00:00Z',schedule,standings,family:'large'});
 assert.equal(r.scheduleCalls,1);assert.equal(r.standingsCalls,1,'Large must reuse the existing two-source refresh');
 for(const label of ['MORE STANDINGS','SEASON','ROUND 2 / 3','PREVIOUS','NEXT','Oscar Piastri','Max Verstappen','Bahrain GP','Azerbaijan GP'])assert(r.sink.includes(label),`F1 Large missing ${label}`);
}

console.log('Motorsport Hub flattened F1 gate: PASS');
