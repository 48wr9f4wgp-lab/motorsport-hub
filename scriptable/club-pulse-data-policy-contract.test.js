const fs=require('fs');
const path=require('path');
const root=__dirname;
const launcher=fs.readFileSync(path.join(root,'club-pulse.js'),'utf8');
const policy=fs.readFileSync(path.join(root,'club-pulse-data-policy-patch.js'),'utf8');
let failed=0;
const check=(n,ok)=>{if(ok)console.log(`✓ ${n}`);else{console.error(`✗ ${n}`);failed++}};
const has=(s,x)=>s.includes(x);
try{new Function(`return (async()=>{\n${policy}\n})`);check('data policy syntax',true)}catch(e){console.error(e.message);check('data policy syntax',false)}
check('launcher pins data policy v2',has(launcher,'374911db5b52a3fefb85478e739c4580fd1a3140')&&has(launcher,'ClubPulseDataPolicyPatch_v2.js')&&has(launcher,"'data-policy2'"));
check('data policy loads after resilience',has(launcher,"+q+'\\n'+r+'\\n'+dp"));
check('adaptive refresh tiers exist',['3*60*1000','5*60*1000','15*60*1000','30*60*1000','60*60*1000'].every(x=>has(policy,x)));
check('standings cache is league-shared',has(policy,"standings_${String(club.comp||'league').toLowerCase()}.json")&&has(policy,'CP_DP_STANDINGS_TTL=30*60*1000'));
check('match fetch and standings overlay are separated',has(policy,'Promise.all([cpDpFetchMatches(t),standingsPromise])'));
check('negative next cache is reused',has(policy,"Object.prototype.hasOwnProperty.call(c,'match')")&&has(policy,'return c.match?chooseNext(d,c.match):d'));
check('expired stale LIVE is neutralized',has(policy,"d.mode==='LIVE'")&&has(policy,"kickoff+4*60*60*1000")&&has(policy,"ourScore:null,opponentScore:null")&&has(policy,"liveExpired:true"));
check('forced outage remains delegated to resilience',has(policy,'return cpDpSanitizeStale(await CP_DP_BASE_LOAD_DATA(t))'));
check('small stale-next parity guard exists',has(policy,'CP_DP_BASE_BUILD_MATCH_SMALL=buildMatchSmall')&&has(policy,"mode:'STALE_NEXT'")&&has(policy,"return'更新待ち'")&&has(policy,"return'VS'"));
check('small stale-next metadata remains kickoff plus venue',has(policy,"return`${m.kickoff} ・ ${m.venue}`"));
if(failed){console.error(`\nData policy contract QA FAILED: ${failed}`);process.exit(1)}
console.log('\nClub Pulse data policy contract QA PASSED');
