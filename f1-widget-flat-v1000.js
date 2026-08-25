// Motorsport Hub v10.0.0-hardening — flattened F1 pilot module
// Candidate replacement for the legacy wrapper waterfall. No runtime source rewriting.
(async()=>{
const V='10.0.0-hardening',K='f1',SEASON=2026,CACHE_SCHEMA=1,CACHE_MAX_AGE=72*3600000;
const SCHEDULE_SOURCE='https://api.jolpi.ca/ergast/f1/2026.json?limit=100';
const STANDINGS_SOURCE='https://api.jolpi.ca/ergast/f1/2026/driverstandings.json';
const CACHE_SOURCE='jolpi:f1-2026-schedule+standings';
const S={label:'F1',accent:'#E10600',rank:'ドライバー',url:'https://www.formula1.com/'};
const C={bg:'#06080B',text:'#F7F9FB',muted:'#B9C2CC',dim:'#8D98A4',good:'#58DA8A',warn:'#FFB84D'};
const fm=FileManager.local(),DOC=fm.documentsDirectory(),CACHE=fm.joinPath(DOC,'motorsport-data-v1000-f1.json');

const SNAP={race:'Italian Grand Prix',start:'2026-09-06T13:00:00Z',end:'2026-09-06T17:00:00Z',circuit:'Autodromo Nazionale Monza',seasonEnded:false,lifecycle:'UPCOMING',ranking:[
 {pos:1,name:'Andrea Kimi Antonelli',points:'242 pts',maker:'MERCEDES',team:'Mercedes',machine:'W17'},
 {pos:2,name:'George Russell',points:'183 pts',maker:'MERCEDES',team:'Mercedes',machine:'W17'},
 {pos:3,name:'Lewis Hamilton',points:'183 pts',maker:'FERRARI',team:'Ferrari',machine:'SF-26'}
]};
const FINAL_EVENT={race:'Abu Dhabi Grand Prix',start:'2026-12-06T13:00:00Z',end:'2026-12-06T17:00:00Z',circuit:'Yas Marina Circuit',seasonEnded:true,lifecycle:'SEASON_ENDED'};

const HERO={
 MERCEDES:{urls:[
  'https://commons.wikimedia.org/wiki/Special:Redirect/file/Andrea_Kimi_Antonelli_2025_Italian_Grand_Prix_FP3.jpg?width=2048',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/2025_Japan_GP_-_Mercedes_-_W16_-_Thursday.jpg/960px-2025_Japan_GP_-_Mercedes_-_W16_-_Thursday.jpg'
 ],focus:.46,shift:82},
 FERRARI:{urls:['https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/2025_Japan_GP_-_Ferrari_-_SF-25_-_Thursday.jpg/960px-2025_Japan_GP_-_Ferrari_-_SF-25_-_Thursday.jpg'],focus:.56,shift:30},
 MCLAREN:{urls:['https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/2025_Japan_GP_-_McLaren_-_MCL39_-_Thursday.jpg/960px-2025_Japan_GP_-_McLaren_-_MCL39_-_Thursday.jpg'],focus:.56,shift:30}
};

const col=(h,a=1)=>new Color(h,a),clone=o=>JSON.parse(JSON.stringify(o));
async function json(url){const r=new Request(url);r.timeoutInterval=9;r.headers={'User-Agent':'MotorsportHub/10.0-hardening','Cache-Control':'no-cache'};return await r.loadJSON()}
function validRanking(a){return Array.isArray(a)&&a.length>=3&&a.slice(0,5).every(r=>r&&Number(r.pos)>=1&&String(r.name||'').trim()&&Number.isFinite(Number(String(r.points||'').replace(/[^0-9.-]/g,''))))}
function validData(d){return !!d&&typeof d==='object'&&validRanking(d.ranking)&&String(d.race||'').trim()&&String(d.circuit||'').trim()&&Number.isFinite(Date.parse(d.start))&&Number.isFinite(Date.parse(d.end))&&['UPCOMING','ACTIVE','SEASON_ENDED'].includes(d.lifecycle)}
function removeCache(){try{if(fm.fileExists(CACHE))fm.remove(CACHE)}catch(_){} }
function save(d){try{if(!validData(d))return;fm.writeString(CACHE,JSON.stringify({schemaVersion:CACHE_SCHEMA,category:K,season:SEASON,fetchedAt:Date.now(),source:CACHE_SOURCE,ranking:d.ranking,event:{race:d.race,start:d.start,end:d.end,circuit:d.circuit,seasonEnded:!!d.seasonEnded,lifecycle:d.lifecycle},data:d}))}catch(_){} }
function cache(){try{if(!fm.fileExists(CACHE))return null;const p=JSON.parse(fm.readString(CACHE)),age=Date.now()-Number(p?.fetchedAt);if(p?.schemaVersion!==CACHE_SCHEMA||p?.category!==K||Number(p?.season)!==SEASON||p?.source!==CACHE_SOURCE||!Number.isFinite(age)||age<0||age>CACHE_MAX_AGE||!validRanking(p?.ranking)||!p?.event||!validData(p?.data)){removeCache();return null}return p.data}catch(_){removeCache();return null}}
function lifecycleEvent(races,now=Date.now()){
 const xs=(races||[]).map(x=>({...x,t:Date.parse(String(x.date)+'T'+String(x.time||'12:00:00Z'))})).filter(x=>Number.isFinite(x.t)).sort((a,b)=>a.t-b.t);
 for(const r of xs){const end=r.t+4*3600000;if(now<end)return{race:r.raceName,start:new Date(r.t).toISOString(),end:new Date(end).toISOString(),circuit:r.Circuit?.circuitName||'',seasonEnded:false,lifecycle:now>=r.t?'ACTIVE':'UPCOMING'}}
 if(xs.length){const r=xs[xs.length-1],end=r.t+4*3600000;return{race:r.raceName,start:new Date(r.t).toISOString(),end:new Date(end).toISOString(),circuit:r.Circuit?.circuitName||'',seasonEnded:true,lifecycle:'SEASON_ENDED'}}
 return null
}
function fallbackEvent(d){if(Date.now()>=Date.parse(FINAL_EVENT.end))return{...d,...FINAL_EVENT};const s=Date.parse(d.start),e=Date.parse(d.end);return{...d,seasonEnded:false,lifecycle:Date.now()>=s&&Date.now()<e?'ACTIVE':'UPCOMING'}}
async function update(base){
 const [schedule,standings]=await Promise.all([json(SCHEDULE_SOURCE),json(STANDINGS_SOURCE)]);
 const event=lifecycleEvent(schedule?.MRData?.RaceTable?.Races||[]);if(!event)throw Error('F1_SCHEDULE');
 const rows=standings?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings||[];if(rows.length<3)throw Error('F1_STANDINGS');
 const ranking=rows.slice(0,5).map((x,i)=>({pos:+x.position||i+1,name:String((x.Driver?.givenName||'')+' '+(x.Driver?.familyName||'')).trim(),points:String(x.points||0)+' pts',maker:String(x.Constructors?.[0]?.name||'').toUpperCase(),team:x.Constructors?.[0]?.name||'',machine:''}));
 const d={...base,...event,ranking};if(!validData(d))throw Error('F1_DATA');return d
}
async function load(){const base=fallbackEvent(clone(SNAP));try{const d=await update(base);save(d);return{d,cached:false}}catch(_){const c=cache();return{d:fallbackEvent(c||base),cached:true}}}

function smooth(t){return t*t*(3-2*t)}
function cover(img,W,H,focus=.5,shift=0){const iw=img.size.width||1,ih=img.size.height||1,s=Math.max(W/iw,H/ih),dw=iw*s,dh=ih*s;return new Rect(-(dw-W)*focus+shift,-(dh-H)*.5,dw,dh)}
async function hero(d){
 const small=(config.widgetFamily||'medium')==='small',maker=String(d?.ranking?.[0]?.maker||'MERCEDES').toUpperCase(),h=HERO[maker]||HERO.MERCEDES;
 const p=fm.joinPath(DOC,`motorsport-hero-v1000-${small?'small':'medium'}-f1-${maker.toLowerCase()}.jpg`);if(fm.fileExists(p)){try{return fm.readImage(p)}catch(_){} }
 try{let img=null;for(const u of h.urls){try{const r=new Request(u);r.timeoutInterval=10;r.headers={'User-Agent':'Mozilla/5.0','Cache-Control':'no-cache'};img=await r.loadImage();if(img)break}catch(_){}}if(!img)return null;
  const W=small?720:1380,H=small?720:640,ctx=new DrawContext();ctx.size=new Size(W,H);ctx.opaque=true;ctx.respectScreenScale=false;ctx.setFillColor(col(C.bg));ctx.fillRect(new Rect(0,0,W,H));ctx.drawImageInRect(img,cover(img,W,H,h.focus,small?h.shift*.4:h.shift));ctx.setFillColor(col('#030609',.10));ctx.fillRect(new Rect(0,0,W,H));
  for(let x=0;x<W;x+=3){const t=x/(W-1),a=.86*(1-smooth(t))+.07;ctx.setFillColor(col('#030609',a));ctx.fillRect(new Rect(x,0,4,H))}
  const rs=W*.76;for(let x=rs;x<W;x+=3){const t=(x-rs)/(W-rs),a=.08+.40*smooth(t);ctx.setFillColor(col('#020407',a));ctx.fillRect(new Rect(x,0,4,H))}
  const bs=H*.67,bh=H-bs;for(let i=0;i<56;i++){const y=bs+i*(bh/56),t=i/55,a=.015+.22*t*t;ctx.setFillColor(col('#020407',a));ctx.fillRect(new Rect(0,y,W,bh/56+1))}
  ctx.setFillColor(col(S.accent,.92));ctx.fillRect(new Rect(0,0,W,5));const out=ctx.getImage();try{fm.writeImage(p,out)}catch(_){}return out
 }catch(_){return null}
}
function T(st,s,z,c,w='regular',n=1){const t=st.addText(String(s??''));t.font=w==='heavy'?Font.heavySystemFont(z):w==='bold'?Font.boldSystemFont(z):w==='semibold'?Font.semiboldSystemFont(z):Font.systemFont(z);t.textColor=c;t.lineLimit=n;t.minimumScaleFactor=.66;return t}
function base(bg){const w=new ListWidget();if(bg)w.backgroundImage=bg;else{const g=new LinearGradient();g.colors=[col(S.accent,.16),col(C.bg)];g.locations=[0,1];w.backgroundGradient=g}w.url=S.url;return w}
function pill(st,label,accent=false){const p=st.addStack();p.backgroundColor=accent?col(S.accent,.20):col('#000000',.48);p.cornerRadius=8;p.setPadding(3,7,3,7);T(p,label,9.5,accent?col(S.accent):col(C.muted),'heavy');return p}
function dateText(d){const f=new DateFormatter();f.locale='ja_JP';f.timeZone='Asia/Tokyo';f.dateFormat='M/d(E) HH:mm';return f.string(new Date(d.start))}
function raceName(s){if(/Italian Grand Prix/i.test(s))return'イタリアGP';if(/Abu Dhabi Grand Prix/i.test(s))return'アブダビGP';return String(s||'').replace(/Grand Prix/ig,'GP')}
function circuitName(s){if(/Monza/i.test(s))return'Monza';if(/Yas Marina/i.test(s))return'Yas Marina';return s||''}
function countdown(d){if(d.lifecycle==='SEASON_ENDED'||d.seasonEnded)return{label:'SEASON END',live:false};const now=Date.now(),s=Date.parse(d.start),e=Date.parse(d.end);if(now>=s&&now<e)return{label:'開催中',live:true};const q=s-now;if(q<=0)return{label:'終了',live:false};const h=q/3600000;if(h<1)return{label:`あと${Math.ceil(q/60000)}分`,live:false};if(h<24)return{label:`あと${Math.ceil(h)}時間`,live:false};return{label:`あと${Math.ceil(h/24)}日`,live:false}}
function sub(r){return [r.machine||'',r.team||''].filter(Boolean).join('  ｜  ')||r.maker||'F1'}
function medium(d,cached,bg){const w=base(bg),ci=countdown(d);w.setPadding(9,12,8,12);const top=w.addStack();top.layoutHorizontally();top.centerAlignContent();pill(top,'F1',true);top.addSpacer(6);T(top,d.lifecycle==='SEASON_ENDED'?'シーズン終了':'次戦',8,col(C.dim),'bold');top.addSpacer();if(cached)T(top,'• 更新待ち',6.8,col(C.warn,.80),'semibold');w.addSpacer(3);T(w,raceName(d.race),20.6,col(C.text),'heavy',1);w.addSpacer(1);const info=w.addStack();info.layoutHorizontally();info.centerAlignContent();T(info,dateText(d),10.7,col(C.muted),'semibold');info.addSpacer(5);T(info,`｜ ${circuitName(d.circuit)}`,9.6,col(C.dim),'semibold',1);info.addSpacer();const cp=info.addStack();cp.backgroundColor=ci.live?col(C.good,.28):col('#000000',.50);cp.cornerRadius=9;cp.setPadding(3,7,3,7);T(cp,ci.label,16.2,ci.live?col(C.good):col(C.text),'heavy');w.addSpacer(5);const hh=w.addStack();T(hh,S.rank,8.2,col(C.muted),'bold');hh.addSpacer();const ph=hh.addStack();ph.size=new Size(42,0);const pt=T(ph,'PTS',7.4,col(C.text,.96),'bold');pt.rightAlignText();w.addSpacer(2);for(const r of (d.ranking||[]).slice(0,3)){const row=w.addStack();row.layoutHorizontally();row.centerAlignContent();const ps=row.addStack();ps.size=new Size(18,0);T(ps,r.pos,11.4,col(S.accent),'heavy');row.addSpacer(4);T(row,r.name,13.0,col(C.text),'semibold');row.addSpacer();const pts=row.addStack();pts.size=new Size(42,0);pts.backgroundColor=col('#000000',.48);pts.cornerRadius=7;pts.setPadding(1,4,1,4);const p=T(pts,String(r.points).replace(' pts',''),10.7,col(C.text,1),'heavy');p.rightAlignText();const sr=w.addStack();sr.addSpacer(22);T(sr,sub(r),8.5,col(C.dim),'semibold');w.addSpacer(1)}w.refreshAfterDate=new Date(Date.now()+15*60000);return w}
function small(d,cached,bg){const w=base(bg),ci=countdown(d);w.setPadding(10,11,9,11);const top=w.addStack();top.layoutHorizontally();top.centerAlignContent();pill(top,'F1',true);top.addSpacer(4);T(top,d.lifecycle==='SEASON_ENDED'?'終了':'次戦',7.2,col(C.dim),'semibold');top.addSpacer();const cp=top.addStack();cp.backgroundColor=ci.live?col(C.good,.30):col('#000000',.50);cp.cornerRadius=8;cp.setPadding(2,6,2,6);T(cp,ci.label,11.8,ci.live?col(C.good):col(C.text),'heavy');w.addSpacer(7);T(w,raceName(d.race),18.5,col(C.text),'heavy',2);w.addSpacer(3);T(w,dateText(d),9.8,col(C.muted),'semibold',1);w.addSpacer();const foot=w.addStack();const loc=foot.addStack();loc.backgroundColor=col('#000000',.48);loc.cornerRadius=7;loc.setPadding(2,5,2,5);T(loc,circuitName(d.circuit),8.2,col(C.muted),'semibold',1);foot.addSpacer();if(cached)T(foot,'•',6.6,col(C.warn,.70),'semibold');w.refreshAfterDate=new Date(Date.now()+15*60000);return w}

let w;try{const x=await load(),bg=await hero(x.d);w=(config.widgetFamily||'medium')==='small'?small(x.d,x.cached,bg):medium(x.d,x.cached,bg)}catch(_){w=base(null);w.setPadding(12,12,12,12);pill(w,'F1',true);w.addSpacer(8);T(w,'データ取得失敗',18,col(C.text),'heavy');w.addSpacer(3);T(w,'通信回復後に再取得します',9.5,col(C.warn),'semibold')}
if(config.runsInWidget)Script.setWidget(w);else if((config.widgetFamily||'medium')==='small')await w.presentSmall();else await w.presentMedium();Script.complete();
})();
