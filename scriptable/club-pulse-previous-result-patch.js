// Club Pulse Previous Result v1.
// Adds the latest completed match as persistent data and surfaces it in Medium only.
// Small remains unchanged. POST hides the compact previous-result summary because the
// main card is already showing that same completed match.

const CP_PR_BASE_MAP_DATA=mapData;
mapData=function(mj,sj){
  const d=CP_PR_BASE_MAP_DATA(mj,sj),rows=Array.isArray(mj?.matches)?mj.matches:[],
        finished=rows.filter(m=>m?.status==='FINISHED').sort((a,b)=>new Date(b.utcDate)-new Date(a.utcDate)),
        previous=finished.length?mapMatch(finished[0]):d?.recentResult||null;
  return{...d,previousResult:typeof cpUiuNormalizeMatch==='function'?cpUiuNormalizeMatch(previous):previous}
};

// Existing local caches predate previousResult. Backfill once from football-data when
// an old cache clearly has form history but no persisted previous match. The refreshed
// object is written to the normal cache; nothing is destructively deleted.
const CP_PR_BASE_LOAD_DATA=loadData;
loadData=async function(t){
  let d=await CP_PR_BASE_LOAD_DATA(t);
  if(!d)return d;
  if(d.previousResult)return d;
  if(d.recentResult)return{...d,previousResult:d.recentResult};
  const hasHistory=Array.isArray(d.form)&&d.form.some(v=>v&&v!=='-');
  if(!hasHistory)return{...d,previousResult:null};
  try{
    if(typeof cpDpFetchMatches!=='function')return{...d,previousResult:null};
    const matches=await cpDpFetchMatches(t),
          sj=typeof cpDpStandings==='function'?await cpDpStandings(t):{},
          safeMatches=typeof cpDpTemporalizeMatches==='function'?cpDpTemporalizeMatches(matches):matches,
          fresh=mapData(safeMatches,sj||{});
    if(!fresh?.previousResult)return{...d,previousResult:null};
    if(!sj&&d){fresh.rank=d.rank;fresh.points=d.points}
    writeJSON(cachePath(),fresh);
    return{...fresh,stale:false,dataPolicy:'network-previous-result'}
  }catch{
    return{...d,previousResult:null}
  }
};

function cpPrScore(m){
  if(!m||!Number.isFinite(m.ourScore)||!Number.isFinite(m.opponentScore))return'–';
  return`${m.ourScore}-${m.opponentScore}`
}

function cpPrOpponent(m){
  const raw=typeof cpUiuCanonicalName==='function'?cpUiuCanonicalName(m?.opponentName):String(m?.opponentName||'未定'),
        alias=typeof CP_SP_SMALL_ALIASES==='object'?CP_SP_SMALL_ALIASES?.[raw]:null;
  return alias&&/[^\x20-\x7E]/.test(alias)?alias:raw
}

const CP_PR_BASE_FOOTER_MEDIUM=buildFooterMedium;
buildFooterMedium=function(w,d){
  const m=d?.previousResult;
  if(!m||d?.mode==='POST')return CP_PR_BASE_FOOTER_MEDIUM(w,d);

  const q=CP_FORM_SYSTEM?.medium||{label:8.2,chip:9.2,v:2.8,h:7,gap:4,footerV:2,footerH:8,radius:9},
        t=typeof cpFormTheme==='function'?cpFormTheme():(typeof CP_ACTIVE_THEME==='function'?CP_ACTIVE_THEME():null),
        form=typeof cpFormValues==='function'?cpFormValues(d):[...(d?.form||[])],
        style=typeof cpFormResultStyle==='function'?cpFormResultStyle(m.result):{fg:'#ECECF0'},
        shell=typeof cpFormShellText==='function'?cpFormShellText():'#F8FAFC',
        accent=typeof cpFormAccent==='function'?cpFormAccent():(club?.a||'#9AA6B8'),
        f=w.addStack();

  f.layoutHorizontally();f.centerAlignContent();
  f.setPadding(q.footerV,q.footerH,q.footerV,q.footerH);
  f.cornerRadius=9;
  f.backgroundColor=C(t?.panelDeep||CP_COMMON_SHELL?.rail||'#080D17',.96);
  f.borderWidth=.55;
  f.borderColor=C(CP_COMMON_SHELL?.border||'#465164',.84);

  const prev=f.addStack();
  prev.layoutHorizontally();prev.centerAlignContent();prev.size=new Size(103,0);
  let lb=text(prev,'前節',7.0,true,.82,shell);lb.lineLimit=1;
  prev.addSpacer(4);
  let sc=heavy(prev,cpPrScore(m),8.2,style.fg||shell);sc.lineLimit=1;
  prev.addSpacer(3);
  let op=text(prev,cpPrOpponent(m),7.2,true,.9,shell);op.lineLimit=1;op.minimumScaleFactor=.55;

  f.addSpacer(5);
  const latest=text(f,'最新 →',q.label,true,1,shell);latest.lineLimit=1;latest.minimumScaleFactor=.92;
  f.addSpacer(5);
  const values=Array.isArray(form)?form.slice(0,5):[];
  while(values.length<5)values.push('-');
  for(let i=0;i<values.length;i++){
    if(typeof cpRenderCanonicalFormChip==='function')cpRenderCanonicalFormChip(f,values[i],i===0,'medium');
    else formChip(f,values[i],i===0,false);
    if(i<values.length-1)f.addSpacer(3)
  }
  f.addSpacer();
  return f
};
