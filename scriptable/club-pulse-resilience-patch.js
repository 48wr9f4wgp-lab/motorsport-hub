const CP_RES_BASE_LOAD_DATA=loadData,CP_RES_BASE_ERROR_WIDGET=errorWidget;

loadData=async function(t){
  if(qa==='offline'||qa==='nocache'){
    const cached=readJSON(cachePath());
    const forced=new Error('QA forced network outage');
    if(qa==='offline'&&cached)return{...cached,stale:true,resilience:'cache'};
    throw forced;
  }
  return CP_RES_BASE_LOAD_DATA(t)
};

function cpResTheme(){
  if(typeof CP_MU_IS==='function'&&CP_MU_IS())return{title:CP_MU_THEME.ivory,accent:CP_MU_THEME.goldSoft};
  if(typeof CP_ACTIVE_THEME==='function'){
    let t=CP_ACTIVE_THEME();
    if(t)return{title:t.text||'#FFFFFF',accent:t.accentSoft||t.accent||'#FFFFFF'}
  }
  return{title:'#FFFFFF',accent:'#FFFFFF'}
}

buildHeaderSmall=function(w,d,img){
  let th=cpResTheme();
  let h=w.addStack();h.layoutHorizontally();h.centerAlignContent();
  badge(h,club.badge,img,18,club.p,club.s,CREST_SCALE[club.team]||.91);
  h.addSpacer(5);heavy(h,club.jp,8.5,th.title);
  if(d.stale){
    h.addSpacer(5);let s=h.addStack();s.setPadding(1.5,5,1.5,5);s.cornerRadius=7;
    s.backgroundColor=C('#211B0C',.96);s.borderWidth=.7;s.borderColor=C('#E7B93F',.75);
    text(s,'保存',6.2,true,1,'#F3D77B')
  }
  h.addSpacer();let rk=heavy(h,d.rank!=null?`${d.rank}位`:'–',9.5,th.title);rk.rightAlignText()
};

errorWidget=function(msg){
  if(String(msg||'').includes('API Token'))return CP_RES_BASE_ERROR_WIDGET(msg);
  let th=cpResTheme();
  let w=new ListWidget();w.backgroundGradient=typeof bg==='function'?bg():gradient([C('#070709'),C('#21070B')],[0,1]);
  w.setPadding(12,12,12,12);
  let h=w.addStack();h.layoutHorizontally();h.centerAlignContent();
  heavy(h,'Club Pulse',family==='small'?11:13,th.title);
  h.addSpacer();let p=h.addStack();p.setPadding(2,6,2,6);p.cornerRadius=8;p.backgroundColor=C('#4A1717',.95);p.borderWidth=.7;p.borderColor=C('#FF8E87',.68);text(p,'通信エラー',family==='small'?6.5:7,true,1,'#FFB0AA');
  w.addSpacer(family==='small'?8:10);
  let main=heavy(w,'保存データがありません',family==='small'?10:13,th.title);main.centerAlignText();
  w.addSpacer(5);let sub=text(w,'次回更新で自動再試行します',family==='small'?7:8,false,.78,'#D7D3CC');sub.centerAlignText();
  w.refreshAfterDate=new Date(Date.now()+5*60*1000);return w
};
