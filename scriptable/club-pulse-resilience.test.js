const fs=require('fs');
const path=require('path');
const vm=require('vm');

const src=fs.readFileSync(path.join(__dirname,'club-pulse-resilience-patch.js'),'utf8');

function makeContext(mode,cached){
  let persisted=[];
  let delegated=0;
  const context={
    console,JSON,Date,
    qa:mode,
    loadData:async()=>{delegated++;return{mode:'NEXT',fetchedAt:999,stale:false}},
    errorWidget:()=>({base:true}),
    refreshDelay:()=>15*60*1000,
    readJSON:()=>cached,
    cachePath:()=>'/cache/data.json',
    cpCmNormalizeData:d=>({
      ...d,
      cacheSchema:'venue-2026-27-v1',
      nextMatch:d?.nextMatch?{...d.nextMatch,venue:d.nextMatch.venue==='会場未定'?'アリアンツ・スタジアム':d.nextMatch.venue}:d?.nextMatch
    }),
    cpCmPersist:d=>persisted.push(d),
    CP_MU_IS:()=>false,
    CP_ACTIVE_THEME:()=>null,
    club:{badge:'X',jp:'X',p:'#000',s:'#000',team:1},
    CREST_SCALE:{},
    C:()=>({}),
    badge:()=>{},heavy:()=>({rightAlignText(){},centerAlignText(){}}),text:()=>({centerAlignText(){}}),
    ListWidget:function(){this.addStack=()=>({layoutHorizontally(){},centerAlignContent(){},addSpacer(){},setPadding(){},addStack(){return this}});this.addSpacer=()=>{};this.setPadding=()=>{}},
    gradient:()=>({}),family:'medium',bg:()=>({})
  };
  context.__state={persisted,get delegated(){return delegated}};
  vm.createContext(context);
  vm.runInContext(src,context);
  return context;
}

(async()=>{
  let failed=0;
  function check(name,ok){if(ok)console.log(`✓ ${name}`);else{console.error(`✗ ${name}`);failed++}}

  const oldCache={fetchedAt:123,mode:'NEXT',nextMatch:{opponentName:'ユベントス',venue:'会場未定',homeAway:'AWAY'}};
  const offline=makeContext('offline',oldCache);
  const out=await offline.loadData('token');
  check('offline QA serves cache',out.stale===true&&out.resilience==='cache');
  check('offline QA normalizes cached venue',out.nextMatch.venue==='アリアンツ・スタジアム');
  check('offline QA stamps migrated schema',out.cacheSchema==='venue-2026-27-v1');
  check('offline QA persists migration without network',offline.__state.persisted.length===1&&offline.__state.delegated===0);
  check('stale data retries after five minutes',offline.refreshDelay(out)===5*60*1000);

  const nocache=makeContext('nocache',null);
  let threw=false;
  try{await nocache.loadData('token')}catch(e){threw=String(e.message).includes('QA forced network outage')}
  check('no-cache QA throws forced outage',threw);
  check('no-cache QA never delegates to network path',nocache.__state.delegated===0);

  const normal=makeContext('auto',oldCache);
  const normalOut=await normal.loadData('token');
  check('normal mode delegates to production loadData',normal.__state.delegated===1&&normalOut.fetchedAt===999);
  check('normal fresh cadence remains unchanged',normal.refreshDelay(normalOut)===15*60*1000);

  if(failed){console.error(`\nResilience QA FAILED: ${failed}`);process.exit(1)}
  console.log('\nClub Pulse resilience QA PASSED');
})().catch(e=>{console.error(e);process.exit(1)});
