// Shared visual theme registry for multi-club rollout.
// New clubs should add tokens here instead of cloning renderer/theme files.

const CP_CLUB_THEME_REGISTRY={
  66:{
    key:'manutd',
    // Manchester United: saturated club red, near-black, and restrained crest gold.
    text:'#FFF4E8',muted:'#CFC5BE',accent:'#F5C451',accentSoft:'#FFE08A',
    bg:['#020203','#080506','#190406','#4D070C','#A40D18'],
    next:['#A10E18','#5C080E','#1A080A','#07080A'],
    live:['#C51521','#760A12','#26070A','#07080A'],
    post:['#850B14','#4C070C','#1B080A','#07080A'],
    border:'#F5C451',sideBorder:'#F5C451'
  },
  81:{
    key:'barcelona',
    // Blaugrana: garnet + deep Barça blue, with crest gold as the highlight.
    text:'#FFF5E6',muted:'#C3CBE0',accent:'#EDBB00',accentSoft:'#FFD84A',
    bg:['#02050D','#051A3D','#004D98','#650039','#A50044'],
    next:['#A50044','#650039','#14275B','#061B3E'],
    live:['#C30D55','#7A0747','#164B91','#061A3A'],
    post:['#760033','#47012E','#11366F','#06162F'],
    border:'#EDBB00',sideBorder:'#EDBB00'
  },
  86:{
    key:'realmadrid',
    // Real Madrid: pearl white is the primary surface; royal blue structures the match card; gold trims the hierarchy.
    text:'#FAF9F3',muted:'#667792',accent:'#FEBE10',accentSoft:'#A47C00',
    bg:['#F8F7F2','#FFFFFF','#E7ECF6','#B8C7DF','#E6C766'],
    next:['#0B3D91','#092F73','#071B41','#08111F'],
    live:['#1558A8','#0D4088','#082754','#08101D'],
    post:['#0D438F','#0A326F','#071E48','#080F1C'],
    border:'#F8F4E8',sideBorder:'#FEBE10',ink:'#0B2C5F',inkMuted:'#60708A'
  }
};

function CP_ACTIVE_THEME(){return CP_CLUB_THEME_REGISTRY[club?.team]||null}
function cpThemeGradient(stops,alpha=.98){return gradient(stops.map(x=>C(x,alpha)),[0,.28,.62,1],true)}

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

bg=function(){
  let t=CP_ACTIVE_THEME();
  if(!t)return CP_THEME_BASE_BG();
  if(t.key==='realmadrid')return gradient(t.bg.map((x,i)=>C(x,i<3?.99:.96)),[0,.33,.61,.84,1]);
  return gradient(t.bg.map((x,i)=>C(x,i===0?1:.98)),[0,.30,.58,.82,1])
};

cardBg=function(mode){
  let t=CP_ACTIVE_THEME();
  if(!t)return CP_THEME_BASE_CARD_BG(mode);
  let z=mode==='LIVE'?t.live:mode==='POST'?t.post:t.next;
  return cpThemeGradient(z,.98)
};

badge=function(p,fallback,img,size=28,p1=club.p,p2=club.s,scale=1){
  let t=CP_ACTIVE_THEME();
  if(!t||fallback!==club.badge)return CP_THEME_BASE_BADGE(p,fallback,img,size,p1,p2,scale);
  let o=p.addStack();
  o.size=new Size(size+5,size+5);
  o.cornerRadius=(size+5)/2;
  o.backgroundColor=C(t.key==='realmadrid'?'#FFFFFF':t.accent,t.key==='realmadrid'?.94:.07);
  o.borderWidth=t.key==='realmadrid'?1.1:.8;
  o.borderColor=C(t.border,t.key==='realmadrid'?.98:.58);
  o.centerAlignContent();
  let i=o.addStack();
  i.size=new Size(size,size);
  i.cornerRadius=size/2;
  i.centerAlignContent();
  if(img){
    let im=i.addImage(img),z=Math.round((size-1)*scale);
    im.imageSize=new Size(z,z)
  }else{
    i.backgroundGradient=gradient([C(club.s),C(club.p,t.key==='realmadrid'?.18:.72)],[0,1]);
    let tx=heavy(i,fallback,size<30?8:10,t.key==='realmadrid'?t.ink:t.text);tx.centerAlignText()
  }
  return o
};

sidePill=function(parent,m,small=false){
  let t=CP_ACTIVE_THEME();
  if(!t)return CP_THEME_BASE_SIDE(parent,m,small);
  let p=parent.addStack(),label=sideTag(m);
  p.setPadding(2,small?6:7,2,small?6:7);
  p.cornerRadius=8;
  p.backgroundColor=C(t.key==='realmadrid'?'#F8F7F2':'#080B13',t.key==='realmadrid'?.98:.94);
  p.borderWidth=.9;
  p.borderColor=C(t.sideBorder,.90);
  text(p,label,small?6.8:6.8,true,1,t.key==='realmadrid'?t.ink:t.text);
  return p
};

