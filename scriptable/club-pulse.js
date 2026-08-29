const CORE='https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/club-pulse-runtime/scriptable/club-pulse-core.js',CLUB_REGISTRY_PATCH='https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/09d01021ce8c800f3032925f44621d28f877b070/scriptable/club-pulse-club-registry-patch.js',PATCH='https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/839434e9b6e414f1382fa2b5b9ead69d3112b965/scriptable/club-pulse-ui-patch.js',COMP_PATCH='https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/288a223e94e49face49f4061641460ec5848dc93/scriptable/club-pulse-competition-logo-patch.js',THEME_PATCH='https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/cb2317f6f0c4381e10e39df517ff3c69beceef9e/scriptable/club-pulse-manutd-theme-patch.js',THEME_REGISTRY_PATCH='https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/ebc2a8b0ea80156b213a659ea1226ff2b2728511/scriptable/club-pulse-theme-registry-patch.js',TOP_LAYOUT_PATCH='https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/5f2643708f6d5e51a1b9a2d32dfd58312d7f0a1c/scriptable/club-pulse-top-layout-patch.js',LIVE_CONTEXT_PATCH='https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/d1f571e9658e99d69a64dbbe591655a048461654/scriptable/club-pulse-live-context-patch.js',RESILIENCE_PATCH='https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/e0b46e7d1eb398f01ad41f7b2434f30e9263b5bd/scriptable/club-pulse-resilience-patch.js',F=FileManager.local(),CP=F.joinPath(F.documentsDirectory(),'ClubPulseCore_v1.js'),CRP=F.joinPath(F.documentsDirectory(),'ClubPulseClubRegistryPatch_v2.js'),PP=F.joinPath(F.documentsDirectory(),'ClubPulseUIPatch_v8.js'),LP=F.joinPath(F.documentsDirectory(),'ClubPulseCompetitionLogoPatch_v3.js'),TP=F.joinPath(F.documentsDirectory(),'ClubPulseManUThemePatch_v3.js'),TRP=F.joinPath(F.documentsDirectory(),'ClubPulseThemeRegistryPatch_v2.js'),TLP=F.joinPath(F.documentsDirectory(),'ClubPulseTopLayoutPatch_v2.js'),LCP=F.joinPath(F.documentsDirectory(),'ClubPulseLiveContextPatch_v1.js'),RP=F.joinPath(F.documentsDirectory(),'ClubPulseResiliencePatch_v2.js'),QAP=F.joinPath(F.documentsDirectory(),'ClubPulseQAOverride_v1.json');
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
let c=await core(),cr=await getRemote(CLUB_REGISTRY_PATCH,CRP,300,'clubs2'),x=await getRemote(PATCH,PP,300,'ui8'),y=await getRemote(COMP_PATCH,LP,300,'comp3'),z=await getRemote(THEME_PATCH,TP,300,'mutheme3'),tr=await getRemote(THEME_REGISTRY_PATCH,TRP,300,'themes2'),u=await getRemote(TOP_LAYOUT_PATCH,TLP,300,'toplayout2'),q=await getRemote(LIVE_CONTEXT_PATCH,LCP,250,'livectx1'),r=await getRemote(RESILIENCE_PATCH,RP,300,'resilience2');
const PM='const param=String(args.widgetParameter',pk=c.indexOf(PM);
if(pk<0)throw new Error('Club registry injection marker missing');
c=c.slice(0,pk)+cr+'\n'+c.slice(pk);
const M='if(config.runsInApp&&!getLiveToken())await setupLiveToken();',k=c.indexOf(M),patches=x+'\n'+y+'\n'+z+'\n'+tr+'\n'+u+'\n'+q+'\n'+r,b=k>=0?c.slice(0,k)+'\n'+patches+'\n'+c.slice(k):c+'\n'+patches;
await new Function('args','return (async()=>{\n'+b+'\n})()')({widgetParameter:p});
/* Compatibility padding: keep this launcher above 1000 bytes because older installed recovery loaders reject downloaded runtime files shorter than 1000 bytes. Club Pulse injects declarative club registry v2 before core parameter resolution. Barcelona uses a more explicit Blaugrana palette (#A50044 / #004D98) with gold accents; Real Madrid uses pearl white / royal blue (#00529F) with restrained gold. Real Madrid crest scaling is increased through registry data rather than renderer special-casing, known Malaga labels are normalized to Japanese, and shared themed Medium layouts reserve visible bottom breathing room without duplicating match renderers. Runtime composition loads stable UI, competition logos, the frozen Manchester United baseline theme, shared multi-club theme registry v2, top-layout v2, LIVE context, and resilience v2. New clubs should normally be added through club registry plus shared theme tokens rather than cloned renderer files. The Manchester United visual baseline remains pinned and unchanged. Competition identity colors and logos remain shared across clubs. */