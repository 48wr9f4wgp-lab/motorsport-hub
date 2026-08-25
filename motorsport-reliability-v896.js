// Motorsport Hub v8.9.6-hardening — Reliability Pass / verified SUPER GT hero
// Keeps v8.9.5 behavior and forces every effective SUPER GT hero candidate to the exact-page verified CC0 asset.
(async()=>{
const norm=v=>String(v||'').trim().toUpperCase().replace(/[\s_-]+/g,'');
const selected=norm(globalThis.__MH_UNIVERSAL_PARAMETER||args.widgetParameter)||'F1';
const REF=globalThis.__MH_SOURCE_REF||'main';
const URL=`https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/${REF}/motorsport-reliability-v895.js`;
const fm=FileManager.local(),DOC=fm.documentsDirectory();
const cache=fm.joinPath(DOC,'motorsport-reliability-source-v896.js');
const valid=s=>typeof s==='string'&&s.includes('Reliability Pass')&&s.includes('Script.complete()');
let code='';
try{
 if(globalThis.__MH_REMOTE_OFFLINE)throw Error('repo offline');
 const r=new Request(`${URL}?v=896&t=${Date.now()}-${Math.random()}`);r.timeoutInterval=15;
 r.headers={'Cache-Control':'no-cache, no-store, max-age=0, must-revalidate','Pragma':'no-cache','Expires':'0','User-Agent':'MotorsportHub/8.9.6'};
 code=await r.loadString();if(!valid(code))throw Error('invalid reliability source');fm.writeString(cache,code);
}catch(e){try{if(fm.fileExists(cache)){const c=fm.readString(cache);if(valid(c))code=c;else fm.remove(cache)}}catch(_){}}
if(!valid(code))throw Error('v8.9.6 reliability source unavailable');

const VERIFIED_SGT="https://commons.wikimedia.org/wiki/Special:Redirect/file/Osaka%20Auto%20Messe%202025%20%281%29%20-%20No.36%20au%20TOM%27S%20GR%20Supra%20in%202024%20SUPER%20GT.jpg?width=2048";
const VERIFIED_SGT_1280="https://commons.wikimedia.org/wiki/Special:Redirect/file/Osaka%20Auto%20Messe%202025%20%281%29%20-%20No.36%20au%20TOM%27S%20GR%20Supra%20in%202024%20SUPER%20GT.jpg?width=1280";
const originalLoadString=Request.prototype.loadString;
Request.prototype.loadString=async function(){
 let s=await originalLoadString.call(this);
 if(selected==='SUPERGT'&&typeof s==='string'){
  if(s.includes('Final Visual Polish')){
   const oldHero="https://commons.wikimedia.org/wiki/Special:Redirect/file/No.36%20au%20TOM%27S%20GR%20Supra%20at%202022%20Fujimaki%20Group%20Suzuka%20GT%20450km%20%2813%29.jpg?width=2048";
   s=String(s).split(oldHero).join(VERIFIED_SGT);
   s=String(s).split('motorsport-hero-v871-').join('motorsport-hero-v896-');
   s=String(s).split('&v=871').join('&v=896');
  }
  if(s.includes('dedicated HQ module for WEC / SUPER GT')){
   // Base HQ historically carried multiple fallback photos. Replace all SUPER GT candidates before eval
   // so a failed primary image can never fall through to an unattributed asset.
   s=s.replace(/const HERO=\{([\s\S]*?)supergt:\[[\s\S]*?\]\n\};/,(_,before)=>`const HERO={${before}supergt:[\n  '${VERIFIED_SGT}',\n  '${VERIFIED_SGT_1280}'\n ]\n};`);
  }
 }
 return s;
};
try{await eval(code)}finally{Request.prototype.loadString=originalLoadString}
})();