// Motorsport Hub v9.2.1-hardening — NASCAR Cup Series module
// MH_LIFECYCLE_BAKED=1
// Official NASCAR public CDN points feed + 2026 Cup schedule. Visual output remains v9.2.0-compatible.
(async()=>{
const V='9.2.1-hardening',K='nascar',SEASON=2026,CACHE_SCHEMA=1,CACHE_MAX_AGE=7*86400000;
const DATA_SOURCE='https://cf.nascar.com/cacher/2026/1/points-feed.json';
const S={label:'NASCAR',accent:'#FFD23F',url:'https://www.nascar.com/'};
const C={bg:'#06080B',text:'#F7F9FB',muted:'#B9C2CC',dim:'#8D98A4',good:'#58DA8A',warn:'#FFB84D'};
const fm=FileManager.local(),DOC=fm.documentsDirectory(),CACHE=fm.joinPath(DOC,'motorsport-data-v920-nascar.json');

const SNAP={race:'Daytona',start:'2026-08-29T19:30:00-04:00',end:'2026-08-30T01:30:00-04:00',circuit:'Daytona International Speedway',ranking:[
 {pos:1,no:'11',name:'Denny Hamlin',points:'1001 pts',team:'Joe Gibbs Racing',maker:'TOYOTA'},
 {pos:2,no:'12',name:'Ryan Blaney',points:'924 pts',team:'Team Penske',maker:'FORD'},
 {pos:3,no:'54',name:'Ty Gibbs',points:'880 pts',team:'Joe Gibbs Racing',maker:'TOYOTA'}
]};

const CAL=[
 {race:'Daytona',start:'2026-08-29T19:30:00-04:00',end:'2026-08-30T01:30:00-04:00',circuit:'Daytona International Speedway'},
 {race:'Darlington',start:'2026-09-06T17:00:00-04:00',end:'2026-09-06T23:00:00-04:00',circuit:'Darlington Raceway'},
 {race:'Gateway',start:'2026-09-13T15:00:00-04:00',end:'2026-09-13T21:00:00-04:00',circuit:'World Wide Technology Raceway'},
 {race:'Bristol',start:'2026-09-19T19:30:00-04:00',end:'2026-09-20T01:30:00-04:00',circuit:'Bristol Motor Speedway'},
 {race:'Kansas',start:'2026-09-27T15:00:00-04:00',end:'2026-09-27T21:00:00-04:00',circuit:'Kansas Speedway'},
 {race:'Las Vegas',start:'2026-10-04T17:30:00-04:00',end:'2026-10-04T23:30:00-04:00',circuit:'Las Vegas Motor Speedway'},
 {race:'Charlotte Roval',start:'2026-10-11T15:00:00-04:00',end:'2026-10-11T21:00:00-04:00',circuit:'Charlotte Motor Speedway Roval'},
 {race:'Phoenix',start:'2026-10-18T15:00:00-04:00',end:'2026-10-18T21:00:00-04:00',circuit:'Phoenix Raceway'},
 {race:'Talladega',start:'2026-10-25T14:00:00-04:00',end:'2026-10-25T20:00:00-04:00',circuit:'Talladega Superspeedway'},
 {race:'Martinsville',start:'2026-11-01T14:00:00-05:00',end:'2026-11-01T20:00:00-05:00',circuit:'Martinsville Speedway'},
 {race:'Championship',start:'2026-11-08T15:00:00-05:00',end:'2026-11-08T21:00:00-05:00',circuit:'Homestead-Miami Speedway'}
];

const TEAM={
 '11':'Joe Gibbs Racing','12':'Team Penske','54':'Joe Gibbs Racing','45':'23XI Racing','20':'Joe Gibbs Racing','19':'Joe Gibbs Racing','5':'Hendrick Motorsports','9':'Hendrick Motorsports','22':'Team Penske','17':'RFK Racing','77':'Spire Motorsports','24':'Hendrick Motorsports','23':'23XI Racing','2':'Team Penske','6':'RFK Racing','60':'RFK Racing'
};

// Exact Commons page verified: TaurusEmerald / CC BY-SA 4.0.
const HERO_URLS=[
 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Denny%20Hamlin%2011%20Las%20Vegas%202025.jpg?width=2048',
 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Denny%20Hamlin%2011%20Las%20Vegas%202025.jpg?width=1280'
];

const col=(h,a=1)=>new Color(h,a),clone=o=>JSON.parse(JSON.stringify(o));
async function json(url){const r=new Request(url);r.timeoutInterval=10;r.headers={'User-Agent':'Mozilla/5.0 MotorsportHub/9.2','Cache-Control':'no-cache'};return await r.loadJSON()}
function nextEvent(d){const now=Date.now();for(const e of CAL){const s=Date.parse(e.start),end=Date.parse(e.end);if(now<end)return{...d,...e,seasonEnded:false,lifecycle:now>=s?'ACTIVE':'UPCOMING'}}const last=CAL[CAL.length-1];return{...d,...last,seasonEnded:true,lifecycle:'SEASON_ENDED'}}
function validRanking(a){return Array.isArray(a)&&a.length>=3&&a.slice(0,5).every(r=>r&&Number(r.pos)>=1&&String(r.name||'').trim()&&Number.isFinite(Number(String(r.points||'').replace(/[^0-9.-]/g,''))))}
function validData(d){return !!d&&typeof d==='object'&&validRanking(d.ranking)&&String(d.race||'').trim()&&String(d.circuit||'').trim()&&Number.isFinite(Date.parse(d.start))&&Number.isFinite(Date.parse(d.end))}
function removeCache(){try{if(fm.fileExists(CACHE))fm.remove(CACHE)}catch(_){} }
function save(d){try{if(!validData(d))return;const payload={schemaVersion:CACHE_SCHEMA,category:K,season:SEASON,fetchedAt:Date.now(),source:DATA_SOURCE,ranking:d.ranking,event:{race:d.race,start:d.start,end:d.end,circuit:d.circuit,seasonEnded:!!d.seasonEnded},data:d};fm.writeString(CACHE,JSON.stringify(payload))}catch(_){} }
function cache(){try{if(!fm.fileExists(CACHE))return null;const p=JSON.parse(fm.readString(CACHE)),age=Date.now()-Number(p?.fetchedAt);if(p?.schemaVersion!==CACHE_SCHEMA||p?.category!==K||Number(p?.season)!==SEASON||p?.source!==DATA_SOURCE||!Number.isFinite(age)||age<0||age>CACHE_MAX_AGE||!validRanking(p?.ranking)||!p?.event||!validData(p?.data)){removeCache();return null}return p.data}catch(_){removeCache();return null}}
async function update(d){
 const j=await json(DATA_SOURCE);
 if(!Array.isArray(j)||j.length<3)throw Error('NASCAR points');
 const a=j.filter(x=>Number(x?.position)>=1&&Number(x?.position)<=50&&x?.driver_name&&Number.isFinite(Number(x?.points))).sort((x,y)=>Number(x.position)-Number(y.position)).slice(0,5).map(x=>({
  pos:Number(x.position),no:String(x.car_no||''),name:String(x.driver_name||'').trim(),points:`${Number(x.points)} pts`,team:TEAM[String(x.car_no||'')]||'NASCAR Cup',maker:String(x.manufacturer||'').toUpperCase()
 }));
 if(a.length<3)throw Error('NASCAR standings');d.ranking=a;return nextEvent(d)
}
async function load(){const base=nextEvent(clone(SNAP));try{const d=await update(base);save(d);return{d,cached:false}}catch(e){const c=cache();return{d:nextEvent(c||base),cached:true}}}
function smooth(t){return t*t*(3-2*t)}
function cover(img,W,H,focus=.54,shift=0){const iw=img.size.width||1,ih=img.size.height||1,s=Math.max(W/iw,H/ih),dw=iw*s,dh=ih*s;return new Rect(-(dw-W)*focus+shift,-(dh-H)*.5,dw,dh)}
async function hero(){
 const __mhDynamicHero=globalThis.__MH_HERO_OVERRIDE_IMAGE;if(__mhDynamicHero)return __mhDynamicHero;
 const small=(config.widgetFamily||'medium')==='small',p=fm.joinPath(DOC,`motorsport-hero-v920-${small?'small':'medium'}-nascar.jpg`);
 if(fm.fileExists(p)){try{return fm.readImage(p)}catch(_){} }
 try{let img=null;for(const u of HERO_URLS){try{const r=new Request(`${u}&v=920`);r.timeoutInterval=12;r.headers={'User-Agent':'Mozilla/5.0','Cache-Control':'no-cache'};img=await r.loadImage();if(img)break}catch(_){}}if(!img)return null;
  const W=small?720:1380,H=small?720:640,ctx=new DrawContext();ctx.size=new Size(W,H);ctx.opaque=true;ctx.respectScreenScale=false;ctx.setFillColor(col(C.bg));ctx.fillRect(new Rect(0,0,W,H));ctx.drawImageInRect(img,cover(img,W,H,.51,small?10:48));ctx.setFillColor(col('#030609',.09));ctx.fillRect(new Rect(0,0,W,H));
  for(let x=0;x<W;x+=3){const t=x/(W-1),a=.82*(1-smooth(t))+.055;ctx.setFillColor(col('#030609',a));ctx.fillRect(new Rect(x,0,4,H))}
  const rs=W*.76;for(let x=rs;x<W;x+=3){const t=(x-rs)/(W-rs),a=.08+.40*smooth(t);ctx.setFillColor(col('#020407',a));ctx.fillRect(new Rect(x,0,4,H))}
  const bs=H*.67,bh=H-bs;for(let i=0;i<56;i++){const y=bs+i*(bh/56),t=i/55,a=.015+.22*t*t;ctx.setFillColor(col('#020407',a));ctx.fillRect(new Rect(0,y,W,bh/56+1))}
  ctx.setFillColor(col(S.accent,.92));ctx.fillRect(new Rect(0,0,W,5));const out=ctx.getImage();try{fm.writeImage(p,out)}catch(_){}return out
 }catch(_){return null}
}
function T(st,s,z,c,w='regular',n=1){const t=st.addText(String(s??''));t.font=w==='heavy'?Font.heavySystemFont(z):w==='bold'?Font.boldSystemFont(z):w==='semibold'?Font.semiboldSystemFont(z):Font.systemFont(z);t.textColor=c;t.lineLimit=n;t.minimumScaleFactor=.66;return t}
function base(bg){const w=new ListWidget();if(bg)w.backgroundImage=bg;else{const g=new LinearGradient();g.colors=[col(S.accent,.16),col(C.bg)];g.locations=[0,1];w.backgroundGradient=g}w.url=S.url;return w}
function pill(st,label,accent=false){const p=st.addStack();p.backgroundColor=accent?col(S.accent,.22):col('#000000',.38);p.cornerRadius=8;p.setPadding(3,7,3,7);T(p,label,accent?9.0:9.1,accent?col(S.accent):col(C.muted),'heavy');return p}
function dateText(d){const f=new DateFormatter();f.locale='ja_JP';f.timeZone='Asia/Tokyo';f.dateFormat='M/d(E) HH:mm';return f.string(new Date(d.start))}
function raceName(s){if(s==='Daytona')return'デイトナ';if(s==='Darlington')return'ダーリントン';if(s==='Gateway')return'ゲートウェイ';if(s==='Bristol')return'ブリストル';if(s==='Kansas')return'カンザス';if(s==='Las Vegas')return'ラスベガス';if(s==='Charlotte Roval')return'シャーロット ROVAL';if(s==='Phoenix')return'フェニックス';if(s==='Talladega')return'タラデガ';if(s==='Martinsville')return'マーティンズビル';if(s==='Championship')return'チャンピオンシップ';return s}
function venue(s){return String(s||'').replace(' International Speedway','').replace(' Motor Speedway','').replace(' Superspeedway','').replace(' Raceway','').replace(' Speedway','')}
function countdown(d){if(d.lifecycle==='SEASON_ENDED'||d.seasonEnded)return{label:'SEASON END',live:false};const now=Date.now(),s=Date.parse(d.start),e=Date.parse(d.end);if(now>=s&&now<e)return{label:'開催中',live:true};const q=s-now;if(q<=0)return{label:'終了',live:false};const h=q/3600000;if(h<24)return{label:`あと${Math.ceil(h)}時間`,live:false};return{label:`あと${Math.ceil(h/24)}日`,live:false}}
function sub(r){return [`#${r.no||'?'}`,r.maker||''].filter(Boolean).join(' · ')+`  ｜  ${r.team||'NASCAR Cup'}`}
function medium(d,cached,bg){const w=base(bg),ci=countdown(d);w.setPadding(9,12,8,12);const top=w.addStack();top.layoutHorizontally();top.centerAlignContent();pill(top,'NASCAR CUP',true);top.addSpacer(6);T(top,d.lifecycle==='SEASON_ENDED'?'シーズン終了':'次戦',8,col(C.dim),'bold');top.addSpacer();if(cached)T(top,'• 更新待ち',6.8,col(C.warn,.80),'semibold');w.addSpacer(3);T(w,raceName(d.race),20.2,col(C.text),'heavy',1);w.addSpacer(1);const info=w.addStack();info.layoutHorizontally();info.centerAlignContent();T(info,dateText(d),10.5,col(C.muted),'semibold');info.addSpacer(5);T(info,`｜ ${venue(d.circuit)}`,9.4,col(C.dim),'semibold',1);info.addSpacer();const cp=info.addStack();cp.backgroundColor=ci.live?col(C.good,.28):col('#000000',.50);cp.cornerRadius=9;cp.setPadding(3,7,3,7);T(cp,ci.label,15.5,ci.live?col(C.good):col(C.text),'heavy');w.addSpacer(5);const hh=w.addStack();T(hh,'ドライバー',8.2,col(C.muted),'bold');hh.addSpacer();const ph=hh.addStack();ph.size=new Size(42,0);const pht=T(ph,'PTS',7.4,col(C.text,.96),'bold');pht.rightAlignText();w.addSpacer(2);for(const r of (d.ranking||[]).slice(0,3)){const row=w.addStack();row.layoutHorizontally();row.centerAlignContent();const ps=row.addStack();ps.size=new Size(18,0);T(ps,r.pos,11.4,col(S.accent),'heavy');row.addSpacer(4);T(row,r.name,12.5,col(C.text),'semibold');row.addSpacer();const pts=row.addStack();pts.size=new Size(42,0);pts.backgroundColor=col('#000000',.48);pts.cornerRadius=7;pts.setPadding(1,4,1,4);const p=T(pts,String(r.points).replace(' pts',''),10.7,col(C.text,1),'heavy');p.rightAlignText();const sr=w.addStack();sr.addSpacer(22);T(sr,sub(r),8.2,col(C.dim),'semibold');w.addSpacer(1)}w.refreshAfterDate=new Date(Date.now()+15*60000);return w}
function small(d,cached,bg){const w=base(bg),ci=countdown(d);w.setPadding(10,11,9,11);const top=w.addStack();top.layoutHorizontally();top.centerAlignContent();pill(top,'NASCAR',true);top.addSpacer(4);T(top,d.lifecycle==='SEASON_ENDED'?'シーズン終了':'次戦',7.2,col(C.dim),'semibold');top.addSpacer();const cp=top.addStack();cp.backgroundColor=ci.live?col(C.good,.30):col('#000000',.50);cp.cornerRadius=8;cp.setPadding(2,6,2,6);T(cp,ci.label,11.6,ci.live?col(C.good):col(C.text),'heavy');w.addSpacer(7);T(w,raceName(d.race),17.2,col(C.text),'heavy',2);w.addSpacer(3);T(w,dateText(d),9.8,col(C.muted),'semibold',1);w.addSpacer();const foot=w.addStack();foot.layoutHorizontally();const loc=foot.addStack();loc.backgroundColor=col('#000000',.48);loc.cornerRadius=7;loc.setPadding(2,5,2,5);T(loc,venue(d.circuit),8,col(C.muted),'semibold',1);foot.addSpacer();if(cached)T(foot,'•',6.6,col(C.warn,.65),'semibold');w.refreshAfterDate=new Date(Date.now()+15*60000);return w}
let w;try{const x=await load(),bg=await hero();w=(config.widgetFamily||'medium')==='small'?small(x.d,x.cached,bg):medium(x.d,x.cached,bg)}catch(e){w=base(null);w.setPadding(12,12,12,12);pill(w,'NASCAR CUP',true);w.addSpacer(8);T(w,'データ取得失敗',18,col(C.text),'heavy');w.addSpacer(3);T(w,'通信回復後に再取得します',9.5,col(C.warn),'semibold')}
if(config.runsInWidget)Script.setWidget(w);else if((config.widgetFamily||'medium')==='small')await w.presentSmall();else await w.presentMedium();Script.complete();
})();