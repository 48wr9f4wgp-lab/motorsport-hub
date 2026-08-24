// Motorsport Hub loader — paste this into Scriptable once.
(async()=>{
  const URL='https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/main/motorsport-hub.js';
  const fm=FileManager.local();
  const cache=fm.joinPath(fm.documentsDirectory(),'motorsport-hub-remote.js');
  let code='';
  try{
    const r=new Request(`${URL}?t=${Date.now()}`);
    r.timeoutInterval=10;
    code=await r.loadString();
    if(!code.includes('Motorsport Hub')||!code.includes('(async()=>')) throw new Error('Invalid remote script');
    fm.writeString(cache,code);
  }catch(e){
    if(fm.fileExists(cache)) code=fm.readString(cache);
    else throw e;
  }
  await eval(code);
})();