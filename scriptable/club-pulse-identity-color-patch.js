// Club Pulse identity color override v2
// Real Madrid: pearl-white shell + pearl-white match surface + restrained gold/royal-blue accents.
// Barcelona: deep purple shell + navy/plum match surface + restrained blue/garnet accents.

const CP_IDENTITY_BASE_BG=bg,
      CP_IDENTITY_BASE_CARD_BG=cardBg,
      CP_IDENTITY_BASE_HEADER_MEDIUM=buildHeaderMedium,
      CP_IDENTITY_BASE_HEADER_SMALL=buildHeaderSmall,
      CP_IDENTITY_BASE_MATCH_MEDIUM=buildMatchMedium,
      CP_IDENTITY_BASE_MATCH_SMALL=buildMatchSmall,
      CP_IDENTITY_BASE_FOOTER_SMALL=buildFooterSmall;

(function(){
  let barca=CP_CLUB_THEME_REGISTRY?.[81],real=CP_CLUB_THEME_REGISTRY?.[86];
  if(barca){
    barca.surface='#10091C';
    barca.glow='#5A1C68';
    barca.panel='#19122E';
    barca.panelDeep='#090B17';
    barca.linePrimary='#7D2B91';
    barca.lineSecondary='#2D63B9';
    barca.linePrimaryAlpha=.44;
    barca.lineSecondaryAlpha=.28;
    barca.border='#7A3B8D';
    barca.sideBorder='#D7B04A';
    barca.shellSurface='#120A20';
    barca.shellPanel='#25103C';
    barca.shellGlow='#3A1555';
  }
  if(real){
    // Dark utility tokens remain for pills/footer rails; the shell and match surface are specialized below.
    real.surface='#070A10';
    real.glow='#123D78';
    real.panel='#0A172A';
    real.panelDeep='#080C13';
    real.linePrimary='#2F6FC5';
    real.lineSecondary='#B9903D';
    real.linePrimaryAlpha=.34;
    real.lineSecondaryAlpha=.24;
    real.border='#D8B557';
    real.sideBorder='#D8B557';

    // Outer identity: pearl white, royal blue and restrained gold.
    real.shellSurface='#F7F7F4';
    real.shellPanel='#EDF0F5';
    real.shellGlow='#D8E0EC';
    real.shellText='#16223A';
    real.shellMuted='#667286';

    // Match surface: white-based rather than navy, with enough cool-grey depth to avoid a cheap flat card.
    real.cardSurface='#FAFAF8';
    real.cardPanel='#F0F2F6';
    real.cardGlow='#E1E7F0';
    real.cardText='#142443';
    real.cardMuted='#65728A';
    real.cardAccent='#2453A4';
    real.cardBorder='#C6A454';
  }
})();

function cpIdentityShellGradient(t){
  let small=(config.widgetFamily||'medium')==='small',c1=.282,c2=.702,w1=small?.030:.024,w2=small?.025:.020,
      a1=t.linePrimaryAlpha??.36,a2=t.lineSecondaryAlpha??.22,g=new LinearGradient();
  g.startPoint=new Point(0,0);
  g.endPoint=new Point(1,1);
  g.colors=[
    C(t.shellSurface),C(t.shellPanel),C(t.shellPanel),
    C(t.linePrimary,a1*.28),C(t.linePrimary,a1),C(t.linePrimary,a1*.34),C(t.shellPanel),
    C(t.shellPanel),
    C(t.lineSecondary,a2*.26),C(t.lineSecondary,a2),C(t.lineSecondary,a2*.34),C(t.shellPanel),
    C(t.shellPanel),C(t.shellGlow),C(t.shellSurface)
  ];
  g.locations=[
    0,.15,c1-w1*1.8,
    c1-w1,c1,c1+w1,c1+w1*1.8,
    .58,
    c2-w2*1.8,c2-w2,c2+w2,c2+w2*1.8,
    .86,1
  ];
  return g
}

