// Motorsport Hub v8.8.2 — D1GP module action-hero wrapper
// D1GP module: keeps v8.8.1 data/layout, swaps the static S14 hero for an in-motion S14 drift image.
(async()=>{
const URL='https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/main/d1gp-widget.js';
const fm=FileManager.local(),DOC=fm.documentsDirectory();
const cache=fm.joinPath(DOC,'motorsport-d1gp-source-v882.js');
const OLD="https://commons.wikimedia.org/wiki/Special:Redirect/file/Nissan%20Silvia%20S14%20Drift.jpg?width=2048";
const OLD2="https://commons.wikimedia.org/wiki/Special:Redirect/file/Nissan%20Silvia%20S14%20Drift.jpg?width=1280";
const ACTION="https://commons.wikimedia.org/wiki/Special:Redirect/file/King%20of%20Europe%20Round%203%20Lydden%20Hill%202014%20%2814356011899%29.jpg?width=2048";
const ACTION2="https://commons.wikimedia.org/wiki/Special:Redirect/file/King%20of%20Europe%20Round%203%20Lydden%20Hill%202014%20%2814356011899%29.jpg?width=1280";
const valid=s=>typeof s==='string'&&s.includes('D1GP module')&&s.includes('Script.complete()');
let code='';
try{
  const r=new Request(`${URL}?v=882&t=${Date.now()}-${Math.random()}`);r.timeoutInterval=15;
  r.headers={'Cache-Control':'no-cache, no-store, max-age=0, must-revalidate','Pragma':'no-cache','Expires':'0','User-Agent':'MotorsportHub/8.8.2'};
  code=await r.loadString();if(!valid(code))throw Error('invalid D1GP module');fm.writeString(cache,code);
}catch(e){
  try{if(fm.fileExists(cache)){const c=fm.readString(cache);if(valid(c))code=c;else fm.remove(cache)}}catch(_){}
}
if(!valid(code))throw Error('D1GP source unavailable');
code=code.replace(OLD,ACTION).replace(OLD2,ACTION2);
code=code.replace(/motorsport-hero-v881-/g,'motorsport-hero-v882-');
code=code.replace(/&v=881/g,'&v=882');
await eval(code);
})();
