const CORE='https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/club-pulse-runtime/scriptable/club-pulse-core.js',PATCH='https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/839434e9b6e414f1382fa2b5b9ead69d3112b965/scriptable/club-pulse-ui-patch.js',COMP_PATCH='https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/288a223e94e49face49f4061641460ec5848dc93/scriptable/club-pulse-competition-logo-patch.js',THEME_PATCH='https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/cb2317f6f0c4381e10e39df517ff3c69beceef9e/scriptable/club-pulse-manutd-theme-patch.js',LIVE_CONTEXT_PATCH='https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/d1f571e9658e99d69a64dbbe591655a048461654/scriptable/club-pulse-live-context-patch.js',RESILIENCE_PATCH='https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/7a79c66de299c4ccd4fc974d8a28aa3b7d9df2c3/scriptable/club-pulse-resilience-patch.js',F=FileManager.local(),CP=F.joinPath(F.documentsDirectory(),'ClubPulseCore_v1.js'),PP=F.joinPath(F.documentsDirectory(),'ClubPulseUIPatch_v8.js'),LP=F.joinPath(F.documentsDirectory(),'ClubPulseCompetitionLogoPatch_v3.js'),TP=F.joinPath(F.documentsDirectory(),'ClubPulseManUThemePatch_v3.js'),LCP=F.joinPath(F.documentsDirectory(),'ClubPulseLiveContextPatch_v1.js'),RP=F.joinPath(F.documentsDirectory(),'ClubPulseResiliencePatch_v1.js'),QAP=F.joinPath(F.documentsDirectory(),'ClubPulseQAOverride_v1.json');
let p=String(args.widgetParameter||'manutd').trim()||'manutd';
if(config.runsInApp&&!p.includes(':')){
  let a=new Alert();a.title='Club Pulse 耐障害QA';a.message='通常表示または障害状態を選択';
  ['通常表示','通信障害・保存あり','通信障害・保存なし'].forEach(x=>a.addAction(x));a.addCancelAction('キャンセル');
  let i=await a.presentSheet();
  if(i<0){Script.complete();return}
  if(i===1)p=p+':offline';else if(i===2)p=p+':nocache';
}
function cpQaRead(){try{return F.fileExists(QAP)?JSON.parse(F.readString(QAP)):null}catch{return null}}
function cpQaWrite(v){try{F.writeString(QAP,JSON.stringify(v))}catch{}}
function cpQaClear(){try{if(F.fileExists(QAP))F.remove(QAP)}catch{}}
(function(){
  let a=p.split(':'),clubId=a[0]||'manutd',mode=(a[1]||'').toLowerCase(),now=Date.now();
  if(config.runsInApp){
    if(mode&&mode!=='auto'&&mode!=='normal')cpQaWrite({clubId,mode,expiresAt:now+15*60*1000});
    else cpQaClear();
    return;
  }
  if(mode)return;
  let o=cpQaRead();
  if(!o)return;
  if(!o.expiresAt||o.expiresAt<=now){cpQaClear();return}
  if(o.clubId===clubId&&o.mode)p=clubId+':'+o.mode;
})();
async function core(){if(!F.fileExists(CP)){let r=new Request(CORE+'?v=1');r.timeoutInterval=10;let s=await r.loadString();if(!s||s.length<1000)throw new Error('Invalid core');F.writeString(CP,s)}return F.readString(CP)}
async function getRemote(url,file,min,tag){try{let r=new Request(url+'?v='+tag+'-'+Date.now());r.timeoutInterval=10;let s=await r.loadString();if(!s||s.length<min)throw new Error('Invalid patch');F.writeString(file,s);return s}catch(e){if(F.fileExists(file))return F.readString(file);throw e}}
let c=await core(),x=await getRemote(PATCH,PP,300,'ui8'),y=await getRemote(COMP_PATCH,LP,300,'comp3'),z=await getRemote(THEME_PATCH,TP,300,'mutheme3'),q=await getRemote(LIVE_CONTEXT_PATCH,LCP,250,'livectx1'),r=await getRemote(RESILIENCE_PATCH,RP,300,'resilience1'),M='if(config.runsInApp&&!getLiveToken())await setupLiveToken();',k=c.indexOf(M),b=k>=0?c.slice(0,k)+'\n'+x+'\n'+y+'\n'+z+'\n'+q+'\n'+r+'\n'+c.slice(k):c+'\n'+x+'\n'+y+'\n'+z+'\n'+q+'\n'+r;
await new Function('args','return (async()=>{\n'+b+'\n})()')({widgetParameter:p});
/* Compatibility padding: keep this launcher above 1000 bytes because older installed recovery loaders reject downloaded runtime files shorter than 1000 bytes. Legacy installed loaders have a hard-coded first QA menu that cannot gain new items from GitHub. During resilience QA, choosing the legacy loader's normal option enters this remote secondary menu, which exposes normal display, offline-with-cache, and no-cache failure without requiring the user to reinstall the local loader. The secondary menu can be removed after resilience QA is complete. Club Pulse loads the stable UI patch, competition-logo patch v3, Manchester United theme patch v3, LIVE-context patch v1, then resilience patch v1. QA selections made while running inside Scriptable are persisted for 15 minutes in ClubPulseQAOverride_v1.json so Small and Medium home-screen widgets render the same QA state; choosing normal/auto clears the override and expired overrides self-delete. Resilience QA can force an offline-with-cache state without deleting data, or a no-cache error state while preserving the real cache. Small stale cards show a 保存 indicator; Medium keeps the 保存データ timestamp suffix. Error widgets retry automatically. In POST QA, the first form chip is synchronized with the displayed result so the test state is internally consistent. LIVE cards avoid repeating the competition name below the score: Medium and Small use home/away plus venue while the minute remains at top right. POST layouts remove redundant FT labels so result + competition remain readable at real Small/Medium widget widths. The Man U theme applies only when club.team === 66. Arsenal and Barcelona retain their existing club themes. Competition identity colors and competition logos remain intact. */