// Motorsport Hub v8.7.1 — Final Visual Polish
// Keeps the universal readability system, restores an action-first FDJ hero, and strengthens WRC PTS contrast.
(async()=>{
const norm=v=>String(v||'').trim().toUpperCase().replace(/[\s_-]+/g,'');
const selected=norm(globalThis.__MH_UNIVERSAL_PARAMETER||args.widgetParameter)||'F1';
const isFDJ=selected==='FDJ'||selected==='FORMULADRIFTJAPAN';
const isHQ=selected==='WEC'||selected==='SUPERGT';
const isSGT=selected==='SUPERGT';
const file=isFDJ?'fdj-widget.js':isHQ?'motorsport-hq-core.js':'motorsport-core-v841.js';
const key=isFDJ?'fdj':isHQ?'hq':'core';
const URL=`https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/main/${file}`;
const fm=FileManager.local(),DOC=fm.documentsDirectory();
const cache=fm.joinPath(DOC,`motorsport-universal-source-v871-${key}.js`);
const valid=s=>typeof s==='string'&&s.includes('Motorsport Hub')&&s.includes('(async()=>')&&s.includes('Script.complete()');
const rep=(s,a,b)=>String(s).split(a).join(b);

async function fail(msg){
  const w=new ListWidget();w.backgroundColor=new Color('#080B10');w.setPadding(12,12,12,12);
  const a=w.addText('Motorsport Hub');a.font=Font.boldSystemFont(14);a.textColor=Color.white();
  w.addSpacer(6);const b=w.addText(msg);b.font=Font.systemFont(10);b.textColor=new Color('#FFB84D');b.lineLimit=3;
  w.refreshAfterDate=new Date(Date.now()+5*60000);
  if(config.runsInWidget)Script.setWidget(w);else await w.presentSmall();Script.complete();
}

let code='';
try{
  const r=new Request(`${URL}?v=871&t=${Date.now()}-${Math.random()}`);r.timeoutInterval=15;
  r.headers={'Cache-Control':'no-cache, no-store, max-age=0, must-revalidate','Pragma':'no-cache','Expires':'0','User-Agent':'MotorsportHub/8.7.1'};
  code=await r.loadString();if(!valid(code))throw Error('invalid source');fm.writeString(cache,code);
}catch(e){
  try{if(fm.fileExists(cache)){const c=fm.readString(cache);if(valid(c))code=c;else fm.remove(cache)}}catch(_){}
}
if(!valid(code)){await fail('v8.7.1表示モジュールを取得できません。旧版へ戻さず再試行します。');return}

// ---------- Frozen v8.4.1 core: F1 / WRC / MotoGP ----------
if(!isFDJ&&!isHQ){
  globalThis.__MH_WIDGET_PARAMETER=selected;
  code=code.replace('let mode=norm(args.widgetParameter);','let mode=norm(globalThis.__MH_WIDGET_PARAMETER||args.widgetParameter);');
  code=rep(code,'motorsport-hero-v840-small-','motorsport-hero-v871-small-');
  code=rep(code,'motorsport-hero-v832-','motorsport-hero-v871-medium-');

  // Image-independent protection zones: strong left text veil + right PTS veil.
  code=rep(code,'a=.82*(1-s)+.06','a=.86*(1-s)+.07');
  code=rep(code,'const rightStart=W*.81;','const rightStart=W*.76;');
  code=rep(code,'a=.02+.14*smoothstep(t)','a=.08+.40*smoothstep(t)');

  // Countdown / location controls retain contrast against any hero image.
  code=rep(code,"cp.backgroundColor=ci.live?col(C.good,.19):col('#000000',.27)","cp.backgroundColor=ci.live?col(C.good,.28):col('#000000',.50)");
  code=rep(code,"cp.backgroundColor=ci.live?col(C.good,.20):col('#000000',.32)","cp.backgroundColor=ci.live?col(C.good,.30):col('#000000',.50)");
  code=rep(code,"loc.backgroundColor=col('#000000',.28)","loc.backgroundColor=col('#000000',.48)");

  // Universal PTS treatment.
  code=rep(code,
    "const ph=hh.addStack();ph.size=new Size(38,0);const pt=T(ph,'PTS',7.1,col(C.muted,.82),'semibold');pt.rightAlignText();",
    "const ph=hh.addStack();ph.size=new Size(42,0);const pt=T(ph,'PTS',7.4,col(C.text,.96),'bold');pt.rightAlignText();"
  );
  code=rep(code,
    "const pts=row.addStack();pts.size=new Size(38,0);pts.backgroundColor=col('#000000',.14);pts.cornerRadius=5;pts.setPadding(0,2,0,2);const pt=T(pts,String(r.points||'').replace(' pts',''),10.4,col(C.text,.84),'semibold');pt.rightAlignText();",
    "const pts=row.addStack();pts.size=new Size(42,0);pts.backgroundColor=col('#000000',.48);pts.cornerRadius=7;pts.setPadding(1,4,1,4);const pt=T(pts,String(r.points||'').replace(' pts',''),10.7,col(C.text,1),'heavy');pt.rightAlignText();"
  );

  // WRC's very dark car/background makes the same pill look visually weaker; compensate slightly.
  if(selected==='WRC'){
    code=rep(code,"pts.backgroundColor=col('#000000',.48);pts.cornerRadius=7;","pts.backgroundColor=col('#000000',.60);pts.borderWidth=.5;pts.borderColor=col('#FFFFFF',.10);pts.cornerRadius=7;");
  }
}

// ---------- FDJ ----------
if(isFDJ){
  code=rep(code,"const V='8.5.4'","const V='8.7.1'");
  // Restore the previously verified action-first drifting hero with tire smoke.
  code=code.replace(/const HERO_URLS=\[[\s\S]*?\];/,
    "const HERO_URLS=['https://commons.wikimedia.org/wiki/Special:Redirect/file/DRIFT-0ae1a2ba-2d7b-4d51-b082-b698f2fbb2f1.jpg?width=2048','https://commons.wikimedia.org/wiki/Special:Redirect/file/DRIFT-0ae1a2ba-2d7b-4d51-b082-b698f2fbb2f1.jpg?width=1280'];"
  );
  code=rep(code,'motorsport-hero-v854-','motorsport-hero-v871-');

  // Strong left veil and a dedicated right-side PTS veil.
  code=rep(code,'a=.82*(1-smooth(t))+.04','a=.86*(1-smooth(t))+.07');
  code=code.replace(
    "ctx.setFillColor(col(S.accent,.9));ctx.fillRect(new Rect(0,0,W,3));",
    "const rs=W*.76;for(let x=rs;x<W;x+=2){const t=(x-rs)/(W-rs),a=.08+.40*smooth(t);ctx.setFillColor(col('#020407',a));ctx.fillRect(new Rect(x,0,3,H))}ctx.setFillColor(col(S.accent,.9));ctx.fillRect(new Rect(0,0,W,3));"
  );

  code=rep(code,"cp.backgroundColor=ci.live?col(C.good,.19):col('#000000',.27)","cp.backgroundColor=ci.live?col(C.good,.28):col('#000000',.50)");
  code=rep(code,"cp.backgroundColor=ci.live?col(C.good,.20):col('#000000',.32)","cp.backgroundColor=ci.live?col(C.good,.30):col('#000000',.50)");
  code=rep(code,"loc.backgroundColor=col('#000000',.28)","loc.backgroundColor=col('#000000',.48)");
  code=rep(code,"T(hh,'PTS',7.1,col(C.muted,.82),'semibold')","T(hh,'PTS',7.4,col(C.text,.96),'bold')");
  code=rep(code,
    "const pts=row.addStack();pts.size=new Size(38,0);pts.backgroundColor=col('#000000',.14);pts.cornerRadius=5;pts.setPadding(0,2,0,2);const p=T(pts,String(r.points).replace(' pts',''),10.4,col(C.text,.84),'semibold');p.rightAlignText();",
    "const pts=row.addStack();pts.size=new Size(42,0);pts.backgroundColor=col('#000000',.48);pts.cornerRadius=7;pts.setPadding(1,4,1,4);const p=T(pts,String(r.points).replace(' pts',''),10.7,col(C.text,1),'heavy');p.rightAlignText();"
  );
}

// ---------- WEC / SUPER GT HQ ----------
if(isHQ){
  globalThis.__MH_MODULE_PARAMETER=selected;
  const OLD_SGT="https://commons.wikimedia.org/wiki/Special:Redirect/file/MOTUL%20AUTECH%20Z%202024%20rd.2%20FUJI.jpg?width=2048";
  const AU_TOMS="https://commons.wikimedia.org/wiki/Special:Redirect/file/No.36%20au%20TOM%27S%20GR%20Supra%20at%202022%20Fujimaki%20Group%20Suzuka%20GT%20450km%20%2813%29.jpg?width=2048";
  if(isSGT)code=code.replace(OLD_SGT,AU_TOMS);
  code=rep(code,'motorsport-hero-v860-','motorsport-hero-v871-');
  code=rep(code,'&v=860','&v=871');

  // Left text veil + right PTS veil, independent of image brightness.
  code=rep(code,'a=.70*(1-smooth(t))+.025','a=.80*(1-smooth(t))+.05');
  code=code.replace(
    "ctx.setFillColor(col(S.accent,.9));ctx.fillRect(new Rect(0,0,W,5));",
    "const rs=W*.76;for(let x=rs;x<W;x+=3){const t=(x-rs)/(W-rs),a=.08+.40*smooth(t);ctx.setFillColor(col('#020407',a));ctx.fillRect(new Rect(x,0,4,H))}ctx.setFillColor(col(S.accent,.9));ctx.fillRect(new Rect(0,0,W,5));"
  );

  code=rep(code,"cp.backgroundColor=ci.live?col(C.good,.19):col('#000000',.25)","cp.backgroundColor=ci.live?col(C.good,.28):col('#000000',.50)");
  code=rep(code,"cp.backgroundColor=ci.live?col(C.good,.20):col('#000000',.30)","cp.backgroundColor=ci.live?col(C.good,.30):col('#000000',.50)");
  code=rep(code,"loc.backgroundColor=col('#000000',.25)","loc.backgroundColor=col('#000000',.48)");
  code=rep(code,
    "const ph=hh.addStack();ph.size=new Size(38,0);const pt=T(ph,'PTS',7.1,col(C.muted,.82),'semibold');pt.rightAlignText();",
    "const ph=hh.addStack();ph.size=new Size(42,0);const pt=T(ph,'PTS',7.4,col(C.text,.96),'bold');pt.rightAlignText();"
  );
  code=rep(code,
    "const pts=row.addStack();pts.size=new Size(38,0);pts.backgroundColor=col('#000000',.12);pts.cornerRadius=5;pts.setPadding(0,2,0,2);const p=T(pts,String(r.points).replace(' pts',''),10.4,col(C.text,.88),'semibold');p.rightAlignText();",
    "const pts=row.addStack();pts.size=new Size(42,0);pts.backgroundColor=col('#000000',.48);pts.cornerRadius=7;pts.setPadding(1,4,1,4);const p=T(pts,String(r.points).replace(' pts',''),10.7,col(C.text,1),'heavy');p.rightAlignText();"
  );
}

try{await eval(code)}catch(e){await fail('v8.7.1可読性処理に失敗しました。数分後に再試行します。')}
finally{
  try{delete globalThis.__MH_WIDGET_PARAMETER}catch(_){}
  try{delete globalThis.__MH_MODULE_PARAMETER}catch(_){}
}
})();
