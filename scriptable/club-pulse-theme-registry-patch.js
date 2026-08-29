// Shared visual theme registry for multi-club rollout.
// New clubs should add tokens here instead of cloning renderer/theme files.

const CP_CLUB_THEME_REGISTRY={
  81:{
    key:'barcelona',
    text:'#F7F1E8',muted:'#C8C4D3',accent:'#EDBB00',accentSoft:'#F6D85E',
    bg:['#040611','#07152E','#101D54','#4B0B3B','#8A083D'],
    next:['#7D0B3C','#3F0A37','#101535','#070A12'],
    live:['#A30D4C','#5D0A40','#111942','#070A12'],
    post:['#760A38','#3A0A30','#111632','#070A12'],
    border:'#EDBB00',sideBorder:'#EDBB00'
  },
  86:{
    key:'realmadrid',
    text:'#F7F5EF',muted:'#C8CBD8',accent:'#D9B85B',accentSoft:'#F0D98A',
    bg:['#03050B','#081027','#111D46','#18285E','#251A45'],
    next:['#172A62','#101D45','#0B1025','#06080E'],
    live:['#26458D','#172E68','#0C1532','#06080E'],
    post:['#1B326F','#142653','#0B132C','#06080E'],
    border:'#D9B85B',sideBorder:'#D9B85B'
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
      CP_THEME_BASE_FOOTER_MEDIUM=buildFooterMedium,
      CP_THEME_BASE_FOOTER_SMALL=buildFooterSmall;

bg=function(){
  let t=CP_ACTIVE_THEME();
  if(!t)return CP_THEME_BASE_BG();
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
  o.backgroundColor=C(t.accent,.07);
  o.borderWidth=.8;
  o.borderColor=C(t.border,.58);
  o.centerAlignContent();
  let i=o.addStack();
  i.size=new Size(size,size);
  i.cornerRadius=size/2;
  i.centerAlignContent();
  if(img){
    let im=i.addImage(img),z=Math.round((size-1)*scale);
    im.imageSize=new Size(z,z)
  }else{
    i.backgroundGradient=gradient([C(club.s),C(club.p,.72)],[0,1]);
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
  p.backgroundColor=C('#090B12',.94);
  p.borderWidth=.9;
  p.borderColor=C(t.sideBorder,.78);
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
  p.borderWidth=latest?1:.5;
  p.borderColor=latest?C(t.accent,.9):C(z[1],.38);
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
  text(l,`${updated(d.fetchedAt)}${d.stale?' · 保存データ':''}`,6.6,false,.72,t.muted);
  h.addSpacer();
  let r=h.addStack();r.layoutVertically();r.centerAlignContent();
  let rk=heavy(r,d.rank!=null?`${d.rank}位`:'–',12.5,t.text);rk.rightAlignText();
  let pt=semibold(r,`勝点 ${d.points??'–'}`,7.2,.82,t.accentSoft);pt.rightAlignText()
};

buildFooterMedium=function(w,d){
  let t=CP_ACTIVE_THEME();
  if(!t)return CP_THEME_BASE_FOOTER_MEDIUM(w,d);
  let f=w.addStack();f.layoutHorizontally();f.centerAlignContent();
  f.setPadding(2,8,2,8);f.cornerRadius=9;
  f.backgroundGradient=gradient([C('#07090F',.99),C(club.s,.82),C(club.p,.22)],[0,.64,1]);
  f.borderWidth=.5;f.borderColor=C(t.accent,.28);
  text(f,'最新',6.8,true,.98,t.text);f.addSpacer(2);text(f,'→',7,true,1,t.accent);f.addSpacer(6);
  for(let i=0;i<d.form.length;i++){formChip(f,d.form[i],i===0,false);if(i<d.form.length-1)f.addSpacer(3)}
  f.addSpacer()
};

buildFooterSmall=function(w,d){
  let t=CP_ACTIVE_THEME();
  if(!t)return CP_THEME_BASE_FOOTER_SMALL(w,d);
  let f=w.addStack();f.layoutHorizontally();f.centerAlignContent();f.setPadding(1,1,1,1);f.addSpacer();
  text(f,'最新',7.6,true,.99,t.text);f.addSpacer(2);text(f,'→',7.6,true,1,t.accent);f.addSpacer(5);
  for(let i=0;i<d.form.length;i++){formChip(f,d.form[i],i===0,true);if(i<d.form.length-1)f.addSpacer(3)}
  f.addSpacer()
};
