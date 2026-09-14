import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';

const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);
const root=path.resolve(__dirname,'..');

const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const bytes=s=>Buffer.byteLength(String(s??''),'utf8');
const cleanCode=value=>String(value??'UNKNOWN').toUpperCase().replace(/[^A-Z0-9_.:-]+/g,'_').slice(0,64)||'UNKNOWN';

export function normalizeErrorCode(error){
  if(!error)return'UNKNOWN';
  if(Number.isFinite(Number(error.status)))return cleanCode(`HTTP_${error.status}`);
  if(error.name==='AbortError'||error.name==='TimeoutError')return'TIMEOUT';
  return cleanCode(error.code||error.name||'ERROR');
}

function fixedDateFactory(nowMs){
  if(!Number.isFinite(nowMs))return Date;
  return class FixedDate extends Date{
    constructor(...args){super(...args)}
    static now(){return nowMs}
    static parse(value){return Date.parse(value)}
    static UTC(...args){return Date.UTC(...args)}
  };
}

class Text{constructor(value,sink){this.value=String(value);sink.push(this.value)}rightAlignText(){}}
class Stack{constructor(sink){this.sink=sink}addText(value){return new Text(value,this.sink)}addSpacer(){}addStack(){return new Stack(this.sink)}setPadding(){}layoutHorizontally(){}layoutVertically(){}centerAlignContent(){}}
class BaseListWidget extends Stack{constructor(sink){super(sink);this.refreshAfterDate=null}}
class Color{constructor(){}static white(){return new Color()}}
class LinearGradient{constructor(){this.colors=[];this.locations=[]}}
class Size{constructor(width,height){this.width=width;this.height=height}}
class DateFormatter{constructor(){this.locale='';this.timeZone='';this.dateFormat=''}string(date){return new Date(date).toISOString()}}
const Font={heavySystemFont(){},boldSystemFont(){},semiboldSystemFont(){},systemFont(){}};

function reportCacheWrites(files,startedAt){
  const found=[];
  for(const [filePath,raw] of files.entries()){
    if(typeof raw!=='string')continue;
    let parsed;
    try{parsed=JSON.parse(raw)}catch{continue}
    if(parsed?.schemaVersion!==1||!Number.isFinite(Number(parsed?.fetchedAt)))continue;
    if(Number(parsed.fetchedAt)<startedAt-2000)continue;
    if(!parsed?.data||typeof parsed.data!=='object')continue;
    found.push({
      path:path.basename(filePath),
      schemaVersion:parsed.schemaVersion,
      category:String(parsed.category||''),
      season:Number(parsed.season)||null,
      fetchedAt:Number(parsed.fetchedAt),
      source:String(parsed.source||'').slice(0,240),
    });
  }
  return found;
}

function createFetchRequest({record,moduleSource,requestLog,fetchImpl}){
  return class Request{
    constructor(url){this.url=String(url);this.headers={};this.timeoutInterval=10}
    async loadString(){
      if(this.url.includes(record.module)){
        requestLog.push({kind:'module',url:record.module,ok:true,status:200,bytes:bytes(moduleSource),elapsedMs:0});
        return moduleSource;
      }
      return await this.#remote('text');
    }
    async loadJSON(){return await this.#remote('json')}
    async loadImage(){throw Object.assign(new Error('LIVE_MONITOR_HERO_REQUEST_BLOCKED'),{code:'HERO_REQUEST_BLOCKED'})}
    async #remote(kind){
      const started=Date.now();
      const timeoutMs=Math.max(1000,Math.min(30000,Number(this.timeoutInterval||10)*1000));
      const controller=new AbortController();
      const timer=setTimeout(()=>controller.abort(),timeoutMs);
      try{
        const response=await fetchImpl(this.url,{headers:this.headers||{},redirect:'follow',signal:controller.signal});
        const text=await response.text();
        const entry={
          kind,
          url:this.url.slice(0,500),
          ok:response.ok,
          status:response.status,
          bytes:bytes(text),
          contentType:String(response.headers?.get?.('content-type')||'').slice(0,120),
          elapsedMs:Date.now()-started,
        };
        requestLog.push(entry);
        if(!response.ok){
          const error=new Error(`HTTP ${response.status}`);error.status=response.status;throw error;
        }
        if(kind==='json'){
          try{return JSON.parse(text)}catch(error){error.code='INVALID_JSON';throw error}
        }
        return text;
      }catch(error){
        if(!requestLog.some(x=>x.url===this.url&&x.elapsedMs>=0&&x.kind===kind)){
          requestLog.push({kind,url:this.url.slice(0,500),ok:false,status:null,bytes:0,elapsedMs:Date.now()-started,errorCode:normalizeErrorCode(error)});
        }else{
          const last=[...requestLog].reverse().find(x=>x.url===this.url&&x.kind===kind);
          if(last&&!last.ok&&!last.errorCode)last.errorCode=normalizeErrorCode(error);
        }
        throw error;
      }finally{clearTimeout(timer)}
    }
  };
}

