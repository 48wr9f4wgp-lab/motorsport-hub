const fs=require('fs');
const path=require('path');
const src=fs.readFileSync(path.join(__dirname,'club-pulse.js'),'utf8');
let failed=0;
function check(name,ok){if(ok)console.log(`✓ ${name}`);else{console.error(`✗ ${name}`);failed++}}
check('launcher uses resilience v5 local cache',src.includes('ClubPulseResiliencePatch_v5.js'));
check('launcher fetch tag is resilience5',src.includes("'resilience5'"));
check('launcher pins resilience v5 commit',src.includes('56cbbf144a7bc9989694dc67baba09619bf85f51'));
check('launcher uses data policy v2 local cache',src.includes('ClubPulseDataPolicyPatch_v2.js'));
check('launcher fetch tag is data-policy2',src.includes("'data-policy2'"));
check('launcher pins data policy v2 commit',src.includes('374911db5b52a3fefb85478e739c4580fd1a3140'));
check('data policy runs after resilience',src.includes("+fp+'\\n'+q+'\\n'+r+'\\n'+dp"));
if(failed){console.error(`\nLauncher version QA FAILED: ${failed}`);process.exit(1)}
console.log('\nClub Pulse launcher version QA PASSED');
