import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const router=fs.readFileSync(path.join(root,'motorsport-hub.js'),'utf8');

class Text { constructor(value,sink){this.value=String(value);sink.push(this.value);} rightAlignText(){} }
class Stack {
  constructor(sink){this.sink=sink;}
  addText(v){return new Text(v,this.sink)} addSpacer(){} addStack(){return new Stack(this.sink)}
  setPadding(){} layoutHorizontally(){} centerAlignContent(){}
}
class ListWidget extends Stack { constructor(sink){super(sink);this.refreshAfterDate=null;} }
class Color { constructor(){} static white(){return new Color()} }
class LinearGradient { constructor(){this.colors=[];this.locations=[];} }
class Size { constructor(w,h){this.width=w;this.height=h;} }
class DateFormatter { constructor(){this.locale='';this.timeZone='';this.dateFormat='';} string(){return 'DATE';} }
const Font={heavySystemFont(){},boldSystemFont(){},semiboldSystemFont(){},systemFont(){}};

function fixedDate(nowMs){
  return class FixedDate extends Date {
    constructor(...args){super(...args)}
    static now(){return nowMs}
    static parse(s){return Date.parse(s)}
  };
}

async function render({parameter,moduleFile,now}){
  const moduleSource=fs.readFileSync(path.join(root,moduleFile),'utf8');
  const sink=[];
  const DateClass=fixedDate(Date.parse(now));
  const files=new Map();
  const fm={
    documentsDirectory:()=>'/docs',joinPath:(a,b)=>`${a}/${b}`,
    fileExists:p=>p.includes('motorsport-hero-')||files.has(p),
    readImage:()=>({size:{width:1600,height:900}}),writeImage(){},
    readString:p=>{if(!files.has(p))throw Error('missing');return files.get(p)},
    writeString:(p,s)=>files.set(p,String(s)),remove:p=>files.delete(p),
  };
  let setWidget=0,completed=0,moduleFetches=0;
  class Request {
    constructor(url){this.url=url;this.headers={};}
    async loadString(){
      if(this.url.includes(moduleFile)){moduleFetches++;return moduleSource}
      throw Error('offline data source');
    }
    async loadJSON(){throw Error('offline data source')}
    async loadImage(){throw Error('hero should use seeded cache')}
  }
  const CtxListWidget=class extends ListWidget{constructor(){super(sink)}};
  const ctx={
    args:{widgetParameter:parameter},config:{runsInWidget:true,widgetFamily:'medium'},
    FileManager:{local:()=>fm},Request,ListWidget:CtxListWidget,Color,LinearGradient,Size,DateFormatter,Font,
    Date:DateClass,Math,Map,Set,JSON,Number,String,Array,Object,RegExp,Error,decodeURIComponent,
    Script:{setWidget(){setWidget++},complete(){completed++}},
  };
  ctx.globalThis=ctx;
  vm.createContext(ctx);
  await vm.runInContext(router,ctx,{timeout:5000});
  assert.equal(moduleFetches,1,`${parameter}: module should be fetched once`);
  assert.equal(setWidget,1,`${parameter}: widget render count`);
  assert.equal(completed,1,`${parameter}: Script.complete count`);
  return sink;
}

const cases=[
  {
    parameter:'SUPERFORMULA',moduleFile:'superformula-widget.js',
    exactEnd:'2026-10-11T18:00:00+09:00',nextTitle:'第11・12戦 鈴鹿',afterFinal:'2026-11-23T00:00:00+09:00'
  },
  {
    parameter:'INDYCAR',moduleFile:'indycar-widget.js',
    exactEnd:'2026-08-29T18:30:00-04:00',nextTitle:'ミルウォーキー Race 2',afterFinal:'2026-09-07T00:00:00-04:00'
  },
  {
    parameter:'NASCAR',moduleFile:'nascar-widget.js',
    exactEnd:'2026-08-30T01:30:00-04:00',nextTitle:'ダーリントン',afterFinal:'2026-11-09T00:00:00-05:00'
  },
  {
    parameter:'GTWCEU',moduleFile:'gtwc-europe-widget.js',
    exactEnd:'2026-08-30T18:30:00+02:00',nextTitle:'ザントフォールト',afterFinal:'2026-10-19T00:00:00+01:00'
  },
];

for(const c of cases){
  const atEnd=await render({...c,now:c.exactEnd});
  assert(atEnd.includes(c.nextTitle),`${c.parameter}: exact end must advance under [start,end)`);
  assert(!atEnd.includes('開催中'),`${c.parameter}: exact end must not remain ACTIVE`);

  const ended=await render({...c,now:c.afterFinal});
  assert(ended.includes('シーズン終了'),`${c.parameter}: finale must switch header from 次戦`);
  assert(ended.includes('SEASON END'),`${c.parameter}: finale countdown state missing`);
  assert(!ended.includes('次戦'),`${c.parameter}: finale must not claim there is a next event`);
}

// Strict source-patch contract: a formatting drift must fail closed instead of silently executing old lifecycle logic.
{
  const src=fs.readFileSync(path.join(root,'indycar-widget.js'),'utf8').replace('function nextEvent(d){','function nextEventBROKEN(d){');
  const sink=[],files=new Map();let completed=0,setWidget=0;
  class Request {constructor(url){this.url=url;this.headers={}} async loadString(){if(this.url.includes('indycar-widget.js'))return src;throw Error('offline')}}
  const fm={documentsDirectory:()=>'/docs',joinPath:(a,b)=>`${a}/${b}`,fileExists:p=>files.has(p),readString:p=>files.get(p),writeString:(p,s)=>files.set(p,String(s)),remove:p=>files.delete(p)};
  const CtxListWidget=class extends ListWidget{constructor(){super(sink)}};
  const ctx={args:{widgetParameter:'INDYCAR'},config:{runsInWidget:true,widgetFamily:'medium'},FileManager:{local:()=>fm},Request,ListWidget:CtxListWidget,Color,Font,Date,Math,Script:{setWidget(){setWidget++},complete(){completed++}}};ctx.globalThis=ctx;
  vm.createContext(ctx);await vm.runInContext(router,ctx,{timeout:5000});
  assert.equal(setWidget,1,'patch mismatch should render router failure widget');
  assert(sink.some(x=>x.includes('安全に実行できません')),'patch mismatch failure message missing');
}

console.log('Motorsport Hub lifecycle hardening gate: PASS');
