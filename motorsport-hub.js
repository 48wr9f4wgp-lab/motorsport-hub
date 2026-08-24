// Motorsport Hub v8.3.2 — Professional Visual Pass / GitHub hosted / Scriptable
// Widget Parameter: F1 / WEC / WRC / SUPERGT / MOTOGP
(async()=>{
const V='8.3.2';
const MAP={F1:'f1',WEC:'wec',WRC:'wrc',SUPERGT:'supergt',MOTOGP:'motogp'};
const labels=['F1','WEC','WRC','SUPER GT','MotoGP'],params=['F1','WEC','WRC','SUPERGT','MOTOGP'];
const norm=v=>String(v||'').trim().toUpperCase().replace(/[\s_-]+/g,'');
let mode=norm(args.widgetParameter);
if(!MAP[mode]&&!config.runsInWidget){const a=new Alert();a.title='Motorsport Hub';a.message='プレビューするカテゴリ';labels.forEach(x=>a.addAction(x));a.addCancelAction('キャンセル');const i=await a.presentSheet();if(i<0){Script.complete();return}mode=params[i]}
if(!MAP[mode])mode='F1';
const K=MAP[mode],F=config.widgetFamily||'medium';

const SERIES={
  f1:{label:'F1',accent:'#E10600',rank:'ドライバー',url:'https://www.formula1.com/'},
  wec:{label:'WEC',accent:'#18BFD3',rank:'メーカー',url:'https://www.fiawec.com/'},
  wrc:{label:'WRC',accent:'#3B82F6',rank:'ドライバー',url:'https://www.wrc.com/'},
  supergt:{label:'SUPER GT',accent:'#F5B942',rank:'GT500',url:'https://supergt.net/'},
  motogp:{label:'MotoGP',accent:'#FF5A1F',rank:'ライダー',url:'https://www.motogp.com/'}
},S=SERIES[K];
const C={bg:'#06080B',panel:'#0B1016',text:'#F7F9FB',muted:'#B9C2CC',dim:'#8D98A4',line:'#FFFFFF',good:'#58DA8A',warn:'#FFB84D'};
const fm=FileManager.local(),DOC=fm.documentsDirectory(),CACHE=fm.joinPath(DOC,`motorsport-data-v8-${K}.json`);

const SNAP={
  f1:{race:'Italian Grand Prix',date:'2026-09-06T13:00:00Z',circuit:'Autodromo Nazionale Monza',ranking:[['Andrea Kimi Antonelli',242,'MERCEDES','Mercedes','W17'],['George Russell',183,'MERCEDES','Mercedes','W17'],['Lewis Hamilton',183,'FERRARI','Ferrari','SF-26']]},
  wec:{race:'Lone Star Le Mans',date:'2026-09-06T13:00:00-05:00',circuit:'Circuit of the Americas',ranking:[['TOYOTA',132,'TOYOTA','TOYOTA RACING','TR010 Hybrid'],['BMW',127,'BMW','BMW M Team WRT','M Hybrid V8'],['FERRARI',88,'FERRARI','Ferrari AF Corse','499P']]},
  wrc:{race:'WRC ueno Rally del Paraguay',date:'2026-08-27T09:00:00-03:00',circuit:'Paraguay',ranking:[['Elfyn Evans',201,'TOYOTA','TOYOTA GAZOO Racing WRT','GR Yaris Rally1'],['Sami Pajari',171,'TOYOTA','TOYOTA GAZOO Racing WRT','GR Yaris Rally1'],['Takamoto Katsuta',160,'TOYOTA','TOYOTA GAZOO Racing WRT','GR Yaris Rally1']]},
  motogp:{race:'Grand Prix of Aragon',date:'2026-08-30T14:00:00+02:00',circuit:'MotorLand Aragón',ranking:[['Jorge Martin',240,'APRILIA','Aprilia Racing','RS-GP'],['Marco Bezzecchi',209,'APRILIA','Aprilia Racing','RS-GP'],['Ai Ogura',203,'APRILIA','Trackhouse MotoGP Team','RS-GP']]},
  supergt:{race:'第6戦 SUGO',date:'2026-09-20T12:00:00+09:00',timeTbd:true,circuit:'スポーツランドSUGO',ranking:[['坪井 翔 / 山下 健太',50,'TOYOTA',"au TOM'S",'GR Supra'],['野尻 智紀 / 佐藤 蓮',33,'HONDA','ARTA','PRELUDE-GT'],['福住 仁嶺 / 大嶋 和也',31,'TOYOTA','ROOKIE','GR Supra']]}
};
for(const d of Object.values(SNAP))d.ranking=d.ranking.map((r,i)=>({pos:i+1,name:r[0],points:`${r[1]} pts`,maker:r[2],team:r[3],machine:r[4]}));

const CAL={
  wec:[['Lone Star Le Mans','2026-09-06T13:00:00-05:00','Circuit of the Americas'],['6 Hours of Fuji','2026-09-27T12:00:00+09:00','Fuji Speedway']],
  wrc:[['WRC ueno Rally del Paraguay','2026-08-27T09:00:00-03:00','Paraguay'],['WRC Rally Chile Bio Bío','2026-09-10T09:00:00-03:00','Chile']],
  motogp:[['Grand Prix of Aragon','2026-08-30T14:00:00+02:00','MotorLand Aragón'],['San Marino Grand Prix','2026-09-13T14:00:00+02:00','Misano']],
  supergt:[['第6戦 SUGO','2026-09-20T12:00:00+09:00','スポーツランドSUGO',true],['第7戦 AUTOPOLIS','2026-10-18T12:00:00+09:00','オートポリス',true]]
};

const META={
  wec:{TOYOTA:['TR010 Hybrid','TOYOTA RACING'],BMW:['M Hybrid V8','BMW M Team WRT'],FERRARI:['499P','Ferrari AF Corse'],CADILLAC:['V-Series.R','Cadillac Hertz Team JOTA'],ALPINE:['A424','Alpine Endurance']},
  wrc:{'Elfyn Evans':['TOYOTA','GR Yaris Rally1','TOYOTA GAZOO Racing WRT'],'Sami Pajari':['TOYOTA','GR Yaris Rally1','TOYOTA GAZOO Racing WRT'],'Takamoto Katsuta':['TOYOTA','GR Yaris Rally1','TOYOTA GAZOO Racing WRT'],'Oliver Solberg':['TOYOTA','GR Yaris Rally1','TOYOTA GAZOO Racing WRT'],'Sébastien Ogier':['TOYOTA','GR Yaris Rally1','TOYOTA GAZOO Racing WRT'],'Sebastien Ogier':['TOYOTA','GR Yaris Rally1','TOYOTA GAZOO Racing WRT'],'Thierry Neuville':['HYUNDAI','i20 N Rally1','Hyundai Shell Mobis WRT'],'Adrien Fourmaux':['HYUNDAI','i20 N Rally1','Hyundai Shell Mobis WRT']}
};

const HERO={
  f1:{
    MERCEDES:{urls:['https://commons.wikimedia.org/wiki/Special:Redirect/file/Andrea_Kimi_Antonelli_2025_Italian_Grand_Prix_FP3.jpg?width=960','https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/2025_Japan_GP_-_Mercedes_-_W16_-_Thursday.jpg/960px-2025_Japan_GP_-_Mercedes_-_W16_-_Thursday.jpg'],focus:.46,shift:82},
    FERRARI:{url:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/2025_Japan_GP_-_Ferrari_-_SF-25_-_Thursday.jpg/960px-2025_Japan_GP_-_Ferrari_-_SF-25_-_Thursday.jpg',focus:.56,shift:30},
    MCLAREN:{url:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/2025_Japan_GP_-_McLaren_-_MCL39_-_Thursday.jpg/960px-2025_Japan_GP_-_McLaren_-_MCL39_-_Thursday.jpg',focus:.56,shift:30}
  },
  wec:{
    TOYOTA:{url:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/TGR_GR010_HYBRID_240908.jpg/960px-TGR_GR010_HYBRID_240908.jpg',focus:.44,shift:96},
    FERRARI:{url:'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Ferrari_499P_%282025%29_%2855079052197%29.jpg/960px-Ferrari_499P_%282025%29_%2855079052197%29.jpg',focus:.48,shift:64}
  },
  wrc:{
    TOYOTA:{urls:['https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/2025_Toyota_GR_Yaris_Rally_1_Katsuta.jpg/960px-2025_Toyota_GR_Yaris_Rally_1_Katsuta.jpg','https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/2025_Toyota_GR_Yaris_Rally_1_Ogier_%28cropped%29.jpg/645px-2025_Toyota_GR_Yaris_Rally_1_Ogier_%28cropped%29.jpg'],focus:.49,shift:126}
  },
  motogp:{
    APRILIA:{url:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/MotoGP_2025_Malaysian_Grand_Prix_-_Aprilia_Racing_-_Marco_Bezzecchi.jpg/960px-MotoGP_2025_Malaysian_Grand_Prix_-_Aprilia_Racing_-_Marco_Bezzecchi.jpg',focus:.55,shift:30},
    DUCATI:{url:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/MotoGP_2025_Malaysian_Grand_Prix_-_Ducati_Lenovo_-_Francesco_Bagnaia.jpg/960px-MotoGP_2025_Malaysian_Grand_Prix_-_Ducati_Lenovo_-_Francesco_Bagnaia.jpg',focus:.55,shift:30}
  },
  supergt:{
    TOYOTA:{url:"https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Osaka_Auto_Messe_2025_%281%29_-_No.36_au_TOM%27S_GR_Supra_in_2024_SUPER_GT.jpg/960px-Osaka_Auto_Messe_2025_%281%29_-_No.36_au_TOM%27S_GR_Supra_in_2024_SUPER_GT.jpg",focus:.58,shift:28},
    HONDA:{url:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Honda_HRC_PRELUDE-GT_%281%29_at_Osaka_Auto_Messe_2026.jpg/960px-Honda_HRC_PRELUDE-GT_%281%29_at_Osaka_Auto_Messe_2026.jpg',focus:.52,shift:34}
  }
};

const clone=o=>JSON.parse(JSON.stringify(o)),col=(h,a=1)=>new Color(h,a),num=v=>{const m=String(v||'').replace(/,/g,'').match(/-?\d+(?:\.\d+)?/);return m?Number(m[0]):NaN};
const clean=s=>String(s||'').replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&nbsp;|&#160;/gi,' ').replace(/&amp;/gi,'&').replace(/\s+/g,' ').trim();
function rows(h){const out=[];for(const tr of String(h||'').match(/<tr\b[\s\S]*?<\/tr>/gi)||[]){const a=[];let m,re=/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi;while((m=re.exec(tr)))a.push(clean(m[1]));if(a.length)out.push(a)}return out}
async function txt(url){const r=new Request(url);r.timeoutInterval=9;r.headers={'User-Agent':'Mozilla/5.0'};return await r.loadString()}
async function json(url){const r=new Request(url);r.timeoutInterval=9;r.headers={'User-Agent':'MotorsportHub/8.3.2'};return await r.loadJSON()}
function calendar(d){const c=CAL[K];if(!c)return d;const now=Date.now();for(const e of c){const t=Date.parse(e[1]);if(t>now)return{...d,race:e[0],date:e[1],circuit:e[2],timeTbd:!!e[3]}}return d}
function save(d){try{fm.writeString(CACHE,JSON.stringify(d))}catch(_){} }
function cache(){try{return fm.fileExists(CACHE)?JSON.parse(fm.readString(CACHE)):null}catch(_){return null}}

async function updateF1(d){let ok=false;try{const j=await json('https://api.jolpi.ca/ergast/f1/2026.json?limit=100'),now=Date.now(),r=(j?.MRData?.RaceTable?.Races||[]).map(x=>({...x,t:Date.parse(`${x.date}T${x.time||'12:00:00Z'}`)})).find(x=>x.t>now-14400000);if(r){d.race=r.raceName;d.date=`${r.date}T${r.time||'12:00:00Z'}`;d.circuit=r.Circuit?.circuitName||d.circuit;ok=true}}catch(_){}
try{const j=await json('https://api.jolpi.ca/ergast/f1/2026/driverstandings.json'),a=j?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings||[];if(a.length>=3){d.ranking=a.slice(0,5).map((x,i)=>({pos:+x.position||i+1,name:`${x.Driver?.givenName||''} ${x.Driver?.familyName||''}`.trim(),points:`${x.points||0} pts`,maker:String(x.Constructors?.[0]?.name||'').toUpperCase(),team:x.Constructors?.[0]?.name||'',machine:''}));ok=true}}catch(_){}
if(!ok)throw Error('F1');return d}
async function updateWEC(d){const a=[];for(const c of rows(await txt('https://www.fiawec.com/fr/page/classement-constructeurs'))){const p=num(c[0]),m=String(c[1]||'').toUpperCase().trim(),meta=META.wec[m],pts=num(c[c.length-1]);if(p>=1&&p<=20&&meta&&isFinite(pts))a.push({pos:p,name:m,points:`${pts} pts`,maker:m,machine:meta[0],team:meta[1]})}a.sort((x,y)=>x.pos-y.pos);if(a.length<3)throw Error('WEC');d.ranking=a.slice(0,5);return calendar(d)}
async function updateWRC(d){const a=[];for(const c of rows(await txt('https://www.wrc.com/en/results-and-standings/championship-standings'))){const p=num(c[0]),s=c.join(' '),name=Object.keys(META.wrc).find(n=>s.includes(n));if(!(p>=1&&p<=20)||!name)continue;const ns=c.map(num).filter(Number.isFinite),pts=ns[ns.length-1],m=META.wrc[name];if(isFinite(pts))a.push({pos:p,name,points:`${pts} pts`,maker:m[0],machine:m[1],team:m[2]})}a.sort((x,y)=>x.pos-y.pos);if(a.length<3)throw Error('WRC');d.ranking=a.slice(0,5);return calendar(d)}
async function updateMoto(d){const a=[];for(const c of rows(await txt('https://stats.motogp.com/en/world-standing'))){const p=num(c[0]),name=String(c[1]||'').replace(/^\d+\s*/,'').trim(),pts=num(c[5]??c[c.length-2]),team=String(c[3]||''),bike=String(c[4]||'');if(p>=1&&p<=30&&name&&isFinite(pts)&&/Aprilia|Ducati|KTM|Honda|Yamaha/i.test(bike))a.push({pos:p,name,points:`${pts} pts`,maker:bike.toUpperCase(),machine:bike,team})}a.sort((x,y)=>x.pos-y.pos);if(a.length<3)throw Error('MotoGP');d.ranking=a.slice(0,5);return calendar(d)}
async function updateGT(d){const h=await txt('https://supergt.net/'),u=h.toUpperCase(),i=u.indexOf('GT 500'),j=u.indexOf('GT 300',i+1),a=[];for(const c of rows(i>=0&&j>i?h.slice(i,j):h)){const p=num(c[0]),no=String(c[1]||'').match(/\d+/)?.[0],pts=num(c[3]??c[c.length-2]);if(!(p>=1&&p<=30)||!isFinite(pts))continue;const meta=no==='36'?['TOYOTA','GR Supra',"au TOM'S"]:no==='16'?['HONDA','PRELUDE-GT','ARTA']:no==='14'?['TOYOTA','GR Supra','ROOKIE']:null;if(!meta)continue;const parts=String(c[2]||'').trim().split(/\s+/),name=parts.length>=4?`${parts.slice(0,2).join(' ')} / ${parts.slice(2).join(' ')}`:parts.join(' ');a.push({pos:p,name,points:`${pts} pts`,maker:meta[0],machine:meta[1],team:meta[2]})}a.sort((x,y)=>x.pos-y.pos);if(a.length<3)throw Error('SUPERGT');d.ranking=a.slice(0,5);return calendar(d)}
async function load(){const base=calendar(clone(SNAP[K]));try{let d=K==='f1'?await updateF1(base):K==='wec'?await updateWEC(base):K==='wrc'?await updateWRC(base):K==='motogp'?await updateMoto(base):await updateGT(base);save(d);return{d,cached:false}}catch(e){return{d:calendar(cache()||base),cached:true}}}

function smoothstep(t){return t*t*(3-2*t)}
function coverRect(img,focus=.5,shift=0){const W=690,H=320,iw=img.size.width||1,ih=img.size.height||1,scale=Math.max(W/iw,H/ih),dw=iw*scale,dh=ih*scale,x=-(dw-W)*focus+shift,y=-(dh-H)*.5;return new Rect(x,y,dw,dh)}
async function hero(d){
  const maker=String(d?.ranking?.[0]?.maker||'').toUpperCase();
  const preset=HERO[K]?.[maker]||Object.values(HERO[K]||{})[0];
  if(!preset)return null;
  const p=fm.joinPath(DOC,`motorsport-hero-v832-${K}-${maker}.jpg`);
  if(fm.fileExists(p)){try{return fm.readImage(p)}catch(_){} }
  try{
    let img=null;
    for(const u of (preset.urls||[preset.url])){if(!u)continue;try{const r=new Request(u);r.timeoutInterval=10;r.headers={'User-Agent':'Mozilla/5.0'};img=await r.loadImage();if(img)break}catch(_){}}
    if(!img)return null;
    const W=690,H=320,ctx=new DrawContext();ctx.size=new Size(W,H);ctx.opaque=true;ctx.respectScreenScale=false;
    ctx.setFillColor(col(C.bg));ctx.fillRect(new Rect(0,0,W,H));
    ctx.drawImageInRect(img,coverRect(img,preset.focus??.5,preset.shift??0));
    ctx.setFillColor(col('#030609',.18));ctx.fillRect(new Rect(0,0,W,H));
    const step=2;
    for(let x=0;x<W;x+=step){const t=x/(W-1),s=smoothstep(Math.min(1,Math.max(0,t))),a=.82*(1-s)+.06;ctx.setFillColor(col('#030609',a));ctx.fillRect(new Rect(x,0,step+1,H))}
    const vSteps=56;
    for(let i=0;i<vSteps;i++){const y=218+i*(102/vSteps),t=i/(vSteps-1),a=.015+.25*t*t;ctx.setFillColor(col('#020407',a));ctx.fillRect(new Rect(0,y,W,102/vSteps+1))}
    for(let x=560;x<W;x+=2){const t=(x-560)/(W-560),a=.02+.14*smoothstep(t);ctx.setFillColor(col('#020407',a));ctx.fillRect(new Rect(x,0,3,H))}
    ctx.setFillColor(col(S.accent,.88));ctx.fillRect(new Rect(0,0,W,3));
    const out=ctx.getImage();try{fm.writeImage(p,out)}catch(_){}return out;
  }catch(_){return null}
}

function T(st,s,z,c,w='regular',n=1){const t=st.addText(String(s??''));t.font=w==='heavy'?Font.heavySystemFont(z):w==='bold'?Font.boldSystemFont(z):w==='semibold'?Font.semiboldSystemFont(z):Font.systemFont(z);t.textColor=c;t.lineLimit=n;t.minimumScaleFactor=.68;return t}
function rn(s){s=String(s||'');for(const [a,b] of [[/Italian Grand Prix/i,'イタリアGP'],[/Lone Star Le Mans/i,'ローンスター・ル・マン'],[/Rally del Paraguay/i,'ラリー・パラグアイ'],[/Grand Prix of Aragon/i,'アラゴンGP'],[/6 Hours of Fuji/i,'富士6時間'],[/San Marino Grand Prix/i,'サンマリノGP']])if(a.test(s))return b;return s.replace(/Grand Prix/ig,'GP')}
function cn(s){if(/Monza/i.test(s))return'モンツァ';if(/Circuit of the Americas/i.test(s))return'COTA';if(/MotorLand Aragón|Aragon/i.test(s))return'モーターランド・アラゴン';if(/Fuji Speedway/i.test(s))return'富士スピードウェイ';return s||''}
function dateText(d){const x=new Date(d.date);if(!isFinite(x))return'日程未取得';const f=new DateFormatter();f.locale='ja_JP';f.timeZone='Asia/Tokyo';f.dateFormat=d.timeTbd?'M/d(E)':'M/d(E) HH:mm';return f.string(x)+(d.timeTbd?'・時刻未定':'')}
function countdown(d){const q=new Date(d.date)-Date.now();if(q<=0&&q>-4*3600000)return{label:'LIVE',live:true};if(q<=0)return{label:'終了',live:false};const h=q/3600000;if(d.timeTbd)return{label:`あと${Math.max(1,Math.ceil(h/24))}日`,live:false};if(h<1)return{label:`あと${Math.ceil(q/60000)}分`,live:false};if(h<24)return{label:`あと${Math.ceil(h)}時間`,live:false};return{label:`あと${Math.ceil(h/24)}日`,live:false}}
function sub(r){if(K==='wec')return`${r.machine||''}  ｜  ${r.team||''}`;if(K==='f1')return`${r.maker||''}  ｜  ${r.team||''}`;return`${r.maker||''} · ${r.machine||''}  ｜  ${r.team||''}`}
function base(bg){const w=new ListWidget();if(bg)w.backgroundImage=bg;else{const g=new LinearGradient();g.colors=[col(S.accent,.16),col(C.bg,1)];g.locations=[0,1];w.backgroundGradient=g}w.url=S.url;w.setPadding(9,12,8,12);return w}
function pill(st,label,accent=false){const p=st.addStack();p.backgroundColor=accent?col(S.accent,.18):col('#000000',.32);p.cornerRadius=8;p.setPadding(3,7,3,7);T(p,label,accent?9.6:9.1,accent?col(S.accent):col(C.muted),'heavy');return p}
function rightLabel(st,label,size=8,color=col(C.dim),weight='bold'){const box=st.addStack();box.size=new Size(38,0);const t=T(box,label,size,color,weight);t.rightAlignText();return box}

function medium(d,cached,bg){
  const w=base(bg),ci=countdown(d);
  const top=w.addStack();top.layoutHorizontally();top.centerAlignContent();pill(top,S.label,true);top.addSpacer(6);T(top,'次戦',8,col(C.dim),'bold');top.addSpacer();if(cached)T(top,'• 更新待ち',6.8,col(C.warn,.78),'semibold');
  w.addSpacer(3);
  T(w,rn(d.race||'次戦取得中'),20.6,col(C.text),'heavy',1);
  w.addSpacer(1);
  const info=w.addStack();info.layoutHorizontally();info.centerAlignContent();T(info,dateText(d),10.7,col(C.muted),'semibold');if(d.circuit){info.addSpacer(5);T(info,`｜ ${cn(d.circuit)}`,9.6,col(C.dim),'semibold')}info.addSpacer();const cp=info.addStack();cp.backgroundColor=ci.live?col(C.good,.19):col('#000000',.27);cp.cornerRadius=9;cp.setPadding(3,7,3,7);T(cp,ci.label,16.2,ci.live?col(C.good):col(C.text),'heavy');
  w.addSpacer(5);
  const hh=w.addStack();hh.layoutHorizontally();T(hh,S.rank,8.2,col(C.muted),'bold');hh.addSpacer();rightLabel(hh,'PTS',7.1,col(C.muted,.82),'semibold');
  w.addSpacer(2);
  const ranking=(d.ranking||[]).slice(0,3);
  for(let i=0;i<ranking.length;i++){
    const r=ranking[i],row=w.addStack();row.layoutHorizontally();row.centerAlignContent();
    const pos=row.addStack();pos.size=new Size(18,0);T(pos,String(r.pos),11.4,col(S.accent),'heavy');row.addSpacer(4);
    const nm=row.addStack();T(nm,r.name,K==='supergt'?12.1:13.1,col(C.text),'semibold');row.addSpacer();
    const pts=row.addStack();pts.size=new Size(38,0);pts.backgroundColor=col('#000000',.14);pts.cornerRadius=5;pts.setPadding(0,2,0,2);const pt=T(pts,String(r.points||'').replace(' pts',''),10.4,col(C.text,.84),'semibold');pt.rightAlignText();
    const sr=w.addStack();sr.layoutHorizontally();sr.addSpacer(22);T(sr,sub(r),8.6,col(C.dim),'semibold');
    if(i<ranking.length-1)w.addSpacer(1);
  }
  w.refreshAfterDate=new Date(Date.now()+15*60000);
  return w;
}

function small(d,cached,bg){
  const w=base(bg),ci=countdown(d),top=w.addStack();top.layoutHorizontally();pill(top,S.label,true);top.addSpacer();if(cached)T(top,'•',6.8,col(C.warn,.78),'semibold');
  w.addSpacer(6);T(w,rn(d.race||'次戦'),16.5,col(C.text),'heavy',2);w.addSpacer(4);T(w,dateText(d),8.9,col(C.muted),'semibold');w.addSpacer();
  const cp=w.addStack();cp.backgroundColor=ci.live?col(C.good,.19):col('#000000',.27);cp.cornerRadius=10;cp.setPadding(4,7,4,7);T(cp,ci.label,20,ci.live?col(C.good):col(C.text),'heavy');
  w.refreshAfterDate=new Date(Date.now()+15*60000);return w;
}

let w;
try{const x=await load(),bg=await hero(x.d);w=F==='small'?small(x.d,x.cached,bg):medium(x.d,x.cached,bg)}
catch(e){w=base(null);pill(w,S.label,true);w.addSpacer(8);T(w,'データ取得失敗',18,col(C.text),'heavy');w.addSpacer(3);T(w,'通信回復後に再取得します',9.5,col(C.warn),'semibold')}
if(config.runsInWidget)Script.setWidget(w);else if(F==='small')await w.presentSmall();else await w.presentMedium();
Script.complete();
})();