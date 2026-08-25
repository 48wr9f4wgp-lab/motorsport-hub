// Motorsport Hub v8.9.2-hardening — metadata + final lifecycle hook
// Keeps the SUPER GT metadata hotfix and injects fail-closed season lifecycle handling after v8.9.0 finishes leaf-code patching.
(async()=>{
const REF=globalThis.__MH_SOURCE_REF||'main';
const URL=`https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/${REF}/motorsport-reliability-v890.js`;
const fm=FileManager.local(),DOC=fm.documentsDirectory();
const cache=fm.joinPath(DOC,'motorsport-reliability-source-v893.js');
const valid=s=>typeof s==='string'&&s.includes('Reliability Pass')&&s.includes('Script.complete()');
let code='';
try{
 const r=new Request(`${URL}?v=892h&t=${Date.now()}-${Math.random()}`);r.timeoutInterval=15;
 r.headers={'Cache-Control':'no-cache, no-store, max-age=0, must-revalidate','Pragma':'no-cache','Expires':'0','User-Agent':'MotorsportHub/8.9.2-hardening'};
 code=await r.loadString();if(!valid(code))throw Error('invalid reliability source');fm.writeString(cache,code);
}catch(e){try{if(fm.fileExists(cache)){const c=fm.readString(cache);if(valid(c))code=c;else fm.remove(cache)}}catch(_){}}
if(!valid(code))throw Error('v8.9.2 reliability source unavailable');

// Preserve current SUPER GT metadata recovery without carrying the historical erroneous WEC-name rewrite.
code=code.replace(
 /const known=no==='36'\?\['TOYOTA','GR Supra',"au TOM'S"\]:no==='16'\?\['HONDA','PRELUDE-GT','ARTA'\]:no==='14'\?\['TOYOTA','GR Supra','ROOKIE'\]:\['',no\?'No\.'\+no:'',''\];const parts=String\(c\[2\]\|\|''\)\.trim\(\)\.split\(\/\\s\+\/\),name=parts\.length>=4\?parts\.slice\(0,2\)\.join\(' '\)\+' \/ '\+parts\.slice\(2\)\.join\(' '\):parts\.join\(' '\);if\(!name\)continue;/,
 `const parts=String(c[2]||'').trim().split(/\\s+/),name=parts.length>=4?parts.slice(0,2).join(' ')+' / '+parts.slice(2).join(' '):parts.join(' ');if(!name)continue;const nkey=name.replace(/[\\s・/]/g,'');const known=(no==='36'||/坪井|山下/.test(name))?['TOYOTA','GR Supra',"au TOM'S"]:(no==='16'||/野尻|佐藤/.test(name))?['HONDA','PRELUDE-GT','ARTA']:(no==='14'||/福住|大嶋/.test(name))?['TOYOTA','GR Supra','ROOKIE']:['',no?'No.'+no:'GT500',''];`
);
code=code.replace(
 "function sub(r){if(K==='wec')return[r.machine||'',r.team||''].filter(Boolean).join('  ｜  ');return[[r.maker||'',r.machine||''].filter(Boolean).join(' · '),r.team||''].filter(Boolean).join('  ｜  ')}",
 "function sub(r){if(K==='wec')return[r.machine||'',r.team||''].filter(Boolean).join('  ｜  ');const s=[[r.maker||'',r.machine||''].filter(Boolean).join(' · '),r.team||''].filter(Boolean).join('  ｜  ');return s||'GT500'}"
);

function replaceRegexOnce(src,re,replacement,label){let hits=0;const out=String(src).replace(re,(...args)=>{hits++;return typeof replacement==='function'?replacement(...args):replacement});if(hits!==1)throw Error(`FINAL_LIFECYCLE_PATCH_MISMATCH:${label}:${hits}`);return out}
function replaceExact(src,needle,replacement,expected,label){const p=String(src).split(needle),hits=p.length-1;if(hits!==expected)throw Error(`FINAL_LIFECYCLE_PATCH_MISMATCH:${label}:${hits}/${expected}`);return p.join(replacement)}

globalThis.__MH_FINAL_LIFECYCLE_PATCH=(sel,leaf)=>{
 let out=String(leaf);
 if(sel==='F1'){
  out=replaceRegexOnce(out,/async function updateF1\(d\)\{[\s\S]*?\nasync function updateWEC/,
`async function updateF1(d){
 let raceOk=false,standingsOk=false;
 try{
  const j=await json('https://api.jolpi.ca/ergast/f1/2026.json?limit=100'),now=Date.now();
  const races=(j?.MRData?.RaceTable?.Races||[]).map(x=>({...x,t:Date.parse(String(x.date)+'T'+String(x.time||'12:00:00Z'))})).filter(x=>Number.isFinite(x.t)).sort((a,b)=>a.t-b.t);
  const r=races.find(x=>x.t>now-14400000);
  if(r){d.race=r.raceName;d.date=String(r.date)+'T'+String(r.time||'12:00:00Z');d.circuit=r.Circuit?.circuitName||d.circuit;d.seasonEnded=false;d.lifecycle=now>=r.t?'ACTIVE':'UPCOMING';raceOk=true}
  else if(races.length){const last=races[races.length-1];d.race=last.raceName;d.date=String(last.date)+'T'+String(last.time||'12:00:00Z');d.circuit=last.Circuit?.circuitName||d.circuit;d.seasonEnded=true;d.lifecycle='SEASON_ENDED';raceOk=true}
 }catch(_){}
 try{
  const j=await json('https://api.jolpi.ca/ergast/f1/2026/driverstandings.json'),a=j?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings||[];
  if(a.length>=3){d.ranking=a.slice(0,5).map((x,i)=>({pos:+x.position||i+1,name:String((x.Driver?.givenName||'')+' '+(x.Driver?.familyName||'')).trim(),points:String(x.points||0)+' pts',maker:String(x.Constructors?.[0]?.name||'').toUpperCase(),team:x.Constructors?.[0]?.name||'',machine:''}));standingsOk=true}
 }catch(_){}
 if(!raceOk||!standingsOk)throw Error('F1_PARTIAL');
 return d
}
async function updateWEC`,'f1-update');
  out=replaceRegexOnce(out,/function countdown\(d\)\{[^\n]*\}/,()=>`function countdown(d){if(d.lifecycle==='SEASON_ENDED'||d.seasonEnded)return{label:'SEASON END',live:false};const q=new Date(d.date)-Date.now(),hold=4*3600000;if(q<=0&&q>-hold)return{label:'開催中',live:true};if(q<=0)return{label:'終了',live:false};const h=q/3600000;if(d.timeTbd)return{label:'あと'+Math.max(1,Math.ceil(h/24))+'日',live:false};if(h<1)return{label:'あと'+Math.ceil(q/60000)+'分',live:false};if(h<24)return{label:'あと'+Math.ceil(h)+'時間',live:false};return{label:'あと'+Math.ceil(h/24)+'日',live:false}}`,'f1-countdown');
  out=replaceExact(out,"T(top,'次戦',","T(top,d.lifecycle==='SEASON_ENDED'?'シーズン終了':'次戦',",2,'f1-header');
 }
 if(sel==='WRC'){
  out=replaceRegexOnce(out,/function calendar\(d\)\{[^\n]*\}/,()=>`function calendar(d){const c=CAL[K];if(!c)return d;const now=Date.now(),hold=4*86400000;for(const e of c){const start=Date.parse(e[1]),end=start+hold;if(now<end)return{...d,race:e[0],date:e[1],circuit:e[2],timeTbd:!!e[3],seasonEnded:false,lifecycle:now>=start?'ACTIVE':'UPCOMING'}}const last=c[c.length-1];return{...d,race:last[0],date:last[1],circuit:last[2],timeTbd:!!last[3],seasonEnded:true,lifecycle:'SEASON_ENDED'}}`,'wrc-calendar');
  out=replaceRegexOnce(out,/function countdown\(d\)\{[^\n]*\}/,()=>`function countdown(d){if(d.lifecycle==='SEASON_ENDED'||d.seasonEnded)return{label:'SEASON END',live:false};const q=new Date(d.date)-Date.now(),hold=4*86400000;if(q<=0&&q>-hold)return{label:'開催中',live:true};if(q<=0)return{label:'終了',live:false};const h=q/3600000;if(d.timeTbd)return{label:'あと'+Math.max(1,Math.ceil(h/24))+'日',live:false};if(h<1)return{label:'あと'+Math.ceil(q/60000)+'分',live:false};if(h<24)return{label:'あと'+Math.ceil(h)+'時間',live:false};return{label:'あと'+Math.ceil(h/24)+'日',live:false}}`,'wrc-countdown');
  out=replaceExact(out,"T(top,'次戦',","T(top,d.lifecycle==='SEASON_ENDED'?'シーズン終了':'次戦',",2,'wrc-header');
 }
 if(sel==='FDJ'){
  out=replaceRegexOnce(out,/function nextEvent\(d\)\{[^\n]*\}/,()=>`function nextEvent(d){const now=Date.now(),hold=40*3600000;for(const e of CAL){const start=Date.parse(e[1]),end=start+hold;if(now<end)return{...d,race:e[0],date:e[1],circuit:e[2],timeTbd:!!e[3],seasonEnded:false,lifecycle:now>=start?'ACTIVE':'UPCOMING'}}const last=CAL[CAL.length-1];return{...d,race:last[0],date:last[1],circuit:last[2],timeTbd:!!last[3],seasonEnded:true,lifecycle:'SEASON_ENDED'}}`,'fdj-next');
  out=replaceRegexOnce(out,/function countdown\(d\)\{[^\n]*\}/,()=>`function countdown(d){if(d.lifecycle==='SEASON_ENDED'||d.seasonEnded)return{label:'SEASON END',live:false};const q=new Date(d.date)-Date.now(),hold=40*3600000;if(q<=0&&q>-hold)return{label:'開催中',live:true};if(q<=0)return{label:'終了',live:false};const h=q/3600000;if(d.timeTbd)return{label:'あと'+Math.max(1,Math.ceil(h/24))+'日',live:false};if(h<24)return{label:'あと'+Math.ceil(h)+'時間',live:false};return{label:'あと'+Math.ceil(h/24)+'日',live:false}}`,'fdj-countdown');
  out=replaceExact(out,"T(top,'次戦',","T(top,d.lifecycle==='SEASON_ENDED'?'シーズン終了':'次戦',",2,'fdj-header');
 }
 if((sel==='F1'||sel==='WRC'||sel==='FDJ')&&(!out.includes("lifecycle:'SEASON_ENDED'")||!out.includes("?'シーズン終了':'次戦'")))throw Error('FINAL_LIFECYCLE_POSTCONDITION');
 return out
};

const needle="\n return code\n}\n\nlet outer='';";
if(!code.includes(needle))throw Error('v8.9.0 final lifecycle injection point missing');
code=code.replace(needle,"\n code=globalThis.__MH_FINAL_LIFECYCLE_PATCH(sel,code);\n return code\n}\n\nlet outer='';");
try{await eval(code)}finally{try{delete globalThis.__MH_FINAL_LIFECYCLE_PATCH}catch(_){}}
})();