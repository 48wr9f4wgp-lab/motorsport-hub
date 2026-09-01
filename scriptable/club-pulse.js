const CORE='https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/30a2b7f1b5c58d4ffa7e91047b637692c3cac7ce/scriptable/club-pulse-core.js';
const CLUB_REGISTRY_PATCH='https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/09d01021ce8c800f3032925f44621d28f877b070/scriptable/club-pulse-club-registry-patch.js';
const EXTRA_CLUBS_PATCH='https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/1b734c803dc4ccc39c978decc3f2a4c733ab7605/scriptable/club-pulse-extra-clubs-patch.js';
const WAVE2_CLUBS_PATCH='https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/c53a62e6308fb99d6605d9b6c8d960869140dd46/scriptable/club-pulse-wave2-clubs-patch.js';
const WAVE3_CLUBS_PATCH='https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/b6b1e42237d899fc3084ced49a1974185c5b43e3/scriptable/club-pulse-wave3-netherlands-clubs-patch.js';
const WAVE4_LENS_CLUB_PATCH='https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/28a95c8d790e4a15a9204ff45694d5dde361600e/scriptable/club-pulse-wave4-lens-club-patch.js';
const PATCH='https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/839434e9b6e414f1382fa2b5b9ead69d3112b965/scriptable/club-pulse-ui-patch.js';
const COMP_PATCH='https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/288a223e94e49face49f4061641460ec5848dc93/scriptable/club-pulse-competition-logo-patch.js';
const LEAGUE_EXPANSION_PATCH='https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/33a963823dfc5b2f23a09ef2e325b42b66812011/scriptable/club-pulse-league-expansion-patch.js';
const THEME_PATCH='https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/1c21111ca7e5917e1d953fb6ca79e0b49d2817ac/scriptable/club-pulse-manutd-theme-patch.js';
const THEME_REGISTRY_PATCH='https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/d3260884886fa38413313a5b243e5068/scriptable/club-pulse-theme-registry-patch.js';
const EXTRA_THEME_PATCH='https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/e0a41fbd5e199be58d6d68d3b95edf22f6b0d29f/scriptable/club-pulse-extra-theme-patch.js';
const TOP_LAYOUT_PATCH='https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/5f2643708f6d5e51a1b9a2d32dfd58312d7f0a1c/scriptable/club-pulse-top-layout-patch.js';
const IDENTITY_PATCH='https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/f5c08da2513bbf43cf827bae1605d1c62123442c/scriptable/club-pulse-identity-color-patch.js';
const DESIGN_SYSTEM_PATCH='https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/3cfc3e4ea100fdc95686614c42561036052222ae/scriptable/club-pulse-design-system-patch.js';
const PREMIUM_PATCH='https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/5f465f4d34d79d03614ddba306c15d18f1049f0b/scriptable/club-pulse-premium-visual-patch.js';
const READABILITY_PATCH='https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/9b6e1f82ad2d07d67628cd501723d5eba095908f/scriptable/club-pulse-readability-guard-patch.js';
const CACHE_MIGRATION_PATCH='https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/986e4aa662f695d84b1174bf79917cb8e31a10f7/scriptable/club-pulse-cache-migration-patch.js';
const FINAL_POLISH_PATCH='https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/71334b75cb6c60bc8e48e39a4dd1ce87d93ed590/scriptable/club-pulse-final-polish-patch.js';
const LIVE_CONTEXT_PATCH='https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/d1f571e9658e99d69a64dbbe591655a048461654/scriptable/club-pulse-live-context-patch.js';
const RESILIENCE_PATCH='https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/968fd0308afd6ea0998d8317357d86af9d8aa0c3/scriptable/club-pulse-resilience-patch.js';
const DATA_POLICY_PATCH='https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/fa0b30efd1407e4221175b25da282b904c713b71/scriptable/club-pulse-data-policy-patch.js';
const SMALL_PRESENTATION_PATCH='https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/3d06d2cdcc63b34dd818ce79b853ad3d10b5b987/scriptable/club-pulse-small-presentation-patch.js';
const WAVE2_THEMES_PATCH='https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/5e6abb10e817d5dbebd0f2b95d9e8106da8ff401/scriptable/club-pulse-wave2-themes-patch.js';
const WAVE3_NL_PATCH='https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/a38b811efeb76811d3d12df9fe35db43c1c527f5/scriptable/club-pulse-wave3-netherlands-patch.js';
const WAVE4_LENS_PATCH='https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/6380251307413da618226363e5f22800df9301dc/scriptable/club-pulse-wave4-lens-patch.js';

