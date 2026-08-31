const fs=require('fs');
const path=require('path');
const src=fs.readFileSync(path.join(__dirname,'club-pulse.js'),'utf8');
let failed=0;
function check(name,ok){if(ok)console.log(`✓ ${name}`);else{console.error(`✗ ${name}`);failed++}}
check('launcher uses resilience v5 local cache',src.includes('ClubPulseResiliencePatch_v5.js'));
check('launcher fetch tag is resilience5',src.includes("'resilience5'"));
check('launcher pins resilience v5 commit',src.includes('56cbbf144a7bc9989694dc67baba09619bf85f51'));
check('launcher uses data policy v4 local cache',src.includes('ClubPulseDataPolicyPatch_v4.js'));
check('launcher fetch tag is data-policy4',src.includes("'data-policy4'"));
check('launcher pins data policy v4 commit',src.includes('27cee586cc8993e7ca22ec41b3f51ec9e3680b3e'));
check('data policy runs after resilience',src.includes("+fp+'\\n'+q+'\\n'+r+'\\n'+dp"));
check('patch loader remains local-first',src.includes("if(F.fileExists(file)){let s=F.readString(file);if(s&&s.length>=min)return s}"));
if(failed){console.error(`\nLauncher version QA FAILED: ${failed}`);process.exit(1)}
console.log('\nClub Pulse launcher version QA PASSED');
