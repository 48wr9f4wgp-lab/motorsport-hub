// Motorsport Hub v8.9.0 — D1GP reliability wrapper
// Preserves the accepted v8.8.2 action hero and holds a two-day D1GP event through the full weekend.
(async()=>{
const URL='https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/main/d1gp-widget.js';
const fm=FileManager.local(),DOC=fm.documentsDirectory();
const cache=fm.joinPath(DOC,'motorsport-d1gp-source-v890.js');
const OLD="https://commons.wikimedia.org/wiki/Special:Redirect/file/Nissan%20Silvia%20S14%20Drift.jpg?width=2048";
const OLD2="https://commons.wikimedia.org/wiki/Special:Redirect/file/Nissan%20Silvia%20S14%20Drift.jpg?width=1280";
const ACTION="https://commons.wikimedia.org/wiki/Special:Redirect/file/King%20of%20Europe%20Round%203%20Lydden%20Hill%202014%20%2814356011899%29.jpg?width=2048";
const ACTION2="https://commons.wikimedia.org/wiki/Special:Redirect/file/King%20of%20Europe%20Round%203%20Lydden%20Hill%202014%20%2814356011899%29.jpg?width=1280";
const valid=s=>typeof s==='string'&&s.includes('D1GP module')&&s.includes('Script.complete()');
let code='';
try{
 const r=new Request(`${URL}?v=890&t=${Date.now()}-${Math.random()}`);r.timeoutInterval=15;
 r.headers={'Cache-Control':'no-cache, no-store, max-age=0, must-revalidate','Pragma':'no-cache','Expires':'0','User-Agent':'MotorsportHubD1Reliability/8.9'};
 code=await r.loadString();if(!valid(code))throw Error('invalid D1GP module');fm.writeString(cache,code)
}catch(e){
 try{if(fm.fileExists(cache)){const c=fm.readString(cache);if(valid(c))code=c;else fm.remove(cache)}}catch(_){}
}
if(!valid(code))throw Error('D1GP source unavailable');
code=code.replace(OLD,ACTION).replace(OLD2,ACTION2);
code=code.replace(/motorsport-hero-v881-/g,'motorsport-hero-v890-');
code=code.replace(/&v=881/g,'&v=890');
code=code.replace(/function nextEvent\(d\)\{[^\n]*\}/,()=>`function nextEvent(d){const now=Date.now();for(const e of CAL){if(Date.parse(e[1])+40*3600000>now)return{...d,race:e[0],date:e[1],circuit:e[2],timeTbd:!!e[3]}}return d}`);
code=code.replace(/function countdown\(d\)\{[^\n]*\}/,()=>`function countdown(d){const q=new Date(d.date)-Date.now();if(q<=0&&q>-40*3600000)return{label:'開催中',live:true};if(q<=0)return{label:'終了',live:false};const h=q/3600000;if(d.timeTbd)return{label:'あと'+Math.max(1,Math.ceil(h/24))+'日',live:false};if(h<24)return{label:'あと'+Math.ceil(h)+'時間',live:false};return{label:'あと'+Math.ceil(h/24)+'日',live:false}}`);
await eval(code);
})();
