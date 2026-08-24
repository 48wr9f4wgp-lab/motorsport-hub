// Motorsport Hub v8.6.2 — HQ readability wrapper for WEC / SUPER GT
// Strengthens the PTS column while preserving the v8.6 HQ layout and race-action heroes.
(async()=>{
const norm=v=>String(v||'').trim().toUpperCase().replace(/[\s_-]+/g,'');
const mode=norm(globalThis.__MH_MODULE_PARAMETER||args.widgetParameter);
const isSGT=mode==='SUPERGT';
const URL='https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/main/motorsport-hq-core.js';
const fm=FileManager.local(),DOC=fm.documentsDirectory();
const cache=fm.joinPath(DOC,'motorsport-hq-wrapper-v862.js');
const OLD_SGT="https://commons.wikimedia.org/wiki/Special:Redirect/file/MOTUL%20AUTECH%20Z%202024%20rd.2%20FUJI.jpg?width=2048";
const AU_TOMS="https://commons.wikimedia.org/wiki/Special:Redirect/file/No.36%20au%20TOM%27S%20GR%20Supra%20at%202022%20Fujimaki%20Group%20Suzuka%20GT%20450km%20%2813%29.jpg?width=2048";
const valid=s=>typeof s==='string'&&s.includes('dedicated HQ module for WEC / SUPER GT')&&s.includes('Script.complete()');
let code='';
try{
  const r=new Request(`${URL}?v=862&t=${Date.now()}-${Math.random()}`);r.timeoutInterval=12;
  r.headers={'Cache-Control':'no-cache, no-store, max-age=0','Pragma':'no-cache'};
  code=await r.loadString();if(!valid(code))throw Error('invalid HQ core');fm.writeString(cache,code);
}catch(e){
  try{if(fm.fileExists(cache)){const c=fm.readString(cache);if(valid(c))code=c;else fm.remove(cache)}}catch(_){}
}
if(!valid(code))throw Error('HQ core unavailable');

// Keep the SUPER GT hero aligned with the displayed championship leader.
if(isSGT)code=code.replace(OLD_SGT,AU_TOMS);
// Force a fresh HQ background render under the v8.6.2 wrapper.
code=code.replace(/motorsport-hero-v860-/g,'motorsport-hero-v862-');
code=code.replace(/&v=860/g,'&v=862');

// PTS header: slightly wider and brighter.
code=code.replace(
  "const ph=hh.addStack();ph.size=new Size(38,0);const pt=T(ph,'PTS',7.1,col(C.muted,.82),'semibold');pt.rightAlignText();",
  "const ph=hh.addStack();ph.size=new Size(42,0);const pt=T(ph,'PTS',7.4,col(C.text,.92),'bold');pt.rightAlignText();"
);
// PTS values: stronger dark pill + full white, heavier numerals.
code=code.replace(
  "const pts=row.addStack();pts.size=new Size(38,0);pts.backgroundColor=col('#000000',.12);pts.cornerRadius=5;pts.setPadding(0,2,0,2);const p=T(pts,String(r.points).replace(' pts',''),10.4,col(C.text,.88),'semibold');p.rightAlignText();",
  "const pts=row.addStack();pts.size=new Size(42,0);pts.backgroundColor=col('#000000',.42);pts.cornerRadius=7;pts.setPadding(1,4,1,4);const p=T(pts,String(r.points).replace(' pts',''),10.7,col(C.text,1),'heavy');p.rightAlignText();"
);

globalThis.__MH_MODULE_PARAMETER=isSGT?'SUPERGT':'WEC';
await eval(code);
})();
