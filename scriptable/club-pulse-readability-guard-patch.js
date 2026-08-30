// Club Pulse readability guard v3.
// Seven-club presentation contract: stable Japanese display names, shared pill dimensions,
// visible competition identity, and selective low-contrast crest rescue without global decoration.

const CP_STANDARD_TEAM_IDS=new Set([66,81,86,5,524,98,65]);
const CP_LOW_CONTRAST_CRESTS=new Set(['JUV']);
const CP_RG_BASE_BADGE=badge;
const CP_RG_BASE_RENDER_TEAM=renderTeamBlock;
const CP_RG_BASE_SMALL_TEAM_NAME=smallTeamName;
const CP_RG_BASE_REAL_TEAM=typeof cpRealTeamBlock==='function'?cpRealTeamBlock:null;
const CP_RG_BASE_BARCA_TEAM=typeof cpBarcelonaTeamBlock==='function'?cpBarcelonaTeamBlock:null;

function cpRgActive(){return CP_STANDARD_TEAM_IDS.has(club?.team)}

const CP_TEAM_DISPLAY_NAMES={
  // Premier League / England
  'Manchester United FC':'マンU','Manchester United':'マンU','マンチェスター・ユナイテッド':'マンU',
  'Manchester City FC':'マンC','Manchester City':'マンC','マンチェスター・シティ':'マンC',
  'Coventry City FC':'コヴェントリー','Coventry City':'コヴェントリー','コヴェントリー':'コヴェントリー',
  'Ipswich Town FC':'イプスウィッチ','Ipswich Town':'イプスウィッチ','イプスウィッチ':'イプスウィッチ',
  'Nottingham Forest FC':'フォレスト','Nottingham Forest':'フォレスト','ノッティンガム・フォレスト':'フォレスト',
  'Newcastle United FC':'ニューカッスル','Newcastle United':'ニューカッスル','ニューカッスル':'ニューカッスル',
  // Spain
  'Rayo Vallecano de Madrid':'ラージョ','Rayo Vallecano':'ラージョ','ラージョ・バジェカーノ':'ラージョ',
  'Club Atlético de Madrid':'アトレティコ','Atletico Madrid':'アトレティコ','アトレティコ・マドリード':'アトレティコ',
  'Real Sociedad de Fútbol':'ソシエダ','Real Sociedad':'ソシエダ','レアル・ソシエダ':'ソシエダ',
  'Athletic Club':'アスレティック','アスレティック・クラブ':'アスレティック',
  'Málaga CF':'マラガ','Málaga':'マラガ','マラガ':'マラガ',
  // France
  'Paris Saint-Germain FC':'PSG','Paris Saint-Germain':'PSG','Paris SG':'PSG','パリ・サンジェルマン':'PSG',
  'AS Monaco FC':'モナコ','AS Monaco':'モナコ','Monaco':'モナコ','モナコ':'モナコ',
  // Germany
  'FC Bayern München':'バイエルン','Bayern München':'バイエルン','Bayern Munich':'バイエルン','バイエルン・ミュンヘン':'バイエルン',
  'FC Schalke 04':'シャルケ','Schalke 04':'シャルケ','Schalke':'シャルケ','シャルケ':'シャルケ',
  // Italy
  'AC Milan':'ミラン','Milan':'ミラン','ACミラン':'ミラン',
  'Juventus FC':'ユベントス','Juventus':'ユベントス','ユベントス':'ユベントス'
};

function cpDisplayTeamName(name,small=false){
  let n=String(name||'').trim();
  if(!n)return'未定';
  n=CP_TEAM_DISPLAY_NAMES[n]||n;
  const max=small?7:10;
  return n.length>max?n.slice(0,max-1)+'…':n
}

// Selective crest rescue: a faint neutral halo only for genuinely dark marks.
// No opaque white/gray tile and no global circular plate.
badge=function(p,fallback,img,size=28,p1=club.p,p2=club.s,scale=1){
  if(!cpRgActive()||!img||!CP_LOW_CONTRAST_CRESTS.has(String(fallback||'').toUpperCase())){
    return CP_RG_BASE_BADGE(p,fallback,img,size,p1,p2,scale)
  }
  let o=p.addStack();
  o.size=new Size(size+2,size+2);
  o.cornerRadius=Math.max(8,Math.round(size*.20));
  o.backgroundColor=C('#F3F5F8',.10);
  o.borderWidth=.4;
  o.borderColor=C('#FFFFFF',.10);
  o.centerAlignContent();
  let i=o.addStack();
  i.size=new Size(size,size);
  i.cornerRadius=Math.max(7,Math.round(size*.18));
  i.backgroundColor=C('#F6F7F9',.08);
  i.centerAlignContent();
  let im=i.addImage(img),z=Math.round((size-2)*Math.min(scale||1,1));
  im.imageSize=new Size(z,z);
  im.centerAlignImage();
  return o
};