function cpRealCardGradient(t,mode){
  let g=new LinearGradient();
  g.startPoint=new Point(0,0);
  g.endPoint=new Point(1,1);
  let live=mode==='LIVE';
  g.colors=[
    C(t.cardSurface),
    C(t.cardPanel),
    C(live?t.cardGlow:t.cardPanel),
    C(t.cardGlow)
  ];
  g.locations=[0,.48,.76,1];
  return g
}

bg=function(){
  let t=CP_ACTIVE_THEME();
  if(!t)return CP_IDENTITY_BASE_BG();
  if((t.key==='realmadrid'||t.key==='barcelona')&&t.shellSurface)return cpIdentityShellGradient(t);
  return CP_IDENTITY_BASE_BG()
};

cardBg=function(mode){
  let t=CP_ACTIVE_THEME();
  if(t?.key==='realmadrid'&&t.cardSurface)return cpRealCardGradient(t,mode);
  return CP_IDENTITY_BASE_CARD_BG(mode)
};

buildHeaderMedium=function(w,d,img){
  let t=CP_ACTIVE_THEME();
  if(!t||t.key!=='realmadrid')return CP_IDENTITY_BASE_HEADER_MEDIUM(w,d,img);
  let h=w.addStack();
  h.layoutHorizontally();
  h.centerAlignContent();
  h.setPadding(0,3,0,3);
  badge(h,club.badge,img,20,club.p,club.s,CREST_SCALE[club.team]||.91);
  h.addSpacer(7);
  let l=h.addStack();l.layoutVertically();
  heavy(l,club.name,10.5,t.shellText);
  text(l,`${updated(d.fetchedAt)}${d.stale?' · 保存データ':''}`,6.6,false,.78,t.shellMuted);
  h.addSpacer();
  let r=h.addStack();r.layoutVertically();r.centerAlignContent();
  let rk=heavy(r,d.rank!=null?`${d.rank}位`:'–',12.5,t.shellText);rk.rightAlignText();
  let pt=semibold(r,`勝点 ${d.points??'–'}`,7.2,.96,t.accent);pt.rightAlignText()
};

buildHeaderSmall=function(w,d,img){
  let t=CP_ACTIVE_THEME();
  if(!t||t.key!=='realmadrid')return CP_IDENTITY_BASE_HEADER_SMALL(w,d,img);
  let h=w.addStack();h.layoutHorizontally();h.centerAlignContent();
  badge(h,club.badge,img,18,club.p,club.s,CREST_SCALE[club.team]||.91);
  h.addSpacer(5);
  heavy(h,club.jp,8.5,t.shellText);
  h.addSpacer();
  let rk=heavy(h,d.rank!=null?`${d.rank}位`:'–',9.5,t.shellText);rk.rightAlignText()
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
  c.borderWidth=.8;c.borderColor=C(t.cardBorder,.46);
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
  c.borderWidth=.8;c.borderColor=C(t.cardBorder,.46);
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

// Small Real footer sits on the light shell, so give it a slim navy rail instead of dark text floating on white.
buildFooterSmall=function(w,d){
  let t=CP_ACTIVE_THEME();
  if(!t||t.key!=='realmadrid')return CP_IDENTITY_BASE_FOOTER_SMALL(w,d);
  let f=w.addStack();f.layoutHorizontally();f.centerAlignContent();
  f.setPadding(2,6,2,6);f.cornerRadius=8;
  f.backgroundColor=C(t.panelDeep,.96);
  f.borderWidth=.6;f.borderColor=C(t.accent,.40);
  f.addSpacer();
  text(f,'最新',7.4,true,.94,t.text);f.addSpacer(2);text(f,'→',7.4,true,1,t.accent);f.addSpacer(5);
  for(let i=0;i<d.form.length;i++){formChip(f,d.form[i],i===0,true);if(i<d.form.length-1)f.addSpacer(3)}
  f.addSpacer()
};
