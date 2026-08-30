// Motorsport Hub v9.1.1-hardening — INDYCAR module
// MH_LIFECYCLE_BAKED=1
// Official 2026 INDYCAR schedule + championship standings. Visual output remains v9.1.0-compatible.
(async()=>{
const V='9.1.1-hardening',K='indycar',SEASON=2026,CACHE_SCHEMA=1,CACHE_MAX_AGE=7*86400000;
const DATA_SOURCE='https://www.indycar.com/standings/';
const S={label:'INDYCAR',accent:'#4C8DFF',url:'https://www.indycar.com/'};
const C={bg:'#06080B',text:'#F7F9FB',muted:'#B9C2CC',dim:'#8D98A4',good:'#58DA8A',warn:'#FFB84D'};
const fm=FileManager.local(),DOC=fm.documentsDirectory(),CACHE=fm.joinPath(DOC,'motorsport-data-v910-indycar.json');

const SNAP={race:'Milwaukee Race 1',start:'2026-08-29T14:30:00-04:00',end:'2026-08-29T18:30:00-04:00',circuit:'Milwaukee Mile',ranking:[
 {pos:1,no:'10',name:'Alex Palou',points:'553 pts',team:'Chip Ganassi Racing',engine:'HONDA'},
 {pos:2,no:'27',name:'Kyle Kirkwood',points:'462 pts',team:'Andretti Global',engine:'HONDA'},
 {pos:3,no:'7',name:'Christian Lundgaard',points:'443 pts',team:'Arrow McLaren',engine:'CHEVROLET'}
]};

const CAL=[
 {race:'Milwaukee Race 1',start:'2026-08-29T14:30:00-04:00',end:'2026-08-29T18:30:00-04:00',circuit:'Milwaukee Mile'},
 {race:'Milwaukee Race 2',start:'2026-08-30T13:00:00-04:00',end:'2026-08-30T17:00:00-04:00',circuit:'Milwaukee Mile'},
 {race:'Laguna Seca Finale',start:'2026-09-06T14:30:00-04:00',end:'2026-09-06T18:30:00-04:00',circuit:'WeatherTech Raceway Laguna Seca'}
];

const META={
 'ALEX PALOU':['10','Chip Ganassi Racing','HONDA'],
 'KYLE KIRKWOOD':['27','Andretti Global','HONDA'],
 'CHRISTIAN LUNDGAARD':['7','Arrow McLaren','CHEVROLET'],
 'DAVID MALUKAS':['12','Team Penske','CHEVROLET'],
 "PATO O'WARD":['5','Arrow McLaren','CHEVROLET'],
 'JOSEF NEWGARDEN':['2','Team Penske','CHEVROLET'],
 'MARCUS ERICSSON':['28','Andretti Global','HONDA'],
 'FELIX ROSENQVIST':['60','Meyer Shank Racing','HONDA'],
 'SCOTT MCLAUGHLIN':['3','Team Penske','CHEVROLET']
};

// Exact Commons page verified: Ben Goyette / CC BY-SA 4.0.
const HERO_URLS=[
 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Alex%20Palou%20%2854686833932%29.jpg?width=2048',
 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Alex%20Palou%20%2854686833932%29.jpg?width=1280'
];

const col=(h,a=1)=>new Color(h,a),clone=o=>JSON.parse(JSON.stringify(o)),num=v=>{const m=String(v||'').replace(/,/g,'').match(/-?\d+(?:\.\d+)?/);return m?Number(m[0]):NaN};
const clean=s=>String(s||'').replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&nbsp;|&#160;/gi,' ').replace(/&amp;/gi,'&').replace(/&#39;|&apos;/gi,"'").replace(/\s+/g,' ').trim();
function rows(h){const out=[];for(const tr of String(h||'').match(/<tr\b[\s\S]*?<\/tr>/gi)||[]){const a=[];let m,re=/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi;while((m=re.exec(tr)))a.push(clean(m[1]));if(a.length)out.push({raw:tr,cells:a})}return out}
async function txt(url){const r=new Request(url);r.timeoutInterval=10;r.headers={'User-Agent':'Mozilla/5.0 MotorsportHub/9.1','Cache-Control':'no-cache'};return await r.loadString()}
function nextEvent(d){const now=Date.now();for(const e of CAL){const s=Date.parse(e.start),end=Date.parse(e.end);if(now<end)return{...d,...e,seasonEnded:false,lifecycle:now>=s?'ACTIVE':'UPCOMING'}}const last=CAL[CAL.length-1];return{...d,...last,seasonEnded:true,lifecycle:'SEASON_ENDED'}}
function validRanking(a){return Array.isArray(a)&&a.length>=3&&a.slice(0,5).every(r=>r&&Number(r.pos)>=1&&String(r.name||'').trim()&&Number.isFinite(Number(String(r.points||'').replace(/[^0-9.-]/g,''))))}
function validData(d){return !!d&&typeof d==='object'&&validRanking(d.ranking)&&String(d.race||'').trim()&&String(d.circuit||'').trim()&&Number.isFinite(Date.parse(d.start))&&Number.isFinite(Date.parse(d.end))}
function removeCache(){try{if(fm.fileExists(CACHE))fm.remove(CACHE)}catch(_){} }
function save(d){try{if(!validData(d))return;const payload={schemaVersion:CACHE_SCHEMA,category:K,season:SEASON,fetchedAt:Date.now(),source:DATA_SOURCE,ranking:d.ranking,event:{race:d.race,start:d.start,end:d.end,circuit:d.circuit,seasonEnded:!!d.seasonEnded},data:d};fm.writeString(CACHE,JSON.stringify(payload))}catch(_){} }
function cache(){try{if(!fm.fileExists(CACHE))return null;const p=JSON.parse(fm.readString(CACHE)),age=Date.now()-Number(p?.fetchedAt);if(p?.schemaVersion!==CACHE_SCHEMA||p?.category!==K||Number(p?.season)!==SEASON||p?.source!==DATA_SOURCE||!Number.isFinite(age)||age<0||age>CACHE_MAX_AGE||!validRanking(p?.ranking)||!p?.event||!validData(p?.data)){removeCache();return null}return p.data}catch(_){removeCache();return null}}
function driverFromRow(raw,cells){
 const flat=clean(raw);for(const n of Object.keys(META)){const pretty=n.split(' ').map(x=>x.charAt(0)+x.slice(1).toLowerCase()).join(' ');if(flat.toUpperCase().includes(n))return pretty.replace("O'ward","O'Ward").replace('Mclaughlin','McLaughlin')}
 const slug=raw.match(/\/Drivers\/([^"'?#/]+)/i)?.[1];if(slug){try{return decodeURIComponent(slug).replace(/-/g,' ').replace(/\s+/g,' ').trim()}catch(_){}}
 const x=String(cells[2]||'').trim();return x
}
async function update(d){
 const h=await txt(DATA_SOURCE),a=[];
 for(const r of rows(h)){
  const c=r.cells,p=num(c[0]),name=driverFromRow(r.raw,c),pts=num(c[5]??c[c.length-7]);
  if(!(p>=1&&p<=40)||!name||!isFinite(pts))continue;
  const meta=META[name.toUpperCase()]||['',String(c[3]||'').trim(),String(c[4]||'').trim().toUpperCase()];
  a.push({pos:p,no:meta[0],name,points:`${pts} pts`,team:meta[1]||'INDYCAR',engine:meta[2]||''});
 }
 a.sort((x,y)=>x.pos-y.pos);const seen=new Set(),u=[];for(const r of a){if(seen.has(r.pos))continue;seen.add(r.pos);u.push(r);if(u.length>=5)break}
 if(u.length<3)throw Error('INDYCAR standings');d.ranking=u;return nextEvent(d)
}
async function load(){const base=nextEvent(clone(SNAP));try{const d=await update(base);save(d);return{d,cached:false}}catch(e){const c=cache();return{d:nextEvent(c||base),cached:true}}}
function smooth(t){return t*t*(3-2*t)}
function cover(img,W,H,focus=.54,shift=0){const iw=img.size.width||1,ih=img.size.height||1,s=Math.max(W/iw,H/ih),dw=iw*s,dh=ih*s;return new Rect(-(dw-W)*focus+shift,-(dh-H)*.5,dw,dh)}
async function hero(){
 const __mhDynamicHero=globalThis.__MH_HERO_OVERRIDE_IMAGE;if(__mhDynamicHero)return __mhDynamicHero;
 const small=(config.widgetFamily||'medium')==='small',p=fm.joinPath(DOC,`motorsport-hero-v910-${small?'small':'medium'}-indycar.jpg`);
 if(fm.fileExists(p)){try{return fm.readImage(p)}catch(_){} }
 try{let img=null;for(const u of HERO_URLS){try{const r=new Request(`${u}&v=910`);r.timeoutInterval=12;r.headers={'User-Agent':'Mozilla/5.0','Cache-Control':'no-cache'};img=await r.loadImage();if(img)break}catch(_){}}if(!img)return null;
  const W=small?720:1380,H=small?720:640,ctx=new DrawContext();ctx.size=new Size(W,H);ctx.opaque=true;ctx.respectScreenScale=false;ctx.setFillColor(col(C.bg));ctx.fillRect(new Rect(0,0,W,H));ctx.drawImageInRect(img,cover(img,W,H,.50,small?18:55));ctx.setFillColor(col('#030609',.10));ctx.fillRect(new Rect(0,0,W,H));
  for(let x=0;x<W;x+=3){const t=x/(W-1),a=.82*(1-smooth(t))+.055;ctx.setFillColor(col('#030609',a));ctx.fillRect(new Rect(x,0,4,H))}
  const rs=W*.76;for(let x=rs;x<W;x+=3){const t=(x-rs)/(W-rs),a=.08+.40*smooth(t);ctx.setFillColor(col('#020407',a));ctx.fillRect(new Rect(x,0,4,H))}
  const bs=H*.67,bh=H-bs;for(let i=0;i<56;i++){const y=bs+i*(bh/56),t=i/55,a=.015+.22*t*t;ctx.setFillColor(col('#020407',a));ctx.fillRect(new Rect(0,y,W,bh/56+1))}
  ctx.setFillColor(col(S.accent,.92));ctx.fillRect(new Rect(0,0,W,5));const out=ctx.getImage();try{fm.writeImage(p,out)}catch(_){}return out
 }catch(_){return null}
}
function T(st,s,z,c,w='regular',n=1){const t=st.addText(String(s??''));t.font=w==='heavy'?Font.heavySystemFont(z):w==='bold'?Font.boldSystemFont(z):w==='semibold'?Font.semiboldSystemFont(z):Font.systemFont(z);t.textColor=c;t.lineLimit=n;t.minimumScaleFactor=.66;return t}
function base(bg){const w=new ListWidget();if(bg)w.backgroundImage=bg;else{const g=new LinearGradient();g.colors=[col(S.accent,.16),col(C.bg)];g.locations=[0,1];w.backgroundGradient=g}w.url=S.url;return w}
function pill(st,label,accent=false){const p=st.addStack();p.backgroundColor=accent?col(S.accent,.22):col('#000000',.38);p.cornerRadius=8;p.setPadding(3,7,3,7);T(p,label,accent?9.1:9.1,accent?col(S.accent):col(C.muted),'heavy');return p}
function dateText(d){const f=new DateFormatter();f.locale='ja_JP';f.timeZone='Asia/Tokyo';f.dateFormat='M/d(E) HH:mm';return f.string(new Date(d.start))}
function raceName(s){if(/Milwaukee Race 1/i.test(s))return'ミルウォーキー Race 1';if(/Milwaukee Race 2/i.test(s))return'ミルウォーキー Race 2';if(/Laguna Seca/i.test(s))return'ラグナ・セカ 最終戦';return s}
function venue(s){if(/Milwaukee/i.test(s))return'Milwaukee Mile';if(/Laguna/i.test(s))return'Laguna Seca';return s}
function countdown(d){if(d.lifecycle==='SEASON_ENDED'||d.seasonEnded)return{label:'SEASON END',live:false};const now=Date.now(),s=Date.parse(d.start),e=Date.parse(d.end);if(now>=s&&now<e)return{label:'開催中',live:true};const q=s-now;if(q<=0)return{label:'終了',live:false};const h=q/3600000;if(h<24)return{label:`あと${Math.ceil(h)}時間`,live:false};return{label:`あと${Math.ceil(h/24)}日`,live:false}}
function sub(r){return [`#${r.no||'?'}`,r.engine||''].filter(Boolean).join(' · ')+`  ｜  ${r.team||'INDYCAR'}`}
function medium(d,cached,bg){const w=base(bg),ci=countdown(d);w.setPadding(9,12,8,12);const top=w.addStack();top.layoutHorizontally();top.centerAlignContent();pill(top,'INDYCAR',true);top.addSpacer(6);T(top,d.lifecycle==='SEASON_ENDED'?'シーズン終了':'次戦',8,col(C.dim),'bold');top.addSpacer();if(cached)T(top,'• 更新待ち',6.8,col(C.warn,.80),'semibold');w.addSpacer(3);T(w,raceName(d.race),20.2,col(C.text),'heavy',1);w.addSpacer(1);const info=w.addStack();info.layoutHorizontally();info.centerAlignContent();T(info,dateText(d),10.5,col(C.muted),'semibold');info.addSpacer(5);T(info,`｜ ${venue(d.circuit)}`,9.4,col(C.dim),'semibold',1);info.addSpacer();const cp=info.addStack();cp.backgroundColor=ci.live?col(C.good,.28):col('#000000',.50);cp.cornerRadius=9;cp.setPadding(3,7,3,7);T(cp,ci.label,15.5,ci.live?col(C.good):col(C.text),'heavy');w.addSpacer(5);const hh=w.addStack();T(hh,'ドライバー',8.2,col(C.muted),'bold');hh.addSpacer();const ph=hh.addStack();ph.size=new Size(42,0);const pht=T(ph,'PTS',7.4,col(C.text,.96),'bold');pht.rightAlignText();w.addSpacer(2);for(const r of (d.ranking||[]).slice(0,3)){const row=w.addStack();row.layoutHorizontally();row.centerAlignContent();const ps=row.addStack();ps.size=new Size(18,0);T(ps,r.pos,11.4,col(S.accent),'heavy');row.addSpacer(4);T(row,r.name,12.5,col(C.text),'semibold');row.addSpacer();const pts=row.addStack();pts.size=new Size(42,0);pts.backgroundColor=col('#000000',.48);pts.cornerRadius=7;pts.setPadding(1,4,1,4);const p=T(pts,String(r.points).replace(' pts',''),10.7,col(C.text,1),'heavy');p.rightAlignText();const sr=w.addStack();sr.addSpacer(22);T(sr,sub(r),8.2,col(C.dim),'semibold');w.addSpacer(1)}w.refreshAfterDate=new Date(Date.now()+15*60000);return w}
function small(d,cached,bg){const w=base(bg),ci=countdown(d);w.setPadding(10,11,9,11);const top=w.addStack();top.layoutHorizontally();top.centerAlignContent();pill(top,'INDY',true);top.addSpacer(4);T(top,d.lifecycle==='SEASON_ENDED'?'シーズン終了':'次戦',7.2,col(C.dim),'semibold');top.addSpacer();const cp=top.addStack();cp.backgroundColor=ci.live?col(C.good,.30):col('#000000',.50);cp.cornerRadius=8;cp.setPadding(2,6,2,6);T(cp,ci.label,11.6,ci.live?col(C.good):col(C.text),'heavy');w.addSpacer(7);T(w,raceName(d.race),17.2,col(C.text),'heavy',2);w.addSpacer(3);T(w,dateText(d),9.8,col(C.muted),'semibold',1);w.addSpacer();const foot=w.addStack();foot.layoutHorizontally();const loc=foot.addStack();loc.backgroundColor=col('#000000',.48);loc.cornerRadius=7;loc.setPadding(2,5,2,5);T(loc,venue(d.circuit),8,col(C.muted),'semibold',1);foot.addSpacer();if(cached)T(foot,'•',6.6,col(C.warn,.65),'semibold');w.refreshAfterDate=new Date(Date.now()+15*60000);return w}
let w;try{const x=await load(),bg=await hero();w=(config.widgetFamily||'medium')==='small'?small(x.d,x.cached,bg):medium(x.d,x.cached,bg)}catch(e){w=base(null);w.setPadding(12,12,12,12);pill(w,'INDYCAR',true);w.addSpacer(8);T(w,'データ取得失敗',18,col(C.text),'heavy');w.addSpacer(3);T(w,'通信回復後に再取得します',9.5,col(C.warn),'semibold')}
if(config.runsInWidget)Script.setWidget(w);else if((config.widgetFamily||'medium')==='small')await w.presentSmall();else await w.presentMedium();Script.complete();
})();