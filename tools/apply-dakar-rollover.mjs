import fs from 'node:fs';

function replaceOnce(source, oldText, newText, label) {
  if (!source.includes(oldText)) throw new Error(`missing patch target: ${label}`);
  return source.replace(oldText, newText);
}

let runtime = fs.readFileSync('dakar-widget.js', 'utf8');
runtime = replaceOnce(runtime,
  "const V='9.5.4-hardening',K='dakar',SEASON=2027,CACHE_SCHEMA=1,CACHE_MAX_AGE=7*86400000;",
  "const V='9.5.5-hardening',K='dakar',SEASON=2027,CACHE_SCHEMA=1,CACHE_MAX_AGE=7*86400000;",
  'runtime version');
runtime = replaceOnce(runtime,
  "'User-Agent':'Mozilla/5.0 MotorsportHub/9.5.4'",
  "'User-Agent':'Mozilla/5.0 MotorsportHub/9.5.5'",
  'runtime user agent');
runtime = replaceOnce(runtime,
  "function cache(){try{if(!fm.fileExists(CACHE))return null;const p=JSON.parse(fm.readString(CACHE)),age=Date.now()-Number(p?.fetchedAt);if(p?.schemaVersion!==CACHE_SCHEMA||p?.category!==K||Number(p?.season)!==SEASON||p?.source!=='dakar:car-overall'||!Number.isFinite(age)||age<0||age>CACHE_MAX_AGE||!validRanking(p?.ranking)||!p?.event||!validData(p?.data)){removeCache();return null}return p.data}catch(_){removeCache();return null}}",
  "function cache(expectedRankingSeason=null){try{if(!fm.fileExists(CACHE))return null;const p=JSON.parse(fm.readString(CACHE)),age=Date.now()-Number(p?.fetchedAt),cachedRankingSeason=Number(p?.data?.rankingSeason);if(p?.schemaVersion!==CACHE_SCHEMA||p?.category!==K||Number(p?.season)!==SEASON||p?.source!=='dakar:car-overall'||!Number.isFinite(age)||age<0||age>CACHE_MAX_AGE||!validRanking(p?.ranking)||!p?.event||!validData(p?.data)||(expectedRankingSeason!==null&&cachedRankingSeason!==Number(expectedRankingSeason))){removeCache();return null}return p.data}catch(_){removeCache();return null}}",
  'season-aware cache');
runtime = replaceOnce(runtime,
  "async function update(d){const ctx=rankingContext(),h=await txt(ctx.source),r=parseRanking(h);if(r.length<3)throw Error('DAKAR CAR standings');return nextStage({...d,ranking:r,rankingSeason:ctx.season,rankingLabel:ctx.label})}",
  "async function update(d,ctx=rankingContext()){const h=await txt(ctx.source),r=parseRanking(h);if(r.length<3)throw Error('DAKAR CAR standings');return nextStage({...d,ranking:r,rankingSeason:ctx.season,rankingLabel:ctx.label})}",
  'context-stable update');
runtime = replaceOnce(runtime,
  "async function load(){const base=nextStage(clone(SNAP));try{const d=await update(base);save(d);return{d,cached:false}}catch(_){const c=cache();return{d:nextStage(c||base),cached:true}}}",
  "async function load(){const base=nextStage(clone(SNAP)),ctx=rankingContext();try{const d=await update(base,ctx);save(d);return{d,cached:false}}catch(_){const c=cache(ctx.season);return{d:nextStage(c||base),cached:true}}}",
  'season-aware load');
fs.writeFileSync('dakar-widget.js', runtime);

let test = fs.readFileSync('tests/dakar-gate.mjs', 'utf8');
test = replaceOnce(test,
  "async function render(now,family='medium',heroVariant=0){",
  "async function render(now,family='medium',heroVariant=0,opts={}){",
  'render options');
test = replaceOnce(test,
  " const sink=[],files=new Map(),DateClass=FixedDateFactory(Date.parse(now)),heroRects=[];let setWidget=0,complete=0,repoRequests=0,rankingRequests=0,imageRequests=0;",
  " const sink=[],files=new Map(),DateClass=FixedDateFactory(Date.parse(now)),heroRects=[],rankingUrls=[];let setWidget=0,complete=0,repoRequests=0,rankingRequests=0,imageRequests=0;",
  'ranking URL capture');
