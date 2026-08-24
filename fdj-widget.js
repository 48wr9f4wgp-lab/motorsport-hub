// Motorsport Hub v8.5.1 — Formula Drift Japan module
(async()=>{
const V='8.5.1',K='fdj';
const S={label:'FDJ',accent:'#FF7A00',url:'https://formulad.jp/'};
const C={bg:'#06080B',text:'#F7F9FB',muted:'#B9C2CC',dim:'#8D98A4',good:'#58DA8A',warn:'#FFB84D'};
const fm=FileManager.local(),DOC=fm.documentsDirectory(),CACHE=fm.joinPath(DOC,'motorsport-data-v85-fdj.json');
const SNAP={race:'第5戦 奥伊吹',date:'2026-09-05T09:00:00+09:00',timeTbd:true,circuit:'グランスノー奥伊吹',ranking:[
 {pos:1,name:'CONNOR XIA',points:'231 pts',car:'#18'},
 {pos:2,name:'RYUMA',points:'230 pts',car:'#131'},
 {pos:3,name:'KAZUMI TAKAHASHI',points:'226 pts',car:'#36'}
]};
const CAL=[
 ['第1戦 富士','2026-04-25T09:00:00+09:00','富士スピードウェイ',true],
 ['第2戦 鈴鹿ツイン','2026-05-16T09:00:00+09:00','鈴鹿ツインサーキット',true],
 ['第3戦 エビス西','2026-06-13T09:00:00+09:00','エビスサーキット 西コース',true],
 ['第4戦 SUGO','2026-07-11T09:00:00+09:00','スポーツランドSUGO',true],
 ['第5戦 奥伊吹','2026-09-05T09:00:00+09:00','グランスノー奥伊吹',true],
 ['第6戦 岡山','2026-10-03T09:00:00+09:00','岡山国際サーキット',true]
];
const HERO='https://commons.wikimedia.org/wiki/Special:Redirect/file/Drift%20Car%20in%20Motion%20at%20Muscle%20on%20the%20Wheel%20Annual%20Show%2C%20Port%20Harcourt%2C%20Rivers%2002.jpg?width=960';
const col=(h,a=1)=>new Color(h,a),clone=o=>JSON.parse(JSON.stringify(o)),num=v=>{const m=String(v||'').replace(/,/g,'').match(/-?\d+(?:\.\d+)?/);return m?Number(m[0]):NaN};
const clean=s=>String(s||'').replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&nbsp;|&#160;/gi,' ').replace(/&amp;/gi,'&').replace(/\s+/g,' ').trim();
function rows(h){const out=[];for(const tr of String(h||'').match(/<tr\b[\s\S]*?<\/tr>/gi)||[]){const a=[];let m,re=/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi;while((m=re.exec(tr)))a.push(clean(m[1]));if(a.length)out.push(a)}return out}
async function txt(url){const r=new Request(url);r.timeoutInterval=9;r.headers={'User-Agent':'Mozilla/5.0'};return await r.loadString()}
function nextEvent(d){const now=Date.now();for(const e of CAL){if(Date.parse(e[1])>now-6*3600000)return{...d,race:e[0],date:e[1],circuit:e[2],timeTbd:!!e[3]}}return d}
function save(d){try{fm.writeString(CACHE,JSON.stringify(d))}catch(_){} }
function cache(){try{return fm.fileExists(CACHE)?JSON.parse(fm.readString(CACHE)):null}catch(_){return null}}
function latinName(s){let x=String(s||'').trim().replace(/RYUMARYUMA/i,'RYUMA');const m=x.match(/^[A-Z0-9 .'-]+/i);return (m?.[0]||x).trim()}
async function update(d){
 const h=await txt('https://formulad.jp/2026-fdj-standings/'),a=[];
 for(const c of rows(h)){
  if(c.length<10)continue;
  const p=num(c[0]),car=String(c[1]||'').trim(),name=latinName(c[2]),pts=num(c[c.length-1]);
  if(p>=1&&p<=30&&name&&isFinite(pts))a.push({pos:p,name,points:`${pts} pts`,car:car?`#${car.replace(/^#/,'')}`:''});
 }
 a.sort((x,y)=>x.pos-y.pos);
 const seen=new Set(),u=[];for(const r of a){if(seen.has(r.pos))continue;seen.add(r.pos);u.push(r);if(u.length>=5)break}
 if(u.length<3)throw Error('FDJ standings');d.ranking=u;return nextEvent(d)
}
async function load(){const base=nextEvent(clone(SNAP));try{const d=await update(base);save(d);return{d,cached:false}}catch(e){return{d:nextEvent(cache()||base),cached:true}}}
function smooth(t){return t*t*(3-2*t)}
function cover(img,W,H,focus=.54,shift=0){const iw=img.size.width||1,ih=img.size.height||1,s=Math.max(W/iw,H/ih),dw=iw*s,dh=ih*s;return new Rect(-(dw-W)*focus+shift,-(dh-H)*.5,dw,dh)}
async function hero(){const small=(config.widgetFamily||'medium')==='small',p=fm.joinPath(DOC,`motorsport-hero-v851-${small?'small':'medium'}-fdj.jpg`);if(fm.fileExists(p)){try{return fm.readImage(p)}catch(_){} }
 try{const r=new Request(HERO);r.timeoutInterval=10;r.headers={'User-Agent':'Mozilla/5.0'};const img=await r.loadImage(),W=small?360:690,H=small?360:320,ctx=new DrawContext();ctx.size=new Size(W,H);ctx.opaque=true;ctx.respectScreenScale=false;ctx.setFillColor(col(C.bg));ctx.fillRect(new Rect(0,0,W,H));ctx.drawImageInRect(img,cover(img,W,H,.55,small?26:64));ctx.setFillColor(col('#030609',.20));ctx.fillRect(new Rect(0,0,W,H));for(let x=0;x<W;x+=2){const t=x/(W-1),a=.84*(1-smooth(t))+.06;ctx.setFillColor(col('#030609',a));ctx.fillRect(new Rect(x,0,3,H))}const bs=H*.67,bh=H-bs;for(let i=0;i<48;i++){const y=bs+i*(bh/48),t=i/47,a=.02+.25*t*t;ctx.setFillColor(col('#020407',a));ctx.fillRect(new Rect(0,y,W,bh/48+1))}ctx.setFillColor(col(S.accent,.9));ctx.fillRect(new Rect(0,0,W,3));const out=ctx.getImage();try{fm.writeImage(p,out)}catch(_){}return out}catch(_){return null}}
function T(st,s,z,c,w='regular',n=1){const t=st.addText(String(s??''));t.font=w==='heavy'?Font.heavySystemFont(z):w==='bold'?Font.boldSystemFont(z):w==='semibold'?Font.semiboldSystemFont(z):Font.systemFont(z);t.textColor=c;t.lineLimit=n;t.minimumScaleFactor=.68;return t}
function base(bg){const w=new ListWidget();if(bg)w.backgroundImage=bg;else{const g=new LinearGradient();g.colors=[col(S.accent,.16),col(C.bg)];g.locations=[0,1];w.backgroundGradient=g}w.url=S.url;return w}
function pill(st,label,accent=false){const p=st.addStack();p.backgroundColor=accent?col(S.accent,.20):col('#000000',.32);p.cornerRadius=8;p.setPadding(3,7,3,7);T(p,label,accent?9.6:9.1,accent?col(S.accent):col(C.muted),'heavy');return p}
function dateText(d){const x=new Date(d.date),f=new DateFormatter();f.locale='ja_JP';f.timeZone='Asia/Tokyo';f.dateFormat=d.timeTbd?'M/d(E)':'M/d(E) HH:mm';return f.string(x)+(d.timeTbd?'・時刻未定':'')}
function countdown(d){const q=new Date(d.date)-Date.now();if(q<=0&&q>-6*3600000)return{label:'LIVE',live:true};if(q<=0)return{label:'終了',live:false};const h=q/3600000;if(d.timeTbd)return{label:`あと${Math.max(1,Math.ceil(h/24))}日`,live:false};if(h<24)return{label:`あと${Math.ceil(h)}時間`,live:false};return{label:`あと${Math.ceil(h/24)}日`,live:false}}
function medium(d,cached,bg){const w=base(bg),ci=countdown(d);w.setPadding(9,12,8,12);const top=w.addStack();top.layoutHorizontally();top.centerAlignContent();pill(top,'FDJ',true);top.addSpacer(6);T(top,'次戦',8,col(C.dim),'bold');top.addSpacer();if(cached)T(top,'• 更新待ち',6.8,col(C.warn,.78),'semibold');w.addSpacer(3);T(w,d.race,20.6,col(C.text),'heavy',1);w.addSpacer(1);const info=w.addStack();info.layoutHorizontally();info.centerAlignContent();T(info,dateText(d),10.7,col(C.muted),'semibold');info.addSpacer(5);T(info,`｜ ${d.circuit}`,9.6,col(C.dim),'semibold',1);info.addSpacer();const cp=info.addStack();cp.backgroundColor=ci.live?col(C.good,.19):col('#000000',.27);cp.cornerRadius=9;cp.setPadding(3,7,3,7);T(cp,ci.label,16.2,ci.live?col(C.good):col(C.text),'heavy');w.addSpacer(5);const hh=w.addStack();T(hh,'シリーズ順位',8.2,col(C.muted),'bold');hh.addSpacer();T(hh,'PTS',7.1,col(C.muted,.82),'semibold');w.addSpacer(2);for(const r of (d.ranking||[]).slice(0,3)){const row=w.addStack();row.layoutHorizontally();row.centerAlignContent();const ps=row.addStack();ps.size=new Size(18,0);T(ps,r.pos,11.4,col(S.accent),'heavy');row.addSpacer(4);T(row,r.name,12.8,col(C.text),'semibold');row.addSpacer();const pts=row.addStack();pts.size=new Size(38,0);pts.backgroundColor=col('#000000',.14);pts.cornerRadius=5;pts.setPadding(0,2,0,2);const p=T(pts,String(r.points).replace(' pts',''),10.4,col(C.text,.84),'semibold');p.rightAlignText();const sr=w.addStack();sr.addSpacer(22);T(sr,r.car||'',8.6,col(C.dim),'semibold');w.addSpacer(1)}w.refreshAfterDate=new Date(Date.now()+15*60000);return w}
function small(d,cached,bg){const w=base(bg),ci=countdown(d);w.setPadding(10,11,9,11);const top=w.addStack();top.layoutHorizontally();top.centerAlignContent();pill(top,'FDJ',true);top.addSpacer(4);T(top,'次戦',7.2,col(C.dim),'semibold');top.addSpacer();const cp=top.addStack();cp.backgroundColor=ci.live?col(C.good,.20):col('#000000',.32);cp.cornerRadius=8;cp.setPadding(2,6,2,6);T(cp,ci.label,11.8,ci.live?col(C.good):col(C.text),'heavy');w.addSpacer(7);T(w,d.race,18,col(C.text),'heavy',2);w.addSpacer(3);T(w,dateText(d),9.8,col(C.muted),'semibold',1);w.addSpacer();const foot=w.addStack();foot.layoutHorizontally();const loc=foot.addStack();loc.backgroundColor=col('#000000',.28);loc.cornerRadius=7;loc.setPadding(2,5,2,5);T(loc,d.circuit,8,col(C.muted),'semibold',1);foot.addSpacer();if(cached)T(foot,'•',6.6,col(C.warn,.62),'semibold');w.refreshAfterDate=new Date(Date.now()+15*60000);return w}
let w;try{const x=await load(),bg=await hero();w=(config.widgetFamily||'medium')==='small'?small(x.d,x.cached,bg):medium(x.d,x.cached,bg)}catch(e){w=base(null);w.setPadding(12,12,12,12);pill(w,'FDJ',true);w.addSpacer(8);T(w,'データ取得失敗',18,col(C.text),'heavy');w.addSpacer(3);T(w,'通信回復後に再取得します',9.5,col(C.warn),'semibold')}
if(config.runsInWidget)Script.setWidget(w);else if((config.widgetFamily||'medium')==='small')await w.presentSmall();else await w.presentMedium();Script.complete();
})();
