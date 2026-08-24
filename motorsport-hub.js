// Motorsport Hub v8.5.5 — module router / HQ hero pass
// Existing category logic remains frozen; HQ rendering is injected only for FDJ / WEC / SUPER GT.
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
const isHQCore=selected==='WEC'||selected==='SUPERGT';
const key=isFDJ?'fdj':'core-v841';
const file=isFDJ?'fdj-widget.js':'motorsport-core-v841.js';
const URL=`https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/main/${file}`;
const fm=FileManager.local(),cache=fm.joinPath(fm.documentsDirectory(),`motorsport-hub-module-${key}.js`);
const valid=s=>typeof s==='string'&&s.includes('Motorsport Hub')&&s.includes('(async()=>')&&s.includes('Script.complete()');

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

// Legacy core: inject router-selected category so its old picker is skipped.
if(!isFDJ){
  globalThis.__MH_WIDGET_PARAMETER=selected;
  code=code.replace('let mode=norm(args.widgetParameter);','let mode=norm(globalThis.__MH_WIDGET_PARAMETER||args.widgetParameter);');
}

// v8.5.5 HQ pass. Keep layout/data logic untouched and upgrade only the image pipeline.
if(isHQCore){
  code=rep(code,'/960px-','/1920px-');
  code=rep(code,'?width=960','?width=1920');
  code=rep(code,'motorsport-hero-v840-small-','motorsport-hero-v855-small-');
  code=rep(code,'motorsport-hero-v832-','motorsport-hero-v855-medium-');
  code=rep(code,'const W=isSmall?360:690,H=isSmall?360:320','const W=isSmall?720:1380,H=isSmall?720:640');
  code=rep(code,"ctx.setFillColor(col('#030609',.18))","ctx.setFillColor(col('#030609',.11))");
  code=rep(code,'a=.82*(1-s)+.06','a=.76*(1-s)+.04');
  code=rep(code,'a=.015+.25*t*t','a=.012+.19*t*t');
  code=rep(code,'a=.02+.14*smoothstep(t)','a=.015+.10*smoothstep(t)');
}

if(isFDJ){
  code=rep(code,"const V='8.5.4'","const V='8.5.5'");
  code=rep(code,'?width=1280','?width=1920');
  code=rep(code,'?width=960','?width=1600');
  code=rep(code,'motorsport-hero-v854-','motorsport-hero-v855-');
  code=rep(code,'const W=small?360:690,H=small?360:320','const W=small?720:1380,H=small?720:640');
  code=rep(code,"ctx.setFillColor(col('#030609',.15))","ctx.setFillColor(col('#030609',.10))");
  code=rep(code,'a=.82*(1-smooth(t))+.04','a=.76*(1-smooth(t))+.035');
  code=rep(code,'a=.015+.22*t*t','a=.012+.18*t*t');
}

try{await eval(code)}catch(e){await fail()}
finally{try{delete globalThis.__MH_WIDGET_PARAMETER}catch(_){}}
})();