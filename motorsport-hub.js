// Motorsport Hub v8.8.0 — module router
// Adds D1GP as the seventh category while preserving the v8.7.1 Universal Readability Pass for existing categories.
// Loader v4 compatibility marker: v8.6.0 motorsport-core-v841.js motorsport-hq-core.js fdj-widget.js
(async()=>{
const labels=['F1','WEC','WRC','SUPER GT','MotoGP','FDJ','D1GP'];
const params=['F1','WEC','WRC','SUPERGT','MOTOGP','FDJ','D1GP'];
const norm=v=>String(v||'').trim().toUpperCase().replace(/[\s_-]+/g,'');
let selected=norm(args.widgetParameter);
if(selected==='D1')selected='D1GP';
if(!config.runsInWidget&&!params.includes(selected)){
  const a=new Alert();a.title='Motorsport Hub';a.message='プレビューするカテゴリ';
  labels.forEach(x=>a.addAction(x));a.addCancelAction('キャンセル');
  const i=await a.presentSheet();if(i<0){Script.complete();return}selected=params[i];
}
if(!selected)selected='F1';

const isD1=selected==='D1GP';
const file=isD1?'d1gp-widget.js':'motorsport-universal-v871.js';
const key=isD1?'d1gp-v880':'universal-v871';
const URL=`https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/main/${file}`;
const fm=FileManager.local(),cache=fm.joinPath(fm.documentsDirectory(),`motorsport-hub-module-${key}.js`);
const valid=s=>typeof s==='string'
  &&s.includes('Motorsport Hub')
  &&s.includes('Script.complete()')
  &&(isD1?s.includes('D1GP module'):s.includes('Final Visual Polish'));

async function fail(){
  const w=new ListWidget();w.backgroundColor=new Color('#080B10');w.setPadding(12,12,12,12);
  const a=w.addText('Motorsport Hub');a.font=Font.boldSystemFont(14);a.textColor=Color.white();
  w.addSpacer(6);const b=w.addText('最新版モジュールを取得できません。旧版へ戻さず数分後に再試行します。');b.font=Font.systemFont(10);b.textColor=new Color('#FFB84D');b.lineLimit=3;
  w.refreshAfterDate=new Date(Date.now()+5*60000);
  if(config.runsInWidget)Script.setWidget(w);else await w.presentSmall();Script.complete();
}

let code='';
try{
  const r=new Request(`${URL}?v=880&t=${Date.now()}-${Math.random()}`);r.timeoutInterval=15;
  r.headers={'Cache-Control':'no-cache, no-store, max-age=0, must-revalidate','Pragma':'no-cache','Expires':'0','User-Agent':'MotorsportHubRouter/8.8'};
  code=await r.loadString();if(!valid(code))throw Error('invalid module');fm.writeString(cache,code);
}catch(e){
  try{if(fm.fileExists(cache)){const c=fm.readString(cache);if(valid(c))code=c;else fm.remove(cache)}}catch(_){}
}
if(!valid(code)){await fail();return}

if(!isD1)globalThis.__MH_UNIVERSAL_PARAMETER=selected;
try{await eval(code)}catch(e){await fail()}
finally{try{delete globalThis.__MH_UNIVERSAL_PARAMETER}catch(_){}}
})();
