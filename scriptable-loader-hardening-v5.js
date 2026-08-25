// Motorsport Hub HARDENING TEST loader v5 — isolated rolling test ref.
// TEST ONLY. Does not share Router candidate/LKG/quarantine files with the normal loader.
(async()=>{
  const ROUTER_REF='hardening-live';
  const URL=`https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/${ROUTER_REF}/motorsport-hub.js`;
  const ROUTER_SCHEMA=5;
  const CATEGORY_MANIFEST='F1,WEC,WRC,SUPERGT,MOTOGP,FDJ,D1GP,SUPERFORMULA,INDYCAR,NASCAR,GTWCEU,QA';
  const fm=FileManager.local(),dir=fm.documentsDirectory();
  const candidatePath=fm.joinPath(dir,'motorsport-hub-hardening-router-v5-candidate.js');
  const lkgPath=fm.joinPath(dir,'motorsport-hub-hardening-router-v5-lkg.js');
  const quarantinePath=fm.joinPath(dir,'motorsport-hub-hardening-router-v5-quarantine.js');

  const syntaxOK=s=>{try{new Function(String(s||''));return true}catch(_){return false}};
  const valid=s=>typeof s==='string'
    &&s.includes('Motorsport Hub')
    &&s.includes('module router')
    &&s.includes(`MH_ROUTER_SCHEMA=${ROUTER_SCHEMA}`)
    &&s.includes(`MH_CATEGORY_MANIFEST=${CATEGORY_MANIFEST}`)
    &&s.includes('Script.complete()')
    &&syntaxOK(s);
  const remove=p=>{try{if(fm.fileExists(p))fm.remove(p)}catch(_){}};
  const quarantine=code=>{try{if(typeof code==='string'&&code.length)fm.writeString(quarantinePath,code)}catch(_){}remove(candidatePath)};
  const readValid=p=>{try{if(!fm.fileExists(p))return'';const s=fm.readString(p);if(valid(s))return s;quarantine(s);if(p!==candidatePath)remove(p)}catch(_){}return''};

  const fail=async msg=>{
    const w=new ListWidget();w.backgroundColor=new Color('#080B10');w.setPadding(12,12,12,12);
    const a=w.addText('Motorsport Hub HARDENING');a.font=Font.boldSystemFont(14);a.textColor=Color.white();
    w.addSpacer(6);const b=w.addText(msg);b.font=Font.systemFont(10);b.textColor=new Color('#FFB84D');b.lineLimit=5;
    w.refreshAfterDate=new Date(Date.now()+5*60000);if(config.runsInWidget)Script.setWidget(w);else await w.presentSmall();Script.complete();
  };
  const execute=async(code,repoOffline=false)=>{
    try{
      delete globalThis.__MH_ROUTER_SCHEMA;delete globalThis.__MH_ROUTER_MANIFEST;delete globalThis.__MH_ROUTER_BOOT_OK;
      if(repoOffline)globalThis.__MH_REMOTE_OFFLINE=true;else try{delete globalThis.__MH_REMOTE_OFFLINE}catch(_){}
      globalThis.__MH_SOURCE_REF=ROUTER_REF;
      await eval(code);
      return globalThis.__MH_ROUTER_BOOT_OK===true&&globalThis.__MH_ROUTER_SCHEMA===ROUTER_SCHEMA&&globalThis.__MH_ROUTER_MANIFEST===CATEGORY_MANIFEST;
    }catch(_){return false}
    finally{try{delete globalThis.__MH_SOURCE_REF}catch(_){}try{delete globalThis.__MH_REMOTE_OFFLINE}catch(_){}}
  };

  let candidate='';
  try{
    const r=new Request(`${URL}?hardening=${Date.now()}-${Math.random()}`);r.timeoutInterval=8;
    r.headers={'Cache-Control':'no-cache, no-store, max-age=0, must-revalidate','Pragma':'no-cache','Expires':'0','User-Agent':'MotorsportHubHardeningLoader/5'};
    candidate=await r.loadString();if(!valid(candidate))throw Error('Invalid router candidate');fm.writeString(candidatePath,candidate);
  }catch(_){if(candidate&&!valid(candidate))quarantine(candidate);candidate=''}

  if(candidate){
    const ok=await execute(candidate,false);
    if(ok){try{fm.writeString(lkgPath,candidate)}catch(_){}remove(candidatePath);return}
    quarantine(candidate);
  }
  const lkg=readValid(lkgPath);
  if(lkg){const ok=await execute(lkg,true);if(ok)return;quarantine(lkg);remove(lkgPath)}
  await fail('Hardening検証Routerを取得できません。通常版へはフォールバックしません。通信回復後に再試行してください。');
})();