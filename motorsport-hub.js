// Motorsport Hub v8.5.7 — Hero Asset Quality Pass / forced race-action assets
// Existing category logic remains frozen; image injection is limited to FDJ / WEC / SUPER GT.
(async()=>{
const labels=['F1','WEC','WRC','SUPER GT','MotoGP','FDJ'];
const params=['F1','WEC','WRC','SUPERGT','MOTOGP','FDJ'];
const norm=v=>String(v||'').trim().toUpperCase().replace(/[\s_-]+/g,'');
const rep=(s,a,b)=>String(s).split(a).join(b);
let selected=norm(args.widgetParameter);

if(!config.runsInWidget&&!params.includes(selected)){
  const a=new Alert();
  a.title='Motorsport Hub';
  a.message='プレビューするカテゴリ';
  labels.forEach(x=>a.addAction(x));
  a.addCancelAction('キャンセル');
  const i=await a.presentSheet();
  if(i<0){Script.complete();return}
  selected=params[i];
}
if(!selected)selected='F1';

const isFDJ=selected==='FDJ'||selected==='FORMULADRIFTJAPAN';
const isWEC=selected==='WEC';
const isSGT=selected==='SUPERGT';
const isHQCore=isWEC||isSGT;
const key=isFDJ?'fdj':'core-v841';
const file=isFDJ?'fdj-widget.js':'motorsport-core-v841.js';
const URL=`https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/main/${file}`;
const fm=FileManager.local(),cache=fm.joinPath(fm.documentsDirectory(),`motorsport-hub-module-${key}.js`);
const valid=s=>typeof s==='string'&&s.includes('Motorsport Hub')&&s.includes('(async()=>')&&s.includes('Script.complete()');

const ASSET={
  fdj:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Nissan%20Silvia%20S14%20Drift.jpg?width=2048',
  wec:'https://commons.wikimedia.org/wiki/Special:Redirect/file/2024%206%20Hours%20of%20Spa-Francorchamps%20Toyota%20Gazoo%20Racing%20Toyota%20GR010%20Hybrid%20No.7%20%28DSC04523%29.jpg?width=2048',
  supergt:'https://commons.wikimedia.org/wiki/Special:Redirect/file/MOTUL%20AUTECH%20Z%202024%20rd.2%20FUJI.jpg?width=2048'
};

async function fail(){
  const w=new ListWidget();w.backgroundColor=new Color('#080B10');w.setPadding(12,12,12,12);
  const a=w.addText('Motorsport Hub');a.font=Font.boldSystemFont(14);a.textColor=Color.white();
  w.addSpacer(6);const b=w.addText('モジュールを取得できません。数分後に自動再試行します。');b.font=Font.systemFont(10);b.textColor=new Color('#FFB84D');b.lineLimit=3;
  w.refreshAfterDate=new Date(Date.now()+5*60000);
  if(config.runsInWidget)Script.setWidget(w);else await w.presentSmall();Script.complete();
}

let code='';
try{
  const r=new Request(`${URL}?t=${Date.now()}-${Math.random()}`);r.timeoutInterval=12;
  r.headers={'Cache-Control':'no-cache, no-store, max-age=0','Pragma':'no-cache'};
  code=await r.loadString();
  if(!valid(code))throw Error('invalid module');
  fm.writeString(cache,code);
}catch(e){
  try{if(fm.fileExists(cache)){const c=fm.readString(cache);if(valid(c))code=c;else fm.remove(cache)}}catch(_){}
}
if(!valid(code)){await fail();return}

if(!isFDJ){
  globalThis.__MH_WIDGET_PARAMETER=selected;
  code=code.replace('let mode=norm(args.widgetParameter);','let mode=norm(globalThis.__MH_WIDGET_PARAMETER||args.widgetParameter);');
}

// Force the HERO object itself instead of relying on an exact old URL match.
if(isWEC){
  code=code.replace(/TOYOTA:\{url:'[^']*',focus:\.44,shift:96\}/,
    `TOYOTA:{url:'${ASSET.wec}',focus:.51,shift:56}`);
}
if(isSGT){
  code=code.replace(/TOYOTA:\{url:"[^"]*",focus:\.58,shift:28\}/,
    `TOYOTA:{url:'${ASSET.supergt}',focus:.52,shift:42}`);
}

if(isHQCore){
  code=rep(code,'motorsport-hero-v840-small-','motorsport-hero-v857-small-');
  code=rep(code,'motorsport-hero-v832-','motorsport-hero-v857-medium-');
  code=rep(code,'const W=isSmall?360:690,H=isSmall?360:320','const W=isSmall?720:1380,H=isSmall?720:640');
  code=rep(code,"ctx.setFillColor(col('#030609',.18))","ctx.setFillColor(col('#030609',.09))");
  code=rep(code,'a=.82*(1-s)+.06','a=.72*(1-s)+.03');
  code=rep(code,'a=.015+.25*t*t','a=.009+.17*t*t');
  code=rep(code,'a=.02+.14*smoothstep(t)','a=.010+.08*smoothstep(t)');
}

if(isFDJ){
  code=rep(code,"const V='8.5.4'","const V='8.5.7'");
  code=code.replace(/const HERO_URLS=\[[\s\S]*?\];/,
    `const HERO_URLS=['${ASSET.fdj}'];`);
  code=rep(code,'motorsport-hero-v854-','motorsport-hero-v857-');
  code=rep(code,'const W=small?360:690,H=small?360:320','const W=small?720:1380,H=small?720:640');
  code=rep(code,'ctx.drawImageInRect(img,cover(img,W,H,.50,small?14:34))','ctx.drawImageInRect(img,cover(img,W,H,.55,small?10:24))');
  code=rep(code,"ctx.setFillColor(col('#030609',.15))","ctx.setFillColor(col('#030609',.09))");
  code=rep(code,'a=.82*(1-smooth(t))+.04','a=.72*(1-smooth(t))+.03');
  code=rep(code,'a=.015+.22*t*t','a=.009+.16*t*t');
}

try{await eval(code)}catch(e){await fail()}
finally{try{delete globalThis.__MH_WIDGET_PARAMETER}catch(_){}}
})();