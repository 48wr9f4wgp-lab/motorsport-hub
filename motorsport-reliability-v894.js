// Motorsport Hub v8.9.4 — Reliability Pass / 2026 WEC naming guard
// Official 2026 FIA WEC naming: TR010 Hybrid / TOYOTA RACING.
// Keeps v8.9.2 reliability + SUPER GT metadata fixes and patches only the legacy HQ source when it is loaded.
(async()=>{
const URL='https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/main/motorsport-reliability-v892.js';
const fm=FileManager.local(),DOC=fm.documentsDirectory();
const cache=fm.joinPath(DOC,'motorsport-reliability-source-v894.js');
const valid=s=>typeof s==='string'&&s.includes('Reliability Pass')&&s.includes('Script.complete()');
let code='';
try{
 const r=new Request(`${URL}?v=894&t=${Date.now()}-${Math.random()}`);r.timeoutInterval=15;
 r.headers={'Cache-Control':'no-cache, no-store, max-age=0, must-revalidate','Pragma':'no-cache','Expires':'0','User-Agent':'MotorsportHub/8.9.4'};
 code=await r.loadString();if(!valid(code))throw Error('invalid reliability source');fm.writeString(cache,code);
}catch(e){try{if(fm.fileExists(cache)){const c=fm.readString(cache);if(valid(c))code=c;else fm.remove(cache)}}catch(_){}}
if(!valid(code))throw Error('v8.9.4 reliability source unavailable');

// The legacy WEC/SUPER GT HQ module still contains the pre-2026 Toyota labels.
// Intercept only that source load and normalize it to the official 2026 FIA WEC names.
const originalLoadString=Request.prototype.loadString;
Request.prototype.loadString=async function(){
 const s=await originalLoadString.call(this);
 if(typeof s==='string'&&s.includes('dedicated HQ module for WEC / SUPER GT')){
  return s.replace(/GR010 Hybrid/g,'TR010 Hybrid').replace(/TOYOTA GAZOO RACING/g,'TOYOTA RACING');
 }
 return s;
};
try{await eval(code)}finally{Request.prototype.loadString=originalLoadString}
})();