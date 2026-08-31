// Club Pulse data policy v3.
// Adaptive refresh/cache policy for multi-club home-screen operation.
// Goals: keep LIVE/near-kickoff data responsive, reduce far-fixture provider traffic,
// share league standings snapshots, avoid API-Football negative-cache churn,
// reserve API-Football capacity for LIVE, and keep stale semantics consistent across sizes.

const CP_DP_BASE_LOAD_DATA=loadData,
      CP_DP_BASE_NEXT_OVERLAY=applyNextOverlay,
      CP_DP_BASE_REFRESH_DELAY=refreshDelay,
      CP_DP_BASE_BUILD_MATCH_SMALL=buildMatchSmall,
      CP_DP_BASE_STATUS_TITLE=statusTitle,
      CP_DP_BASE_CENTER_MAIN=centerMainText,
      CP_DP_BASE_META_LINE=metaLine;

const CP_DP_STANDINGS_TTL=30*60*1000;
const CP_DP_NEXT_OVERLAY_TTL=12*60*60*1000;
const CP_DP_NEXT_QUOTA_CEILING=40;

function cpDpForcedOutage(){
  return typeof cpResForcedOutage==='function'&&cpResForcedOutage()
}

function cpDpNormalize(d){
  if(!d)return d;
  return typeof cpCmNormalizeData==='function'?cpCmNormalizeData(d):d
}

function cpDpKickoffMs(d){
  const m=d?.mode==='LIVE'?d.liveMatch:d?.mode==='POST'?d.recentResult:d?.nextMatch;
  if(!m?.utcDate)return 0;
  const t=new Date(m.utcDate).getTime();
  return Number.isFinite(t)?t:0
}

function cpDpMatchTtl(d){
  if(d?.mode==='LIVE')return 3*60*1000;
  if(d?.mode==='POST')return 10*60*1000;
  const t=cpDpKickoffMs(d);
  if(!t)return 60*60*1000;
  const delta=t-Date.now();
  if(delta<=30*60*1000)return 3*60*1000;
  if(delta<=2*60*60*1000)return 5*60*1000;
  if(delta<=12*60*60*1000)return 15*60*1000;
  if(delta<=48*60*60*1000)return 30*60*1000;
  return 60*60*1000
}

function cpDpStandingsPath(){
  return path(`standings_${String(club.comp||'league').toLowerCase()}.json`)
}

function cpDpCachedStandings(){
  const c=readJSON(cpDpStandingsPath());
  return c?.payload||null
}

async function cpDpStandings(t){
  const p=cpDpStandingsPath(),c=readJSON(p),now=Date.now();
  if(c?.payload&&now-c.fetchedAt<CP_DP_STANDINGS_TTL)return c.payload;
  try{
    const payload=await api(`/competitions/${club.comp}/standings`,t);
    writeJSON(p,{fetchedAt:Date.now(),payload});
    return payload
  }catch{
    return c?.payload||null
  }
}

function cpDpApplyStanding(d,sj){
  if(!d||!sj)return d;
  const row=standing(sj);
  if(!row)return d;
  return{...d,rank:row.position??d.rank,points:row.points??d.points}
}

async function cpDpFetchMatches(t){
  const d=new Date(),from=ymd(addDays(d,-120)),to=ymd(addDays(d,120));
  return api(`/teams/${club.team}/matches?dateFrom=${from}&dateTo=${to}&limit=100`,t)
}

function cpDpSanitizeStale(d){
  if(!d?.stale)return d;
  // A cached LIVE score must not look live indefinitely after a provider outage.
  // Four hours after scheduled kickoff, degrade to a neutral update-waiting fixture.
  if(d.mode==='LIVE'&&d.liveMatch?.utcDate){
    const kickoff=new Date(d.liveMatch.utcDate).getTime();
    if(Number.isFinite(kickoff)&&Date.now()>=kickoff+4*60*60*1000){
      const m={...d.liveMatch,minute:null,ourScore:null,opponentScore:null};
      return{...d,mode:'NEXT',nextMatch:m,liveMatch:null,liveExpired:true}
    }
  }
  return d
}

