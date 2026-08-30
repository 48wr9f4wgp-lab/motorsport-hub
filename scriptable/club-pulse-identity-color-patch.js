// Club Pulse identity color override v5
// Readability-first identity: no decorative streaks/rails. Club differentiation comes from the inner surface palette.
// Real Madrid: pearl white / royal blue / restrained gold. Barcelona: strong warm purple with explicit readable match metadata.

const CP_IDENTITY_BASE_CARD_BG=cardBg,
      CP_IDENTITY_BASE_MATCH_MEDIUM=buildMatchMedium,
      CP_IDENTITY_BASE_MATCH_SMALL=buildMatchSmall;

(function(){
  let barca=CP_CLUB_THEME_REGISTRY?.[81],real=CP_CLUB_THEME_REGISTRY?.[86];
  if(barca){
    barca.cardSurface='#160B34';
    barca.cardPanel='#32145F';
    barca.cardGlow='#452078';
    barca.border='#65449A';
    barca.sideBorder='#D7B04A';
  }
  if(real){
    real.cardSurface='#FAFAF8';
    real.cardPanel='#F1F3F7';
    real.cardGlow='#E8ECF3';
    real.cardText='#142443';
    real.cardMuted='#65728A';
    real.cardAccent='#2453A4';
    real.cardBorder='#C6A454';
  }
})();

// Real keeps a clean pearl-white information surface with only a very subtle tonal falloff.
function cpRealSimpleCardGradient(t,mode){
  let g=new LinearGradient();
  g.startPoint=new Point(0,0);
  g.endPoint=new Point(1,1);
  g.colors=[C(t.cardSurface),C(t.cardPanel),C(mode==='LIVE'?t.cardGlow:t.cardSurface)];
  g.locations=[0,.62,1];
  return g
}

cardBg=function(mode){
  let t=CP_ACTIVE_THEME();
  if(t?.key==='realmadrid'&&t.cardSurface)return cpRealSimpleCardGradient(t,mode);
  return CP_IDENTITY_BASE_CARD_BG(mode)
};

function cpRealTeamBlock(parent,opt,small=false){
  let t=CP_ACTIVE_THEME(),s=parent.addStack();
  if(opt.width)s.size=new Size(opt.width,0);
  s.layoutVertically();
  let logo=s.addStack();logo.layoutHorizontally();logo.addSpacer();
  let holder=logo.addStack();
  holder.size=new Size(opt.logoSize,opt.logoSize);
  holder.backgroundColor=C('#000000',0);
  holder.centerAlignContent();
  if(opt.img){
    let im=holder.addImage(opt.img),z=Math.round(opt.logoSize*(opt.scale||1));
    im.imageSize=new Size(z,z)
  }else{
    let fb=heavy(holder,opt.fallback,small?7.5:9,t.cardText);fb.centerAlignText()
  }
  logo.addSpacer();
  s.addSpacer(opt.nameGap??2);
  let name=s.addStack();name.layoutHorizontally();name.addSpacer();
  let nm=heavy(name,opt.name,opt.nameSize||12,t.cardText);nm.centerAlignText();
  name.addSpacer();
  if(opt.sub){
    let sub=s.addStack();sub.layoutHorizontally();sub.addSpacer();
    let sb=text(sub,opt.sub,opt.subSize||7,false,.68,t.cardMuted);sb.centerAlignText();
    sub.addSpacer()
  }
  return s
}

function cpBarcelonaMatchMedium(w,d,imgs){
  let t=CP_ACTIVE_THEME(),m=d.mode==='LIVE'?d.liveMatch:d.mode==='POST'?d.recentResult:d.nextMatch,c=w.addStack();
  c.layoutVertically();c.setPadding(5,10,6,10);c.cornerRadius=16;c.backgroundGradient=cardBg(d.mode);
  c.borderWidth=.7;c.borderColor=C(t.border,.48);
  if(!m){heavy(c,'試合データ未取得',11,'#FFFFFF');return}
  let top=c.addStack();top.layoutHorizontally();top.centerAlignContent();
  text(top,statusTitle(d,m),8.2,true,1,d.mode==='LIVE'?'#FFE2EC':'#FFFFFF');
  top.addSpacer(6);competitionPill(top,m);
  if(d.mode==='POST'){top.addSpacer(5);resultPill(top,m)}
  top.addSpacer();
  if(d.mode==='LIVE')heavy(top,m.minute||'LIVE',10,'#FFFFFF');
  else if(d.mode==='POST'){let ft=heavy(top,'FT',10,'#E8E1F0');ft.rightAlignText()}
  else sidePill(top,m);
  c.addSpacer(4);
  let outer=c.addStack();outer.layoutHorizontally();outer.centerAlignContent();outer.addSpacer();
  let row=outer.addStack();row.layoutHorizontally();row.centerAlignContent();
  renderTeamBlock(row,{img:imgs.club,name:club.jp,sub:'',fallback:club.badge,logoSize:55,nameSize:11.5,subSize:0,p1:club.p,p2:club.s,scale:CREST_SCALE[club.team]||.91,nameGap:2,width:92});
  row.addSpacer(d.mode==='POST'?15:19);
  let mid=heavy(row,centerMainText(d,m),d.mode==='POST'?27:d.mode==='NEXT'?14.5:22,'#FFFFFF');mid.centerAlignText();
  row.addSpacer(d.mode==='POST'?15:19);
  renderTeamBlock(row,{img:imgs.opp,name:m.opponentName,sub:'',fallback:m.opponentShort,logoSize:55,nameSize:11.5,subSize:0,p1:'#4A5568',p2:'#20242D',scale:CREST_SCALE[m.opponentId]||CREST_SCALE.opponent_default||.90,nameGap:2,width:92});
  outer.addSpacer();
  c.addSpacer(5);
  let meta=c.addStack();meta.layoutHorizontally();meta.addSpacer();
  let mt=semibold(meta,metaLine(d,m),9.6,1,'#F8F7FB');mt.centerAlignText();mt.minimumScaleFactor=.84;meta.addSpacer()
}