async function runAttempt({record,router,moduleSource,fetchImpl,nowMs}){
  const startedAt=Date.now();
  const sink=[];
  const files=new Map();
  const requestLog=[];
  let setWidget=0,complete=0;
  const fm={
    documentsDirectory:()=>'/docs',
    joinPath:(a,b)=>`${a}/${b}`,
    fileExists:filePath=>String(filePath).includes('motorsport-hero-')||files.has(filePath),
    readImage:()=>({size:{width:1800,height:1200}}),
    writeImage(){},
    readString:filePath=>{if(!files.has(filePath))throw Error('missing');return files.get(filePath)},
    writeString:(filePath,value)=>files.set(filePath,String(value)),
    remove:filePath=>files.delete(filePath),
  };
  const Request=createFetchRequest({record,moduleSource,requestLog,fetchImpl});
  const CtxListWidget=class extends BaseListWidget{constructor(){super(sink)}};
  const DateClass=fixedDateFactory(nowMs);
  const ctx={
    args:{widgetParameter:record.id},
    config:{runsInWidget:true,widgetFamily:'medium'},
    FileManager:{local:()=>fm},Request,ListWidget:CtxListWidget,Color,LinearGradient,Size,DateFormatter,Font,
    Date:DateClass,Math,Map,Set,JSON,Number,String,Array,Object,RegExp,Error,Promise,decodeURIComponent,isFinite,
    Script:{setWidget(){setWidget++},complete(){complete++}},
  };
  ctx.globalThis=ctx;
  let runtimeError=null;
  try{
    vm.createContext(ctx);
    await vm.runInContext(router,ctx,{timeout:20000});
  }catch(error){runtimeError=error}

  const cacheWrites=reportCacheWrites(files,startedAt);
  const text=sink.join(' | ');
  const externalRequests=requestLog.filter(x=>x.kind!=='module');
  const moduleRequests=requestLog.filter(x=>x.kind==='module');
  let errorCode=null;
  if(runtimeError)errorCode=normalizeErrorCode(runtimeError);
  else if(moduleRequests.length!==1)errorCode='MODULE_ROUTE_COUNT';
  else if(setWidget!==1||complete!==1)errorCode='SCRIPT_LIFECYCLE';
  else if(cacheWrites.length===0)errorCode='NO_FRESH_DATA_CACHE';
  else if(/更新待ち|データ取得失敗|安全に実行できません|Widget Parameterが不正/.test(text))errorCode='FALLBACK_UI';
  else if(externalRequests.length===0)errorCode='NO_EXTERNAL_SOURCE_REQUEST';

  return{
    ok:!errorCode,
    errorCode,
    cacheWrites,
    requests:requestLog,
    widget:{setWidget,complete,textPreview:text.slice(0,600)},
    elapsedMs:Date.now()-startedAt,
  };
}

