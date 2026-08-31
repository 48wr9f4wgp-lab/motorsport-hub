const fs=require('fs');
const path=require('path');
const src=fs.readFileSync(path.join(__dirname,'club-pulse.js'),'utf8');
let failed=0;
function check(name,ok){if(ok)console.log(`✓ ${name}`);else{console.error(`✗ ${name}`);failed++}}
check('launcher pins core to immutable commit',src.includes('30a2b7f1b5c58d4ffa7e91047b637692c3cac7ce/scriptable/club-pulse-core.js'));
check('launcher uses core v2 local cache',src.includes('ClubPulseCore_v2.js')&&src.includes("CORE+'?v=core2'"));
check('launcher uses resilience v6 local cache',src.includes('ClubPulseResiliencePatch_v6.js'));
check('launcher fetch tag is resilience6',src.includes("'resilience6'"));
check('launcher pins resilience v6 commit',src.includes('968fd0308afd6ea0998d8317357d86af9d8aa0c3'));
check('launcher uses data policy v6 local cache',src.includes('ClubPulseDataPolicyPatch_v6.js'));
check('launcher fetch tag is data-policy6',src.includes("'data-policy6'"));
check('launcher pins data policy v6 commit',src.includes('c274078e2cd1742a61fe9c3548d54f703a84ebc5'));
check('launcher uses small presentation v2 local cache',src.includes('ClubPulseSmallPresentationPatch_v2.js'));
check('launcher fetch tag is small-presentation2',src.includes("'small-presentation2'"));
check('launcher pins small presentation v2 commit',src.includes('52ff2fbabfd2f518293b2745ab6e3931d4421c73'));
check('small presentation runs after resilience and data policy',src.includes("+q+'\\n'+r+'\\n'+dp+'\\n'+sp"));
check('patch loader remains local-first',src.includes("if(F.fileExists(file)){let s=F.readString(file);if(s&&s.length>=min)return s}"));
if(failed){console.error(`\nLauncher version QA FAILED: ${failed}`);process.exit(1)}
console.log('\nClub Pulse launcher version QA PASSED');