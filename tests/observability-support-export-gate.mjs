import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=fs.readFileSync(path.join(root,'support-observability-export.js'),'utf8');
new Function(source);
assert(!/\bRequest\s*\(/.test(source),'support export must not make network requests');
assert(source.includes('ShareSheet.present'),'support export must use an explicit iOS share sheet');
assert(source.includes('addCancelAction'),'support export must allow cancel before sharing');

const obsPath='/docs/motorsport-hub-observability-v1.json';
async function run({seed=null,choices=[0]}={}){
  const files=new Map();
  if(seed!==null)files.set(obsPath,typeof seed==='string'?seed:JSON.stringify(seed));
  const alerts=[];
  const shares=[];
  let complete=0;
  class Alert{
    constructor(){this.title='';this.message='';this.actions=[];this.cancel=null;alerts.push(this)}
    addAction(v){this.actions.push(v)}
    addCancelAction(v){this.cancel=v}
    async presentAlert(){return choices.length?choices.shift():0}
  }
  const fm={
    documentsDirectory:()=>'/docs',
    joinPath:(a,b)=>`${a}/${b}`,
    fileExists:p=>files.has(p),
    readString:p=>{if(!files.has(p))throw new Error('missing');return files.get(p)}
  };
  const ctx={
    FileManager:{local:()=>fm},
    Alert,
    ShareSheet:{present:async items=>{shares.push(items);return {activity:null}}},
    Script:{complete(){complete++}},
    Date,Math,JSON,String,Number,Array,Object,RegExp,Error,Promise
  };
  ctx.globalThis=ctx;
  vm.createContext(ctx);
  await vm.runInContext(source,ctx,{timeout:5000});
  return{alerts,shares,complete};
}

{
  const r=await run();
  assert.equal(r.complete,1);
  assert.equal(r.shares.length,0,'missing log must never share');
  assert.match(r.alerts.at(-1).message,/No local observability file/);
}

{
  const r=await run({seed:{schemaVersion:99,events:[]}});
  assert.equal(r.complete,1);
  assert.equal(r.shares.length,0,'unsupported schema must never share');
  assert.match(r.alerts.at(-1).message,/unsupported schema/);
}

{
  const events=Array.from({length:205},(_,i)=>({
    ts:`2026-09-14T00:00:${String(i%60).padStart(2,'0')}Z`,
    releaseId:'mh-safe_release',
    version:'9.5.24',
    sourceRef:'ABCDEF1234567890',
    sequence:5,
    category:'WRC<script>',
    family:'LARGE!!!',
    path:'candidate<script>',
    ok:i%2===0,
    ms:i===204?9_999_999:i,
    errorCode:'http_500<script>',
    email:'private@example.com',
    latitude:36.0,
    exception:'SECRET_STACK_TRACE'
  }));
  const r=await run({seed:{schemaVersion:1,events}});
  assert.equal(r.complete,1);
  assert.equal(r.shares.length,1,'explicit share action must produce one export');
  const text=r.shares[0][0];
  const payload=JSON.parse(text);
  assert.equal(payload.schemaVersion,1);
  assert.equal(payload.supportExportVersion,1);
  assert.equal(payload.eventCount,200,'export must be bounded to the latest 200 events');
  assert.equal(payload.events.length,200);
  const last=payload.events.at(-1);
  assert.equal(last.category,'WRCSCRIPT');
  assert.equal(last.family,'large');
  assert.equal(last.path,'CANDIDATESCRIPT');
  assert.equal(last.errorCode,'HTTP_500SCRIPT');
  assert.equal(last.sourceRef,'abcdef123456');
  assert.equal(last.ms,3600000,'elapsed time must be bounded');
  assert(!text.includes('private@example.com'));
  assert(!text.includes('SECRET_STACK_TRACE'));
  assert(!text.includes('latitude'));
  assert(!text.includes('exception'));
  for(const event of payload.events){
    const keys=Object.keys(event).sort();
    const allowed=['category','errorCode','family','ms','ok','path','releaseId','sequence','sourceRef','ts','version'];
    assert(keys.every(k=>allowed.includes(k)),`unexpected exported key: ${keys.join(',')}`);
  }
}

{
  const r=await run({seed:{schemaVersion:1,events:[]},choices:[-1]});
  assert.equal(r.complete,1);
  assert.equal(r.shares.length,0,'cancel must not invoke ShareSheet');
}

console.log('Motorsport Hub observability support export gate: PASS');
