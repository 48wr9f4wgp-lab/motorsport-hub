// Motorsport Hub v8.6.0 — dedicated HQ module for WEC / SUPER GT
(async()=>{
const norm=v=>String(v||'').trim().toUpperCase().replace(/[\s_-]+/g,'');
const mode=norm(globalThis.__MH_MODULE_PARAMETER||args.widgetParameter);
const K=mode==='SUPERGT'?'supergt':'wec',F=config.widgetFamily||'medium';
const SERIES={
 wec:{label:'WEC',accent:'#18BFD3',rank:'メーカー',url:'https://www.fiawec.com/'},
 supergt:{label:'SUPER GT',accent:'#F5B942',rank:'GT500',url:'https://supergt.net/'}
},S=SERIES[K];
const C={bg:'#06080B',text:'#F7F9FB',muted:'#B9C2CC',dim:'#8D98A4',good:'#58DA8A',warn:'#FFB84D'};
const fm=FileManager.local(),DOC=fm.documentsDirectory(),CACHE=fm.joinPath(DOC,`motorsport-data-v860-${K}.json`);
const SNAP={
 wec:{race:'Lone Star Le Mans',date:'2026-09-06T13:00:00-05:00',circuit:'Circuit of the Americas',ranking:[
  {pos:1,name:'TOYOTA',points:'132 pts',maker:'TOYOTA',machine:'TR010 Hybrid',team:'TOYOTA RACING'},
  {pos:2,name:'BMW',points:'127 pts',maker:'BMW',machine:'M Hybrid V8',team:'BMW M Team WRT'},
  {pos:3,name:'FERRARI',points:'88 pts',maker:'FERRARI',machine:'499P',team:'Ferrari AF Corse'}]},
 supergt:{race:'第6戦 SUGO',date:'2026-09-20T12:00:00+09:00',timeTbd:true,circuit:'スポーツランドSUGO',ranking:[
  {pos:1,name:'坪井 翔 / 山下 健太',points:'50 pts',maker:'TOYOTA',machine:'GR Supra',team:"au TOM'S"},
  {pos:2,name:'野尻 智紀 / 佐藤 蓮',points:'33 pts',maker:'HONDA',machine:'PRELUDE-GT',team:'ARTA'},
  {pos:3,name:'福住 仁嶺 / 大嶋 和也',points:'31 pts',maker:'TOYOTA',machine:'GR Supra',team:'ROOKIE'}]}
};
const CAL={
 wec:[['Lone Star Le Mans','2026-09-06T13:00:00-05:00','Circuit of the Americas'],['6 Hours of Fuji','2026-09-27T12:00:00+09:00','Fuji Speedway']],
 supergt:[['第6戦 SUGO','2026-09-20T12:00:00+09:00','スポーツランドSUGO',true],['第7戦 AUTOPOLIS','2026-10-18T12:00:00+09:00','オートポリス',true]]
};
const META={TOYOTA:['TR010 Hybrid','TOYOTA RACING'],BMW:['M Hybrid V8','BMW M Team WRT'],FERRARI:['499P','Ferrari AF Corse'],CADILLAC:['V-Series.R','Cadillac Hertz Team JOTA'],ALPINE:['A424','Alpine Endurance']};
const HERO={
 wec:[
  'https://commons.wikimedia.org/wiki/Special:Redirect/file/2024%206%20Hours%20of%20Spa-Francorchamps%20Toyota%20Gazoo%20Racing%20Toyota%20GR010%20Hybrid%20No.7%20%28DSC04523%29.jpg?width=2048',
  'https://commons.wikimedia.org/wiki/Special:Redirect/file/2024%206%20Hours%20of%20Spa-Francorchamps%20Toyota%20Gazoo%20Racing%20Toyota%20GR010%20Hybrid%20No.8%20%28DSC04184%29.jpg?width=2048'
 ],
 supergt:[
  'https://commons.wikimedia.org/wiki/Special:Redirect/file/MOTUL%20AUTECH%20Z%202024%20rd.2%20FUJI.jpg?width=2048',
  'https://commons.wikimedia.org/wiki/Special:Redirect/file/Au%20TOM%27S%20GR%20Supra%202025%20%28front%20three-quarter%20view%29%20at%20Osaka%20Auto%20Messe%202026.jpg?width=2048'
 ]
};
const clone=o=>JSON.parse(JSON.stringify(o)),col=(h,a=1)=>new Color(h,a),num=v=>{const m=String(v||'').replace(/,/g,'').match(/-?\d+(?:\.\d+)?/);return m?Number(m[0]):NaN};
const clean=s=>String(s||'').replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&nbsp;|&#160;/gi,' ').replace(/&amp;/gi,'&').replace(/\s+/g,' ').trim();
function rows(h){const out=[];for(const tr of String(h||'').match(/<tr\b[\s\S]*?<\/tr>/gi)||[]){const a=[];let m,re=/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi;while((m=re.exec(tr)))a.push(clean(m[1]));if(a.length)out.push(a)}return out}
async function txt(url){const r=new Request(url);r.timeoutInterval=9;r.headers={'User-Agent':'Mozilla/5.0'};return await r.loadString()}
function calendar(d){const now=Date.now();for(const e of CAL[K]){if(Date.parse(e[1])>now-6*3600000)return{...d,race:e[0],date:e[1],circuit:e[2],timeTbd:!!e[3]}}return d}
function save(d){try{fm.writeString(CACHE,JSON.stringify(d))}catch(_){} }
function cache(){try{return fm.fileExists(CACHE)?JSON.parse(fm.readString(CACHE)):null}catch(_){return null}}
async function updateWEC(d){const a=[];for(const c of rows(await txt('https://www.fiawec.com/fr/page/classement-constructeurs'))){const p=num(c[0]),m=String(c[1]||'').toUpperCase().trim(),meta=META[m],pts=num(c[c.length-1]);if(p>=1&&p<=20&&meta&&isFinite(pts))a.push({pos:p,name:m,points:`${pts} pts`,maker:m,machine:meta[0],team:meta[1]})}a.sort((x,y)=>x.pos-y.pos);if(a.length<3)throw Error('WEC');d.ranking=a.slice(0,5);return calendar(d)}
async function updateGT(d){const h=await txt('https://supergt.net/'),u=h.toUpperCase(),i=u.indexOf('GT 500'),j=u.indexOf('GT 300',i+1),a=[];for(const c of rows(i>=0&&j>i?h.slice(i,j):h)){const p=num(c[0]),no=String(c[1]||'').match(/\d+/)?.[0],pts=num(c[3]??c[c.length-2]);if(!(p>=1&&p<=30)||!isFinite(pts))continue;const meta=no==='36'?['TOYOTA','GR Supra',"au TOM'S"]:no==='16'?['HONDA','PRELUDE-GT','ARTA']:no==='14'?['TOYOTA','GR Supra','ROOKIE']:null;if(!meta)continue;const parts=String(c[2]||'').trim().split(/\s+/),name=parts.length>=4?`${parts.slice(0,2).join(' ')} / ${parts.slice(2).join(' ')}`:parts.join(' ');a.push({pos:p,name,points:`${pts} pts`,maker:meta[0],machine:meta[1],team:meta[2]})}a.sort((x,y)=>x.pos-y.pos);if(a.length<3)throw Error('SUPERGT');d.ranking=a.slice(0,5);return calendar(d)}
async function load(){const base=calendar(clone(SNAP[K]));try{const d=K==='wec'?await updateWEC(base):await updateGT(base);save(d);return{d,cached:false}}catch(e){return{d:calendar(cache()||base),cached:true}}}
function smooth(t){return t*t*(3-2*t)}
function cover(img,W,H,focus=.52,shift=0){const iw=img.size.width||1,ih=img.size.height||1,s=Math.max(W/iw,H/ih),dw=iw*s,dh=ih*s;return new Rect(-(dw-W)*focus+shift,-(dh-H)*.5,dw,dh)}
async function hero(){const small=F==='small',p=fm.joinPath(DOC,`motorsport-hero-v860-${small?'small':'medium'}-${K}.jpg`);if(fm.fileExists(p)){try{return fm.readImage(p)}catch(_){} }try{let img=null;for(const u of HERO[K]){try{const r=new Request(`${u}&v=860`);r.timeoutInterval=12;r.headers={'User-Agent':'Mozilla/5.0','Cache-Control':'no-cache'};img=await r.loadImage();if(img)break}catch(_){}}if(!img)return null;const W=small?720:1380,H=small?720:640,ctx=new DrawContext();ctx.size=new Size(W,H);ctx.opaque=true;ctx.respectScreenScale=false;ctx.setFillColor(col(C.bg));ctx.fillRect(new Rect(0,0,W,H));ctx.drawImageInRect(img,cover(img,W,H,K==='wec'?.52:.54,K==='wec'?50:36));ctx.setFillColor(col('#030609',.08));ctx.fillRect(new Rect(0,0,W,H));for(let x=0;x<W;x+=3){const t=x/(W-1),a=.70*(1-smooth(t))+.025;ctx.setFillColor(col('#030609',a));ctx.fillRect(new Rect(x,0,4,H))}const bs=H*.68,bh=H-bs;for(let i=0;i<56;i++){const y=bs+i*(bh/56),t=i/55,a=.008+.16*t*t;ctx.setFillColor(col('#020407',a));ctx.fillRect(new Rect(0,y,W,bh/56+1))}ctx.setFillColor(col(S.accent,.9));ctx.fillRect(new Rect(0,0,W,5));const out=ctx.getImage();try{fm.writeImage(p,out)}catch(_){}return out}catch(_){return null}}
function T(st,s,z,c,w='regular',n=1){const t=st.addText(String(s??''));t.font=w==='heavy'?Font.heavySystemFont(z):w==='bold'?Font.boldSystemFont(z):w==='semibold'?Font.semiboldSystemFont(z):Font.systemFont(z);t.textColor=c;t.lineLimit=n;t.minimumScaleFactor=.68;return t}
function rn(s){if(/Lone Star Le Mans/i.test(s))return'ローンスター・ル・マン';if(/6 Hours of Fuji/i.test(s))return'富士6時間';return s}
function cn(s){if(/Circuit of the Americas/i.test(s))return'COTA';if(/Fuji Speedway/i.test(s))return'富士スピードウェイ';return s||''}
function dateText(d){const x=new Date(d.date),f=new DateFormatter();f.locale='ja_JP';f.timeZone='Asia/Tokyo';f.dateFormat=d.timeTbd?'M/d(E)':'M/d(E) HH:mm';return f.string(x)+(d.timeTbd?'・時刻未定':'')}
function countdown(d){const q=new Date(d.date)-Date.now();if(q<=0&&q>-4*3600000)return{label:'LIVE',live:true};if(q<=0)return{label:'終了',live:false};const h=q/3600000;if(d.timeTbd)return{label:`あと${Math.max(1,Math.ceil(h/24))}日`,live:false};if(h<24)return{label:`あと${Math.ceil(h)}時間`,live:false};return{label:`あと${Math.ceil(h/24)}日`,live:false}}
function sub(r){return K==='wec'?`${r.machine||''}  ｜  ${r.team||''}`:`${r.maker||''} · ${r.machine||''}  ｜  ${r.team||''}`}
function base(bg){const w=new ListWidget();if(bg)w.backgroundImage=bg;else{const g=new LinearGradient();g.colors=[col(S.accent,.16),col(C.bg)];g.locations=[0,1];w.backgroundGradient=g}w.url=S.url;return w}
function pill(st,label,accent=false){const p=st.addStack();p.backgroundColor=accent?col(S.accent,.18):col('#000000',.30);p.cornerRadius=8;p.setPadding(3,7,3,7);T(p,label,accent?9.6:9.1,accent?col(S.accent):col(C.muted),'heavy');return p}
function medium(d,cached,bg){const w=base(bg),ci=countdown(d);w.setPadding(9,12,8,12);const top=w.addStack();top.layoutHorizontally();top.centerAlignContent();pill(top,S.label,true);top.addSpacer(6);T(top,'次戦',8,col(C.dim),'bold');top.addSpacer();if(cached)T(top,'• 更新待ち',6.8,col(C.warn,.78),'semibold');w.addSpacer(3);T(w,rn(d.race),20.6,col(C.text),'heavy',1);w.addSpacer(1);const info=w.addStack();info.layoutHorizontally();info.centerAlignContent();T(info,dateText(d),10.7,col(C.muted),'semibold');info.addSpacer(5);T(info,`｜ ${cn(d.circuit)}`,9.6,col(C.dim),'semibold',1);info.addSpacer();const cp=info.addStack();cp.backgroundColor=ci.live?col(C.good,.19):col('#000000',.25);cp.cornerRadius=9;cp.setPadding(3,7,3,7);T(cp,ci.label,16.2,ci.live?col(C.good):col(C.text),'heavy');w.addSpacer(5);const hh=w.addStack();T(hh,S.rank,8.2,col(C.muted),'bold');hh.addSpacer();const ph=hh.addStack();ph.size=new Size(38,0);const pt=T(ph,'PTS',7.1,col(C.muted,.82),'semibold');pt.rightAlignText();w.addSpacer(2);for(const r of (d.ranking||[]).slice(0,3)){const row=w.addStack();row.layoutHorizontally();row.centerAlignContent();const ps=row.addStack();ps.size=new Size(18,0);T(ps,r.pos,11.4,col(S.accent),'heavy');row.addSpacer(4);T(row,r.name,K==='supergt'?12.1:13.1,col(C.text),'semibold');row.addSpacer();const pts=row.addStack();pts.size=new Size(38,0);pts.backgroundColor=col('#000000',.12);pts.cornerRadius=5;pts.setPadding(0,2,0,2);const p=T(pts,String(r.points).replace(' pts',''),10.4,col(C.text,.88),'semibold');p.rightAlignText();const sr=w.addStack();sr.addSpacer(22);T(sr,sub(r),8.6,col(C.dim),'semibold');w.addSpacer(1)}w.refreshAfterDate=new Date(Date.now()+15*60000);return w}
function small(d,cached,bg){const w=base(bg),ci=countdown(d);w.setPadding(10,11,9,11);const top=w.addStack();top.layoutHorizontally();top.centerAlignContent();pill(top,S.label,true);top.addSpacer(4);T(top,'次戦',7.2,col(C.dim),'semibold');top.addSpacer();const cp=top.addStack();cp.backgroundColor=ci.live?col(C.good,.20):col('#000000',.30);cp.cornerRadius=8;cp.setPadding(2,6,2,6);T(cp,ci.label,11.8,ci.live?col(C.good):col(C.text),'heavy');const title=rn(d.race),len=title.replace(/\s/g,'').length,oneLine=len<=9,size=len>=11?16:len>=8?17.2:18.5;w.addSpacer(len>=10?5:7);const rt=T(w,title,size,col(C.text),'heavy',oneLine?1:2);rt.minimumScaleFactor=oneLine?.72:.78;w.addSpacer(len>=10?1:3);T(w,dateText(d),9.8,col(C.muted),'semibold',1);w.addSpacer();const foot=w.addStack();const loc=foot.addStack();loc.backgroundColor=col('#000000',.25);loc.cornerRadius=7;loc.setPadding(2,5,2,5);T(loc,cn(d.circuit),8.2,col(C.muted),'semibold',1);foot.addSpacer();if(cached)T(foot,'•',6.6,col(C.warn,.62),'semibold');w.refreshAfterDate=new Date(Date.now()+15*60000);return w}
let w;try{const x=await load(),bg=await hero();w=F==='small'?small(x.d,x.cached,bg):medium(x.d,x.cached,bg)}catch(e){w=base(null);w.setPadding(12,12,12,12);pill(w,S.label,true);w.addSpacer(8);T(w,'データ取得失敗',18,col(C.text),'heavy');w.addSpacer(3);T(w,'通信回復後に再取得します',9.5,col(C.warn),'semibold')}
if(config.runsInWidget)Script.setWidget(w);else if(F==='small')await w.presentSmall();else await w.presentMedium();Script.complete();
})();