// Motorsport Hub v8.9.2 — SUPER GT metadata hotfix
// Wraps v8.9.0 Reliability Pass and restores GT500 machine/team sublines even when the source table omits/reshuffles car-number cells.
(async()=>{
const URL='https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/main/motorsport-reliability-v890.js';
const fm=FileManager.local(),DOC=fm.documentsDirectory();
const cache=fm.joinPath(DOC,'motorsport-reliability-source-v892.js');
const valid=s=>typeof s==='string'&&s.includes('Reliability Pass')&&s.includes('Script.complete()');
let code='';
try{
 const r=new Request(`${URL}?v=892&t=${Date.now()}-${Math.random()}`);r.timeoutInterval=15;
 r.headers={'Cache-Control':'no-cache, no-store, max-age=0, must-revalidate','Pragma':'no-cache','Expires':'0','User-Agent':'MotorsportHub/8.9.2'};
 code=await r.loadString();if(!valid(code))throw Error('invalid reliability source');fm.writeString(cache,code);
}catch(e){try{if(fm.fileExists(cache)){const c=fm.readString(cache);if(valid(c))code=c;else fm.remove(cache)}}catch(_){}}
if(!valid(code))throw Error('v8.9.2 reliability source unavailable');

// v8.9.0 parsed the GT500 ranking correctly but could lose car/team metadata when the official table layout
// did not expose the expected car-number cell. Resolve known current entries by number OR driver names,
// and keep a useful GT500 fallback for unknown future leaders.
code=code.replace(
 /const known=no==='36'\?\['TOYOTA','GR Supra',"au TOM'S"\]:no==='16'\?\['HONDA','PRELUDE-GT','ARTA'\]:no==='14'\?\['TOYOTA','GR Supra','ROOKIE'\]:\['',no\?'No\.'\+no:'',''\];const parts=String\(c\[2\]\|\|''\)\.trim\(\)\.split\(\/\\s\+\/\),name=parts\.length>=4\?parts\.slice\(0,2\)\.join\(' '\)\+' \/ '\+parts\.slice\(2\)\.join\(' '\):parts\.join\(' '\);if\(!name\)continue;/,
 `const parts=String(c[2]||'').trim().split(/\\s+/),name=parts.length>=4?parts.slice(0,2).join(' ')+' / '+parts.slice(2).join(' '):parts.join(' ');if(!name)continue;const nkey=name.replace(/[\\s・/]/g,'');const known=(no==='36'||/坪井|山下/.test(name))?['TOYOTA','GR Supra',"au TOM'S"]:(no==='16'||/野尻|佐藤/.test(name))?['HONDA','PRELUDE-GT','ARTA']:(no==='14'||/福住|大嶋/.test(name))?['TOYOTA','GR Supra','ROOKIE']:['',no?'No.'+no:'GT500',''];`
);

// Never render a completely empty SUPER GT secondary line.
code=code.replace(
 "function sub(r){if(K==='wec')return[r.machine||'',r.team||''].filter(Boolean).join('  ｜  ');return[[r.maker||'',r.machine||''].filter(Boolean).join(' · '),r.team||''].filter(Boolean).join('  ｜  ')}",
 "function sub(r){if(K==='wec')return[r.machine||'',r.team||''].filter(Boolean).join('  ｜  ');const s=[[r.maker||'',r.machine||''].filter(Boolean).join(' · '),r.team||''].filter(Boolean).join('  ｜  ');return s||'GT500'}"
);

await eval(code);
})();