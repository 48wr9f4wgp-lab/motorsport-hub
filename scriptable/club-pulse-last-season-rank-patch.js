// Club Pulse Previous Season Rank v1.
// Medium-only context: show current rank plus last season's league position.
// Historical standings are shared per competition/season and cached for 30 days.
// Small remains unchanged. If historical standings are unavailable, the existing header is preserved.

const CP_LSR_SUPPORTED=new Set(['PL','PD','BL1','SA','FL1','DED']);
const CP_LSR_TTL=30*24*60*60*1000;
const CP_LSR_ERROR_TTL=24*60*60*1000;

function cpLsrPreviousSeasonYear(now=new Date()){
  const currentStart=now.getMonth()>=6?now.getFullYear():now.getFullYear()-1;
  return currentStart-1
}

function cpLsrCachePath(season){
  return path(`last_season_standings_${String(club?.comp||'league').toLowerCase()}_${season}.json`)
}

async function cpLsrStandings(token){
  if(!CP_LSR_SUPPORTED.has(String(club?.comp||'')))return null;
  const season=cpLsrPreviousSeasonYear(),p=cpLsrCachePath(season),c=readJSON(p),now=Date.now();
  if(c?.payload&&now-Number(c.fetchedAt||0)<CP_LSR_TTL)return{season,payload:c.payload};
  if(!c?.payload&&c?.error&&now-Number(c.fetchedAt||0)<CP_LSR_ERROR_TTL)return null;
  try{
    const payload=await api(`/competitions/${club.comp}/standings?season=${season}`,token);
    if(!payload?.standings)throw new Error('Previous-season standings unavailable');
    writeJSON(p,{fetchedAt:Date.now(),season,payload});
    return{season,payload}
  }catch{
    if(c?.payload)return{season:c.season||season,payload:c.payload};
    writeJSON(p,{fetchedAt:Date.now(),season,error:true,payload:null});
    return null
  }
}

const CP_LSR_BASE_LOAD_DATA=loadData;
loadData=async function(token){
  const d=await CP_LSR_BASE_LOAD_DATA(token);
  if(!d)return d;
  const history=await cpLsrStandings(token);
  if(!history?.payload)return d;
  const row=standing(history.payload);
  return{
    ...d,
    lastSeasonYear:history.season,
    lastSeasonRank:row?.position??null,
    lastSeasonStatus:row?'ranked':'promoted'
  }
};

function cpLsrLabel(d){
  if(Number.isFinite(d?.lastSeasonRank))return`昨季 ${d.lastSeasonRank}位`;
  if(d?.lastSeasonStatus==='promoted')return'昨季 昇格';
  return null
}

const CP_LSR_BASE_HEADER_MEDIUM=buildHeaderMedium;
buildHeaderMedium=function(w,d,img){
  const last=cpLsrLabel(d);
  if(!last)return CP_LSR_BASE_HEADER_MEDIUM(w,d,img);

  const t=typeof CP_ACTIVE_THEME==='function'?CP_ACTIVE_THEME():null,
        isMu=typeof CP_MU_IS==='function'&&CP_MU_IS(),
        fg=isMu&&typeof CP_MU_THEME==='object'?CP_MU_THEME.ivory:(CP_COMMON_SHELL?.text||'#F8FAFC'),
        muted=isMu?'#C8C5BE':(CP_COMMON_SHELL?.muted||'#AEB5C2'),
        accent=isMu&&typeof CP_MU_THEME==='object'?CP_MU_THEME.goldSoft:(t?.headerAccent||t?.accentSoft||club?.a||muted),
        h=w.addStack();

  h.layoutHorizontally();
  h.centerAlignContent();
  h.setPadding(0,3,0,3);
  badge(h,club.badge,img,20,club.p,club.s,CREST_SCALE[club.team]||.91);
  h.addSpacer(7);

  const l=h.addStack();l.layoutVertically();
  let name=heavy(l,club.name,10.5,fg);name.lineLimit=1;name.minimumScaleFactor=.72;
  let stamp=text(l,`${updated(d.fetchedAt)}${d.stale?' · 保存データ':''}`,6.6,false,.76,muted);stamp.lineLimit=1;stamp.minimumScaleFactor=.82;

  h.addSpacer();
  const r=h.addStack();r.layoutVertically();r.centerAlignContent();
  let rk=heavy(r,d.rank!=null?`${d.rank}位`:'–',12.5,fg);rk.lineLimit=1;rk.minimumScaleFactor=.88;rk.rightAlignText();
  let ls=semibold(r,last,7.2,.92,accent);ls.lineLimit=1;ls.minimumScaleFactor=.84;ls.rightAlignText();
  return h
};
