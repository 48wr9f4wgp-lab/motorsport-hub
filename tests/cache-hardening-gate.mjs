import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const modules=[
  {file:'superformula-widget.js',cache:'motorsport-data-v900-superformula.json',category:'superformula',source:'https://superformula.net/sf2/race2026/standings'},
  {file:'indycar-widget.js',cache:'motorsport-data-v910-indycar.json',category:'indycar',source:'https://www.indycar.com/standings/'},
  {file:'nascar-widget.js',cache:'motorsport-data-v920-nascar.json',category:'nascar',source:'https://cf.nascar.com/cacher/2026/1/points-feed.json'},
  {file:'gtwc-europe-widget.js',cache:'motorsport-data-v930-gtwceu.json',category:'gtwceu',source:'https://www.gt-world-challenge-europe.com/standings?filter_standing_type=0_0_drivers'},
];

class Text { constructor(value){this.value=value;} rightAlignText(){} }
class Stack {
  addText(value){return new Text(value)} addSpacer(){} addStack(){return new Stack()}
  setPadding(){} layoutHorizontally(){} centerAlignContent(){}
}
class ListWidget extends Stack { constructor(){super();this.refreshAfterDate=null;} }
class Color { constructor(){} static white(){return new Color()} }
class LinearGradient { constructor(){this.colors=[];this.locations=[];} }
class Size { constructor(w,h){this.width=w;this.height=h;} }
class DateFormatter { constructor(){this.locale='';this.timeZone='';this.dateFormat='';} string(){return '8/30(日) 12:00';} }
const Font={heavySystemFont(){},boldSystemFont(){},semiboldSystemFont(){},systemFont(){}};

function makeFM(seed={}){
  const files=new Map(Object.entries(seed));
  return {
    files,
    documentsDirectory:()=>'/docs',joinPath:(a,b)=>`${a}/${b}`,
    fileExists:p=>files.has(p),
    writeString:(p,s)=>files.set(p,String(s)),
    readString:p=>{if(!files.has(p))throw new Error('missing');return files.get(p)},
    remove:p=>files.delete(p),
    writeImage(){},readImage(){throw new Error('no image')},
  };
}

async function runModule(spec,seed){
  const src=fs.readFileSync(path.join(root,spec.file),'utf8');
  assert.match(src,/CACHE_SCHEMA=1/,`${spec.file}: cache schema marker missing`);
  assert.match(src,/CACHE_MAX_AGE=7\*86400000/,`${spec.file}: cache TTL marker missing`);
  assert.match(src,/schemaVersion:CACHE_SCHEMA/,`${spec.file}: cache envelope missing`);
  const cachePath=`/docs/${spec.cache}`;
  const fm=makeFM({[cachePath]:seed});
  let completed=0,setWidget=0;
  class Request {
    constructor(url){this.url=url;this.headers={};}
    async loadString(){throw new Error('offline')}
    async loadJSON(){throw new Error('offline')}
    async loadImage(){throw new Error('offline')}
  }
  const ctx={
    args:{widgetParameter:''},config:{runsInWidget:true,widgetFamily:'medium'},
    FileManager:{local:()=>fm},Request,ListWidget,Color,LinearGradient,Size,DateFormatter,Font,
    Date,Math,Map,Set,JSON,Number,String,Array,Object,RegExp,Error,decodeURIComponent,
    Script:{complete(){completed++},setWidget(){setWidget++}},
  };
  ctx.globalThis=ctx;
  vm.createContext(ctx);
  await vm.runInContext(src,ctx,{timeout:5000});
  assert.equal(completed,1,`${spec.file}: Script.complete count`);
  assert.equal(setWidget,1,`${spec.file}: must render a fallback widget`);
  assert.equal(fm.files.has(cachePath),false,`${spec.file}: invalid/stale cache must be removed`);
}

for(const spec of modules){
  // Codex RC-06 reproduction: syntactically valid JSON with an invalid ranking shape.
  await runModule(spec,JSON.stringify({ranking:{}}));

  // Old pre-envelope cache must not be treated as validated data.
  await runModule(spec,JSON.stringify({race:'old',start:'2026-01-01T00:00:00Z',end:'2026-01-01T01:00:00Z',circuit:'old',ranking:[]}));

  // Structurally plausible but expired envelope must be rejected after seven days.
  const ranking=[1,2,3].map(i=>({pos:i,name:`Driver ${i}`,points:`${100-i} pts`}));
  const data={race:'Cached race',start:'2026-09-01T00:00:00Z',end:'2026-09-01T04:00:00Z',circuit:'Cached circuit',ranking};
  const stale={schemaVersion:1,category:spec.category,season:2026,fetchedAt:Date.now()-8*86400000,source:spec.source,ranking,event:{race:data.race,start:data.start,end:data.end,circuit:data.circuit,seasonEnded:false},data};
  await runModule(spec,JSON.stringify(stale));
}

console.log('Motorsport Hub cache hardening gate: PASS');
