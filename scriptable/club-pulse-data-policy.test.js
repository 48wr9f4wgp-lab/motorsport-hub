const fs=require('fs');
const path=require('path');
const vm=require('vm');

const src=fs.readFileSync(path.join(__dirname,'club-pulse-data-policy-patch.js'),'utf8');

function makeContext({now=Date.now(),mode='NEXT',kickoffMs=now+72*3600e3,cachedAge=10*60e3,nextCache=null}={}){
  const realDate=Date;
  class FakeDate extends realDate{
    constructor(v){super(v===undefined?now:v)}
    static now(){return now}
  }
  let apiCalls=[],baseNextCalls=0,writes=[];
  const cached={
    fetchedAt:now-cachedAge,mode,rank:9,points:12,stale:false,
    nextMatch:{utcDate:new realDate(kickoffMs).toISOString(),kickoff:'9/1(火) 04:00',venue:'テスト会場',opponentName:'X'},
    liveMatch:mode==='LIVE'?{utcDate:new realDate(kickoffMs).toISOString(),kickoff:'9/1(火) 04:00',venue:'テスト会場',ourScore:2,opponentScore:1,minute:"67'"}:null,
    recentResult:mode==='POST'?{utcDate:new realDate(kickoffMs).toISOString(),kickoff:'9/1(火) 04:00',venue:'テスト会場',ourScore:2,opponentScore:1}:null
  };
  const standings={standings:[{type:'TOTAL',table:[{team:{id:66},position:4,points:21}]}]};
  const ctx={
    console,JSON,Object,Date:FakeDate,
    club:{comp:'PL',team:66},
    loadData:async()=>({...cached,stale:true,resilience:'cache'}),
    applyNextOverlay:async d=>{baseNextCalls++;return{...d,baseNext:true}},
    refreshDelay:()=>15*60e3,
    buildMatchSmall:(w,d)=>d,
    statusTitle:(d)=>d.mode==='LIVE'?'試合中':d.mode==='POST'?'試合終了':'次の試合',
    centerMainText:(d)=>d.mode==='NEXT'?'VS':'2-1',
    metaLine:(d,m)=>d.mode==='NEXT'?`${m.kickoff} ・ ${m.venue}`:`${m.venue}`,
    cpResForcedOutage:()=>false,
    cpCmNormalizeData:d=>d,
    readJSON:p=>{
      if(String(p).includes('standings_'))return{fetchedAt:now-5*60e3,payload:standings};
      if(String(p).includes('next_all_'))return nextCache;
      if(String(p).includes('data_'))return cached;
      return null
    },
    writeJSON:(p,v)=>writes.push({p,v}),
    path:n=>`/cache/${n}`,
    cachePath:()=>'/cache/data_manutd.json',
    nextPath:()=>'/cache/next_all_manutd.json',
    NEXT_TTL:6*3600e3,
    addDays:(d,n)=>new realDate(d.getTime()+n*864e5),
    ymd:d=>d.toISOString().slice(0,10),
    api:async p=>{apiCalls.push(p);if(p.includes('/matches?'))return{matches:[]};if(p.includes('/standings'))return standings;throw new Error('unexpected')},
    standing:sj=>sj?.standings?.[0]?.table?.[0]||null,
    mapData:(m,sj)=>({fetchedAt:now,mode:'NEXT',rank:sj?.standings?.[0]?.table?.[0]?.position??null,points:sj?.standings?.[0]?.table?.[0]?.points??null,nextMatch:{utcDate:new realDate(kickoffMs).toISOString(),kickoff:'9/1(火) 04:00',venue:'テスト会場'}}),
    chooseNext:(d,m)=>({...d,nextMatch:m,chosen:true})
  };
  ctx.__state={apiCalls,writes,get baseNextCalls(){return baseNextCalls},cached};
  vm.createContext(ctx);vm.runInContext(src,ctx);return ctx
}

(async()=>{
  let failed=0;
  const check=(n,ok)=>{if(ok)console.log(`✓ ${n}`);else{console.error(`✗ ${n}`);failed++}};

  let c=makeContext();
  check('far fixture cadence is one hour',c.refreshDelay(c.__state.cached)===60*60e3);
  let out=await c.loadData('t');
  check('far fresh match cache avoids match request',!c.__state.apiCalls.some(x=>x.includes('/matches?')));
  check('shared standings overlay updates rank and points',out.rank===4&&out.points===21);

  c=makeContext({kickoffMs:Date.now()+20*60e3,cachedAge:4*60e3});
  out=await c.loadData('t');
  check('near kickoff cache older than three minutes refreshes match data',c.__state.apiCalls.some(x=>x.includes('/matches?')));
  check('near kickoff cadence is three minutes',c.refreshDelay(out)===3*60e3);

  const now=Date.now();
  c=makeContext({now,nextCache:{fetchedAt:now-60*60e3,match:null}});
  out=await c.applyNextOverlay(c.__state.cached);
  check('negative next-fixture cache suppresses repeated provider call',c.__state.baseNextCalls===0&&!out.baseNext);

  c=makeContext({now,mode:'LIVE',kickoffMs:now-5*3600e3,cachedAge:5*60e3});
  c.cpResForcedOutage=()=>true;
  out=await c.loadData('t');
  check('expired stale LIVE degrades to neutral NEXT/update-waiting state',out.mode==='NEXT'&&out.liveExpired===true&&out.nextMatch.ourScore===null&&out.nextMatch.opponentScore===null);
  check('stale data retries after five minutes',c.refreshDelay({...out,stale:true})===5*60e3);

  c=makeContext({now,kickoffMs:now-60*1000});
  const staleNext={...c.__state.cached,stale:true};
  const smallState=c.buildMatchSmall(null,staleNext,{});
  check('small stale NEXT switches to synthetic waiting state',smallState.mode==='STALE_NEXT'&&smallState.cpSmallWaiting===true);
  check('small stale NEXT label is update waiting',c.statusTitle(smallState,smallState.nextMatch)==='更新待ち');
  check('small stale NEXT keeps neutral VS center',c.centerMainText(smallState,smallState.nextMatch)==='VS');
  check('small stale NEXT keeps kickoff and venue metadata',c.metaLine(smallState,smallState.nextMatch)==='9/1(火) 04:00 ・ テスト会場');

  if(failed){console.error(`\nData policy QA FAILED: ${failed}`);process.exit(1)}
  console.log('\nClub Pulse data policy QA PASSED')
})().catch(e=>{console.error(e);process.exit(1)});
