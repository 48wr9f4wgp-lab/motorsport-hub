// Motorsport Hub v9.5.4-hardening — DAKAR dedicated rally-raid module
// MH_LIFECYCLE_BAKED=1
// 2027 next-stage route + CAR overall TOP3/time-gap surface. Pre-start overall uses official 2026 final classification.
// Tap Action v2.1: tap widget to cycle visually distinct persisted Hero photos (show car + Dakar action); Medium DAKAR badge opens official site.
(async()=>{
const V='9.5.4-hardening',K='dakar',SEASON=2027,CACHE_SCHEMA=1,CACHE_MAX_AGE=7*86400000;
const FINAL_2026_SOURCE='https://www.dakar.com/fr/webview/rankings/stage-13/auto?year=2026';
const S={label:'DAKAR',accent:'#D4A62A',url:'https://www.dakar.com/en/'};
const C={bg:'#070705',text:'#F8F7F2',muted:'#C9C4B5',dim:'#9C9789',good:'#58DA8A',warn:'#FFB84D'};
const fm=FileManager.local(),DOC=fm.documentsDirectory(),CACHE=fm.joinPath(DOC,'motorsport-data-v950-dakar.json'),UI_STATE=fm.joinPath(DOC,'motorsport-ui-v1-dakar.json');

const HERO_CROP_BASELINE='2026-08-28-dakar-phase6-v1';
const HERO_CROPS={
 "dakar-dacia-sandrider-gims-2024":{"small":{"x":0.3164511981010437,"y":0,"w":0.6671875,"h":1},"medium":{"x":0,"y":0.27399526950812364,"w":1,"h":0.6951091199131113}},
 "dakar-2021-stage05-action":{"small":{"x":0.27747356255849204,"y":0,"w":0.6653645833333334,"h":1},"medium":{"x":0.05184776681964287,"y":0.36529250144958497,"w":0.9106100134842563,"h":0.6347074985504151}},
 "dakar-2021-stage10-action":{"small":{"x":0.24666666666666662,"y":0,"w":0.6666666666666666,"h":1},"medium":{"x":0,"y":0.30434782608695654,"w":1,"h":0.6956521739130435}}
};
const HERO_VARIANTS=[
 {assetId:'dakar-dacia-sandrider-gims-2024',label:'PHOTO 1',filename:'Dacia Sandrider GIMS 2024 1X7A2026.jpg',urls:[
  'https://commons.wikimedia.org/wiki/Special:Redirect/file/Dacia%20Sandrider%20GIMS%202024%201X7A2026.jpg?width=2048',
  'https://commons.wikimedia.org/wiki/Special:Redirect/file/Dacia%20Sandrider%20GIMS%202024%201X7A2026.jpg?width=1280'
 ]},
 {assetId:'dakar-2021-stage05-action',label:'PHOTO 2',filename:'Dakar Rally 2021 - Stage 05 (50810898083).jpg',urls:[
  'https://commons.wikimedia.org/wiki/Special:Redirect/file/Dakar%20Rally%202021%20-%20Stage%2005%20%2850810898083%29.jpg?width=2048',
  'https://commons.wikimedia.org/wiki/Special:Redirect/file/Dakar%20Rally%202021%20-%20Stage%2005%20%2850810898083%29.jpg?width=1280'
 ]},
 {assetId:'dakar-2021-stage10-action',label:'PHOTO 3',filename:'Dakar Rally 2021 - Stage 10 (50832314671).jpg',urls:[
  'https://commons.wikimedia.org/wiki/Special:Redirect/file/Dakar%20Rally%202021%20-%20Stage%2010%20%2850832314671%29.jpg?width=2048',
  'https://commons.wikimedia.org/wiki/Special:Redirect/file/Dakar%20Rally%202021%20-%20Stage%2010%20%2850832314671%29.jpg?width=1280'
 ]}
];
function readUI(){try{if(!fm.fileExists(UI_STATE))return{heroVariant:0};const p=JSON.parse(fm.readString(UI_STATE)),i=Number(p?.heroVariant);return{heroVariant:Number.isInteger(i)&&i>=0&&i<HERO_VARIANTS.length?i:0}}catch(_){return{heroVariant:0}}}
function saveUI(s){try{fm.writeString(UI_STATE,JSON.stringify({schemaVersion:1,heroVariant:s.heroVariant,updatedAt:Date.now()}))}catch(_){}}
let UI=readUI();
const dynamicHero=()=>globalThis.__MH_HERO_OVERRIDE_IMAGE||null;
const ACTION=String(args.queryParameters?.mhAction||'').trim();
if(ACTION==='cycleHero'&&!dynamicHero()){UI.heroVariant=(UI.heroVariant+1)%HERO_VARIANTS.length;saveUI(UI)}
function tapURL(){if(dynamicHero())return S.url;try{if(typeof URLScheme!=='undefined'&&URLScheme.forRunningScript){const b=URLScheme.forRunningScript(),sep=String(b).includes('?')?'&':'?';return`${b}${sep}mhCategory=DAKAR&mhAction=cycleHero`}}catch(_){}return S.url}

const SNAP={
 stageId:'P',stage:'PROLOGUE',start:'2027-01-01T00:00:00+03:00',end:'2027-01-02T00:00:00+03:00',dateLabel:'1/1(金)',route:'King Abdullah EC → King Abdullah EC',routeShort:'KAEC → KAEC',special:30,seasonEnded:false,lifecycle:'UPCOMING',rankingSeason:2026,rankingLabel:'2026 FINAL',ranking:[
  {pos:1,no:'299',name:'Nasser Al-Attiyah',gap:'—',time:'48:56:53',team:'The Dacia Sandriders',machine:'DACIA SANDRIDER'},
  {pos:2,no:'227',name:'Nani Roma',gap:'+9:42',time:'49:06:35',team:'FORD RACING',machine:'FORD RAPTOR'},
  {pos:3,no:'226',name:'Mattias Ekström',gap:'+14:33',time:'49:11:26',team:'FORD RACING',machine:'FORD RAPTOR'}
 ]
};

// Official Dakar 2027 route: 1 Jan prologue, 2–15 Jan stages 1–13. Stage-day windows are intentionally all-day because official start times are not yet published.
const CAL=[
 {stageId:'P',stage:'PROLOGUE',start:'2027-01-01T00:00:00+03:00',end:'2027-01-02T00:00:00+03:00',dateLabel:'1/1(金)',route:'King Abdullah EC → King Abdullah EC',routeShort:'KAEC → KAEC',special:30},
 {stageId:'1',stage:'STAGE 1',start:'2027-01-02T00:00:00+03:00',end:'2027-01-03T00:00:00+03:00',dateLabel:'1/2(土)',route:'King Abdullah EC → Yanbu',routeShort:'KAEC → Yanbu',special:350},
 {stageId:'2',stage:'STAGE 2',start:'2027-01-03T00:00:00+03:00',end:'2027-01-04T00:00:00+03:00',dateLabel:'1/3(日)',route:'Yanbu → AlUla',routeShort:'Yanbu → AlUla',special:310},
 {stageId:'3',stage:'STAGE 3',start:'2027-01-04T00:00:00+03:00',end:'2027-01-05T00:00:00+03:00',dateLabel:'1/4(月)',route:'AlUla → Hail',routeShort:'AlUla → Hail',special:480},
 {stageId:'4',stage:'STAGE 4',start:'2027-01-05T00:00:00+03:00',end:'2027-01-06T00:00:00+03:00',dateLabel:'1/5(火)',route:'Hail → Hail',routeShort:'Hail → Hail',special:380},
 {stageId:'5',stage:'STAGE 5',start:'2027-01-06T00:00:00+03:00',end:'2027-01-07T00:00:00+03:00',dateLabel:'1/6(水)',route:'Hail → Al Duwadimi',routeShort:'Hail → Al Duwadimi',special:480},
 {stageId:'6',stage:'STAGE 6',start:'2027-01-07T00:00:00+03:00',end:'2027-01-08T00:00:00+03:00',dateLabel:'1/7(木)',route:'Al Duwadimi → Marathon Refuge',routeShort:'Al Duwadimi → Marathon',special:440},
 {stageId:'7',stage:'STAGE 7',start:'2027-01-08T00:00:00+03:00',end:'2027-01-09T00:00:00+03:00',dateLabel:'1/8(金)',route:'Marathon Refuge → Bisha',routeShort:'Marathon → Bisha',special:430},
 {stageId:'8',stage:'STAGE 8',start:'2027-01-10T00:00:00+03:00',end:'2027-01-11T00:00:00+03:00',dateLabel:'1/10(日)',route:'Bisha → Bisha',routeShort:'Bisha → Bisha',special:460},
 {stageId:'9',stage:'STAGE 9',start:'2027-01-11T00:00:00+03:00',end:'2027-01-12T00:00:00+03:00',dateLabel:'1/11(月)',route:'Bisha → Wadi Ad-Dawasir',routeShort:'Bisha → Wadi Ad-Dawasir',special:460},
 {stageId:'10',stage:'STAGE 10',start:'2027-01-12T00:00:00+03:00',end:'2027-01-13T00:00:00+03:00',dateLabel:'1/12(火)',route:'Wadi Ad-Dawasir → Bisha',routeShort:'Wadi Ad-Dawasir → Bisha',special:515},
 {stageId:'11',stage:'STAGE 11',start:'2027-01-13T00:00:00+03:00',end:'2027-01-14T00:00:00+03:00',dateLabel:'1/13(水)',route:'Bisha → Al Bahah Marathon',routeShort:'Bisha → Al Bahah',special:480},
 {stageId:'12',stage:'STAGE 12',start:'2027-01-14T00:00:00+03:00',end:'2027-01-15T00:00:00+03:00',dateLabel:'1/14(木)',route:'Al Bahah → King Abdullah EC',routeShort:'Al Bahah → KAEC',special:455},
 {stageId:'13',stage:'STAGE 13',start:'2027-01-15T00:00:00+03:00',end:'2027-01-16T00:00:00+03:00',dateLabel:'1/15(金)',route:'King Abdullah EC → King Abdullah EC',routeShort:'KAEC → KAEC',special:50}
];

const META={
 '299':{machine:'DACIA SANDRIDER',team:'The Dacia Sandriders'},
 '227':{machine:'FORD RAPTOR',team:'FORD RACING'},
 '226':{machine:'FORD RAPTOR',team:'FORD RACING'}
};

// Hero photo set: current Dacia Sandrider design reference + two licensed Dakar action frames. Exact source pages are tracked in hero-assets.json.

const col=(h,a=1)=>new Color(h,a),clone=o=>JSON.parse(JSON.stringify(o)),num=v=>{const m=String(v||'').replace(/,/g,'').match(/-?\d+(?:\.\d+)?/);return m?Number(m[0]):NaN};
const clean=s=>String(s||'').replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&nbsp;|&#160;/gi,' ').replace(/&amp;/gi,'&').replace(/&#39;|&apos;/gi,"'").replace(/\s+/g,' ').trim();
function rows(h){const out=[];for(const tr of String(h||'').match(/<tr\b[\s\S]*?<\/tr>/gi)||[]){const a=[];let m,re=/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi;while((m=re.exec(tr)))a.push(clean(m[1]));if(a.length)out.push(a)}return out}
async function txt(url){const r=new Request(url);r.timeoutInterval=10;r.headers={'User-Agent':'Mozilla/5.0 MotorsportHub/9.5.4','Cache-Control':'no-cache'};return await r.loadString()}
function nextStage(d){const now=Date.now();for(const e of CAL){const s=Date.parse(e.start),end=Date.parse(e.end);if(now<end)return{...d,...e,seasonEnded:false,lifecycle:now>=s?'ACTIVE':'UPCOMING'}}const last=CAL[CAL.length-1];return{...d,...last,seasonEnded:true,lifecycle:'SEASON_ENDED'}}
function rankingContext(){const now=Date.now(),stage1=Date.parse(CAL.find(e=>e.stageId==='1').start);if(now<stage1)return{season:2026,label:'2026 FINAL',source:FINAL_2026_SOURCE};let completed=0;for(const e of CAL){if(e.stageId==='P')continue;if(now>=Date.parse(e.end))completed=Math.max(completed,Number(e.stageId));}if(completed<1)return{season:2026,label:'2026 FINAL',source:FINAL_2026_SOURCE};return{season:2027,label:`2027 AFTER S${completed}`,source:`https://www.dakar.com/fr/webview/rankings/stage-${completed}/auto?year=2027`}}
function validRanking(a){return Array.isArray(a)&&a.length>=3&&a.slice(0,5).every(r=>r&&Number(r.pos)>=1&&String(r.name||'').trim()&&String(r.gap||'').trim())}
function validData(d){return !!d&&typeof d==='object'&&validRanking(d.ranking)&&String(d.stage||'').trim()&&String(d.route||'').trim()&&Number.isFinite(Date.parse(d.start))&&Number.isFinite(Date.parse(d.end))&&['UPCOMING','ACTIVE','SEASON_ENDED'].includes(d.lifecycle)}
function removeCache(){try{if(fm.fileExists(CACHE))fm.remove(CACHE)}catch(_){} }
function save(d){try{if(!validData(d))return;fm.writeString(CACHE,JSON.stringify({schemaVersion:CACHE_SCHEMA,category:K,season:SEASON,fetchedAt:Date.now(),source:'dakar:car-overall',ranking:d.ranking,event:{stageId:d.stageId,stage:d.stage,start:d.start,end:d.end,route:d.route,special:d.special,seasonEnded:!!d.seasonEnded,lifecycle:d.lifecycle},data:d}))}catch(_){} }
function cache(){try{if(!fm.fileExists(CACHE))return null;const p=JSON.parse(fm.readString(CACHE)),age=Date.now()-Number(p?.fetchedAt);if(p?.schemaVersion!==CACHE_SCHEMA||p?.category!==K||Number(p?.season)!==SEASON||p?.source!=='dakar:car-overall'||!Number.isFinite(age)||age<0||age>CACHE_MAX_AGE||!validRanking(p?.ranking)||!p?.event||!validData(p?.data)){removeCache();return null}return p.data}catch(_){removeCache();return null}}
function titleName(s){return String(s||'').trim().split(/\s+/).map(w=>w.length<=3?w.toUpperCase():w.charAt(0).toUpperCase()+w.slice(1).toLowerCase()).join(' ').replace(/Al-attiyah/g,'Al-Attiyah').replace(/Ekström/i,'Ekström')}
function parseRanking(h){
 const out=[];
 for(const c of rows(h)){
  const p=num(c[0]),no=String(c[1]||'').match(/\d+/)?.[0]||'';if(!(p>=1&&p<=80)||!no)continue;
  let di=-1;for(let i=2;i<c.length;i++){if((String(c[i]).match(/\([a-z]{3}\)/ig)||[]).length>=2){di=i;break}}if(di<0)continue;
  const parts=String(c[di]).split(/\([a-z]{3}\)/ig).map(x=>x.trim()).filter(Boolean),name=titleName(parts[1]||'');if(!name)continue;
  const team=String(c[di+1]||META[no]?.team||'ULTIMATE').trim();
  const time=c.find(x=>/^\d+h\s*\d+'\s*\d+''/.test(String(x)))||'';
  const gapCell=c.find(x=>/^\+\s*\d+h\s*\d+'\s*\d+''/.test(String(x)))||'';
  const shortGap=p===1?'—':gapCell?gapCell.replace(/^\+\s*/,'+').replace(/00h\s*/,'').replace(/0?(\d+)'\s*0?(\d+)''/,'$1:$2').replace(/\s+/g,''):'+';
  const m=META[no]||{};out.push({pos:p,no,name,gap:shortGap,time:time.replace(/h\s*/,'h ').trim(),team:m.team||team,machine:m.machine||'ULTIMATE'});
 }
 out.sort((a,b)=>a.pos-b.pos);const seen=new Set(),u=[];for(const r of out){if(seen.has(r.pos))continue;seen.add(r.pos);u.push(r);if(u.length>=5)break}return u
}
async function update(d){const ctx=rankingContext(),h=await txt(ctx.source),r=parseRanking(h);if(r.length<3)throw Error('DAKAR CAR standings');return nextStage({...d,ranking:r,rankingSeason:ctx.season,rankingLabel:ctx.label})}
async function load(){const base=nextStage(clone(SNAP));try{const d=await update(base);save(d);return{d,cached:false}}catch(_){const c=cache();return{d:nextStage(c||base),cached:true}}}

function smooth(t){return t*t*(3-2*t)}
function cropRect(img,W,H,crop){const iw=img.size.width||1,ih=img.size.height||1;if(!crop)return new Rect(0,0,W,H);const sx=iw*crop.x,sy=ih*crop.y,sw=iw*crop.w,sh=ih*crop.h,s=Math.max(W/Math.max(1,sw),H/Math.max(1,sh));return new Rect(-sx*s,-sy*s,iw*s,ih*s)}
async function hero(){const override=dynamicHero();if(override)return override;const small=(config.widgetFamily||'medium')==='small',variant=HERO_VARIANTS[UI.heroVariant]||HERO_VARIANTS[0],p=fm.joinPath(DOC,`motorsport-hero-v954-${small?'small':'medium'}-dakar-h${UI.heroVariant}.jpg`);if(fm.fileExists(p)){try{return fm.readImage(p)}catch(_){} }try{let img=null;for(const u of variant.urls){try{const r=new Request(`${u}&v=954`);r.timeoutInterval=10;r.headers={'User-Agent':'Mozilla/5.0','Cache-Control':'no-cache'};img=await r.loadImage();if(img)break}catch(_){}}if(!img)return null;const W=small?720:1380,H=small?720:640,crop=HERO_CROPS[variant.assetId]?.[small?'small':'medium'],ctx=new DrawContext();ctx.size=new Size(W,H);ctx.opaque=true;ctx.respectScreenScale=false;ctx.setFillColor(col(C.bg));ctx.fillRect(new Rect(0,0,W,H));ctx.drawImageInRect(img,cropRect(img,W,H,crop));ctx.setFillColor(col('#060503',.12));ctx.fillRect(new Rect(0,0,W,H));for(let x=0;x<W;x+=3){const t=x/(W-1),a=.84*(1-smooth(t))+.055;ctx.setFillColor(col('#050403',a));ctx.fillRect(new Rect(x,0,4,H))}const rs=W*.74;for(let x=rs;x<W;x+=3){const t=(x-rs)/(W-rs),a=.07+.42*smooth(t);ctx.setFillColor(col('#050403',a));ctx.fillRect(new Rect(x,0,4,H))}const bs=H*.68,bh=H-bs;for(let i=0;i<56;i++){const y=bs+i*(bh/56),t=i/55,a=.02+.24*t*t;ctx.setFillColor(col('#040302',a));ctx.fillRect(new Rect(0,y,W,bh/56+1))}ctx.setFillColor(col(S.accent,.94));ctx.fillRect(new Rect(0,0,W,5));const out=ctx.getImage();try{fm.writeImage(p,out)}catch(_){}return out}catch(_){return null}}
function T(st,s,z,c,w='regular',n=1){const t=st.addText(String(s??''));t.font=w==='heavy'?Font.heavySystemFont(z):w==='bold'?Font.boldSystemFont(z):w==='semibold'?Font.semiboldSystemFont(z):Font.systemFont(z);t.textColor=c;t.lineLimit=n;t.minimumScaleFactor=.64;return t}
function base(bg){const w=new ListWidget();if(bg)w.backgroundImage=bg;else{const g=new LinearGradient();g.colors=[col(S.accent,.18),col(C.bg)];g.locations=[0,1];w.backgroundGradient=g}w.url=tapURL();return w}
function pill(st,label,accent=false){const p=st.addStack();p.backgroundColor=accent?col(S.accent,.22):col('#000000',.50);p.cornerRadius=8;p.setPadding(3,7,3,7);T(p,label,accent?9.1:9.4,accent?col(S.accent):col(C.text),'heavy');return p}
function countdown(d){if(d.lifecycle==='SEASON_ENDED'||d.seasonEnded)return{label:'FINISH',live:false};const now=Date.now(),s=Date.parse(d.start),e=Date.parse(d.end);if(now>=s&&now<e)return{label:'開催中',live:true};const q=s-now;if(q<=0)return{label:'終了',live:false};const h=q/3600000;if(h<24)return{label:`あと${Math.ceil(h)}時間`,live:false};return{label:`あと${Math.ceil(h/24)}日`,live:false}}
function stageLabel(d){return d.seasonEnded?'2027 FINISH':d.stage}
function routeLabel(d){return d.routeShort||d.route}
function sub(r){return [`#${r.no||'?'}`,r.machine||'ULTIMATE'].join(' · ')+`  ｜  ${r.team||'DAKAR'}`}
function medium(d,cached,bg){const w=base(bg),ci=countdown(d);w.setPadding(9,12,8,12);const top=w.addStack();top.layoutHorizontally();top.centerAlignContent();const brand=pill(top,'DAKAR',true);brand.url=S.url;top.addSpacer(6);T(top,d.seasonEnded?'完走':'次ステージ',8,col(C.dim),'bold');if(!dynamicHero()){top.addSpacer(5);T(top,`H${UI.heroVariant+1}/3`,6.7,col(C.dim),'semibold')}top.addSpacer();if(cached)T(top,'• 更新待ち',6.8,col(C.warn,.80),'semibold');w.addSpacer(3);T(w,stageLabel(d),20.4,col(C.text),'heavy',1);w.addSpacer(1);const info=w.addStack();info.layoutHorizontally();info.centerAlignContent();T(info,`${d.dateLabel} · SS ${d.special}km`,10.5,col(C.muted),'semibold');info.addSpacer(5);T(info,`｜ ${routeLabel(d)}`,9.2,col(C.dim),'semibold',1);info.addSpacer();const cp=info.addStack();cp.backgroundColor=ci.live?col(C.good,.28):col('#000000',.52);cp.cornerRadius=9;cp.setPadding(3,7,3,7);T(cp,ci.label,15.2,ci.live?col(C.good):col(C.text),'heavy');w.addSpacer(5);const hh=w.addStack();T(hh,`総合 CAR · ${d.rankingLabel||'OVERALL'}`,8.2,col(C.muted),'bold');hh.addSpacer();const gh=hh.addStack();gh.size=new Size(54,0);const gt=T(gh,'GAP',7.4,col(C.text,.96),'bold');gt.rightAlignText();w.addSpacer(2);for(const r of(d.ranking||[]).slice(0,3)){const row=w.addStack();row.layoutHorizontally();row.centerAlignContent();const ps=row.addStack();ps.size=new Size(18,0);T(ps,r.pos,11.4,col(S.accent),'heavy');row.addSpacer(4);T(row,r.name,12.4,col(C.text),'semibold');row.addSpacer();const gp=row.addStack();gp.size=new Size(54,0);gp.backgroundColor=col('#000000',.50);gp.cornerRadius=7;gp.setPadding(1,4,1,4);const g=T(gp,r.gap||'—',10.3,col(C.text),'heavy');g.rightAlignText();const sr=w.addStack();sr.addSpacer(22);T(sr,sub(r),8.1,col(C.dim),'semibold');w.addSpacer(1)}w.refreshAfterDate=new Date(Date.now()+20*60000);return w}
function small(d,cached,bg){const w=base(bg),ci=countdown(d);w.setPadding(10,11,9,11);const top=w.addStack();top.layoutHorizontally();top.centerAlignContent();pill(top,'DAKAR',true);top.addSpacer(4);T(top,d.seasonEnded?'FINISH':'次ステージ',7.1,col(C.dim),'semibold');if(!dynamicHero()){top.addSpacer(4);T(top,`H${UI.heroVariant+1}/3`,6.2,col(C.dim),'semibold')}top.addSpacer();const cp=top.addStack();cp.backgroundColor=ci.live?col(C.good,.30):col('#000000',.52);cp.cornerRadius=8;cp.setPadding(2,6,2,6);T(cp,ci.label,11.5,ci.live?col(C.good):col(C.text),'heavy');w.addSpacer(7);T(w,stageLabel(d),18.2,col(C.text),'heavy',2);w.addSpacer(3);T(w,`${d.dateLabel} · SS ${d.special}km`,9.7,col(C.muted),'semibold',1);w.addSpacer();const foot=w.addStack();const loc=foot.addStack();loc.backgroundColor=col('#000000',.48);loc.cornerRadius=7;loc.setPadding(2,5,2,5);T(loc,routeLabel(d),7.9,col(C.muted),'semibold',1);foot.addSpacer();if(cached)T(foot,'•',6.5,col(C.warn,.70),'semibold');w.refreshAfterDate=new Date(Date.now()+20*60000);return w}

let w;try{const x=await load(),bg=await hero();w=(config.widgetFamily||'medium')==='small'?small(x.d,x.cached,bg):medium(x.d,x.cached,bg)}catch(_){w=base(null);w.setPadding(12,12,12,12);pill(w,'DAKAR',true);w.addSpacer(8);T(w,'データ取得失敗',18,col(C.text),'heavy');w.addSpacer(3);T(w,'通信回復後に再取得します',9.5,col(C.warn),'semibold')}
if(config.runsInWidget)Script.setWidget(w);else if((config.widgetFamily||'medium')==='small')await w.presentSmall();else await w.presentMedium();Script.complete();
})();