formChip=function(parent,r,latest=false,small=false){
  let t=CP_ACTIVE_THEME();
  if(!t)return CP_THEME_BASE_FORM(parent,r,latest,small);
  let z={W:['勝','#8EE9A4','#11321E'],D:['分','#ECECF0','#35373C'],L:['負','#FF8E87','#451716'],'-':['–','#B7BAC2','#25272B']}[r]||['–','#B7BAC2','#25272B'],p=parent.addStack();
  p.setPadding(small?2.2:2,small?6.3:7,small?2.2:2,small?6.3:7);
  p.cornerRadius=latest?9:8;
  p.backgroundColor=C(z[2],.99);
  p.borderWidth=latest?1:.5;
  p.borderColor=latest?C(t.accent,.95):C(z[1],.38);
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
  heavy(l,club.name,10.5,t.key==='realmadrid'?t.ink:t.text);
  text(l,`${updated(d.fetchedAt)}${d.stale?' · 保存データ':''}`,6.6,false,.78,t.key==='realmadrid'?t.inkMuted:t.muted);
  h.addSpacer();
  let r=h.addStack();r.layoutVertically();r.centerAlignContent();
  let rk=heavy(r,d.rank!=null?`${d.rank}位`:'–',12.5,t.key==='realmadrid'?t.ink:t.text);rk.rightAlignText();
  let pt=semibold(r,`勝点 ${d.points??'–'}`,7.2,.94,t.key==='realmadrid'?'#8A6800':t.accentSoft);pt.rightAlignText()
};

buildHeaderSmall=function(w,d,img){
  let t=CP_ACTIVE_THEME();
  if(!t)return CP_THEME_BASE_HEADER_SMALL(w,d,img);
  let h=w.addStack();h.layoutHorizontally();h.centerAlignContent();
  badge(h,club.badge,img,18,club.p,club.s,CREST_SCALE[club.team]||.91);
  h.addSpacer(5);
  heavy(h,club.jp,8.5,t.key==='realmadrid'?t.ink:t.text);
  h.addSpacer();
  let rk=heavy(h,d.rank!=null?`${d.rank}位`:'–',9.5,t.key==='realmadrid'?t.ink:t.text);rk.rightAlignText()
};

buildFooterMedium=function(w,d){
  let t=CP_ACTIVE_THEME();
  if(!t)return CP_THEME_BASE_FOOTER_MEDIUM(w,d);
  let f=w.addStack();f.layoutHorizontally();f.centerAlignContent();
  f.setPadding(2,8,2,8);f.cornerRadius=9;
  if(t.key==='barcelona')f.backgroundGradient=gradient([C('#07090F',.99),C('#004D98',.78),C('#A50044',.48)],[0,.58,1]);
  else if(t.key==='manutd')f.backgroundGradient=gradient([C('#060708',.99),C('#21080A',.92),C('#8F0C15',.48)],[0,.63,1]);
  else f.backgroundGradient=gradient([C('#FFFFFF',.99),C('#EDF1F8',.99),C('#D8E2F1',.96)],[0,.58,1]);
  f.borderWidth=.7;f.borderColor=C(t.accent,t.key==='realmadrid'?.72:.32);
  text(f,'最新',6.8,true,.98,t.key==='realmadrid'?t.ink:t.text);f.addSpacer(2);text(f,'→',7,true,1,t.accent);f.addSpacer(6);
  for(let i=0;i<d.form.length;i++){formChip(f,d.form[i],i===0,false);if(i<d.form.length-1)f.addSpacer(3)}
  f.addSpacer()
};

buildFooterSmall=function(w,d){
  let t=CP_ACTIVE_THEME();
  if(!t)return CP_THEME_BASE_FOOTER_SMALL(w,d);
  let f=w.addStack();f.layoutHorizontally();f.centerAlignContent();
  if(t.key==='realmadrid'){f.setPadding(2,5,2,5);f.cornerRadius=8;f.backgroundColor=C('#F8F7F2',.96);f.borderWidth=.6;f.borderColor=C(t.accent,.62)}else f.setPadding(1,1,1,1);
  f.addSpacer();
  text(f,'最新',7.6,true,.99,t.key==='realmadrid'?t.ink:t.text);f.addSpacer(2);text(f,'→',7.6,true,1,t.accent);f.addSpacer(5);
  for(let i=0;i<d.form.length;i++){formChip(f,d.form[i],i===0,true);if(i<d.form.length-1)f.addSpacer(3)}
  f.addSpacer()
};

// Shared themed clubs keep the canonical match renderer, but use a tighter composition
// so the footer has a visible bottom inset on real Medium widgets.
buildMedium=function(d,imgs){
  let t=CP_ACTIVE_THEME();
  if(!t)return CP_THEME_BASE_BUILD_MEDIUM(d,imgs);
  let w=new ListWidget();
  w.backgroundGradient=bg();
  w.setPadding(5,10,8,10);
  let line=w.addStack();line.size=new Size(0,1.5);line.backgroundColor=C(t.accent,t.key==='realmadrid'?.94:.72);
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
  if(t.key==='realmadrid'){let line=w.addStack();line.size=new Size(0,1.3);line.backgroundColor=C(t.accent,.92);w.addSpacer(3)}
  buildHeaderSmall(w,d,imgs.club);
  w.addSpacer(t.key==='realmadrid'?4:5);
  buildMatchSmall(w,d,imgs);
  w.addSpacer(t.key==='realmadrid'?4:5);
  buildFooterSmall(w,d);
  w.refreshAfterDate=new Date(Date.now()+refreshDelay(d));
  return w
};