test = replaceOnce(test,
  " files.set('/docs/motorsport-ui-v1-dakar.json',JSON.stringify({schemaVersion:1,heroVariant}));",
  " files.set('/docs/motorsport-ui-v1-dakar.json',JSON.stringify({schemaVersion:1,heroVariant}));if(opts.initialCache)files.set('/docs/motorsport-data-v950-dakar.json',JSON.stringify(opts.initialCache));",
  'cache injection');
test = replaceOnce(test,
  "rankingRequests++;return FIXTURE",
  "rankingRequests++;rankingUrls.push(this.url);if(opts.failRanking)throw Error('ranking unavailable');return opts.fixture||FIXTURE",
  'ranking request options');
test = replaceOnce(test,
  " return{sink,text:sink.join(' | '),files,heroRect:heroRects[0]};",
  " return{sink,text:sink.join(' | '),files,heroRect:heroRects[0],rankingUrls};",
  'render result');

const marker = "console.log('Motorsport Hub Dakar gate: PASS');";
if (!test.includes(marker)) throw new Error('missing Dakar test end marker');
const extra = [
  '',
  'function rolloverCache(rankingSeason,label,prefix,fetchedAt){',
  " const ranking=[1,2,3].map((pos,i)=>({pos,no:String(900+i),name:prefix+' '+String.fromCharCode(65+i),gap:pos===1?'—':'+'+i+':00',time:'4'+i+'h 00',team:'TEST',machine:'TEST'}));",
  " const data={stageId:'1',stage:'STAGE 1',start:'2027-01-02T00:00:00+03:00',end:'2027-01-03T00:00:00+03:00',dateLabel:'1/2(土)',route:'King Abdullah EC → Yanbu',routeShort:'KAEC → Yanbu',special:350,seasonEnded:false,lifecycle:'UPCOMING',rankingSeason,rankingLabel:label,ranking};",
  " return{schemaVersion:1,category:'dakar',season:2027,fetchedAt:Date.parse(fetchedAt),source:'dakar:car-overall',ranking,event:{stageId:data.stageId,stage:data.stage,start:data.start,end:data.end,route:data.route,special:data.special,seasonEnded:false,lifecycle:data.lifecycle},data};",
  '}',
  '{',
  " const r=await render('2026-12-31T12:00:00+03:00','medium');",
  " assert(r.rankingUrls.some(u=>u.includes('stage-13/auto?year=2026')),'pre-start must use 2026 final source: '+r.rankingUrls.join(','));",
  " assert(r.text.includes('2026 FINAL'));",
  '}',
  '{',
  " const r=await render('2027-01-03T00:05:00+03:00','medium');",
  " assert(r.rankingUrls.some(u=>u.includes('stage-1/auto?year=2027')),'after Stage 1 must request 2027 Stage 1 source: '+r.rankingUrls.join(','));",
  " assert(r.text.includes('2027 AFTER S1'),'2027 rollover label missing: '+r.text);",
  '}',
  '{',
  " const stale=rolloverCache(2026,'STALE 2026 CACHE','STALE-2026','2027-01-03T00:04:00+03:00');",
  " const r=await render('2027-01-03T00:05:00+03:00','medium',0,{failRanking:true,initialCache:stale});",
  " assert(!r.text.includes('STALE-2026'),'2026 ranking cache must not be reused after 2027 standings become expected');",
  " assert(r.text.includes('2026 FINAL'),'without 2027 LKG, failure must fall back transparently to embedded 2026 final');",
  " assert(!r.files.has('/docs/motorsport-data-v950-dakar.json'),'season-mismatched ranking cache must be removed');",
  '}',
  '{',
  " const lkg=rolloverCache(2027,'2027 AFTER S1','LKG-2027','2027-01-03T00:04:00+03:00');",
  " const r=await render('2027-01-03T00:05:00+03:00','medium',0,{failRanking:true,initialCache:lkg});",
  " assert(r.text.includes('LKG-2027 A'),'matching 2027 LKG must remain usable during temporary source failure');",
  " assert(r.text.includes('2027 AFTER S1'));",
  '}',
  ''
].join('\n');
test = test.replace(marker, extra+'\n'+marker);
fs.writeFileSync('tests/dakar-gate.mjs', test);
console.log('Applied Dakar 2027 rollover hardening patch.');