function cpBarcelonaMatchSmall(w,d,imgs){
  let t=CP_ACTIVE_THEME(),m=d.mode==='LIVE'?d.liveMatch:d.mode==='POST'?d.recentResult:d.nextMatch,c=w.addStack();
  c.layoutVertically();c.setPadding(6,6,6,6);c.cornerRadius=14;c.backgroundGradient=cardBg(d.mode);
  c.borderWidth=.7;c.borderColor=C(t.border,.48);
  if(!m){heavy(c,'試合データ未取得',10,'#FFFFFF');return}
  let top=c.addStack();top.layoutHorizontally();top.centerAlignContent();
  text(top,d.mode==='NEXT'?'次戦':statusTitle(d,m),8.2,true,1,d.mode==='LIVE'?'#FFE2EC':'#FFFFFF');
  top.addSpacer(5);competitionPill(top,m,true);top.addSpacer();
  if(d.mode==='LIVE')heavy(top,m.minute||'LIVE',9.5,'#FFFFFF');
  else if(d.mode==='POST'){resultPill(top,m,true);top.addSpacer(4);heavy(top,'FT',8.2,'#E8E1F0')}
  else sidePill(top,m,true);
  c.addSpacer(5);
  let outer=c.addStack();outer.layoutHorizontally();outer.centerAlignContent();outer.addSpacer();
  let row=outer.addStack();row.layoutHorizontally();row.centerAlignContent();
  renderTeamBlock(row,{img:imgs.club,name:smallTeamName(club.jp,true),fallback:club.badge,logoSize:40,nameSize:9.2,p1:club.p,p2:club.s,scale:CREST_SCALE[club.team]||.91,nameGap:2,width:48});
  row.addSpacer(4);
  let scoreBox=row.addStack();scoreBox.size=new Size(32,22);scoreBox.layoutHorizontally();scoreBox.centerAlignContent();scoreBox.addSpacer();
  let sc=heavy(scoreBox,centerMainText(d,m),d.mode==='POST'?16:d.mode==='NEXT'?13.5:15,'#FFFFFF');sc.centerAlignText();scoreBox.addSpacer();
  row.addSpacer(4);
  renderTeamBlock(row,{img:imgs.opp,name:smallTeamName(m.opponentName),fallback:m.opponentShort,logoSize:40,nameSize:9.2,p1:'#4A5568',p2:'#20242D',scale:CREST_SCALE[m.opponentId]||CREST_SCALE.opponent_default||.90,nameGap:2,width:48});
  outer.addSpacer();
  c.addSpacer(4);
  let meta=c.addStack();meta.layoutHorizontally();meta.addSpacer();
  let mt=semibold(meta,m.kickoff,9.2,1,'#F8F7FB');mt.centerAlignText();mt.minimumScaleFactor=.90;meta.addSpacer()
}

