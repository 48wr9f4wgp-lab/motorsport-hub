// Motorsport Hub v10.0.1-hardening — flattened MotoGP module
// Completed MotoGP runtime: official standings parser + 2026 tail calendar + validated cache + accepted v8.7.1 visual treatment.
(async()=>{
const V='10.0.1-hardening',K='motogp',SEASON=2026,CACHE_SCHEMA=1,CACHE_MAX_AGE=7*86400000;
const DATA_SOURCE='https://stats.motogp.com/en/world-standing';
const S={label:'MotoGP',accent:'#FF5A1F',rank:'ライダー',url:'https://www.motogp.com/'};
const C={bg:'#06080B',text:'#F7F9FB',muted:'#B9C2CC',dim:'#8D98A4',good:'#58DA8A',warn:'#FFB84D'};
const fm=FileManager.local(),DOC=fm.documentsDirectory(),CACHE=fm.joinPath(DOC,'motorsport-data-v1000-motogp.json');

const SNAP={race:'Grand Prix of Aragon',date:'2026-08-30T14:00:00+02:00',timeTbd:false,circuit:'MotorLand Aragón',seasonEnded:false,lifecycle:'UPCOMING',ranking:[
 {pos:1,name:'Jorge Martin',points:'240 pts',maker:'APRILIA',machine:'Aprilia',team:'Aprilia Racing'},
 {pos:2,name:'Marco Bezzecchi',points:'209 pts',maker:'APRILIA',machine:'Aprilia',team:'Aprilia Racing'},
 {pos:3,name:'Ai Ogura',points:'203 pts',maker:'APRILIA',machine:'Aprilia',team:'Trackhouse MotoGP Team'}
]};

// Race-day anchors. Exact times are retained only where the accepted production calendar already treated them as known.
const CAL=[
 ['Grand Prix of Aragon','2026-08-30T14:00:00+02:00','MotorLand Aragón',false],
 ['San Marino Grand Prix','2026-09-13T14:00:00+02:00','Misano',false],
 ['Austrian Grand Prix','2026-09-20T12:00:00+02:00','Red Bull Ring',true],
 ['Japanese Grand Prix','2026-10-04T12:00:00+09:00','Mobility Resort Motegi',true],
 ['Indonesian Grand Prix','2026-10-11T12:00:00+08:00','Mandalika',true],
 ['Australian Grand Prix','2026-10-25T12:00:00+11:00','Phillip Island',true],
 ['Malaysian Grand Prix','2026-11-01T12:00:00+08:00','Sepang',true],
 ['Qatar Grand Prix','2026-11-08T12:00:00+03:00','Lusail',true],
 ['Portuguese Grand Prix','2026-11-22T12:00:00+00:00','Portimão',true],
 ['Valencia Grand Prix','2026-11-29T12:00:00+01:00','Valencia',true]
];

const HERO={
 APRILIA:{urls:['https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/MotoGP_2025_Malaysian_Grand_Prix_-_Aprilia_Racing_-_Marco_Bezzecchi.jpg/960px-MotoGP_2025_Malaysian_Grand_Prix_-_Aprilia_Racing_-_Marco_Bezzecchi.jpg'],crop:{small:{x:.19653893629709884,y:0,w:.6666666666666666,h:1},medium:{x:0,y:.2841728782653809,w:1,h:.6956521739130435}}},
 DUCATI:{urls:['https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/MotoGP_2025_Malaysian_Grand_Prix_-_Ducati_Lenovo_-_Francesco_Bagnaia.jpg/960px-MotoGP_2025_Malaysian_Grand_Prix_-_Ducati_Lenovo_-_Francesco_Bagnaia.jpg'],crop:{small:{x:.26584787438313173,y:0,w:.6666666666666666,h:1},medium:{x:0,y:.30434782608695654,w:1,h:.6956521739130435}}}
};

const col=(h,a=1)=>new Color(h,a),clone=o=>JSON.parse(JSON.stringify(o)),num=v=>{const m=String(v||'').replace(/,/g,'').match(/-?\d+(?:\.\d+)?/);return m?Number(m[0]):NaN};
const clean=s=>String(s||'').replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&nbsp;|&#160;/gi,' ').replace(/&amp;/gi,'&').replace(/&#39;|&apos;/gi,"'").replace(/\s+/g,' ').trim();
function rows(h){const out=[];for(const tr of String(h||'').match(/<tr\b[\s\S]*?<\/tr>/gi)||[]){const a=[];let m,re=/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi;while((m=re.exec(tr)))a.push(clean(m[1]));if(a.length)out.push(a)}return out}
async function txt(url){const r=new Request(url);r.timeoutInterval=9;r.headers={'User-Agent':'Mozilla/5.0 MotorsportHub/10.0','Cache-Control':'no-cache'};return await r.loadString()}
function nextEvent(d){const now=Date.now(),hold=4*3600000;for(const e of CAL){const start=Date.parse(e[1]),end=start+hold;if(now<end)return{...d,race:e[0],date:e[1],circuit:e[2],timeTbd:!!e[3],seasonEnded:false,lifecycle:now>=start?'ACTIVE':'UPCOMING'}}const last=CAL[CAL.length-1];return{...d,race:last[0],date:last[1],circuit:last[2],timeTbd:!!last[3],seasonEnded:true,lifecycle:'SEASON_ENDED'}}
function validRanking(a){return Array.isArray(a)&&a.length>=3&&a.slice(0,5).every(r=>r&&Number(r.pos)>=1&&String(r.name||'').trim()&&Number.isFinite(Number(String(r.points||'').replace(/[^0-9.-]/g,'')))&&/APRILIA|DUCATI|KTM|HONDA|YAMAHA/i.test(String(r.maker||'')))}
function validData(d){return !!d&&validRanking(d.ranking)&&String(d.race||'').trim()&&String(d.circuit||'').trim()&&Number.isFinite(Date.parse(d.date))&&['UPCOMING','ACTIVE','SEASON_ENDED'].includes(d.lifecycle)}
function removeCache(){try{if(fm.fileExists(CACHE))fm.remove(CACHE)}catch(_){} }
function save(d){try{if(!validData(d))return;fm.writeString(CACHE,JSON.stringify({schemaVersion:CACHE_SCHEMA,category:K,season:SEASON,fetchedAt:Date.now(),source:DATA_SOURCE,ranking:d.ranking,event:{race:d.race,date:d.date,circuit:d.circuit,timeTbd:!!d.timeTbd,seasonEnded:!!d.seasonEnded,lifecycle:d.lifecycle},data:d}))}catch(_){} }
function cache(){try{if(!fm.fileExists(CACHE))return null;const p=JSON.parse(fm.readString(CACHE)),age=Date.now()-Number(p?.fetchedAt);if(p?.schemaVersion!==CACHE_SCHEMA||p?.category!==K||Number(p?.season)!==SEASON||p?.source!==DATA_SOURCE||!Number.isFinite(age)||age<0||age>CACHE_MAX_AGE||!validRanking(p?.ranking)||!p?.event||!validData(p?.data)){removeCache();return null}return p.data}catch(_){removeCache();return null}}
function riderName(raw){return String(raw||'').replace(/^\s*\d+\s*/,'').trim()}
async function update(d){
 const h=await txt(DATA_SOURCE);if(!/Riders'? Championship|RIDERS'? CHAMPIONSHIP/i.test(h)||!/MotoGP/i.test(h))throw Error('MotoGP table identity');
 const a=[];
 for(const c of rows(h)){
  if(c.length<6)continue;
  const p=num(c[0]),name=riderName(c[1]),team=String(c[3]||'').trim(),bike=String(c[4]||'').trim(),pts=num(c[5]);
  if(!(p>=1&&p<=40)||!name||!isFinite(pts)||!/Aprilia|Ducati|KTM|Honda|Yamaha/i.test(bike))continue;
  a.push({pos:p,name,points:`${pts} pts`,maker:bike.toUpperCase(),machine:bike,team:team||'MotoGP'});
 }
 a.sort((x,y)=>x.pos-y.pos);const seen=new Set(),u=[];for(const r of a){if(seen.has(r.pos))continue;seen.add(r.pos);u.push(r);if(u.length>=5)break}
 if(u.length<3||u[0].pos!==1)throw Error('MotoGP standings');d.ranking=u;return nextEvent(d)
}
async function load(){const base=nextEvent(clone(SNAP));try{const d=await update(base);save(d);return{d,cached:false}}catch(_){const c=cache();return{d:nextEvent(c||base),cached:true}}}

function smooth(t){return t*t*(3-2*t)}
function cover(img,W,H,focus=.5,shift=0){const iw=img.size.width||1,ih=img.size.height||1,s=Math.max(W/iw,H/ih),dw=iw*s,dh=ih*s;return new Rect(-(dw-W)*focus+shift,-(dh-H)*.5,dw,dh)}
function heroCropRect(img,W,H,c){const iw=img.size.width||1,ih=img.size.height||1,cw=Math.max(1,iw*c.w),ch=Math.max(1,ih*c.h),s=Math.max(W/cw,H/ch),vw=cw*s,vh=ch*s,ox=(vw-W)/2,oy=(vh-H)/2;return new Rect(-iw*c.x*s-ox,-ih*c.y*s-oy,iw*s,ih*s)}
async function hero(d){const small=(config.widgetFamily||'medium')==='small',maker=String(d?.ranking?.[0]?.maker||'APRILIA').toUpperCase(),preset=HERO[maker]||HERO.APRILIA,p=fm.joinPath(DOC,`motorsport-hero-v1000-crop1-${small?'small':'medium'}-motogp-${maker.toLowerCase()}.jpg`);if(fm.fileExists(p)){try{return fm.readImage(p)}catch(_){} }try{let img=null;for(const u of preset.urls){try{const r=new Request(u);r.timeoutInterval=10;r.headers={'User-Agent':'Mozilla/5.0','Cache-Control':'no-cache'};img=await r.loadImage();if(img)break}catch(_){}}if(!img)return null;const W=small?360:690,H=small?360:320,crop=small?preset.crop.small:preset.crop.medium,ctx=new DrawContext();ctx.size=new Size(W,H);ctx.opaque=true;ctx.respectScreenScale=false;ctx.setFillColor(col(C.bg));ctx.fillRect(new Rect(0,0,W,H));ctx.drawImageInRect(img,heroCropRect(img,W,H,crop));ctx.setFillColor(col('#030609',.18));ctx.fillRect(new Rect(0,0,W,H));for(let x=0;x<W;x+=2){const t=x/(W-1),a=.86*(1-smooth(t))+.07;ctx.setFillColor(col('#030609',a));ctx.fillRect(new Rect(x,0,3,H))}const bs=H*.68,bh=H-bs;for(let i=0;i<56;i++){const y=bs+i*(bh/56),t=i/55,a=.015+.25*t*t;ctx.setFillColor(col('#020407',a));ctx.fillRect(new Rect(0,y,W,bh/56+1))}const rs=W*.76;for(let x=rs;x<W;x+=2){const t=(x-rs)/(W-rs),a=.08+.40*smooth(t);ctx.setFillColor(col('#020407',a));ctx.fillRect(new Rect(x,0,3,H))}ctx.setFillColor(col(S.accent,.88));ctx.fillRect(new Rect(0,0,W,3));const out=ctx.getImage();try{fm.writeImage(p,out)}catch(_){}return out}catch(_){return null}}
function T(st,s,z,c,w='regular',n=1){const t=st.addText(String(s??''));t.font=w==='heavy'?Font.heavySystemFont(z):w==='bold'?Font.boldSystemFont(z):w==='semibold'?Font.semiboldSystemFont(z):Font.systemFont(z);t.textColor=c;t.lineLimit=n;t.minimumScaleFactor=.68;return t}
function rn(s){s=String(s||'');for(const[a,b]of[[/Grand Prix of Aragon/i,'アラゴンGP'],[/San Marino Grand Prix/i,'サンマリノGP'],[/Austrian Grand Prix/i,'オーストリアGP'],[/Japanese Grand Prix/i,'日本GP'],[/Indonesian Grand Prix/i,'インドネシアGP'],[/Australian Grand Prix/i,'オーストラリアGP'],[/Malaysian Grand Prix/i,'マレーシアGP'],[/Qatar Grand Prix/i,'カタールGP'],[/Portuguese Grand Prix/i,'ポルトガルGP'],[/Valencia Grand Prix/i,'バレンシアGP']])if(a.test(s))return b;return s.replace(/Grand Prix/ig,'GP')}
function cn(s){if(/MotorLand Aragón|Aragon/i.test(s))return'モーターランド・アラゴン';if(/Misano/i.test(s))return'Misano';if(/Red Bull Ring/i.test(s))return'Red Bull Ring';if(/Mobility Resort Motegi/i.test(s))return'もてぎ';if(/Mandalika/i.test(s))return'Mandalika';if(/Phillip Island/i.test(s))return'Phillip Island';if(/Sepang/i.test(s))return'Sepang';if(/Lusail/i.test(s))return'Lusail';if(/Portim/i.test(s))return'Portimão';if(/Valencia/i.test(s))return'Valencia';return s||''}
function dateText(d){const x=new Date(d.date);if(!isFinite(x))return'日程未取得';const f=new DateFormatter();f.locale='ja_JP';f.timeZone='Asia/Tokyo';f.dateFormat=d.timeTbd?'M/d(E)':'M/d(E) HH:mm';return f.string(x)+(d.timeTbd?'・時刻未定':'')}
function countdown(d){if(d.lifecycle==='SEASON_ENDED'||d.seasonEnded)return{label:'SEASON END',live:false};const q=new Date(d.date)-Date.now(),hold=4*3600000;if(q<=0&&q>-hold)return{label:'開催中',live:true};if(q<=0)return{label:'終了',live:false};const h=q/3600000;if(d.timeTbd)return{label:`あと${Math.max(1,Math.ceil(h/24))}日`,live:false};if(h<1)return{label:`あと${Math.ceil(q/60000)}分`,live:false};if(h<24)return{label:`あと${Math.ceil(h)}時間`,live:false};return{label:`あと${Math.ceil(h/24)}日`,live:false}}
function sub(r){return`${r.maker||''} · ${r.machine||''}  ｜  ${r.team||''}`}
function base(bg){const w=new ListWidget();if(bg)w.backgroundImage=bg;else{const g=new LinearGradient();g.colors=[col(S.accent,.16),col(C.bg,1)];g.locations=[0,1];w.backgroundGradient=g}w.url=S.url;w.setPadding(9,12,8,12);return w}
function pill(st,label,accent=false){const p=st.addStack();p.backgroundColor=accent?col(S.accent,.18):col('#000000',.32);p.cornerRadius=8;p.setPadding(3,7,3,7);T(p,label,accent?9.6:9.1,accent?col(S.accent):col(C.muted),'heavy');return p}
function medium(d,cached,bg){const w=base(bg),ci=countdown(d);const top=w.addStack();top.layoutHorizontally();top.centerAlignContent();pill(top,S.label,true);top.addSpacer(6);T(top,d.lifecycle==='SEASON_ENDED'?'シーズン終了':'次戦',8,col(C.dim),'bold');top.addSpacer();if(cached)T(top,'• 更新待ち',6.8,col(C.warn,.78),'semibold');w.addSpacer(3);T(w,rn(d.race||'次戦取得中'),20.6,col(C.text),'heavy',1);w.addSpacer(1);const info=w.addStack();info.layoutHorizontally();info.centerAlignContent();T(info,dateText(d),10.7,col(C.muted),'semibold');info.addSpacer(5);T(info,`｜ ${cn(d.circuit)}`,9.6,col(C.dim),'semibold',1);info.addSpacer();const cp=info.addStack();cp.backgroundColor=ci.live?col(C.good,.28):col('#000000',.50);cp.cornerRadius=9;cp.setPadding(3,7,3,7);T(cp,ci.label,16.2,ci.live?col(C.good):col(C.text),'heavy');w.addSpacer(5);const hh=w.addStack();T(hh,S.rank,8.2,col(C.muted),'bold');hh.addSpacer();const ph=hh.addStack();ph.size=new Size(42,0);const pt=T(ph,'PTS',7.4,col(C.text,.96),'bold');pt.rightAlignText();w.addSpacer(2);for(const r of(d.ranking||[]).slice(0,3)){const row=w.addStack();row.layoutHorizontally();row.centerAlignContent();const ps=row.addStack();ps.size=new Size(18,0);T(ps,r.pos,11.4,col(S.accent),'heavy');row.addSpacer(4);T(row,r.name,12.8,col(C.text),'semibold');row.addSpacer();const pts=row.addStack();pts.size=new Size(42,0);pts.backgroundColor=col('#000000',.48);pts.cornerRadius=7;pts.setPadding(1,4,1,4);const p=T(pts,String(r.points).replace(' pts',''),10.7,col(C.text,1),'heavy');p.rightAlignText();const sr=w.addStack();sr.addSpacer(22);T(sr,sub(r),8.5,col(C.dim),'semibold');w.addSpacer(1)}w.refreshAfterDate=new Date(Date.now()+15*60000);return w}
function small(d,cached,bg){const w=base(bg),ci=countdown(d);w.setPadding(10,11,9,11);const top=w.addStack();top.layoutHorizontally();top.centerAlignContent();pill(top,S.label,true);top.addSpacer(4);T(top,d.lifecycle==='SEASON_ENDED'?'終了':'次戦',7.2,col(C.dim),'semibold');top.addSpacer();const cp=top.addStack();cp.backgroundColor=ci.live?col(C.good,.30):col('#000000',.50);cp.cornerRadius=8;cp.setPadding(2,6,2,6);T(cp,ci.label,11.8,ci.live?col(C.good):col(C.text),'heavy');w.addSpacer(7);T(w,rn(d.race||'次戦取得中'),18,col(C.text),'heavy',2);w.addSpacer(3);T(w,dateText(d),9.8,col(C.muted),'semibold',1);w.addSpacer();const foot=w.addStack();foot.layoutHorizontally();const loc=foot.addStack();loc.backgroundColor=col('#000000',.48);loc.cornerRadius=7;loc.setPadding(2,5,2,5);T(loc,cn(d.circuit),8,col(C.muted),'semibold',1);foot.addSpacer();if(cached)T(foot,'•',6.6,col(C.warn,.62),'semibold');w.refreshAfterDate=new Date(Date.now()+15*60000);return w}

let w;try{const x=await load(),bg=await hero(x.d);w=(config.widgetFamily||'medium')==='small'?small(x.d,x.cached,bg):medium(x.d,x.cached,bg)}catch(_){w=base(null);w.setPadding(12,12,12,12);pill(w,'MotoGP',true);w.addSpacer(8);T(w,'データ取得失敗',18,col(C.text),'heavy');w.addSpacer(3);T(w,'通信回復後に再取得します',9.5,col(C.warn),'semibold')}
if(config.runsInWidget)Script.setWidget(w);else if((config.widgetFamily||'medium')==='small')await w.presentSmall();else await w.presentMedium();Script.complete();
})();
