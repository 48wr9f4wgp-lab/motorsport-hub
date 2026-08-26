// Motorsport Hub v9.3.1-hardening — GT World Challenge Europe module
// MH_LIFECYCLE_BAKED=1
// Official GTWC Europe overall driver standings + remaining 2026 calendar. Visual output remains v9.3.0-compatible.
(async()=>{
const V='9.3.1-hardening',K='gtwceu',SEASON=2026,CACHE_SCHEMA=1,CACHE_MAX_AGE=7*86400000;
const DATA_SOURCE='https://www.gt-world-challenge-europe.com/standings?filter_standing_type=0_0_drivers';
const S={label:'GTWC EUROPE',accent:'#00D1B2',url:'https://www.gt-world-challenge-europe.com/'};
const C={bg:'#06080B',text:'#F7F9FB',muted:'#B9C2CC',dim:'#8D98A4',good:'#58DA8A',warn:'#FFB84D'};
const fm=FileManager.local(),DOC=fm.documentsDirectory(),CACHE=fm.joinPath(DOC,'motorsport-data-v930-gtwceu.json');

const SNAP={race:'Nürburgring 3H',start:'2026-08-30T15:00:00+02:00',end:'2026-08-30T18:30:00+02:00',timeTbd:false,circuit:'Nürburgring',cup:'Endurance Cup',ranking:[
 {pos:1,name:'Lucas Auer / Maro Engel',points:'114.5 pts',no:'48',machine:'Mercedes-AMG GT3 EVO',team:'Winward Racing'},
 {pos:2,name:'Ricardo Feller / Bastian Buus',points:'77 pts',no:'80',machine:'Porsche 911 GT3 R EVO',team:'Lionspeed GP'},
 {pos:3,name:'Kelvin Van Der Linde / Charles Weerts',points:'74 pts',no:'32',machine:'BMW M4 GT3 EVO',team:'Team WRT'}
]};

const CAL=[
 {race:'Nürburgring 3H',start:'2026-08-30T15:00:00+02:00',end:'2026-08-30T18:30:00+02:00',timeTbd:false,circuit:'Nürburgring',cup:'Endurance Cup'},
 {race:'Zandvoort',start:'2026-09-18T09:00:00+02:00',end:'2026-09-20T20:00:00+02:00',timeTbd:true,circuit:'Zandvoort',cup:'Sprint Cup'},
 {race:'Barcelona',start:'2026-10-02T09:00:00+02:00',end:'2026-10-04T20:00:00+02:00',timeTbd:true,circuit:'Barcelona',cup:'Sprint Cup'},
 {race:'Portimão Finale',start:'2026-10-16T09:00:00+01:00',end:'2026-10-18T20:00:00+01:00',timeTbd:true,circuit:'Portimão',cup:'Endurance Cup'}
];

const META=[
 {names:['LUCAS AUER','MARO ENGEL'],no:'48',machine:'Mercedes-AMG GT3 EVO',team:'Winward Racing'},
 {names:['RICARDO FELLER','BASTIAN BUUS'],no:'80',machine:'Porsche 911 GT3 R EVO',team:'Lionspeed GP'},
 {names:['KELVIN VAN DER LINDE','CHARLES WEERTS'],no:'32',machine:'BMW M4 GT3 EVO',team:'Team WRT'}
];

// Exact Commons page verified: Lukas Raich / CC BY-SA 4.0.
const HERO_URLS=[
 'https://commons.wikimedia.org/wiki/Special:Redirect/file/GT%20World%20Challenge%20Europe%202024%20N%C3%BCrburg%20Nr.%2048%20Auer%2C%20Engel%2C%20Morad%20%281%29.jpg?width=2048',
 'https://commons.wikimedia.org/wiki/Special:Redirect/file/GT%20World%20Challenge%20Europe%202024%20N%C3%BCrburg%20Nr.%2048%20Auer%2C%20Engel%2C%20Morad%20%281%29.jpg?width=1280'
];

const col=(h,a=1)=>new Color(h,a),clone=o=>JSON.parse(JSON.stringify(o)),num=v=>{const m=String(v||'').replace(/,/g,'').match(/-?\d+(?:\.\d+)?/);return m?Number(m[0]):NaN};
const clean=s=>String(s||'').replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&nbsp;|&#160;/gi,' ').replace(/&amp;/gi,'&').replace(/&#39;|&apos;/gi,"'").replace(/&oslash;/gi,'ø').replace(/&Oslash;/gi,'Ø').replace(/\s+/g,' ').trim();
function rows(h){const out=[];for(const tr of String(h||'').match(/<tr\b[\s\S]*?<\/tr>/gi)||[]){const a=[];let m,re=/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi;while((m=re.exec(tr)))a.push(clean(m[1]));if(a.length)out.push(a)}return out}
async function txt(url){const r=new Request(url);r.timeoutInterval=10;r.headers={'User-Agent':'Mozilla/5.0 MotorsportHub/9.3','Cache-Control':'no-cache'};return await r.loadString()}
function nextEvent(d){const now=Date.now();for(const e of CAL){const s=Date.parse(e.start),end=Date.parse(e.end);if(now<end)return{...d,...e,seasonEnded:false,lifecycle:now>=s?'ACTIVE':'UPCOMING'}}const last=CAL[CAL.length-1];return{...d,...last,seasonEnded:true,lifecycle:'SEASON_ENDED'}}
function validRanking(a){return Array.isArray(a)&&a.length>=3&&a.slice(0,5).every(r=>r&&Number(r.pos)>=1&&String(r.name||'').trim()&&Number.isFinite(Number(String(r.points||'').replace(/[^0-9.-]/g,''))))}
function validData(d){return !!d&&typeof d==='object'&&validRanking(d.ranking)&&String(d.race||'').trim()&&String(d.circuit||'').trim()&&Number.isFinite(Date.parse(d.start))&&Number.isFinite(Date.parse(d.end))}
function removeCache(){try{if(fm.fileExists(CACHE))fm.remove(CACHE)}catch(_){} }
function save(d){try{if(!validData(d))return;const payload={schemaVersion:CACHE_SCHEMA,category:K,season:SEASON,fetchedAt:Date.now(),source:DATA_SOURCE,ranking:d.ranking,event:{race:d.race,start:d.start,end:d.end,circuit:d.circuit,seasonEnded:!!d.seasonEnded},data:d};fm.writeString(CACHE,JSON.stringify(payload))}catch(_){} }
function cache(){try{if(!fm.fileExists(CACHE))return null;const p=JSON.parse(fm.readString(CACHE)),age=Date.now()-Number(p?.fetchedAt);if(p?.schemaVersion!==CACHE_SCHEMA||p?.category!==K||Number(p?.season)!==SEASON||p?.source!==DATA_SOURCE||!Number.isFinite(age)||age<0||age>CACHE_MAX_AGE||!validRanking(p?.ranking)||!p?.event||!validData(p?.data)){removeCache();return null}return p.data}catch(_){removeCache();return null}}
function metaFor(names){const u=names.map(x=>x.toUpperCase());return META.find(m=>m.names.every(n=>u.some(x=>x.includes(n)||n.includes(x))))||null}
async function update(d){
 const h=await txt(DATA_SOURCE),groups=new Map();
 for(const c of rows(h)){
  if(c.length<3)continue;const p=num(c[0]),name=String(c[1]||'').trim(),pts=num(c[2]);
  if(!(p>=1&&p<=60)||!name||!isFinite(pts))continue;
  const key=`${p}|${pts}`;if(!groups.has(key))groups.set(key,{pos:p,points:pts,names:[]});const g=groups.get(key);if(!g.names.includes(name)&&g.names.length<2)g.names.push(name);
 }
 const ranked=[...groups.values()].filter(g=>g.names.length).sort((a,b)=>a.pos-b.pos||b.points-a.points),out=[];
 const seen=new Set();for(const g of ranked){if(seen.has(g.pos))continue;seen.add(g.pos);const m=metaFor(g.names);out.push({pos:g.pos,name:g.names.join(' / '),points:`${g.points} pts`,no:m?.no||'',machine:m?.machine||'GT3',team:m?.team||'GTWC Europe'});if(out.length>=5)break}
 if(out.length<3)throw Error('GTWC Europe standings');d.ranking=out;return nextEvent(d)
}
async function load(){const base=nextEvent(clone(SNAP));try{const d=await update(base);save(d);return{d,cached:false}}catch(e){const c=cache();return{d:nextEvent(c||base),cached:true}}}
function smooth(t){return t*t*(3-2*t)}
function cover(img,W,H,focus=.54,shift=0){const iw=img.size.width||1,ih=img.size.height||1,s=Math.max(W/iw,H/ih),dw=iw*s,dh=ih*s;return new Rect(-(dw-W)*focus+shift,-(dh-H)*.5,dw,dh)}
async function hero(){
 const small=(config.widgetFamily||'medium')==='small',p=fm.joinPath(DOC,`motorsport-hero-v930-${small?'small':'medium'}-gtwceu.jpg`);
 if(fm.fileExists(p)){try{return fm.readImage(p)}catch(_){} }
 try{let img=null;for(const u of HERO_URLS){try{const r=new Request(`${u}&v=930`);r.timeoutInterval=12;r.headers={'User-Agent':'Mozilla/5.0','Cache-Control':'no-cache'};img=await r.loadImage();if(img)break}catch(_){}}if(!img)return null;
  const W=small?720:1380,H=small?720:640,ctx=new DrawContext();ctx.size=new Size(W,H);ctx.opaque=true;ctx.respectScreenScale=false;ctx.setFillColor(col(C.bg));ctx.fillRect(new Rect(0,0,W,H));ctx.drawImageInRect(img,cover(img,W,H,.53,small?18:54));ctx.setFillColor(col('#030609',.10));ctx.fillRect(new Rect(0,0,W,H));
  for(let x=0;x<W;x+=3){const t=x/(W-1),a=.82*(1-smooth(t))+.055;ctx.setFillColor(col('#030609',a));ctx.fillRect(new Rect(x,0,4,H))}
  const rs=W*.76;for(let x=rs;x<W;x+=3){const t=(x-rs)/(W-rs),a=.08+.40*smooth(t);ctx.setFillColor(col('#020407',a));ctx.fillRect(new Rect(x,0,4,H))}
  const bs=H*.67,bh=H-bs;for(let i=0;i<56;i++){const y=bs+i*(bh/56),t=i/55,a=.015+.22*t*t;ctx.setFillColor(col('#020407',a));ctx.fillRect(new Rect(0,y,W,bh/56+1))}
  ctx.setFillColor(col(S.accent,.92));ctx.fillRect(new Rect(0,0,W,5));const out=ctx.getImage();try{fm.writeImage(p,out)}catch(_){}return out
 }catch(_){return null}
}
function T(st,s,z,c,w='regular',n=1){const t=st.addText(String(s??''));t.font=w==='heavy'?Font.heavySystemFont(z):w==='bold'?Font.boldSystemFont(z):w==='semibold'?Font.semiboldSystemFont(z):Font.systemFont(z);t.textColor=c;t.lineLimit=n;t.minimumScaleFactor=.64;return t}
function base(bg){const w=new ListWidget();if(bg)w.backgroundImage=bg;else{const g=new LinearGradient();g.colors=[col(S.accent,.16),col(C.bg)];g.locations=[0,1];w.backgroundGradient=g}w.url=S.url;return w}
function pill(st,label,accent=false){const p=st.addStack();p.backgroundColor=accent?col(S.accent,.22):col('#000000',.38);p.cornerRadius=8;p.setPadding(3,7,3,7);T(p,label,accent?8.3:9.1,accent?col(S.accent):col(C.muted),'heavy');return p}
function dateText(d){const f=new DateFormatter();f.locale='ja_JP';f.timeZone='Asia/Tokyo';f.dateFormat=d.timeTbd?'M/d(E)':'M/d(E) HH:mm';return f.string(new Date(d.start))+(d.timeTbd?'・時刻未定':'')}
function raceName(s){if(/Nürburgring/i.test(s))return'ニュルブルクリンク 3H';if(/Zandvoort/i.test(s))return'ザントフォールト';if(/Barcelona/i.test(s))return'バルセロナ';if(/Portim/i.test(s))return'ポルティマオ 最終戦';return s}
function countdown(d){if(d.lifecycle==='SEASON_ENDED'||d.seasonEnded)return{label:'SEASON END',live:false};const now=Date.now(),s=Date.parse(d.start),e=Date.parse(d.end);if(now>=s&&now<e)return{label:'開催中',live:true};const q=s-now;if(q<=0)return{label:'終了',live:false};const h=q/3600000;if(h<24)return{label:`あと${Math.ceil(h)}時間`,live:false};return{label:`あと${Math.ceil(h/24)}日`,live:false}}
function sub(r){return [`#${r.no||'?'}`,r.machine||'GT3'].filter(Boolean).join(' · ')+`  ｜  ${r.team||'GTWC Europe'}`}
function medium(d,cached,bg){const w=base(bg),ci=countdown(d);w.setPadding(9,12,8,12);const top=w.addStack();top.layoutHorizontally();top.centerAlignContent();pill(top,'GTWC EUROPE',true);top.addSpacer(6);T(top,d.lifecycle==='SEASON_ENDED'?'シーズン終了':'次戦',8,col(C.dim),'bold');top.addSpacer();if(cached)T(top,'• 更新待ち',6.8,col(C.warn,.80),'semibold');w.addSpacer(3);T(w,raceName(d.race),19.6,col(C.text),'heavy',1);w.addSpacer(1);const info=w.addStack();info.layoutHorizontally();info.centerAlignContent();T(info,dateText(d),10.3,col(C.muted),'semibold');info.addSpacer(5);T(info,`｜ ${d.circuit}`,9.2,col(C.dim),'semibold',1);info.addSpacer();const cp=info.addStack();cp.backgroundColor=ci.live?col(C.good,.28):col('#000000',.50);cp.cornerRadius=9;cp.setPadding(3,7,3,7);T(cp,ci.label,15.2,ci.live?col(C.good):col(C.text),'heavy');w.addSpacer(5);const hh=w.addStack();T(hh,'ドライバー',8.2,col(C.muted),'bold');hh.addSpacer();const ph=hh.addStack();ph.size=new Size(42,0);const pht=T(ph,'PTS',7.4,col(C.text,.96),'bold');pht.rightAlignText();w.addSpacer(2);for(const r of (d.ranking||[]).slice(0,3)){const row=w.addStack();row.layoutHorizontally();row.centerAlignContent();const ps=row.addStack();ps.size=new Size(18,0);T(ps,r.pos,11.4,col(S.accent),'heavy');row.addSpacer(4);T(row,r.name,11.2,col(C.text),'semibold');row.addSpacer();const pts=row.addStack();pts.size=new Size(42,0);pts.backgroundColor=col('#000000',.48);pts.cornerRadius=7;pts.setPadding(1,4,1,4);const p=T(pts,String(r.points).replace(' pts',''),10.7,col(C.text,1),'heavy');p.rightAlignText();const sr=w.addStack();sr.addSpacer(22);T(sr,sub(r),8.0,col(C.dim),'semibold');w.addSpacer(1)}w.refreshAfterDate=new Date(Date.now()+15*60000);return w}
function small(d,cached,bg){const w=base(bg),ci=countdown(d);w.setPadding(10,11,9,11);const top=w.addStack();top.layoutHorizontally();top.centerAlignContent();pill(top,'GTWC EU',true);top.addSpacer(4);T(top,d.lifecycle==='SEASON_ENDED'?'シーズン終了':'次戦',7.2,col(C.dim),'semibold');top.addSpacer();const cp=top.addStack();cp.backgroundColor=ci.live?col(C.good,.30):col('#000000',.50);cp.cornerRadius=8;cp.setPadding(2,6,2,6);T(cp,ci.label,11.6,ci.live?col(C.good):col(C.text),'heavy');w.addSpacer(7);T(w,raceName(d.race),16.4,col(C.text),'heavy',2);w.addSpacer(3);T(w,dateText(d),9.6,col(C.muted),'semibold',1);w.addSpacer();const foot=w.addStack();foot.layoutHorizontally();const loc=foot.addStack();loc.backgroundColor=col('#000000',.48);loc.cornerRadius=7;loc.setPadding(2,5,2,5);T(loc,d.circuit,8,col(C.muted),'semibold',1);foot.addSpacer();if(cached)T(foot,'•',6.6,col(C.warn,.65),'semibold');w.refreshAfterDate=new Date(Date.now()+15*60000);return w}
let w;try{const x=await load(),bg=await hero();w=(config.widgetFamily||'medium')==='small'?small(x.d,x.cached,bg):medium(x.d,x.cached,bg)}catch(e){w=base(null);w.setPadding(12,12,12,12);pill(w,'GTWC EUROPE',true);w.addSpacer(8);T(w,'データ取得失敗',18,col(C.text),'heavy');w.addSpacer(3);T(w,'通信回復後に再取得します',9.5,col(C.warn),'semibold')}
if(config.runsInWidget)Script.setWidget(w);else if((config.widgetFamily||'medium')==='small')await w.presentSmall();else await w.presentMedium();Script.complete();
})();