const F=FileManager.local(),D=F.documentsDirectory();
const CP=F.joinPath(D,'ClubPulseCore_v2.js'),CRP=F.joinPath(D,'ClubPulseClubRegistryPatch_v2.js'),ECP=F.joinPath(D,'ClubPulseExtraClubsPatch_v3.js'),W2CP=F.joinPath(D,'ClubPulseWave2ClubsPatch_v1.js'),W3CP=F.joinPath(D,'ClubPulseWave3NetherlandsClubsPatch_v1.js'),W4CP=F.joinPath(D,'ClubPulseWave4LensClubPatch_v1.js'),PP=F.joinPath(D,'ClubPulseUIPatch_v8.js'),LP=F.joinPath(D,'ClubPulseCompetitionLogoPatch_v3.js'),LEP=F.joinPath(D,'ClubPulseLeagueExpansionPatch_v1.js'),TP=F.joinPath(D,'ClubPulseManUThemePatch_v4.js'),TRP=F.joinPath(D,'ClubPulseThemeRegistryPatch_v13.js'),ETP=F.joinPath(D,'ClubPulseExtraThemePatch_v2.js'),TLP=F.joinPath(D,'ClubPulseTopLayoutPatch_v2.js'),IP=F.joinPath(D,'ClubPulseIdentityColorPatch_v7.js'),DSP=F.joinPath(D,'ClubPulseDesignSystemPatch_v7.js'),PVP=F.joinPath(D,'ClubPulsePremiumVisualPatch_v4.js'),RGP=F.joinPath(D,'ClubPulseReadabilityGuardPatch_v8.js'),CMP=F.joinPath(D,'ClubPulseCacheMigrationPatch_v1.js'),FPP=F.joinPath(D,'ClubPulseFinalPolishPatch_v3.js'),LCP=F.joinPath(D,'ClubPulseLiveContextPatch_v1.js'),RP=F.joinPath(D,'ClubPulseResiliencePatch_v6.js'),DPP=F.joinPath(D,'ClubPulseDataPolicyPatch_v8.js'),SPP=F.joinPath(D,'ClubPulseSmallPresentationPatch_v10.js'),W2TP=F.joinPath(D,'ClubPulseWave2ThemesPatch_v5.js'),W3NP=F.joinPath(D,'ClubPulseWave3NetherlandsPatch_v1.js'),W4LP=F.joinPath(D,'ClubPulseWave4LensPatch_v1.js'),QAP=F.joinPath(D,'ClubPulseQAOverride_v1.json');

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

async function core(){
  if(!F.fileExists(CP)){
    let r=new Request(CORE+'?v=core2');r.timeoutInterval=10;
    let s=await r.loadString();if(!s||s.length<1000)throw new Error('Invalid core');F.writeString(CP,s)
  }
  return F.readString(CP)
}
async function getRemote(url,file,min,tag){
  if(F.fileExists(file)){let s=F.readString(file);if(s&&s.length>=min)return s}
  try{
    let r=new Request(url+'?v='+tag);r.timeoutInterval=10;
    let s=await r.loadString();if(!s||s.length<min)throw new Error('Invalid patch');F.writeString(file,s);return s
  }catch(e){if(F.fileExists(file))return F.readString(file);throw e}
}

