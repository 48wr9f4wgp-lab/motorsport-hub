// Motorsport Hub v8.5.0 — module router
// Existing categories remain frozen on v8.4.1 core; FDJ is isolated in its own module.
(async()=>{
const MARKERS={F1:'f1',WEC:'wec',MOTOGP:'motogp'};
const norm=v=>String(v||'').trim().toUpperCase().replace(/[\s_-]+/g,'');
const p=norm(args.widgetParameter);
const isFDJ=p==='FDJ'||p==='FORMULADRIFTJAPAN';
const key=isFDJ?'fdj':'core-v841';
const file=isFDJ?'fdj-widget.js':'motorsport-core-v841.js';
const URL=`https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/main/${file}`;
const fm=FileManager.local(),cache=fm.joinPath(fm.documentsDirectory(),`motorsport-hub-module-${key}.js`);
const valid=s=>typeof s==='string'&&s.includes('Motorsport Hub')&&s.includes('(async()=>')&&s.includes('Script.complete()');
async function fail(){const w=new ListWidget();w.backgroundColor=new Color('#080B10');w.setPadding(12,12,12,12);const a=w.addText('Motorsport Hub');a.font=Font.boldSystemFont(14);a.textColor=Color.white();w.addSpacer(6);const b=w.addText('モジュールを取得できません。数分後に自動再試行します。');b.font=Font.systemFont(10);b.textColor=new Color('#FFB84D');b.lineLimit=3;w.refreshAfterDate=new Date(Date.now()+5*60000);if(config.runsInWidget)Script.setWidget(w);else await w.presentSmall();Script.complete();}
let code='';
try{const r=new Request(`${URL}?t=${Date.now()}`);r.timeoutInterval=10;code=await r.loadString();if(!valid(code))throw Error('invalid module');fm.writeString(cache,code)}catch(e){try{if(fm.fileExists(cache)){const c=fm.readString(cache);if(valid(c))code=c;else fm.remove(cache)}}catch(_){}}
if(!valid(code)){await fail();return}
try{await eval(code)}catch(e){await fail()}
})();