function cpNormalizeOpponentOpt(opt,small=false){
  if(!opt||opt.fallback===club.badge)return opt;
  return {...opt,name:cpDisplayTeamName(opt.name,small)}
}

renderTeamBlock=function(parent,opt){
  if(!cpRgActive())return CP_RG_BASE_RENDER_TEAM(parent,opt);
  return CP_RG_BASE_RENDER_TEAM(parent,cpNormalizeOpponentOpt(opt,false))
};

smallTeamName=function(name,isClub=false){
  if(!cpRgActive())return CP_RG_BASE_SMALL_TEAM_NAME(name,isClub);
  if(isClub)return club.jp||club.short||'';
  return cpDisplayTeamName(name,true)
};

// Real Madrid and Barcelona use dedicated team renderers; normalize their opponent labels too.
if(CP_RG_BASE_REAL_TEAM){
  cpRealTeamBlock=function(parent,opt,small=false){
    return CP_RG_BASE_REAL_TEAM(parent,cpNormalizeOpponentOpt(opt,small),small)
  }
}
if(CP_RG_BASE_BARCA_TEAM){
  cpBarcelonaTeamBlock=function(parent,opt,small=false){
    return CP_RG_BASE_BARCA_TEAM(parent,cpNormalizeOpponentOpt(opt,small),small)
  }
}

// Shared pill geometry for all seven clubs. Competition pills keep the league crest as a first-class cue.
const CP_PILL_METRICS={
  medium:{v:2.5,h:7,font:7.2,r:9,logoBox:24,logoSize:19,gap:5,sideV:6.2},
  small:{v:2.0,h:5,font:7.3,r:9,logoBox:19,logoSize:15,gap:4,sideV:4.8}
};

function cpUnifiedCompetitionPill(parent,m,small=false,barca=false){
  let label=competitionReadable(m,small),z=competitionStyle(label),q=small?CP_PILL_METRICS.small:CP_PILL_METRICS.medium,p=parent.addStack();
  p.layoutHorizontally();p.centerAlignContent();p.setPadding(q.v,q.h,q.v,q.h);p.cornerRadius=q.r;
  p.backgroundColor=C(barca?'#171923':z.bg,barca?.98:.94);p.borderWidth=.8;p.borderColor=C(barca?'#D9DCE5':z.bd,barca?.54:.82);
  let logo=typeof cpCompetitionLogoImage==='function'?cpCompetitionLogoImage(m):null;
  if(logo){
    let plate=p.addStack();plate.size=new Size(q.logoBox,q.logoBox);plate.cornerRadius=q.logoBox/2;plate.backgroundColor=C('#FFFFFF',1);plate.borderWidth=1;plate.borderColor=C('#FFFFFF',1);plate.centerAlignContent();
    let im=plate.addImage(logo);im.imageSize=new Size(q.logoSize,q.logoSize);im.centerAlignImage();
    p.addSpacer(q.gap)
  }
  text(p,label,q.font,true,1,barca?'#FFFFFF':z.fg)
}

competitionPill=function(parent,m,small=false){
  return cpUnifiedCompetitionPill(parent,m,small,false)
};

sidePill=function(parent,m,small=false){
  let q=small?CP_PILL_METRICS.small:CP_PILL_METRICS.medium,p=parent.addStack(),label=sideTag(m);
  p.setPadding(q.sideV,q.h,q.sideV,q.h);p.cornerRadius=q.r;p.backgroundColor=C('#121318',.94);p.borderWidth=.8;p.borderColor=C(club.a,.62);
  text(p,label,q.font,true,1,'#F6F7F9')
};

// Barcelona keeps its purple/gold identity, but uses the same geometry and league crest treatment.
if(typeof cpBarcelonaCompetitionPill==='function'){
  cpBarcelonaCompetitionPill=function(parent,m,small=false){
    return cpUnifiedCompetitionPill(parent,m,small,true)
  }
}
if(typeof cpBarcelonaSidePill==='function'){
  cpBarcelonaSidePill=function(parent,m,small=false){
    let q=small?CP_PILL_METRICS.small:CP_PILL_METRICS.medium,p=parent.addStack(),label=sideTag(m);
    p.setPadding(q.sideV,q.h,q.sideV,q.h);p.cornerRadius=q.r;p.backgroundColor=C('#11131B',.98);p.borderWidth=.8;p.borderColor=C('#E1BD61',.76);
    text(p,label,q.font,true,1,'#FFFFFF')
  }
}