buildMatchMedium=function(w,d,imgs){
  let t=CP_ACTIVE_THEME();
  if(!t)return CP_IDENTITY_BASE_MATCH_MEDIUM(w,d,imgs);
  if(t.key==='barcelona')return cpBarcelonaMatchMedium(w,d,imgs);
  if(t.key!=='realmadrid')return CP_IDENTITY_BASE_MATCH_MEDIUM(w,d,imgs);
  let m=d.mode==='LIVE'?d.liveMatch:d.mode==='POST'?d.recentResult:d.nextMatch,c=w.addStack();
  c.layoutVertically();c.setPadding(4,9,4,9);c.cornerRadius=16;c.backgroundGradient=cardBg(d.mode);
  c.borderWidth=.8;c.borderColor=C(t.cardBorder,.48);
  if(!m){heavy(c,'試合データ未取得',11,t.cardText);return}
  let top=c.addStack();top.layoutHorizontally();top.centerAlignContent();
  text(top,statusTitle(d,m),8,true,1,d.mode==='LIVE'?t.cardAccent:t.cardText);
  top.addSpacer(6);competitionPill(top,m);
  if(d.mode==='POST'){top.addSpacer(5);resultPill(top,m)}
  top.addSpacer();
  if(d.mode==='LIVE')heavy(top,m.minute||'LIVE',10,t.cardText);
  else if(d.mode==='POST'){let ft=heavy(top,'FT',10,t.cardMuted);ft.rightAlignText()}
  else sidePill(top,m);
  c.addSpacer(2);
  let outer=c.addStack();outer.layoutHorizontally();outer.centerAlignContent();outer.addSpacer();
  let row=outer.addStack();row.layoutHorizontally();row.centerAlignContent();
  cpRealTeamBlock(row,{img:imgs.club,name:club.jp,sub:'',fallback:club.badge,logoSize:56,nameSize:12,subSize:0,scale:CREST_SCALE[club.team]||.91,nameGap:1,width:94});
  row.addSpacer(d.mode==='POST'?16:20);
  let mid=heavy(row,centerMainText(d,m),d.mode==='POST'?27:d.mode==='NEXT'?14:22,t.cardText);mid.centerAlignText();
  row.addSpacer(d.mode==='POST'?16:20);
  cpRealTeamBlock(row,{img:imgs.opp,name:m.opponentName,sub:'',fallback:m.opponentShort,logoSize:56,nameSize:12,subSize:0,scale:CREST_SCALE[m.opponentId]||CREST_SCALE.opponent_default||.90,nameGap:1,width:94});
  outer.addSpacer();c.addSpacer(2);
  let meta=c.addStack();meta.layoutHorizontally();meta.addSpacer();
  let mt=semibold(meta,metaLine(d,m),9,.94,t.cardText);mt.centerAlignText();meta.addSpacer()
};

buildMatchSmall=function(w,d,imgs){
  let t=CP_ACTIVE_THEME();
  if(!t)return CP_IDENTITY_BASE_MATCH_SMALL(w,d,imgs);
  if(t.key==='barcelona')return cpBarcelonaMatchSmall(w,d,imgs);
  if(t.key!=='realmadrid')return CP_IDENTITY_BASE_MATCH_SMALL(w,d,imgs);
  let m=d.mode==='LIVE'?d.liveMatch:d.mode==='POST'?d.recentResult:d.nextMatch,c=w.addStack();
  c.layoutVertically();c.setPadding(6,6,6,6);c.cornerRadius=14;c.backgroundGradient=cardBg(d.mode);
  c.borderWidth=.8;c.borderColor=C(t.cardBorder,.48);
  if(!m){heavy(c,'試合データ未取得',10,t.cardText);return}
  let top=c.addStack();top.layoutHorizontally();top.centerAlignContent();
  text(top,d.mode==='NEXT'?'次戦':statusTitle(d,m),8.2,true,1,d.mode==='LIVE'?t.cardAccent:t.cardText);
  top.addSpacer(5);competitionPill(top,m,true);top.addSpacer();
  if(d.mode==='LIVE')heavy(top,m.minute||'LIVE',9.5,t.cardText);
  else if(d.mode==='POST'){resultPill(top,m,true);top.addSpacer(4);heavy(top,'FT',8.2,t.cardMuted)}
  else sidePill(top,m,true);
  c.addSpacer(5);
  let outer=c.addStack();outer.layoutHorizontally();outer.centerAlignContent();outer.addSpacer();
  let row=outer.addStack();row.layoutHorizontally();row.centerAlignContent();
  cpRealTeamBlock(row,{img:imgs.club,name:smallTeamName(club.jp,true),fallback:club.badge,logoSize:40,nameSize:9.2,scale:CREST_SCALE[club.team]||.91,nameGap:2,width:48},true);
  row.addSpacer(4);
  let scoreBox=row.addStack();scoreBox.size=new Size(32,22);scoreBox.layoutHorizontally();scoreBox.centerAlignContent();scoreBox.addSpacer();
  let sc=heavy(scoreBox,centerMainText(d,m),d.mode==='POST'?16:d.mode==='NEXT'?13.5:15,t.cardText);sc.centerAlignText();scoreBox.addSpacer();
  row.addSpacer(4);
  cpRealTeamBlock(row,{img:imgs.opp,name:smallTeamName(m.opponentName),fallback:m.opponentShort,logoSize:40,nameSize:9.2,scale:CREST_SCALE[m.opponentId]||CREST_SCALE.opponent_default||.90,nameGap:2,width:48},true);
  outer.addSpacer();c.addSpacer(4);
  let meta=c.addStack();meta.layoutHorizontally();meta.addSpacer();
  let mt=semibold(meta,m.kickoff,9.2,.97,t.cardText);mt.centerAlignText();meta.addSpacer()
};
