const fs=require('fs');
const path=require('path');
const src=fs.readFileSync(path.join(__dirname,'club-pulse.js'),'utf8');
let failed=0;
function check(name,ok){if(ok)console.log(`✓ ${name}`);else{console.error(`✗ ${name}`);failed++}}
check('launcher uses resilience v3 local cache',src.includes('ClubPulseResiliencePatch_v3.js'));
check('launcher fetch tag is resilience3',src.includes("'resilience3'"));
check('launcher pins resilience v3 commit',src.includes('26d95cbbdf1b8f759f3b1e30beb269e4b6698f88'));
check('resilience remains last runtime patch',src.includes("+fp+'\\n'+q+'\\n'+r"));
if(failed){console.error(`\nLauncher version QA FAILED: ${failed}`);process.exit(1)}
console.log('\nClub Pulse launcher version QA PASSED');
