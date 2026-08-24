// Motorsport Hub loader v3 — paste into Scriptable once.
(async()=>{
  const URL='https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/main/motorsport-hub.js';
  const fm=FileManager.local();
  const cache=fm.joinPath(fm.documentsDirectory(),'motorsport-hub-remote-v3.js');

  // Only accept the post-v8.5 module router. Old v8.4.x monoliths are intentionally rejected.
  const valid=s=>typeof s==='string'
    &&s.includes('Motorsport Hub')
    &&s.includes('module router')
    &&s.includes("'FDJ'")
    &&s.includes('motorsport-core-v841.js')
    &&s.includes('fdj-widget.js')
    &&s.includes('Script.complete()');

  const fail=async msg=>{
    const w=new ListWidget();
    w.backgroundColor=new Color('#080B10');
    w.setPadding(12,12,12,12);
    const a=w.addText('Motorsport Hub');
    a.font=Font.boldSystemFont(14);a.textColor=Color.white();
    w.addSpacer(6);
    const b=w.addText(msg);
    b.font=Font.systemFont(10);b.textColor=new Color('#FFB84D');b.lineLimit=3;
    w.refreshAfterDate=new Date(Date.now()+5*60000);
    if(config.runsInWidget)Script.setWidget(w);else await w.presentSmall();
    Script.complete();
  };

  let code='';
  try{
    const r=new Request(`${URL}?mhv3=${Date.now()}-${Math.random()}`);
    r.timeoutInterval=12;
    r.headers={'Cache-Control':'no-cache, no-store, max-age=0','Pragma':'no-cache'};
    code=await r.loadString();
    if(!valid(code))throw new Error('Stale or invalid Motorsport Hub router');
    fm.writeString(cache,code);
  }catch(e){
    try{
      if(fm.fileExists(cache)){
        const c=fm.readString(cache);
        if(valid(c))code=c;
        else{fm.remove(cache);code='';}
      }
    }catch(_){code='';}
  }

  if(!valid(code)){
    await fail('最新版ルーターを取得できません。旧版は表示せず、数分後に再試行します。');
    return;
  }

  try{await eval(code)}
  catch(e){await fail('表示処理に失敗しました。自動再試行します。')}
})();