export async function runCategory(category,{fetchImpl=globalThis.fetch,attempts=2,retryDelayMs=1200,nowMs=null,rootDir=root}={}){
  if(typeof fetchImpl!=='function')throw Error('fetch implementation required');
  const registry=JSON.parse(fs.readFileSync(path.join(rootDir,'category-registry.json'),'utf8'));
  const record=registry.categories.find(item=>item.id===category);
  if(!record)throw Error(`Unknown category: ${category}`);
  const router=fs.readFileSync(path.join(rootDir,'motorsport-hub.js'),'utf8');
  const moduleSource=fs.readFileSync(path.join(rootDir,record.module),'utf8');
  const history=[];
  for(let attempt=1;attempt<=attempts;attempt++){
    const outcome=await runAttempt({record,router,moduleSource,fetchImpl,nowMs});
    history.push({attempt,...outcome});
    if(outcome.ok)return{category,ok:true,attempts:history};
    if(attempt<attempts)await delay(retryDelayMs);
  }
  return{category,ok:false,errorCode:history.at(-1)?.errorCode||'UNKNOWN',attempts:history};
}

export async function runMonitor({categories=null,fetchImpl=globalThis.fetch,attempts=2,retryDelayMs=1200,nowMs=null,rootDir=root}={}){
  const registry=JSON.parse(fs.readFileSync(path.join(rootDir,'category-registry.json'),'utf8'));
  const selected=categories?.length?categories:registry.categories.map(item=>item.id);
  const results=[];
  for(const category of selected){
    console.log(`\n[parser-monitor] ${category}`);
    const result=await runCategory(category,{fetchImpl,attempts,retryDelayMs,nowMs,rootDir});
    results.push(result);
    const last=result.attempts.at(-1);
    console.log(`[parser-monitor] ${category}: ${result.ok?'PASS':'FAIL'}${result.ok?'':` (${result.errorCode})`} — ${last?.elapsedMs??0}ms`);
  }
  return{
    schemaVersion:1,
    generatedAt:new Date().toISOString(),
    sourceSha:String(process.env.GITHUB_SHA||''),
    categories:results,
    summary:{total:results.length,passed:results.filter(x=>x.ok).length,failed:results.filter(x=>!x.ok).length},
  };
}

function markdownSummary(report){
  const rows=['## Motorsport Hub Live Parser Monitor','','| Category | Result | Attempts | Last error |','|---|---:|---:|---|'];
  for(const item of report.categories){rows.push(`| ${item.category} | ${item.ok?'✅ PASS':'❌ FAIL'} | ${item.attempts.length} | ${item.ok?'—':item.errorCode} |`)}
  rows.push('',`**${report.summary.passed}/${report.summary.total} passed.**`,'',`Source SHA: \`${report.sourceSha||'local'}\``);
  return rows.join('\n');
}

function parseArgs(argv){
  const options={categories:null,attempts:2,write:null,noFail:false};
  for(const arg of argv){
    if(arg.startsWith('--category='))options.categories=arg.slice(11).split(',').map(x=>x.trim().toUpperCase()).filter(Boolean);
    else if(arg.startsWith('--attempts='))options.attempts=Math.max(1,Math.min(4,Number(arg.slice(11))||2));
    else if(arg.startsWith('--write='))options.write=arg.slice(8);
    else if(arg==='--no-fail')options.noFail=true;
    else throw Error(`Unknown argument: ${arg}`);
  }
  return options;
}

async function main(){
  const options=parseArgs(process.argv.slice(2));
  const report=await runMonitor({categories:options.categories,attempts:options.attempts});
  if(options.write)fs.writeFileSync(path.resolve(options.write),`${JSON.stringify(report,null,2)}\n`);
  if(process.env.GITHUB_STEP_SUMMARY)fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,`${markdownSummary(report)}\n`);
  if(report.summary.failed>0&&!options.noFail)process.exitCode=1;
}

if(process.argv[1]&&path.resolve(process.argv[1])===__filename){
  main().catch(error=>{console.error(error);process.exitCode=1});
}
