// Motorsport Hub v9.3.5-hardening — module router / F1 + FDJ flatten pilots
// H1: explicit parameter validation and full-name aliases.
// H3: expansion categories use explicit UPCOMING / ACTIVE / SEASON_ENDED lifecycle with [start,end) boundaries.
// H4: F1 and FDJ use completed dedicated modules; remaining legacy categories retain the bridge circuit breaker.
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
const aliases={FORMULA1:'F1',FORMULADRIFTJAPAN:'FDJ',D1:'D1GP',D1GRANDPRIX:'D1GP',SF:'SUPERFORMULA',SUPERF:'SUPERFORMULA',INDY:'INDYCAR',NASCARCUP:'NASCAR',NASCARCUPSERIES:'NASCAR',CUP:'NASCAR',GTWC:'GTWCEU',GTWCEUROPE:'GTWCEU',GTWCEU:'GTWCEU',GTWORLDCHALLENGEEUROPE:'GTWCEU'};
const rawParameter=String(args.widgetParameter||'').trim();let selected=norm(rawParameter);selected=aliases[selected]||selected;
globalThis.__MH_ROUTER_SCHEMA=ROUTER_SCHEMA;globalThis.__MH_ROUTER_MANIFEST=CATEGORY_MANIFEST;

async function messageWidget(title,msg){const w=new ListWidget();w.backgroundColor=new Color('#080B10');w.setPadding(12,12,12,12);const a=w.addText(title);a.font=Font.boldSystemFont(14);a.textColor=Color.white();w.addSpacer(6);const b=w.addText(msg);b.font=Font.systemFont(10);b.textColor=new Color('#FFB84D');b.lineLimit=4;w.refreshAfterDate=new Date(Date.now()+5*60000);if(config.runsInWidget)Script.setWidget(w);else await w.presentSmall();Script.complete()}
if(!config.runsInWidget&&!params.includes(selected)){const a=new Alert();a.title='Motorsport Hub';a.message='プレビューするカテゴリ';labels.forEach(x=>a.addAction(x));a.addCancelAction('キャンセル');const i=await a.presentSheet();if(i<0){Script.complete();return}selected=params[i]}
if(!selected)selected='F1';
if(!params.includes(selected)){globalThis.__MH_ROUTER_BOOT_OK=true;await messageWidget('Motorsport Hub','Widget Parameterが不正です。設定値を確認してください。'+(rawParameter?`\n入力: ${rawParameter}`:''));return}

const isF1=selected==='F1',isFDJ=selected==='FDJ',isQA=selected==='QA',isD1=selected==='D1GP',isSF=selected==='SUPERFORMULA',isINDY=selected==='INDYCAR',isNASCAR=selected==='NASCAR',isGTWC=selected==='GTWCEU';
const isExpansion=isSF||isINDY||isNASCAR||isGTWC;
const file=isF1?'f1-widget-flat-v1000.js':isFDJ?'fdj-widget-flat-v1000.js':isQA?'motorsport-diagnostics-v890.js':isD1?'d1gp-reliability-v890.js':isSF?'superformula-widget.js':isINDY?'indycar-widget.js':isNASCAR?'nascar-widget.js':isGTWC?'gtwc-europe-widget.js':'motorsport-reliability-v896.js';
const key=isF1?'f1-flat-v1000':isFDJ?'fdj-flat-v1000':isQA?'diagnostics-v890':isD1?'d1gp-v890':isSF?'superformula-v900':isINDY?'indycar-v910':isNASCAR?'nascar-v920':isGTWC?'gtwceu-v930':'reliability-v896';
const URL=`https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/${SOURCE_REF}/${file}`;
const fm=FileManager.local(),cache=fm.joinPath(fm.documentsDirectory(),`motorsport-hub-module-${key}.js`);
const valid=s=>typeof s==='string'&&s.includes('Motorsport Hub')&&s.includes('Script.complete()')&&(isF1?s.includes('flattened F1 pilot module'):isFDJ?s.includes('flattened Formula Drift Japan module'):isQA?s.includes('QA diagnostics'):isD1?s.includes('D1GP reliability wrapper'):isSF?s.includes('SUPER FORMULA module'):isINDY?s.includes('INDYCAR module'):isNASCAR?s.includes('NASCAR Cup Series module'):isGTWC?s.includes('GT World Challenge Europe module'):s.includes('Reliability Pass'));

