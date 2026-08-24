// Motorsport Hub v8.9.0 — Reliability Pass
// Keeps v8.7.1 visuals frozen while hardening data freshness, season-tail calendars and parser fallbacks.
(async()=>{
const norm=v=>String(v||'').trim().toUpperCase().replace(/[\s_-]+/g,'');
const selected=norm(globalThis.__MH_UNIVERSAL_PARAMETER||args.widgetParameter)||'F1';
const URL='https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/main/motorsport-universal-v871.js';
const fm=FileManager.local(),DOC=fm.documentsDirectory();
const cache=fm.joinPath(DOC,'motorsport-reliability-source-v890.js');
const valid=s=>typeof s==='string'&&s.includes('Final Visual Polish')&&s.includes('Script.complete()');

function patch(sel,code){
 const rx=(re,value)=>{code=code.replace(re,()=>value)};

 // F1: schedule and standings are one atomic update. Never mark a partial refresh as fresh.
 if(sel==='F1'){
  rx(/async function updateF1\(d\)\{[\s\S]*?\nasync function updateWEC/,
`async function updateF1(d){
 let raceOk=false,standingsOk=false;
 try{
  const j=await json('https://api.jolpi.ca/ergast/f1/2026.json?limit=100'),now=Date.now();
  const r=(j?.MRData?.RaceTable?.Races||[]).map(x=>({...x,t:Date.parse(String(x.date)+'T'+String(x.time||'12:00:00Z'))})).find(x=>x.t>now-14400000);
  if(r){d.race=r.raceName;d.date=String(r.date)+'T'+String(r.time||'12:00:00Z');d.circuit=r.Circuit?.circuitName||d.circuit;raceOk=true}
 }catch(_){}
 try{
  const j=await json('https://api.jolpi.ca/ergast/f1/2026/driverstandings.json'),a=j?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings||[];
  if(a.length>=3){d.ranking=a.slice(0,5).map((x,i)=>({pos:+x.position||i+1,name:String((x.Driver?.givenName||'')+' '+(x.Driver?.familyName||'')).trim(),points:String(x.points||0)+' pts',maker:String(x.Constructors?.[0]?.name||'').toUpperCase(),team:x.Constructors?.[0]?.name||'',machine:''}));standingsOk=true}
 }catch(_){}
 if(!raceOk||!standingsOk)throw Error('F1_PARTIAL');
 return d
}
async function updateWEC`);
 }

 // WRC: use FIA's static official standings page and complete the remaining calendar.
 if(sel==='WRC'){
  rx(/wrc:\[[\s\S]*?\],\n  motogp:/,
`wrc:[
 ['WRC ueno Rally del Paraguay','2026-08-27T09:00:00-03:00','Paraguay',true],
 ['WRC Rally Chile Bio Bío','2026-09-10T09:00:00-03:00','Chile',true],
 ['WRC Rally Italia Sardegna','2026-10-01T09:00:00+02:00','Sardegna',true],
 ['WRC Rally Saudi Arabia','2026-11-12T09:00:00+03:00','Saudi Arabia',true]
 ],
  motogp:`);
  rx(/async function updateWRC\(d\)\{[\s\S]*?\nasync function updateMoto/,
`async function updateWRC(d){
 const h=await txt('https://www.fia.com/events/world-rally-championship/season-2026/standings');
 const lo=h.indexOf('2026 FIA World Rally Championship for Drivers'),hi=h.indexOf('2026 FIA WRC Masters Cup');
 const seg=lo>=0?(hi>lo?h.slice(lo,hi):h.slice(lo)):h,a=[];
 for(const c of rows(seg)){
  const p=num(c[0]),pts=num(c[c.length-1]);if(!(p>=1&&p<=60)||!isFinite(pts))continue;
  let raw=String(c[1]||'').replace(/\b(?:GBR|FIN|JPN|SWE|FRA|BEL|EST|ESP|KOR|LUX|GRC|IRL|AUT|POL|CZE|ITA|PRY|CHL|SAU)\b/gi,' ').replace(/\s+/g,' ').trim();
  const known=Object.keys(META.wrc).find(n=>raw.toLowerCase().includes(n.toLowerCase()));
  const name=known||raw.replace(/\bImage\b.*$/i,'').trim();if(!name)continue;
  const m=META.wrc[known]||['','',''];a.push({pos:p,name,points:String(pts)+' pts',maker:m[0]||'',machine:m[1]||'',team:m[2]||''});
 }
 a.sort((x,y)=>x.pos-y.pos);const seen=new Set(),u=[];for(const r of a){if(seen.has(r.pos))continue;seen.add(r.pos);u.push(r);if(u.length>=5)break}
 if(u.length<3)throw Error('WRC');d.ranking=u;return calendar(d)
}
async function updateMoto`);
 }

 // MotoGP: fill the whole remaining 2026 season. Unknown start times stay explicitly TBD.
 if(sel==='MOTOGP'){
  rx(/motogp:\[[\s\S]*?\],\n  supergt:/,
`motogp:[
 ['Grand Prix of Aragon','2026-08-30T14:00:00+02:00','MotorLand Aragón'],
 ['San Marino Grand Prix','2026-09-13T14:00:00+02:00','Misano'],
 ['Austrian Grand Prix','2026-09-20T12:00:00+02:00','Red Bull Ring',true],
 ['Japanese Grand Prix','2026-10-04T12:00:00+09:00','Mobility Resort Motegi',true],
 ['Indonesian Grand Prix','2026-10-11T12:00:00+08:00','Mandalika',true],
 ['Australian Grand Prix','2026-10-25T12:00:00+11:00','Phillip Island',true],
 ['Malaysian Grand Prix','2026-11-01T12:00:00+08:00','Sepang',true],
 ['Qatar Grand Prix','2026-11-08T12:00:00+03:00','Lusail',true],
 ['Portuguese Grand Prix','2026-11-22T12:00:00+00:00','Portimão',true],
 ['Valencia Grand Prix','2026-11-29T12:00:00+01:00','Valencia',true]
 ],
  supergt:`);
 }

 // Shared translations for the newly completed season tails.
 if(sel==='WRC'||sel==='MOTOGP'){
  rx(/function rn\(s\)\{[^\n]*\}/,
`function rn(s){s=String(s||'');for(const [a,b] of [[/Italian Grand Prix/i,'イタリアGP'],[/Lone Star Le Mans/i,'ローンスター・ル・マン'],[/Rally del Paraguay/i,'ラリー・パラグアイ'],[/Rally Chile/i,'ラリー・チリ'],[/Rally Italia Sardegna/i,'ラリー・サルディニア'],[/Rally Saudi Arabia/i,'ラリー・サウジアラビア'],[/Grand Prix of Aragon/i,'アラゴンGP'],[/6 Hours of Fuji/i,'富士6時間'],[/San Marino Grand Prix/i,'サンマリノGP'],[/Austrian Grand Prix/i,'オーストリアGP'],[/Japanese Grand Prix/i,'日本GP'],[/Indonesian Grand Prix/i,'インドネシアGP'],[/Australian Grand Prix/i,'オーストラリアGP'],[/Malaysian Grand Prix/i,'マレーシアGP'],[/Qatar Grand Prix/i,'カタールGP'],[/Portuguese Grand Prix/i,'ポルトガルGP'],[/Valencia Grand Prix/i,'バレンシアGP']])if(a.test(s))return b;return s.replace(/Grand Prix/ig,'GP')}`);
 }

 // WEC: current official 2026 tail is COTA → Fuji → Barcelona → Monza; unknown manufacturers must not break standings.
 if(sel==='WEC'){
  rx(/wec:\[[\s\S]*?\],\n supergt:/,
`wec:[
  ['Lone Star Le Mans','2026-09-06T13:00:00-05:00','Circuit of the Americas'],
  ['6 Hours of Fuji','2026-09-27T12:00:00+09:00','Fuji Speedway'],
  ['6 Hours of Barcelona','2026-10-18T12:00:00+02:00','Circuit de Barcelona-Catalunya',true],
  ['6 Hours of Monza','2026-11-08T12:00:00+01:00','Autodromo Nazionale Monza',true]
 ],
 supergt:`);
  rx(/async function updateWEC\(d\)\{[\s\S]*?\nasync function updateGT/,
`async function updateWEC(d){const a=[];for(const c of rows(await txt('https://www.fiawec.com/fr/page/classement-constructeurs'))){const p=num(c[0]),m=String(c[1]||'').toUpperCase().trim(),meta=META[m]||['',''],pts=num(c[c.length-1]);if(p>=1&&p<=30&&m&&isFinite(pts))a.push({pos:p,name:m,points:String(pts)+' pts',maker:m,machine:meta[0]||'',team:meta[1]||''})}a.sort((x,y)=>x.pos-y.pos);const seen=new Set(),u=[];for(const r of a){if(seen.has(r.pos))continue;seen.add(r.pos);u.push(r);if(u.length>=5)break}if(u.length<3)throw Error('WEC');d.ranking=u;return calendar(d)}
async function updateGT`);
  rx(/function rn\(s\)\{[^\n]*\}/,
`function rn(s){if(/Lone Star Le Mans/i.test(s))return'ローンスター・ル・マン';if(/6 Hours of Fuji/i.test(s))return'富士6時間';if(/6 Hours of Barcelona/i.test(s))return'バルセロナ6時間';if(/6 Hours of Monza/i.test(s))return'モンツァ6時間';return s}`);
  rx(/function cn\(s\)\{[^\n]*\}/,
`function cn(s){if(/Circuit of the Americas/i.test(s))return'COTA';if(/Fuji Speedway/i.test(s))return'富士スピードウェイ';if(/Barcelona/i.test(s))return'バルセロナ';if(/Monza/i.test(s))return'モンツァ';return s||''}`);
 }

 // SUPER GT: complete the tail and never discard a valid GT500 row just because its car number is new to our metadata map.
 if(sel==='SUPERGT'){
  rx(/supergt:\[[\s\S]*?\]\n\};/,
`supergt:[
  ['第6戦 SUGO','2026-09-20T12:00:00+09:00','スポーツランドSUGO',true],
  ['第7戦 AUTOPOLIS','2026-10-18T12:00:00+09:00','オートポリス',true],
  ['第8戦 MOTEGI','2026-11-08T12:00:00+09:00','モビリティリゾートもてぎ',true]
 ]
};`);
  rx(/async function updateGT\(d\)\{[\s\S]*?\nasync function load/,
`async function updateGT(d){const h=await txt('https://supergt.net/'),u=h.toUpperCase(),i=u.indexOf('GT 500'),j=u.indexOf('GT 300',i+1),a=[];for(const c of rows(i>=0&&j>i?h.slice(i,j):h)){const p=num(c[0]),no=String(c[1]||'').match(/\d+/)?.[0],pts=num(c[3]??c[c.length-2]);if(!(p>=1&&p<=30)||!isFinite(pts))continue;const known=no==='36'?['TOYOTA','GR Supra',"au TOM'S"]:no==='16'?['HONDA','PRELUDE-GT','ARTA']:no==='14'?['TOYOTA','GR Supra','ROOKIE']:['',no?'No.'+no:'',''];const parts=String(c[2]||'').trim().split(/\s+/),name=parts.length>=4?parts.slice(0,2).join(' ')+' / '+parts.slice(2).join(' '):parts.join(' ');if(!name)continue;a.push({pos:p,name,points:String(pts)+' pts',maker:known[0],machine:known[1],team:known[2]})}a.sort((x,y)=>x.pos-y.pos);const seen=new Set(),out=[];for(const r of a){if(seen.has(r.pos))continue;seen.add(r.pos);out.push(r);if(out.length>=5)break}if(out.length<3)throw Error('SUPERGT');d.ranking=out;return calendar(d)}
async function load`);
  rx(/function sub\(r\)\{[^\n]*\}/,
`function sub(r){if(K==='wec')return[r.machine||'',r.team||''].filter(Boolean).join('  ｜  ');return[[r.maker||'',r.machine||''].filter(Boolean).join(' · '),r.team||''].filter(Boolean).join('  ｜  ')}`);
 }

 return code
}

let outer='';
try{
 const r=new Request(`${URL}?v=890&t=${Date.now()}-${Math.random()}`);r.timeoutInterval=15;
 r.headers={'Cache-Control':'no-cache, no-store, max-age=0, must-revalidate','Pragma':'no-cache','Expires':'0','User-Agent':'MotorsportHubReliability/8.9'};
 outer=await r.loadString();if(!valid(outer))throw Error('invalid visual module');fm.writeString(cache,outer)
}catch(e){
 try{if(fm.fileExists(cache)){const c=fm.readString(cache);if(valid(c))outer=c;else fm.remove(cache)}}catch(_){}
}
if(!valid(outer))throw Error('visual module unavailable');
const needle="try{await eval(code)}catch(e){await fail('v8.7.1可読性処理に失敗しました。数分後に再試行します。')}";
if(!outer.includes(needle))throw Error('reliability injection point missing');
globalThis.__MH_RELIABILITY_PATCH=patch;
outer=outer.replace(needle,"code=globalThis.__MH_RELIABILITY_PATCH(selected,code);\n"+needle);
try{await eval(outer)}finally{try{delete globalThis.__MH_RELIABILITY_PATCH}catch(_){}}
})();
