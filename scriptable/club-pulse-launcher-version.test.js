const fs=require('fs');
const path=require('path');
const src=fs.readFileSync(path.join(__dirname,'club-pulse.js'),'utf8');
let failed=0;
function check(name,ok){if(ok)console.log(`✓ ${name}`);else{console.error(`✗ ${name}`);failed++}}
check('launcher uses resilience v4 local cache',src.includes('ClubPulseResiliencePatch_v4.js'));
check('launcher fetch tag is resilience4',src.includes("'resilience4'"));
check('launcher pins resilience v4 commit',src.includes('bc8324f8c61b0babb6831f9187bb7c7993a2ef82'));
check('resilience remains last runtime patch',src.includes("+fp+'\\n'+q+'\\n'+r"));
if(failed){console.error(`\nLauncher version QA FAILED: ${failed}`);process.exit(1)}
console.log('\nClub Pulse launcher version QA PASSED');
