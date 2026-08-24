// Motorsport Hub v8.6.1 — SUPER GT HQ override
// Pins SUPER GT to an au TOM'S GR Supra race-action hero and invalidates the old HQ image cache.
(async()=>{
const URL='https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/main/motorsport-hq-core.js';
const fm=FileManager.local(),DOC=fm.documentsDirectory();
const cache=fm.joinPath(DOC,'motorsport-supergt-wrapper-v861.js');
const OLD="https://commons.wikimedia.org/wiki/Special:Redirect/file/MOTUL%20AUTECH%20Z%202024%20rd.2%20FUJI.jpg?width=2048";
const HERO="https://commons.wikimedia.org/wiki/Special:Redirect/file/No.36%20au%20TOM%27S%20GR%20Supra%20at%202022%20Fujimaki%20Group%20Suzuka%20GT%20450km%20%2813%29.jpg?width=2048";
const valid=s=>typeof s==='string'&&s.includes('dedicated HQ module for WEC / SUPER GT')&&s.includes(OLD)&&s.includes('Script.complete()');
let code='';
try{
  const r=new Request(`${URL}?v=861&t=${Date.now()}-${Math.random()}`);r.timeoutInterval=12;
  r.headers={'Cache-Control':'no-cache, no-store, max-age=0','Pragma':'no-cache'};
  code=await r.loadString();
  if(!valid(code))throw Error('invalid HQ core');
  fm.writeString(cache,code);
}catch(e){
  try{if(fm.fileExists(cache)){const c=fm.readString(cache);if(valid(c))code=c;else fm.remove(cache)}}catch(_){}
}
if(!valid(code))throw Error('SUPER GT HQ core unavailable');
code=code.replace(OLD,HERO);
code=code.replace(/motorsport-hero-v860-/g,'motorsport-hero-v861-');
code=code.replace(/&v=860/g,'&v=861');
globalThis.__MH_MODULE_PARAMETER='SUPERGT';
await eval(code);
})();
