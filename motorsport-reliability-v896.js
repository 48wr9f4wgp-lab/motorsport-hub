// Motorsport Hub v8.9.6 — Reliability Pass / verified SUPER GT hero
// Keeps v8.9.5 behavior and replaces the SUPER GT hero with an exact-page verified CC0 asset.
(async()=>{
const norm=v=>String(v||'').trim().toUpperCase().replace(/[\s_-]+/g,'');
const selected=norm(globalThis.__MH_UNIVERSAL_PARAMETER||args.widgetParameter)||'F1';
const URL='https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/main/motorsport-reliability-v895.js';
const fm=FileManager.local(),DOC=fm.documentsDirectory();
const cache=fm.joinPath(DOC,'motorsport-reliability-source-v896.js');
const valid=s=>typeof s==='string'&&s.includes('Reliability Pass')&&s.includes('Script.complete()');
let code='';
try{
 const r=new Request(`${URL}?v=896&t=${Date.now()}-${Math.random()}`);r.timeoutInterval=15;
 r.headers={'Cache-Control':'no-cache, no-store, max-age=0, must-revalidate','Pragma':'no-cache','Expires':'0','User-Agent':'MotorsportHub/8.9.6'};
 code=await r.loadString();if(!valid(code))throw Error('invalid reliability source');fm.writeString(cache,code);
}catch(e){try{if(fm.fileExists(cache)){const c=fm.readString(cache);if(valid(c))code=c;else fm.remove(cache)}}catch(_){}}
if(!valid(code))throw Error('v8.9.6 reliability source unavailable');

const originalLoadString=Request.prototype.loadString;
Request.prototype.loadString=async function(){
 let s=await originalLoadString.call(this);
 if(selected==='SUPERGT'&&typeof s==='string'&&s.includes('Final Visual Polish')){
  const oldHero="https://commons.wikimedia.org/wiki/Special:Redirect/file/No.36%20au%20TOM%27S%20GR%20Supra%20at%202022%20Fujimaki%20Group%20Suzuka%20GT%20450km%20%2813%29.jpg?width=2048";
  const verifiedHero="https://commons.wikimedia.org/wiki/Special:Redirect/file/Osaka%20Auto%20Messe%202025%20%281%29%20-%20No.36%20au%20TOM%27S%20GR%20Supra%20in%202024%20SUPER%20GT.jpg?width=2048";
  s=String(s).split(oldHero).join(verifiedHero);
  // Force a fresh hero render instead of reusing the previous cached action image.
  s=String(s).split('motorsport-hero-v871-').join('motorsport-hero-v896-');
  s=String(s).split('&v=871').join('&v=896');
 }
 return s;
};
try{await eval(code)}finally{Request.prototype.loadString=originalLoadString}
})();