loadData=async function(t){
  // Keep the tested forced-outage path owned by Resilience.
  if(cpDpForcedOutage())return cpDpSanitizeStale(await CP_DP_BASE_LOAD_DATA(t));

  let cached=cpDpNormalize(readJSON(cachePath()));
  const now=Date.now(),ttl=cpDpMatchTtl(cached);

  // Standings are league-shared and can update independently of a far-away fixture.
  const standingsPromise=cpDpStandings(t);
  if(cached&&Number.isFinite(cached.fetchedAt)&&now-cached.fetchedAt<ttl){
    const sj=await standingsPromise;
    return cpDpApplyStanding({...cached,stale:false,dataPolicy:'cache'},sj)
  }

  try{
    const [matches,sj]=await Promise.all([cpDpFetchMatches(t),standingsPromise]);
    let fresh=mapData(matches,sj||{});
    if(!sj&&cached)fresh={...fresh,rank:cached.rank,points:cached.points};
    writeJSON(cachePath(),fresh);
    return{...fresh,stale:false,dataPolicy:'network'}
  }catch(e){
    if(cached){
      const sj=cpDpCachedStandings();
      return cpDpSanitizeStale(cpDpApplyStanding({...cached,stale:true,dataPolicy:'stale'},sj))
    }
    throw e
  }
};

function cpDpQuotaCount(){
  try{
    const q=readJSON(quotaPath(),{day:'',count:0}),today=fmt(new Date(),'yyyy-MM-dd');
    return q?.day===today?Number(q.count||0):0
  }catch{return 0}
}

applyNextOverlay=async function(d){
  if(cpDpForcedOutage())return CP_DP_BASE_NEXT_OVERLAY(d);
  const c=readJSON(nextPath());
  // API-Football next-fixture discovery is supplemental. Reuse positive AND negative
  // results for 12 hours so an eleven-club setup needs at most ~22 routine checks/day.
  if(c&&Date.now()-c.fetchedAt<CP_DP_NEXT_OVERLAY_TTL&&Object.prototype.hasOwnProperty.call(c,'match')){
    return c.match?chooseNext(d,c.match):d
  }
  // Preserve the majority of the core 85-call daily guard for LIVE checks.
  if(cpDpQuotaCount()>=CP_DP_NEXT_QUOTA_CEILING)return{...d,nextProvider:d.nextProvider||'quota-conserve'};
  return CP_DP_BASE_NEXT_OVERLAY(d)
};

refreshDelay=function(d){
  if(d?.stale)return 5*60*1000;
  return cpDpMatchTtl(d)
};

function cpDpSmallWaiting(d){
  if(!d?.stale||d.mode!=='NEXT'||!d.nextMatch?.utcDate)return false;
  const t=new Date(d.nextMatch.utcDate).getTime();
  return Number.isFinite(t)&&Date.now()>=t
}

// Existing small renderers intentionally abbreviate NEXT to 「次戦」.
// When cached data has crossed kickoff, temporarily use a synthetic mode so they
// fall through to shared statusTitle while still selecting nextMatch.
buildMatchSmall=function(w,d,imgs){
  if(cpDpSmallWaiting(d))return CP_DP_BASE_BUILD_MATCH_SMALL(w,{...d,mode:'STALE_NEXT',cpSmallWaiting:true},imgs);
  return CP_DP_BASE_BUILD_MATCH_SMALL(w,d,imgs)
};

statusTitle=function(d,m){
  if(d?.cpSmallWaiting)return'更新待ち';
  return CP_DP_BASE_STATUS_TITLE(d,m)
};

centerMainText=function(d,m){
  if(d?.cpSmallWaiting)return'VS';
  return CP_DP_BASE_CENTER_MAIN(d,m)
};

metaLine=function(d,m){
  if(d?.cpSmallWaiting)return`${m.kickoff} ・ ${m.venue}`;
  return CP_DP_BASE_META_LINE(d,m)
};
