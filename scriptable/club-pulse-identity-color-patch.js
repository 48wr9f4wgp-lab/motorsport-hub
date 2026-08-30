// Club Pulse identity color override v1
// Real Madrid: pearl white shell + navy match surface + restrained gold/royal-blue accents.
// Barcelona: deep purple shell + navy/plum match surface + restrained blue/garnet accents.

const CP_IDENTITY_BASE_BG=bg,
      CP_IDENTITY_BASE_HEADER_MEDIUM=buildHeaderMedium,
      CP_IDENTITY_BASE_HEADER_SMALL=buildHeaderSmall,
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
    // Keep the match panel dark; only the outer identity shell becomes pearl white.
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
    real.shellSurface='#F6F6F3';
    real.shellPanel='#ECEFF4';
    real.shellGlow='#D7DFEB';
    real.shellText='#16223A';
    real.shellMuted='#667286';
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

bg=function(){
  let t=CP_ACTIVE_THEME();
  if(!t)return CP_IDENTITY_BASE_BG();
  if((t.key==='realmadrid'||t.key==='barcelona')&&t.shellSurface)return cpIdentityShellGradient(t);
  return CP_IDENTITY_BASE_BG()
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

// Small Real footer sits on the light shell, so give it a slim navy rail instead of white text floating on white.
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