let c=await core(),
  cr=await getRemote(CLUB_REGISTRY_PATCH,CRP,300,'clubs2'),
  ec=await getRemote(EXTRA_CLUBS_PATCH,ECP,900,'extra-clubs3'),
  w2c=await getRemote(WAVE2_CLUBS_PATCH,W2CP,2000,'wave2-clubs1'),
  w3c=await getRemote(WAVE3_CLUBS_PATCH,W3CP,800,'wave3-nl-clubs1'),
  w4c=await getRemote(WAVE4_LENS_CLUB_PATCH,W4CP,350,'wave4-lens-club1'),
  x=await getRemote(PATCH,PP,300,'ui8'),y=await getRemote(COMP_PATCH,LP,300,'comp3'),le=await getRemote(LEAGUE_EXPANSION_PATCH,LEP,300,'leagues1'),
  z=await getRemote(THEME_PATCH,TP,300,'mutheme4'),tr=await getRemote(THEME_REGISTRY_PATCH,TRP,300,'themes13'),et=await getRemote(EXTRA_THEME_PATCH,ETP,300,'extra-themes2'),
  u=await getRemote(TOP_LAYOUT_PATCH,TLP,300,'toplayout2'),i=await getRemote(IDENTITY_PATCH,IP,300,'identity7'),ds=await getRemote(DESIGN_SYSTEM_PATCH,DSP,1200,'design-system7'),
  pv=await getRemote(PREMIUM_PATCH,PVP,900,'premium4'),rg=await getRemote(READABILITY_PATCH,RGP,2200,'readability8'),cm=await getRemote(CACHE_MIGRATION_PATCH,CMP,700,'cache-migration1'),
  fp=await getRemote(FINAL_POLISH_PATCH,FPP,250,'final-polish3'),q=await getRemote(LIVE_CONTEXT_PATCH,LCP,250,'livectx1'),r=await getRemote(RESILIENCE_PATCH,RP,600,'resilience6'),
  dp=await getRemote(DATA_POLICY_PATCH,DPP,3200,'data-policy8'),sp=await getRemote(SMALL_PRESENTATION_PATCH,SPP,2600,'small-presentation10'),
  w2t=await getRemote(WAVE2_THEMES_PATCH,W2TP,1800,'wave2-themes5'),
  w3n=await getRemote(WAVE3_NL_PATCH,W3NP,2500,'wave3-netherlands1'),
  w4l=await getRemote(WAVE4_LENS_PATCH,W4LP,1200,'wave4-lens1');

const PM='const param=String(args.widgetParameter',pk=c.indexOf(PM);
if(pk<0)throw new Error('Club registry injection marker missing');
c=c.slice(0,pk)+cr+'\n'+ec+'\n'+w2c+'\n'+w3c+'\n'+w4c+'\n'+c.slice(pk);
const M='if(config.runsInApp&&!getLiveToken())await setupLiveToken();',k=c.indexOf(M),patches=x+'\n'+y+'\n'+le+'\n'+z+'\n'+tr+'\n'+et+'\n'+u+'\n'+i+'\n'+ds+'\n'+pv+'\n'+rg+'\n'+cm+'\n'+fp+'\n'+q+'\n'+r+'\n'+dp+'\n'+sp+'\n'+w2t+'\n'+w3n+'\n'+w4l,b=k>=0?c.slice(0,k)+'\n'+patches+'\n'+c.slice(k):c+'\n'+patches;
await new Function('args','return (async()=>{\n'+b+'\n})()')({widgetParameter:p});

/* Club Pulse 44-club runtime. Existing forty-three visuals stay frozen. Wave 4 adds RC Lens through registry/theme/localization/venue data only, with no club-specific renderer branches. Core and every patch are immutable commit-pinned and version-cached local-first. Data Policy v8 rejects impossible future FINISHED states and suppresses legacy simulated live/post/cup modes on Home Screen widgets, while preserving in-app developer simulation and resilience QA. Small Presentation v10 preserves full Japanese team names up to nine characters while retaining scored-state and NEXT VS width protections. Wave 2 Theme v5 no longer reintroduces code-style Small abbreviations after the canonical Small renderer. Premium Visual v4 makes generic Medium team labels honor the same cardText token.
Frozen base registry compatibility marker: c=c.slice(0,pk)+cr+'\n'+ec+'\n'+c.slice(pk)
Frozen eleven-family marker: arsenal, liverpool, inter, and dortmund
*/
