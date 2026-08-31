// Club Pulse premium visual pass v4.
// Rendering consumes the canonical design-system tokens instead of club-specific magic numbers.
// v4 keeps generic Medium team labels on the active theme's cardText token, including light themes.

const CP_PREMIUM_BASE_CARD_BG=cardBg,
      CP_PREMIUM_BASE_MATCH_MEDIUM=buildMatchMedium,
      CP_PREMIUM_BASE_MATCH_SMALL=buildMatchSmall;
const CP_PREMIUM_GENERIC_KEYS=new Set(
  Object.values(CP_THEME_DEFINITIONS||{}).map(x=>x.key).filter(k=>!['realmadrid','barcelona','manutd'].includes(k))
);

function cpPremiumRealGradient(t,mode){
  let g=new LinearGradient();
  g.startPoint=new Point(0,0);
  g.endPoint=new Point(1,1);
  g.colors=[C(t.cardSurface),C(t.cardPanel),C('#FFFFFF'),C(t.cardPearl||'#E9E3D6')];
  g.locations=[0,.40,.76,1];
  return g
}

cardBg=function(mode){
  let t=typeof CP_ACTIVE_THEME==='function'?CP_ACTIVE_THEME():null;
  if(t?.key==='realmadrid')return cpPremiumRealGradient(t,mode);
  return CP_PREMIUM_BASE_CARD_BG(mode)
};

function cpPremiumCardMetrics(small=false){
  let c=CP_DESIGN_TOKENS?.card||{};
  return small
    ?{radius:c.radiusSmall??14,border:c.borderSmall??.75,alpha:c.borderAlphaSmall??.66}
    :{radius:c.radiusMedium??16,border:c.borderMedium??.85,alpha:c.borderAlphaMedium??.72}
}
function cpPremiumTextColor(t){return t.cardText||t.text||'#F8FAFC'}

function cpPremiumTeamBlock(parent,opt,fg){
  let s=parent.addStack();
  if(opt.width)s.size=new Size(opt.width,0);
  s.layoutVertically();
  let logo=s.addStack();logo.layoutHorizontally();logo.addSpacer();
  badge(logo,opt.fallback,opt.img,opt.logoSize,opt.p1,opt.p2,opt.scale||1);
  logo.addSpacer();
  s.addSpacer(opt.nameGap??2);
  let name=s.addStack();name.layoutHorizontally();name.addSpacer();
  let nm=heavy(name,opt.name,opt.nameSize||12,fg);nm.centerAlignText();
  name.addSpacer();
  if(opt.sub){
    let sub=s.addStack();sub.layoutHorizontally();sub.addSpacer();
    let sb=text(sub,opt.sub,opt.subSize||7,false,.56,fg);sb.centerAlignText();sub.addSpacer()
  }
  return s
}

function cpPremiumExtraMatchMedium(w,d,imgs,t){
  let q=cpPremiumCardMetrics(false),fg=cpPremiumTextColor(t),m=d.mode==='LIVE'?d.liveMatch:d.mode==='POST'?d.recentResult:d.nextMatch,c=w.addStack();
  c.layoutVertically();c.setPadding(4,9,4,9);c.cornerRadius=q.radius;c.backgroundGradient=cardBg(d.mode);
  c.borderWidth=q.border;c.borderColor=C(t.cardBorder||t.border||CP_COMMON_SHELL.edge,q.alpha);
  if(!m){heavy(c,'試合データ未取得',11,fg);return}
  let top=c.addStack();top.layoutHorizontally();top.centerAlignContent();
  text(top,statusTitle(d,m),8,true,1,fg);
  top.addSpacer(6);competitionPill(top,m);
  if(d.mode==='POST'){top.addSpacer(5);resultPill(top,m)}
  top.addSpacer();
  if(d.mode==='LIVE')heavy(top,m.minute||'LIVE',10,fg);
  else if(d.mode==='POST'){let ft=heavy(top,'FT',10,t.muted||'#E4E4E8');ft.rightAlignText()}
  else sidePill(top,m);
  c.addSpacer(2);
  let outer=c.addStack();outer.layoutHorizontally();outer.centerAlignContent();outer.addSpacer();
  let row=outer.addStack();row.layoutHorizontally();row.centerAlignContent();
  cpPremiumTeamBlock(row,{img:imgs.club,name:club.jp,sub:'',fallback:club.badge,logoSize:56,nameSize:12,subSize:0,p1:club.p,p2:club.s,scale:CREST_SCALE[club.team]||.91,nameGap:1,width:94},fg);
  row.addSpacer(d.mode==='POST'?16:20);
  let mid=heavy(row,centerMainText(d,m),d.mode==='POST'?27:d.mode==='NEXT'?14:22,fg);mid.centerAlignText();
  row.addSpacer(d.mode==='POST'?16:20);
  cpPremiumTeamBlock(row,{img:imgs.opp,name:m.opponentName,sub:'',fallback:m.opponentShort,logoSize:56,nameSize:12,subSize:0,p1:'#4A5568',p2:'#20242D',scale:CREST_SCALE[m.opponentId]||CREST_SCALE.opponent_default||.90,nameGap:1,width:94},fg);
  outer.addSpacer();c.addSpacer(2);
  let meta=c.addStack();meta.layoutHorizontally();meta.addSpacer();cpMetaText(meta,metaLine(d,m),fg,false);meta.addSpacer()
}

