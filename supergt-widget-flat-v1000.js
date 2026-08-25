// Motorsport Hub v10.0.0-hardening — flattened SUPER GT module
// Completed GT500 runtime: official driver ranking + 2026 domestic tail + verified CC0 hero only + validated cache.
(async()=>{
const V='10.0.0-hardening',K='supergt',SEASON=2026,CACHE_SCHEMA=1,CACHE_MAX_AGE=7*86400000;
const DATA_SOURCE='https://supergt.net/driver_ranking?gt_class=gt500&series=2026';
const S={label:'SUPER GT',accent:'#F5B942',rank:'GT500',url:'https://supergt.net/'};
const C={bg:'#06080B',text:'#F7F9FB',muted:'#B9C2CC',dim:'#8D98A4',good:'#58DA8A',warn:'#FFB84D'};
const fm=FileManager.local(),DOC=fm.documentsDirectory(),CACHE=fm.joinPath(DOC,'motorsport-data-v1000-supergt.json');
const SNAP={race:'第6戦 SUGO',date:'2026-09-20T12:00:00+09:00',timeTbd:true,circuit:'スポーツランドSUGO',seasonEnded:false,lifecycle:'UPCOMING',ranking:[
 {pos:1,no:'36',name:'坪井 翔 / 山下 健太',points:'50 pts',maker:'TOYOTA',machine:'GR Supra',team:"au TOM'S"},
 {pos:2,no:'16',name:'野尻 智紀 / 佐藤 蓮',points:'33 pts',maker:'HONDA',machine:'PRELUDE-GT',team:'ARTA'},
 {pos:3,no:'14',name:'福住 仁嶺 / 大嶋 和也',points:'31 pts',maker:'TOYOTA',machine:'GR Supra',team:'ROOKIE'}
]};
const CAL=[
 ['第6戦 SUGO','2026-09-20T12:00:00+09:00','スポーツランドSUGO',true],
 ['第7戦 AUTOPOLIS','2026-10-18T12:00:00+09:00','オートポリス',true],
 ['第8戦 MOTEGI','2026-11-08T12:00:00+09:00','モビリティリゾートもてぎ',true]
];
const META={
 '36':{name:'坪井 翔 / 山下 健太',maker:'TOYOTA',machine:'GR Supra',team:"au TOM'S"},
 '16':{name:'野尻 智紀 / 佐藤 蓮',maker:'HONDA',machine:'PRELUDE-GT',team:'ARTA'},
 '14':{name:'福住 仁嶺 / 大嶋 和也',maker:'TOYOTA',machine:'GR Supra',team:'ROOKIE'}
};
// Exact Commons page verified: Tokumeigakarinoaoshima / CC0 1.0. No unattributed fallback is allowed.
const HERO_URLS=[
 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Osaka%20Auto%20Messe%202025%20%281%29%20-%20No.36%20au%20TOM%27S%20GR%20Supra%20in%202024%20SUPER%20GT.jpg?width=2048',
 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Osaka%20Auto%20Messe%202025%20%281%29%20-%20No.36%20au%20TOM%27S%20GR%20Supra%20in%202024%20SUPER%20GT.jpg?width=1280'
];
const col=(h,a=1)=>new Color(h,a),clone=o=>JSON.parse(JSON.stringify(o)),num=v=>{const m=String(v||'').replace(/,/g,'').match(/-?\d+(?:\.\d+)?/);return m?Number(m[0]):NaN};
const clean=s=>String(s||'').replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&nbsp;|&#160;/gi,' ').replace(/&amp;/gi,'&').replace(/&#39;|&apos;/gi,"'").replace(/\s+/g,' ').trim();
function rows(h){const out=[];for(const tr of String(h||'').match(/<tr\b[\s\S]*?<\/tr>/gi)||[]){const a=[];let m,re=/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi;while((m=re.exec(tr)))a.push(clean(m[1]));if(a.length)out.push(a)}return out}
async function txt(url){const r=new Request(url);r.timeoutInterval=9;r.headers={'User-Agent':'Mozilla/5.0 MotorsportHub/10.0','Cache-Control':'no-cache'};return await r.loadString()}
function nextEvent(d){const now=Date.now(),hold=8*3600000;for(const e of CAL){const start=Date.parse(e[1]),end=start+hold;if(now<end)return{...d,race:e[0],date:e[1],circuit:e[2],timeTbd:!!e[3],seasonEnded:false,lifecycle:now>=start?'ACTIVE':'UPCOMING'}}const last=CAL[CAL.length-1];return{...d,race:last[0],date:last[1],circuit:last[2],timeTbd:!!last[3],seasonEnded:true,lifecycle:'SEASON_ENDED'}}
function validRanking(a){return Array.isArray(a)&&a.length>=3&&a.slice(0,5).every(r=>r&&Number(r.pos)>=1&&String(r.name||'').trim()&&Number.isFinite(Number(String(r.points||'').replace(/[^0-9.-]/g,'')))&&String(r.machine||'').trim())}
function validData(d){return !!d&&validRanking(d.ranking)&&String(d.race||'').trim()&&String(d.circuit||'').trim()&&Number.isFinite(Date.parse(d.date))&&['UPCOMING','ACTIVE','SEASON_ENDED'].includes(d.lifecycle)}
function removeCache(){try{if(fm.fileExists(CACHE))fm.remove(CACHE)}catch(_){} }
function save(d){try{if(!validData(d))return;fm.writeString(CACHE,JSON.stringify({schemaVersion:CACHE_SCHEMA,category:K,season:SEASON,fetchedAt:Date.now(),source:DATA_SOURCE,ranking:d.ranking,event:{race:d.race,date:d.date,circuit:d.circuit,timeTbd:!!d.timeTbd,seasonEnded:!!d.seasonEnded,lifecycle:d.lifecycle},data:d}))}catch(_){} }
function cache(){try{if(!fm.fileExists(CACHE))return null;const p=JSON.parse(fm.readString(CACHE)),age=Date.now()-Number(p?.fetchedAt);if(p?.schemaVersion!==CACHE_SCHEMA||p?.category!==K||Number(p?.season)!==SEASON||p?.source!==DATA_SOURCE||!Number.isFinite(age)||age<0||age>CACHE_MAX_AGE||!validRanking(p?.ranking)||!p?.event||!validData(p?.data)){removeCache();return null}return p.data}catch(_){removeCache();return null}}
function fallbackName(raw){const s=String(raw||'').replace(/　/g,' ').replace(/\s+/g,' ').trim();return s||'GT500 DRIVER'}
async function update(d){
 const h=await txt(DATA_SOURCE);if(!/GT\s*500/i.test(h)||!/(?:ドライバーランキング|Driver Ranking)/i.test(h))throw Error('SUPER GT table identity');const lo=Math.max(h.search(/GT\s*500/i),0),gt300=h.search(/GT\s*300/i),seg=gt300>lo?h.slice(lo,gt300):h.slice(lo),a=[];
 for(const c of rows(seg)){
  if(c.length<6)continue;const p=num(c[0]),no=String(c[1]||'').match(/\d+/)?.[0]||'',pts=num(c[c.length-3]);if(!(p>=1&&p<=30)||!no||!isFinite(pts))continue;
  const meta=META[no]||{name:fallbackName(c[2]),maker:'',machine:'GT500',team:`No.${no}`};
  a.push({pos:p,no,name:meta.name||fallbackName(c[2]),points:`${pts} pts`,maker:meta.maker||'',machine:meta.machine||'GT500',team:meta.team||`No.${no}`});
 }
 a.sort((x,y)=>x.pos-y.pos);const seen=new Set(),u=[];for(const r of a){if(seen.has(r.pos))continue;seen.add(r.pos);u.push(r);if(u.length>=5)break}if(u.length<3||u[0].pos!==1)throw Error('SUPER GT standings');d.ranking=u;return nextEvent(d)
}
async function load(){const base=nextEvent(clone(SNAP));try{const d=await update(base);save(d);return{d,cached:false}}catch(_){const c=cache();return{d:nextEvent(c||base),cached:true}}}
function smooth(t){return t*t*(3-2*t)}
function cover(img,W,H,focus=.54,shift=0){const iw=img.size.width||1,ih=img.size.height||1,s=Math.max(W/iw,H/ih),dw=iw*s,dh=ih*s;return new Rect(-(dw-W)*focus+shift,-(dh-H)*.5,dw,dh)}
async function hero(){const small=(config.widgetFamily||'medium')==='small',p=fm.joinPath(DOC,`motorsport-hero-v1000-${small?'small':'medium'}-supergt.jpg`);if(fm.fileExists(p)){try{return fm.readImage(p)}catch(_){} }try{let img=null;for(const u of HERO_URLS){try{const r=new Request(u);r.timeoutInterval=12;r.headers={'User-Agent':'Mozilla/5.0','Cache-Control':'no-cache'};img=await r.loadImage();if(img)break}catch(_){}}if(!img)return null;const W=small?720:1380,H=small?720:640,ctx=new DrawContext();ctx.size=new Size(W,H);ctx.opaque=true;ctx.respectScreenScale=false;ctx.setFillColor(col(C.bg));ctx.fillRect(new Rect(0,0,W,H));ctx.drawImageInRect(img,cover(img,W,H,.58,small?14:28));ctx.setFillColor(col('#030609',.08));ctx.fillRect(new Rect(0,0,W,H));for(let x=0;x<W;x+=3){const t=x/(W-1),a=.80*(1-smooth(t))+.05;ctx.setFillColor(col('#030609',a));ctx.fillRect(new Rect(x,0,4,H))}const rs=W*.76;for(let x=rs;x<W;x+=3){const t=(x-rs)/(W-rs),a=.08+.40*smooth(t);ctx.setFillColor(col('#020407',a));ctx.fillRect(new Rect(x,0,4,H))}const bs=H*.68,bh=H-bs;for(let i=0;i<56;i++){const y=bs+i*(bh/56),t=i/55,a=.008+.16*t*t;ctx.setFillColor(col('#020407',a));ctx.fillRect(new Rect(0,y,W,bh/56+1))}ctx.setFillColor(col(S.accent,.9));ctx.fillRect(new Rect(0,0,W,5));const out=ctx.getImage();try{fm.writeImage(p,out)}catch(_){}return out}catch(_){return null}}
function T(st,s,z,c,w='regular',n=1){const t=st.addText(String(s??''));t.font=w==='heavy'?Font.heavySystemFont(z):w==='bold'?Font.boldSystemFont(z):w==='semibold'?Font.semiboldSystemFont(z):Font.systemFont(z);t.textColor=c;t.lineLimit=n;t.minimumScaleFactor=.68;return t}
function dateText(d){const x=new Date(d.date),f=new DateFormatter();f.locale='ja_JP';f.timeZone='Asia/Tokyo';f.dateFormat=d.timeTbd?'M/d(E)':'M/d(E) HH:mm';return f.string(x)+(d.timeTbd?'・時刻未定':'')}
function countdown(d){if(d.lifecycle==='SEASON_ENDED'||d.seasonEnded)return{label:'SEASON END',live:false};const q=new Date(d.date)-Date.now(),hold=8*3600000;if(q<=0&&q>-hold)return{label:'開催中',live:true};if(q<=0)return{label:'終了',live:false};const h=q/3600000;if(d.timeTbd)return{label:`あと${Math.max(1,Math.ceil(h/24))}日`,live:false};if(h<24)return{label:`あと${Math.ceil(h)}時間`,live:false};return{label:`あと${Math.ceil(h/24)}日`,live:false}}
function sub(r){const left=[r.maker||'',r.machine||'GT500'].filter(Boolean).join(' · '),right=r.team||'GT500';return[left,right].filter(Boolean).join('  ｜  ')||'GT500'}
function base(bg){const w=new ListWidget();if(bg)w.backgroundImage=bg;else{const g=new LinearGradient();g.colors=[col(S.accent,.16),col(C.bg)];g.locations=[0,1];w.backgroundGradient=g}w.url=S.url;return w}
function pill(st,label,accent=false){const p=st.addStack();p.backgroundColor=accent?col(S.accent,.18):col('#000000',.30);p.cornerRadius=8;p.setPadding(3,7,3,7);T(p,label,accent?9.6:9.1,accent?col(S.accent):col(C.muted),'heavy');return p}
function medium(d,cached,bg){const w=base(bg),ci=countdown(d);w.setPadding(9,12,8,12);const top=w.addStack();top.layoutHorizontally();top.centerAlignContent();pill(top,'SUPER GT',true);top.addSpacer(6);T(top,d.lifecycle==='SEASON_ENDED'?'シーズン終了':'次戦',8,col(C.dim),'bold');top.addSpacer();if(cached)T(top,'• 更新待ち',6.8,col(C.warn,.78),'semibold');w.addSpacer(3);T(w,d.race,20.6,col(C.text),'heavy',1);w.addSpacer(1);const info=w.addStack();info.layoutHorizontally();info.centerAlignContent();T(info,dateText(d),10.7,col(C.muted),'semibold');info.addSpacer(5);T(info,`｜ ${d.circuit}`,9.6,col(C.dim),'semibold',1);info.addSpacer();const cp=info.addStack();cp.backgroundColor=ci.live?col(C.good,.28):col('#000000',.50);cp.cornerRadius=9;cp.setPadding(3,7,3,7);T(cp,ci.label,16.2,ci.live?col(C.good):col(C.text),'heavy');w.addSpacer(5);const hh=w.addStack();T(hh,'GT500',8.2,col(C.muted),'bold');hh.addSpacer();const ph=hh.addStack();ph.size=new Size(42,0);const pt=T(ph,'PTS',7.4,col(C.text,.96),'bold');pt.rightAlignText();w.addSpacer(2);for(const r of(d.ranking||[]).slice(0,3)){const row=w.addStack();row.layoutHorizontally();row.centerAlignContent();const ps=row.addStack();ps.size=new Size(18,0);T(ps,r.pos,11.4,col(S.accent),'heavy');row.addSpacer(4);T(row,r.name,12.1,col(C.text),'semibold');row.addSpacer();const pts=row.addStack();pts.size=new Size(42,0);pts.backgroundColor=col('#000000',.48);pts.cornerRadius=7;pts.setPadding(1,4,1,4);const p=T(pts,String(r.points).replace(' pts',''),10.7,col(C.text,1),'heavy');p.rightAlignText();const sr=w.addStack();sr.addSpacer(22);T(sr,sub(r),8.6,col(C.dim),'semibold');w.addSpacer(1)}w.refreshAfterDate=new Date(Date.now()+15*60000);return w}
function small(d,cached,bg){const w=base(bg),ci=countdown(d);w.setPadding(10,11,9,11);const top=w.addStack();top.layoutHorizontally();top.centerAlignContent();pill(top,'SUPER GT',true);top.addSpacer(4);T(top,d.lifecycle==='SEASON_ENDED'?'終了':'次戦',7.2,col(C.dim),'semibold');top.addSpacer();const cp=top.addStack();cp.backgroundColor=ci.live?col(C.good,.30):col('#000000',.50);cp.cornerRadius=8;cp.setPadding(2,6,2,6);T(cp,ci.label,11.8,ci.live?col(C.good):col(C.text),'heavy');const title=d.race,len=title.replace(/\s/g,'').length;w.addSpacer(len>=10?5:7);T(w,title,len>=11?16:len>=8?17.2:18.5,col(C.text),'heavy',len<=9?1:2);w.addSpacer(len>=10?1:3);T(w,dateText(d),9.8,col(C.muted),'semibold',1);w.addSpacer();const foot=w.addStack();const loc=foot.addStack();loc.backgroundColor=col('#000000',.48);loc.cornerRadius=7;loc.setPadding(2,5,2,5);T(loc,d.circuit,8.2,col(C.muted),'semibold',1);foot.addSpacer();if(cached)T(foot,'•',6.6,col(C.warn,.62),'semibold');w.refreshAfterDate=new Date(Date.now()+15*60000);return w}
let w;try{const x=await load(),bg=await hero();w=(config.widgetFamily||'medium')==='small'?small(x.d,x.cached,bg):medium(x.d,x.cached,bg)}catch(_){w=base(null);w.setPadding(12,12,12,12);pill(w,'SUPER GT',true);w.addSpacer(8);T(w,'データ取得失敗',18,col(C.text),'heavy');w.addSpacer(3);T(w,'通信回復後に再取得します',9.5,col(C.warn),'semibold')}
if(config.runsInWidget)Script.setWidget(w);else if((config.widgetFamily||'medium')==='small')await w.presentSmall();else await w.presentMedium();Script.complete();
})();
