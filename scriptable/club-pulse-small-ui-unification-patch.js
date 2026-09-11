// Club Pulse Small UI Unification v1.
// Shared Small-widget behavior across every supported club.
// Keeps club identity in colors/crests, while standardizing labels, footer structure,
// provider-name normalization and fallback presentation behavior.

const CP_UIU_JP_SMALL_LABELS={
  'アストン・ヴィラ':'ヴィラ',
  'クリスタル・パレス':'パレス',
  'ノッティンガム・フォレスト':'フォレスト',
  'レアル・ソシエダ':'ソシエダ',
  'ボルシア・ドルトムント':'ドルトムント',
  'レヴァークーゼン':'レヴァークーゼン',
  'フランクフルト':'フランクフルト',
  'シュトゥットガルト':'シュトゥットガルト',
  'フィオレンティーナ':'フィオレンティーナ',
  'フェイエノールト':'フェイエノールト',
  'エルヴァースベルク':'エルヴァース'
};

function cpUiuCanonicalName(name){
  const n=String(name||'').trim();
  if(!n)return'未定';
  return typeof cpCanonicalTeamName==='function'?cpCanonicalTeamName(n):n
}

// API-Football fixtures previously passed through teamName() but not the later
// canonical display-name registry. Normalize from the provider's full team name
// before rendering, so codes such as SVE do not leak into Small widgets.
if(typeof mapApiFixture==='function'){
  const CP_UIU_BASE_MAP_API_FIXTURE=mapApiFixture;
  mapApiFixture=function(f,teamId,live=false){
    const out=CP_UIU_BASE_MAP_API_FIXTURE(f,teamId,live);
    if(!out)return out;
    const home=f?.teams?.home,away=f?.teams?.away,
          opp=home?.id===teamId?away:home,
          raw=String(opp?.name||out.opponentName||'').trim();
    out.opponentName=cpUiuCanonicalName(raw||out.opponentName);
    return out
  }
}

// The canonical Small renderer prefers readable Japanese labels. English rescue
// labels from older visual passes are intentionally bypassed here.
if(typeof cpSpTeamLabel==='function'){
  cpSpTeamLabel=function(name,fallback,isClub=false){
    const raw=isClub?(club?.jp||club?.short||''):cpUiuCanonicalName(name),
          n=CP_UIU_JP_SMALL_LABELS[raw]||raw,
          len=Array.from(String(n||'')).length;
    if(len<=CP_SP_FULL_NAME_LIMIT)return n;
    const alias=CP_SP_SMALL_ALIASES?.[n]||CP_SP_SMALL_ALIASES?.[raw];
    if(alias&&/[^\x20-\x7E]/.test(alias))return alias;
    if(len<=CP_SP_SOFT_NAME_LIMIT)return n;
    const fb=String(fallback||'').trim();
    if(/^[A-Z0-9.-]{2,5}$/i.test(fb))return fb;
    return n
  }
}

function cpUiuFormRow(w,d,family='medium'){
  const q=CP_FORM_SYSTEM?.[family]||CP_FORM_SYSTEM?.medium,
        t=typeof cpFormTheme==='function'?cpFormTheme():(typeof CP_ACTIVE_THEME==='function'?CP_ACTIVE_THEME():null),
        form=typeof cpFormValues==='function'?cpFormValues(d):[...(d?.form||[])],
        f=w.addStack();
  f.layoutHorizontally();f.centerAlignContent();
  if(family==='medium'){
    f.setPadding(q.footerV,q.footerH,q.footerV,q.footerH);
    f.cornerRadius=9;
    f.backgroundColor=C(t?.panelDeep||CP_COMMON_SHELL?.rail||'#080D17',.96);
    f.borderWidth=.55;
    f.borderColor=C(CP_COMMON_SHELL?.border||'#465164',.84)
  }else{
    f.setPadding(q.footerV,q.footerH,q.footerV,q.footerH);
    f.addSpacer()
  }

  // One token prevents the arrow from being independently compressed/omitted.
  const latest=text(f,'最新 →',q.label,true,1,typeof cpFormShellText==='function'?cpFormShellText():'#F8FAFC');
  latest.lineLimit=1;latest.minimumScaleFactor=.92;
  f.addSpacer(family==='medium'?7:5);
  const values=Array.isArray(form)?form.slice(0,5):[];
  while(values.length<5)values.push('-');
  for(let i=0;i<values.length;i++){
    if(typeof cpRenderCanonicalFormChip==='function')cpRenderCanonicalFormChip(f,values[i],i===0,family);
    else formChip(f,values[i],i===0,family==='small');
    if(i<values.length-1)f.addSpacer(q.gap)
  }
  f.addSpacer();
  return f
}

if(typeof buildFooterMedium==='function')buildFooterMedium=function(w,d){return cpUiuFormRow(w,d,'medium')};
if(typeof buildFooterSmall==='function')buildFooterSmall=function(w,d){return cpUiuFormRow(w,d,'small')};
