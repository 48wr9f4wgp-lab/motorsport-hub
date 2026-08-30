// Shared visual theme registry for multi-club rollout.
// Premium v7.1: restrained dark surfaces, subtle club-color light lines, flat secondary components.
// New clubs should add tokens here instead of cloning renderer/theme files.

const CP_CLUB_THEME_REGISTRY={
  66:{
    key:'manutd',
    text:'#FFF8F2',muted:'#C9C1BE',accent:'#D6B45A',accentSoft:'#F0D58A',
    surface:'#07080A',glow:'#641019',panel:'#13090C',panelDeep:'#090A0C',
    linePrimary:'#3B0B11',lineSecondary:'#2B2412',
    border:'#D6B45A',sideBorder:'#D6B45A'
  },
  81:{
    key:'barcelona',
    text:'#FFF8F1',muted:'#C9C6D5',accent:'#D7B04A',accentSoft:'#EFD47D',
    surface:'#070A12',glow:'#5A1038',panel:'#0C1427',panelDeep:'#090B13',
    linePrimary:'#32102A',lineSecondary:'#0D2447',
    border:'#B94967',sideBorder:'#D7B04A'
  },
  86:{
    key:'realmadrid',
    text:'#FBFCFF',muted:'#C9D1DE',accent:'#D8B557',accentSoft:'#EFD78F',
    surface:'#070A10',glow:'#123D78',panel:'#0A172A',panelDeep:'#080C13',
    linePrimary:'#112C52',lineSecondary:'#30291A',
    border:'#D8B557',sideBorder:'#D8B557'
  }
};

function CP_ACTIVE_THEME(){return CP_CLUB_THEME_REGISTRY[club?.team]||null}
function cpThemeGradient(stops,alpha=.98){let loc=stops.length===2?[0,1]:stops.length===3?[0,.58,1]:stops.map((_,i)=>i/(stops.length-1));return gradient(stops.map(x=>C(x,alpha)),loc)}

// A dark shell with two narrow, low-contrast diagonal light lines.
// The lines are intentionally placed in the shell only, so they do not compete with match information.
function cpShellGradient(t){
  let g=new LinearGradient();
  g.startPoint=new Point(0,0);
  g.endPoint=new Point(1,1);
  g.colors=[
    C(t.surface),C(t.panel),C(t.panel),C(t.linePrimary),C(t.panel),
    C(t.panel),C(t.panel),C(t.lineSecondary),C(t.panel),C(t.glow),C(t.surface)
  ];
  g.locations=[0,.18,.272,.282,.292,.58,.692,.702,.712,.86,1];
  return g
}

const CP_THEME_BASE_BG=bg,
      CP_THEME_BASE_CARD_BG=cardBg,
      CP_THEME_BASE_BADGE=badge,
      CP_THEME_BASE_SIDE=sidePill,
      CP_THEME_BASE_FORM=formChip,
      CP_THEME_BASE_HEADER_MEDIUM=buildHeaderMedium,
      CP_THEME_BASE_HEADER_SMALL=buildHeaderSmall,
      CP_THEME_BASE_FOOTER_MEDIUM=buildFooterMedium,
      CP_THEME_BASE_FOOTER_SMALL=buildFooterSmall,
      CP_THEME_BASE_BUILD_MEDIUM=buildMedium,
      CP_THEME_BASE_BUILD_SMALL=buildSmall;

// Club color appears as two quiet diagonal light lines plus one restrained undertone.
bg=function(){
  let t=CP_ACTIVE_THEME();
  if(!t)return CP_THEME_BASE_BG();
  if(!t.linePrimary||!t.lineSecondary)return cpThemeGradient([t.surface,t.panel,t.glow],.99);
  return cpShellGradient(t)
};

// Match panel stays dark and disciplined; club color is only a faint undertone.
cardBg=function(mode){
  let t=CP_ACTIVE_THEME();
  if(!t)return CP_THEME_BASE_CARD_BG(mode);
  let tint=mode==='LIVE'?t.glow:mode==='POST'?t.panel:t.panel;
  return cpThemeGradient([t.panelDeep,t.panel,tint],mode==='LIVE'?.99:.985)
};

// Club crest: no circular plate. Preserve the transparent crest artwork itself.
badge=function(p,fallback,img,size=28,p1=club.p,p2=club.s,scale=1){
  let t=CP_ACTIVE_THEME();
  if(!t||fallback!==club.badge)return CP_THEME_BASE_BADGE(p,fallback,img,size,p1,p2,scale);
  let o=p.addStack();
  o.size=new Size(size+2,size+2);
  o.backgroundColor=C('#000000',0);
  o.borderWidth=0;
  o.centerAlignContent();
  let i=o.addStack();
  i.size=new Size(size,size);
  i.backgroundColor=C('#000000',0);
  i.centerAlignContent();
  if(img){
    let im=i.addImage(img),z=Math.round(size*scale);
    im.imageSize=new Size(z,z)
  }else{
    let tx=heavy(i,fallback,size<30?8:10,t.text);tx.centerAlignText()
  }
  return o
};

sidePill=function(parent,m,small=false){
  let t=CP_ACTIVE_THEME();
  if(!t)return CP_THEME_BASE_SIDE(parent,m,small);
  let p=parent.addStack(),label=sideTag(m);
  p.setPadding(2,small?6:7,2,small?6:7);
  p.cornerRadius=8;
  p.backgroundColor=C(t.panelDeep,.96);
  p.borderWidth=.8;
  p.borderColor=C(t.sideBorder,.72);
  text(p,label,small?6.8:6.8,true,1,t.text);
  return p
};

