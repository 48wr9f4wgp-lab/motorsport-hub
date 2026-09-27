// Motorsport Hub Personal Race Day Cockpit v1
// Local-cache-only owner dashboard. No external network requests.
(async()=>{
const fm=FileManager.local(),DOC=fm.documentsDirectory();
const CONFIG_PATH=fm.joinPath(DOC,'motorsport-personal-config-v1.json');
const DEFAULT={
  schemaVersion:1,
  categories:['F1','WEC','WRC','SUPERGT','MOTOGP','FDJ','D1GP','SUPERFORMULA','INDYCAR','NASCAR','GTWCEU','DAKAR'],
  horizonDays:14,
  showViewing:true,
  showLeader:true,
  showCacheAge:true
};
const META={
 F1:{label:'F1',cache:'motorsport-data-v1000-f1.json',accent:'#E10600'},
 WEC:{label:'WEC',cache:'motorsport-data-v1000-wec.json',accent:'#36C2FF'},
 WRC:{label:'WRC',cache:'motorsport-data-v1000-wrc.json',accent:'#3B82F6'},
 SUPERGT:{label:'SUPER GT',cache:'motorsport-data-v1000-supergt.json',accent:'#F5B942'},
 MOTOGP:{label:'MotoGP',cache:'motorsport-data-v1000-motogp.json',accent:'#E64646'},
 FDJ:{label:'FDJ',cache:'motorsport-data-v1000-fdj.json',accent:'#A855F7'},
 D1GP:{label:'D1GP',cache:'motorsport-data-v1000-d1gp.json',accent:'#F97316'},
 SUPERFORMULA:{label:'SF',cache:'motorsport-data-v900-superformula.json',accent:'#22C55E'},
 INDYCAR:{label:'INDYCAR',cache:'motorsport-data-v910-indycar.json',accent:'#14B8A6'},
 NASCAR:{label:'NASCAR',cache:'motorsport-data-v920-nascar.json',accent:'#FACC15'},
 GTWCEU:{label:'GTWC EU',cache:'motorsport-data-v930-gtwceu.json',accent:'#06B6D4'},
 DAKAR:{label:'DAKAR',cache:'motorsport-data-v950-dakar.json',accent:'#D97706'}
};
const C={bg:'#06080B',panel:'#10151C',text:'#F7F9FB',muted:'#B9C2CC',dim:'#7D8996',good:'#58DA8A',warn:'#FFB84D'};
const col=(h,a=1)=>new Color(h,a);
const norm=v=>String(v||'').trim().toUpperCase().replace(/[\s_-]+/g,'');
function configData(){
  try{
    if(fm.fileExists(CONFIG_PATH)){
      const x=JSON.parse(fm.readString(CONFIG_PATH));
      const seen=new Set(),cats=[];
      for(const raw of Array.isArray(x?.categories)?x.categories:[]){const k=norm(raw);if(META[k]&&!seen.has(k)){seen.add(k);cats.push(k)}}
      return{
        ...DEFAULT,...x,
        categories:cats.length?cats:[...DEFAULT.categories],
        horizonDays:Math.max(1,Math.min(365,Number(x?.horizonDays)||DEFAULT.horizonDays)),
        showViewing:x?.showViewing!==false,
        showLeader:x?.showLeader!==false,
        showCacheAge:x?.showCacheAge!==false
      }
    }
  }catch(_){}
  return{...DEFAULT};
}
function latestViewing(){
  try{
    const names=fm.listContents(DOC).filter(x=>/^motorsport-viewing-jp-.*\.json$/i.test(x));
    names.sort((a,b)=>{
      try{return Number(fm.modificationDate(fm.joinPath(DOC,b))) - Number(fm.modificationDate(fm.joinPath(DOC,a)))}catch(_){return 0}
    });
    for(const n of names){
      try{
        const m=JSON.parse(fm.readString(fm.joinPath(DOC,n)));
        if(m&&m.region==='JP'&&m.categories)return m;
      }catch(_){}
    }
  }catch(_){}
  return null;
}
function readEvent(k,priority){
  const meta=META[k],p=fm.joinPath(DOC,meta.cache);
  try{
    if(!fm.fileExists(p))return null;
    const payload=JSON.parse(fm.readString(p)),d=payload?.data||{},e=payload?.event||{};
    const startRaw=d.start||d.date||e.start||e.date||'';
    const endRaw=d.end||e.end||'';
    const start=Date.parse(startRaw),end=Date.parse(endRaw);
    const lifecycle=String(d.lifecycle||e.lifecycle||'').toUpperCase();
    const seasonEnded=!!(d.seasonEnded??e.seasonEnded)||lifecycle==='SEASON_ENDED';
    const name=String(d.race||d.stage||e.race||e.stage||'').trim();
    if(!name)return null;
    const location=String(d.circuit||d.route||e.circuit||e.route||'').trim();
    const ranking=Array.isArray(d.ranking)?d.ranking:Array.isArray(payload?.ranking)?payload.ranking:[];
    return{
      key:k,label:meta.label,accent:meta.accent,priority,
      name,location,start:Number.isFinite(start)?start:null,end:Number.isFinite(end)?end:null,
      timeTbd:!!(d.timeTbd??e.timeTbd),lifecycle,seasonEnded,
      leader:String(ranking?.[0]?.name||'').trim(),
      fetchedAt:Number(payload?.fetchedAt)||0,
      season:Number(payload?.season)||null
    };
  }catch(_){return null}
}
function tokyoDay(ts){return Math.floor((Number(ts)+9*3600000)/86400000)}
function status(e){
  if(e.lifecycle==='ACTIVE')return{label:'開催中',live:true};
  if(e.start==null)return{label:'日程未取得',live:false};
  const now=Date.now(),q=e.start-now;
  if(e.end&&now>=e.start&&now<e.end)return{label:'開催中',live:true};
  if(q<=0)return{label:'更新待ち',live:false};
  const d=tokyoDay(e.start)-tokyoDay(now);
  if(d===0)return{label:'今日',live:false};
  if(d===1)return{label:'明日',live:false};
  if(q<24*3600000)return{label:`あと${Math.ceil(q/3600000)}時間`,live:false};
  return{label:`あと${d}日`,live:false};
}
function dateLabel(e){
  if(e.start==null)return'日程未取得';
  const f=new DateFormatter();f.locale='ja_JP';f.timeZone='Asia/Tokyo';f.dateFormat=e.timeTbd?'M/d(E)':'M/d(E) HH:mm';
  return f.string(new Date(e.start))+(e.timeTbd?' 時刻未定':'');
}
function ageLabel(ts){
  if(!ts)return'';
  const m=Math.max(0,Math.floor((Date.now()-ts)/60000));
  if(m<2)return'更新 いま';
  if(m<60)return`更新 ${m}m`;
  const h=Math.floor(m/60);if(h<24)return`更新 ${h}h`;
  return`更新 ${Math.floor(h/24)}d`;
}
function viewingLabel(manifest,k){
  const x=manifest?.categories?.[k];
  if(!x||x.status!=='VERIFIED'||!String(x.label||'').trim())return'';
  const until=Date.parse(x.validUntil||'');if(Number.isFinite(until)&&Date.now()>until)return'';
  return String(x.label).trim();
}
function rows(cfg){
  const view=latestViewing(),events=[];
  cfg.categories.forEach((k,i)=>{const e=readEvent(k,i);if(e&&!e.seasonEnded){e.viewing=viewingLabel(view,k);events.push(e)}});
  events.sort((a,b)=>{
    const al=status(a).live?0:1,bl=status(b).live?0:1;if(al!==bl)return al-bl;
    const at=a.start??Number.MAX_SAFE_INTEGER,bt=b.start??Number.MAX_SAFE_INTEGER;if(at!==bt)return at-bt;
    return a.priority-b.priority;
  });
  const limit=Date.now()+cfg.horizonDays*86400000;
  const scoped=events.filter(e=>status(e).live||e.start==null||e.start<=limit);
  return scoped.length?scoped:events;
}
function T(st,s,z,c,w='regular',n=1){
  const t=st.addText(String(s??''));
  t.font=w==='heavy'?Font.heavySystemFont(z):w==='bold'?Font.boldSystemFont(z):w==='semibold'?Font.semiboldSystemFont(z):Font.systemFont(z);
  t.textColor=c;t.lineLimit=n;t.minimumScaleFactor=.62;return t;
}
function base(){
  const w=new ListWidget(),g=new LinearGradient();
  g.colors=[col('#0B1118'),col(C.bg)];g.locations=[0,1];w.backgroundGradient=g;return w;
}
function pill(st,e,z=8){
  const p=st.addStack();p.backgroundColor=col(e.accent,.20);p.cornerRadius=7;p.setPadding(2,6,2,6);T(p,e.label,z,col(e.accent),'heavy');return p;
}
function addEventRow(w,e,cfg,fam){
  const st=status(e),panel=w.addStack();panel.layoutVertically();panel.backgroundColor=col(C.panel,.72);panel.cornerRadius=fam==='large'?11:9;panel.setPadding(fam==='large'?6:4,7,fam==='large'?6:4,7);
  const top=panel.addStack();top.layoutHorizontally();top.centerAlignContent();pill(top,e,fam==='large'?8.2:7.3);top.addSpacer(6);T(top,e.name,fam==='large'?11.2:9.4,col(C.text),'semibold',1);top.addSpacer();T(top,st.label,fam==='large'?8.4:7.4,st.live?col(C.good):col(C.muted),st.live?'heavy':'bold',1);
  panel.addSpacer(2);
  const sub=panel.addStack();sub.layoutHorizontally();sub.centerAlignContent();T(sub,dateLabel(e),fam==='large'?8.4:7.4,col(C.muted),'semibold',1);
  if(e.location){sub.addSpacer(5);T(sub,`· ${e.location}`,fam==='large'?7.8:7,col(C.dim),'regular',1)}
  sub.addSpacer();
  const rhs=[];
  if(cfg.showViewing&&e.viewing)rhs.push(`視聴 ${e.viewing}`);
  if(cfg.showLeader&&e.leader)rhs.push(`1位 ${e.leader}`);
  if(cfg.showCacheAge){const a=ageLabel(e.fetchedAt);if(a)rhs.push(a)}
  if(rhs.length)T(sub,rhs.join('  ·  '),fam==='large'?7.5:6.6,col(C.dim),'semibold',1);
}
function emptyWidget(fam){
  const w=base();w.setPadding(12,12,12,12);T(w,'MY RACE DAY',fam==='small'?12:14,col(C.text),'heavy');w.addSpacer(7);T(w,'カテゴリcacheがまだありません',fam==='small'?10:12,col(C.muted),'semibold',2);w.addSpacer(3);T(w,'既存Motorsport Hubを一度実行すると表示されます',8,col(C.dim),'regular',3);return w;
}
function renderSmall(events,cfg){
  if(!events.length)return emptyWidget('small');
  const e=events[0],w=base(),st=status(e);w.setPadding(10,11,9,11);
  const top=w.addStack();top.layoutHorizontally();top.centerAlignContent();T(top,'MY RACE DAY',9,col(C.muted),'heavy');top.addSpacer();pill(top,e,7.4);
  w.addSpacer(8);T(w,e.name,17,col(C.text),'heavy',2);w.addSpacer(3);T(w,dateLabel(e),9.6,col(C.muted),'semibold',1);
  if(e.location){w.addSpacer(2);T(w,e.location,8.2,col(C.dim),'regular',1)}
  w.addSpacer();
  const foot=w.addStack();T(foot,st.label,10.8,st.live?col(C.good):col(C.text),'heavy');foot.addSpacer();
  if(cfg.showViewing&&e.viewing)T(foot,`視聴 ${e.viewing}`,7.2,col(C.muted),'semibold',1);
  return w;
}
function renderMedium(events,cfg){
  if(!events.length)return emptyWidget('medium');
  const w=base();w.setPadding(9,10,8,10);const h=w.addStack();h.layoutHorizontally();T(h,'MY RACE DAY',11,col(C.text),'heavy');h.addSpacer();T(h,`${Math.min(events.length,3)} / ${events.length}`,7.4,col(C.dim),'bold');w.addSpacer(4);
  events.slice(0,3).forEach((e,i)=>{addEventRow(w,e,cfg,'medium');if(i<Math.min(events.length,3)-1)w.addSpacer(3)});
  return w;
}
function renderLarge(events,cfg){
  if(!events.length)return emptyWidget('large');
  const w=base();w.setPadding(12,12,11,12);const h=w.addStack();h.layoutHorizontally();T(h,'MY RACE DAY',14,col(C.text),'heavy');h.addSpacer(7);T(h,`NEXT ${cfg.horizonDays} DAYS`,7.8,col(C.dim),'bold');h.addSpacer();T(h,`${events.length} EVENTS`,7.8,col(C.muted),'bold');w.addSpacer(6);
  events.slice(0,6).forEach((e,i)=>{addEventRow(w,e,cfg,'large');if(i<Math.min(events.length,6)-1)w.addSpacer(4)});
  return w;
}
const cfg=configData(),events=rows(cfg),fam=String(config.widgetFamily||'medium');
let w=fam==='small'?renderSmall(events,cfg):fam==='large'?renderLarge(events,cfg):renderMedium(events,cfg);
w.refreshAfterDate=new Date(Date.now()+15*60000);
if(config.runsInWidget)Script.setWidget(w);else if(fam==='small')await w.presentSmall();else if(fam==='large')await w.presentLarge();else await w.presentMedium();
Script.complete();
})();