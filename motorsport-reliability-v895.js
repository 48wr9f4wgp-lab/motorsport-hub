// Motorsport Hub v8.9.5-hardening — Reliability Pass / event lifecycle guard
// Keeps v8.9.4 behavior and adds explicit season-ended behavior for WEC / SUPER GT / MotoGP.
(async()=>{
const norm=v=>String(v||'').trim().toUpperCase().replace(/[\s_-]+/g,'');
const selected=norm(globalThis.__MH_UNIVERSAL_PARAMETER||args.widgetParameter)||'F1';
const REF=globalThis.__MH_SOURCE_REF||'main';
const URL=`https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/${REF}/motorsport-reliability-v894.js`;
const fm=FileManager.local(),DOC=fm.documentsDirectory();
const cache=fm.joinPath(DOC,'motorsport-reliability-source-v895.js');
const valid=s=>typeof s==='string'&&s.includes('Reliability Pass')&&s.includes('Script.complete()');
let code='';
try{
 const r=new Request(`${URL}?v=895h&t=${Date.now()}-${Math.random()}`);r.timeoutInterval=15;
 r.headers={'Cache-Control':'no-cache, no-store, max-age=0, must-revalidate','Pragma':'no-cache','Expires':'0','User-Agent':'MotorsportHub/8.9.5-hardening'};
 code=await r.loadString();if(!valid(code))throw Error('invalid reliability source');fm.writeString(cache,code);
}catch(e){try{if(fm.fileExists(cache)){const c=fm.readString(cache);if(valid(c))code=c;else fm.remove(cache)}}catch(_){}}
if(!valid(code))throw Error('v8.9.5 reliability source unavailable');

function replaceRegexOnce(src,re,replacement,label){let hits=0;const out=String(src).replace(re,(...args)=>{hits++;return typeof replacement==='function'?replacement(...args):replacement});if(hits!==1)throw Error(`V895_PATCH_MISMATCH:${label}:${hits}`);return out}
function replaceExact(src,needle,replacement,expected,label){const p=String(src).split(needle),hits=p.length-1;if(hits!==expected)throw Error(`V895_PATCH_MISMATCH:${label}:${hits}/${expected}`);return p.join(replacement)}

const originalLoadString=Request.prototype.loadString;
Request.prototype.loadString=async function(){
 let s=await originalLoadString.call(this);
 if(typeof s!=='string')return s;

 if((selected==='WEC'||selected==='SUPERGT')&&s.includes('dedicated HQ module for WEC / SUPER GT')){
  const hold=selected==='WEC'?10:8;
  s=replaceRegexOnce(s,
   /function calendar\(d\)\{const now=Date\.now\(\);for\(const e of CAL\[K\]\)\{if\(Date\.parse\(e\[1\]\)>now-6\*3600000\)return\{\.\.\.d,race:e\[0\],date:e\[1\],circuit:e\[2\],timeTbd:!!e\[3\]\}\}return d\}/,
   `function calendar(d){const now=Date.now(),hold=${hold}*3600000;for(const e of CAL[K]){const start=Date.parse(e[1]),end=start+hold;if(now<end)return{...d,race:e[0],date:e[1],circuit:e[2],timeTbd:!!e[3],seasonEnded:false,lifecycle:now>=start?'ACTIVE':'UPCOMING'}}const last=CAL[K][CAL[K].length-1];return{...d,race:last[0],date:last[1],circuit:last[2],timeTbd:!!last[3],seasonEnded:true,lifecycle:'SEASON_ENDED'}}`,
   'hq-calendar'
  );
  s=replaceRegexOnce(s,/function countdown\(d\)\{[^\n]*\}/,
   `function countdown(d){if(d.lifecycle==='SEASON_ENDED'||d.seasonEnded)return{label:'SEASON END',live:false};const q=new Date(d.date)-Date.now(),hold=${hold}*3600000;if(q<=0&&q>-hold)return{label:'開催中',live:true};if(q<=0)return{label:'終了',live:false};const h=q/3600000;if(d.timeTbd)return{label:'あと'+Math.max(1,Math.ceil(h/24))+'日',live:false};if(h<24)return{label:'あと'+Math.ceil(h)+'時間',live:false};return{label:'あと'+Math.ceil(h/24)+'日',live:false}}`,
   'hq-countdown'
  );
  s=replaceExact(s,"T(top,'次戦',","T(top,d.lifecycle==='SEASON_ENDED'?'シーズン終了':'次戦',",2,'hq-header');
 }

 if(selected==='MOTOGP'&&s.includes('Professional Visual Pass / GitHub hosted / Scriptable')){
  s=replaceRegexOnce(s,
   /function calendar\(d\)\{const c=CAL\[K\];if\(!c\)return d;const now=Date\.now\(\);for\(const e of c\)\{const t=Date\.parse\(e\[1\]\);if\(t>now\)return\{\.\.\.d,race:e\[0\],date:e\[1\],circuit:e\[2\],timeTbd:!!e\[3\]\}\}return d\}/,
   `function calendar(d){const c=CAL[K];if(!c)return d;const now=Date.now(),hold=4*3600000;for(const e of c){const start=Date.parse(e[1]),end=start+hold;if(now<end)return{...d,race:e[0],date:e[1],circuit:e[2],timeTbd:!!e[3],seasonEnded:false,lifecycle:now>=start?'ACTIVE':'UPCOMING'}}const last=c[c.length-1];return{...d,race:last[0],date:last[1],circuit:last[2],timeTbd:!!last[3],seasonEnded:true,lifecycle:'SEASON_ENDED'}}`,
   'motogp-calendar'
  );
  s=replaceRegexOnce(s,/function countdown\(d\)\{[^\n]*\}/,
   `function countdown(d){if(d.lifecycle==='SEASON_ENDED'||d.seasonEnded)return{label:'SEASON END',live:false};const q=new Date(d.date)-Date.now(),hold=4*3600000;if(q<=0&&q>-hold)return{label:'開催中',live:true};if(q<=0)return{label:'終了',live:false};const h=q/3600000;if(d.timeTbd)return{label:'あと'+Math.max(1,Math.ceil(h/24))+'日',live:false};if(h<1)return{label:'あと'+Math.ceil(q/60000)+'分',live:false};if(h<24)return{label:'あと'+Math.ceil(h)+'時間',live:false};return{label:'あと'+Math.ceil(h/24)+'日',live:false}}`,
   'motogp-countdown'
  );
  s=replaceExact(s,"T(top,'次戦',","T(top,d.lifecycle==='SEASON_ENDED'?'シーズン終了':'次戦',",2,'motogp-header');
 }
 return s;
};
try{await eval(code)}finally{Request.prototype.loadString=originalLoadString}
})();