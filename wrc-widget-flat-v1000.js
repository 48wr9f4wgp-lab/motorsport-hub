// Motorsport Hub v10.0.0-hardening — flattened WRC module
// Completed WRC runtime: FIA Drivers standings + current 2026 tail calendar + validated cache + accepted v8.7.1 visual treatment.
(async()=>{
const V='10.0.0-hardening',K='wrc',SEASON=2026,CACHE_SCHEMA=1,CACHE_MAX_AGE=7*86400000;
const DATA_SOURCE='https://www.fia.com/events/world-rally-championship/season-2026/standings';
const S={label:'WRC',accent:'#3B82F6',rank:'ドライバー',url:'https://www.wrc.com/'};
const C={bg:'#06080B',text:'#F7F9FB',muted:'#B9C2CC',dim:'#8D98A4',good:'#58DA8A',warn:'#FFB84D'};
const fm=FileManager.local(),DOC=fm.documentsDirectory(),CACHE=fm.joinPath(DOC,'motorsport-data-v1000-wrc.json');

const SNAP={race:'WRC ueno Rally del Paraguay',date:'2026-08-27T09:00:00-03:00',timeTbd:true,circuit:'Paraguay',seasonEnded:false,lifecycle:'UPCOMING',ranking:[
 {pos:1,name:'Elfyn Evans',points:'201 pts',maker:'TOYOTA',machine:'GR Yaris Rally1',team:'TOYOTA GAZOO Racing WRT'},
 {pos:2,name:'Sami Pajari',points:'171 pts',maker:'TOYOTA',machine:'GR Yaris Rally1',team:'TOYOTA GAZOO Racing WRT'},
 {pos:3,name:'Takamoto Katsuta',points:'160 pts',maker:'TOYOTA',machine:'GR Yaris Rally1',team:'TOYOTA GAZOO Racing WRT'}
]};
const CAL=[
 ['WRC ueno Rally del Paraguay','2026-08-27T09:00:00-03:00','Paraguay',true],
 ['WRC Rally Chile Bio Bío','2026-09-10T09:00:00-03:00','Chile',true],
 ['WRC Rally Italia Sardegna','2026-10-01T09:00:00+02:00','Sardegna',true],
 ['WRC Rally Saudi Arabia','2026-11-11T09:00:00+03:00','Saudi Arabia',true]
];
const META={
 'Elfyn Evans':['TOYOTA','GR Yaris Rally1','TOYOTA GAZOO Racing WRT'],
 'Sami Pajari':['TOYOTA','GR Yaris Rally1','TOYOTA GAZOO Racing WRT'],
 'Takamoto Katsuta':['TOYOTA','GR Yaris Rally1','TOYOTA GAZOO Racing WRT'],
 'Oliver Solberg':['TOYOTA','GR Yaris Rally1','TOYOTA GAZOO Racing WRT'],
 'Sébastien Ogier':['TOYOTA','GR Yaris Rally1','TOYOTA GAZOO Racing WRT'],
 'Sebastien Ogier':['TOYOTA','GR Yaris Rally1','TOYOTA GAZOO Racing WRT'],
 'Thierry Neuville':['HYUNDAI','i20 N Rally1','Hyundai Shell Mobis WRT'],
 'Adrien Fourmaux':['HYUNDAI','i20 N Rally1','Hyundai Shell Mobis WRT'],
 'Hayden Paddon':['HYUNDAI','i20 N Rally1','Hyundai Shell Mobis WRT'],
 'Joshua McErlean':['FORD','Puma Rally1','M-Sport Ford WRT'],
 'Jon Armstrong':['FORD','Puma Rally1','M-Sport Ford WRT'],
 'Mārtiņš Sesks':['FORD','Puma Rally1','M-Sport Ford WRT'],
 'Martins Sesks':['FORD','Puma Rally1','M-Sport Ford WRT']
};
const HERO={urls:[
 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/2025_Toyota_GR_Yaris_Rally_1_Katsuta.jpg/960px-2025_Toyota_GR_Yaris_Rally_1_Katsuta.jpg',
 'https://commons.wikimedia.org/wiki/Special:Redirect/file/2025%20Toyota%20GR%20Yaris%20Rally%201%20Ogier.jpg?width=2048'
],focus:.49,shift:126};

const col=(h,a=1)=>new Color(h,a),clone=o=>JSON.parse(JSON.stringify(o)),num=v=>{const m=String(v||'').replace(/,/g,'').match(/-?\d+(?:\.\d+)?/);return m?Number(m[0]):NaN};
const clean=s=>String(s||'').replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&nbsp;|&#160;/gi,' ').replace(/&amp;/gi,'&').replace(/&#39;|&apos;/gi,"'").replace(/\s+/g,' ').trim();
function rows(h){const out=[];for(const tr of String(h||'').match(/<tr\b[\s\S]*?<\/tr>/gi)||[]){const a=[];let m,re=/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi;while((m=re.exec(tr)))a.push(clean(m[1]));if(a.length)out.push(a)}return out}
async function txt(url){const r=new Request(url);r.timeoutInterval=9;r.headers={'User-Agent':'Mozilla/5.0 MotorsportHub/10.0','Cache-Control':'no-cache'};return await r.loadString()}
function nextEvent(d){const now=Date.now(),hold=4*86400000;for(const e of CAL){const start=Date.parse(e[1]),end=start+hold;if(now<end)return{...d,race:e[0],date:e[1],circuit:e[2],timeTbd:!!e[3],seasonEnded:false,lifecycle:now>=start?'ACTIVE':'UPCOMING'}}const last=CAL[CAL.length-1];return{...d,race:last[0],date:last[1],circuit:last[2],timeTbd:!!last[3],seasonEnded:true,lifecycle:'SEASON_ENDED'}}
function validRanking(a){return Array.isArray(a)&&a.length>=3&&a.slice(0,5).every(r=>r&&Number(r.pos)>=1&&String(r.name||'').trim()&&Number.isFinite(Number(String(r.points||'').replace(/[^0-9.-]/g,''))))}
function validData(d){return !!d&&validRanking(d.ranking)&&String(d.race||'').trim()&&String(d.circuit||'').trim()&&Number.isFinite(Date.parse(d.date))&&['UPCOMING','ACTIVE','SEASON_ENDED'].includes(d.lifecycle)}
function removeCache(){try{if(fm.fileExists(CACHE))fm.remove(CACHE)}catch(_){} }
function save(d){try{if(!validData(d))return;fm.writeString(CACHE,JSON.stringify({schemaVersion:CACHE_SCHEMA,category:K,season:SEASON,fetchedAt:Date.now(),source:DATA_SOURCE,ranking:d.ranking,event:{race:d.race,date:d.date,circuit:d.circuit,timeTbd:!!d.timeTbd,seasonEnded:!!d.seasonEnded,lifecycle:d.lifecycle},data:d}))}catch(_){} }
function cache(){try{if(!fm.fileExists(CACHE))return null;const p=JSON.parse(fm.readString(CACHE)),age=Date.now()-Number(p?.fetchedAt);if(p?.schemaVersion!==CACHE_SCHEMA||p?.category!==K||Number(p?.season)!==SEASON||p?.source!==DATA_SOURCE||!Number.isFinite(age)||age<0||age>CACHE_MAX_AGE||!validRanking(p?.ranking)||!p?.event||!validData(p?.data)){removeCache();return null}return p.data}catch(_){removeCache();return null}}
function canonicalName(raw){const x=String(raw||'').replace(/\b(?:GBR|FIN|JPN|SWE|FRA|BEL|EST|ESP|KOR|LUX|GRC|IRL|AUT|POL|CZE|ITA|PRY|CHL|SAU|NZL|LAT)\b/gi,' ').replace(/\bImage\b.*$/i,' ').replace(/\s+/g,' ').trim();const known=Object.keys(META).find(n=>x.toLowerCase().includes(n.toLowerCase()));return known||x}
async function update(d){
 const h=await txt(DATA_SOURCE);const lo=h.indexOf('2026 FIA World Rally Championship for Drivers');if(lo<0)throw Error('WRC table identity');const hi=h.indexOf('2026 FIA WRC Masters Cup',lo+1),seg=hi>lo?h.slice(lo,hi):h.slice(lo),a=[];
 for(const c of rows(seg)){
  if(c.length<3)continue;const p=num(c[0]),pts=num(c[c.length-1]);if(!(p>=1&&p<=60)||!isFinite(pts))continue;
  const name=canonicalName(c[1]);if(!name)continue;const m=META[name]||['','',''];a.push({pos:p,name,points:`${pts} pts`,maker:m[0],machine:m[1],team:m[2]});
 }
 a.sort((x,y)=>x.pos-y.pos);const seen=new Set(),u=[];for(const r of a){if(seen.has(r.pos))continue;seen.add(r.pos);u.push(r);if(u.length>=5)break}
 if(u.length<3||u[0].pos!==1)throw Error('WRC standings');d.ranking=u;return nextEvent(d)
}
async function load(){const base=nextEvent(clone(SNAP));try{const d=await update(base);save(d);return{d,cached:false}}catch(_){const c=cache();return{d:nextEvent(c||base),cached:true}}}

function smooth(t){return t*t*(3-2*t)}
function cover(img,W,H,focus=.5,shift=0){const iw=img.size.width||1,ih=img.size.height||1,s=Math.max(W/iw,H/ih),dw=iw*s,dh=ih*s;return new Rect(-(dw-W)*focus+shift,-(dh-H)*.5,dw,dh)}
async function hero(){const small=(config.widgetFamily||'medium')==='small',p=fm.joinPath(DOC,`motorsport-hero-v1000-${small?'small':'medium'}-wrc.jpg`);if(fm.fileExists(p)){try{return fm.readImage(p)}catch(_){} }try{let img=null;for(const u of HERO.urls){try{const r=new Request(u);r.timeoutInterval=10;r.headers={'User-Agent':'Mozilla/5.0','Cache-Control':'no-cache'};img=await r.loadImage();if(img)break}catch(_){}}if(!img)return null;const W=small?360:690,H=small?360:320,ctx=new DrawContext();ctx.size=new Size(W,H);ctx.opaque=true;ctx.respectScreenScale=false;ctx.setFillColor(col(C.bg));ctx.fillRect(new Rect(0,0,W,H));ctx.drawImageInRect(img,cover(img,W,H,HERO.focus,HERO.shift*(W/690)));ctx.setFillColor(col('#030609',.18));ctx.fillRect(new Rect(0,0,W,H));for(let x=0;x<W;x+=2){const t=x/(W-1),a=.86*(1-smooth(t))+.07;ctx.setFillColor(col('#030609',a));ctx.fillRect(new Rect(x,0,3,H))}const bs=H*.68,bh=H-bs;for(let i=0;i<56;i++){const y=bs+i*(bh/56),t=i/55,a=.015+.25*t*t;ctx.setFillColor(col('#020407',a));ctx.fillRect(new Rect(0,y,W,bh/56+1))}const rs=W*.76;for(let x=rs;x<W;x+=2){const t=(x-rs)/(W-rs),a=.08+.40*smooth(t);ctx.setFillColor(col('#020407',a));ctx.fillRect(new Rect(x,0,3,H))}ctx.setFillColor(col(S.accent,.88));ctx.fillRect(new Rect(0,0,W,3));const out=ctx.getImage();try{fm.writeImage(p,out)}catch(_){}return out}catch(_){return null}}
function T(st,s,z,c,w='regular',n=1){const t=st.addText(String(s??''));t.font=w==='heavy'?Font.heavySystemFont(z):w==='bold'?Font.boldSystemFont(z):w==='semibold'?Font.semiboldSystemFont(z):Font.systemFont(z);t.textColor=c;t.lineLimit=n;t.minimumScaleFactor=.68;return t}
function rn(s){s=String(s||'');for(const[a,b]of[[/Rally del Paraguay/i,'ラリー・パラグアイ'],[/Rally Chile/i,'ラリー・チリ'],[/Rally Italia Sardegna/i,'ラリー・サルディニア'],[/Rally Saudi Arabia/i,'ラリー・サウジアラビア']])if(a.test(s))return b;return s}
function dateText(d){const x=new Date(d.date);if(!isFinite(x))return'日程未取得';const f=new DateFormatter();f.locale='ja_JP';f.timeZone='Asia/Tokyo';f.dateFormat='M/d(E)';return f.string(x)+(d.timeTbd?'・時刻未定':'')}
function countdown(d){if(d.lifecycle==='SEASON_ENDED'||d.seasonEnded)return{label:'SEASON END',live:false};const q=new Date(d.date)-Date.now(),hold=4*86400000;if(q<=0&&q>-hold)return{label:'開催中',live:true};if(q<=0)return{label:'終了',live:false};const h=q/3600000;if(d.timeTbd)return{label:`あと${Math.max(1,Math.ceil(h/24))}日`,live:false};if(h<24)return{label:`あと${Math.ceil(h)}時間`,live:false};return{label:`あと${Math.ceil(h/24)}日`,live:false}}
function sub(r){return`${r.maker||''} · ${r.machine||''}  ｜  ${r.team||''}`}
function base(bg){const w=new ListWidget();if(bg)w.backgroundImage=bg;else{const g=new LinearGradient();g.colors=[col(S.accent,.16),col(C.bg,1)];g.locations=[0,1];w.backgroundGradient=g}w.url=S.url;w.setPadding(9,12,8,12);return w}
function pill(st,label,accent=false){const p=st.addStack();p.backgroundColor=accent?col(S.accent,.18):col('#000000',.32);p.cornerRadius=8;p.setPadding(3,7,3,7);T(p,label,accent?9.6:9.1,accent?col(S.accent):col(C.muted),'heavy');return p}
function medium(d,cached,bg){const w=base(bg),ci=countdown(d);const top=w.addStack();top.layoutHorizontally();top.centerAlignContent();pill(top,S.label,true);top.addSpacer(6);T(top,d.lifecycle==='SEASON_ENDED'?'シーズン終了':'次戦',8,col(C.dim),'bold');top.addSpacer();if(cached)T(top,'• 更新待ち',6.8,col(C.warn,.78),'semibold');w.addSpacer(3);T(w,rn(d.race||'次戦取得中'),20.6,col(C.text),'heavy',1);w.addSpacer(1);const info=w.addStack();info.layoutHorizontally();info.centerAlignContent();T(info,dateText(d),10.7,col(C.muted),'semibold');info.addSpacer(5);T(info,`｜ ${d.circuit}`,9.6,col(C.dim),'semibold',1);info.addSpacer();const cp=info.addStack();cp.backgroundColor=ci.live?col(C.good,.28):col('#000000',.50);cp.cornerRadius=9;cp.setPadding(3,7,3,7);T(cp,ci.label,16.2,ci.live?col(C.good):col(C.text),'heavy');w.addSpacer(5);const hh=w.addStack();T(hh,S.rank,8.2,col(C.muted),'bold');hh.addSpacer();const ph=hh.addStack();ph.size=new Size(42,0);const pt=T(ph,'PTS',7.4,col(C.text,.96),'bold');pt.rightAlignText();w.addSpacer(2);for(const r of(d.ranking||[]).slice(0,3)){const row=w.addStack();row.layoutHorizontally();row.centerAlignContent();const ps=row.addStack();ps.size=new Size(18,0);T(ps,r.pos,11.4,col(S.accent),'heavy');row.addSpacer(4);T(row,r.name,12.8,col(C.text),'semibold');row.addSpacer();const pts=row.addStack();pts.size=new Size(42,0);pts.backgroundColor=col('#000000',.60);pts.borderWidth=.5;pts.borderColor=col('#FFFFFF',.10);pts.cornerRadius=7;pts.setPadding(1,4,1,4);const p=T(pts,String(r.points).replace(' pts',''),10.7,col(C.text,1),'heavy');p.rightAlignText();const sr=w.addStack();sr.addSpacer(22);T(sr,sub(r),8.5,col(C.dim),'semibold');w.addSpacer(1)}w.refreshAfterDate=new Date(Date.now()+15*60000);return w}
function small(d,cached,bg){const w=base(bg),ci=countdown(d);w.setPadding(10,11,9,11);const top=w.addStack();top.layoutHorizontally();top.centerAlignContent();pill(top,S.label,true);top.addSpacer(4);T(top,d.lifecycle==='SEASON_ENDED'?'終了':'次戦',7.2,col(C.dim),'semibold');top.addSpacer();const cp=top.addStack();cp.backgroundColor=ci.live?col(C.good,.30):col('#000000',.50);cp.cornerRadius=8;cp.setPadding(2,6,2,6);T(cp,ci.label,11.8,ci.live?col(C.good):col(C.text),'heavy');w.addSpacer(7);T(w,rn(d.race||'次戦取得中'),18,col(C.text),'heavy',2);w.addSpacer(3);T(w,dateText(d),9.8,col(C.muted),'semibold',1);w.addSpacer();const foot=w.addStack();foot.layoutHorizontally();const loc=foot.addStack();loc.backgroundColor=col('#000000',.48);loc.cornerRadius=7;loc.setPadding(2,5,2,5);T(loc,d.circuit,8,col(C.muted),'semibold',1);foot.addSpacer();if(cached)T(foot,'•',6.6,col(C.warn,.62),'semibold');w.refreshAfterDate=new Date(Date.now()+15*60000);return w}

let w;try{const x=await load(),bg=await hero();w=(config.widgetFamily||'medium')==='small'?small(x.d,x.cached,bg):medium(x.d,x.cached,bg)}catch(_){w=base(null);w.setPadding(12,12,12,12);pill(w,'WRC',true);w.addSpacer(8);T(w,'データ取得失敗',18,col(C.text),'heavy');w.addSpacer(3);T(w,'通信回復後に再取得します',9.5,col(C.warn),'semibold')}
if(config.runsInWidget)Script.setWidget(w);else if((config.widgetFamily||'medium')==='small')await w.presentSmall();else await w.presentMedium();Script.complete();
})();
