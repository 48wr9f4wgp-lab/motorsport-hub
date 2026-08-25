// Motorsport Hub v8.9.1-hardening — D1GP reliability wrapper
// Preserves the accepted action hero and adds fail-closed season lifecycle handling.
(async()=>{
const REF=globalThis.__MH_SOURCE_REF||'main';
const URL=`https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/${REF}/d1gp-widget.js`;
const fm=FileManager.local(),DOC=fm.documentsDirectory();
const cache=fm.joinPath(DOC,'motorsport-d1gp-source-v890.js');
const OLD="https://commons.wikimedia.org/wiki/Special:Redirect/file/Nissan%20Silvia%20S14%20Drift.jpg?width=2048";
const OLD2="https://commons.wikimedia.org/wiki/Special:Redirect/file/Nissan%20Silvia%20S14%20Drift.jpg?width=1280";
const ACTION="https://commons.wikimedia.org/wiki/Special:Redirect/file/King%20of%20Europe%20Round%203%20Lydden%20Hill%202014%20%2814356011899%29.jpg?width=2048";
const ACTION2="https://commons.wikimedia.org/wiki/Special:Redirect/file/King%20of%20Europe%20Round%203%20Lydden%20Hill%202014%20%2814356011899%29.jpg?width=1280";
const valid=s=>typeof s==='string'&&s.includes('D1GP module')&&s.includes('Script.complete()');
let code='';
try{
 const r=new Request(`${URL}?v=891&t=${Date.now()}-${Math.random()}`);r.timeoutInterval=15;
 r.headers={'Cache-Control':'no-cache, no-store, max-age=0, must-revalidate','Pragma':'no-cache','Expires':'0','User-Agent':'MotorsportHubD1Reliability/8.9.1-hardening'};
 code=await r.loadString();if(!valid(code))throw Error('invalid D1GP module');fm.writeString(cache,code)
}catch(e){
 try{if(fm.fileExists(cache)){const c=fm.readString(cache);if(valid(c))code=c;else fm.remove(cache)}}catch(_){}
}
if(!valid(code))throw Error('D1GP source unavailable');

function replaceRegexOnce(src,re,replacement,label){
 let hits=0;const out=String(src).replace(re,(...args)=>{hits++;return typeof replacement==='function'?replacement(...args):replacement});
 if(hits!==1)throw Error(`D1_HARDENING_PATCH_MISMATCH:${label}:${hits}`);return out;
}
function replaceExact(src,needle,replacement,expected,label){const p=String(src).split(needle),hits=p.length-1;if(hits!==expected)throw Error(`D1_HARDENING_PATCH_MISMATCH:${label}:${hits}/${expected}`);return p.join(replacement)}

code=replaceExact(code,OLD,ACTION,1,'hero2048');
code=replaceExact(code,OLD2,ACTION2,1,'hero1280');
code=code.replace(/motorsport-hero-v881-/g,'motorsport-hero-v891-').replace(/&v=881/g,'&v=891');
code=replaceRegexOnce(code,/function nextEvent\(d\)\{[^\n]*\}/,()=>`function nextEvent(d){const now=Date.now(),hold=40*3600000;for(const e of CAL){const s=Date.parse(e[1]),end=s+hold;if(now<end)return{...d,race:e[0],date:e[1],circuit:e[2],timeTbd:!!e[3],seasonEnded:false,lifecycle:now>=s?'ACTIVE':'UPCOMING'}}const last=CAL[CAL.length-1];return{...d,race:last[0],date:last[1],circuit:last[2],timeTbd:!!last[3],seasonEnded:true,lifecycle:'SEASON_ENDED'}}`,'nextEvent');
code=replaceRegexOnce(code,/function countdown\(d\)\{[^\n]*\}/,()=>`function countdown(d){if(d.lifecycle==='SEASON_ENDED'||d.seasonEnded)return{label:'SEASON END',live:false};const q=new Date(d.date)-Date.now(),hold=40*3600000;if(q<=0&&q>-hold)return{label:'開催中',live:true};if(q<=0)return{label:'終了',live:false};const h=q/3600000;if(d.timeTbd)return{label:'あと'+Math.max(1,Math.ceil(h/24))+'日',live:false};if(h<24)return{label:'あと'+Math.ceil(h)+'時間',live:false};return{label:'あと'+Math.ceil(h/24)+'日',live:false}}`,'countdown');
code=replaceExact(code,"T(top,'次戦',","T(top,d.lifecycle==='SEASON_ENDED'?'シーズン終了':'次戦',",2,'header');
if(!code.includes("lifecycle:'SEASON_ENDED'")||!code.includes("?'シーズン終了':'次戦'"))throw Error('D1_HARDENING_POSTCONDITION');
await eval(code);
})();