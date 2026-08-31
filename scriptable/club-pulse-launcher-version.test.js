const fs=require('fs');
const path=require('path');
const src=fs.readFileSync(path.join(__dirname,'club-pulse.js'),'utf8');
let failed=0;
function check(name,ok){if(ok)console.log(`✓ ${name}`);else{console.error(`✗ ${name}`);failed++}}
check('launcher uses resilience v5 local cache',src.includes('ClubPulseResiliencePatch_v5.js'));
check('launcher fetch tag is resilience5',src.includes("'resilience5'"));
check('launcher pins resilience v5 commit',src.includes('56cbbf144a7bc9989694dc67baba09619bf85f51'));
check('launcher uses data policy v1 local cache',src.includes('ClubPulseDataPolicyPatch_v1.js'));
check('launcher fetch tag is data-policy1',src.includes("'data-policy1'"));
check('launcher pins data policy v1 commit',src.includes('2dde2b37fe6d37003070f1b83c983ec36e8c37df'));
check('data policy runs after resilience',src.includes("+fp+'\\n'+q+'\\n'+r+'\\n'+dp"));
if(failed){console.error(`\nLauncher version QA FAILED: ${failed}`);process.exit(1)}
console.log('\nClub Pulse launcher version QA PASSED');
