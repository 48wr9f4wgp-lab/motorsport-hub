// Motorsport Hub v8.9.5 — Reliability Pass / event-boundary guard
// Keeps v8.9.4 behavior and prevents active events from advancing to the next round too early.
(async()=>{
const norm=v=>String(v||'').trim().toUpperCase().replace(/[\s_-]+/g,'');
const selected=norm(globalThis.__MH_UNIVERSAL_PARAMETER||args.widgetParameter)||'F1';
const URL='https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/main/motorsport-reliability-v894.js';
const fm=FileManager.local(),DOC=fm.documentsDirectory();
const cache=fm.joinPath(DOC,'motorsport-reliability-source-v895.js');
const valid=s=>typeof s==='string'&&s.includes('Reliability Pass')&&s.includes('Script.complete()');
let code='';
try{
 const r=new Request(`${URL}?v=895&t=${Date.now()}-${Math.random()}`);r.timeoutInterval=15;
 r.headers={'Cache-Control':'no-cache, no-store, max-age=0, must-revalidate','Pragma':'no-cache','Expires':'0','User-Agent':'MotorsportHub/8.9.5'};
 code=await r.loadString();if(!valid(code))throw Error('invalid reliability source');fm.writeString(cache,code);
}catch(e){try{if(fm.fileExists(cache)){const c=fm.readString(cache);if(valid(c))code=c;else fm.remove(cache)}}catch(_){}}
if(!valid(code))throw Error('v8.9.5 reliability source unavailable');

const originalLoadString=Request.prototype.loadString;
Request.prototype.loadString=async function(){
 let s=await originalLoadString.call(this);
 if(typeof s!=='string')return s;

 // WEC / SUPER GT: keep the current event visible through the race window.
 if((selected==='WEC'||selected==='SUPERGT')&&s.includes('dedicated HQ module for WEC / SUPER GT')){
  const hold=selected==='WEC'?10:8;
  s=s.replace(
   /function calendar\(d\)\{const now=Date\.now\(\);for\(const e of CAL\[K\]\)\{if\(Date\.parse\(e\[1\]\)>now-6\*3600000\)return\{\.\.\.d,race:e\[0\],date:e\[1\],circuit:e\[2\],timeTbd:!!e\[3\]\}\}return d\}/,
   `function calendar(d){const now=Date.now(),hold=${hold}*3600000;for(const e of CAL[K]){if(Date.parse(e[1])+hold>now)return{...d,race:e[0],date:e[1],circuit:e[2],timeTbd:!!e[3]}}return d}`
  );
  s=s.replace(
   /function countdown\(d\)\{[^\n]*\}/,
   `function countdown(d){const q=new Date(d.date)-Date.now(),hold=${hold}*3600000;if(q<=0&&q>-hold)return{label:'開催中',live:true};if(q<=0)return{label:'終了',live:false};const h=q/3600000;if(d.timeTbd)return{label:'あと'+Math.max(1,Math.ceil(h/24))+'日',live:false};if(h<24)return{label:'あと'+Math.ceil(h)+'時間',live:false};return{label:'あと'+Math.ceil(h/24)+'日',live:false}}`
  );
 }

 // MotoGP: do not switch to the next GP at the scheduled race-start instant.
 if(selected==='MOTOGP'&&s.includes('Professional Visual Pass / GitHub hosted / Scriptable')){
  s=s.replace(
   /function calendar\(d\)\{const c=CAL\[K\];if\(!c\)return d;const now=Date\.now\(\);for\(const e of c\)\{const t=Date\.parse\(e\[1\]\);if\(t>now\)return\{\.\.\.d,race:e\[0\],date:e\[1\],circuit:e\[2\],timeTbd:!!e\[3\]\}\}return d\}/,
   `function calendar(d){const c=CAL[K];if(!c)return d;const now=Date.now(),hold=4*3600000;for(const e of c){const t=Date.parse(e[1]);if(t+hold>now)return{...d,race:e[0],date:e[1],circuit:e[2],timeTbd:!!e[3]}}return d}`
  );
 }
 return s;
};
try{await eval(code)}finally{Request.prototype.loadString=originalLoadString}
})();