function cpPremiumExtraMatchSmall(w,d,imgs,t){
  let q=cpPremiumCardMetrics(true),fg=cpPremiumTextColor(t),m=d.mode==='LIVE'?d.liveMatch:d.mode==='POST'?d.recentResult:d.nextMatch,c=w.addStack();
  c.layoutVertically();c.setPadding(6,6,6,6);c.cornerRadius=q.radius;c.backgroundGradient=cardBg(d.mode);
  c.borderWidth=q.border;c.borderColor=C(t.cardBorder||t.border||CP_COMMON_SHELL.edge,q.alpha);
  if(!m){heavy(c,'試合データ未取得',10,fg);return}
  let top=c.addStack();top.layoutHorizontally();top.centerAlignContent();
  text(top,d.mode==='NEXT'?'次戦':statusTitle(d,m),8.2,true,1,fg);
  top.addSpacer(5);competitionPill(top,m,true);top.addSpacer();
  if(d.mode==='LIVE')heavy(top,m.minute||'LIVE',9.5,fg);
  else if(d.mode==='POST'){resultPill(top,m,true);top.addSpacer(4);heavy(top,'FT',8.2,t.muted||'#E4E4E8')}
  else sidePill(top,m,true);
  c.addSpacer(5);
  let outer=c.addStack();outer.layoutHorizontally();outer.centerAlignContent();outer.addSpacer();
  let row=outer.addStack();row.layoutHorizontally();row.centerAlignContent();
  renderTeamBlock(row,{img:imgs.club,name:smallTeamName(club.jp,true),fallback:club.badge,logoSize:40,nameSize:9.2,p1:club.p,p2:club.s,scale:CREST_SCALE[club.team]||.91,nameGap:2,width:48});
  row.addSpacer(4);
  let scoreBox=row.addStack();scoreBox.size=new Size(32,22);scoreBox.layoutHorizontally();scoreBox.centerAlignContent();scoreBox.addSpacer();
  let sc=heavy(scoreBox,centerMainText(d,m),d.mode==='POST'?16:d.mode==='NEXT'?13.5:15,fg);sc.centerAlignText();scoreBox.addSpacer();
  row.addSpacer(4);
  renderTeamBlock(row,{img:imgs.opp,name:smallTeamName(m.opponentName),fallback:m.opponentShort,logoSize:40,nameSize:9.2,p1:'#4A5568',p2:'#20242D',scale:CREST_SCALE[m.opponentId]||CREST_SCALE.opponent_default||.90,nameGap:2,width:48});
  outer.addSpacer();c.addSpacer(4);
  let meta=c.addStack();meta.layoutHorizontally();meta.addSpacer();cpMetaText(meta,m.kickoff,fg,true);meta.addSpacer()
}

buildMatchMedium=function(w,d,imgs){
  let t=typeof CP_ACTIVE_THEME==='function'?CP_ACTIVE_THEME():null;
  if(t&&CP_PREMIUM_GENERIC_KEYS.has(t.key))return cpPremiumExtraMatchMedium(w,d,imgs,t);
  return CP_PREMIUM_BASE_MATCH_MEDIUM(w,d,imgs)
};

buildMatchSmall=function(w,d,imgs){
  let t=typeof CP_ACTIVE_THEME==='function'?CP_ACTIVE_THEME():null;
  if(t&&CP_PREMIUM_GENERIC_KEYS.has(t.key))return cpPremiumExtraMatchSmall(w,d,imgs,t);
  return CP_PREMIUM_BASE_MATCH_SMALL(w,d,imgs)
};
