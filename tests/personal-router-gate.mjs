import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const router=fs.readFileSync(path.join(root,'motorsport-hub.js'),'utf8');
const cockpit=fs.readFileSync(path.join(root,'motorsport-personal-cockpit.js'),'utf8');
const configSrc=fs.readFileSync(path.join(root,'motorsport-personal-config.js'),'utf8');

for(const token of [
  "'MY','CONFIG'",
  "RACEDAY:'MY'",
  "SETTINGS:'CONFIG'",
  'PERSONAL_ROUTES',
  "file:'motorsport-personal-cockpit.js'",
  "file:'motorsport-personal-config.js'",
  "selected==='CONFIG'",
  'executePersonalRoute'
])assert(router.includes(token),`Router personal integration missing: ${token}`);

class Text{constructor(v,s){this.value=String(v);s.push(this.value)}rightAlignText(){}}
class Stack{constructor(s){this.s=s}addText(v){return new Text(v,this.s)}addSpacer(){}addStack(){return new Stack(this.s)}setPadding(){}layoutHorizontally(){}layoutVertically(){}centerAlignContent(){}}
class ListWidget extends Stack{constructor(s){super(s);this.refreshAfterDate=null;this.url=null}}
class Color{constructor(){}static white(){return new Color()}}
class LinearGradient{constructor(){this.colors=[];this.locations=[]}}
class DateFormatter{constructor(){this.locale='';this.timeZone='';this.dateFormat=''}string(){return'DATE'}}
const Font={heavySystemFont(){},boldSystemFont(){},semiboldSystemFont(){},systemFont(){}};

function makeFM(){
  const files=new Map();
  files.set('/docs/motorsport-data-v1000-f1.json',JSON.stringify({
    schemaVersion:1,category:'f1',season:2026,fetchedAt:Date.now(),
    event:{race:'Test GP',start:'2026-10-01T09:00:00Z',end:'2026-10-01T13:00:00Z',circuit:'Test Circuit',lifecycle:'UPCOMING'},
    data:{race:'Test GP',start:'2026-10-01T09:00:00Z',end:'2026-10-01T13:00:00Z',circuit:'Test Circuit',lifecycle:'UPCOMING',ranking:[{pos:1,name:'Test Driver',points:'100 pts'}]}
  }));
  files.set('/docs/motorsport-viewing-jp-f6f7e1d353ab.json',JSON.stringify({
    region:'JP',categories:{F1:{status:'VERIFIED',label:'TEST TV',validUntil:'2026-12-31T14:59:59Z'}}
  }));
  return{
    files,
    documentsDirectory:()=>'/docs',
    joinPath:(a,b)=>`${a}/${b}`,
    fileExists:p=>files.has(p),
    readString:p=>{if(!files.has(p))throw Error('missing '+p);return files.get(p)},
    writeString:(p,s)=>files.set(p,String(s)),
    remove:p=>files.delete(p),
    listContents:()=>[...files.keys()].filter(x=>x.startsWith('/docs/')).map(x=>x.slice(6)),
    modificationDate:()=>new Date()
  };
}

async function run(parameter){
  const sink=[],requests=[],fm=makeFM();let setWidget=0,complete=0;
  class Request{
    constructor(url){this.url=url;this.headers={};requests.push(url)}
    async loadString(){
      if(this.url.includes('motorsport-personal-cockpit.js'))return cockpit;
      if(this.url.includes('motorsport-personal-config.js'))return configSrc;
      throw Error('unexpected request '+this.url);
    }
    async loadJSON(){throw Error('no JSON network expected')}
    async loadImage(){throw Error('no image network expected')}
  }
  const ctx={
    args:{widgetParameter:parameter,queryParameters:{}},
    config:{runsInWidget:true,widgetFamily:'medium'},
    FileManager:{local:()=>fm},Request,
    ListWidget:class extends ListWidget{constructor(){super(sink)}},
    Color,LinearGradient,DateFormatter,Font,Date,Math,Map,Set,JSON,Number,String,Array,Object,RegExp,Error,Promise,decodeURIComponent,isFinite,
    Script:{setWidget(){setWidget++},complete(){complete++}}
  };
  ctx.globalThis=ctx;vm.createContext(ctx);await vm.runInContext(router,ctx,{timeout:5000});
  return{sink,requests,setWidget,complete};
}

{
  const r=await run('MY');
  assert.equal(r.requests.length,1,'MY must only fetch its immutable personal module');
  assert(r.requests[0].includes('motorsport-personal-cockpit.js'),'MY must fetch cockpit module');
  assert.equal(r.setWidget,1,'MY must render one widget');
  assert.equal(r.complete,1,'MY must complete exactly once');
  const text=r.sink.join(' | ');
  assert(text.includes('MY RACE DAY'),'MY title missing');
  assert(text.includes('Test GP'),'MY cached event missing');
  assert(text.includes('視聴 TEST TV'),'MY viewing label missing');
  assert(text.includes('1位 Test Driver'),'MY leader missing');
}
{
  const r=await run('RACEDAY');
  assert(r.requests.some(x=>x.includes('motorsport-personal-cockpit.js')),'RACEDAY alias must route to MY');
}
{
  const r=await run('CONFIG');
  assert.equal(r.requests.length,0,'CONFIG widget must not fetch interactive config module');
  assert.equal(r.setWidget,1,'CONFIG widget should render guidance');
  assert(r.sink.join(' | ').includes('Personal Config'),'CONFIG guidance missing');
}

console.log('Motorsport Hub integrated personal Router gate: PASS');