formChip=function(parent,r,latest=false,small=false){
  let t=CP_ACTIVE_THEME();
  if(!t)return CP_THEME_BASE_FORM(parent,r,latest,small);
  let z={W:['勝','#8EE9A4','#11321E'],D:['分','#ECECF0','#35373C'],L:['負','#FF8E87','#451716'],'-':['–','#B7BAC2','#25272B']}[r]||['–','#B7BAC2','#25272B'],p=parent.addStack();
  p.setPadding(small?2.2:2,small?6.3:7,small?2.2:2,small?6.3:7);
  p.cornerRadius=latest?9:8;
  p.backgroundColor=C(z[2],.99);
  p.borderWidth=latest?1:.45;
  p.borderColor=latest?C(t.accent,.80):C(z[1],.30);
  text(p,z[0],small?7.5:7,true,1,z[1]);
  return p
};

buildHeaderMedium=function(w,d,img){
  let t=CP_ACTIVE_THEME();
  if(!t)return CP_THEME_BASE_HEADER_MEDIUM(w,d,img);
  let h=w.addStack();
  h.layoutHorizontally();
  h.centerAlignContent();
  h.setPadding(0,3,0,3);
  badge(h,club.badge,img,20,club.p,club.s,CREST_SCALE[club.team]||.91);
  h.addSpacer(7);
  let l=h.addStack();l.layoutVertically();
  heavy(l,club.name,10.5,t.text);
  text(l,`${updated(d.fetchedAt)}${d.stale?' · 保存データ':''}`,6.6,false,.76,t.muted);
  h.addSpacer();
  let r=h.addStack();r.layoutVertically();r.centerAlignContent();
  let rk=heavy(r,d.rank!=null?`${d.rank}位`:'–',12.5,t.text);rk.rightAlignText();
  let pt=semibold(r,`勝点 ${d.points??'–'}`,7.2,.92,t.accentSoft);pt.rightAlignText()
};

buildHeaderSmall=function(w,d,img){
  let t=CP_ACTIVE_THEME();
  if(!t)return CP_THEME_BASE_HEADER_SMALL(w,d,img);
  let h=w.addStack();h.layoutHorizontally();h.centerAlignContent();
  badge(h,club.badge,img,18,club.p,club.s,CREST_SCALE[club.team]||.91);
  h.addSpacer(5);
  heavy(h,club.jp,8.5,t.text);
  h.addSpacer();
  let rk=heavy(h,d.rank!=null?`${d.rank}位`:'–',9.5,t.text);rk.rightAlignText()
};

// Footer is intentionally flat. The only color cue is the small accent arrow and latest-result outline.
buildFooterMedium=function(w,d){
  let t=CP_ACTIVE_THEME();
  if(!t)return CP_THEME_BASE_FOOTER_MEDIUM(w,d);
  let f=w.addStack();f.layoutHorizontally();f.centerAlignContent();
  f.setPadding(2,8,2,8);f.cornerRadius=9;
  f.backgroundColor=C(t.panelDeep,.94);
  f.borderWidth=.45;f.borderColor=C(t.border,.30);
  text(f,'最新',6.8,true,.92,t.text);f.addSpacer(2);text(f,'→',7,true,1,t.accent);f.addSpacer(6);
  for(let i=0;i<d.form.length;i++){formChip(f,d.form[i],i===0,false);if(i<d.form.length-1)f.addSpacer(3)}
  f.addSpacer()
};

buildFooterSmall=function(w,d){
  let t=CP_ACTIVE_THEME();
  if(!t)return CP_THEME_BASE_FOOTER_SMALL(w,d);
  let f=w.addStack();f.layoutHorizontally();f.centerAlignContent();
  f.setPadding(1,1,1,1);
  f.addSpacer();
  text(f,'最新',7.6,true,.94,t.text);f.addSpacer(2);text(f,'→',7.6,true,1,t.accent);f.addSpacer(5);
  for(let i=0;i<d.form.length;i++){formChip(f,d.form[i],i===0,true);if(i<d.form.length-1)f.addSpacer(3)}
  f.addSpacer()
};

// Shared themed clubs keep the canonical match renderer and composition.
buildMedium=function(d,imgs){
  let t=CP_ACTIVE_THEME();
  if(!t)return CP_THEME_BASE_BUILD_MEDIUM(d,imgs);
  let w=new ListWidget();
  w.backgroundGradient=bg();
  w.setPadding(5,10,8,10);
  let line=w.addStack();line.size=new Size(0,1);line.backgroundColor=C(t.accent,.56);
  w.addSpacer(2);
  buildHeaderMedium(w,d,imgs.club);
  w.addSpacer(2);
  buildMatchMedium(w,d,imgs);
  w.addSpacer(2);
  buildFooterMedium(w,d);
  w.refreshAfterDate=new Date(Date.now()+refreshDelay(d));
  return w
};

buildSmall=function(d,imgs){
  let t=CP_ACTIVE_THEME();
  if(!t)return CP_THEME_BASE_BUILD_SMALL(d,imgs);
  let w=new ListWidget();
  w.backgroundGradient=bg();
  w.setPadding(8,8,8,8);
  buildHeaderSmall(w,d,imgs.club);
  w.addSpacer(5);
  buildMatchSmall(w,d,imgs);
  w.addSpacer(5);
  buildFooterSmall(w,d);
  w.refreshAfterDate=new Date(Date.now()+refreshDelay(d));
  return w
};