function replaceExact(s,needle,replacement,expected,label){const parts=String(s).split(needle),hits=parts.length-1;if(hits!==expected)throw Error(`HARDENING_PATCH_MISMATCH:${label}:${hits}/${expected}`);return parts.join(replacement)}
function hardenExpansionLifecycle(src){if(!isExpansion)return src;const oldNext="function nextEvent(d){const now=Date.now();for(const e of CAL){if(Date.parse(e.end)>now)return{...d,...e,seasonEnded:false}}const last=CAL[CAL.length-1];return{...d,...last,seasonEnded:true}}";const newNext="function nextEvent(d){const now=Date.now();for(const e of CAL){const s=Date.parse(e.start),end=Date.parse(e.end);if(now<end)return{...d,...e,seasonEnded:false,lifecycle:now>=s?'ACTIVE':'UPCOMING'}}const last=CAL[CAL.length-1];return{...d,...last,seasonEnded:true,lifecycle:'SEASON_ENDED'}}";const oldCountdown="function countdown(d){if(d.seasonEnded)return{label:'SEASON END',live:false};const now=Date.now(),s=Date.parse(d.start),e=Date.parse(d.end);if(now>=s&&now<=e)return{label:'開催中',live:true};const q=s-now;if(q<=0)return{label:'終了',live:false};const h=q/3600000;if(h<24)return{label:`あと${Math.ceil(h)}時間`,live:false};return{label:`あと${Math.ceil(h/24)}日`,live:false}}";const newCountdown="function countdown(d){if(d.lifecycle==='SEASON_ENDED'||d.seasonEnded)return{label:'SEASON END',live:false};const now=Date.now(),s=Date.parse(d.start),e=Date.parse(d.end);if(now>=s&&now<e)return{label:'開催中',live:true};const q=s-now;if(q<=0)return{label:'終了',live:false};const h=q/3600000;if(h<24)return{label:`あと${Math.ceil(h)}時間`,live:false};return{label:`あと${Math.ceil(h/24)}日`,live:false}}";let out=replaceExact(src,oldNext,newNext,1,'nextEvent');out=replaceExact(out,oldCountdown,newCountdown,1,'countdown');out=replaceExact(out,"T(top,'次戦',","T(top,d.lifecycle==='SEASON_ENDED'?'シーズン終了':'次戦',",2,'header');if(!out.includes("lifecycle:'SEASON_ENDED'")||!out.includes("now>=s&&now<e")||!out.includes("?'シーズン終了':'次戦'"))throw Error('HARDENING_PATCH_POSTCONDITION');return out}
async function fail(){await messageWidget('Motorsport Hub','最新版モジュールを安全に実行できません。数分後に再試行します。')}

let code='';
if(globalThis.__MH_REMOTE_OFFLINE!==true){try{const r=new Request(`${URL}?v=935&t=${Date.now()}-${Math.random()}`);r.timeoutInterval=15;r.headers={'Cache-Control':'no-cache, no-store, max-age=0, must-revalidate','Pragma':'no-cache','Expires':'0','User-Agent':'MotorsportHubRouter/9.3.5-hardening'};code=await r.loadString();if(!valid(code))throw Error('invalid module');fm.writeString(cache,code)}catch(e){globalThis.__MH_REMOTE_OFFLINE=true}}
if(!valid(code)){try{if(fm.fileExists(cache)){const c=fm.readString(cache);if(valid(c))code=c;else fm.remove(cache)}}catch(_){} }
if(!valid(code)){await fail();return}
try{code=hardenExpansionLifecycle(code)}catch(_){await fail();return}

globalThis.__MH_ROUTER_BOOT_OK=true;
if(!isF1&&!isFDJ&&!isQA&&!isD1&&!isExpansion)globalThis.__MH_UNIVERSAL_PARAMETER=selected;
const originalLoadString=Request.prototype.loadString;
Request.prototype.loadString=async function(){const u=String(this?.url||''),repoRaw=u.includes('raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/');if(repoRaw&&globalThis.__MH_REMOTE_OFFLINE===true)throw Error('MH_REPO_RAW_CIRCUIT_OPEN');try{return await originalLoadString.call(this)}catch(e){if(repoRaw)globalThis.__MH_REMOTE_OFFLINE=true;throw e}};
try{await eval(code)}catch(e){await fail()}
finally{Request.prototype.loadString=originalLoadString;try{delete globalThis.__MH_UNIVERSAL_PARAMETER}catch(_){}try{delete globalThis.__MH_REMOTE_OFFLINE}catch(_){} }
})();
