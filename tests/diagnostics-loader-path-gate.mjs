import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const src=fs.readFileSync(path.join(root,'motorsport-diagnostics-v890.js'),'utf8');

class Text{constructor(v,s){this.value=String(v);s.push(this.value)}}
class Stack{constructor(s){this.s=s}addText(v){return new Text(v,this.s)}addSpacer(){}addStack(){return new Stack(this.s)}setPadding(){}layoutHorizontally(){}centerAlignContent(){}}
class ListWidget extends Stack{constructor(s){super(s);this.refreshAfterDate=null}}
class Color{constructor(){}static white(){return new Color()}}
const Font={heavySystemFont(){},boldSystemFont(){},semiboldSystemFont(){},systemFont(){}};
const TEXT=`2026 TOYOTA BMW FERRARI Manufacturer Hypercar
2026 FIA World Rally Championship for Drivers Elfyn Evans Sami Pajari Takamoto Katsuta
Riders' Championship MotoGP Aprilia Ducati Honda Yamaha KTM
GT500 ドライバーランキング 坪井 野尻 福住 Sho Tsuboi Tomoki Nojiri
CONNOR RYUMA KAZUMI standings
2026年ドライバーズランキング 横井 中村 蕎麦切
太田 格之進 岩佐 歩夢 イゴール フラガ Driver Standings
Alex Palou Kyle Kirkwood Christian Lundgaard Championship Standings
Lucas Auer Maro Engel Ricardo Feller GT World Challenge Europe Powered by AWS Drivers`;

async function render({release=null,offline=false}={}){
 const sink=[];let setWidget=0,complete=0;
 class Request{
  constructor(url){this.url=url;this.headers={}}
  async loadString(){return TEXT}
  async loadJSON(){
   if(this.url.includes('points-feed.json'))return[{driver_name:'A',points:1},{driver_name:'B',points:2},{driver_name:'C',points:3}];
   if(this.url.includes('driverstandings.json'))return{MRData:{StandingsTable:{StandingsLists:[{DriverStandings:[{},{},{}]}]}}};
   return{MRData:{RaceTable:{Races:Array.from({length:10},(_,i)=>({round:i+1}))}}};
  }
 }
 const CtxListWidget=class extends ListWidget{constructor(){super(sink)}};
 const ctx={config:{runsInWidget:true,widgetFamily:'medium'},Request,ListWidget:CtxListWidget,Color,Font,Date,Math,Promise,JSON,String,Number,Array,Object,RegExp,Error,globalThis:null,Script:{setWidget(){setWidget++},complete(){complete++}}};
 if(release)ctx.__MH_RELEASE_INTEGRITY=release;
 if(offline)ctx.__MH_REMOTE_OFFLINE=true;
 ctx.globalThis=ctx;
 vm.createContext(ctx);
 await vm.runInContext(src,ctx,{timeout:5000});
 assert.equal(setWidget,1);assert.equal(complete,1);assert(sink.includes('11/11 LIVE — データ経路OK'));
 return sink;
}

const sourceRef='abcdef0123456789abcdef0123456789abcdef01';
{
 const sink=await render({release:{sourceRef}});
 assert(sink.includes('IMMUTABLE ✓ · CANDIDATE · abcdef012345'),'candidate integrity status missing');
}
{
 const sink=await render({release:{sourceRef},offline:true});
 assert(sink.includes('IMMUTABLE ✓ · LKG · abcdef012345'),'LKG integrity status missing');
}
{
 const sink=await render();
 assert(sink.includes('DEV ROUTER · integrity OFF'),'dev integrity status missing');
}
{
 const sink=await render({release:{sourceRef:'not-a-commit'}});
 assert(sink.includes('INTEGRITY INVALID'),'invalid integrity status missing');
}

assert(src.includes('__MH_RELEASE_INTEGRITY'));
assert(src.includes('__MH_REMOTE_OFFLINE'));
console.log('Motorsport Hub diagnostics loader-path gate: PASS');
