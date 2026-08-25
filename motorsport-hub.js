// Motorsport Hub v9.3.1-hardening — module router / explicit parameter validation
// H1: prevents unknown widget parameters from silently falling back to F1.
// H4 bridge: a repo-raw circuit breaker prevents repeated serial GitHub timeouts before legacy caches are used.
// MH_ROUTER_SCHEMA=5
// MH_CATEGORY_MANIFEST=F1,WEC,WRC,SUPERGT,MOTOGP,FDJ,D1GP,SUPERFORMULA,INDYCAR,NASCAR,GTWCEU,QA
// Loader v4 compatibility marker: v8.6.0 motorsport-core-v841.js motorsport-hq-core.js fdj-widget.js
(async()=>{
const ROUTER_SCHEMA=5;
const CATEGORY_MANIFEST='F1,WEC,WRC,SUPERGT,MOTOGP,FDJ,D1GP,SUPERFORMULA,INDYCAR,NASCAR,GTWCEU,QA';
const SOURCE_REF=String(globalThis.__MH_SOURCE_REF||'main');
const labels=['F1','WEC','WRC','SUPER GT','MotoGP','FDJ','D1GP','SUPER FORMULA','INDYCAR','NASCAR Cup','GTWC Europe','QA診断'];
const params=['F1','WEC','WRC','SUPERGT','MOTOGP','FDJ','D1GP','SUPERFORMULA','INDYCAR','NASCAR','GTWCEU','QA'];
const norm=v=>String(v||'').trim().toUpperCase().replace(/[\s_-]+/g,'');
const aliases={
  D1:'D1GP',
  D1GRANDPRIX:'D1GP',
  SF:'SUPERFORMULA',
  SUPERF:'SUPERFORMULA',
  INDY:'INDYCAR',
  NASCARCUP:'NASCAR',
  NASCARCUPSERIES:'NASCAR',
  CUP:'NASCAR',
  GTWC:'GTWCEU',
  GTWCEUROPE:'GTWCEU',
  GTWCEU:'GTWCEU',
  GTWORLDCHALLENGEEUROPE:'GTWCEU'
};
const rawParameter=String(args.widgetParameter||'').trim();
let selected=norm(rawParameter);
selected=aliases[selected]||selected;

globalThis.__MH_ROUTER_SCHEMA=ROUTER_SCHEMA;
globalThis.__MH_ROUTER_MANIFEST=CATEGORY_MANIFEST;

async function messageWidget(title,msg){
  const w=new ListWidget();w.backgroundColor=new Color('#080B10');w.setPadding(12,12,12,12);
  const a=w.addText(title);a.font=Font.boldSystemFont(14);a.textColor=Color.white();
  w.addSpacer(6);const b=w.addText(msg);b.font=Font.systemFont(10);b.textColor=new Color('#FFB84D');b.lineLimit=4;
  w.refreshAfterDate=new Date(Date.now()+5*60000);
  if(config.runsInWidget)Script.setWidget(w);else await w.presentSmall();
  Script.complete();
}

if(!config.runsInWidget&&!params.includes(selected)){
  const a=new Alert();a.title='Motorsport Hub';a.message='プレビューするカテゴリ';
  labels.forEach(x=>a.addAction(x));a.addCancelAction('キャンセル');
  const i=await a.presentSheet();if(i<0){Script.complete();return}selected=params[i];
}
if(!selected)selected='F1';
if(!params.includes(selected)){
  globalThis.__MH_ROUTER_BOOT_OK=true;
  await messageWidget('Motorsport Hub','Widget Parameterが不正です。設定値を確認してください。'+(rawParameter?`\n入力: ${rawParameter}`:''));
  return;
}

const isQA=selected==='QA';
const isD1=selected==='D1GP';
const isSF=selected==='SUPERFORMULA';
const isINDY=selected==='INDYCAR';
const isNASCAR=selected==='NASCAR';
const isGTWC=selected==='GTWCEU';
const file=isQA?'motorsport-diagnostics-v890.js':isD1?'d1gp-reliability-v890.js':isSF?'superformula-widget.js':isINDY?'indycar-widget.js':isNASCAR?'nascar-widget.js':isGTWC?'gtwc-europe-widget.js':'motorsport-reliability-v896.js';
const key=isQA?'diagnostics-v890':isD1?'d1gp-v890':isSF?'superformula-v900':isINDY?'indycar-v910':isNASCAR?'nascar-v920':isGTWC?'gtwceu-v930':'reliability-v896';
const URL=`https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/${SOURCE_REF}/${file}`;
const fm=FileManager.local(),cache=fm.joinPath(fm.documentsDirectory(),`motorsport-hub-module-${key}.js`);
const valid=s=>typeof s==='string'
  &&s.includes('Motorsport Hub')
  &&s.includes('Script.complete()')
  &&(isQA?s.includes('QA diagnostics'):isD1?s.includes('D1GP reliability wrapper'):isSF?s.includes('SUPER FORMULA module'):isINDY?s.includes('INDYCAR module'):isNASCAR?s.includes('NASCAR Cup Series module'):isGTWC?s.includes('GT World Challenge Europe module'):s.includes('Reliability Pass'));

async function fail(){
  await messageWidget('Motorsport Hub','最新版モジュールを取得できません。旧版へ戻さず数分後に再試行します。');
}

let code='';
if(globalThis.__MH_REMOTE_OFFLINE!==true){
  try{
    const r=new Request(`${URL}?v=931&t=${Date.now()}-${Math.random()}`);r.timeoutInterval=15;
    r.headers={'Cache-Control':'no-cache, no-store, max-age=0, must-revalidate','Pragma':'no-cache','Expires':'0','User-Agent':'MotorsportHubRouter/9.3.1-hardening'};
    code=await r.loadString();if(!valid(code))throw Error('invalid module');fm.writeString(cache,code);
  }catch(e){globalThis.__MH_REMOTE_OFFLINE=true;}
}
if(!valid(code)){
  try{if(fm.fileExists(cache)){const c=fm.readString(cache);if(valid(c))code=c;else fm.remove(cache)}}catch(_){}
}
if(!valid(code)){await fail();return}

globalThis.__MH_ROUTER_BOOT_OK=true;
if(!isQA&&!isD1&&!isSF&&!isINDY&&!isNASCAR&&!isGTWC)globalThis.__MH_UNIVERSAL_PARAMETER=selected;

const originalLoadString=Request.prototype.loadString;
Request.prototype.loadString=async function(){
  const u=String(this?.url||'');
  const repoRaw=u.includes('raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/');
  if(repoRaw&&globalThis.__MH_REMOTE_OFFLINE===true)throw Error('MH_REPO_RAW_CIRCUIT_OPEN');
  try{return await originalLoadString.call(this)}
  catch(e){if(repoRaw)globalThis.__MH_REMOTE_OFFLINE=true;throw e}
};
try{await eval(code)}catch(e){await fail()}
finally{
  Request.prototype.loadString=originalLoadString;
  try{delete globalThis.__MH_UNIVERSAL_PARAMETER}catch(_){}
  try{delete globalThis.__MH_REMOTE_OFFLINE}catch(_){}
}
})();
