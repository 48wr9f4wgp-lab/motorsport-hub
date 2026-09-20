import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const modules=[
 'f1-widget-flat-v1000.js',
 'wec-widget-flat-v1000.js',
 'wrc-widget-flat-v1000.js',
 'supergt-widget-flat-v1000.js',
 'motogp-widget-flat-v1000.js',
 'fdj-widget-flat-v1000.js',
 'd1gp-widget-flat-v1000.js',
 'superformula-widget.js',
 'indycar-widget.js',
 'nascar-widget.js',
 'gtwc-europe-widget.js',
 'dakar-widget.js',
];

function source(file){return fs.readFileSync(path.join(root,file),'utf8')}
function extractFn(src,name){
 const i=src.indexOf(`function ${name}`);
 assert(i>=0,`${name} missing`);
 const b=src.indexOf('{',i);let depth=0;
 for(let j=b;j<src.length;j++){
  if(src[j]==='{')depth++;
  else if(src[j]==='}'){depth--;if(depth===0)return src.slice(i,j+1)}
 }
 assert.fail(`${name} unterminated`);
}
function countdownAt(file,now,data){
 const src=source(file);
 const code=[extractFn(src,'tokyoDay'),extractFn(src,'dayLabel'),extractFn(src,'countdown')].join('\n');
 const NativeDate=Date;
 class FixedDate extends NativeDate{
  constructor(...args){super(...args)}
  static now(){return now}
  static parse(v){return NativeDate.parse(v)}
 }
 const ctx={Date:FixedDate,Math,Number,String,Object,Array,RegExp,isFinite};
 ctx.__data=data;
 vm.createContext(ctx);
 vm.runInContext(code,ctx,{timeout:1000});
 return vm.runInContext('countdown(__data)',ctx,{timeout:1000});
}

for(const file of modules){
 const src=source(file),fn=extractFn(src,'countdown');
 assert(src.includes('function tokyoDay('),`${file}: Tokyo-day helper missing`);
 assert(src.includes('function dayLabel('),`${file}: calendar-day helper missing`);
 assert(fn.includes('dayLabel('),`${file}: countdown must use calendar-day semantics for day labels`);
 assert(!fn.includes('Math.ceil(h/24)'),`${file}: 24-hour ceil day labels must not return`);
}

const now=Date.parse('2026-09-20T08:48:00+09:00');

{
 const r=countdownAt('supergt-widget-flat-v1000.js',now,{date:'2026-09-20T12:00:00+09:00',timeTbd:true,lifecycle:'UPCOMING',seasonEnded:false});
 assert.equal(r.label,'今日','SUPER GT same-day TBD event must say 今日');assert.equal(r.live,false);
}
{
 const r=countdownAt('motogp-widget-flat-v1000.js',now,{date:'2026-09-20T12:00:00+02:00',timeTbd:true,lifecycle:'UPCOMING',seasonEnded:false});
 assert.equal(r.label,'今日','MotoGP same Tokyo-calendar day TBD event must say 今日');assert.equal(r.live,false);
}
assert.equal(
 countdownAt('f1-widget-flat-v1000.js',now,{start:'2026-09-26T20:00:00+09:00',end:'2026-09-26T23:00:00+09:00',lifecycle:'UPCOMING',seasonEnded:false}).label,
 'あと6日',
 'F1 long countdown must use Tokyo calendar-day difference'
);
assert.equal(
 countdownAt('wec-widget-flat-v1000.js',now,{date:'2026-09-27T11:00:00+09:00',timeTbd:false,lifecycle:'UPCOMING',seasonEnded:false}).label,
 'あと7日',
 'WEC long countdown must use Tokyo calendar-day difference'
);
const nascarLive=countdownAt('nascar-widget.js',now,{start:'2026-09-19T19:30:00-04:00',end:'2026-09-20T01:30:00-04:00',lifecycle:'ACTIVE',seasonEnded:false});
assert.equal(nascarLive.label,'開催中','NASCAR exact live window must remain live');assert.equal(nascarLive.live,true);

const wec=source('wec-widget-flat-v1000.js');
assert(wec.includes("['6 Hours of Fuji','2026-09-27T11:00:00+09:00','Fuji Speedway',false]"),'WEC Fuji 2026 race must be pinned to official 11:00 JST start');
assert(!wec.includes("['6 Hours of Fuji','2026-09-27T12:00:00+09:00','Fuji Speedway',false]"),'obsolete WEC Fuji 12:00 start must not return');

const nascar=source('nascar-widget.js');
assert.equal((nascar.match(/ci\.live\?'レース中':'次戦'/g)||[]).length,3,'NASCAR Small/Medium/Large top status must switch to レース中');

const dakar=source('dakar-widget.js');
assert(!dakar.includes('H${UI.heroVariant+1}/3'),'Dakar internal Hero index must not be rendered');
const dakarFns=[extractFn(dakar,'validGap'),extractFn(dakar,'timeSeconds'),extractFn(dakar,'gapText')].join('\n');
const dctx={String,Number,Math,RegExp};vm.createContext(dctx);vm.runInContext(dakarFns,dctx,{timeout:1000});
assert.equal(vm.runInContext("validGap('+',2)",dctx),false,'plain + is not a valid Dakar gap');
assert.equal(vm.runInContext("validGap('+9:42',2)",dctx),true,'normalized Dakar gap must remain valid');
assert.equal(vm.runInContext("gapText(timeSeconds(\"49h 06' 35''\")-timeSeconds(\"48h 56' 53''\"))",dctx),'+9:42','Dakar total times must reconstruct P2 gap');

console.log('Motorsport Hub temporal accuracy gate: PASS');
