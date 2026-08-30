// Club Pulse identity color override v3
// Shared shell is fixed dark for readability. Club identity is expressed only inside the match surface and edge-safe streaks.
// Real Madrid: pearl white / royal blue / restrained gold. Barcelona: stronger warm purple / garnet / restrained blue.

const CP_IDENTITY_BASE_CARD_BG=cardBg,
      CP_IDENTITY_BASE_MATCH_MEDIUM=buildMatchMedium,
      CP_IDENTITY_BASE_MATCH_SMALL=buildMatchSmall;

(function(){
  let barca=CP_CLUB_THEME_REGISTRY?.[81],real=CP_CLUB_THEME_REGISTRY?.[86];
  if(barca){
    barca.cardSurface='#130A2B';
    barca.cardPanel='#2A1457';
    barca.cardGlow='#4C1D95';
    barca.linePrimary='#7C3AED';
    barca.lineSecondary='#BE185D';
    barca.linePrimaryAlpha=.46;
    barca.lineSecondaryAlpha=.30;
    barca.border='#7043C2';
    barca.sideBorder='#D7B04A';
  }
  if(real){
    real.cardSurface='#FAFAF8';
    real.cardPanel='#F0F2F6';
    real.cardGlow='#E1E7F0';
    real.cardText='#142443';
    real.cardMuted='#65728A';
    real.cardAccent='#2453A4';
    real.cardBorder='#C6A454';
    real.linePrimary='#2F6FC5';
    real.lineSecondary='#B9903D';
    real.linePrimaryAlpha=.30;
    real.lineSecondaryAlpha=.22;
  }
})();

// White Real card gets the same safe-edge identity treatment as dark club cards.
function cpRealCardGradient(t,mode){
  let small=(config.widgetFamily||'medium')==='small',p1=.070,p2=.930,w=small?.034:.028,
      a1=t.linePrimaryAlpha??.30,a2=t.lineSecondaryAlpha??.22,g=new LinearGradient();
  g.startPoint=new Point(0,.18);
  g.endPoint=new Point(1,.82);
  g.colors=[
    C(t.cardSurface),C(t.cardPanel),
    C(t.linePrimary,a1*.22),C(t.linePrimary,a1),C(t.linePrimary,a1*.28),C(t.cardPanel),
    C(t.cardPanel),
    C(t.lineSecondary,a2*.22),C(t.lineSecondary,a2),C(t.lineSecondary,a2*.28),C(t.cardPanel),
    C(mode==='LIVE'?t.cardGlow:t.cardSurface)
  ];
  g.locations=[
    0,p1-w*1.8,
    p1-w,p1,p1+w,p1+w*1.8,
    .50,
    p2-w*1.8,p2-w,p2,p2+w,p2+w*1.8,
    1
  ];
  return g
}

cardBg=function(mode){
  let t=CP_ACTIVE_THEME();
  if(t?.key==='realmadrid'&&t.cardSurface)return cpRealCardGradient(t,mode);
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

buildMatchMedium=function(w,d,imgs){
  let t=CP_ACTIVE_THEME();
  if(!t||t.key!=='realmadrid')return CP_IDENTITY_BASE_MATCH_MEDIUM(w,d,imgs);
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
  if(!t||t.key!=='realmadrid')return CP_IDENTITY_BASE_MATCH_SMALL(w,d,imgs);
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
