// Club Pulse premium visual pass v1.
// Shared design language: restrained tonal surfaces + thin metallic edge. No decorative bands cross content.
// Real Madrid gets a pearl-white finish; extra clubs receive the same premium card-frame treatment.

const CP_PREMIUM_BASE_CARD_BG=cardBg,
      CP_PREMIUM_BASE_MATCH_MEDIUM=buildMatchMedium,
      CP_PREMIUM_BASE_MATCH_SMALL=buildMatchSmall;
const CP_PREMIUM_EXTRA_KEYS=new Set(['bayern','psg','milan','mancity']);

(function(){
  let real=CP_CLUB_THEME_REGISTRY?.[86];
  if(real){
    real.cardSurface='#FFFDF8';
    real.cardPanel='#F3F0E9';
    real.cardGlow='#FFFFFF';
    real.cardPearl='#E9E3D6';
    real.cardText='#142443';
    real.cardMuted='#5E6B81';
    real.cardAccent='#2453A4';
    real.cardBorder='#C7A653';
  }
})();

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

function cpPremiumExtraMatchMedium(w,d,imgs,t){
  let m=d.mode==='LIVE'?d.liveMatch:d.mode==='POST'?d.recentResult:d.nextMatch,c=w.addStack();
  c.layoutVertically();c.setPadding(4,9,4,9);c.cornerRadius=16;c.backgroundGradient=cardBg(d.mode);
  c.borderWidth=.85;c.borderColor=C(t.cardBorder||t.border||CP_COMMON_SHELL.edge,.72);
  if(!m){heavy(c,'試合データ未取得',11);return}
  let top=c.addStack();top.layoutHorizontally();top.centerAlignContent();
  text(top,statusTitle(d,m),8,true,1,d.mode==='POST'?'#E4E4E8':d.mode==='LIVE'?'#FFE3E0':'#F2F2F5');
  top.addSpacer(6);competitionPill(top,m);
  if(d.mode==='POST'){top.addSpacer(5);resultPill(top,m)}
  top.addSpacer();
  if(d.mode==='LIVE')heavy(top,m.minute||'LIVE',10);
  else if(d.mode==='POST'){let ft=heavy(top,'FT',10,'#E4E4E8');ft.rightAlignText()}
  else sidePill(top,m);
  c.addSpacer(2);
  let outer=c.addStack();outer.layoutHorizontally();outer.centerAlignContent();outer.addSpacer();
  let row=outer.addStack();row.layoutHorizontally();row.centerAlignContent();
  renderTeamBlock(row,{img:imgs.club,name:club.jp,sub:'',fallback:club.badge,logoSize:56,nameSize:12,subSize:0,p1:club.p,p2:club.s,scale:CREST_SCALE[club.team]||.91,nameGap:1,width:94});
  row.addSpacer(d.mode==='POST'?16:20);
  let mid=heavy(row,centerMainText(d,m),d.mode==='POST'?27:d.mode==='NEXT'?14:22);mid.centerAlignText();
  row.addSpacer(d.mode==='POST'?16:20);
  renderTeamBlock(row,{img:imgs.opp,name:m.opponentName,sub:'',fallback:m.opponentShort,logoSize:56,nameSize:12,subSize:0,p1:'#4A5568',p2:'#20242D',scale:CREST_SCALE[m.opponentId]||CREST_SCALE.opponent_default||.90,nameGap:1,width:94});
  outer.addSpacer();c.addSpacer(2);
  let meta=c.addStack();meta.layoutHorizontally();meta.addSpacer();let mt=semibold(meta,metaLine(d,m),9,.98);mt.centerAlignText();meta.addSpacer()
}

function cpPremiumExtraMatchSmall(w,d,imgs,t){
  let m=d.mode==='LIVE'?d.liveMatch:d.mode==='POST'?d.recentResult:d.nextMatch,c=w.addStack();
  c.layoutVertically();c.setPadding(6,6,6,6);c.cornerRadius=14;c.backgroundGradient=cardBg(d.mode);
  c.borderWidth=.75;c.borderColor=C(t.cardBorder||t.border||CP_COMMON_SHELL.edge,.66);
  if(!m){heavy(c,'試合データ未取得',10);return}
  let top=c.addStack();top.layoutHorizontally();top.centerAlignContent();
  text(top,d.mode==='NEXT'?'次戦':statusTitle(d,m),8.2,true,1,d.mode==='POST'?'#E4E4E8':d.mode==='LIVE'?'#FFE3E0':'#F4F4F6');
  top.addSpacer(5);competitionPill(top,m,true);top.addSpacer();
  if(d.mode==='LIVE')heavy(top,m.minute||'LIVE',9.5);
  else if(d.mode==='POST'){resultPill(top,m,true);top.addSpacer(4);heavy(top,'FT',8.2,'#E4E4E8')}
  else sidePill(top,m,true);
  c.addSpacer(5);
  let outer=c.addStack();outer.layoutHorizontally();outer.centerAlignContent();outer.addSpacer();
  let row=outer.addStack();row.layoutHorizontally();row.centerAlignContent();
  renderTeamBlock(row,{img:imgs.club,name:smallTeamName(club.jp,true),fallback:club.badge,logoSize:40,nameSize:9.2,p1:club.p,p2:club.s,scale:CREST_SCALE[club.team]||.91,nameGap:2,width:48});
  row.addSpacer(4);
  let scoreBox=row.addStack();scoreBox.size=new Size(32,22);scoreBox.layoutHorizontally();scoreBox.centerAlignContent();scoreBox.addSpacer();
  let sc=heavy(scoreBox,centerMainText(d,m),d.mode==='POST'?16:d.mode==='NEXT'?13.5:15);sc.centerAlignText();scoreBox.addSpacer();
  row.addSpacer(4);
  renderTeamBlock(row,{img:imgs.opp,name:smallTeamName(m.opponentName),fallback:m.opponentShort,logoSize:40,nameSize:9.2,p1:'#4A5568',p2:'#20242D',scale:CREST_SCALE[m.opponentId]||CREST_SCALE.opponent_default||.90,nameGap:2,width:48});
  outer.addSpacer();c.addSpacer(4);
  let meta=c.addStack();meta.layoutHorizontally();meta.addSpacer();let mt=semibold(meta,m.kickoff,9.2,.99,'#F7F7F8');mt.centerAlignText();meta.addSpacer()
}

buildMatchMedium=function(w,d,imgs){
  let t=typeof CP_ACTIVE_THEME==='function'?CP_ACTIVE_THEME():null;
  if(t&&CP_PREMIUM_EXTRA_KEYS.has(t.key))return cpPremiumExtraMatchMedium(w,d,imgs,t);
  return CP_PREMIUM_BASE_MATCH_MEDIUM(w,d,imgs)
};

buildMatchSmall=function(w,d,imgs){
  let t=typeof CP_ACTIVE_THEME==='function'?CP_ACTIVE_THEME():null;
  if(t&&CP_PREMIUM_EXTRA_KEYS.has(t.key))return cpPremiumExtraMatchSmall(w,d,imgs,t);
  return CP_PREMIUM_BASE_MATCH_SMALL(w,d,imgs)
};
